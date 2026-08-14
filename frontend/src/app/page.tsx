'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Calendar, 
  Briefcase, 
  CheckCircle, 
  Bell, 
  ArrowRight, 
  Shield, 
  Cpu, 
  Star, 
  ChevronDown, 
  Menu, 
  X, 
  Moon, 
  Sun, 
  Activity 
} from 'lucide-react';

export default function Home() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // FAQ mock data
  const faqs = [
    {
      q: "How does the QR Attendance Check-In work?",
      a: "Faculty generate a unique session code or QR key during lectures. Students can enter the code on their dashboard to mark attendance instantly, updating the database in real-time."
    },
    {
      q: "How are student profiles updated?",
      a: "Students have full control to edit their profile information including skills, bio, phone, department, semester, and links to LinkedIn/GitHub which helps placement admins track eligibility."
    },
    {
      q: "Can coordinators publish events and track registrations?",
      a: "Yes! Coordinators have specialized dashboards to create events, specify total seat availability, and track student registrations with automatic seat counter updates."
    },
    {
      q: "Does the platform support file and link submissions for assignments?",
      a: "Students can submit GitHub repository URLs and file attachments (PDFs/ZIPs) directly. Faculty can then grade and submit feedback on their dashboard."
    }
  ];

  // Testimonial data
  const testimonials = [
    {
      name: "Aditya Kumar",
      role: "Student Union President",
      text: "Smart Campus has completely eliminated the WhatsApp group chaos. Now all assignments, placements, and event registrations are on a single centralized system.",
      stars: 5
    },
    {
      name: "Dr. Sarah Connor",
      role: "Professor of Computer Science",
      text: "Marking class rosters and publishing homework assignments has never been this simple. The real-time charts provide instant feedback on student completion rates.",
      stars: 5
    },
    {
      name: "Rohit Sharma",
      role: "Placement Coordinator",
      text: "Publishing job listings and tracking student eligibility via CGPA and semester parameters is extremely structured. Highly recommended for colleges.",
      stars: 5
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Navigation */}
      <nav className={`sticky top-0 z-35 backdrop-blur-md border-b transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-950/80 border-slate-900' : 'bg-white/80 border-slate-200'} px-6 md:px-12 py-4 flex justify-between items-center`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎓</span>
          <span className="text-xl font-black bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 bg-clip-text text-transparent">Smart Campus</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
          <a href="#features" className={`hover:text-indigo-500 transition ${theme === 'dark' ? 'text-slate-300' : 'text-slate-650'}`}>Features</a>
          <a href="#stats" className={`hover:text-indigo-500 transition ${theme === 'dark' ? 'text-slate-300' : 'text-slate-650'}`}>Statistics</a>
          <a href="#testimonials" className={`hover:text-indigo-500 transition ${theme === 'dark' ? 'text-slate-300' : 'text-slate-650'}`}>Testimonials</a>
          <a href="#faq" className={`hover:text-indigo-500 transition ${theme === 'dark' ? 'text-slate-300' : 'text-slate-650'}`}>FAQ</a>
          
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`p-2 rounded-xl transition ${theme === 'dark' ? 'bg-slate-900 text-amber-400 border border-slate-850 hover:bg-slate-800' : 'bg-slate-100 text-indigo-600 hover:bg-slate-200'}`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <Link href="/login" className={`px-4 py-2 border rounded-xl hover:bg-slate-100/5 transition ${theme === 'dark' ? 'border-slate-800 text-slate-300' : 'border-slate-200 text-slate-700 hover:bg-slate-100'}`}>
            Login
          </Link>
          <Link href="/register" className="px-5 py-2 bg-gradient-to-tr from-indigo-600 to-violet-650 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition">
            Register
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center gap-3">
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`p-2 rounded-xl transition ${theme === 'dark' ? 'bg-slate-900 text-amber-400' : 'bg-slate-100 text-indigo-600'}`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-400 hover:text-white transition">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className={`absolute top-full left-0 right-0 border-b flex flex-col p-6 space-y-4 md:hidden text-center text-sm font-semibold transition-all ${theme === 'dark' ? 'bg-slate-950 border-slate-900' : 'bg-white border-slate-200'}`}>
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="py-2 text-slate-400">Features</a>
            <a href="#stats" onClick={() => setMobileMenuOpen(false)} className="py-2 text-slate-400">Statistics</a>
            <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="py-2 text-slate-400">Testimonials</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="py-2 text-slate-400">FAQ</a>
            <div className="h-[1px] bg-slate-800 my-2"></div>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="py-2 text-slate-300">Login</Link>
            <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="py-2.5 bg-indigo-600 text-white rounded-xl">Register</Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-28 md:py-36 max-w-5xl mx-auto overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-violet-600/10 rounded-full blur-3xl -z-10"></div>

        <span className="bg-indigo-500/10 text-indigo-400 text-xs px-4 py-1.5 rounded-full font-bold uppercase tracking-widest border border-indigo-400/20 mb-6 animate-pulse">
          DevFusion 4.O Hackathon Showcase
        </span>
        
        <h2 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight max-w-4xl">
          One Platform for Your Entire <br/>
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-violet-400 bg-clip-text text-transparent">Campus Ecosystem</span>
        </h2>
        
        <p className={`text-base sm:text-lg mt-6 max-w-2xl font-medium leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-650'}`}>
          Say goodbye to cluttered WhatsApp groups and fragmented software. Manage student schedules, digital attendance check-ins, placements, and club announcements instantly in one centralized application.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
          <Link href="/register" className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-650 text-white font-extrabold rounded-2xl hover:shadow-xl hover:shadow-indigo-500/20 hover:scale-[1.02] transition flex items-center gap-2">
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
          <a href="#features" className={`px-8 py-4 border rounded-2xl hover:bg-slate-100/5 font-bold transition ${theme === 'dark' ? 'border-slate-800 text-slate-300' : 'border-slate-200 text-slate-700 hover:bg-slate-100'}`}>
            Learn More
          </a>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-slate-900/10 dark:border-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-black">Centralized Modules & Dashboards</h2>
          <p className={`text-sm mt-3 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-650'}`}>Four specialized portals with role-based access control custom tailored for college campuses.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className={`p-8 rounded-3xl border transition group hover:-translate-y-1 hover:shadow-lg ${theme === 'dark' ? 'bg-slate-900/30 border-slate-900 hover:border-slate-850' : 'bg-white border-slate-200/80 hover:border-indigo-100'}`}>
            <div className="p-4 bg-blue-500/10 text-blue-400 rounded-2xl w-fit mb-6">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">📋 Attendance Tracking</h3>
            <p className={`text-xs mt-3 leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              Faculty can initiate logs sessions and students can check-in using unique codes. Dashboards render graphical analytics of classes.
            </p>
          </div>

          <div className={`p-8 rounded-3xl border transition group hover:-translate-y-1 hover:shadow-lg ${theme === 'dark' ? 'bg-slate-900/30 border-slate-900 hover:border-slate-850' : 'bg-white border-slate-200/80 hover:border-indigo-100'}`}>
            <div className="p-4 bg-orange-500/10 text-orange-400 rounded-2xl w-fit mb-6">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">📝 Assignment Submissions</h3>
            <p className={`text-xs mt-3 leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              Allows submitting files, code repositories, and grading homework portfolios with real-time feedback scores and statuses.
            </p>
          </div>

          <div className={`p-8 rounded-3xl border transition group hover:-translate-y-1 hover:shadow-lg ${theme === 'dark' ? 'bg-slate-900/30 border-slate-900 hover:border-slate-850' : 'bg-white border-slate-200/80 hover:border-indigo-100'}`}>
            <div className="p-4 bg-purple-500/10 text-purple-400 rounded-2xl w-fit mb-6">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">🎉 Event Management</h3>
            <p className={`text-xs mt-3 leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              Coordinators can create hackathons, seminars, and workshops. Students register and instantly retrieve a dynamic entry Ticket pass.
            </p>
          </div>

          <div className={`p-8 rounded-3xl border transition group hover:-translate-y-1 hover:shadow-lg ${theme === 'dark' ? 'bg-slate-900/30 border-slate-900 hover:border-slate-850' : 'bg-white border-slate-200/80 hover:border-indigo-100'}`}>
            <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-2xl w-fit mb-6">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">💼 Placements Notices</h3>
            <p className={`text-xs mt-3 leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              Browse active recruitment listings, check eligibility parameters (CGPA/semester), and apply by uploading resume profiles.
            </p>
          </div>

          <div className={`p-8 rounded-3xl border transition group hover:-translate-y-1 hover:shadow-lg ${theme === 'dark' ? 'bg-slate-900/30 border-slate-900 hover:border-slate-850' : 'bg-white border-slate-200/80 hover:border-indigo-100'}`}>
            <div className="p-4 bg-rose-500/10 text-rose-400 rounded-2xl w-fit mb-6">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">🤖 AI Chatbot Advisor</h3>
            <p className={`text-xs mt-3 leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              A floatable intelligent chatbot assistant responds instantly to student questions about placements, events, and assignments.
            </p>
          </div>

          <div className={`p-8 rounded-3xl border transition group hover:-translate-y-1 hover:shadow-lg ${theme === 'dark' ? 'bg-slate-900/30 border-slate-900 hover:border-slate-850' : 'bg-white border-slate-200/80 hover:border-indigo-100'}`}>
            <div className="p-4 bg-amber-500/10 text-amber-400 rounded-2xl w-fit mb-6">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">🛡️ Role-Based Governance</h3>
            <p className={`text-xs mt-3 leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              Strict role authentication (Student, Faculty, Coordinator, Admin) prevents database intrusions and secures critical campus records.
            </p>
          </div>

        </div>
      </section>

      {/* Statistics Section */}
      <section id="stats" className={`py-20 px-6 md:px-12 transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900/20' : 'bg-indigo-50/20'}`}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-4xl font-black text-indigo-500">12,000+</h3>
            <p className="text-xs uppercase font-extrabold text-slate-450 mt-2">Active Students</p>
          </div>
          <div>
            <h3 className="text-4xl font-black text-purple-500">150+</h3>
            <p className="text-xs uppercase font-extrabold text-slate-450 mt-2">Partner Companies</p>
          </div>
          <div>
            <h3 className="text-4xl font-black text-violet-500">98.2%</h3>
            <p className="text-xs uppercase font-extrabold text-slate-450 mt-2">Attendance Accuracy</p>
          </div>
          <div>
            <h3 className="text-4xl font-black text-emerald-500">200+</h3>
            <p className="text-xs uppercase font-extrabold text-slate-450 mt-2">Events Hosted</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-black">Endorsed by Deans & Students</h2>
          <p className={`text-sm mt-3 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-650'}`}>See how members of our early adopter network have optimized their daily workflows.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className={`p-8 rounded-3xl border ${theme === 'dark' ? 'bg-slate-900/30 border-slate-900' : 'bg-white border-slate-200/80 shadow-sm'}`}>
              <div className="flex gap-1 mb-4 text-amber-400">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className={`text-xs leading-relaxed italic ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                "{t.text}"
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-650 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {t.name[0]}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{t.name}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6 md:px-12 max-w-4xl mx-auto border-t border-slate-900/10 dark:border-slate-900">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black">Frequently Answered Queries</h2>
          <p className={`text-sm mt-3 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-650'}`}>Find detailed responses to structural questions regarding system integration.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx} 
                className={`border rounded-2xl transition-colors duration-300 ${theme === 'dark' ? 'border-slate-900 bg-slate-900/10' : 'border-slate-200 bg-white shadow-sm'}`}
              >
                <button 
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left font-bold text-xs sm:text-sm flex justify-between items-center text-slate-800 dark:text-slate-200"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-450 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-500 leading-relaxed border-t border-slate-100 dark:border-slate-900/50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Footer */}
      <footer className={`border-t transition-colors duration-300 ${theme === 'dark' ? 'border-slate-900 bg-slate-950' : 'border-slate-200 bg-slate-900 text-slate-300'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎓</span>
              <span className="text-lg font-black text-white">Smart Campus</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Unifying campus operations through interactive dashboards, digital attendance, and AI-driven automation. Designed and optimized for DevFusion 4.O Hackathon.
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white">Portals</h4>
            <div className="flex flex-col gap-2 text-xs text-slate-400">
              <Link href="/login" className="hover:text-indigo-400">Student Login</Link>
              <Link href="/login" className="hover:text-indigo-400">Faculty Panel</Link>
              <Link href="/login" className="hover:text-indigo-400">Coordinators Portal</Link>
              <Link href="/login" className="hover:text-indigo-400">Administration Console</Link>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white">Legal</h4>
            <div className="flex flex-col gap-2 text-xs text-slate-400">
              <span className="hover:text-indigo-400 cursor-pointer">Privacy Policy</span>
              <span className="hover:text-indigo-400 cursor-pointer">Terms of Service</span>
              <span className="hover:text-indigo-400 cursor-pointer">Security Standards</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-900 text-center py-6 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
          <p>&copy; {new Date().getFullYear()} Smart Campus. Built with Next.js, Express & MongoDB.</p>
        </div>
      </footer>

    </div>
  );
}
