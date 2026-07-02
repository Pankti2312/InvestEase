import { useState, useEffect } from 'react';
import { FileText, Download, AlertCircle } from 'lucide-react';
import { TableSkeleton } from '../components/SkeletonLoader';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Statements = () => {
  const { user } = useAuth();
  const [statements, setStatements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleDownload = async (stmt) => {
    try {
      const response = await api.get(`/statements/download/${stmt._id}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `InvestEase-Statement-${stmt.month}-${stmt.year}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Download failed', error);
      alert('Failed to download the statement.');
    }
  };
  const currentYear = new Date().getFullYear();
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const years = Array.from(new Array(5), (val, index) => currentYear - index);

  useEffect(() => {
    fetchStatements();
  }, []);

  const fetchStatements = async () => {
    try {
      const response = await api.get('/statements');
      setStatements(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    setError('');

    try {
      await api.post('/statements/generate', {
        month: selectedMonth,
        year: selectedYear
      });
      fetchStatements();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate statement.');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <TableSkeleton />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Account Statements</h1>
        <p className="text-navy-500">Generate and download your monthly portfolio statements.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="card">
            <h3 className="font-semibold text-navy-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-600" />
              Generate New Statement
            </h3>
            
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Month</label>
                <select 
                  value={selectedMonth} 
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="input-field"
                >
                  {months.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Year</label>
                <select 
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="input-field"
                >
                  {years.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <button 
                type="submit" 
                disabled={generating}
                className="btn-primary w-full"
              >
                {generating ? 'Generating PDF...' : 'Generate Statement'}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="card p-0 overflow-hidden h-full flex flex-col">
            <div className="p-6 border-b border-navy-100 bg-navy-50/50">
              <h3 className="text-lg font-semibold text-navy-900">Previous Statements</h3>
            </div>
            
            {statements.length === 0 ? (
              <div className="p-12 flex flex-col items-center justify-center text-navy-500 flex-1">
                <FileText className="w-12 h-12 text-navy-200 mb-3" />
                <p>No statements generated yet.</p>
                <p className="text-sm mt-1">Use the form to generate your first statement.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-navy-50 text-navy-600 text-sm">
                    <tr>
                      <th className="px-6 py-3 font-medium">Period</th>
                      <th className="px-6 py-3 font-medium">Generated On</th>
                      <th className="px-6 py-3 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-100 text-sm">
                    {statements.map((stmt) => (
                      <tr key={stmt._id} className="hover:bg-navy-50/50">
                        <td className="px-6 py-4 font-medium text-navy-900">
                          {stmt.month} {stmt.year}
                        </td>
                        <td className="px-6 py-4 text-navy-600">
                          {new Date(stmt.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleDownload(stmt)}
                            className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-800 font-medium bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                          >
                            <Download className="w-4 h-4" /> View / Download
                          </button>
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
    </div>
  );
};

export default Statements;
