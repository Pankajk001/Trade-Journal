import { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import PageHeader from '../components/ui/PageHeader';
import FormInput from '../components/ui/FormInput';
import ImageUploadBox from '../components/ui/ImageUploadBox';
import { AuthContext } from '../context/AuthContext';

const Settings = () => {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePic: ''
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.put('/api/auth/me', {
        name: formData.name,
        email: formData.email,
        password: formData.password || undefined,
        profilePic: formData.profilePic || undefined
      });

      setUser(data);
      setSuccess('Profile updated successfully!');
      setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <PageHeader title="Account Settings" />

      {error && <div className="bg-[#1c1c1c] text-red-500 p-4 rounded-lg mb-6 [html:not(.dark)_&]:bg-red-50 [html:not(.dark)_&]:text-red-600 [html:not(.dark)_&]:border [html:not(.dark)_&]:border-red-200">{error}</div>}
      {success && <div className="bg-[#1c1c1c] text-green-500 p-4 rounded-lg mb-6 [html:not(.dark)_&]:bg-green-50 [html:not(.dark)_&]:text-green-600 [html:not(.dark)_&]:border [html:not(.dark)_&]:border-green-200">{success}</div>}

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#1c1c1c] rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.3)] border border-gray-700/50 overflow-hidden [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200 [html:not(.dark)_&]:shadow-sm"
      >
        <div className="p-6 border-b border-gray-700/50 bg-[#1c1c1c]/50 [html:not(.dark)_&]:bg-slate-50 [html:not(.dark)_&]:border-slate-200">
          <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 [html:not(.dark)_&]:from-slate-900 [html:not(.dark)_&]:to-slate-700">Profile Information</h2>
          <p className="text-sm text-gray-500 [html:not(.dark)_&]:text-slate-600 mt-1">Update your account's profile information and email address.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-8">
            <h3 className="text-gray-400 [html:not(.dark)_&]:text-slate-600 text-sm font-semibold mb-4">Profile Picture (Optional)</h3>
            <div className="w-48">
              <ImageUploadBox 
                label="Avatar" 
                name="profilePic" 
                onChange={handleFileChange} 
                previewUrl={formData.profilePic} 
              />
            </div>
          </div>
          <div className="border-t border-gray-700/50 [html:not(.dark)_&]:border-slate-200 pt-6 mb-4"></div>
          
          <FormInput 
            label="Full Name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
          />
          <FormInput 
            type="email"
            label="Email Address" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />

          <div className="pt-6 mt-6 border-t border-gray-700/50 [html:not(.dark)_&]:border-slate-200">
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 [html:not(.dark)_&]:from-slate-900 [html:not(.dark)_&]:to-slate-700 mb-2">Update Password</h3>
            <p className="text-sm text-gray-500 [html:not(.dark)_&]:text-slate-600 mb-6">Ensure your account is using a long, random password to stay secure.</p>
            
            <FormInput 
              type="password"
              label="New Password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              placeholder="Leave blank to keep current password"
            />
            <FormInput 
              type="password"
              label="Confirm New Password" 
              name="confirmPassword" 
              value={formData.confirmPassword} 
              onChange={handleChange} 
            />
          </div>

          <div className="pt-6 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-2.5 px-8 rounded-lg shadow-lg shadow-orange-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Settings;
