import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/common/Layout';
import Dashboard from '../components/admin/Dashboard';
import OrdersList from '../components/admin/OrdersList';
import Reports from '../components/admin/Reports';

const AdminDashboard: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={
        <Layout title="Dashboard Administrator">
          <Dashboard />
        </Layout>
      } />
      <Route path="/orders" element={
        <Layout title="Toate Comenzile">
          <OrdersList />
        </Layout>
      } />
      <Route path="/reports" element={
        <Layout title="Rapoarte">
          <Reports />
        </Layout>
      } />
      <Route path="/employees" element={
        <Layout title="Angajați">
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              <p className="text-gray-500">Gestionare angajați va fi aici</p>
            </div>
          </div>
        </Layout>
      } />
      <Route path="/settings" element={
        <Layout title="Setări">
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              <p className="text-gray-500">Setări aplicație vor fi aici</p>
            </div>
          </div>
        </Layout>
      } />
    </Routes>
  );
};

export default AdminDashboard;