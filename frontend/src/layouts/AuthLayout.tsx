import { Outlet } from 'react-router-dom';
import Logo from '../components/common/Logo';

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left side - Background image/gradient */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-r from-primary-600 to-accent-600 p-12 items-center justify-center">
        <div className="max-w-md text-white">
          <Logo size="lg" className="mb-8" />
          <h1 className="text-4xl font-bold mb-6">Welcome to StaffSync</h1>
          <p className="text-lg mb-8">
            Streamline your employee management with our powerful, intuitive platform. 
            Access employee records, track performance, and manage your team with ease.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-2">Role-Based Access</h3>
              <p className="text-sm">Secure access control for different user roles</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-2">Intuitive Interface</h3>
              <p className="text-sm">Clean design for maximum productivity</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-2">Performance Tracking</h3>
              <p className="text-sm">Monitor employee progress and achievements</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-2">Data Visualization</h3>
              <p className="text-sm">Clear insights with beautiful charts</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Auth forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Logo size="lg" />
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;