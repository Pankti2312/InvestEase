import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity, AlertTriangle, RefreshCcw, CreditCard, LifeBuoy, Calendar, DollarSign } from 'lucide-react';
import api from '../services/api';

const SIPs = () => {
  const [sips, setSips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [sipFormData, setSipFormData] = useState({
    fundName: 'SBI Bluechip Fund',
    amount: '',
    frequency: 'Monthly'
  });

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post('/sips', sipFormData);
      setShowCreateModal(false);
      setSipFormData({
        fundName: 'SBI Bluechip Fund',
        amount: '',
        frequency: 'Monthly'
      });
      fetchSIPs();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to register SIP');
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    fetchSIPs();
  }, []);

  const fetchSIPs = async () => {
    try {
      const response = await api.get('/sips');
      setSips(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async (id) => {
    setRetrying(id);
    try {
      await api.post(`/sips/${id}/retry`);
      fetchSIPs(); // Refresh the list
    } catch (error) {
      console.error('Failed to retry SIP', error);
      alert('Failed to retry payment. Please contact support.');
    } finally {
      setRetrying(null);
    }
  };

  const handleUpdateMandate = () => {
    alert('Redirecting to your bank\'s secure mandate portal... (This is a mock action)');
  };

  if (loading) return <div>Loading your Systematic Investment Plans...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 font-outfit">Systematic Investment Plans (SIPs)</h1>
          <p className="text-navy-500 text-sm">Manage your recurring investments seamlessly.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary py-2.5 px-5 rounded-2xl font-bold flex items-center gap-1.5 shadow-sm text-sm"
        >
          + Create SIP
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {sips.map((sip) => (
          <div 
            key={sip._id} 
            className={`card flex flex-col justify-between ${
              sip.status === 'Failed' 
                ? 'border-red-300 shadow-[0_0_0_1px_rgba(239,68,68,0.3)] bg-red-50/10' 
                : ''
            }`}
          >
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${sip.status === 'Failed' ? 'bg-red-100 text-red-600' : 'bg-teal-50 text-teal-600'}`}>
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-navy-900">{sip.fundName}</h3>
                    <p className="text-xs text-navy-500">{sip.frequency} Investment</p>
                  </div>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                  sip.status === 'Active' ? 'bg-green-50 border-green-200 text-green-700' :
                  sip.status === 'Failed' ? 'bg-red-50 border-red-200 text-red-700' :
                  'bg-gray-50 border-gray-200 text-gray-700'
                }`}>
                  {sip.status}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-navy-50 p-3 rounded-lg border border-navy-100">
                  <p className="text-xs text-navy-500 mb-1 flex items-center gap-1"><DollarSign className="w-3 h-3" /> Amount</p>
                  <p className="font-semibold text-navy-900">₹{sip.amount.toLocaleString()}</p>
                </div>
                <div className="bg-navy-50 p-3 rounded-lg border border-navy-100">
                  <p className="text-xs text-navy-500 mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Next Debit</p>
                  <p className="font-semibold text-navy-900">{new Date(sip.nextDebit).toLocaleDateString()}</p>
                </div>
              </div>

              {sip.status === 'Failed' && (
                <div className="mb-6 bg-red-50 border border-red-200 p-4 rounded-lg">
                  <h4 className="text-red-800 font-semibold flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4" /> Action Required
                  </h4>
                  <p className="text-sm text-red-600 mb-4">
                    Reason: <span className="font-medium">{sip.failureReason || 'Payment rejected by bank.'}</span>
                  </p>
                  
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => handleRetry(sip._id)}
                      disabled={retrying === sip._id}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <RefreshCcw className={`w-4 h-4 ${retrying === sip._id ? 'animate-spin' : ''}`} />
                      {retrying === sip._id ? 'Retrying...' : 'Retry Payment'}
                    </button>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={handleUpdateMandate}
                        className="flex-1 bg-white hover:bg-red-50 text-red-700 border border-red-200 font-medium py-2 px-2 rounded-lg transition-colors flex items-center justify-center gap-1 text-xs"
                      >
                        <CreditCard className="w-3.5 h-3.5" /> Mandate
                      </button>
                      <Link 
                        to="/support"
                        className="flex-1 bg-white hover:bg-red-50 text-red-700 border border-red-200 font-medium py-2 px-2 rounded-lg transition-colors flex items-center justify-center gap-1 text-xs"
                      >
                        <LifeBuoy className="w-3.5 h-3.5" /> Support
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {sip.status !== 'Failed' && (
              <div className="pt-4 border-t border-navy-100 flex justify-end">
                <button className="text-sm text-teal-600 hover:text-teal-800 font-medium">View History</button>
              </div>
            )}
          </div>
        ))}

        {sips.length === 0 && (
          <div className="col-span-full card py-12 flex flex-col items-center justify-center text-navy-500 text-center">
            <Activity className="w-12 h-12 text-navy-200 mb-4" />
            <h3 className="text-lg font-semibold text-navy-900">No Active SIPs</h3>
            <p className="mt-1 max-w-md">You haven't set up any Systematic Investment Plans yet. SIPs are a great way to build wealth steadily over time.</p>
          </div>
        )}
      </div>
      {/* Create SIP Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-150 transform transition-all animate-scale-up">
            <div className="flex justify-between items-center pb-4 border-b border-gray-150">
              <h3 className="text-lg font-bold text-navy-900 font-outfit">Set Up Systematic Investment Plan (SIP)</h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-navy-400 hover:text-navy-950 bg-gray-100 hover:bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-navy-700 uppercase mb-1">Select Mutual Fund</label>
                <select
                  value={sipFormData.fundName}
                  onChange={(e) => setSipFormData({ ...sipFormData, fundName: e.target.value })}
                  className="input-field py-2.5 rounded-xl border-gray-200"
                >
                  <option value="SBI Bluechip Fund">SBI Bluechip Fund (Equity)</option>
                  <option value="Axis Midcap Growth Fund">Axis Midcap Growth Fund (Equity)</option>
                  <option value="Axis Strategic Debt Fund">Axis Strategic Debt Fund (Debt)</option>
                  <option value="HDFC Liquid Fund">HDFC Liquid Fund (Liquid)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy-700 uppercase mb-1">Frequency</label>
                  <select
                    value={sipFormData.frequency}
                    onChange={(e) => setSipFormData({ ...sipFormData, frequency: e.target.value })}
                    className="input-field py-2.5 rounded-xl border-gray-200 font-semibold"
                  >
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy-700 uppercase mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    value={sipFormData.amount}
                    onChange={(e) => setSipFormData({ ...sipFormData, amount: e.target.value })}
                    placeholder="Min. ₹500"
                    min="500"
                    className="input-field py-2.5 rounded-xl border-gray-200 font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div className="text-xs text-navy-500 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                <p className="font-semibold">Note on Mandate Auto-Debit:</p>
                <p className="mt-0.5">By registering this SIP, you authorize InvestEase to schedule auto-debit payments from your linked bank account.</p>
              </div>

              <button
                type="submit"
                disabled={creating || !sipFormData.amount}
                className="w-full btn-primary py-3 rounded-2xl font-bold transition-all disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
              >
                {creating ? 'Registering SIP...' : 'Confirm & Set Up SIP'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SIPs;
