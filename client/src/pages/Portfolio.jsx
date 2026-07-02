import { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Filter, Download, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import api from '../services/api';
import { TableSkeleton } from '../components/SkeletonLoader';

const Portfolio = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
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
      // Refresh portfolio data
      const response = await api.get('/portfolio');
      setData(response.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to complete investment.');
    } finally {
      setBuying(false);
    }
  };

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await api.get('/portfolio');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching portfolio:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  const chartData = useMemo(() => {
    if (!data || !data.portfolio) {
      return [
        { name: 'Equity', value: 0, color: '#0F766E' },
        { name: 'Debt', value: 0, color: '#6366F1' },
        { name: 'Liquid', value: 0, color: '#F59E0B' }
      ];
    }
    return [
      { name: 'Equity', value: data.portfolio.allocation.equity, color: '#0F766E' },
      { name: 'Debt', value: data.portfolio.allocation.debt, color: '#6366F1' },
      { name: 'Liquid', value: data.portfolio.allocation.liquid, color: '#F59E0B' }
    ];
  }, [data]);

  if (loading) return <TableSkeleton />;
  if (!data) return <div className="text-center p-8 text-navy-500">Failed to load portfolio.</div>;

  const { portfolio, investments } = data;

  const filteredInvestments = filter === 'All' 
    ? investments 
    : investments.filter(inv => inv.type === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 font-outfit">Portfolio Details</h1>
          <p className="text-navy-500 text-sm">Comprehensive breakdown of your asset allocation.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowBuyModal(true)}
            className="btn-primary py-2.5 px-5 rounded-2xl font-bold text-sm shadow-sm"
          >
            + Add Investment
          </button>
          <button className="btn-secondary flex items-center gap-2 py-2.5 px-5 rounded-2xl font-bold text-sm">
            <Download className="w-4 h-4" /> Download Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2 flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/2 h-64 relative">
            <h3 className="absolute top-0 left-0 text-sm font-bold text-navy-900 uppercase tracking-wider z-10">Asset Allocation</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="55%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={4}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `${value}%`}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="w-full md:w-1/2 flex flex-col justify-center space-y-4">
             <div className="p-4 bg-teal-50 rounded-xl border border-teal-100">
               <p className="text-sm font-medium text-teal-800 mb-1">Total Assets</p>
               <h2 className="text-3xl font-extrabold text-teal-900">₹{portfolio.totalValue.toLocaleString()}</h2>
               <div className="flex items-center gap-1 mt-2 text-sm font-semibold text-green-700">
                 <ArrowUpRight className="w-4 h-4" /> +₹{portfolio.todayChange.toLocaleString()} Today
               </div>
             </div>

            <div className="space-y-3 px-2">
              {chartData.map((asset) => (
                <div key={asset.name} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: asset.color }}></div>
                    <span className="font-semibold text-navy-700">{asset.name}</span>
                  </div>
                  <span className="font-bold text-navy-900">{asset.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card lg:col-span-1 bg-gradient-to-br from-navy-900 to-navy-800 text-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-white/10 rounded-lg"><TrendingUp className="w-5 h-5 text-teal-400" /></div>
            <h3 className="font-bold text-lg">Market Outlook</h3>
          </div>
          <p className="text-sm text-navy-200 mb-6 leading-relaxed">
            Your portfolio is heavily weighted in Equity (60%). Consider rebalancing slightly into Debt funds if you are approaching a short-term financial goal to reduce volatility.
          </p>
          <button className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-bold transition-colors">
            View Rebalancing Options
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h3 className="text-lg font-bold text-navy-900">Holdings Details</h3>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            <Filter className="w-4 h-4 text-navy-400" />
            {['All', 'Equity', 'Debt', 'Liquid'].map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                  filter === type 
                    ? 'bg-teal-600 text-white' 
                    : 'bg-gray-100 text-navy-600 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-3 text-xs font-semibold text-navy-500 uppercase tracking-wider">Fund Name</th>
                <th className="pb-3 text-xs font-semibold text-navy-500 uppercase tracking-wider">Asset Class</th>
                <th className="pb-3 text-xs font-semibold text-navy-500 uppercase tracking-wider text-right">Invested</th>
                <th className="pb-3 text-xs font-semibold text-navy-500 uppercase tracking-wider text-right">Units</th>
                <th className="pb-3 text-xs font-semibold text-navy-500 uppercase tracking-wider text-right">Current Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInvestments.map(inv => (
                <tr key={inv._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 font-semibold text-navy-900">{inv.fundName}</td>
                  <td className="py-4">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                      inv.type === 'Equity' ? 'bg-teal-50 text-teal-700' :
                      inv.type === 'Debt' ? 'bg-indigo-50 text-indigo-700' :
                      'bg-amber-50 text-amber-700'
                    }`}>
                      {inv.type}
                    </span>
                  </td>
                  <td className="py-4 text-right font-medium text-navy-600">₹{inv.amount.toLocaleString()}</td>
                  <td className="py-4 text-right font-medium text-navy-600">{inv.units}</td>
                  <td className="py-4 text-right font-bold text-navy-900">₹{inv.currentValue.toLocaleString()}</td>
                </tr>
              ))}
              {filteredInvestments.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-navy-500 font-medium">No investments found in this category.</td>
                </tr>
              )}
            </tbody>
          </table>
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
  );
};

export default Portfolio;
