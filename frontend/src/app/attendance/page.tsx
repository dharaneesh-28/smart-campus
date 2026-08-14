'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { CheckCircle, Calendar, AlertTriangle, Clock } from 'lucide-react';

export default function AttendancePage() {
  const [user, setUser] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      fetchAttendance(parsed.id);
    } else {
      window.location.href = '/login';
    }
  }, []);

  const fetchAttendance = async (userId: string) => {
    try {
      setLoading(true);
      setError('');
      const data = await apiFetch(`/api/attendance/student/${userId}`);
      setMetrics({
        total: data.total || 0,
        present: data.present || 0,
        percentage: data.percentage || '0.00'
      });

      // Parse status logs from sheets history
      const parsedLogs = (data.history || []).map((sheet: any) => {
        const studentRecord = sheet.students?.find((s: any) => {
          const sId = s.student?._id || s.student;
          return sId === userId;
        });
        return {
          date: new Date(sheet.date).toLocaleDateString(),
          course: sheet.course,
          status: studentRecord ? studentRecord.status : 'absent'
        };
      });

      setLogs(parsedLogs);
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setError('Could not retrieve attendance records from backend.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600 mx-auto"></div>
          <p className="text-xs text-slate-500 mt-3 font-semibold">Loading attendance logs...</p>
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
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-indigo-600" /> My Attendance Log
          </h2>
          <p className="text-xs text-slate-500 mt-1">Review lecture sessions status log history and track eligibility thresholds.</p>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-center text-xs text-rose-700 font-semibold mb-6">
            {error}
          </div>
        )}

        {/* Attendance Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
            <span className="text-xs uppercase font-extrabold text-slate-400">Total Lectures</span>
            <p className="text-3xl font-black text-slate-850 mt-1">{metrics?.total}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
            <span className="text-xs uppercase font-extrabold text-emerald-600/80">Attended count</span>
            <p className="text-3xl font-black text-emerald-600 mt-1">{metrics?.present}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
            <span className="text-xs uppercase font-extrabold text-indigo-600">Attendance Ratio</span>
            <p className="text-3xl font-black text-indigo-600 mt-1">{metrics?.percentage}%</p>
          </div>
        </div>

        {/* Warning Banner */}
        {parseFloat(metrics?.percentage) < 75 && (
          <div className="p-4 bg-rose-50 border border-rose-100/50 rounded-2xl flex items-start gap-3 text-rose-800 text-xs font-semibold mb-6">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <h4 className="font-extrabold">Attendance Shortage Warning!</h4>
              <p className="text-rose-700/90 mt-0.5">Your attendance is below the mandatory 75% college requirement. Please attend classes regularly to prevent placement drive disqualifications.</p>
            </div>
          </div>
        )}

        {/* Logs Table */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="bg-slate-50 p-4 border-b border-slate-100 grid grid-cols-12 text-[10px] font-bold uppercase text-slate-400 tracking-wider text-center">
            <span className="col-span-3 text-left pl-4">Date</span>
            <span className="col-span-6 text-left">Course Name</span>
            <span className="col-span-3">Status</span>
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {logs.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No attendance logs found in database.</p>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className="p-4 grid grid-cols-12 items-center text-center">
                  <span className="col-span-3 text-left pl-4 font-bold text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-300" /> {log.date}
                  </span>
                  <span className="col-span-6 text-left font-semibold text-slate-700 uppercase tracking-wide text-[11px]">{log.course}</span>
                  <span className="col-span-3 flex justify-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1 ${log.status === 'present' ? 'bg-emerald-50 text-emerald-700' : log.status === 'absent' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${log.status === 'present' ? 'bg-emerald-500' : log.status === 'absent' ? 'bg-rose-500' : 'bg-amber-500'}`}></span>
                      {log.status}
                    </span>
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
