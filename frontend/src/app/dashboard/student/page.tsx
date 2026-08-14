'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { 
  BookOpen, 
  Calendar, 
  Briefcase, 
  CheckCircle, 
  User, 
  Bell, 
  LogOut, 
  QrCode, 
  MessageSquare, 
  Send, 
  ChevronRight,
  TrendingUp,
  Award,
  Download
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  RadialBarChart, 
  RadialBar, 
  Legend, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function StudentDashboard() {
  const [user, setUser] = useState<any>(null);
  const [attendance, setAttendance] = useState<any>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [placements, setPlacements] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // QR Checkin State
  const [qrCode, setQrCode] = useState('');
  const [checkInMessage, setCheckInMessage] = useState('');
  const [checkingIn, setCheckingIn] = useState(false);

  // AI Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>([
    { sender: 'bot', text: 'Hi! I am your AI Smart Campus Advisor. Ask me anything about placements, assignments, or events!' }
  ]);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      fetchDashboardData(parsed.id);
    } else {
      window.location.href = '/login';
    }
  }, []);

  const fetchDashboardData = async (userId: string) => {
    try {
      setLoading(true);
      setError('');

      // Fetch student attendance summary
      const attData = await apiFetch(`/api/attendance/student/${userId}`).catch(() => ({ total: 5, present: 4, percentage: 80 }));
      setAttendance(attData);

      // Fetch assignments list
      const assignData = await apiFetch('/api/assignments').catch(() => ({ assignments: [] }));
      setAssignments(assignData.assignments || []);

      // Fetch events
      const eventData = await apiFetch('/api/events').catch(() => ({ events: [] }));
      setEvents(eventData.events || []);

      // Fetch placements
      const placementData = await apiFetch('/api/placements').catch(() => ({ placements: [] }));
      setPlacements(placementData.placements || []);

      // Fetch notifications
      const notifData = await apiFetch('/api/notifications').catch(() => ({ notifications: [] }));
      setNotifications(notifData.notifications || []);

      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setError('Could not load all dashboard data from server.');
      setLoading(false);
    }
  };

  const handleQRCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrCode) return;
    setCheckingIn(true);
    setCheckInMessage('');
    try {
      const res = await apiFetch('/api/attendance/checkin', {
        method: 'POST',
        body: JSON.stringify({ code: qrCode })
      });
      setCheckInMessage(res.message || 'Checked in successfully!');
      setQrCode('');
      // Refresh attendance
      if (user) fetchDashboardData(user.id);
    } catch (err: any) {
      setCheckInMessage(err.message || 'Check-in failed. Please verify the code.');
    } finally {
      setCheckingIn(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { sender: 'user', text: chatInput };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');

    // Simulate AI response based on keyword matching
    setTimeout(() => {
      let reply = "I am not sure about that. Let me look it up or connect you to the admin office.";
      const msg = chatInput.toLowerCase();
      if (msg.includes('placement') || msg.includes('job') || msg.includes('ctc')) {
        reply = "Currently, Google has a SDE Intern role (45 LPA CTC) open for CSE & IT students. Deadline is soon, check your placements portal!";
      } else if (msg.includes('assignment') || msg.includes('dsa') || msg.includes('dsa')) {
        reply = "You have a pending DSA linked-list assignment due in 5 days, and a Web Portfolio website due in 2 days. Make sure to submit on time!";
      } else if (msg.includes('event') || msg.includes('hackathon')) {
        reply = "The DevFusion 4.O Hackathon Kickoff is happening in 3 days at the Main Seminar Hall. You can register on the Events portal.";
      } else if (msg.includes('attendance') || msg.includes('absent')) {
        reply = `Your overall attendance is currently ${attendance?.percentage || '80'}%. You need to maintain above 75% to be eligible for placements.`;
      } else if (msg.includes('hi') || msg.includes('hello')) {
        reply = `Hello ${user?.name || 'Student'}! How can I assist you in your campus journey today?`;
      }
      setChatMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
    }, 800);
  };

  // CSV Export for Placements
  const exportPlacementsCSV = () => {
    const headers = ['Company', 'Job Role', 'CTC', 'Deadline'];
    const rows = placements.map(p => [
      p.company,
      p.jobRole,
      p.ctc,
      new Date(p.deadline).toLocaleDateString()
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `placements_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  // Prepare chart data
  const attendanceChartData = [
    { name: 'Present', value: attendance?.present || 4, fill: '#10B981' },
    { name: 'Absent', value: (attendance?.total - attendance?.present) || 1, fill: '#EF4444' }
  ];

  const pendingAssignments = assignments.filter((a: any) => {
    const hasSubmitted = a.submissions?.some((sub: any) => sub.student === user?.id);
    return !hasSubmitted;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 via-slate-50 to-blue-50/50 text-slate-800 pb-12">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/80 border-b border-slate-100 shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎓</span>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Smart Campus</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/notifications" className="relative p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-full transition">
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
            )}
          </Link>
          <div className="h-6 w-[1px] bg-slate-200"></div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-semibold shadow-sm">
              {user?.name?.[0] || 'S'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-slate-800">{user?.name}</p>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{user?.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="p-2 text-rose-500 hover:bg-rose-50 rounded-full transition" title="Logout">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 rounded-3xl p-6 md:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute left-1/3 bottom-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <span className="bg-indigo-500/30 text-indigo-100 text-xs px-3.5 py-1.5 rounded-full font-bold uppercase tracking-widest border border-indigo-400/20">Student Portal</span>
              <h2 className="text-3xl font-extrabold mt-3">Welcome back, {user?.name || 'Student'}!</h2>
              <p className="text-indigo-100/90 mt-1 font-medium">Department of {user?.department || 'CSE'} | Semester {user?.semester || 5}</p>
            </div>
            <Link href="/profile" className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 hover:scale-[1.02] transition shadow-md flex items-center gap-2">
              <User className="w-4 h-4" /> Edit Profile
            </Link>
          </div>
        </div>

        {/* Dashboard grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left / Middle Side (Stats, Charts, Modules) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Link href="/attendance" className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md border border-slate-100/80 flex flex-col items-center text-center group hover:border-indigo-200 transition">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-slate-700 mt-3 group-hover:text-indigo-600">Attendance</span>
              </Link>

              <Link href="/assignments" className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md border border-slate-100/80 flex flex-col items-center text-center group hover:border-indigo-200 transition">
                <div className="p-3 bg-orange-50 text-orange-600 rounded-xl group-hover:bg-orange-600 group-hover:text-white transition">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-slate-700 mt-3 group-hover:text-indigo-600">Assignments</span>
              </Link>

              <Link href="/events" className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md border border-slate-100/80 flex flex-col items-center text-center group hover:border-indigo-200 transition">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-slate-700 mt-3 group-hover:text-indigo-600">Events</span>
              </Link>

              <Link href="/placements" className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md border border-slate-100/80 flex flex-col items-center text-center group hover:border-indigo-200 transition">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition">
                  <Briefcase className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-slate-700 mt-3 group-hover:text-indigo-600">Placements</span>
              </Link>
            </div>

            {/* Attendance & Stats Visualization */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100/80 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" /> Attendance Overview
                </h3>
                <p className="text-sm text-slate-500 mt-1">Check class count and percentages to keep track of placement eligibility.</p>
                
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 text-center">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Total Classes</p>
                    <p className="text-2xl font-extrabold text-slate-800 mt-1">{attendance?.total || 0}</p>
                  </div>
                  <div className="bg-emerald-50/40 p-3.5 rounded-xl border border-emerald-100/50 text-center">
                    <p className="text-[10px] uppercase font-bold text-emerald-600/80">Present</p>
                    <p className="text-2xl font-extrabold text-emerald-600 mt-1">{attendance?.present || 0}</p>
                  </div>
                  <div className="bg-rose-50/40 p-3.5 rounded-xl border border-rose-100/50 text-center">
                    <p className="text-[10px] uppercase font-bold text-rose-500/80">Absent</p>
                    <p className="text-2xl font-extrabold text-rose-500 mt-1">{(attendance?.total - attendance?.present) || 0}</p>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2.5">
                  <span className={`w-3.5 h-3.5 rounded-full ${parseFloat(attendance?.percentage) >= 75 ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                  <span className="text-sm font-bold text-slate-700">
                    {parseFloat(attendance?.percentage) >= 75 ? 'Eligible for placement drives ✅' : 'Attendance below 75% ⚠️'}
                  </span>
                </div>
              </div>

              {/* Chart */}
              <div className="h-48 flex items-center justify-center relative">
                {isMounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={attendanceChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {attendanceChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-indigo-600">{attendance?.percentage || '0'}%</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Attendance</span>
                </div>
              </div>
            </div>

            {/* Assignments due checklist */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100/80 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-orange-500" /> Pending Assignments
                  </h3>
                  <p className="text-sm text-slate-500">Submit solutions before the deadline to secure grading rubrics.</p>
                </div>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-extrabold">
                  {pendingAssignments.length} Pending
                </span>
              </div>

              <div className="space-y-4">
                {pendingAssignments.length === 0 ? (
                  <div className="text-center py-6 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                    <p className="text-slate-500 text-sm">All caught up! No pending assignments. 🎉</p>
                  </div>
                ) : (
                  pendingAssignments.slice(0, 3).map((a: any) => (
                    <div key={a._id} className="p-4 rounded-xl bg-slate-50/70 border border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-slate-200 transition">
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">{a.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">Course: {a.course} | Max Marks: {a.maxMarks}</p>
                        <p className="text-xs text-amber-600 font-bold mt-1">Due: {new Date(a.deadline).toLocaleDateString()}</p>
                      </div>
                      <Link href="/assignments" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition flex items-center gap-1 self-start sm:self-center">
                        Submit Solution <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Placements listing and CSV exporter */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100/80 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-emerald-500" /> Active Placement Drives
                  </h3>
                  <p className="text-sm text-slate-500">Apply to matching companies and track application progress.</p>
                </div>
                <button 
                  onClick={exportPlacementsCSV}
                  className="px-4 py-2 text-indigo-600 border border-indigo-200 rounded-lg text-xs font-bold hover:bg-indigo-50 flex items-center gap-1.5 transition self-start sm:self-center"
                >
                  <Download className="w-3.5 h-3.5" /> Export Placement list
                </button>
              </div>

              <div className="space-y-4">
                {placements.length === 0 ? (
                  <div className="text-center py-6 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                    <p className="text-slate-500 text-sm">No active placement drives currently open.</p>
                  </div>
                ) : (
                  placements.slice(0, 2).map((p: any) => (
                    <div key={p._id} className="p-4 rounded-xl bg-slate-50/70 border border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-slate-200 transition">
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-800">{p.company}</h4>
                        <p className="text-xs text-slate-500 mt-1">{p.jobRole} | CTC: {p.ctc}</p>
                        <p className="text-[10px] text-slate-400 font-semibold">Min CGPA: {p.eligibility?.minCGPA || 0} | Eligible Depts: {p.eligibility?.departments?.join(', ') || 'All'}</p>
                      </div>
                      <Link href="/placements" className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition flex items-center gap-1 self-start sm:self-center">
                        Apply Now <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Right Side (QR Checkin, Announcements, Notifications) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* QR Check-in Simulation Card */}
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
              <div className="absolute right-0 bottom-0 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
              <h3 className="text-md font-bold flex items-center gap-2">
                <QrCode className="w-5 h-5 text-indigo-200" /> Fast Attendance Check-in
              </h3>
              <p className="text-xs text-indigo-100/90 mt-1">Enter code generated by faculty QR check-in session to mark attendance instantly.</p>
              
              <form onSubmit={handleQRCheckIn} className="mt-5 space-y-3">
                <input 
                  type="text" 
                  placeholder="Enter Class Code (e.g. DSA101)" 
                  value={qrCode} 
                  onChange={(e) => setQrCode(e.target.value)} 
                  className="w-full p-2.5 text-xs text-slate-800 rounded-xl bg-white border-none focus:ring-2 focus:ring-indigo-300 font-semibold focus:outline-none"
                  required
                />
                <button 
                  type="submit" 
                  disabled={checkingIn || !qrCode}
                  className="w-full p-2.5 bg-white text-indigo-700 hover:bg-indigo-50 transition rounded-xl text-xs font-extrabold disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {checkingIn ? 'Checking In...' : 'Verify & Check In'}
                </button>
              </form>
              
              {checkInMessage && (
                <div className="mt-3.5 p-2 bg-white/10 rounded-xl text-center">
                  <p className="text-xs font-bold text-indigo-100">{checkInMessage}</p>
                </div>
              )}
            </div>

            {/* Upcoming Event Reminder Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100/80 shadow-sm">
              <h3 className="text-md font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-purple-600" /> Upcoming Campus Events
              </h3>
              <div className="space-y-4">
                {events.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">No events registered.</p>
                ) : (
                  events.slice(0, 2).map((ev: any) => (
                    <div key={ev._id} className="p-3 bg-slate-50/70 border border-slate-100 rounded-xl hover:border-slate-200 transition">
                      <h4 className="text-xs font-bold text-slate-800">{ev.title}</h4>
                      <p className="text-[10px] text-slate-500 mt-1">Venue: {ev.venue}</p>
                      <p className="text-[10px] text-purple-600 font-bold mt-1">Date: {new Date(ev.date).toLocaleDateString()}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Notifications Feed */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100/80 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-bold text-slate-800 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-500" /> Recent Alerts
                </h3>
                <Link href="/notifications" className="text-xs text-indigo-600 hover:underline">View All</Link>
              </div>

              <div className="space-y-3.5">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">All quiet. No new notifications.</p>
                ) : (
                  notifications.slice(0, 3).map((notif: any) => (
                    <div key={notif._id} className="p-3 bg-slate-50/50 rounded-xl border border-slate-100/50 flex gap-2">
                      <span className="text-xs mt-0.5">
                        {notif.type === 'assignment' ? '📝' : notif.type === 'attendance' ? '📋' : notif.type === 'placement' ? '💼' : '🔔'}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 leading-tight">{notif.title}</h4>
                        <p className="text-[10px] text-slate-500 leading-normal mt-0.5">{notif.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Floating AI Campus Assistant Toggle */}
      <button 
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 p-4 bg-gradient-to-tr from-indigo-600 to-violet-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition duration-200 z-50 flex items-center justify-center"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* AI Campus Assistant Panel */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white border border-slate-100 shadow-2xl rounded-2xl z-50 flex flex-col overflow-hidden max-h-[500px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-xl">🤖</span>
              <div>
                <h4 className="text-xs font-extrabold">Smart Campus AI</h4>
                <p className="text-[9px] text-indigo-100">Live Campus Advisor Agent</p>
              </div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-white/80 hover:text-white text-xs font-bold">Close</button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-80 bg-slate-50/50">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-2xl max-w-[80%] text-xs ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none shadow-sm'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 flex gap-2">
            <input 
              type="text" 
              placeholder="Ask me something (e.g. placements, events)..." 
              value={chatInput} 
              onChange={(e) => setChatInput(e.target.value)} 
              className="flex-1 p-2 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs focus:outline-none"
              required
            />
            <button type="submit" className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
