// src/components/hospital/HospitalDashboard.jsx
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchRequests } from '../../redux/slices/requestSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import { PlusCircle, FileText, Search, AlertCircle } from 'lucide-react';

export default function HospitalDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { list: requests, isLoading } = useSelector((state) => state.requests);

  useEffect(() => {
    dispatch(fetchRequests());
  }, [dispatch]);

  const myRequests = requests.slice(0, 5);
  const openRequests = requests.filter(r => r.status === 'Open').length;
  const fulfilledRequests = requests.filter(r => r.status === 'Fulfilled').length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Hospital Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.full_name}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Requests</p>
                <p className="text-3xl font-bold mt-2">{requests.length}</p>
              </div>
              <FileText className="w-12 h-12 text-blue-200" />
            </div>
          </div>

          <div className="card bg-gradient-to-r from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Open Requests</p>
                <p className="text-3xl font-bold mt-2">{openRequests}</p>
              </div>
              <AlertCircle className="w-12 h-12 text-green-200" />
            </div>
          </div>

          <div className="card bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Fulfilled</p>
                <p className="text-3xl font-bold mt-2">{fulfilledRequests}</p>
              </div>
              <FileText className="w-12 h-12 text-purple-200" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/hospital/create-request" className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="bg-primary-100 p-3 rounded-lg">
                <PlusCircle className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Create Request</h3>
                <p className="text-sm text-gray-600">Post a new blood requirement</p>
              </div>
            </div>
          </Link>

          <Link to="/hospital/my-requests" className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">My Requests</h3>
                <p className="text-sm text-gray-600">View and manage requests</p>
              </div>
            </div>
          </Link>

          <Link to="/search-donors" className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Search className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Search Donors</h3>
                <p className="text-sm text-gray-600">Find blood donors</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Requests */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Requests</h2>
            <Link to="/hospital/my-requests" className="text-primary-600 hover:text-primary-700 font-medium">
              View All →
            </Link>
          </div>

          {isLoading ? (
            <LoadingSpinner />
          ) : myRequests.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No requests yet</p>
              <Link to="/hospital/create-request" className="btn-primary mt-4 inline-flex items-center space-x-2">
                <PlusCircle className="w-4 h-4" />
                <span>Create First Request</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {myRequests.map((request) => (
                <div key={request.request_id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`badge ${
                          request.urgency === 'Critical' ? 'badge-danger' :
                          request.urgency === 'Urgent' ? 'badge-warning' : 'badge-info'
                        }`}>
                          {request.urgency}
                        </span>
                        <span className="font-semibold text-lg text-gray-900">
                          {request.blood_group} - {request.units_required} units
                        </span>
                      </div>
                      <p className="text-gray-700">Patient: {request.patient_name}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Required by: {new Date(request.required_by).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`badge ${request.status === 'Open' ? 'badge-success' : 'badge-info'}`}>
                      {request.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}