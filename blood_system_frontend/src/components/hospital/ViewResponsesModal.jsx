// src/components/hospital/ViewResponsesModal.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRequestResponses } from '../../redux/slices/responseSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import { X, Phone, Mail, MapPin, Calendar, User, Clock } from 'lucide-react';

const ViewResponsesModal = ({ request, onClose }) => {
  const dispatch = useDispatch();
  const { requestResponses, isLoading } = useSelector((state) => state.responses);

  useEffect(() => {
    if (request) {
      dispatch(getRequestResponses(request.request_id));
    }
  }, [dispatch, request]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Interested': return 'bg-blue-100 text-blue-800';
      case 'Confirmed': return 'bg-yellow-100 text-yellow-800';
      case 'Donated': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto p-6">
        <div className="flex justify-between items-center mb-4 pb-4 border-b sticky top-0 bg-white">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Donor Responses</h2>
            <p className="text-gray-600">
              For: {request.patient_name} ({request.blood_group})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : requestResponses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No responses yet</p>
            <p className="text-gray-500 mt-2">Check back later for donor responses</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requestResponses.map((response) => (
              <div key={response.response_id} className="border rounded-lg p-4 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      {response.donor_name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-red-600 font-bold text-lg">{response.blood_group}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(response.response_type)}`}>
                        {response.response_type}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    {new Date(response.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{response.donor_phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{response.donor_email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{response.city}, {response.state}</span>
                  </div>
                  {response.appointment_date && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">
                        {new Date(response.appointment_date).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Availability Schedule */}
                {response.availability_days && (
                  <div className="bg-blue-50 p-3 rounded-lg mb-3">
                    <p className="text-sm font-semibold text-blue-900 mb-2">Availability Schedule:</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {response.availability_days.split(',').map((day) => (
                        <span key={day} className="px-2 py-1 bg-blue-200 text-blue-800 text-xs rounded">
                          {day}
                        </span>
                      ))}
                    </div>
                    {response.availability_time_start && response.availability_time_end && (
                      <p className="text-sm text-blue-700">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {response.availability_time_start} - {response.availability_time_end}
                      </p>
                    )}
                    {response.preferred_contact_method && (
                      <p className="text-xs text-blue-600 mt-1">
                        Preferred Contact: {response.preferred_contact_method}
                      </p>
                    )}
                  </div>
                )}

                {response.response_message && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Message:</p>
                    <p className="text-gray-700">{response.response_message}</p>
                  </div>
                )}

                {response.donation_completed === 1 && (
                  <div className="mt-3 bg-green-50 p-2 rounded-lg flex items-center gap-2">
                    <span className="text-green-800 text-sm font-semibold">
                      ✓ Donation Completed on {new Date(response.donation_date).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 pt-4 border-t">
          <p className="text-sm text-gray-600">
            <strong>Total Responses:</strong> {requestResponses.length}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Contact the donors directly using the phone or email provided above.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewResponsesModal;
