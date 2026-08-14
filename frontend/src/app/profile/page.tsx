'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { User, Phone, Briefcase, GraduationCap, Link2, FileText, CheckCircle } from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  
  // Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [semester, setSemester] = useState('5');
  const [skills, setSkills] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [bio, setBio] = useState('');

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiFetch('/api/auth/me');
      if (data.success && data.user) {
        const u = data.user;
        setUser(u);
        setName(u.name || '');
        setPhone(u.phone || '');
        setDepartment(u.department || '');
        setRollNumber(u.rollNumber || '');
        setSemester(u.semester ? String(u.semester) : '5');
        setSkills(u.skills ? u.skills.join(', ') : '');
        setLinkedin(u.linkedin || '');
        setGithub(u.github || '');
        setBio(u.bio || '');
      }
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setError('Could not retrieve user profile from the server.');
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
      const res = await apiFetch('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({
          name,
          phone,
          department,
          rollNumber,
          semester: parseInt(semester),
          skills: skillsArray,
          linkedin,
          github,
          bio
        })
      });

      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('user', JSON.stringify(res.user));
        setMessage('Profile updated successfully! ✅');
      }
    } catch (err: any) {
      setError(err.message || 'Profile update failed.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600 mx-auto"></div>
          <p className="text-xs text-slate-500 mt-3 font-semibold">Loading profile information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/40 via-slate-50 to-blue-50/40 text-slate-800 pb-12">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm px-8 py-4 flex justify-between items-center border-b border-slate-100">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎓</span>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Smart Campus</h1>
        </div>
        <Link href={`/dashboard/${user?.role || 'student'}`} className="text-xs font-extrabold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition">
          ← Back to Dashboard
        </Link>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
          <User className="w-6 h-6 text-indigo-600" /> Account Profile Settings
        </h2>
        
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 border-b border-slate-100 pb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white text-3xl font-black shadow-lg">
              {name?.[0] || 'S'}
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-extrabold text-slate-800">{name}</h3>
              <p className="text-xs text-slate-500">{user?.email}</p>
              <div className="mt-2.5 flex flex-wrap justify-center sm:justify-start gap-2">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                  Role: {user?.role}
                </span>
                {user?.rollNumber && (
                  <span className="px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-[10px] font-bold">
                    Roll: {user.rollNumber}
                  </span>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            {message && (
              <p className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-700 text-center font-bold">
                {message}
              </p>
            )}
            {error && (
              <p className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-700 text-center font-bold">
                {error}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500">Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="w-full mt-1.5 p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-100 font-semibold"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">Phone Contact</label>
                <input 
                  type="tel" 
                  placeholder="e.g. 9876543210"
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  className="w-full mt-1.5 p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-100 font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500">Department</label>
                <input 
                  type="text" 
                  placeholder="e.g. CSE"
                  value={department} 
                  onChange={(e) => setDepartment(e.target.value)} 
                  className="w-full mt-1.5 p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-100 font-semibold text-slate-600 uppercase"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">Roll Number</label>
                <input 
                  type="text" 
                  placeholder="e.g. CSE-2024-042"
                  value={rollNumber} 
                  onChange={(e) => setRollNumber(e.target.value)} 
                  className="w-full mt-1.5 p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-100 font-semibold text-slate-600"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">Semester</label>
                <select 
                  value={semester} 
                  onChange={(e) => setSemester(e.target.value)} 
                  className="w-full mt-1.5 p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-100 font-semibold"
                >
                  {[1,2,3,4,5,6,7,8].map(s => (
                    <option key={s} value={s}>Semester {s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500">Professional Skills (comma separated)</label>
              <input 
                type="text" 
                placeholder="e.g. React, Node.js, Python, Figma"
                value={skills} 
                onChange={(e) => setSkills(e.target.value)} 
                className="w-full mt-1.5 p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-100 font-semibold text-slate-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500">LinkedIn Link</label>
                <input 
                  type="url" 
                  placeholder="https://linkedin.com/in/username"
                  value={linkedin} 
                  onChange={(e) => setLinkedin(e.target.value)} 
                  className="w-full mt-1.5 p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-100 font-semibold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">GitHub Link</label>
                <input 
                  type="url" 
                  placeholder="https://github.com/username"
                  value={github} 
                  onChange={(e) => setGithub(e.target.value)} 
                  className="w-full mt-1.5 p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-100 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500">Bio</label>
              <textarea 
                placeholder="Write a brief professional description about yourself..."
                value={bio} 
                onChange={(e) => setBio(e.target.value)} 
                rows={3}
                className="w-full mt-1.5 p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-100 font-semibold"
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-xs font-extrabold hover:shadow-lg transition scale-100 hover:scale-[1.01]"
            >
              Save Profile Customizations
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
