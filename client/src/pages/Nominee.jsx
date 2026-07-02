import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { TableSkeleton } from '../components/SkeletonLoader';
import api from '../services/api';

const Nominee = () => {
  const [nominees, setNominees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    relationship: 'Spouse',
    dob: '',
    mobile: '',
    email: '',
    share: 100
  });

  useEffect(() => {
    fetchNominees();
  }, []);

  const fetchNominees = async () => {
    try {
      const response = await api.get('/nominees');
      setNominees(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const currentTotalShare = nominees.reduce((sum, n) => sum + n.share, 0);

  const openModal = (nominee = null) => {
    if (nominee) {
      setEditingId(nominee._id);
      setFormData({
        name: nominee.name,
        relationship: nominee.relationship,
        dob: nominee.dob.split('T')[0],
        mobile: nominee.mobile,
        email: nominee.email,
        share: nominee.share
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        relationship: 'Spouse',
        dob: '',
        mobile: '',
        email: '',
        share: Math.max(0, 100 - currentTotalShare) // Default to remaining share
      });
    }
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // Frontend validation
    const otherShares = nominees
      .filter(n => n._id !== editingId)
      .reduce((sum, n) => sum + n.share, 0);

    if (otherShares + Number(formData.share) > 100) {
      setError(`Total share cannot exceed 100%. Maximum allowed is ${100 - otherShares}%.`);
      setSubmitting(false);
      return;
    }

    // Save previous list for rollback
    const previousNominees = [...nominees];

    // Build optimistic nominee
    const optimisticNominee = {
      _id: editingId || `temp-${Math.random().toString()}`,
      name: formData.name,
      relationship: formData.relationship,
      dob: formData.dob,
      mobile: formData.mobile,
      email: formData.email,
      share: Number(formData.share)
    };

    // Optimistically update UI
    if (editingId) {
      setNominees(nominees.map(n => n._id === editingId ? optimisticNominee : n));
    } else {
      setNominees([...nominees, optimisticNominee]);
    }
    
    setShowModal(false);

    try {
      if (editingId) {
        await api.put(`/nominees/${editingId}`, formData);
      } else {
        await api.post('/nominees', formData);
      }
      fetchNominees(); // Sync with server database values
    } catch (err) {
      // Rollback to previous state on failure
      setNominees(previousNominees);
      alert(err.response?.data?.message || 'Error saving nominee');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this nominee?')) {
      const previousNominees = [...nominees];
      
      // Optimistically remove from state
      setNominees(nominees.filter(n => n._id !== id));

      try {
        await api.delete(`/nominees/${id}`);
      } catch (err) {
        // Rollback on error
        setNominees(previousNominees);
        alert(err.response?.data?.message || 'Failed to delete nominee');
      }
    }
  };

  if (loading) return <TableSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Manage Nominees</h1>
          <p className="text-navy-500">Ensure your investments are securely passed on.</p>
        </div>
        <button 
          onClick={() => openModal()}
          disabled={currentTotalShare >= 100}
          className={`btn-primary flex items-center gap-2 ${currentTotalShare >= 100 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Plus className="w-4 h-4" />
          Add Nominee
        </button>
      </div>

      {currentTotalShare >= 100 && (
        <div className="bg-blue-50 text-blue-700 p-4 rounded-lg border border-blue-200">
          You have fully allocated 100% of your shares. To add a new nominee, edit existing shares first.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nominees.map((nominee) => (
          <div key={nominee._id} className="card flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-navy-900">{nominee.name}</h3>
                  <p className="text-sm text-navy-500">{nominee.relationship}</p>
                </div>
                <div className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm font-bold">
                  {nominee.share}% Share
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-navy-600 mb-6">
                <p><span className="font-medium text-navy-700">DOB:</span> {new Date(nominee.dob).toLocaleDateString()}</p>
                <p><span className="font-medium text-navy-700">Mobile:</span> {nominee.mobile}</p>
                <p><span className="font-medium text-navy-700">Email:</span> {nominee.email}</p>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-navy-100">
              <button 
                onClick={() => openModal(nominee)}
                className="text-navy-500 hover:text-teal-600 transition-colors p-2"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleDelete(nominee._id)}
                className="text-navy-500 hover:text-red-600 transition-colors p-2"
                title="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {nominees.length === 0 && (
          <div className="col-span-full card py-12 flex flex-col items-center justify-center text-navy-500 text-center">
            <p>You haven't added any nominees yet.</p>
            <p className="text-sm mt-1">We strongly recommend adding at least one nominee.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-navy-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="p-6 border-b border-navy-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-navy-900">{editingId ? 'Edit Nominee' : 'Add Nominee'}</h2>
              <button onClick={() => setShowModal(false)} className="text-navy-400 hover:text-navy-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">{error}</div>}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1">Full Name</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1">Relationship</label>
                    <select value={formData.relationship} onChange={e => setFormData({...formData, relationship: e.target.value})} className="input-field" required>
                      <option value="Spouse">Spouse</option>
                      <option value="Son">Son</option>
                      <option value="Daughter">Daughter</option>
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Brother">Brother</option>
                      <option value="Sister">Sister</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1">Date of Birth</label>
                    <input type="date" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1">Share %</label>
                    <input type="number" min="1" max="100" value={formData.share} onChange={e => setFormData({...formData, share: e.target.value})} className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1">Mobile Number</label>
                    <input type="tel" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1">Email Address</label>
                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="input-field" required />
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                  <button type="submit" disabled={submitting} className="btn-primary">
                    {submitting ? 'Saving...' : 'Save Nominee'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Nominee;
