import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, PieChart, CreditCard, FileText, 
  UserCircle, Settings, ShieldCheck, LogOut, MessageSquare, Bell,
  Menu, X, Search, ChevronDown
} from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../services/api';

const AppLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminBadgeCount, setAdminBadgeCount] = useState(0);

  useEffect(() => {
    if (user?.role === 'admin') {
      const fetchBadgeCount = async () => {
        try {
          const [kycRes, supportRes] = await Promise.all([
            api.get('/kyc/admin/pending'),
            api.get('/support/admin/tickets')
          ]);
          const pendingKycCount = kycRes.data.length;
          const openTicketsCount = supportRes.data.filter(t => t.status === 'Open').length;
          setAdminBadgeCount(pendingKycCount + openTicketsCount);
        } catch (err) {
          console.error('Error fetching admin count:', err);
        }
      };
      fetchBadgeCount();
      const interval = setInterval(fetchBadgeCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Portfolio', path: '/portfolio', icon: PieChart },
    { name: 'SIPs', path: '/sip', icon: CreditCard },
    { name: 'Nominee', path: '/nominee', icon: UserCircle },
    { name: 'KYC', path: '/kyc', icon: ShieldCheck },
    { name: 'Statements', path: '/statements', icon: FileText },
    { name: 'Support', path: '/support', icon: MessageSquare },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Profile', path: '/profile', icon: Settings }
  ];

  if (user?.role === 'admin') {
    navItems.push({ name: 'Admin Panel', path: '/admin', icon: ShieldCheck });
  }

  return (
    <div className="min-h-screen flex bg-navy-50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex lg:flex-col ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center mr-3 shadow-sm">
            <span className="text-white font-bold text-lg leading-none tracking-tighter">IE</span>
          </div>
          <span className="text-xl font-bold text-navy-900 tracking-tight">InvestEase</span>
          <button 
            className="ml-auto lg:hidden text-navy-400 hover:text-navy-900"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                  isActive 
                    ? 'bg-teal-50 text-teal-700 font-semibold' 
                    : 'text-navy-600 hover:bg-gray-50 hover:text-navy-900 font-medium'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-teal-600 rounded-r-full"></span>
                )}
                <Icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-teal-600' : 'text-navy-400 group-hover:text-navy-600'}`} />
                <span className="flex-1 text-left">{item.name}</span>
                {item.name === 'Admin Panel' && adminBadgeCount > 0 && (
                  <span className="ml-auto bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse shadow-sm">
                    {adminBadgeCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User / Logout */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2.5 rounded-xl text-navy-600 font-medium hover:bg-red-50 hover:text-red-700 transition-colors group"
          >
            <LogOut className="w-5 h-5 mr-3 text-navy-400 group-hover:text-red-500" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 z-40">
          <div className="flex items-center flex-1">
            <button 
              className="lg:hidden text-navy-500 hover:text-navy-900 mr-4"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            
            {/* Search Bar */}
            <div className="hidden sm:flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 w-64 focus-within:ring-2 focus-within:ring-teal-500/50 focus-within:border-teal-500 transition-all">
              <Search className="w-4 h-4 text-navy-400 mr-2 shrink-0" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none outline-none text-sm text-navy-900 w-full placeholder-navy-400"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6">
            <Link to="/notifications" className="relative p-2 text-navy-400 hover:text-navy-900 hover:bg-gray-50 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </Link>
            
            <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>
            
            <Link to="/profile" className="flex items-center gap-3 hover:bg-gray-50 p-1.5 pr-3 rounded-full transition-colors cursor-pointer border border-transparent hover:border-gray-200">
              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center border border-teal-200">
                <span className="text-sm font-bold text-teal-700">{user?.name?.charAt(0).toUpperCase()}</span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-navy-900 leading-none">{user?.name.split(' ')[0]}</p>
                <p className="text-[10px] text-navy-500 mt-0.5">{user?.role === 'admin' ? 'Administrator' : 'Investor'}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-navy-400 hidden sm:block" />
            </Link>
          </div>
        </header>

        {/* Main Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-navy-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AppLayout;
