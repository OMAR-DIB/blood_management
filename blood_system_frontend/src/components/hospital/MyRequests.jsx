// src/components/hospital/MyRequests.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRequests, updateRequest, deleteRequest } from '../../redux/slices/requestSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import { Edit2, Trash2, FileText } from 'lucide-react';

export default function MyRequests() {
  const dispatch = useDispatch();
  const { list: requests, isLoading } = useSelector((state) => state.requests);
  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState('');

  useEffect(() => {
    dispatch(fetchRequests());
  }, [dispatch]);

  const handleStatusUpdate = async (id) => {
    try {
      await dispatch(updateRequest({ id, data: { status: editStatus } })).unwrap();
      setEditingId(null);
      dispatch(fetchRequests());
    } catch (error) {
      console.error('Failed to update request:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        await dispatch(deleteRequest(id)).unwrap();
      } catch (error) {
        console.error('Failed to delete request:', error);
      }
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">My Blood Requests</h1>
          <p className="text-gray-600 mt-2">Manage all your blood requests</p>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : requests.length === 0 ? (
          <div className="card text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">No requests found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.request_id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className={`badge ${getUrgencyBadge(request.urgency)}`}>
                        {request.urgency}
                      </span>
                      <span className="text-2xl font-bold text-primary-600">
                        {request.blood_group}
                      </span>
                      <span className="text-gray-600">
                        {request.units_required} units
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div>
                        <p className="text-sm text-gray-600">Patient</p>
                        <p className="font-medium text-gray-900">{request.patient_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Hospital</p>
                        <p className="font-medium text-gray-900">{request.hospital_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Contact</p>
                        <p className="font-medium text-gray-900">
                          {request.contact_person} - {request.contact_phone}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Required By</p>
                        <p className="font-medium text-gray-900">
                          {new Date(request.required_by).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {request.description && (
                      <p className="text-sm text-gray-700 mt-2">
                        {request.description}
                      </p>
                    )}
                  </div>

                  <div className="ml-4">
                    {editingId === request.request_id ? (
                      <div className="flex flex-col space-y-2">
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                          className="input-field text-sm"
                        >
                          <option value="Open">Open</option>
                          <option value="Fulfilled">Fulfilled</option>
                          <option value="Closed">Closed</option>
                        </select>
                        <button
                          onClick={() => handleStatusUpdate(request.request_id)}
                          className="btn-primary text-sm py-1 px-3"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="btn-secondary text-sm py-1 px-3"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <span className={`badge ${getStatusBadge(request.status)}`}>
                        {request.status}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-4 border-t">
                  <button
                    onClick={() => {
                      setEditingId(request.request_id);
                      setEditStatus(request.status);
                    }}
                    className="text-blue-600 hover:text-blue-700 flex items-center space-x-1 text-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Update Status</span>
                  </button>
                  <button
                    onClick={() => handleDelete(request.request_id)}
                    className="text-red-600 hover:text-red-700 flex items-center space-x-1 text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}