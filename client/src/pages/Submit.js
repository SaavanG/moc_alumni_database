import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle, User, Mail, GraduationCap, Building, Briefcase, ExternalLink } from 'lucide-react';
import axios from 'axios';

const Submit = () => {
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
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.full_name || !formData.email || !formData.year_graduated || 
        !formData.current_college || !formData.college_major) {
      setError('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Year validation
    const currentYear = new Date().getFullYear();
    const gradYear = parseInt(formData.year_graduated);
    if (gradYear < 2000 || gradYear > currentYear + 5) {
      setError('Please enter a valid graduation year');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await axios.post('/api/submit-alumni', formData);
      setSuccess(true);
      
      // Reset form
      setFormData({
        full_name: '',
        email: '',
        year_graduated: '',
        current_college: '',
        college_major: '',
        second_major: '',
        profession: '',
        linkedin_url: ''
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Submission Successful!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for submitting your information. Your submission has been received and 
              is pending admin approval. You will be notified once it's been reviewed.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
            >
              Submit Another Entry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <User className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit Your Information</h1>
            <p className="text-gray-600">
              Former MOC member? Add yourself to our alumni directory! 
              Your submission will be reviewed by an admin before being published.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  required
                  value={formData.full_name}
                  onChange={handleChange}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            {/* Graduation Year */}
            <div>
              <label htmlFor="year_graduated" className="block text-sm font-medium text-gray-700 mb-2">
                Graduation Year *
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  id="year_graduated"
                  name="year_graduated"
                  required
                  min="2000"
                  max={new Date().getFullYear() + 5}
                  value={formData.year_graduated}
                  onChange={handleChange}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="2024"
                />
              </div>
            </div>

            {/* Current College */}
            <div>
              <label htmlFor="current_college" className="block text-sm font-medium text-gray-700 mb-2">
                Current College/University *
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="current_college"
                  name="current_college"
                  required
                  value={formData.current_college}
                  onChange={handleChange}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., MIT, Stanford, UC Berkeley"
                />
              </div>
            </div>

            {/* College Major */}
            <div>
              <label htmlFor="college_major" className="block text-sm font-medium text-gray-700 mb-2">
                College Major *
              </label>
              <input
                type="text"
                id="college_major"
                name="college_major"
                required
                value={formData.college_major}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Computer Science, Business Administration"
              />
            </div>

            {/* Second Major (Optional) */}
            <div>
              <label htmlFor="second_major" className="block text-sm font-medium text-gray-700 mb-2">
                Second Major <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                type="text"
                id="second_major"
                name="second_major"
                value={formData.second_major}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Mathematics, Economics"
              />
            </div>

            {/* Profession (Optional) */}
            <div>
              <label htmlFor="profession" className="block text-sm font-medium text-gray-700 mb-2">
                Current Profession <span className="text-gray-400">(Optional)</span>
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="profession"
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Software Engineer, Product Manager"
                />
              </div>
            </div>

            {/* LinkedIn URL (Optional) */}
            <div>
              <label htmlFor="linkedin_url" className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn Profile <span className="text-gray-400">(Optional)</span>
              </label>
              <div className="relative">
                <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  id="linkedin_url"
                  name="linkedin_url"
                  value={formData.linkedin_url}
                  onChange={handleChange}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Submit for Review
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> All submissions are reviewed by MOC administrators before being added to the public directory. 
              This helps us maintain the quality and accuracy of our alumni database.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Submit;