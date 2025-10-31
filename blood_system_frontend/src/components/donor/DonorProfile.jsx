// src/components/donor/DonorProfile.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile } from '../../redux/slices/authSlice';
import { updateDonor } from '../../redux/slices/donorSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import { Save, User } from 'lucide-react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function DonorProfile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      const result = await dispatch(getProfile());
      if (result.payload) {
        setProfile(result.payload);
        setFormData({
          blood_group: result.payload.blood_group || '',
          date_of_birth: result.payload.date_of_birth || '',
          gender: result.payload.gender || '',
          weight: result.payload.weight || '',
          city: result.payload.city || '',
          state: result.payload.state || '',
          address: result.payload.address || '',
          last_donation_date: result.payload.last_donation_date || '',
          is_available: result.payload.is_available ? '1' : '0',
          medical_conditions: result.payload.medical_conditions || '',
          availability_days: result.payload.availability_days || '',
          availability_time_start: result.payload.availability_time_start || '09:00',
          availability_time_end: result.payload.availability_time_end || '17:00',
          preferred_contact_method: result.payload.preferred_contact_method || 'Both'
        });
      }
      setIsLoading(false);
    };
    loadProfile();
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      await dispatch(updateDonor({ 
        id: profile.donor_id, 
        data: {
          ...formData,
          is_available: formData.is_available === '1'
        }
      }));
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Update your donor information</p>
        </div>

        <div className="card">
          <div className="flex items-center space-x-4 mb-6 pb-6 border-b">
            <div className="bg-primary-100 p-4 rounded-full">
              <User className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{user?.full_name}</h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Group *
                </label>
                <select
                  name="blood_group"
                  value={formData.blood_group}
                  onChange={handleChange}
                  required
                  className="input-field"
                >
                  <option value="">Select Blood Group</option>
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  step="0.1"
                  value={formData.weight}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Donation Date
                </label>
                <input
                  type="date"
                  name="last_donation_date"
                  value={formData.last_donation_date}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability Status
                </label>
                <select
                  name="is_available"
                  value={formData.is_available}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="1">Available</option>
                  <option value="0">Not Available</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  rows="2"
                  value={formData.address}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              {/* Availability Schedule Section */}
              <div className="md:col-span-2 border-t pt-6 mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability Schedule</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Let hospitals know when you're available to donate blood
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Days
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                    const isSelected = formData.availability_days?.split(',').includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          const days = formData.availability_days ? formData.availability_days.split(',') : [];
                          if (isSelected) {
                            setFormData({
                              ...formData,
                              availability_days: days.filter(d => d !== day).join(',')
                            });
                          } else {
                            setFormData({
                              ...formData,
                              availability_days: [...days, day].join(',')
                            });
                          }
                        }}
                        className={`px-4 py-2 rounded-lg border-2 transition ${
                          isSelected
                            ? 'bg-red-600 text-white border-red-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-red-600'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available From
                </label>
                <input
                  type="time"
                  name="availability_time_start"
                  value={formData.availability_time_start}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Until
                </label>
                <input
                  type="time"
                  name="availability_time_end"
                  value={formData.availability_time_end}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Contact Method
                </label>
                <select
                  name="preferred_contact_method"
                  value={formData.preferred_contact_method}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="Phone">Phone</option>
                  <option value="Email">Email</option>
                  <option value="Both">Both</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medical Conditions (if any)
                </label>
                <textarea
                  name="medical_conditions"
                  rows="3"
                  value={formData.medical_conditions}
                  onChange={handleChange}
                  placeholder="List any medical conditions that might affect donation"
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t">
              <button
                type="submit"
                disabled={isSaving}
                className="btn-primary flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}