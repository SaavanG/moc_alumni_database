import React, { useState, useEffect, useCallback } from 'react';
import { Search, Mail, Linkedin, GraduationCap, Building, Users } from 'lucide-react';
import axios from 'axios';

const Directory = () => {
  const [alumni, setAlumni] = useState([]);
  const [filteredAlumni, setFilteredAlumni] = useState([]);
  const [filters, setFilters] = useState({});
  const [filterOptions, setFilterOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('full_name');
  const [sortOrder, setSortOrder] = useState('ASC');

  const applyFilters = useCallback(() => {
    let filtered = [...alumni];

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(alum => 
        alum.full_name.toLowerCase().includes(term) ||
        alum.email.toLowerCase().includes(term) ||
        alum.current_college.toLowerCase().includes(term) ||
        alum.college_major.toLowerCase().includes(term)
      );
    }

    // Apply filters
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        filtered = filtered.filter(alum => {
          if (key === 'year') {
            return alum.year_graduated === parseInt(filters[key]);
          }
          return alum[key] && alum[key].toLowerCase().includes(filters[key].toLowerCase());
        });
      }
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (sortOrder === 'ASC') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setFilteredAlumni(filtered);
  }, [alumni, searchTerm, filters, sortBy, sortOrder]);

  useEffect(() => {
    fetchAlumni();
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const fetchAlumni = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/alumni');
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

  const fetchFilterOptions = async () => {
    try {
      const response = await axios.get('/api/filters');
      setFilterOptions(response.data);
    } catch (err) {
      console.error('Error fetching filter options:', err);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
    setSortBy('full_name');
    setSortOrder('ASC');
  };



  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button 
          onClick={fetchAlumni}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Alumni Directory</h1>
          <p className="text-gray-600">
            Connect with {alumni.length} alumni members across various colleges and careers
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
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

            {/* Year Filter */}
            <select
              value={filters.year || ''}
              onChange={(e) => handleFilterChange('year', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Years</option>
              {filterOptions.years?.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            {/* College Filter */}
            <select
              value={filters.current_college || ''}
              onChange={(e) => handleFilterChange('current_college', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Colleges</option>
              {filterOptions.colleges?.map(college => (
                <option key={college} value={college}>{college}</option>
              ))}
            </select>

            {/* Major Filter */}
            <select
              value={filters.college_major || ''}
              onChange={(e) => handleFilterChange('college_major', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Majors</option>
              {filterOptions.majors?.map(major => (
                <option key={major} value={major}>{major}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={clearFilters}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Clear all filters
            </button>
            <div className="text-sm text-gray-600">
              {filteredAlumni.length} of {alumni.length} alumni
            </div>
          </div>
        </div>

        {/* Alumni Grid */}
        {filteredAlumni.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No alumni found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlumni.map((alum) => (
              <div key={alum.id} className="bg-white rounded-lg shadow-md p-6 card-hover">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {alum.full_name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Class of {alum.year_graduated}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-primary-600" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Building className="w-4 h-4 mr-2" />
                    <span>{alum.current_college}</span>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Major:</span> {alum.college_major}
                    {alum.second_major && (
                      <span> & {alum.second_major}</span>
                    )}
                  </div>

                  {alum.profession && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Profession:</span> {alum.profession}
                    </div>
                  )}

                  <div className="flex space-x-2 pt-2">
                    <a
                      href={`mailto:${alum.email}`}
                      className="flex items-center text-sm text-primary-600 hover:text-primary-700"
                      title={alum.email}
                    >
                      <Mail className="w-4 h-4 mr-1" />
                      {alum.email}
                    </a>
                    {alum.linkedin_url && (
                      <a
                        href={alum.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-primary-600 hover:text-primary-700"
                      >
                        <Linkedin className="w-4 h-4 mr-1" />
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Directory; 