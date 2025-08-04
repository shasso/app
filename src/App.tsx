import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CreateRecord from './pages/CreateRecord';
import SearchRecord from './pages/SearchRecord';
import EditRecord from './pages/EditRecord';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create" element={<CreateRecord />} />
          <Route path="/search" element={<SearchRecord />} />
          <Route path="/edit/:id" element={<EditRecord />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
