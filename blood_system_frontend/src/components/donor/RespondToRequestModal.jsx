// src/components/donor/RespondToRequestModal.jsx
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createResponse } from '../../redux/slices/responseSlice';
import { X } from 'lucide-react';

const RespondToRequestModal = ({ request, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    response_type: 'Interested',
    response_message: '',
    appointment_date: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const responseData = {
      request_id: request.request_id,
      response_type: formData.response_type,
      response_message: formData.response_message || null,
      appointment_date: formData.appointment_date || null,
    };

    try {
      await dispatch(createResponse(responseData)).unwrap();
      alert('Response submitted successfully! The hospital will contact you.');
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Response error:', err);
      setError(err || 'Failed to submit response');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Respond to Blood Request</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">{request.hospital_name}</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600">Patient:</span>
              <span className="ml-2 font-medium">{request.patient_name}</span>
            </div>
            <div>
              <span className="text-gray-600">Blood Group:</span>
              <span className="ml-2 font-medium text-red-600">{request.blood_group}</span>
            </div>
            <div>
              <span className="text-gray-600">Units:</span>
              <span className="ml-2 font-medium">{request.units_required}</span>
            </div>
            <div>
              <span className="text-gray-600">Urgency:</span>
              <span className={`ml-2 font-medium ${
                request.urgency === 'Critical' ? 'text-red-600' :
                request.urgency === 'Urgent' ? 'text-orange-600' : 'text-green-600'
              }`}>
                {request.urgency}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Response Type
            </label>
            <select
              value={formData.response_type}
              onChange={(e) => setFormData({ ...formData, response_type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            >
              <option value="Interested">Interested</option>
              <option value="Confirmed">Confirmed</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Appointment Date & Time (Optional)
            </label>
            <input
              type="datetime-local"
              value={formData.appointment_date}
              onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message (Optional)
            </label>
            <textarea
              value={formData.response_message}
              onChange={(e) => setFormData({ ...formData, response_message: e.target.value })}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Let the hospital know when you're available or any special notes..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400"
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit Response'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RespondToRequestModal;
