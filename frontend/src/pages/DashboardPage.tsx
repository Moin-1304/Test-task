import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { BarChart3, Users, Briefcase, Clock, Calendar, TrendingUp, Activity } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { GET_DASHBOARD_STATS } from "@/utils/mutations";

const DashboardPage = () => {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('');
  
  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  // Fetch dashboard data
  const { data } = useQuery(GET_DASHBOARD_STATS, {
    fetchPolicy: 'network-only'
  });

  // Placeholder stats if data is loading
  const stats = data?.dashboardStats || {
    totalEmployees: '...',
    newEmployees: '...',
    attendanceRate: '...',
    departmentsCount: '...'
  };

  // Stat cards
  const statCards = [
    { 
      title: 'Total Employees', 
      value: stats.totalEmployees, 
      icon: Users, 
      color: 'bg-primary-500', 
      increase: '+5.2% from last month' 
    },
    { 
      title: 'New Employees', 
      value: stats.newEmployees, 
      icon: Briefcase, 
      color: 'bg-secondary-500',
      increase: '+2.4% from last month'
    },
    { 
      title: 'Attendance Rate', 
      value: stats.attendanceRate, 
      icon: Clock, 
      color: 'bg-success-500',
      increase: '+1.8% from last month'
    },
    { 
      title: 'Departments', 
      value: stats.departmentsCount, 
      icon: BarChart3, 
      color: 'bg-accent-500',
      increase: 'Same as last month'
    }
  ];
  
  // Upcoming events (sample data)
  const upcomingEvents = [
    { id: 1, title: 'Team Meeting', date: 'Today, 2:00 PM', type: 'meeting' },
    { id: 2, title: 'Project Deadline', date: 'Tomorrow, 5:00 PM', type: 'deadline' },
    { id: 3, title: 'New Employee Orientation', date: 'Jun 12, 10:00 AM', type: 'event' },
    { id: 4, title: 'Quarterly Review', date: 'Jun 15, 1:00 PM', type: 'meeting' },
  ];
  
  // Recent activities (sample data)
  const recentActivities = [
    { id: 1, action: 'added', user: 'Sarah Johnson', target: 'new employee profile', time: '2 hours ago' },
    { id: 2, action: 'updated', user: 'Mark Wilson', target: 'department structure', time: '4 hours ago' },
    { id: 3, action: 'approved', user: 'Lisa Thompson', target: 'vacation request', time: '1 day ago' },
    { id: 4, action: 'commented on', user: 'John Davis', target: 'performance review', time: '2 days ago' },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          {greeting}, {user?.name} 👋 Here's what's happening.
        </p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white overflow-hidden shadow-card rounded-lg p-6 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center">
              <div className={`flex-shrink-0 rounded-md p-3 ${stat.color} text-white`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{stat.title}</dt>
                  <dd>
                    <div className="text-lg font-semibold text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-500">{stat.increase}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Charts and activity sections */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Activity chart placeholder */}
        <div className="bg-white rounded-lg shadow-card overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Employee Activity</h3>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                  <TrendingUp className="mr-1 h-3 w-3" /> 12% Increase
                </span>
              </div>
            </div>
          </div>
          <div className="px-6 py-5">
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <div className="text-center">
                <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Activity Chart</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Data visualization will appear here
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Activity feed */}
        <div className="bg-white rounded-lg shadow-card overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
              <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                View all
              </a>
            </div>
          </div>
          <div className="px-6 py-5">
            <ul className="divide-y divide-gray-200">
              {recentActivities.map((activity) => (
                <li key={activity.id} className="py-4">
                  <div className="flex space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                        <Activity className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-800">
                        <span className="font-medium">{activity.user}</span>
                        {' '}
                        <span className="text-gray-600">{activity.action}</span>
                        {' '}
                        <span className="font-medium">{activity.target}</span>
                      </p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Upcoming events */}
      <div className="mt-6 bg-white rounded-lg shadow-card overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Upcoming Events</h3>
            <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500">
              View calendar
            </a>
          </div>
        </div>
        <div className="bg-white overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {upcomingEvents.map((event) => (
              <li key={event.id} className="px-6 py-4 flex items-center">
                <div className="flex-shrink-0">
                  <Calendar className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-900">{event.title}</p>
                  <p className="text-sm text-gray-500">{event.date}</p>
                </div>
                <div>
                  <span 
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${event.type === 'meeting' ? 'bg-blue-100 text-blue-800' : 
                      event.type === 'deadline' ? 'bg-red-100 text-red-800' : 
                      'bg-green-100 text-green-800'}`}
                  >
                    {event.type}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;