'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { Briefcase, Calendar, CheckCircle, Award, Send, Users, ShieldAlert } from 'lucide-react';

export default function PlacementsPage() {
  const [user, setUser] = useState<any>(null);
  const [placements, setPlacements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Apply Form State
  const [selectedPlacement, setSelectedPlacement] = useState<any>(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [applyMsg, setApplyMsg] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
      fetchPlacements();
    } else {
      window.location.href = '/login';
    }
  }, []);

  const fetchPlacements = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiFetch('/api/placements');
      setPlacements(data.placements || []);
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setError('Could not retrieve placement drives from backend.');
      setLoading(false);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlacement) return;
    setApplying(true);
    setApplyMsg('');
    try {
      await apiFetch(`/api/placements/${selectedPlacement._id}/apply`, {
        method: 'POST',
        body: JSON.stringify({
          resumeUrl: resumeUrl || 'https://smart-campus-storage.s3.amazonaws.com/resumes/john_doe_cv.pdf'
        })
      });

      setApplyMsg('Application submitted successfully! 🚀');
      setResumeUrl('');
      fetchPlacements();
      setTimeout(() => {
        setSelectedPlacement(null);
        setApplyMsg('');
      }, 1500);
    } catch (err: any) {
      setApplyMsg(err.message || 'Application failed. Please verify eligibility.');
    } finally {
      setApplying(false);
    }
  };

  // Helper: check if student has applied
  const getApplication = (placement: any) => {
    if (!user || user.role !== 'student') return null;
    return placement.applications?.find((a: any) => {
      const studentId = a.student?._id || a.student;
      return studentId === user.id;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600 mx-auto"></div>
          <p className="text-xs text-slate-500 mt-3 font-semibold">Loading placement postings...</p>
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
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-indigo-600" /> Placement Drives
          </h2>
          <p className="text-xs text-slate-500 mt-1">Discover campus recruitments, review eligibility requirements, and submit applications.</p>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-center text-xs text-rose-700 font-semibold mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Placements Feed */}
          <div className="lg:col-span-2 space-y-4">
            {placements.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center shadow-sm">
                <p className="text-slate-500 text-sm">No active placement drives currently open.</p>
              </div>
            ) : (
              placements.map((p: any) => {
                const app = getApplication(p);
                const isOverdue = new Date() > new Date(p.deadline);
                
                return (
                  <div key={p._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-6 hover:shadow-md transition">
                    <div className="space-y-1">
                      <div className="flex gap-2">
                        <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 font-extrabold rounded-full text-[9px] uppercase tracking-wider">
                          CTC: {p.ctc}
                        </span>
                        <span className="px-2.5 py-0.5 bg-slate-50 text-slate-400 font-extrabold rounded-full text-[9px] uppercase tracking-wider">
                          Min CGPA: {p.eligibility?.minCGPA || 0}
                        </span>
                      </div>
                      <h3 className="text-base font-extrabold text-slate-800">{p.company}</h3>
                      <p className="text-xs font-bold text-indigo-600">{p.jobRole}</p>
                      <p className="text-xs text-slate-500 max-w-md pt-1">{p.description}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-400 font-semibold pt-2">
                        <span className="flex items-center gap-0.5"><Calendar className="w-3 h-3" /> Apply By: {new Date(p.deadline).toLocaleDateString()}</span>
                        <span className="flex items-center gap-0.5"><Users className="w-3 h-3" /> Eligible Depts: {p.eligibility?.departments?.join(', ') || 'All'}</span>
                      </div>
                    </div>

                    {user?.role === 'student' && (
                      <div className="flex items-center gap-3 self-start md:self-center">
                        {app ? (
                          <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold capitalize ${app.status === 'selected' ? 'bg-emerald-100 text-emerald-800' : app.status === 'rejected' ? 'bg-rose-100 text-rose-800' : app.status === 'shortlisted' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                              {app.status}
                            </span>
                            <p className="text-[9px] text-slate-400 mt-1">Applied on {new Date(app.appliedAt).toLocaleDateString()}</p>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setSelectedPlacement(p)}
                            disabled={isOverdue}
                            className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 transition text-xs font-bold rounded-lg"
                          >
                            {isOverdue ? 'Closed' : 'Apply'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Form on Right */}
          <div className="lg:col-span-1">
            {selectedPlacement ? (
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-extrabold uppercase text-slate-400">Application Form</h3>
                  <button onClick={() => setSelectedPlacement(null)} className="text-[10px] text-indigo-600 hover:underline">Cancel</button>
                </div>
                <div className="border-t border-slate-50 pt-2">
                  <h4 className="text-sm font-bold text-slate-800">{selectedPlacement.company}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{selectedPlacement.jobRole} | package: {selectedPlacement.ctc}</p>
                </div>

                <form onSubmit={handleApply} className="space-y-4 pt-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500">Submit Resume Link (PDF / S3 Link)</label>
                    <input 
                      type="url" 
                      placeholder="https://drive.google.com/resume.pdf"
                      value={resumeUrl} 
                      onChange={(e) => setResumeUrl(e.target.value)} 
                      className="w-full mt-1.5 p-2 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs focus:outline-none"
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={applying}
                    className="w-full py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition"
                  >
                    {applying ? 'Applying...' : 'Submit Application'}
                  </button>
                </form>

                {applyMsg && (
                  <p className="p-2 bg-emerald-50 border border-emerald-100 rounded-xl text-[10px] text-emerald-700 font-semibold text-center mt-2">
                    {applyMsg}
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200/60 p-6 rounded-2xl text-center shadow-inner">
                <p className="text-xs text-slate-500">Click the **Apply** button next to any recruitment notice to submit your details and CV.</p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
