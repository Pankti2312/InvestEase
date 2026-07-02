import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { HelpCircle, ChevronRight, MessageSquare, ArrowLeft, CheckCircle, RefreshCcw, FileText, CreditCard, AlertTriangle, LifeBuoy, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Support = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Wizard State
  const [step, setStep] = useState(1); // 1: Select Issue, 2: Resolution/Questions, 3: Form, 4: Success/Thank You
  const [selectedIssue, setSelectedIssue] = useState('');
  
  // Node state fetched from backend
  const [currentNode, setCurrentNode] = useState(null);
  const [nodeHistory, setNodeHistory] = useState([]);
  const [fetchingNode, setFetchingNode] = useState(false);

  // Ticket Form State
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/support');
      setRequests(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Start guided flow by fetching root node or target leaf
  const startFlow = async () => {
    setFetchingNode(true);
    let startNodeId = 'root';
    
    // Map initial user selection to backend node IDs
    if (selectedIssue === 'SIP Failed') startNodeId = 'sip_bank_change';
    else if (selectedIssue === 'Statement Missing') startNodeId = 'statement_issue';
    else if (selectedIssue === 'KYC') startNodeId = 'kyc_issue';
    else if (selectedIssue === 'Nominee') startNodeId = 'nominee_issue';

    try {
      const res = await api.get(`/assistant/node/${startNodeId}`);
      setCurrentNode(res.data);
      setNodeHistory([]);
      setStep(2);
    } catch (err) {
      console.error(err);
      alert('Failed to load resolution tree from backend.');
    } finally {
      setFetchingNode(false);
    }
  };

  // Navigate to next node in the tree
  const handleOptionSelect = async (nextNodeId) => {
    setFetchingNode(true);
    try {
      const res = await api.get(`/assistant/node/${nextNodeId}`);
      setNodeHistory([...nodeHistory, currentNode]);
      setCurrentNode(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load next step.');
    } finally {
      setFetchingNode(false);
    }
  };

  const handleBack = () => {
    if (nodeHistory.length > 0) {
      const prevHistory = [...nodeHistory];
      const prevNode = prevHistory.pop();
      setCurrentNode(prevNode);
      setNodeHistory(prevHistory);
    } else {
      setStep(1);
    }
  };

  // Log resolution choice (deflection metrics)
  const logDeflection = async (resolved) => {
    try {
      await api.post('/assistant/log', {
        issueType: selectedIssue || 'General',
        resolvedWithoutTicket: resolved
      });
    } catch (err) {
      console.error('Failed to log deflection:', err);
    }
  };

  const handleResolved = async () => {
    await logDeflection(true);
    setSuccess(false);
    setStep(4);
  };

  const handleEscalate = async () => {
    await logDeflection(false);
    setTicketSubject(`${selectedIssue || 'General'} Resolution Escaled`);
    setStep(3);
  };

  const submitTicket = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await api.post('/support', {
        subject: ticketSubject || `${selectedIssue} Issue`,
        message: ticketMessage
      });
      setSuccess(true);
      fetchRequests();
      setStep(4);
      // Reset after 3 seconds
      setTimeout(() => {
        setSuccess(false);
        setTicketMessage('');
        setTicketSubject('');
        setSelectedIssue('');
        setCurrentNode(null);
        setStep(1);
      }, 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to submit ticket');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedIssue('');
    setTicketSubject('');
    setTicketMessage('');
    setCurrentNode(null);
    setStep(1);
  };

  if (loading) return (
    <div className="animate-pulse space-y-6">
      <div className="h-10 bg-gray-200 w-1/4 rounded"></div>
      <div className="h-64 bg-gray-200 rounded-3xl"></div>
    </div>
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 bg-[#F5F7FB]">
      <div>
        <h1 className="text-2xl font-outfit font-bold text-navy-900">Guided Resolution Center</h1>
        <p className="text-navy-500 text-sm">Resolve issues instantly using our smart self-service assistant.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Guided Assistant Panel (Server-driven Wizard Flow) */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
            <h2 className="font-bold text-navy-900 flex items-center gap-2 font-outfit">
              <LifeBuoy className="w-5 h-5 text-teal-600 animate-spin" style={{ animationDuration: '3s' }} />
              Guided Resolution Wizard
            </h2>
            {step > 1 && step < 4 && (
              <button 
                onClick={handleBack}
                disabled={fetchingNode}
                className="text-xs text-navy-500 hover:text-navy-900 flex items-center gap-1 font-bold disabled:opacity-50"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            )}
          </div>
          
          <div className="min-h-[300px] flex flex-col justify-center">
            {fetchingNode ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
                <p className="text-xs text-navy-500 mt-2 font-bold uppercase tracking-wider">Syncing with Assistant...</p>
              </div>
            ) : (
              <>
                {/* Step 1: Select Issue */}
                {step === 1 && (
                  <div className="space-y-6 animate-fade-in">
                    <h3 className="text-base font-bold text-navy-900 font-outfit">What issue are you facing?</h3>
                    <div className="space-y-3">
                      {['SIP Failed', 'Statement Missing', 'KYC', 'Nominee'].map(issue => (
                        <label 
                          key={issue}
                          className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer bg-white ${
                            selectedIssue === issue 
                              ? 'border-teal-500 bg-teal-50/30 ring-2 ring-teal-500/20' 
                              : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <input 
                            type="radio" 
                            name="issueType" 
                            value={issue}
                            checked={selectedIssue === issue}
                            onChange={() => setSelectedIssue(issue)}
                            className="w-4.5 h-4.5 text-teal-600 focus:ring-teal-500 border-gray-300"
                          />
                          <span className="text-sm font-semibold text-navy-800">{issue}</span>
                        </label>
                      ))}
                    </div>
                    
                    <button
                      disabled={!selectedIssue}
                      onClick={startFlow}
                      className="w-full btn-primary py-3 rounded-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2"
                    >
                      Continue <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Step 2: Suggested Resolution & Questions (Server Driven) */}
                {step === 2 && currentNode && (
                  <div className="space-y-6 animate-fade-in py-2">
                    {currentNode.type === 'action' ? (
                      /* Leaf Action Node */
                      <div className="text-center py-4 space-y-4">
                        <div className="w-14 h-14 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-2 text-teal-600">
                          <Zap className="w-7 h-7" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-navy-900 font-outfit">{currentNode.title}</h3>
                          <p className="text-xs font-medium text-navy-500 mt-1 uppercase tracking-widest">Suggested Resolution</p>
                        </div>
                        <p className="text-sm text-navy-600 leading-relaxed max-w-sm mx-auto bg-gray-50 p-4 rounded-2xl border border-gray-100/50">
                          {currentNode.message}
                        </p>
                        
                        <div className="flex flex-col gap-3 max-w-sm mx-auto pt-2">
                          <Link to={currentNode.linkTo} className="btn-primary py-2.5 rounded-xl font-bold flex items-center justify-center gap-2">
                            {currentNode.buttonText} <ChevronRight className="w-4 h-4" />
                          </Link>
                          
                          <div className="pt-4 border-t border-gray-100 mt-2">
                            <p className="text-xs font-bold text-navy-900 mb-3">Resolved?</p>
                            <div className="flex gap-4 justify-center">
                              <button 
                                onClick={handleResolved} 
                                className="px-6 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-bold transition-colors"
                              >
                                Yes, Resolved
                              </button>
                              <button 
                                onClick={handleEscalate} 
                                className="px-6 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold transition-colors"
                              >
                                No, Raise Ticket
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Intermediary Question Node */
                      <div>
                        <h3 className="text-base font-bold text-navy-900 mb-6 font-outfit">{currentNode.question}</h3>
                        <div className="space-y-3">
                          {currentNode.options.map((option, idx) => (
                            <button 
                              key={idx}
                              onClick={() => handleOptionSelect(option.next)}
                              className="w-full text-left px-4 py-4 rounded-2xl border border-gray-100 hover:border-teal-500 hover:bg-teal-50/20 transition-all flex justify-between items-center group bg-white shadow-sm"
                            >
                              <span className="text-sm font-semibold text-navy-850 group-hover:text-teal-700">{option.label}</span>
                              <ChevronRight className="w-4 h-4 text-navy-300 group-hover:text-teal-600 transition-transform group-hover:translate-x-1" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 3: Raise Support Request Form */}
                {step === 3 && (
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <h3 className="text-base font-bold text-navy-900 font-outfit">Raise Support Request</h3>
                      <p className="text-xs text-navy-500 mt-0.5">Please provide specific details to help our team assist you quickly.</p>
                    </div>
                    
                    <form onSubmit={submitTicket} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-navy-700 uppercase mb-1">Subject</label>
                        <input 
                          type="text" 
                          value={ticketSubject}
                          onChange={(e) => setTicketSubject(e.target.value)}
                          className="input-field py-2.5 rounded-xl" 
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-navy-700 uppercase mb-1">Message</label>
                        <textarea 
                          value={ticketMessage}
                          onChange={(e) => setTicketMessage(e.target.value)}
                          className="input-field min-h-[100px] py-2.5 rounded-xl" 
                          required 
                          placeholder="Describe your issue in detail..."
                        />
                      </div>
                      <button type="submit" disabled={submitting} className="btn-primary w-full py-2.5 rounded-xl font-bold">
                        {submitting ? 'Submitting...' : 'Submit Support Request'}
                      </button>
                    </form>
                  </div>
                )}

                {/* Step 4: Success Thank You */}
                {step === 4 && (
                  <div className="text-center py-8 space-y-4 animate-fade-in">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 border border-emerald-100">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-navy-900 font-outfit">Thank You!</h3>
                      <p className="text-sm text-navy-600 max-w-xs mx-auto">
                        {success 
                          ? "Your support ticket has been submitted. Our operations team will respond shortly." 
                          : "We're glad we could help you resolve this issue immediately."
                        }
                      </p>
                    </div>
                    <button 
                      onClick={handleReset} 
                      className="text-xs font-bold text-teal-600 hover:underline pt-4"
                    >
                      Start New Query
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Previous Tickets Panel */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-0 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow duration-300">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-base font-bold text-navy-900 flex items-center gap-2 font-outfit">
              <MessageSquare className="w-5 h-5 text-navy-400" />
              Your Support Tickets
            </h3>
          </div>
          
          {requests.length === 0 ? (
            <div className="p-8 text-center text-navy-500 flex-1 flex flex-col justify-center min-h-[300px]">
              <p className="text-sm font-medium">You haven't raised any tickets yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-navy-500 text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3">Subject</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs font-semibold">
                  {requests.map((req) => (
                    <tr key={req._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-navy-900">
                        {req.subject}
                        {req.adminResponse && (
                          <div className="mt-2 text-xs bg-teal-50 text-teal-800 p-3 rounded-xl border border-teal-100/50 font-medium">
                            <strong>Response:</strong> {req.adminResponse}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                          req.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700' :
                          req.status === 'Open' ? 'bg-amber-50 text-amber-700' :
                          'bg-blue-50 text-blue-700'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-navy-400 whitespace-nowrap font-mono">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Support;
