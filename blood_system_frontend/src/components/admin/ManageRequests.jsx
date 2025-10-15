// src/components/admin/ManageRequests.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRequests } from '../../redux/slices/requestSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import { FileText, MapPin, Calendar, Phone } from 'lucide-react';

export default function ManageRequests() {
  const dispatch = useDispatch();
  const { list: requests, isLoading } = useSelector((state) => state.requests);

  useEffect(() => {
    dispatch(fetchRequests());
  }, [dispatch]);

  const getUrgencyBadge = (urgency) => {
    const badges = {
      Critical: 'badge-danger',
      Urgent: 'badge-warning',
      Normal: 'badge-info'
    };
    return badges[urgency] || 'badge-info';
  };

  const getStatusBadge = (status) => {
    const badges = {
      Open: 'badge-success',
      Fulfilled: 'badge-info',
      Closed: 'badge-warning'
    };
    return badges[status] || 'badge-info';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Blood Requests</h1>
          <p className="text-gray-600 mt-2">View and manage all blood requests</p>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : requests.length === 0 ? (
          <div className="card text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">No requests found</p>
          </div>
        ) : (
          <div>
            <div className="mb-4 text-gray-600">
              Total requests: <span className="font-semibold">{requests.length}</span>
            </div>

            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request.request_id} className="card hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`badge ${getUrgencyBadge(request.urgency)}`}>
                          {request.urgency}
                        </span>
                        <span className={`badge ${getStatusBadge(request.status)}`}>
                          {request.status}
                        </span>
                        <span className="text-2xl font-bold text-primary-600">
                          {request.blood_group}
                        </span>
                        <span className="text-gray-600">
                          {request.units_required} units
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
                        <div>
                          <span className="font-medium">Patient:</span> {request.patient_name}
                        </div>
                      </div>

                      {request.description && (
                        <p className="mt-3 text-gray-700 text-sm">
                          {request.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t text-xs text-gray-500">
                    Posted by: {request.hospital_contact_name} | 
                    Created: {new Date(request.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
