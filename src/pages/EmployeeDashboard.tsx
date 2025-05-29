
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/common/Layout';
import Dashboard from '../components/employee/Dashboard';
import NewOrderForm from '../components/employee/NewOrderForm';
import ScanItems from '../components/employee/ScanItems';
import SearchOrder from '../components/employee/SearchOrder';
const EmployeeDashboard: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={
        <Layout title="Dashboard">
          <Dashboard />
        </Layout>
      } />
      <Route path="/new-order" element={
        <Layout title="Comandă Nouă">
          <NewOrderForm />
        </Layout>
      } />
      <Route path="/scan" element={
        <Layout title="Scanare Articole">
          <ScanItems />
        </Layout>
      } />
      <Route path="/search" element={
        <Layout title="Căutare Comandă">
            <SearchOrder />
        </Layout>
      } />
    </Routes>
  );
};

export default EmployeeDashboard;