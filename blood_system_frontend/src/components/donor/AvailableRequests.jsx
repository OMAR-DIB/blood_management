// src/components/donor/AvailableRequests.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRequests } from '../../redux/slices/requestSlice';
import { getProfile } from '../../redux/slices/authSlice';
import { canDonate } from '../../utils/bloodCompatibility';
import LoadingSpinner from '../common/LoadingSpinner';
import RespondToRequestModal from './RespondToRequestModal';
import { MapPin, Calendar, Phone, AlertCircle, Filter, Heart, Info } from 'lucide-react';

export default function AvailableRequests() {
  const dispatch = useDispatch();
  const { list: requests, isLoading } = useSelector((state) => state.requests);
  const { user } = useSelector((state) => state.auth);
  const [donorBloodGroup, setDonorBloodGroup] = useState(null);
  const [filters, setFilters] = useState({
    status: 'Open',
    urgency: '',
    blood_group: '',
    city: ''
  });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Fetch donor's blood group from profile
    dispatch(getProfile()).then((result) => {
      if (result.payload && result.payload.profile) {
        setDonorBloodGroup(result.payload.profile.blood_group);
      }
    });
    dispatch(fetchRequests(filters));
  }, []);

  // Filter requests based on blood compatibility
  const compatibleRequests = requests.filter((request) => {
    if (!donorBloodGroup) return true; // Show all if blood group not loaded yet
    return canDonate(donorBloodGroup, request.blood_group);
  });

  const incompatibleCount = requests.length - compatibleRequests.length;

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchRequests(filters));
  };

  const getUrgencyBadge = (urgency) => {
    const badges = {
      Critical: 'badge-danger',
      Urgent: 'badge-warning',
      Normal: 'badge-info'
    };
    return badges[urgency] || 'badge-info';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Blood Requests</h1>
          <p className="text-gray-600 mt-2">View and respond to blood donation requests</p>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="input-field"
              >
                <option value="">All</option>
                <option value="Open">Open</option>
                <option value="Fulfilled">Fulfilled</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urgency
              </label>
              <select
                name="urgency"
                value={filters.urgency}
                onChange={handleFilterChange}
                className="input-field"
              >
                <option value="">All</option>
                <option value="Critical">Critical</option>
                <option value="Urgent">Urgent</option>
                <option value="Normal">Normal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blood Group
              </label>
              <input
                type="text"
                name="blood_group"
                value={filters.blood_group}
                onChange={handleFilterChange}
                placeholder="e.g., O+"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                placeholder="Enter city"
                className="input-field"
              />
            </div>

            <div className="flex items-end">
              <button type="submit" className="btn-primary w-full">
                Apply Filters
              </button>
            </div>
          </form>
        </div>

        {/* Info Banner */}
        {donorBloodGroup && incompatibleCount > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-900 font-semibold">Your blood type: {donorBloodGroup}</p>
              <p className="text-sm text-blue-700 mt-1">
                Showing only compatible requests. {incompatibleCount} request(s) hidden due to blood type incompatibility.
              </p>
            </div>
          </div>
        )}

        {/* Requests List */}
        {isLoading ? (
          <LoadingSpinner />
        ) : compatibleRequests.length === 0 ? (
          <div className="card text-center py-12">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">No compatible blood requests found</p>
            <p className="text-gray-500 mt-2">
              {requests.length > 0
                ? `${requests.length} request(s) available but incompatible with your blood type (${donorBloodGroup})`
                : 'Try adjusting your filters'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {compatibleRequests.map((request) => (
              <div key={request.request_id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`badge ${getUrgencyBadge(request.urgency)}`}>
                        {request.urgency}
                      </span>
                      <span className="text-2xl font-bold text-primary-600">
                        {request.blood_group}
                      </span>
                      <span className="text-gray-600">
                        {request.units_required} units needed
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {request.hospital_name}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{request.city}, {request.state}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <span>Required by: {new Date(request.required_by).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{request.contact_person}: {request.contact_phone}</span>
                      </div>
                    </div>

                    {request.description && (
                      <p className="mt-3 text-gray-700 text-sm">
                        {request.description}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <span className={`badge ${request.status === 'Open' ? 'badge-success' : 'badge-info'}`}>
                      {request.status}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Patient: <span className="font-medium">{request.patient_name}</span>
                  </p>
                  {request.status === 'Open' && (
                    <button
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowModal(true);
                      }}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
                    >
                      <Heart className="w-4 h-4" />
                      Respond to Request
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && selectedRequest && (
          <RespondToRequestModal
            request={selectedRequest}
            onClose={() => {
              setShowModal(false);
              setSelectedRequest(null);
            }}
            onSuccess={() => {
              dispatch(fetchRequests(filters));
              alert('Response submitted successfully! The hospital will contact you.');
            }}
          />
        )}
      </div>
    </div>
  );
}