import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import AdminLayout from '../components/layout/AdminLayout';
import Login from '../pages/Login/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import CollectionsList from '../pages/Collections/CollectionsList';
import CollectionForm from '../pages/Collections/CollectionForm';
import CategoriesList from '../pages/Categories/CategoriesList';
import CategoryDetail from '../pages/Categories/CategoryDetail';
import EnquiriesList from '../pages/Enquiries/EnquiriesList';
import Profile from '../pages/Profile/Profile';
import NotFound from '../pages/NotFound/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/collections" element={<CollectionsList />} />
                <Route path="/collections/create" element={<CollectionForm />} />
                <Route path="/collections/:id/edit" element={<CollectionForm />} />
                <Route path="/categories" element={<CategoriesList />} />
                <Route path="/categories/:id" element={<CategoryDetail />} />
                <Route path="/enquiries" element={<EnquiriesList />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
