// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Settings from './components/common/Settings';
import Home from './components/public/Home';
import SearchDonors from './components/public/SearchDonors';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DonorDashboard from './components/donor/DonorDashboard';
import DonorProfile from './components/donor/DonorProfile';
import AvailableRequests from './components/donor/AvailableRequests';
import MyResponses from './components/donor/MyResponses';
import HospitalDashboard from './components/hospital/HospitalDashboard';
import CreateRequest from './components/hospital/CreateRequest';
import MyRequests from './components/hospital/MyRequests';
import AdminDashboard from './components/admin/AdminDashboard';
import ManageDonors from './components/admin/ManageDonors';
import ManageRequests from './components/admin/ManageRequests';
import Reports from './components/admin/Reports';

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/search-donors" element={<SearchDonors />} />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to={`/${user?.role}`} /> : <Login />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to={`/${user?.role}`} /> : <Register />}
          />

          {/* Donor Routes */}
          <Route
            path="/donor"
            element={
              <ProtectedRoute allowedRoles={['donor']}>
                <DonorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/donor/profile"
            element={
              <ProtectedRoute allowedRoles={['donor']}>
                <DonorProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/donor/requests"
            element={
              <ProtectedRoute allowedRoles={['donor']}>
                <AvailableRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/donor/my-responses"
            element={
              <ProtectedRoute allowedRoles={['donor']}>
                <MyResponses />
              </ProtectedRoute>
            }
          />

          {/* Hospital Routes */}
          <Route
            path="/hospital"
            element={
              <ProtectedRoute allowedRoles={['hospital']}>
                <HospitalDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hospital/create-request"
            element={
              <ProtectedRoute allowedRoles={['hospital']}>
                <CreateRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hospital/my-requests"
            element={
              <ProtectedRoute allowedRoles={['hospital']}>
                <MyRequests />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/donors"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageDonors />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/requests"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Reports />
              </ProtectedRoute>
            }
          />

          {/* Settings Route - Available for all authenticated users */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={['donor', 'hospital', 'admin']}>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;