import { useState, useEffect } from 'react';
import { Upload, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { TableSkeleton } from '../components/SkeletonLoader';
import api from '../services/api';

const KYC = () => {
  const [kycData, setKycData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState({ pan: null, aadhaar: null, addressProof: null });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchKYCStatus();
  }, []);

  const fetchKYCStatus = async () => {
    try {
      const response = await api.get('/kyc/status');
      setKycData(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files.pan || !files.aadhaar || !files.addressProof) {
      setError('Please upload all three documents.');
      return;
    }
    
    setSubmitting(true);
    setError('');

    const formData = new FormData();
    formData.append('pan', files.pan);
    formData.append('aadhaar', files.aadhaar);
    formData.append('addressProof', files.addressProof);

    try {
      await api.post('/kyc/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      fetchKYCStatus();
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading documents.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <TableSkeleton />;

  const currentStatus = kycData?.status || 'Pending';
  
  const steps = [
    { label: 'Uploaded', completed: ['Under Review', 'Approved', 'Rejected'].includes(currentStatus) },
    { label: 'Under Review', completed: ['Under Review', 'Approved', 'Rejected'].includes(currentStatus), active: currentStatus === 'Under Review' },
    { label: 'Approved', completed: currentStatus === 'Approved', failed: currentStatus === 'Rejected' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">KYC Verification</h1>
        <p className="text-navy-500">Upload your documents to complete your profile verification.</p>
      </div>

      {/* Timeline */}
      <div className="card">
        <h3 className="font-semibold text-navy-900 mb-6">Verification Progress</h3>
        <div className="flex items-center">
          {steps.map((step, index) => (
            <div key={step.label} className={`flex-1 relative ${index !== steps.length - 1 ? 'after:content-[""] after:h-1 after:w-full after:absolute after:top-4 after:left-1/2 after:-z-10 ' + (step.completed && !step.failed ? 'after:bg-teal-500' : 'after:bg-gray-200') : ''}`}>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 bg-white ${
                  step.failed ? 'border-red-500 text-red-500' : 
                  step.completed ? 'border-teal-500 bg-teal-500 text-white' : 
                  step.active ? 'border-teal-500 text-teal-600' : 'border-gray-300 text-gray-400'
                }`}>
                  {step.failed ? <XCircle className="w-5 h-5 bg-white rounded-full" /> : 
                   step.completed ? <CheckCircle className="w-5 h-5" /> : 
                   <Clock className="w-4 h-4" />}
                </div>
                <span className={`mt-2 text-sm font-medium ${
                  step.failed ? 'text-red-600' : 
                  step.completed || step.active ? 'text-navy-900' : 'text-gray-400'
                }`}>{step.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {currentStatus === 'Pending' || currentStatus === 'Rejected' ? (
        <div className="card">
          <h3 className="font-semibold text-navy-900 mb-4">Upload Documents</h3>
          
          {currentStatus === 'Rejected' && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 flex items-start gap-3 border border-red-200">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Previous submission rejected</p>
                <p className="text-sm mt-1">{kycData.remarks}</p>
              </div>
            </div>
          )}

          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* PAN */}
              <div className="border border-dashed border-navy-200 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-navy-50 transition-colors">
                <Upload className="w-8 h-8 text-navy-400 mb-2" />
                <p className="text-sm font-medium text-navy-900">PAN Card</p>
                <p className="text-xs text-navy-500 mb-4">JPEG, PNG or PDF (Max 5MB)</p>
                <input 
                  type="file" 
                  name="pan" 
                  accept=".jpg,.jpeg,.png,.pdf" 
                  onChange={handleFileChange} 
                  className="text-xs w-full ml-4"
                />
              </div>
              
              {/* Aadhaar */}
              <div className="border border-dashed border-navy-200 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-navy-50 transition-colors">
                <Upload className="w-8 h-8 text-navy-400 mb-2" />
                <p className="text-sm font-medium text-navy-900">Aadhaar Card</p>
                <p className="text-xs text-navy-500 mb-4">JPEG, PNG or PDF (Max 5MB)</p>
                <input 
                  type="file" 
                  name="aadhaar" 
                  accept=".jpg,.jpeg,.png,.pdf" 
                  onChange={handleFileChange}
                  className="text-xs w-full ml-4"
                />
              </div>

              {/* Address Proof */}
              <div className="border border-dashed border-navy-200 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-navy-50 transition-colors">
                <Upload className="w-8 h-8 text-navy-400 mb-2" />
                <p className="text-sm font-medium text-navy-900">Address Proof</p>
                <p className="text-xs text-navy-500 mb-4">Passport, Voter ID, Utility Bill</p>
                <input 
                  type="file" 
                  name="addressProof" 
                  accept=".jpg,.jpeg,.png,.pdf" 
                  onChange={handleFileChange}
                  className="text-xs w-full ml-4"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button type="submit" disabled={submitting} className="btn-primary w-full md:w-auto">
                {submitting ? 'Uploading...' : 'Submit Documents'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="card text-center py-12">
          {currentStatus === 'Approved' ? (
            <div className="flex flex-col items-center text-green-600">
              <CheckCircle className="w-16 h-16 mb-4" />
              <h2 className="text-2xl font-bold text-navy-900">KYC Verified</h2>
              <p className="text-navy-500 mt-2 max-w-md">Your identity has been successfully verified. You now have full access to InvestEase features.</p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-orange-500">
              <Clock className="w-16 h-16 mb-4" />
              <h2 className="text-2xl font-bold text-navy-900">Verification in Progress</h2>
              <p className="text-navy-500 mt-2 max-w-md">Your documents have been submitted and are currently under review by our team. This usually takes 1-2 business days.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default KYC;
