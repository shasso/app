import Joi from 'joi';

/**
 * Extensible Search System for Metadata Records
 * 
 * This system uses the Strategy pattern to allow for flexible and extensible search capabilities.
 * New search fields can be easily added by updating the searchableFields configuration.
 */

// Configuration for searchable fields
export const searchableFields = {
  id: {
    path: 'id',
    type: 'exact',
    label: 'Record ID',
    description: 'Search by exact record ID (UUID)',
    validation: Joi.string().uuid()
  },
  title: {
    path: 'metadata.title',
    type: 'text',
    label: 'Title',
    description: 'Search in record title',
    validation: Joi.string().min(1).max(500)
  },
  subtitle: {
    path: 'metadata.subtitle',
    type: 'text',
    label: 'Subtitle', 
    description: 'Search in record subtitle',
    validation: Joi.string().min(1).max(500)
  },
  authors: {
    path: 'metadata.authors',
    type: 'array',
    label: 'Authors',
    description: 'Search in authors list',
    validation: Joi.string().min(1).max(500)
  },
  genre: {
    path: 'metadata.genre',
    type: 'exact',
    label: 'Genre',
    description: 'Search by exact genre match',
    validation: Joi.string().min(1)
  },
  country: {
    path: 'metadata.country',
    type: 'text',
    label: 'Country',
    description: 'Search in country field',
    validation: Joi.string().min(1).max(500)
  },
  year: {
    path: 'metadata.pub_date',
    type: 'number',
    label: 'Publication Year',
    description: 'Search by publication year',
    validation: Joi.number().integer().min(1000).max(new Date().getFullYear())
  },
  // Future extensibility - just add new fields here
  // editor: {
  //   path: 'metadata.editor',
  //   type: 'text',
  //   label: 'Editor',
  //   description: 'Search in editor field',
  //   validation: Joi.string().min(1).max(500)
  // },
  // dialect: {
  //   path: 'metadata.dialect', 
  //   type: 'exact',
  //   label: 'Dialect',
  //   description: 'Search by exact dialect match',
  //   validation: Joi.string().min(1)
  // }
};

/**
 * Search Strategy Classes
 */
class SearchStrategy {
  constructor(fieldConfig) {
    this.fieldConfig = fieldConfig;
  }

  buildQuery(value) {
    throw new Error('buildQuery method must be implemented');
  }

  validateValue(value) {
    const { error } = this.fieldConfig.validation.validate(value);
    return { isValid: !error, error: error?.details[0]?.message };
  }
}

class ExactSearchStrategy extends SearchStrategy {
  buildQuery(value) {
    return { [this.fieldConfig.path]: value };
  }
}

class TextSearchStrategy extends SearchStrategy {
  buildQuery(value) {
    const regex = new RegExp(value.trim(), 'i'); // Case-insensitive
    return { [this.fieldConfig.path]: regex };
  }
}

class ArraySearchStrategy extends SearchStrategy {
  buildQuery(value) {
    const regex = new RegExp(value.trim(), 'i'); // Case-insensitive
    return { [this.fieldConfig.path]: { $elemMatch: { $regex: regex } } };
  }
}

class NumberSearchStrategy extends SearchStrategy {
  buildQuery(value) {
    const numValue = parseInt(value);
    return { [this.fieldConfig.path]: numValue };
  }
}

class RangeSearchStrategy extends SearchStrategy {
  buildQuery(value) {
    // Support range searches like "2020-2023" or single year
    if (value.includes('-')) {
      const [start, end] = value.split('-').map(v => parseInt(v.trim()));
      return { 
        [this.fieldConfig.path]: { 
          $gte: start, 
          $lte: end 
        } 
      };
    } else {
      const numValue = parseInt(value);
      return { [this.fieldConfig.path]: numValue };
    }
  }
}

/**
 * Strategy Factory
 */
class SearchStrategyFactory {
  static createStrategy(fieldConfig) {
    switch (fieldConfig.type) {
      case 'exact':
        return new ExactSearchStrategy(fieldConfig);
      case 'text':
        return new TextSearchStrategy(fieldConfig);
      case 'array':
        return new ArraySearchStrategy(fieldConfig);
      case 'number':
        return new NumberSearchStrategy(fieldConfig);
      case 'range':
        return new RangeSearchStrategy(fieldConfig);
      default:
        throw new Error(`Unknown search type: ${fieldConfig.type}`);
    }
  }
}

/**
 * Main Search Engine
 */
export class MetadataSearchEngine {
  constructor(database) {
    this.db = database;
    this.strategies = new Map();
    this.initializeStrategies();
  }

  initializeStrategies() {
    Object.entries(searchableFields).forEach(([fieldName, fieldConfig]) => {
      const strategy = SearchStrategyFactory.createStrategy(fieldConfig);
      this.strategies.set(fieldName, strategy);
    });
  }

  /**
   * Get list of searchable fields for API documentation
   */
  getSearchableFields() {
    const fields = {};
    Object.entries(searchableFields).forEach(([fieldName, config]) => {
      fields[fieldName] = {
        label: config.label,
        description: config.description,
        type: config.type
      };
    });
    return fields;
  }

  /**
   * Validate search parameters
   */
  validateSearchParams(searchParams) {
    const errors = [];
    const validParams = {};

    Object.entries(searchParams).forEach(([fieldName, value]) => {
      if (!searchableFields[fieldName]) {
        errors.push(`Unknown search field: ${fieldName}`);
        return;
      }

      const strategy = this.strategies.get(fieldName);
      const validation = strategy.validateValue(value);
      
      if (!validation.isValid) {
        errors.push(`Invalid value for ${fieldName}: ${validation.error}`);
      } else {
        validParams[fieldName] = value;
      }
    });

    return { isValid: errors.length === 0, errors, validParams };
  }

  /**
   * Build MongoDB query from search parameters
   */
  buildSearchQuery(searchParams) {
    const queries = [];

    Object.entries(searchParams).forEach(([fieldName, value]) => {
      const strategy = this.strategies.get(fieldName);
      if (strategy) {
        const query = strategy.buildQuery(value);
        queries.push(query);
      }
    });

    if (queries.length === 0) {
      return {};
    } else if (queries.length === 1) {
      return queries[0];
    } else {
      return { $and: queries };
    }
  }

  /**
   * Execute search
   */
  async search(searchParams, options = {}) {
    try {
      // Validate parameters
      const validation = this.validateSearchParams(searchParams);
      if (!validation.isValid) {
        return {
          success: false,
          errors: validation.errors
        };
      }

      // Build query
      const query = this.buildSearchQuery(validation.validParams);
      
      // Execute search with options
      const { limit = 100, skip = 0, sort = {} } = options;
      
      const results = await this.db.collection('metadata')
        .find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .toArray();

      const totalCount = await this.db.collection('metadata').countDocuments(query);

      return {
        success: true,
        query: validation.validParams,
        mongoQuery: query,
        results,
        totalCount,
        returnedCount: results.length,
        hasMore: (skip + results.length) < totalCount
      };

    } catch (error) {
      console.error('Search error:', error);
      return {
        success: false,
        errors: ['Internal search error']
      };
    }
  }

  /**
   * Add new searchable field (for runtime extensibility)
   */
  addSearchableField(fieldName, fieldConfig) {
    searchableFields[fieldName] = fieldConfig;
    const strategy = SearchStrategyFactory.createStrategy(fieldConfig);
    this.strategies.set(fieldName, strategy);
  }
}

export default MetadataSearchEngine;
