'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { 
  Calendar, 
  PlusCircle, 
  Trash2, 
  Users, 
  Bell, 
  LogOut,
  MapPin,
  Clock,
  Mic
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

export default function CoordinatorDashboard() {
  const [user, setUser] = useState<any>(null);
  const [eventsList, setEventsList] = useState<any[]>([]);
  
  // Create Event Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [venue, setVenue] = useState('');
  const [date, setDate] = useState('');
  const [deadline, setDeadline] = useState('');
  const [totalSeats, setTotalSeats] = useState('100');
  const [speakers, setSpeakers] = useState('');
  const [eventMsg, setEventMsg] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      fetchEvents();
    } else {
      window.location.href = '/login';
    }
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiFetch('/api/events').catch(() => ({ events: [] }));
      setEventsList(data.events || []);
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setError('Could not fetch campus events from the server.');
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setEventMsg('');
    try {
      const speakersArray = speakers.split(',').map(s => s.trim()).filter(Boolean);
      await apiFetch('/api/events', {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          venue,
          date: new Date(date),
          registrationDeadline: new Date(deadline),
          totalSeats: parseInt(totalSeats),
          speakers: speakersArray
        })
      });
      setEventMsg('Event published successfully! 🎉');
      setTitle('');
      setDescription('');
      setVenue('');
      setDate('');
      setDeadline('');
      setSpeakers('');
      fetchEvents();
    } catch (err: any) {
      setEventMsg(err.message || 'Failed to create event.');
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await apiFetch(`/api/events/${id}`, { method: 'DELETE' });
      fetchEvents();
    } catch (err: any) {
      alert(err.message || 'Failed to delete event.');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  // Chart: Registration counts per event
  const getEventChartData = () => {
    return eventsList.map(e => ({
      name: e.title.length > 15 ? e.title.slice(0, 15) + '...' : e.title,
      registrations: e.registeredCount || 0
    }));
  };

  const totalRegistrations = eventsList.reduce((acc, current) => {
    return acc + (current.registeredCount || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 via-slate-50 to-blue-50/50 text-slate-800 pb-12">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/80 border-b border-slate-100 shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎓</span>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Smart Campus</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider">Coordinator Portal</span>
          <div className="h-6 w-[1px] bg-slate-200"></div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white font-semibold shadow-sm">
              {user?.name?.[0] || 'C'}
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
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-indigo-700 rounded-3xl p-6 md:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="relative z-10">
            <span className="bg-white/20 text-white text-xs px-3.5 py-1.5 rounded-full font-bold uppercase tracking-widest border border-white/10">Club & Activity Sync</span>
            <h2 className="text-3xl font-extrabold mt-3">Welcome, Activity Coordinator</h2>
            <p className="text-amber-100/90 mt-1 font-medium">Design events, track student registration checklists, and manage guest lectures.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm border-l-4 border-blue-500">
            <p className="text-xs uppercase font-bold text-slate-400">Total Events</p>
            <p className="text-3xl font-black text-blue-600 mt-2">{eventsList.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm border-l-4 border-emerald-500">
            <p className="text-xs uppercase font-bold text-slate-400">Total Registrations</p>
            <p className="text-3xl font-black text-emerald-600 mt-2">{totalRegistrations}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm border-l-4 border-purple-500">
            <p className="text-xs uppercase font-bold text-slate-400">Active Clubs</p>
            <p className="text-3xl font-black text-purple-600 mt-2">3</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm border-l-4 border-orange-500">
            <p className="text-xs uppercase font-bold text-slate-400">Average Registrations</p>
            <p className="text-3xl font-black text-orange-500 mt-2">
              {eventsList.length > 0 ? (totalRegistrations / eventsList.length).toFixed(1) : 0}
            </p>
          </div>
        </div>

        {/* Grid Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Event Form */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                <PlusCircle className="w-5 h-5 text-indigo-600" /> Create Event
              </h3>

              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500">Event Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. AI Symposium" 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                      className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500">Venue</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Seminar Hall A" 
                      value={venue} 
                      onChange={(e) => setVenue(e.target.value)} 
                      className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500">Description</label>
                  <textarea 
                    placeholder="Provide details about the hackathon, workshop, or seminar..." 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    rows={3}
                    className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs focus:outline-none"
                    required
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500">Date & Time</label>
                    <input 
                      type="datetime-local" 
                      value={date} 
                      onChange={(e) => setDate(e.target.value)} 
                      className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500">Reg. Deadline</label>
                    <input 
                      type="datetime-local" 
                      value={deadline} 
                      onChange={(e) => setDeadline(e.target.value)} 
                      className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500">Total Seats</label>
                    <input 
                      type="number" 
                      value={totalSeats} 
                      onChange={(e) => setTotalSeats(e.target.value)} 
                      className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500">Speakers (comma-separated)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Sam Altman, Satya Nadella" 
                    value={speakers} 
                    onChange={(e) => setSpeakers(e.target.value)} 
                    className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs focus:outline-none"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3 bg-indigo-600 text-white rounded-xl text-xs font-extrabold hover:bg-indigo-700 transition"
                >
                  Publish Event
                </button>
              </form>

              {eventMsg && (
                <p className="mt-4 p-2 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-700 text-center font-semibold">
                  {eventMsg}
                </p>
              )}
            </div>
          </div>

          {/* Right: Events List & Charts */}
          <div className="lg:col-span-5 space-y-8">
            {/* Manage Events */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-indigo-600" /> Active Campus Schedules
              </h3>

              <div className="space-y-4 max-h-[300px] overflow-y-auto">
                {eventsList.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">No events found.</p>
                ) : (
                  eventsList.map(ev => (
                    <div key={ev._id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center gap-4">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{ev.title}</h4>
                        <div className="flex gap-2 text-[9px] text-slate-400 font-bold mt-1">
                          <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" /> {ev.venue}</span>
                          <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" /> {new Date(ev.date).toLocaleDateString()}</span>
                        </div>
                        <p className="text-[9px] text-slate-500 mt-1">Registered: {ev.registeredCount}/{ev.totalSeats}</p>
                      </div>
                      
                      <button 
                        onClick={() => handleDeleteEvent(ev._id)}
                        className="text-rose-500 hover:text-rose-700 p-1.5 hover:bg-rose-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recharts Bar Chart */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-md font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-indigo-600" /> Event Registration Stats
              </h3>
              
              <div className="h-48">
                {isMounted && getEventChartData().length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getEventChartData()}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 9 }} />
                      <Tooltip />
                      <Bar dataKey="registrations" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-xs text-slate-500 text-center py-16">No active event metrics to graph.</p>
                )}
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
