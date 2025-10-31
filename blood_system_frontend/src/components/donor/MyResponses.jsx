// src/components/donor/MyResponses.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyResponses, deleteResponse, updateResponse } from '../../redux/slices/responseSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import { Calendar, MapPin, Phone, Building, X, CheckCircle } from 'lucide-react';

const MyResponses = () => {
  const dispatch = useDispatch();
  const { myResponses, isLoading, error, successMessage } = useSelector((state) => state.responses);

  useEffect(() => {
    dispatch(getMyResponses());
  }, [dispatch]);

  const handleCancelResponse = (responseId) => {
    if (window.confirm('Are you sure you want to cancel this response?')) {
      dispatch(deleteResponse(responseId)).then(() => {
        dispatch(getMyResponses());
      });
    }
  };

  const handleMarkDonated = (responseId) => {
    dispatch(updateResponse({
      responseId,
      data: {
        response_type: 'Donated',
        donation_completed: 1,
        donation_date: new Date().toISOString().split('T')[0]
      }
    })).then(() => {
      dispatch(getMyResponses());
    });
  };

  if (isLoading) return <LoadingSpinner />;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Interested': return 'bg-blue-100 text-blue-800';
      case 'Confirmed': return 'bg-yellow-100 text-yellow-800';
      case 'Donated': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'Critical': return 'text-red-600 font-bold';
      case 'Urgent': return 'text-orange-600 font-semibold';
      case 'Normal': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Responses</h1>
        <p className="text-gray-600 mt-2">Track your donation responses and their status</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {myResponses.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 text-lg">You haven't responded to any blood requests yet.</p>
          <a
            href="/donor/requests"
            className="mt-4 inline-block bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
          >
            Browse Available Requests
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {myResponses.map((response) => (
            <div key={response.response_id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{response.hospital_name}</h3>
                  <p className="text-sm text-gray-500">Patient: {response.patient_name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(response.response_type)}`}>
                    {response.response_type}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm ${getUrgencyColor(response.request_status)}`}>
                    Request: {response.request_status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-bold">{response.blood_group}</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Blood Group</p>
                    <p className="font-semibold">{response.blood_group}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-semibold">{response.city}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="font-semibold">{response.contact_person}</p>
                    <p className="text-sm text-gray-600">{response.contact_phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Responded On</p>
                    <p className="font-semibold">
                      {new Date(response.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {response.response_message && (
                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-gray-500 mb-1">Your Message:</p>
                  <p className="text-gray-700">{response.response_message}</p>
                </div>
              )}

              {response.appointment_date && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Appointment Date:</p>
                  <p className="font-semibold">
                    {new Date(response.appointment_date).toLocaleString()}
                  </p>
                </div>
              )}

              {response.donation_completed === 1 && response.donation_date && (
                <div className="bg-green-50 p-3 rounded-lg mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-green-800 font-semibold">Donation Completed</p>
                    <p className="text-sm text-green-700">
                      Donated on {new Date(response.donation_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-4">
                {response.response_type !== 'Donated' && response.response_type !== 'Cancelled' && (
                  <>
                    <button
                      onClick={() => handleMarkDonated(response.response_id)}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark as Donated
                    </button>
                    <button
                      onClick={() => handleCancelResponse(response.response_id)}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel Response
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyResponses;
