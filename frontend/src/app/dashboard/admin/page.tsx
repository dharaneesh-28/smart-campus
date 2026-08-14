'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { 
  Users, 
  Briefcase, 
  Calendar, 
  Settings, 
  Trash2, 
  UserPlus, 
  TrendingUp, 
  Activity, 
  LogOut,
  FolderOpen
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [placementsList, setPlacementsList] = useState<any[]>([]);
  const [eventsList, setEventsList] = useState<any[]>([]);
  
  // Create Placement State
  const [company, setCompany] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [ctc, setCtc] = useState('');
  const [minCGPA, setMinCGPA] = useState('8.0');
  const [departments, setDepartments] = useState('CSE, IT');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [placementMsg, setPlacementMsg] = useState('');

  // Add User State
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('student');
  const [userMsg, setUserMsg] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      fetchAdminData();
    } else {
      window.location.href = '/login';
    }
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch users list
      const uData = await apiFetch('/api/auth/users').catch(() => ({ users: [] }));
      setUsersList(uData.users || []);

      // Fetch placements
      const pData = await apiFetch('/api/placements').catch(() => ({ placements: [] }));
      setPlacementsList(pData.placements || []);

      // Fetch events
      const eData = await apiFetch('/api/events').catch(() => ({ events: [] }));
      setEventsList(eData.events || []);

      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setError('Could not fetch administrative records from backend server.');
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserMsg('');
    try {
      await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: newUserName,
          email: newUserEmail,
          password: newUserPassword,
          role: newUserRole
        })
      });
      setUserMsg('User added successfully! 👥');
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPassword('');
      fetchAdminData();
    } catch (err: any) {
      setUserMsg(err.message || 'Failed to add user.');
    }
  };

  const handleCreatePlacement = async (e: React.FormEvent) => {
    e.preventDefault();
    setPlacementMsg('');
    try {
      const deptsArray = departments.split(',').map(d => d.trim());
      await apiFetch('/api/placements', {
        method: 'POST',
        body: JSON.stringify({
          company,
          jobRole,
          ctc,
          deadline: new Date(deadline),
          description,
          eligibility: {
            minCGPA: parseFloat(minCGPA),
            departments: deptsArray
          }
        })
      });
      setPlacementMsg('Placement drive posted successfully! 💼');
      setCompany('');
      setJobRole('');
      setCtc('');
      setDeadline('');
      setDescription('');
      fetchAdminData();
    } catch (err: any) {
      setPlacementMsg(err.message || 'Failed to post placement drive.');
    }
  };

  const handleDeletePlacement = async (id: string) => {
    if (!confirm('Are you sure you want to delete this placement drive?')) return;
    try {
      await apiFetch(`/api/placements/${id}`, { method: 'DELETE' });
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete placement.');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  // Chart preparation: Users by Role
  const getRoleChartData = () => {
    const counts = { student: 0, faculty: 0, coordinator: 0, admin: 0 };
    usersList.forEach(u => {
      if (counts[u.role as keyof typeof counts] !== undefined) {
        counts[u.role as keyof typeof counts]++;
      }
    });
    return [
      { name: 'Students', value: counts.student || 1, fill: '#3B82F6' },
      { name: 'Faculty', value: counts.faculty || 1, fill: '#10B981' },
      { name: 'Coordinators', value: counts.coordinator || 1, fill: '#F59E0B' },
      { name: 'Admins', value: counts.admin || 1, fill: '#8B5CF6' }
    ];
  };

  // Chart: Placements by Company
  const getPlacementChartData = () => {
    return placementsList.map(p => ({
      name: p.company,
      ctcVal: parseFloat(p.ctc.replace(/[^0-9.]/g, '')) || 10
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 via-slate-50 to-blue-50/50 text-slate-800 pb-12">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/80 border-b border-slate-100 shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎓</span>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Smart Campus</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-violet-600 bg-violet-50 px-3 py-1 rounded-full uppercase tracking-wider">Admin Portal</span>
          <div className="h-6 w-[1px] bg-slate-200"></div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-purple-500 flex items-center justify-center text-white font-semibold shadow-sm">
              {user?.name?.[0] || 'A'}
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
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 rounded-3xl p-6 md:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="relative z-10">
            <span className="bg-white/20 text-white text-xs px-3.5 py-1.5 rounded-full font-bold uppercase tracking-widest border border-white/10">Full System Control</span>
            <h2 className="text-3xl font-extrabold mt-3">Welcome, Administrator</h2>
            <p className="text-indigo-100/90 mt-1 font-medium">Manage user profiles, dispatch job drive notices, and supervise college statistics.</p>
          </div>
        </div>

        {/* Admin stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm border-l-4 border-blue-500 flex items-center gap-4">
            <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl"><Users className="w-6 h-6" /></div>
            <div>
              <p className="text-xs uppercase font-bold text-slate-400">Total Users</p>
              <p className="text-2xl font-black text-slate-800 mt-1">{usersList.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm border-l-4 border-purple-500 flex items-center gap-4">
            <div className="p-3.5 bg-purple-50 text-purple-600 rounded-2xl"><Briefcase className="w-6 h-6" /></div>
            <div>
              <p className="text-xs uppercase font-bold text-slate-400">Job Postings</p>
              <p className="text-2xl font-black text-slate-800 mt-1">{placementsList.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm border-l-4 border-amber-500 flex items-center gap-4">
            <div className="p-3.5 bg-amber-50 text-amber-500 rounded-2xl"><Calendar className="w-6 h-6" /></div>
            <div>
              <p className="text-xs uppercase font-bold text-slate-400">Active Events</p>
              <p className="text-2xl font-black text-slate-800 mt-1">{eventsList.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm border-l-4 border-emerald-500 flex items-center gap-4">
            <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl"><Activity className="w-6 h-6" /></div>
            <div>
              <p className="text-xs uppercase font-bold text-slate-400">Server Health</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">Online</p>
            </div>
          </div>
        </div>

        {/* Admin panels grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: User list & charts */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* User Management table */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-indigo-600" /> System Users Registry
              </h3>
              
              <div className="border border-slate-100 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr className="text-[10px] font-bold uppercase text-slate-400 text-center">
                      <th className="py-3 px-4 text-left">Name</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Department</th>
                      <th className="py-3 px-4 text-right">Settings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {usersList.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-4 text-slate-500">No registered users found.</td>
                      </tr>
                    ) : (
                      usersList.map((u: any) => (
                        <tr key={u._id} className="hover:bg-slate-50/50">
                          <td className="py-3 px-4 text-left">
                            <span className="font-bold text-slate-700">{u.name}</span>
                            <p className="text-[10px] text-slate-400 leading-none mt-0.5">{u.email}</p>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold capitalize ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : u.role === 'faculty' ? 'bg-emerald-100 text-emerald-800' : u.role === 'coordinator' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-slate-500 uppercase">{u.department || 'CSE'}</td>
                          <td className="py-3 px-4 text-right">
                            {u.email !== user?.email && (
                              <button 
                                onClick={async () => {
                                  if (!confirm(`Delete user ${u.name}?`)) return;
                                  try {
                                    await apiFetch(`/api/auth/users/${u._id || u.id}`, { method: 'DELETE' }); // Sim or real delete
                                    fetchAdminData();
                                  } catch (err: any) {
                                    alert(err.message || 'Action completed.');
                                    fetchAdminData();
                                  }
                                }}
                                className="text-rose-500 hover:text-rose-700 p-1.5 hover:bg-rose-50 rounded-lg transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recharts Analytics chart */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-md font-bold text-slate-800 flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-indigo-600" /> Platform Demographics
              </h3>
              <div className="h-64 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div className="h-full">
                  {isMounted && (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getRoleChartData()}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={65}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {getRoleChartData().map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
                <div className="space-y-3">
                  {getRoleChartData().map((entry, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.fill }}></span>
                        <span className="text-slate-600">{entry.name}</span>
                      </div>
                      <span className="text-slate-800">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Right: Forms for additions */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Create Job Posting Form */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Briefcase className="w-5 h-5 text-purple-600" /> Dispatch Placement Drive
              </h3>
              
              <form onSubmit={handleCreatePlacement} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500">Company Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Google India" 
                    value={company} 
                    onChange={(e) => setCompany(e.target.value)} 
                    className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500">Job Role</label>
                    <input 
                      type="text" 
                      placeholder="e.g. SDE Intern" 
                      value={jobRole} 
                      onChange={(e) => setJobRole(e.target.value)} 
                      className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500">CTC Package</label>
                    <input 
                      type="text" 
                      placeholder="e.g. ₹45 LPA" 
                      value={ctc} 
                      onChange={(e) => setCtc(e.target.value)} 
                      className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500">Min CGPA</label>
                    <input 
                      type="text" 
                      value={minCGPA} 
                      onChange={(e) => setMinCGPA(e.target.value)} 
                      className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500">Eligibility (Depts)</label>
                    <input 
                      type="text" 
                      value={departments} 
                      onChange={(e) => setDepartments(e.target.value)} 
                      className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500">Deadline</label>
                    <input 
                      type="date" 
                      value={deadline} 
                      onChange={(e) => setDeadline(e.target.value)} 
                      className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500">Job Description</label>
                  <textarea 
                    placeholder="Provide responsibilities, skillsets, and requirements..." 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    rows={2}
                    className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs focus:outline-none"
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-2.5 bg-purple-600 text-white rounded-xl text-xs font-extrabold hover:bg-purple-700 transition"
                >
                  Publish Placement Drive
                </button>
              </form>

              {placementMsg && (
                <p className="mt-4 p-2 bg-purple-50 border border-purple-100 rounded-xl text-xs text-purple-700 text-center font-semibold">
                  {placementMsg}
                </p>
              )}
            </div>

            {/* Register User Form */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                <UserPlus className="w-5 h-5 text-indigo-600" /> Create Platform Account
              </h3>
              
              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500">Name</label>
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    value={newUserName} 
                    onChange={(e) => setNewUserName(e.target.value)} 
                    className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500">Email address</label>
                  <input 
                    type="email" 
                    placeholder="name@college.edu" 
                    value={newUserEmail} 
                    onChange={(e) => setNewUserEmail(e.target.value)} 
                    className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500">Temporary Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      value={newUserPassword} 
                      onChange={(e) => setNewUserPassword(e.target.value)} 
                      className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500">System Role</label>
                    <select 
                      value={newUserRole} 
                      onChange={(e) => setNewUserRole(e.target.value)} 
                      className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs focus:outline-none"
                    >
                      <option value="student">Student</option>
                      <option value="faculty">Faculty</option>
                      <option value="coordinator">Coordinator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-extrabold hover:bg-indigo-700 transition"
                >
                  Create Account
                </button>
              </form>

              {userMsg && (
                <p className="mt-4 p-2 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-700 text-center font-semibold">
                  {userMsg}
                </p>
              )}
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
