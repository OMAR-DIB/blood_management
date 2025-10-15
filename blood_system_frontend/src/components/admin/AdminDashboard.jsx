// src/components/admin/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import { Users, Droplet, FileText, TrendingUp, BarChart3 } from 'lucide-react';
import api from '../../redux/api/apiClient';
import LoadingSpinner from '../common/LoadingSpinner';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [statistics, setStatistics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await api.get('/admin/statistics');
        setStatistics(response.data.statistics);
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStatistics();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const stats = statistics?.totalCounts || {};
  const donorsByBloodGroup = statistics?.donorsByBloodGroup || [];
  const requestsByStatus = statistics?.requestsByStatus || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">System overview and management</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Users</p>
                <p className="text-3xl font-bold mt-2">{stats.total_users || 0}</p>
              </div>
              <Users className="w-12 h-12 text-blue-200" />
            </div>
          </div>

          <div className="card bg-gradient-to-r from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Available Donors</p>
                <p className="text-3xl font-bold mt-2">{stats.total_available_donors || 0}</p>
              </div>
              <Droplet className="w-12 h-12 text-green-200" />
            </div>
          </div>

          <div className="card bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Open Requests</p>
                <p className="text-3xl font-bold mt-2">{stats.open_requests || 0}</p>
              </div>
              <FileText className="w-12 h-12 text-yellow-200" />
            </div>
          </div>

          <div className="card bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Fulfilled</p>
                <p className="text-3xl font-bold mt-2">{stats.fulfilled_requests || 0}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-purple-200" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Link to="/admin/donors" className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Donors</h3>
                <p className="text-sm text-gray-600">View all donors</p>
              </div>
            </div>
          </Link>

          <Link to="/admin/requests" className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Requests</h3>
                <p className="text-sm text-gray-600">View all requests</p>
              </div>
            </div>
          </Link>

          <Link to="/admin/reports" className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Reports</h3>
                <p className="text-sm text-gray-600">Generate reports</p>
              </div>
            </div>
          </Link>

          <Link to="/search-donors" className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Droplet className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Search Donors</h3>
                <p className="text-sm text-gray-600">Find blood donors</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Donors by Blood Group */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Donors by Blood Group</h2>
            <div className="space-y-3">
              {donorsByBloodGroup.map((item) => (
                <div key={item.blood_group} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="font-bold text-primary-600">{item.blood_group}</span>
                    </div>
                    <span className="text-gray-700">Blood Group {item.blood_group}</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{item.donor_count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Requests by Status */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Requests by Status</h2>
            <div className="space-y-4">
              {requestsByStatus.map((item) => (
                <div key={item.status}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700 font-medium">{item.status}</span>
                    <span className="text-lg font-bold text-gray-900">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        item.status === 'Open' ? 'bg-green-500' :
                        item.status === 'Fulfilled' ? 'bg-blue-500' : 'bg-gray-500'
                      }`}
                      style={{
                        width: `${(item.count / requestsByStatus.reduce((sum, r) => sum + r.count, 0)) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
