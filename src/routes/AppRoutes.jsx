import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import ProtectedRoute from './ProtectedRoute';
import { ProductProvider } from '../contexts/ProductContext';
import { InventoryProvider } from '../contexts/InventoryContext';
import { PageLoader } from '../components/loaders/skeletons';

const Login = lazy(() => import('../pages/Auth/Login'));
const Register = lazy(() => import('../pages/Auth/Register'));
const Dashboard = lazy(() => import('../pages/Dashboard/Dashboard'));
const Products = lazy(() => import('../pages/Products/Products'));
const ProductDetail = lazy(() => import('../pages/Products/ProductDetail'));
const Categories = lazy(() => import('../pages/Categories/Categories'));
const Suppliers = lazy(() => import('../pages/Suppliers/Suppliers'));
const Warehouses = lazy(() => import('../pages/Warehouses/Warehouses'));
const Profile = lazy(() => import('../pages/Profile/Profile'));
const Settings = lazy(() => import('../pages/Settings/Settings'));
const NotFound = lazy(() => import('../pages/Auth/NotFound'));

function AuthenticatedApp() {
  return (
    <ProductProvider>
      <InventoryProvider>
        <AppLayout />
      </InventoryProvider>
    </ProductProvider>
  );
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AuthenticatedApp />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/warehouses" element={<Warehouses />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
