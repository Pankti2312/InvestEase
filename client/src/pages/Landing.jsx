import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Shield,
  PieChart,
  Repeat,
  FileText,
  UserPlus,
  Zap,
  CheckCircle,
  ChevronDown,
  Monitor,
  Database,
  Lock,
  ArrowUpRight,
  Sparkles,
  Mail,
  Code,
  Bug,
  Briefcase,
  X,
} from "lucide-react";

const Landing = () => {
  const [openFaq, setOpenFaq] = useState(0);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleDemoLogin = async (e) => {
    e.preventDefault();
    setIsDemoLoading(true);
    try {
      // Attempt to login first
      await login("demo@investease.com", "Demo@123");
      navigate("/dashboard");
    } catch (err) {
      // If login fails, the demo account might not exist yet, so we register it
      try {
        await register(
          "Demo User",
          "demo@investease.com",
          "Demo@123",
          "0000000000",
        );
        navigate("/dashboard");
      } catch (regErr) {
        alert("Failed to launch demo. Please try again.");
        setIsDemoLoading(false);
      }
    }
  };

  const faqs = [
    {
      q: "How is my data secured?",
      a: "We use industry-standard JWT authentication, password hashing, and role-based access control. All data is securely stored in MongoDB Atlas with strict IP whitelisting and encrypted connections.",
    },
    {
      q: "Can I manage multiple SIPs?",
      a: "Yes, you can create, pause, and track multiple Systematic Investment Plans (SIPs) across different mutual fund categories directly from your dashboard.",
    },
    {
      q: "How are PDF statements generated?",
      a: "Your monthly portfolio statements are generated dynamically on the server using PDFKit, giving you an immutable record of your holdings, SIPs, and KYC status.",
    },
    {
      q: "How does nominee allocation work?",
      a: "You can add up to 3 nominees to your account and assign specific percentage shares to each, ensuring your investments are legally secured for your beneficiaries.",
    },
    {
      q: "Can administrators verify KYC?",
      a: "Yes, our platform includes a dedicated Admin panel where authorized personnel can review uploaded PAN/Aadhaar documents and approve or reject KYC applications.",
    },
  ];

  const features = [
    {
      icon: PieChart,
      title: "Portfolio Tracking",
      desc: "Real-time investment tracking and asset allocation visualization.",
    },
    {
      icon: Repeat,
      title: "SIP Automation",
      desc: "Create and manage recurring investments with dynamic Next-Debit calculation.",
    },
    {
      icon: Shield,
      title: "Digital KYC",
      desc: "Complete digital verification securely with state-machine workflow approvals.",
    },
    {
      icon: UserPlus,
      title: "Nominee Management",
      desc: "Secure your investments by legally assigning up to 3 beneficiaries.",
    },
    {
      icon: FileText,
      title: "PDF Statements",
      desc: "Generate beautifully formatted, downloadable PDF reports of your entire account.",
    },
    {
      icon: Zap,
      title: "Admin Dashboard",
      desc: "Role-based access allowing admins to manage KYC approvals and support tickets.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-outfit text-navy-900 overflow-x-hidden selection:bg-teal-100 selection:text-teal-900">
      {/* 1. Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-24 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-black text-xl">
              I
            </div>
            <span className="text-xl font-bold tracking-tight text-navy-900">
              InvestEase
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
            <a
              href="#features"
              className="hover:text-teal-600 transition-colors"
            >
              Features
            </a>
            <a
              href="#solutions"
              className="hover:text-teal-600 transition-colors"
            >
              Solutions
            </a>
            <a
              href="#security"
              className="hover:text-teal-600 transition-colors"
            >
              Security
            </a>
            <span className="text-gray-400 cursor-not-allowed">
              Pricing (Coming Soon)
            </span>
            <a
              href="https://github.com/darshan02parmar/InvestEase"
              target="_blank"
              rel="noreferrer"
              className="hover:text-teal-600 transition-colors"
            >
              GitHub
            </a>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="hidden md:block text-sm font-bold text-gray-600 hover:text-teal-600 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-teal-700 hover:bg-teal-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-teal-600/20 hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="pt-40 pb-20 px-6 lg:px-24 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="lg:w-1/2 space-y-8 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-teal-600 " /> Smart Investment Management Platform
          </div>

          <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight text-[#0F172A]">
            Invest smarter. <br />
            Track everything with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0F766E] to-[#14B8A6]">
              confidence.
            </span>
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed max-w-xl font-medium">
            Everything you need—from SIPs and KYC to portfolio insights—in one
            secure, enterprise-grade platform built for modern investors.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <Link
              to="/register"
              className="w-full sm:w-auto bg-navy-900 hover:bg-gray-800 text-white px-8 py-4 rounded-2xl text-base font-bold transition-all shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Get Started <ArrowUpRight className="w-5 h-5" />
            </Link>
            <button
              onClick={handleDemoLogin}
              disabled={isDemoLoading}
              className="w-full sm:w-auto bg-white border border-gray-200 hover:border-teal-600 hover:text-teal-700 text-gray-700 px-8 py-4 rounded-2xl text-base font-bold transition-all shadow-sm hover:-translate-y-1 flex items-center justify-center disabled:opacity-50"
            >
              {isDemoLoading ? "Launching Demo..." : "Live Demo"}
            </button>
          </div>
        </div>

        <div className="lg:w-1/2 w-full perspective-1000 mt-12 lg:mt-0">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transform hover:-translate-y-2 transition-transform duration-500">
            {/* Browser Header */}
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
              </div>
              <div className="bg-white px-3 py-1 text-[10px] text-gray-400 font-mono rounded-md mx-auto w-1/2 text-center border border-gray-200 truncate">
                investease.com/dashboard
              </div>
            </div>
            {/* Dashboard Mockup Content */}
            <div className="p-4 sm:p-6 bg-gray-50 space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Portfolio Value
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-mono font-black text-navy-900">
                    ₹5,24,380
                  </h3>
                </div>
                <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-xs font-bold border border-emerald-100 self-start sm:self-auto">
                  +12.4% Overall
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Health Score
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full border-4 border-teal-500 flex items-center justify-center text-sm font-black text-teal-700 shrink-0">
                      88%
                    </div>
                    <div className="space-y-1 w-full">
                      <div className="w-full h-1.5 bg-gray-100 rounded-full">
                        <div className="w-full h-full bg-emerald-500 rounded-full"></div>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full">
                        <div className="w-3/4 h-full bg-emerald-500 rounded-full"></div>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full">
                        <div className="w-1/2 h-full bg-amber-400 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Asset Allocation
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-teal-700">Equity</span>
                      <span>65%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full">
                      <div className="w-[65%] h-full bg-teal-700 rounded-full"></div>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold mt-1">
                      <span className="text-indigo-500">Debt</span>
                      <span>35%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full">
                      <div className="w-[35%] h-full bg-indigo-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hidden sm:block">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Recent Activity
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-md bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                      <CheckCircle className="w-3 h-3" />
                    </div>
                    <p className="text-xs font-bold text-gray-700 flex-1 truncate">
                      Statement Downloaded
                    </p>
                    <p className="text-[9px] font-medium text-gray-400">
                      10:45 AM
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-md bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                      <CheckCircle className="w-3 h-3" />
                    </div>
                    <p className="text-xs font-bold text-gray-700 flex-1 truncate">
                      KYC Submitted
                    </p>
                    <p className="text-[9px] font-medium text-gray-400">
                      09:15 AM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Features Grid */}
      <section id="features" className="py-24 px-6 lg:px-24 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-black text-navy-900 mb-4 tracking-tight">
            Everything you need to grow.
          </h2>
          <p className="text-lg text-gray-500 font-medium">
            InvestEase replaces multiple fragmented tools with one cohesive,
            secure platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 hover:-translate-y-2 transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-500 mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-sm font-medium text-gray-500 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. How It Works (Timeline) */}
      <section id="solutions" className="py-24 bg-white px-6 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-black text-navy-900 mb-4 tracking-tight">
              How InvestEase Works
            </h2>
            <p className="text-lg text-gray-500 font-medium">
              A frictionless journey from registration to wealth generation.
            </p>
          </div>

          <div className="max-w-3xl mx-auto relative pl-4 md:pl-0">
            {/* Vertical Line */}
            <div className="absolute left-[36px] md:left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-500 to-gray-200 rounded-full"></div>

            <div className="space-y-8 md:space-y-12">
              {[
                "Register Account",
                "Complete Digital KYC",
                "Add Nominee",
                "Create SIPs",
                "Add Investments",
                "Track Portfolio",
                "Download Statements",
              ].map((step, idx) => (
                <div
                  key={idx}
                  className="relative flex items-center gap-6 md:gap-8 group"
                >
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white border-4 border-teal-700 flex items-center justify-center z-10 shadow-lg text-teal-700 font-black text-xl group-hover:scale-110 group-hover:bg-teal-50 transition-all duration-300 shrink-0">
                    {idx + 1}
                  </div>
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex-1 shadow-sm group-hover:shadow-md transition-shadow">
                    <h4 className="text-xl font-bold text-navy-900">{step}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Product Previews */}
      <section id="preview" className="py-24 px-6 lg:px-24 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-black text-navy-900 mb-4 tracking-tight">
            Beautiful inside and out.
          </h2>
          <p className="text-lg text-gray-500 font-medium">
            Engineered for clarity. Designed for action.
          </p>
        </div>

        <div className="space-y-12">
          {/* Dashboard Preview */}
          <div className="bg-white p-2 md:p-4 rounded-[2rem] shadow-2xl border border-gray-200 transform hover:-translate-y-2 transition-transform duration-500">
            <div className="bg-gray-100 rounded-t-xl h-10 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-400 shrink-0"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400 shrink-0"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-400 shrink-0"></div>
              <div className="text-xs text-gray-500 font-mono ml-4 truncate">
                InvestEase / Dashboard View
              </div>
            </div>
            <div className="bg-navy-900 p-8 rounded-b-xl flex flex-col md:flex-row gap-8 items-center justify-center min-h-[300px]">
              <div className="text-white text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2">
                  Welcome back, Investor
                </h3>
                <p className="text-teal-400 font-mono text-xl">
                  Portfolio Value: ₹5,24,380
                </p>
                <div className="mt-6 flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="bg-white/10 text-white px-3 py-1 text-xs font-bold rounded-lg border border-white/20">
                    Dashboard
                  </span>
                  <span className="bg-white/5 text-white/50 px-3 py-1 text-xs font-bold rounded-lg border border-white/10">
                    Portfolio
                  </span>
                  <span className="bg-white/5 text-white/50 px-3 py-1 text-xs font-bold rounded-lg border border-white/10">
                    SIP
                  </span>
                  <span className="bg-white/5 text-white/50 px-3 py-1 text-xs font-bold rounded-lg border border-white/10">
                    KYC
                  </span>
                  <span className="bg-white/5 text-white/50 px-3 py-1 text-xs font-bold rounded-lg border border-white/10">
                    Admin
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                <div className="bg-white/10 p-6 rounded-2xl border border-white/20 backdrop-blur-sm text-center">
                  <div className="text-3xl font-black text-white">4</div>
                  <div className="text-xs font-bold text-teal-300 uppercase mt-1">
                    Active SIPs
                  </div>
                </div>
                <div className="bg-white/10 p-6 rounded-2xl border border-white/20 backdrop-blur-sm text-center">
                  <div className="text-3xl font-black text-white">100%</div>
                  <div className="text-xs font-bold text-teal-300 uppercase mt-1">
                    Health Score
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Security Section */}
      <section
        id="security"
        className="py-24 bg-navy-900 text-white px-6 lg:px-24"
      >
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-500/20 text-teal-400 mb-8">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-4xl font-black mb-6 tracking-tight text-white">
            Bank-grade security.
          </h2>
          <p className="text-lg text-gray-400 font-medium max-w-2xl mx-auto mb-16">
            Your financial data is protected by enterprise-level encryption and
            robust architectural decisions.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              "JWT Authentication",
              "MongoDB Atlas",
              "Role Based Access",
              "Password Hashing",
              "Protected APIs",
              "Secure Document Uploads",
            ].map((sec, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors"
              >
                <CheckCircle className="w-6 h-6 text-teal-400 mb-4 mx-auto" />
                <h4 className="font-bold text-sm text-white">{sec}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ */}
      <section className="py-24 px-6 lg:px-24 max-w-3xl mx-auto">
        <h2 className="text-4xl font-black text-navy-900 mb-12 tracking-tight text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-navy-900 hover:bg-gray-50 transition-colors"
              >
                {faq.q}
                <ChevronDown
                  className={`w-5 h-5 text-teal-600 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                />
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5 text-sm font-medium text-gray-500 leading-relaxed border-t border-gray-50 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 9. Final CTA */}
      <section className="py-24 px-6 lg:px-24 max-w-7xl mx-auto text-center">
        <div className="bg-gradient-to-br from-teal-700 to-navy-900 rounded-[3rem] p-12 md:p-20 shadow-2xl relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2"></div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
              Ready to simplify your investment journey?
            </h2>
            <p className="text-lg text-teal-100/80 mb-10 max-w-xl mx-auto font-medium">
              Join InvestEase today and take absolute control of your portfolio,
              SIPs, and KYC compliance from a single dashboard.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 bg-white text-navy-900 px-10 py-5 rounded-2xl text-lg font-black hover:scale-105 transition-transform shadow-2xl w-full sm:w-auto"
            >
              Get Started Now <ArrowUpRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* 10. Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 px-6 lg:px-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-teal-600 flex items-center justify-center text-white font-black text-xs">
              I
            </div>
            <span className="text-lg font-bold tracking-tight text-navy-900">
              InvestEase
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm font-bold text-gray-500">
            <a
              href="#features"
              className="hover:text-teal-600 transition-colors"
            >
              Features
            </a>
            <a
              href="https://github.com/darshan02parmar/InvestEase"
              className="hover:text-teal-600 transition-colors"
            >
              GitHub
            </a>
            <a href="https://github.com/darshan02parmar/InvestEase/tree/main/docs" className="hover:text-teal-600 transition-colors">
              Documentation
            </a>
            <button onClick={() => setIsContactModalOpen(true)} className="hover:text-teal-600 transition-colors">
              Contact
            </button>
          </div>

          <div className="text-sm font-medium text-gray-400 text-center md:text-left">
            © 2026 InvestEase. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Contact Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsContactModalOpen(false)}
          />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 transform transition-all animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsContactModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-2xl font-black text-[#0F172A] mb-6">Need Help?</h3>
            
            <div className="space-y-3">
              <a href="mailto:darshan@example.com" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0F172A]">Email</p>
                  <p className="text-xs font-medium text-gray-500">darshan02parmar@gmail.com</p>
                </div>
              </a>
              
              <a href="https://github.com/darshan02parmar/InvestEase" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Code className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0F172A]">GitHub</p>
                  <p className="text-xs font-medium text-gray-500">View Repository</p>
                </div>
              </a>
              
              <a href="https://github.com/darshan02parmar/InvestEase/issues" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Bug className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0F172A]">Report an Issue</p>
                  <p className="text-xs font-medium text-rose-500">Open GitHub Issues</p>
                </div>
              </a>
              
              <a href="https://linkedin.com/in/darshan02parmar" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0F172A]">LinkedIn</p>
                  <p className="text-xs font-medium text-blue-500">Connect</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Landing;
