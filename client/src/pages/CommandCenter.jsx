import { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { 
  TrendingUp, Calendar, ShieldCheck, Clock, FileText, Zap, 
  AlertTriangle, Bell, CheckCircle, ChevronRight, Download, 
  LifeBuoy, UserPlus, ArrowUpRight, ArrowDownRight, UserCircle, Settings,
  AlertCircle, ShieldAlert, Award, CreditCard
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const CommandCenter = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [animatedValue, setAnimatedValue] = useState(0);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [buying, setBuying] = useState(false);
  const [buyFormData, setBuyFormData] = useState({
    fundName: 'SBI Bluechip Fund',
    type: 'Equity',
    amount: '',
    nav: '50'
  });

  const handleBuyCategoryChange = (type) => {
    let nav = '50';
    let defaultFund = 'SBI Bluechip Fund';
    if (type === 'Equity') {
      nav = '50';
      defaultFund = 'SBI Bluechip Fund';
    } else if (type === 'Debt') {
      nav = '25';
      defaultFund = 'Axis Strategic Debt Fund';
    } else if (type === 'Liquid') {
      nav = '15';
      defaultFund = 'HDFC Liquid Fund';
    }
    setBuyFormData({
      ...buyFormData,
      type,
      fundName: defaultFund,
      nav
    });
  };

  const handleBuySubmit = async (e) => {
    e.preventDefault();
    setBuying(true);
    try {
      await api.post('/portfolio/invest', buyFormData);
      setShowBuyModal(false);
      setBuyFormData({
        fundName: 'SBI Bluechip Fund',
        type: 'Equity',
        amount: '',
        nav: '50'
      });
      // Refresh dashboard data
      const response = await api.get('/dashboard');
      setData(response.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to complete investment.');
    } finally {
      setBuying(false);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/dashboard');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Simple number count-up animation on load
  useEffect(() => {
    if (data) {
      const target = data.portfolio.totalValue || 524380;
      let start = 0;
      const duration = 1000;
      const increment = target / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setAnimatedValue(target);
          clearInterval(timer);
        } else {
          setAnimatedValue(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [data]);

  const chartData = useMemo(() => {
    if (!data?.portfolio?.allocation) return [];
    return [
      { name: 'Equity', value: data.portfolio.allocation.equity || 0, color: '#0F766E' },
      { name: 'Debt', value: data.portfolio.allocation.debt || 0, color: '#6366F1' },
      { name: 'Liquid', value: data.portfolio.allocation.liquid || 0, color: '#F59E0B' }
    ].filter(a => a.value > 0);
  }, [data]);

  const completedCount = data?.onboarding
    ? (data.onboarding.name ? 1 : 0) +
      (data.onboarding.email ? 1 : 0) +
      (data.onboarding.phone ? 1 : 0) +
      (data.onboarding.kycCompleted ? 1 : 0) +
      (data.onboarding.nomineeAdded ? 1 : 0) +
      (data.onboarding.investmentAdded ? 1 : 0) +
      (data.onboarding.sipCreated ? 1 : 0)
    : 0;
  const percentComplete = Math.round((completedCount / 7) * 100);

  const diversificationScore = useMemo(() => {
    if (!data?.portfolio?.allocation) return 0;
    const { equity = 0, debt = 0, liquid = 0 } = data.portfolio.allocation;
    // Perfect score if spread evenly. Deduct points for heavy concentration
    let score = 100;
    if (equity > 70) score -= 20;
    else if (equity < 30) score -= 10;
    if (debt < 10) score -= 10;
    if (liquid < 5) score -= 10;
    return Math.max(0, score);
  }, [data]);

  if (loading) return (
    <div className="animate-pulse space-y-6">
      <div className="h-64 bg-navy-200 rounded-3xl w-full"></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="h-80 bg-gray-200 rounded-2xl"></div>
        <div className="h-80 bg-gray-200 rounded-2xl"></div>
        <div className="h-80 bg-gray-200 rounded-2xl"></div>
      </div>
    </div>
  );
  
  if (!data) return <div>Failed to load data.</div>;

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const getDayLabel = (dateString) => {
    const d = new Date(dateString);
    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString(undefined, { weekday: 'long' });
  };

  const groupedActivity = data.recentActivity.reduce((acc, act) => {
    const label = getDayLabel(act.createdAt);
    if (!acc[label]) acc[label] = [];
    acc[label].push(act);
    return acc;
  }, {});

  return (
    <div className="space-y-8 pb-12 font-sans bg-[#F5F7FB]">
      
      {/* 1. Hero Banner: Gradient & Summary Story */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0F172A] to-[#1E3A8A] rounded-3xl p-8 shadow-xl text-white transition-all duration-300">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-teal-500 rounded-full blur-[120px] opacity-25 pointer-events-none"></div>
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-outfit font-bold text-white flex items-center gap-2">
                👋 Good Morning, {user?.name.split(' ')[0] || 'Investor'}
              </h1>
              <p className="text-teal-400 text-xs font-bold tracking-widest uppercase mt-1 font-outfit">Investor Command Center</p>
            </div>
            
            {/* Summary Story */}
            <div className="space-y-2 text-white/80 text-sm font-medium border-l-2 border-teal-500/50 pl-4 mt-6">
              {data.insights && data.insights.length > 0 ? (
                <p className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${data.insights[0].type === 'error' ? 'bg-rose-500' : data.insights[0].type === 'warning' ? 'bg-amber-500' : 'bg-teal-400'}`}></span>
                  {data.insights[0].title} - {data.insights[0].message}
                </p>
              ) : (
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Everything looks good today. No critical actions pending.
                </p>
              )}
            </div>
          </div>
          
          <div className="flex flex-col md:items-end justify-end space-y-2">
            <p className="text-white/60 text-xs uppercase tracking-widest font-semibold font-outfit">Portfolio Value</p>
            <h2 className="text-5xl font-mono font-bold tracking-tight">
              ₹{animatedValue.toLocaleString()}
            </h2>
            <p className={`${data.portfolio.todayChange >= 0 ? 'text-emerald-400' : 'text-rose-400'} font-mono font-medium text-sm flex items-center bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-sm shadow-inner`}>
              {data.portfolio.todayChange >= 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />} 
              {data.portfolio.todayChange >= 0 ? '+' : '-'}₹{Math.abs(data.portfolio.todayChange).toLocaleString()} Today
            </p>
          </div>
        </div>
      </div>
      {/* Dynamic Onboarding Checklist */}
      {data && data.onboarding && percentComplete < 100 && (
        <div className="bg-white rounded-3xl border border-teal-100 shadow-sm p-6 space-y-6 animate-fade-in hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-lg font-bold text-navy-900 flex items-center gap-2 font-outfit">
                  <Zap className="w-5 h-5 text-amber-500 animate-bounce" />
                  Welcome to InvestEase! Let's get you set up 👋
                </h3>
                <p className="text-xs text-navy-500">Complete these simple steps to secure your account and start building wealth.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-teal-700 bg-teal-50 border border-teal-100 px-2.5 py-1 rounded-full">
                  {completedCount}/4 Steps
                </span>
                <span className="text-sm font-mono font-black text-teal-600">{percentComplete}%</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-150 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${percentComplete}%` }}
              ></div>
            </div>

            {/* Grid of Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* KYC */}
              <div className={`p-4 rounded-2xl border transition-all ${data.onboarding.kycCompleted ? 'bg-emerald-50/20 border-emerald-100/50 opacity-75' : 'bg-white border-gray-100 hover:border-teal-200'}`}>
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    checked={data.onboarding.kycCompleted} 
                    readOnly 
                    className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 mt-0.5 cursor-default" 
                  />
                  <div>
                    <p className={`text-sm font-bold ${data.onboarding.kycCompleted ? 'text-navy-700 line-through' : 'text-navy-900'}`}>Complete KYC Documentation</p>
                    <p className="text-xs text-navy-500 mt-0.5">Verify your identity to unlock deposits.</p>
                    {!data.onboarding.kycCompleted && (
                      <Link to="/kyc" className="text-xs font-bold text-teal-600 hover:underline mt-2 inline-flex items-center gap-0.5">
                        Start Verification <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* Nominee */}
              <div className={`p-4 rounded-2xl border transition-all ${data.onboarding.nomineeAdded ? 'bg-emerald-50/20 border-emerald-100/50 opacity-75' : 'bg-white border-gray-100 hover:border-teal-200'}`}>
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    checked={data.onboarding.nomineeAdded} 
                    readOnly 
                    className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 mt-0.5 cursor-default" 
                  />
                  <div>
                    <p className={`text-sm font-bold ${data.onboarding.nomineeAdded ? 'text-navy-700 line-through' : 'text-navy-900'}`}>Add Account Nominee</p>
                    <p className="text-xs text-navy-500 mt-0.5">Nominate a beneficiary for safety.</p>
                    {!data.onboarding.nomineeAdded && (
                      <Link to="/nominee" className="text-xs font-bold text-teal-600 hover:underline mt-2 inline-flex items-center gap-0.5">
                        Add Nominee <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* Add Investment */}
              <div className={`p-4 rounded-2xl border transition-all ${data.onboarding.investmentAdded ? 'bg-emerald-50/20 border-emerald-100/50 opacity-75' : 'bg-white border-gray-100 hover:border-teal-200'}`}>
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    checked={data.onboarding.investmentAdded} 
                    readOnly 
                    className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 mt-0.5 cursor-default" 
                  />
                  <div>
                    <p className={`text-sm font-bold ${data.onboarding.investmentAdded ? 'text-navy-700 line-through' : 'text-navy-900'}`}>Make Your First Investment</p>
                    <p className="text-xs text-navy-500 mt-0.5">Start compounding by buying a mutual fund.</p>
                    {!data.onboarding.investmentAdded && (
                      <button onClick={() => setShowBuyModal(true)} className="text-xs font-bold text-teal-600 hover:underline mt-2 inline-flex items-center gap-0.5 bg-transparent border-none p-0 cursor-pointer">
                        Invest Now <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Create SIP */}
              <div className={`p-4 rounded-2xl border transition-all ${data.onboarding.sipCreated ? 'bg-emerald-50/20 border-emerald-100/50 opacity-75' : 'bg-white border-gray-100 hover:border-teal-200'}`}>
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    checked={data.onboarding.sipCreated} 
                    readOnly 
                    className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 mt-0.5 cursor-default" 
                  />
                  <div>
                    <p className={`text-sm font-bold ${data.onboarding.sipCreated ? 'text-navy-700 line-through' : 'text-navy-900'}`}>Start a Systematic Plan (SIP)</p>
                    <p className="text-xs text-navy-500 mt-0.5">Automate recurring investing cycles.</p>
                    {!data.onboarding.sipCreated && (
                      <Link to="/sip" className="text-xs font-bold text-teal-600 hover:underline mt-2 inline-flex items-center gap-0.5">
                        Set Up SIP <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* 2. Top-Level Core Modules (Health, Portfolio & Profile Completion) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Investor Health Centerpiece */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <h3 className="font-outfit font-bold text-lg text-navy-900 mb-4">Investor Health</h3>
          
          <div className="flex items-center gap-6 mb-4">
            <div className="relative w-28 h-28 shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="56" cy="56" r="48" fill="none" stroke="#F1F5F9" strokeWidth="8" />
                <circle 
                  cx="56" cy="56" r="48" fill="none" stroke="#10B981" strokeWidth="8" 
                  strokeDasharray="301.6" 
                  strokeDashoffset={301.6 - (301.6 * data.healthScore.score) / 100} 
                  className="transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col animate-fade-in">
                <span className="text-2xl font-mono font-black text-navy-900 tracking-tighter">{data.healthScore.score}%</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                  data.healthScore.score >= 75 ? 'text-emerald-600' : 
                  data.healthScore.score >= 50 ? 'text-amber-500' : 'text-rose-500'
                }`}>{data.healthScore.label}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full inline-block border ${
                data.healthScore.score >= 75 ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : 
                data.healthScore.score >= 50 ? 'text-amber-700 bg-amber-50 border-amber-100' : 'text-rose-700 bg-rose-50 border-rose-100'
              }`}>
                {data.healthScore.score >= 75 ? 'Healthy Setup' : 'Action Required'}
              </span>
              <p className="text-xs text-navy-500 mt-1">
                {data.healthScore.score === 100 ? 'All setups verified. Perfect score!' : 'Complete onboarding checks to optimize.'}
              </p>
            </div>
          </div>
          
          <div className="space-y-2 border-t border-gray-50 pt-4 flex-1">
            <p className="text-[11px] font-bold text-navy-400 uppercase tracking-wider mb-2">Health Drivers</p>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-navy-700">
              <div className="flex items-center gap-1.5"><CheckCircle className={`w-4 h-4 shrink-0 ${data.onboarding.kycCompleted ? 'text-emerald-500' : 'text-gray-300'}`} /> KYC Verified</div>
              <div className="flex items-center gap-1.5"><CheckCircle className={`w-4 h-4 shrink-0 ${data.onboarding.sipCreated ? 'text-emerald-500' : 'text-gray-300'}`} /> Active SIP</div>
              <div className="flex items-center gap-1.5"><CheckCircle className={`w-4 h-4 shrink-0 ${data.onboarding.nomineeAdded ? 'text-emerald-500' : 'text-gray-300'}`} /> Nominee Added</div>
              <div className="flex items-center gap-1.5"><CheckCircle className={`w-4 h-4 shrink-0 ${percentComplete === 100 ? 'text-emerald-500' : 'text-gray-300'}`} /> Profile Complete</div>
              <div className="flex items-center gap-1.5 col-span-2"><CheckCircle className={`w-4 h-4 shrink-0 ${data.onboarding.investmentAdded ? 'text-emerald-500' : 'text-gray-300'}`} /> Investments Started</div>
            </div>
          </div>
        </div>

        {/* Portfolio Stats (Fintech Style) */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <h3 className="font-outfit font-bold text-lg text-navy-900 mb-4">Portfolio</h3>
          
          <div className="space-y-4 flex-1 flex flex-col justify-center">
            <div>
              <p className="text-navy-400 text-xs font-bold uppercase tracking-wider mb-0.5">Portfolio Value</p>
              <h4 className="text-3xl font-mono font-bold text-navy-900">₹{data.portfolio.totalValue.toLocaleString()}</h4>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-4">
              <div>
                <p className="text-navy-400 text-xs font-bold uppercase tracking-wider mb-0.5">Today's Gain</p>
                <p className={`${data.portfolio.todayChange >= 0 ? 'text-emerald-500' : 'text-rose-500'} text-sm font-mono font-bold flex items-center`}>
                  {data.portfolio.todayChange >= 0 ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5 shrink-0" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5 shrink-0" />} 
                  {data.portfolio.todayChange >= 0 ? '+' : '-'}₹{Math.abs(data.portfolio.todayChange).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-navy-400 text-xs font-bold uppercase tracking-wider mb-0.5">Overall Return</p>
                <p className={`${data.portfolio.overallReturn >= 0 ? 'text-emerald-500' : 'text-rose-500'} text-sm font-mono font-bold flex items-center`}>
                  {data.portfolio.overallReturn >= 0 ? '+' : ''}{data.portfolio.overallReturn}%
                </p>
              </div>
            </div>

            <div className="bg-navy-50 rounded-xl p-3 border border-gray-100/50 mt-2">
              <p className="text-navy-500 text-xs font-bold uppercase tracking-wider mb-0.5">Invested Amount</p>
              <p className="text-lg font-mono font-bold text-navy-800">₹{data.portfolio.investedAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Investor Profile Completion Widget (Differentiator) */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-outfit font-bold text-lg text-navy-900">Profile Completion</h3>
            <span className="text-lg font-mono font-black text-teal-600 bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-100">{percentComplete}%</span>
          </div>

          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-4">
            <div className="bg-teal-600 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${percentComplete}%` }}></div>
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between text-xs font-semibold text-navy-700">
              <span className="flex items-center gap-1.5"><CheckCircle className={`w-4 h-4 ${data.onboarding.name && data.onboarding.email && data.onboarding.phone ? 'text-emerald-500' : 'text-gray-300'}`} /> Personal Details</span>
              <span className={data.onboarding.name && data.onboarding.email && data.onboarding.phone ? "text-navy-400" : "text-amber-500"}>{data.onboarding.name && data.onboarding.email && data.onboarding.phone ? "Complete" : "Pending"}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-navy-700">
              <span className="flex items-center gap-1.5"><CheckCircle className={`w-4 h-4 ${data.onboarding.kycCompleted ? 'text-emerald-500' : 'text-gray-300'}`} /> KYC Verification</span>
              <span className={data.onboarding.kycCompleted ? "text-navy-400" : "text-amber-500"}>{data.onboarding.kycCompleted ? "Verified" : "Pending"}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-navy-700">
              <span className="flex items-center gap-1.5"><CheckCircle className={`w-4 h-4 ${data.onboarding.investmentAdded ? 'text-emerald-500' : 'text-gray-300'}`} /> First Investment</span>
              <span className={data.onboarding.investmentAdded ? "text-navy-400" : "text-amber-500"}>{data.onboarding.investmentAdded ? "Completed" : "Pending"}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-navy-700">
              <span className="flex items-center gap-1.5"><CheckCircle className={`w-4 h-4 ${data.onboarding.sipCreated ? 'text-emerald-500' : 'text-gray-300'}`} /> Active Auto SIP</span>
              <span className={data.onboarding.sipCreated ? "text-navy-400" : "text-amber-500"}>{data.onboarding.sipCreated ? "Active" : "Pending"}</span>
            </div>
            {!data.onboarding.nomineeAdded && (
              <div className="flex items-center justify-between text-xs font-semibold text-navy-700 border-t border-gray-50 pt-2">
                <span className="flex items-center gap-1.5"><AlertCircle className="w-4 h-4 text-amber-500" /> Nominee Missing</span>
                <Link to="/nominee" className="text-teal-600 hover:text-teal-700 font-bold underline">Add Nominee</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Asset Allocation (Donut Chart & Diversification) & What's New */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Asset Allocation */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 lg:col-span-2 flex flex-col justify-between hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <h3 className="font-outfit font-bold text-lg text-navy-900 mb-4">Asset Allocation</h3>
          
          <div className="flex flex-col md:flex-row items-center justify-around gap-6 flex-1">
            <div className="w-full md:w-1/2 h-44 flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={6}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `${value}%`}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="w-full md:w-1/2 space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {chartData.map((asset) => (
                  <div key={asset.name} className="flex items-center justify-between bg-gray-50/50 p-2.5 rounded-xl">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: asset.color }}></div>
                      <span className="font-semibold text-navy-700 text-xs">{asset.name}</span>
                    </div>
                    <span className="font-mono font-bold text-navy-900 text-xs">{asset.value}%</span>
                  </div>
                ))}
              </div>
              
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-navy-400 uppercase tracking-widest">Diversification Score</p>
                  <p className={`font-bold text-sm ${data?.portfolio?.allocation?.equity > 70 ? 'text-amber-500' : 'text-navy-900'}`}>
                    {data?.portfolio?.allocation?.equity > 70 ? 'Rebalance Suggested' : 'Healthy Allocation'}
                  </p>
                </div>
                <span className={`text-xl font-mono font-black ${diversificationScore >= 80 ? 'text-teal-600' : 'text-amber-500'}`}>{diversificationScore}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* What's New Widget */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <h3 className="font-outfit font-bold text-lg text-navy-900 mb-4">What's New</h3>
          
          <div className="space-y-3 flex-1">
            {data.notifications && data.notifications.length > 0 ? data.notifications.map((notif, index) => (
              <div key={index} className={`flex items-start gap-3 p-2.5 rounded-xl ${notif.type === 'Error' || notif.type === 'Alert' ? 'bg-rose-50/50 border border-rose-100/50' : notif.type === 'Warning' || notif.type === 'Reminder' ? 'bg-amber-50/50 border border-amber-100/50' : 'bg-emerald-50/50 border border-emerald-100/50'}`}>
                {notif.type === 'Error' || notif.type === 'Alert' ? <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" /> : notif.type === 'Warning' || notif.type === 'Reminder' ? <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" /> : <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}
                <div>
                  <p className="text-xs font-bold text-navy-900">{notif.title}</p>
                  <p className="text-[10px] text-navy-500">{notif.message}</p>
                </div>
              </div>
            )) : (
              <div className="text-sm text-navy-400">No new updates.</div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Action Center */}
      <div className="space-y-4">
        <h3 className="font-outfit font-bold text-xl text-navy-900 mb-2 px-1 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" /> Action Center
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.insights && data.insights.length > 0 ? data.insights.map((insight, index) => (
            <div key={index} className={`bg-gradient-to-r ${insight.type === 'error' ? 'from-rose-50 border-l-[#F43F5E]' : insight.type === 'warning' ? 'from-amber-50 border-l-[#F59E0B]' : 'from-teal-50 border-l-[#0F766E]'} to-white rounded-3xl p-5 border-l-4 border-y border-r border-gray-100 hover:shadow-md transition-all duration-300 group flex flex-col justify-between hover:-translate-y-1`}>
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 bg-white rounded-lg shadow-sm ${insight.type === 'error' ? 'text-rose-500' : insight.type === 'warning' ? 'text-amber-500' : 'text-teal-600'}`}>
                    {insight.type === 'error' ? <AlertCircle className="w-5 h-5" /> : insight.type === 'warning' ? <AlertTriangle className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                  </div>
                  <h4 className="font-bold text-navy-900 font-outfit text-sm">{insight.title}</h4>
                </div>
                <p className="text-xs font-medium text-navy-600">{insight.message}</p>
              </div>
              <Link to={insight.link} className={`inline-flex items-center justify-between w-full px-4 py-2 rounded-xl text-xs font-bold ${insight.type === 'error' ? 'bg-rose-100 text-rose-800 hover:bg-rose-200' : insight.type === 'warning' ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : 'bg-teal-100 text-teal-800 hover:bg-teal-200'} transition-colors`}>
                Take Action <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )) : (
            <div className="col-span-3 text-center p-8 bg-gray-50 rounded-3xl border border-dashed border-gray-200 text-navy-500 text-sm font-medium">
              You're all caught up! No pending actions required.
            </div>
          )}
        </div>
      </div>

      {/* 5. Split Layout: Timeline & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Activity grouped properly */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 lg:col-span-2 hover:shadow-md transition-shadow duration-300">
          <h3 className="font-outfit font-bold text-lg text-navy-900 mb-6">Recent Activity</h3>
          
          <div className="space-y-6">
            {Object.keys(groupedActivity).length > 0 ? Object.keys(groupedActivity).map(dateLabel => (
              <div key={dateLabel} className="border-t border-gray-50 pt-4 first:border-0 first:pt-0">
                <h4 className="text-xs font-bold text-navy-400 uppercase tracking-widest mb-3">{dateLabel}</h4>
                <div className="space-y-3">
                  {groupedActivity[dateLabel].map((act, index) => (
                    <div key={index} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${act.type === 'Error' ? 'bg-rose-50 text-rose-500 border-rose-100' : act.type === 'Warning' ? 'bg-amber-50 text-amber-500 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                        {act.type === 'Error' ? <AlertCircle className="w-4 h-4" /> : act.type === 'Warning' ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </div>
                      <span className="font-semibold text-navy-800 text-xs flex-1">{act.title}</span>
                      <span className="text-[10px] text-navy-400">
                        {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )) : (
              <div className="text-sm text-navy-400">No recent activity.</div>
            )}
          </div>
        </div>

        {/* Clean 2x3 Quick Actions Grid */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
          <h3 className="font-outfit font-bold text-lg text-navy-900 mb-6">Quick Actions</h3>
          
          <div className="grid grid-cols-2 gap-3 flex-1">
            <Link to="/statements" className="border border-gray-100 hover:border-teal-500/30 hover:bg-teal-50/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 transition-all hover:scale-105 duration-200 group shadow-sm hover:shadow">
              <div className="w-9 h-9 rounded-xl bg-gray-50 text-navy-600 flex items-center justify-center group-hover:bg-teal-100 group-hover:text-teal-700 transition-colors"><FileText className="w-4.5 h-4.5" /></div>
              <span className="font-semibold text-navy-800 text-[10px] whitespace-nowrap">📄 Download Statement</span>
            </Link>
            <Link to="/kyc" className="border border-gray-100 hover:border-teal-500/30 hover:bg-teal-50/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 transition-all hover:scale-105 duration-200 group shadow-sm hover:shadow">
              <div className="w-9 h-9 rounded-xl bg-gray-50 text-navy-600 flex items-center justify-center group-hover:bg-teal-100 group-hover:text-teal-700 transition-colors"><UserCircle className="w-4.5 h-4.5" /></div>
              <span className="font-semibold text-navy-800 text-[10px] whitespace-nowrap">👤 Update KYC</span>
            </Link>
            <Link to="/nominee" className="border border-gray-100 hover:border-teal-500/30 hover:bg-teal-50/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 transition-all hover:scale-105 duration-200 group shadow-sm hover:shadow">
              <div className="w-9 h-9 rounded-xl bg-gray-50 text-navy-600 flex items-center justify-center group-hover:bg-teal-100 group-hover:text-teal-700 transition-colors"><UserPlus className="w-4.5 h-4.5" /></div>
              <span className="font-semibold text-navy-800 text-[10px] whitespace-nowrap">👥 Manage Nominee</span>
            </Link>
            <Link to="/sip" className="border border-gray-100 hover:border-teal-500/30 hover:bg-teal-50/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 transition-all hover:scale-105 duration-200 group shadow-sm hover:shadow">
              <div className="w-9 h-9 rounded-xl bg-gray-50 text-navy-600 flex items-center justify-center group-hover:bg-teal-100 group-hover:text-teal-700 transition-colors"><CreditCard className="w-4.5 h-4.5" /></div>
              <span className="font-semibold text-navy-800 text-[10px] whitespace-nowrap">💳 SIP Status</span>
            </Link>
            <Link to="/support" className="border border-gray-100 hover:border-teal-500/30 hover:bg-teal-50/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 transition-all hover:scale-105 duration-200 group shadow-sm hover:shadow">
              <div className="w-9 h-9 rounded-xl bg-gray-50 text-navy-600 flex items-center justify-center group-hover:bg-teal-100 group-hover:text-teal-700 transition-colors"><LifeBuoy className="w-4.5 h-4.5" /></div>
              <span className="font-semibold text-navy-800 text-[10px] whitespace-nowrap">🎫 Support</span>
            </Link>
            <Link to="/profile" className="border border-gray-100 hover:border-teal-500/30 hover:bg-teal-50/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 transition-all hover:scale-105 duration-200 group shadow-sm hover:shadow">
              <div className="w-9 h-9 rounded-xl bg-gray-50 text-navy-600 flex items-center justify-center group-hover:bg-teal-100 group-hover:text-teal-700 transition-colors"><Settings className="w-4.5 h-4.5" /></div>
              <span className="font-semibold text-navy-800 text-[10px] whitespace-nowrap">⚙ Settings</span>
            </Link>
          </div>
        </div>

      {/* Buy Investment Modal */}
      {showBuyModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-150 transform transition-all animate-scale-up">
            <div className="flex justify-between items-center pb-4 border-b border-gray-150">
              <h3 className="text-lg font-bold text-navy-900 font-outfit">Buy Mutual Fund</h3>
              <button 
                onClick={() => setShowBuyModal(false)}
                className="text-navy-400 hover:text-navy-950 bg-gray-100 hover:bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBuySubmit} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-navy-700 uppercase mb-1">Asset Category</label>
                <select
                  value={buyFormData.type}
                  onChange={(e) => handleBuyCategoryChange(e.target.value)}
                  className="input-field py-2.5 rounded-xl border-gray-200"
                >
                  <option value="Equity">Equity (Growth)</option>
                  <option value="Debt">Debt (Stable)</option>
                  <option value="Liquid">Liquid (Cash)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-700 uppercase mb-1">Select Mutual Fund</label>
                <select
                  value={buyFormData.fundName}
                  onChange={(e) => setBuyFormData({ ...buyFormData, fundName: e.target.value })}
                  className="input-field py-2.5 rounded-xl border-gray-200"
                >
                  {buyFormData.type === 'Equity' && (
                    <>
                      <option value="SBI Bluechip Fund">SBI Bluechip Fund</option>
                      <option value="Axis Midcap Growth Fund">Axis Midcap Growth Fund</option>
                      <option value="Parag Parikh Flexi Cap Fund">Parag Parikh Flexi Cap Fund</option>
                    </>
                  )}
                  {buyFormData.type === 'Debt' && (
                    <>
                      <option value="Axis Strategic Debt Fund">Axis Strategic Debt Fund</option>
                      <option value="ICICI Prudential Constant Maturity Fund">ICICI Prudential Constant Maturity Fund</option>
                    </>
                  )}
                  {buyFormData.type === 'Liquid' && (
                    <>
                      <option value="HDFC Liquid Fund">HDFC Liquid Fund</option>
                      <option value="SBI Liquid Direct Growth Fund">SBI Liquid Direct Growth Fund</option>
                    </>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy-700 uppercase mb-1">NAV (Net Asset Value)</label>
                  <div className="input-field py-2.5 bg-gray-50 border-gray-200 text-navy-700 font-mono font-bold rounded-xl select-none">
                    ₹{buyFormData.nav}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy-700 uppercase mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    value={buyFormData.amount}
                    onChange={(e) => setBuyFormData({ ...buyFormData, amount: e.target.value })}
                    placeholder="Min. ₹500"
                    min="500"
                    className="input-field py-2.5 rounded-xl border-gray-200 font-mono font-bold"
                    required
                  />
                </div>
              </div>

              {buyFormData.amount && (
                <div className="bg-teal-50 border border-teal-100 p-3.5 rounded-2xl flex justify-between items-center text-xs">
                  <span className="font-bold text-teal-800">Estimated Units:</span>
                  <span className="font-mono font-black text-teal-700 text-sm">
                    {(Number(buyFormData.amount) / Number(buyFormData.nav)).toFixed(4)} Units
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={buying || !buyFormData.amount}
                className="w-full btn-primary py-3 rounded-2xl font-bold transition-all disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
              >
                {buying ? 'Processing Purchase...' : 'Confirm & Buy Mutual Fund'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default CommandCenter;
