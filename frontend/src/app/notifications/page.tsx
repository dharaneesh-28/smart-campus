'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { Bell, CheckCircle, Trash2, MailOpen, Mail } from 'lucide-react';

export default function NotificationsPage() {
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
      fetchNotifications();
    } else {
      window.location.href = '/login';
    }
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiFetch('/api/notifications');
      setNotifications(data.notifications || []);
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setError('Could not fetch notifications from server.');
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await apiFetch(`/api/notifications/${id}/read`, { method: 'PUT' });
      fetchNotifications();
    } catch (err: any) {
      alert(err.message || 'Action failed.');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await apiFetch('/api/notifications/read-all', { method: 'PUT' });
      fetchNotifications();
    } catch (err: any) {
      alert(err.message || 'Action failed.');
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      await apiFetch(`/api/notifications/${id}`, { method: 'DELETE' });
      fetchNotifications();
    } catch (err: any) {
      alert(err.message || 'Delete failed.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600 mx-auto"></div>
          <p className="text-xs text-slate-500 mt-3 font-semibold">Loading notifications...</p>
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
        
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
              <Bell className="w-6 h-6 text-indigo-600" /> Notifications Feed
            </h2>
            <p className="text-xs text-slate-500 mt-1">Review live course updates, attendance sheets, event rosters, and system alerts.</p>
          </div>
          {notifications.some(n => !n.isRead) && (
            <button 
              onClick={handleMarkAllRead}
              className="text-xs font-extrabold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition flex items-center gap-1 self-start sm:self-center"
            >
              <MailOpen className="w-3.5 h-3.5" /> Mark all read
            </button>
          )}
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-center text-xs text-rose-700 font-semibold mb-6">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center shadow-sm">
              <p className="text-slate-500 text-sm">No notifications found in database. All caught up! 🎉</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div 
                key={n._id} 
                className={`p-5 rounded-2xl border transition shadow-sm flex justify-between items-start gap-6 border-l-4 ${!n.isRead ? 'bg-indigo-50/50 border-indigo-500 border-t-slate-100 border-r-slate-100 border-b-slate-100' : 'bg-white border-slate-100'}`}
              >
                <div className="flex gap-3">
                  <span className="text-lg">
                    {n.type === 'assignment' ? '📝' : n.type === 'attendance' ? '📋' : n.type === 'placement' ? '💼' : '🔔'}
                  </span>
                  <div>
                    <h3 className={`text-sm font-extrabold ${!n.isRead ? 'text-slate-800' : 'text-slate-650'}`}>{n.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-lg leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-2">
                      Received: {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-1">
                  {!n.isRead && (
                    <button 
                      onClick={() => handleMarkAsRead(n._id)}
                      className="p-1.5 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-slate-400 transition"
                      title="Mark as read"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                  )}
                  <button 
                    onClick={() => handleDeleteNotification(n._id)}
                    className="p-1.5 hover:bg-rose-50 hover:text-rose-600 rounded-lg text-slate-400 transition"
                    title="Delete notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </main>
    </div>
  );
}
