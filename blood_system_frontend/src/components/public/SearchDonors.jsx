import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDonors } from '../../redux/slices/donorSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import { Search, MapPin, Droplet, Phone, Mail, Clock, Calendar } from 'lucide-react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function SearchDonors() {
  const [filters, setFilters] = useState({
    blood_group: '',
    city: '',
    is_available: 'true'
  });

  const dispatch = useDispatch();
  const { list: donors, isLoading } = useSelector((state) => state.donors);

  useEffect(() => {
    dispatch(fetchDonors(filters));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchDonors(filters));
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Find Blood Donors</h1>
          <p className="text-xl text-gray-600">Search for available blood donors in your area</p>
        </div>

        {/* Search Form */}
        <div className="card mb-8">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blood Group
              </label>
              <select
                name="blood_group"
                value={filters.blood_group}
                onChange={handleFilterChange}
                className="input-field"
              >
                <option value="">All Blood Groups</option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability
              </label>
              <select
                name="is_available"
                value={filters.is_available}
                onChange={handleFilterChange}
                className="input-field"
              >
                <option value="true">Available</option>
                <option value="false">Not Available</option>
                <option value="">All</option>
              </select>
            </div>

            <div className="flex items-end">
              <button type="submit" className="btn-primary w-full flex items-center justify-center space-x-2">
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div>
            <div className="mb-4 text-gray-600">
              Found <span className="font-semibold">{donors.length}</span> donors
            </div>

            {donors.length === 0 ? (
              <div className="card text-center py-12">
                <Droplet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl text-gray-600">No donors found matching your criteria</p>
                <p className="text-gray-500 mt-2">Try adjusting your search filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {donors.map((donor) => (
                  <div key={donor.donor_id} className="card hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{donor.full_name}</h3>
                        <div className="flex items-center text-gray-600 mt-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="text-sm">{donor.city}, {donor.state}</span>
                        </div>
                      </div>
                      <span className={`badge ${donor.is_available ? 'badge-success' : 'badge-warning'}`}>
                        <Droplet className="w-4 h-4 inline mr-1" />
                        {donor.blood_group}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-primary-600" />
                        <span>{donor.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-primary-600" />
                        <span className="truncate">{donor.email}</span>
                      </div>
                    </div>

                    {/* Availability Schedule */}
                    {donor.availability_days && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Available Days:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {donor.availability_days.split(',').map((day) => (
                            <span key={day} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                              {day}
                            </span>
                          ))}
                        </div>
                        {donor.availability_time_start && donor.availability_time_end && (
                          <div className="mt-2 text-xs text-gray-600 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {donor.availability_time_start} - {donor.availability_time_end}
                          </div>
                        )}
                        {donor.preferred_contact_method && (
                          <div className="mt-1 text-xs text-gray-500">
                            Prefers: {donor.preferred_contact_method}
                          </div>
                        )}
                      </div>
                    )}

                    {donor.last_donation_date && (
                      <div className="mt-4 pt-4 border-t text-sm text-gray-500">
                        Last donation: {new Date(donor.last_donation_date).toLocaleDateString()}
                      </div>
                    )}

                    <div className="mt-4">
                      {donor.is_available ? (
                        <span className="badge-success w-full text-center block">Available</span>
                      ) : (
                        <span className="badge-warning w-full text-center block">Not Available</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}