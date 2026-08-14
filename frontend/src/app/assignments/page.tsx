'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { BookOpen, Calendar, CheckCircle, Clock, Send, Award, FileText } from 'lucide-react';

export default function AssignmentsPage() {
  const [user, setUser] = useState<any>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Submit Form State
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [githubLink, setGithubLink] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [submitMsg, setSubmitMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
      fetchAssignments();
    } else {
      window.location.href = '/login';
    }
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiFetch('/api/assignments');
      setAssignments(data.assignments || []);
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setError('Could not retrieve assignments list from server.');
      setLoading(false);
    }
  };

  const handleSubmitSolution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    setSubmitting(true);
    setSubmitMsg('');
    try {
      await apiFetch(`/api/assignments/${selectedAssignment._id}/submit`, {
        method: 'POST',
        body: JSON.stringify({
          githubLink,
          fileUrl: fileUrl || 'https://smart-campus-storage.s3.amazonaws.com/submissions/doc.pdf'
        })
      });

      setSubmitMsg('Assignment submitted successfully! 🚀');
      setGithubLink('');
      setFileUrl('');
      // Refresh
      fetchAssignments();
      setTimeout(() => {
        setSelectedAssignment(null);
        setSubmitMsg('');
      }, 1500);
    } catch (err: any) {
      setSubmitMsg(err.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Helper: check if student has submitted
  const getSubmission = (assign: any) => {
    if (!user || user.role !== 'student') return null;
    return assign.submissions?.find((s: any) => {
      const sId = s.student?._id || s.student;
      return sId === user.id;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600 mx-auto"></div>
          <p className="text-xs text-slate-500 mt-3 font-semibold">Loading assignments...</p>
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
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-600" /> Course Assignments
            </h2>
            <p className="text-xs text-slate-500 mt-1">Review guidelines, verify deadlines, and submit or grade answers.</p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-center text-xs text-rose-700 font-semibold mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Assignments List */}
          <div className="lg:col-span-2 space-y-4">
            {assignments.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center shadow-sm">
                <p className="text-slate-500 text-sm">No course assignments have been published yet.</p>
              </div>
            ) : (
              assignments.map((a: any) => {
                const sub = getSubmission(a);
                const isOverdue = new Date() > new Date(a.deadline);
                
                return (
                  <div key={a._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-6 hover:shadow-md transition">
                    <div className="space-y-1">
                      <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-600 font-extrabold rounded-full text-[9px] uppercase tracking-wider">
                        {a.course}
                      </span>
                      <h3 className="text-base font-extrabold text-slate-800">{a.title}</h3>
                      <p className="text-xs text-slate-500 max-w-md">{a.description}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-400 font-semibold pt-1">
                        <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" /> Due: {new Date(a.deadline).toLocaleDateString()}</span>
                        <span className="flex items-center gap-0.5"><Award className="w-3 h-3" /> Max Marks: {a.maxMarks}</span>
                      </div>
                    </div>

                    {user?.role === 'student' && (
                      <div className="flex items-center gap-3 self-start md:self-center">
                        {sub ? (
                          <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold capitalize ${sub.status === 'graded' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                              {sub.status === 'graded' ? `Graded: ${sub.marks}/${a.maxMarks}` : 'Submitted'}
                            </span>
                            {sub.feedback && (
                              <p className="text-[10px] text-slate-400 mt-1 italic max-w-xs">"{sub.feedback}"</p>
                            )}
                          </div>
                        ) : (
                          <button 
                            onClick={() => setSelectedAssignment(a)}
                            disabled={isOverdue}
                            className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 transition text-xs font-bold rounded-lg"
                          >
                            {isOverdue ? 'Closed' : 'Submit'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Submission Modal Form on Right */}
          <div className="lg:col-span-1">
            {selectedAssignment ? (
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-extrabold uppercase text-slate-400">Submission Form</h3>
                  <button onClick={() => setSelectedAssignment(null)} className="text-[10px] text-indigo-600 hover:underline">Cancel</button>
                </div>
                <div className="border-t border-slate-50 pt-2">
                  <h4 className="text-sm font-bold text-slate-800">{selectedAssignment.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{selectedAssignment.course}</p>
                </div>

                <form onSubmit={handleSubmitSolution} className="space-y-4 pt-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500">GitHub Repository Link</label>
                    <input 
                      type="url" 
                      placeholder="https://github.com/username/project"
                      value={githubLink} 
                      onChange={(e) => setGithubLink(e.target.value)} 
                      className="w-full mt-1.5 p-2 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500">File Url / Google Drive Link (Optional)</label>
                    <input 
                      type="url" 
                      placeholder="https://drive.google.com/..."
                      value={fileUrl} 
                      onChange={(e) => setFileUrl(e.target.value)} 
                      className="w-full mt-1.5 p-2 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs focus:outline-none"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
                  >
                    {submitting ? 'Submitting...' : 'Upload Submission'}
                  </button>
                </form>

                {submitMsg && (
                  <p className="p-2 bg-indigo-50 border border-indigo-100 rounded-xl text-[10px] text-indigo-700 font-semibold text-center mt-2">
                    {submitMsg}
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200/60 p-6 rounded-2xl text-center shadow-inner">
                <p className="text-xs text-slate-500">Click the **Submit** button next to any assignment to open the upload portal.</p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
