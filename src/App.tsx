import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CreateRecord from './pages/CreateRecord';
import SearchRecord from './pages/SearchRecord';
import EditRecord from './pages/EditRecord';
import ViewRecord from './pages/ViewRecord';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create" element={<CreateRecord />} />
          <Route path="/search" element={<SearchRecord />} />
          <Route path="/records/:id" element={<ViewRecord />} />
          <Route path="/records/:id/edit" element={<EditRecord />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
