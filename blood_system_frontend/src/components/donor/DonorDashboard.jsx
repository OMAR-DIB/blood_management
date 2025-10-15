// src/components/donor/DonorDashboard.jsx
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getProfile } from '../../redux/slices/authSlice';
import { fetchRequests } from '../../redux/slices/requestSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import { Droplet, Calendar, MapPin, AlertCircle, User, FileText } from 'lucide-react';

export default function DonorDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { list: requests, isLoading } = useSelector((state) => state.requests);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      const result = await dispatch(getProfile());
      if (result.payload) {
        setProfile(result.payload);
      }
    };
    loadProfile();
    
    // Fetch urgent requests
    dispatch(fetchRequests({ status: 'Open', urgency: 'Critical' }));
  }, [dispatch]);

  const urgentRequests = requests.filter(req => req.urgency === 'Critical').slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.full_name}!</h1>
          <p className="text-gray-600 mt-2">Manage your donor profile and view blood requests</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-r from-primary-500 to-primary-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-100 text-sm">Your Blood Group</p>
                <p className="text-3xl font-bold mt-2">{profile?.blood_group || 'N/A'}</p>
              </div>
              <Droplet className="w-12 h-12 text-primary-200" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Availability Status</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {profile?.is_available ? 'Available' : 'Not Available'}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${profile?.is_available ? 'bg-green-100' : 'bg-yellow-100'}`}>
                <User className={`w-6 h-6 ${profile?.is_available ? 'text-green-600' : 'text-yellow-600'}`} />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Last Donation</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {profile?.last_donation_date 
                    ? new Date(profile.last_donation_date).toLocaleDateString()
                    : 'Never'}
                </p>
              </div>
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/donor/profile" className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="bg-primary-100 p-3 rounded-lg">
                <User className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">My Profile</h3>
                <p className="text-sm text-gray-600">Update your information</p>
              </div>
            </div>
          </Link>

          <Link to="/donor/requests" className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Blood Requests</h3>
                <p className="text-sm text-gray-600">View all requests</p>
              </div>
            </div>
          </Link>

          <Link to="/search-donors" className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Droplet className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Find Donors</h3>
                <p className="text-sm text-gray-600">Search blood donors</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Urgent Requests */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Urgent Blood Requests</h2>
            <Link to="/donor/requests" className="text-primary-600 hover:text-primary-700 font-medium">
              View All →
            </Link>
          </div>

          {isLoading ? (
            <LoadingSpinner />
          ) : urgentRequests.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No urgent requests at the moment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {urgentRequests.map((request) => (
                <div key={request.request_id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="badge-danger">CRITICAL</span>
                        <span className="font-semibold text-lg text-gray-900">
                          {request.blood_group}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {request.hospital_name}
                      </h3>
                      <div className="flex items-center text-gray-600 text-sm mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{request.city}, {request.state}</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        Patient: {request.patient_name} | Units needed: {request.units_required}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Contact: {request.contact_person} - {request.contact_phone}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Required by</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(request.required_by).toLocaleDateString()}
                      </p>
                    </div>
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
