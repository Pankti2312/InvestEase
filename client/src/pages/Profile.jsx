import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, ShieldCheck, CheckCircle, AlertCircle } from 'lucide-react';
import { TableSkeleton } from '../components/SkeletonLoader';
import api from '../services/api';

const Profile = () => {
  const { user, login } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '', // Disabled field
    mobile: '',
    password: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
        mobile: user.mobile
      }));
      setLoading(false);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      return setMessage({ type: 'error', text: 'Passwords do not match.' });
    }

    setSaving(true);
    
    try {
      const { data } = await api.put('/auth/profile', {
        name: formData.name,
        mobile: formData.mobile,
        password: formData.password || undefined
      });
      
      // Update global context
      login(data);
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Error updating profile.' 
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <TableSkeleton />;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">User Profile</h1>
        <p className="text-navy-500">Manage your personal information and security settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Sidebar Info Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="card text-center flex flex-col items-center">
            <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl font-bold text-teal-700">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <h3 className="text-xl font-bold text-navy-900">{user?.name}</h3>
            <p className="text-navy-500 text-sm mb-4">{user?.email}</p>
            
            <div className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center justify-center gap-2 w-full ${
              user?.kycStatus === 'Approved' ? 'bg-green-50 text-green-700 border border-green-200' :
              user?.kycStatus === 'Pending' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
              'bg-red-50 text-red-700 border border-red-200'
            }`}>
              <ShieldCheck className="w-4 h-4" />
              KYC {user?.kycStatus}
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="md:col-span-2 card">
          <h3 className="text-lg font-bold text-navy-900 mb-6 border-b border-navy-100 pb-4">Personal Details</h3>
          
          {message.text && (
            <div className={`p-4 rounded-lg mb-6 flex items-start gap-3 border ${
              message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
            }`}>
              {message.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1 flex items-center gap-2">
                  <User className="w-4 h-4" /> Full Name
                </label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name} 
                  onChange={handleChange}
                  className="input-field" 
                  required 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1 flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email Address (Cannot be changed)
                </label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email} 
                  className="input-field bg-navy-50 text-navy-500 cursor-not-allowed" 
                  disabled 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1 flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Mobile Number
                </label>
                <input 
                  type="tel" 
                  name="mobile"
                  value={formData.mobile} 
                  onChange={handleChange}
                  className="input-field" 
                  required 
                />
              </div>
            </div>

            <div className="pt-6 border-t border-navy-100">
              <h4 className="font-semibold text-navy-900 mb-4">Change Password (Optional)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">New Password</label>
                  <input 
                    type="password" 
                    name="password"
                    value={formData.password} 
                    onChange={handleChange}
                    className="input-field" 
                    placeholder="Leave blank to keep current"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">Confirm New Password</label>
                  <input 
                    type="password" 
                    name="confirmPassword"
                    value={formData.confirmPassword} 
                    onChange={handleChange}
                    className="input-field" 
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                type="submit" 
                disabled={saving}
                className="btn-primary w-full md:w-auto"
              >
                {saving ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
