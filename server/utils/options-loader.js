import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to read options from JSON files
export function loadOptions(optionType) {
  try {
    const filePath = join(__dirname, '..', 'data', `${optionType}-options.json`);
    const fileContent = readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error loading ${optionType} options:`, error.message);
    // Return fallback options if file reading fails
    return getFallbackOptions(optionType);
  }
}

// Fallback options in case files are missing or corrupted
function getFallbackOptions(optionType) {
  const fallbacks = {
    'genre': ['literature', 'language', 'new testament', 'old testament', 'magazine', 'apocrypha', 'academic'],
    'dialect': ['urmi', 'standard', 'other'],
    'source': ['private', 'online', 'published']
  };
  
  return fallbacks[optionType] || [];
}

// Function to reload options (useful for hot-reloading during development)
export function reloadOptions() {
  // Clear require cache if needed (not applicable for ES modules, but kept for reference)
  console.log('Options reloaded from files');
}
