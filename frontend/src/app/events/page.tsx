'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { Calendar, MapPin, Users, CheckCircle, Ticket, XCircle } from 'lucide-react';

export default function EventsPage() {
  const [user, setUser] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Ticket Modal state
  const [selectedTicketEvent, setSelectedTicketEvent] = useState<any>(null);
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
      fetchEvents();
    } else {
      window.location.href = '/login';
    }
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiFetch('/api/events');
      setEvents(data.events || []);
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setError('Could not retrieve campus events from backend.');
      setLoading(false);
    }
  };

  const handleRegisterEvent = async (eventId: string) => {
    setActionMsg('');
    try {
      await apiFetch(`/api/events/${eventId}/register`, { method: 'POST' });
      setActionMsg('Registered successfully! 🎉');
      fetchEvents();
    } catch (err: any) {
      alert(err.message || 'Registration failed.');
    }
  };

  const handleCancelRegistration = async (eventId: string) => {
    if (!confirm('Are you sure you want to cancel your registration?')) return;
    setActionMsg('');
    try {
      await apiFetch(`/api/events/${eventId}/cancel`, { method: 'POST' });
      setActionMsg('Registration cancelled successfully.');
      fetchEvents();
    } catch (err: any) {
      alert(err.message || 'Cancellation failed.');
    }
  };

  // Helper check if student is registered
  const isStudentRegistered = (event: any) => {
    if (!user || user.role !== 'student') return false;
    return event.registrations?.some((r: any) => {
      const studentId = r.student?._id || r.student;
      return studentId === user.id && r.status === 'registered';
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600 mx-auto"></div>
          <p className="text-xs text-slate-500 mt-3 font-semibold">Loading campus events...</p>
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
            <Calendar className="w-6 h-6 text-indigo-600" /> Campus Events & Clubs
          </h2>
          <p className="text-xs text-slate-500 mt-1">Discover upcoming panels, workshops, and hackathons, and check registered passes.</p>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-center text-xs text-rose-700 font-semibold mb-6">
            {error}
          </div>
        )}

        {actionMsg && (
          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl text-center text-xs text-indigo-700 font-semibold mb-6">
            {actionMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.length === 0 ? (
            <div className="col-span-2 bg-white p-8 rounded-2xl border border-slate-100 text-center shadow-sm">
              <p className="text-slate-500 text-sm">No campus events currently scheduled.</p>
            </div>
          ) : (
            events.map((event) => {
              const registered = isStudentRegistered(event);
              const seatsPercentage = Math.min(((event.registeredCount || 0) / event.totalSeats) * 100, 100);
              
              return (
                <div key={event._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-800 leading-tight mb-2">{event.title}</h3>
                    <p className="text-xs text-slate-500 mb-4">{event.description}</p>
                    
                    <div className="space-y-1.5 text-xs text-slate-400 font-bold mb-4">
                      <p className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-indigo-500/80" /> {new Date(event.date).toLocaleDateString()} | {new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      <p className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-rose-500/80" /> {event.venue}</p>
                      <p className="flex items-center gap-1.5"><Users className="w-4 h-4 text-emerald-500/80" /> {event.registeredCount || 0} / {event.totalSeats} seats filled</p>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-2 mb-6">
                      <div className="bg-indigo-600 h-2 rounded-full transition-all duration-300" style={{ width: `${seatsPercentage}%` }}></div>
                    </div>
                  </div>

                  {user?.role === 'student' && (
                    <div className="flex gap-2">
                      {registered ? (
                        <>
                          <button 
                            onClick={() => setSelectedTicketEvent(event)}
                            className="flex-1 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5"
                          >
                            <Ticket className="w-4 h-4" /> View Ticket Pass
                          </button>
                          <button 
                            onClick={() => handleCancelRegistration(event._id)}
                            className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition"
                            title="Cancel Registration"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={() => handleRegisterEvent(event._id)}
                          disabled={event.registeredCount >= event.totalSeats}
                          className="w-full py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 transition text-xs font-extrabold"
                        >
                          {event.registeredCount >= event.totalSeats ? 'Event Full' : 'Register Now'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Ticket Pass Modal */}
      {selectedTicketEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm border border-slate-100 shadow-2xl text-center space-y-6">
            <div>
              <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">QR Event Pass</span>
              <h3 className="text-lg font-black text-slate-800 mt-3 leading-tight">{selectedTicketEvent.title}</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">{selectedTicketEvent.venue}</p>
            </div>

            {/* Generated QR Code SVG */}
            <div className="w-48 h-48 mx-auto bg-slate-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-indigo-200 p-4">
              {/* Simulated QR Code using a beautiful grid layout */}
              <div className="grid grid-cols-6 gap-1 w-full h-full p-2 bg-white">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`rounded-sm ${(i % 3 === 0 || i % 7 === 0 || i === 0 || i === 5 || i === 30 || i === 35) ? 'bg-indigo-950' : 'bg-indigo-100'}`}
                  ></div>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-800">Pass Holder: {user?.name}</p>
              <p className="text-[10px] text-slate-400 font-medium">Roll: {user?.rollNumber || 'CSE-2024-042'}</p>
              <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider bg-emerald-50 py-1 rounded-md mt-2">Verified Campus Entry Ticket ✅</p>
            </div>

            <button 
              onClick={() => setSelectedTicketEvent(null)}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-extrabold transition"
            >
              Close Ticket
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
