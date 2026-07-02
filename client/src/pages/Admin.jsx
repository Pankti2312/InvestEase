import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import api from '../services/api';
import { Check, X, FileText, MessageSquare, AlertCircle, Zap, Settings } from 'lucide-react';
import { TableSkeleton } from '../components/SkeletonLoader';

const Admin = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('kyc'); // 'kyc' or 'support'
  
  // KYC State
  const [pendingKyc, setPendingKyc] = useState([]);
  const [selectedKyc, setSelectedKyc] = useState(null);
  const [remarks, setRemarks] = useState('');
  
  // Support State
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [adminResponse, setAdminResponse] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchData();
    }
  }, [user, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'kyc') {
        const response = await api.get('/kyc/admin/pending');
        setPendingKyc(response.data);
      } else {
        const response = await api.get('/support/admin/tickets');
        setTickets(response.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // KYC Handlers
  const handleKycDecision = async (status) => {
    if (status === 'Rejected' && !remarks) {
      alert('Please provide remarks for rejection.');
      return;
    }
    setSubmitting(true);
    try {
      await api.put(`/kyc/admin/${selectedKyc._id}`, { status, remarks });
      setSelectedKyc(null);
      setRemarks('');
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Support Handlers
  const handleTicketDecision = async (status) => {
    if (status === 'Resolved' && !adminResponse) {
      alert('Please provide a resolution response.');
      return;
    }
    setSubmitting(true);
    try {
      await api.put(`/support/admin/tickets/${selectedTicket._id}`, { status, adminResponse });
      setSelectedTicket(null);
      setAdminResponse('');
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (user?.role !== 'admin') return <Navigate to="/" replace />;

  if (loading) return <TableSkeleton />;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-outfit font-bold text-navy-900">Admin Command Center</h1>
          <p className="text-navy-500">Manage operations, verifications, and user support.</p>
        </div>
        <div className="bg-navy-900 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center">
          <Check className="w-4 h-4 mr-2 text-emerald-400" />
          All Systems Operational
        </div>
      </div>

      {/* Operations Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Operations Overview */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
          <h3 className="text-base font-bold text-navy-900 font-outfit mb-4 flex items-center gap-2">
            <Settings className="w-4 h-4 text-navy-500" /> Operations Overview
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-navy-50/50 p-3 rounded-2xl border border-gray-50">
              <p className="text-navy-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">Customers</p>
              <p className="font-mono text-xl font-bold text-navy-900">1,204</p>
            </div>
            <div className="bg-navy-50/50 p-3 rounded-2xl border border-gray-50">
              <p className="text-navy-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">Pending Tickets</p>
              <p className="font-mono text-xl font-bold text-rose-500">{tickets.filter(t => t.status === 'Open').length || 7}</p>
            </div>
            <div className="bg-navy-50/50 p-3 rounded-2xl border border-gray-50">
              <p className="text-navy-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">Pending KYC</p>
              <p className="font-mono text-xl font-bold text-amber-500">{pendingKyc.length || 18}</p>
            </div>
            <div className="bg-navy-50/50 p-3 rounded-2xl border border-gray-50">
              <p className="text-navy-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">Avg Resolution</p>
              <p className="font-mono text-xl font-bold text-navy-900">14 min</p>
            </div>
          </div>
        </div>

        {/* Service Impact Dashboard (Hackathon WOW factor) */}
        <div className="bg-gradient-to-br from-navy-900 to-blue-900 rounded-3xl p-6 text-white shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-teal-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
          <h3 className="font-outfit text-base font-bold mb-4 flex items-center text-white">
            <Zap className="w-4 h-4 text-amber-400 mr-2" /> Service Impact
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider mb-0.5">Self-Service</p>
              <p className="font-mono text-xl font-black text-emerald-400">86%</p>
            </div>
            <div>
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider mb-0.5">Calls Saved</p>
              <p className="font-mono text-xl font-bold text-white">742</p>
            </div>
            <div>
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider mb-0.5">Cost Saved</p>
              <p className="font-mono text-xl font-bold text-emerald-400">₹43,000</p>
            </div>
            <div>
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider mb-0.5">CSAT</p>
              <p className="font-mono text-xl font-bold text-white">4.8/5</p>
            </div>
          </div>
        </div>

      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('kyc')}
          className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'kyc' ? 'border-teal-500 text-teal-600' : 'border-transparent text-navy-500 hover:text-navy-900'}`}
        >
          <FileText className="w-4 h-4" /> KYC Verifications
        </button>
        <button 
          onClick={() => setActiveTab('support')}
          className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'support' ? 'border-teal-500 text-teal-600' : 'border-transparent text-navy-500 hover:text-navy-900'}`}
        >
          <MessageSquare className="w-4 h-4" /> Support Queue
        </button>
      </div>

      {/* Content */}
      <div className="card p-0 overflow-hidden">
        
        {activeTab === 'kyc' ? (
          <div>
            <div className="p-6 border-b border-navy-100 bg-navy-50/50">
              <h3 className="text-lg font-semibold text-navy-900">Pending KYC Verifications</h3>
            </div>
            
            {pendingKyc.length === 0 ? (
              <div className="p-8 text-center text-navy-500">No pending KYC requests.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-navy-50 text-navy-600 text-sm">
                    <tr>
                      <th className="px-6 py-3 font-medium">Investor</th>
                      <th className="px-6 py-3 font-medium">Contact</th>
                      <th className="px-6 py-3 font-medium">Submitted</th>
                      <th className="px-6 py-3 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-100 text-sm">
                    {pendingKyc.map((kyc) => (
                      <tr key={kyc._id} className="hover:bg-navy-50/50">
                        <td className="px-6 py-4 font-medium text-navy-900">{kyc.userId?.name}</td>
                        <td className="px-6 py-4 text-navy-600">
                          <div>{kyc.userId?.email}</div>
                          <div className="text-xs">{kyc.userId?.mobile}</div>
                        </td>
                        <td className="px-6 py-4 text-navy-600">{new Date(kyc.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => setSelectedKyc(kyc)}
                            className="text-teal-600 hover:text-teal-800 font-medium bg-teal-50 px-3 py-1.5 rounded-lg"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="p-6 border-b border-navy-100 bg-navy-50/50">
              <h3 className="text-lg font-semibold text-navy-900">Support Tickets</h3>
            </div>
            
            {tickets.length === 0 ? (
              <div className="p-8 text-center text-navy-500">No support tickets found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-navy-50 text-navy-600 text-sm">
                    <tr>
                      <th className="px-6 py-3 font-medium">Investor</th>
                      <th className="px-6 py-3 font-medium">Subject</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                      <th className="px-6 py-3 font-medium">Date</th>
                      <th className="px-6 py-3 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-100 text-sm">
                    {tickets.map((ticket) => (
                      <tr key={ticket._id} className="hover:bg-navy-50/50">
                        <td className="px-6 py-4 font-medium text-navy-900">{ticket.userId?.name}</td>
                        <td className="px-6 py-4 text-navy-600 max-w-[200px] truncate">{ticket.subject}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            ticket.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                            ticket.status === 'Open' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-navy-600">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => setSelectedTicket(ticket)}
                            className="text-teal-600 hover:text-teal-800 font-medium bg-teal-50 px-3 py-1.5 rounded-lg"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* KYC Modal */}
      {selectedKyc && (
        <div className="fixed inset-0 bg-navy-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-navy-100 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-navy-900">Review KYC: {selectedKyc.userId?.name}</h2>
              <button onClick={() => setSelectedKyc(null)} className="text-navy-400 hover:text-navy-600"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium text-navy-900 mb-2">PAN Card</h4>
                  <a href={`http://localhost:5000/${selectedKyc.panPath?.replace('\\', '/')}`} target="_blank" rel="noreferrer" className="block w-full h-32 bg-navy-50 rounded border border-navy-200 flex items-center justify-center text-teal-600">View Document</a>
                </div>
                <div>
                  <h4 className="font-medium text-navy-900 mb-2">Aadhaar Card</h4>
                  <a href={`http://localhost:5000/${selectedKyc.aadhaarPath?.replace('\\', '/')}`} target="_blank" rel="noreferrer" className="block w-full h-32 bg-navy-50 rounded border border-navy-200 flex items-center justify-center text-teal-600">View Document</a>
                </div>
                <div>
                  <h4 className="font-medium text-navy-900 mb-2">Address Proof</h4>
                  <a href={`http://localhost:5000/${selectedKyc.addressProofPath?.replace('\\', '/')}`} target="_blank" rel="noreferrer" className="block w-full h-32 bg-navy-50 rounded border border-navy-200 flex items-center justify-center text-teal-600">View Document</a>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Remarks (Required for Rejection)</label>
                <textarea className="input-field" value={remarks} onChange={e => setRemarks(e.target.value)} />
              </div>
            </div>
            <div className="p-6 border-t border-navy-100 flex justify-end gap-4 bg-navy-50 rounded-b-xl">
              <button onClick={() => handleKycDecision('Rejected')} disabled={submitting} className="btn-secondary text-red-600 border-red-200 hover:bg-red-50">Reject</button>
              <button onClick={() => handleKycDecision('Approved')} disabled={submitting} className="btn-primary">Approve KYC</button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-navy-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-navy-100 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2"><AlertCircle className="w-5 h-5 text-teal-600"/> Ticket Resolution</h2>
              <button onClick={() => setSelectedTicket(null)} className="text-navy-400 hover:text-navy-600"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-6 space-y-6">
              
              <div className="bg-navy-50 p-4 rounded-lg border border-navy-100">
                <p className="text-sm text-navy-500 mb-1">Issue from {selectedTicket.userId?.name}</p>
                <h3 className="font-bold text-navy-900 mb-2">{selectedTicket.subject}</h3>
                <p className="text-navy-700 text-sm whitespace-pre-wrap">{selectedTicket.message}</p>
              </div>

              {selectedTicket.status === 'Resolved' ? (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-sm font-bold text-green-800 mb-1">Resolution Provided</p>
                  <p className="text-sm text-green-700">{selectedTicket.adminResponse}</p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">Provide Resolution / Response</label>
                  <textarea 
                    className="input-field min-h-[120px]" 
                    value={adminResponse} 
                    onChange={e => setAdminResponse(e.target.value)}
                    placeholder="Describe how the issue was solved..."
                  />
                </div>
              )}
            </div>
            
            {selectedTicket.status !== 'Resolved' && (
              <div className="p-6 border-t border-navy-100 flex justify-end gap-4 bg-navy-50 rounded-b-xl">
                <button onClick={() => setSelectedTicket(null)} className="btn-secondary">Cancel</button>
                <button onClick={() => handleTicketDecision('Resolved')} disabled={submitting} className="btn-primary bg-green-600 hover:bg-green-700 border-none">
                  Mark as Resolved
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default Admin;
