import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Search, Shield, Mail, GraduationCap, Building } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Search,
      title: 'Search Alumni',
      description: 'Find alumni by name, graduation year, college, or major'
    },
    {
      icon: Mail,
      title: 'Connect Easily',
      description: 'Reach out to alumni for mentorship and networking opportunities'
    },
    {
      icon: GraduationCap,
      title: 'Academic Guidance',
      description: 'Get advice on college applications, majors, and career paths'
    },
    {
      icon: Building,
      title: 'Professional Network',
      description: 'Build connections with professionals in various industries'
    }
  ];

  const stats = [
    { number: '100+', label: 'Alumni Members' },
    { number: '25+', label: 'Colleges Represented' },
    { number: '15+', label: 'Years of Excellence' },
    { number: '50+', label: 'Majors & Careers' }
  ];

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <div className="text-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Welcome to <span className="text-primary-600">Trinity MOC Alumni Database</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connecting current Men of Color members with our distinguished alumni network. 
              Find mentors, get advice, and build lasting professional relationships.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/directory"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
              >
                <Search className="w-5 h-5 mr-2" />
                Browse Alumni Directory
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center px-6 py-3 border border-primary-600 text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 transition-colors"
              >
                <Shield className="w-5 h-5 mr-2" />
                Admin Access
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* About MOC Section */}
      <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">About Trinity MOC</h2>
            <p className="text-lg text-gray-600">
              Men of Color (MOC) is a student organization dedicated to supporting and empowering 
              students of color in their academic and professional journeys. Our alumni network 
              represents success stories across various fields and institutions.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">
              Our platform makes it easy to connect with alumni and access valuable resources
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center p-6 bg-white rounded-lg shadow-md card-hover">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Connect with Alumni?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Start exploring our alumni directory and find the perfect mentor for your journey.
          </p>
          <Link
            to="/directory"
            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 transition-colors"
          >
            <Search className="w-6 h-6 mr-2" />
            Explore Directory
          </Link>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600">
            Questions about the alumni database? Contact the Trinity MOC leadership team or 
            <Link to="/login" className="text-primary-600 hover:text-primary-700 ml-1">
              access the admin panel
            </Link>
            .
          </p>
          <p className="text-gray-600 mt-2">
            For all other alumni questions, please contact: 
            <a href="mailto:alumni@trinityschoolnyc.org" className="text-primary-600 hover:text-primary-700 ml-1">
              alumni@trinityschoolnyc.org
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home; 