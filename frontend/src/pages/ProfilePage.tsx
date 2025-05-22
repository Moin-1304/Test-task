import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useMutation } from '@apollo/client';
import { User, Mail, Lock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { UPDATE_PROFILE, CHANGE_PASSWORD } from "@/utils/mutations";

const ProfilePage = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');

  // Update profile mutation
  const [updateProfile, { loading: updateLoading }] = useMutation(UPDATE_PROFILE, {
    onCompleted: () => {
      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });

  // Change password mutation
  const [changePassword, { loading: passwordLoading }] = useMutation(CHANGE_PASSWORD, {
    onCompleted: (data) => {
      if (data.changePassword.success) {
        toast.success('Password changed successfully');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        toast.error(data.changePassword.message);
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to change password');
    },
  });

  // Handle profile form input changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  // Handle password form input changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    
    // Clear password error when typing
    if (name === 'newPassword' || name === 'confirmPassword') {
      setPasswordError('');
    }
  };

  // Handle profile form submission
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      variables: {
        input: {
          name: profileData.name,
          email: profileData.email,
        },
      },
    });
  };

  // Handle password form submission
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    // Validate password strength
    if (passwordData.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }
    
    changePassword({
      variables: {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Profile Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white shadow-card rounded-lg p-6">
            <div className="flex flex-col items-center">
              <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                <span className="text-3xl font-bold text-primary-700">
                  {user?.name.charAt(0)}
                </span>
              </div>
              <h2 className="text-lg font-medium text-gray-900">{user?.name}</h2>
              <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
              
              <button className="mt-4 btn-ghost text-sm w-full">
                Upload new photo
              </button>
            </div>
            
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Account Information</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{user?.email}</span>
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600 capitalize">{user?.role} Account</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="md:col-span-2 space-y-6">
          {/* Profile information form */}
          <div className="bg-white shadow-card rounded-lg divide-y divide-gray-200">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
              <p className="mt-1 text-sm text-gray-500">
                Update your personal information.
              </p>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="label">
                    Full name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      className="input pl-10"
                      value={profileData.name}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="label">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="input pl-10"
                      value={profileData.email}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="btn-primary w-full md:w-auto flex items-center"
                    disabled={updateLoading}
                  >
                    {updateLoading ? (
                      <>
                        <Loader2 className="animate-spin mr-2 h-4 w-4" />
                        Updating...
                      </>
                    ) : (
                      'Update Profile'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Change password form */}
          <div className="bg-white shadow-card rounded-lg divide-y divide-gray-200">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900">Change Password</h2>
              <p className="mt-1 text-sm text-gray-500">
                Update your password to keep your account secure.
              </p>
            </div>
            
            <div className="p-6">
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div>
                  <label htmlFor="currentPassword" className="label">
                    Current password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      required
                      className="input pl-10"
                      placeholder="••••••••"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="newPassword" className="label">
                    New password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      required
                      className={`input pl-10 ${passwordError ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                      placeholder="••••••••"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <p className="text-xs mt-1 text-gray-500">Password must be at least 8 characters</p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="label">
                    Confirm new password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      className={`input pl-10 ${passwordError ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                      placeholder="••••••••"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  {passwordError && (
                    <p className="text-xs mt-1 text-error-600">{passwordError}</p>
                  )}
                </div>

                <div>
                  <button
                    type="submit"
                    className="btn-primary w-full md:w-auto flex items-center"
                    disabled={passwordLoading}
                  >
                    {passwordLoading ? (
                      <>
                        <Loader2 className="animate-spin mr-2 h-4 w-4" />
                        Updating...
                      </>
                    ) : (
                      'Change Password'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Account settings */}
          <div className="bg-white shadow-card rounded-lg divide-y divide-gray-200">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900">Account Settings</h2>
              <p className="mt-1 text-sm text-gray-500">
                Manage your account preferences and settings.
              </p>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                {/* Notification settings */}
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-4">Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="email_notifications"
                          name="email_notifications"
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          defaultChecked
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="email_notifications" className="font-medium text-gray-700">
                          Email notifications
                        </label>
                        <p className="text-gray-500">Receive notifications via email.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="updates"
                          name="updates"
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          defaultChecked
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="updates" className="font-medium text-gray-700">
                          System updates
                        </label>
                        <p className="text-gray-500">Receive updates about system changes.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Danger zone */}
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-base font-medium text-error-600 mb-4">Danger Zone</h3>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-error-300 text-sm font-medium rounded-md text-error-700 bg-white hover:bg-error-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-error-500"
                  >
                    Delete account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;