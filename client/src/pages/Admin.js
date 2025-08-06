import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Search, Users, Lock } from 'lucide-react';
import axios from 'axios';
import AlumniForm from '../components/AlumniForm';
import PasswordChangeModal from '../components/PasswordChangeModal';

const Admin = () => {
  const [alumni, setAlumni] = useState([]);
  const [filteredAlumni, setFilteredAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingAlumni, setEditingAlumni] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const applySearch = useCallback(() => {
    if (!searchTerm) {
      setFilteredAlumni(alumni);
      return;
    }

    const filtered = alumni.filter(alum =>
      alum.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alum.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alum.current_college.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alum.college_major.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAlumni(filtered);
  }, [alumni, searchTerm]);

  useEffect(() => {
    fetchAlumni();
  }, []);

  useEffect(() => {
    applySearch();
  }, [applySearch]);

  const fetchAlumni = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/alumni', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const alumniData = response.data.alumni || []; // Extract alumni array from response
      setAlumni(alumniData);
      setFilteredAlumni(alumniData);
    } catch (err) {
      setError('Failed to load alumni data');
      console.error('Error fetching alumni:', err);
      setAlumni([]); // Ensure alumni is always an array
      setFilteredAlumni([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAlumni = async (alumniData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/alumni', alumniData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setShowForm(false);
      fetchAlumni();
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to add alumni');
    }
  };

  const handleUpdateAlumni = async (alumniData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/alumni/${editingAlumni.id}`, alumniData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setEditingAlumni(null);
      setShowForm(false);
      fetchAlumni();
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to update alumni');
    }
  };

  const handleDeleteAlumni = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/alumni/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setDeleteConfirm(null);
      fetchAlumni();
    } catch (err) {
      setError('Failed to delete alumni');
      console.error('Error deleting alumni:', err);
    }
  };

  const openEditForm = (alumni) => {
    setEditingAlumni(alumni);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingAlumni(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
            <p className="text-gray-600">
              Manage the MOC Alumni Database
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Lock className="w-5 h-5 mr-2" />
              Change Password
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Alumni
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {/* Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search alumni..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Alumni Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    College
                  </th>
                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Major(s)
                   </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profession
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAlumni.map((alum) => (
                  <tr key={alum.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {alum.full_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{alum.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{alum.year_graduated}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{alum.current_college}</div>
                    </td>
                                         <td className="px-6 py-4 whitespace-nowrap">
                       <div className="text-sm text-gray-900">
                         {alum.college_major}
                         {alum.second_major && (
                           <span className="text-gray-500"> & {alum.second_major}</span>
                         )}
                       </div>
                     </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {alum.profession || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => openEditForm(alum)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(alum)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAlumni.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No alumni found' : 'No alumni yet'}
              </h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search' : 'Add the first alumni member'}
              </p>
            </div>
          )}
        </div>

        {/* Alumni Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <AlumniForm
                  alumni={editingAlumni}
                  onSubmit={editingAlumni ? handleUpdateAlumni : handleAddAlumni}
                  onCancel={closeForm}
                />
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Confirm Delete
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Are you sure you want to delete {deleteConfirm.full_name}? This action cannot be undone.
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteAlumni(deleteConfirm.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Password Change Modal */}
        <PasswordChangeModal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          onSuccess={() => {
            // Optionally show a success message or redirect
            console.log('Password changed successfully');
          }}
        />
      </div>
    </div>
  );
};

export default Admin; 