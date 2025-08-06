import React, { useState, useEffect } from 'react';
import { X, User, Mail, Calendar, Building, GraduationCap, Briefcase, Linkedin } from 'lucide-react';

const AlumniForm = ({ alumni, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    year_graduated: '',
    current_college: '',
    college_major: '',
    second_major: '',
    profession: '',
    linkedin_url: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (alumni) {
      setFormData({
        full_name: alumni.full_name || '',
        email: alumni.email || '',
        year_graduated: alumni.year_graduated || '',
        current_college: alumni.current_college || '',
        college_major: alumni.college_major || '',
        second_major: alumni.second_major || '',
        profession: alumni.profession || '',
        linkedin_url: alumni.linkedin_url || ''
      });
    }
  }, [alumni]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.full_name.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.year_graduated) {
      setError('Graduation year is required');
      return false;
    }
    if (!formData.current_college.trim()) {
      setError('Current college is required');
      return false;
    }
    if (!formData.college_major.trim()) {
      setError('College major is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await onSubmit(formData);
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let year = currentYear; year >= currentYear - 50; year--) {
    yearOptions.push(year);
  }

  return (
    <div className="bg-white rounded-lg p-6 w-full max-w-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {alumni ? 'Edit Alumni' : 'Add New Alumni'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {/* Full Name */}
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
            <User className="w-4 h-4 inline mr-1" />
            Full Name *
          </label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter full name"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            <Mail className="w-4 h-4 inline mr-1" />
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter email address"
            required
          />
        </div>

        {/* Graduation Year */}
        <div>
          <label htmlFor="year_graduated" className="block text-sm font-medium text-gray-700 mb-1">
            <Calendar className="w-4 h-4 inline mr-1" />
            Graduation Year *
          </label>
          <select
            id="year_graduated"
            name="year_graduated"
            value={formData.year_graduated}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          >
            <option value="">Select graduation year</option>
            {yearOptions.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Current College */}
        <div>
          <label htmlFor="current_college" className="block text-sm font-medium text-gray-700 mb-1">
            <Building className="w-4 h-4 inline mr-1" />
            Current College *
          </label>
          <input
            type="text"
            id="current_college"
            name="current_college"
            value={formData.current_college}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter college name"
            required
          />
        </div>

        {/* College Major */}
        <div>
          <label htmlFor="college_major" className="block text-sm font-medium text-gray-700 mb-1">
            <GraduationCap className="w-4 h-4 inline mr-1" />
            College Major *
          </label>
          <input
            type="text"
            id="college_major"
            name="college_major"
            value={formData.college_major}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter major"
            required
          />
        </div>

        {/* Second Major */}
        <div>
          <label htmlFor="second_major" className="block text-sm font-medium text-gray-700 mb-1">
            <GraduationCap className="w-4 h-4 inline mr-1" />
            Second Major (Optional)
          </label>
          <input
            type="text"
            id="second_major"
            name="second_major"
            value={formData.second_major}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter second major (if applicable)"
          />
        </div>

        {/* Profession */}
        <div>
          <label htmlFor="profession" className="block text-sm font-medium text-gray-700 mb-1">
            <Briefcase className="w-4 h-4 inline mr-1" />
            Profession (Optional)
          </label>
          <input
            type="text"
            id="profession"
            name="profession"
            value={formData.profession}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter profession"
          />
        </div>

        {/* LinkedIn URL */}
        <div>
          <label htmlFor="linkedin_url" className="block text-sm font-medium text-gray-700 mb-1">
            <Linkedin className="w-4 h-4 inline mr-1" />
            LinkedIn URL (Optional)
          </label>
          <input
            type="url"
            id="linkedin_url"
            name="linkedin_url"
            value={formData.linkedin_url}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="https://linkedin.com/in/username"
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {alumni ? 'Updating...' : 'Adding...'}
              </div>
            ) : (
              alumni ? 'Update Alumni' : 'Add Alumni'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AlumniForm; 