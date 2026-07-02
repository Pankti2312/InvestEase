import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import api from '../services/api';
import { Check, X, FileText, MessageSquare, AlertCircle, Zap, Settings, Users, Activity, DollarSign, Clock } from 'lucide-react';
import { TableSkeleton } from '../components/SkeletonLoader';

const Admin = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('kyc'); // 'kyc' or 'support'
  const [adminStats, setAdminStats] = useState(null);
  
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
      const statsRes = await api.get('/admin/dashboard');
      setAdminStats(statsRes.data);

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

      {/* Dynamic Operations Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Platform Metrics */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <h3 className="text-base font-bold text-navy-900 font-outfit mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4 text-navy-500" /> Platform Metrics
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-navy-50/50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><Users className="w-4 h-4" /></div>
                  <span className="text-sm font-medium text-navy-900">Total Investors</span>
                </div>
                <span className="font-mono font-bold text-navy-900">{adminStats?.metrics?.totalInvestors || 0}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-navy-50/50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center"><FileText className="w-4 h-4" /></div>
                  <span className="text-sm font-medium text-navy-900">Pending KYC</span>
                </div>
                <span className="font-mono font-bold text-amber-600">{adminStats?.metrics?.pendingKycCount || 0}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-navy-50/50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center"><MessageSquare className="w-4 h-4" /></div>
                  <span className="text-sm font-medium text-navy-900">Pending Tickets</span>
                </div>
                <span className="font-mono font-bold text-rose-600">{adminStats?.metrics?.pendingTicketsCount || 0}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-navy-50/50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><Activity className="w-4 h-4" /></div>
                  <span className="text-sm font-medium text-navy-900">Active SIPs</span>
                </div>
                <span className="font-mono font-bold text-emerald-600">{adminStats?.metrics?.activeSipsCount || 0}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-teal-50 rounded-2xl border border-teal-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center"><DollarSign className="w-4 h-4" /></div>
                  <span className="text-sm font-bold text-teal-900">Total Investments</span>
                </div>
                <span className="font-mono font-black text-teal-700">₹{adminStats?.metrics?.totalInvestments?.toLocaleString() || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Recent Registrations */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-base font-bold text-navy-900 font-outfit mb-4">Recent Registrations</h3>
              <div className="space-y-3">
                {adminStats?.recentActivity?.registrations?.map((user) => (
                  <div key={user._id} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium text-navy-900">{user.name}</p>
                      <p className="text-xs text-navy-500">{user.email}</p>
                    </div>
                    <span className="text-xs font-medium text-navy-400 whitespace-nowrap bg-gray-50 px-2 py-1 rounded-md">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Latest KYC */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-base font-bold text-navy-900 font-outfit mb-4">Latest KYC</h3>
              <div className="space-y-3">
                {adminStats?.recentActivity?.kyc?.map((kyc) => (
                  <div key={kyc._id} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                    <p className="font-medium text-navy-900">{kyc.userId?.name || 'Unknown'}</p>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                      kyc.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                      kyc.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {kyc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Latest Support */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-base font-bold text-navy-900 font-outfit mb-4">Latest Support Requests</h3>
              <div className="space-y-3">
                {adminStats?.recentActivity?.support?.map((ticket) => (
                  <div key={ticket._id} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="font-medium text-navy-900 truncate">{ticket.subject}</p>
                      <p className="text-xs text-navy-500">{ticket.userId?.name}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md whitespace-nowrap ${
                      ticket.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' :
                      ticket.status === 'Open' ? 'bg-rose-100 text-rose-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Investments */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-base font-bold text-navy-900 font-outfit mb-4">Recent Investments</h3>
              <div className="space-y-3">
                {adminStats?.recentActivity?.investments?.map((inv) => (
                  <div key={inv._id} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="font-medium text-navy-900 truncate">{inv.fundName}</p>
                      <p className="text-xs text-navy-500">{inv.userId?.name}</p>
                    </div>
                    <span className="font-mono font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-md whitespace-nowrap">
                      ₹{inv.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
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
