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

  // Asset allocation matching the user requirement
  const chartData = useMemo(() => [
    { name: 'Equity', value: 65, color: '#0F766E' }, // Teal
    { name: 'Debt', value: 25, color: '#6366F1' }, // Indigo
    { name: 'Gold', value: 10, color: '#F59E0B' } // Amber
  ], []);

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
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Everything looks good today.
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                Your next SIP is due tomorrow.
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                No critical actions pending.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col md:items-end justify-end space-y-2">
            <p className="text-white/60 text-xs uppercase tracking-widest font-semibold font-outfit">Portfolio Value</p>
            <h2 className="text-5xl font-mono font-bold tracking-tight">
              ₹{animatedValue.toLocaleString()}
            </h2>
            <p className="text-emerald-400 font-mono font-medium text-sm flex items-center bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-sm shadow-inner">
              <ArrowUpRight className="w-4 h-4 mr-1" /> +₹4,250 This Month
            </p>
          </div>
        </div>
      </div>

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
                  strokeDashoffset={301.6 - (301.6 * 96) / 100} 
                  className="transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col animate-fade-in">
                <span className="text-2xl font-mono font-black text-navy-900 tracking-tighter">96%</span>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Excellent</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full inline-block">
                ↑ +4 this month
              </span>
              <p className="text-xs text-navy-500 mt-1">Excellent diversification and active KYC compliance.</p>
            </div>
          </div>
          
          <div className="space-y-2 border-t border-gray-50 pt-4 flex-1">
            <p className="text-[11px] font-bold text-navy-400 uppercase tracking-wider mb-2">Health Drivers</p>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-navy-700">
              <div className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> KYC Verified</div>
              <div className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> Active SIP</div>
              <div className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> Nominee Added</div>
              <div className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> Profile Complete</div>
              <div className="flex items-center gap-1.5 col-span-2"><CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> Zero Pending Requests</div>
            </div>
          </div>
        </div>

        {/* Portfolio Stats (Fintech Style) */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <h3 className="font-outfit font-bold text-lg text-navy-900 mb-4">Portfolio</h3>
          
          <div className="space-y-4 flex-1 flex flex-col justify-center">
            <div>
              <p className="text-navy-400 text-xs font-bold uppercase tracking-wider mb-0.5">Portfolio Value</p>
              <h4 className="text-3xl font-mono font-bold text-navy-900">₹5,00,000</h4>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-4">
              <div>
                <p className="text-navy-400 text-xs font-bold uppercase tracking-wider mb-0.5">Today's Gain</p>
                <p className="text-sm font-mono font-bold text-emerald-500 flex items-center">
                  <ArrowUpRight className="w-3.5 h-3.5 mr-0.5 shrink-0" /> +₹820
                </p>
              </div>
              <div>
                <p className="text-navy-400 text-xs font-bold uppercase tracking-wider mb-0.5">Overall Return</p>
                <p className="text-sm font-mono font-bold text-emerald-500">+12%</p>
              </div>
            </div>

            <div className="bg-navy-50 rounded-xl p-3 border border-gray-100/50 mt-2">
              <p className="text-navy-500 text-xs font-bold uppercase tracking-wider mb-0.5">Invested Amount</p>
              <p className="text-lg font-mono font-bold text-navy-800">₹4,46,000</p>
            </div>
          </div>
        </div>

        {/* Investor Profile Completion Widget (Differentiator) */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-outfit font-bold text-lg text-navy-900">Profile Completion</h3>
            <span className="text-lg font-mono font-black text-teal-600 bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-100">88%</span>
          </div>

          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-4">
            <div className="bg-teal-600 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: '88%' }}></div>
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between text-xs font-semibold text-navy-700">
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /> Personal Details</span>
              <span className="text-navy-400">Complete</span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-navy-700">
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /> KYC Verification</span>
              <span className="text-navy-400">Verified</span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-navy-700">
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /> Bank Integration</span>
              <span className="text-navy-400">Connected</span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-navy-700">
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /> Active Auto SIP</span>
              <span className="text-navy-400">Active</span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-navy-700 border-t border-gray-50 pt-2">
              <span className="flex items-center gap-1.5"><AlertCircle className="w-4 h-4 text-amber-500" /> Nominee Missing</span>
              <Link to="/nominee" className="text-teal-600 hover:text-teal-700 font-bold underline">Add Nominee</Link>
            </div>
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
                  <p className="font-bold text-navy-900 text-sm">Healthy Allocation</p>
                </div>
                <span className="text-xl font-mono font-black text-teal-600">84%</span>
              </div>
            </div>
          </div>
        </div>

        {/* What's New Widget */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <h3 className="font-outfit font-bold text-lg text-navy-900 mb-4">What's New</h3>
          
          <div className="space-y-3 flex-1">
            <div className="flex items-start gap-3 p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100/50">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <p className="text-xs font-bold text-navy-900">Statement Generated</p>
                <p className="text-[10px] text-navy-500">June mutual fund statement is ready.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100/50">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-navy-900">KYC Approved</p>
                <p className="text-[10px] text-navy-500">Your address proof verified.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-xl bg-amber-50/50 border border-amber-100/50 animate-pulse">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-navy-900">SIP Retry Required</p>
                <p className="text-[10px] text-navy-500">Your SBI SIP mandate failed to auto-debit.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100/50">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-navy-900">Support Ticket Resolved</p>
                <p className="text-[10px] text-navy-500">Ticket #2034 closed successfully.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Action Center (Renamed and Styled with Amber Borders/Accents) */}
      <div className="space-y-4">
        <h3 className="font-outfit font-bold text-xl text-navy-900 mb-2 px-1 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" /> Action Center
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Action 1 (Amber Attention) */}
          <div className="bg-gradient-to-r from-amber-50 to-white rounded-3xl p-5 border-l-4 border-l-[#F59E0B] border-y border-r border-amber-100 hover:shadow-md transition-all duration-300 group flex flex-col justify-between hover:-translate-y-1">
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white rounded-lg shadow-sm text-amber-500">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-navy-900 font-outfit text-sm">SIP due tomorrow</h4>
              </div>
              <p className="text-xs font-medium text-navy-600">Please make sure linked bank account balance is maintained to avoid failure.</p>
            </div>
            <Link to="/sip" className="inline-flex items-center justify-between w-full px-4 py-2 rounded-xl text-xs font-bold bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors">
              Complete today <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Action 2 */}
          <div className="bg-gradient-to-r from-teal-50 to-white rounded-3xl p-5 border-l-4 border-l-[#0F766E] border-y border-r border-teal-100 hover:shadow-md transition-all duration-300 group flex flex-col justify-between hover:-translate-y-1">
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white rounded-lg shadow-sm text-teal-600">
                  <FileText className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-navy-900 font-outfit text-sm">Statement Ready</h4>
              </div>
              <p className="text-xs font-medium text-navy-600">Your Consolidated Account Statement for the previous quarter is generated.</p>
            </div>
            <Link to="/statements" className="inline-flex items-center justify-between w-full px-4 py-2 rounded-xl text-xs font-bold bg-teal-100 text-teal-800 hover:bg-teal-200 transition-colors">
              Download <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Action 3 (Amber Attention) */}
          <div className="bg-gradient-to-r from-amber-50 to-white rounded-3xl p-5 border-l-4 border-l-[#F59E0B] border-y border-r border-amber-100 hover:shadow-md transition-all duration-300 group flex flex-col justify-between hover:-translate-y-1">
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white rounded-lg shadow-sm text-amber-500">
                  <UserPlus className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-navy-900 font-outfit text-sm">Add Nominee</h4>
              </div>
              <p className="text-xs font-medium text-navy-600">Secure your investments by adding a nominee. This will improve your Health Score.</p>
            </div>
            <Link to="/nominee" className="inline-flex items-center justify-between w-full px-4 py-2 rounded-xl text-xs font-bold bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors">
              Improve Health Score <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* 5. Split Layout: Timeline & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Activity grouped properly */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 lg:col-span-2 hover:shadow-md transition-shadow duration-300">
          <h3 className="font-outfit font-bold text-lg text-navy-900 mb-6">Recent Activity</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-bold text-navy-400 uppercase tracking-widest mb-3">Today</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100"><CheckCircle className="w-4 h-4" /></div>
                  <span className="font-semibold text-navy-800 text-xs flex-1">Statement Downloaded</span>
                  <span className="text-[10px] text-navy-400">10:45 AM</span>
                </div>
                <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100"><CheckCircle className="w-4 h-4" /></div>
                  <span className="font-semibold text-navy-800 text-xs flex-1">KYC Submitted</span>
                  <span className="text-[10px] text-navy-400">09:15 AM</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-50 pt-4">
              <h4 className="text-xs font-bold text-navy-400 uppercase tracking-widest mb-3">Yesterday</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 border border-rose-100"><AlertTriangle className="w-4 h-4" /></div>
                  <span className="font-semibold text-navy-800 text-xs flex-1">SIP Failed</span>
                  <span className="text-[10px] text-navy-400">Yesterday</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-50 pt-4">
              <h4 className="text-xs font-bold text-navy-400 uppercase tracking-widest mb-3">Monday</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100"><UserPlus className="w-4 h-4" /></div>
                  <span className="font-semibold text-navy-800 text-xs flex-1">Nominee Updated</span>
                  <span className="text-[10px] text-navy-400">Monday</span>
                </div>
              </div>
            </div>
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

      </div>
    </div>
  );
};

export default CommandCenter;
