'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { 
  BookOpen, 
  Calendar, 
  CheckCircle, 
  PlusCircle, 
  Clipboard, 
  LogOut, 
  GraduationCap, 
  Users, 
  Clock, 
  Award,
  ChevronRight,
  Send,
  MessageSquare
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  LineChart, 
  Line 
} from 'recharts';

export default function FacultyDashboard() {
  const [user, setUser] = useState<any>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [selectedAssignmentForGrading, setSelectedAssignmentForGrading] = useState<any>(null);
  
  // Create Assignment State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('Data Structures & Algorithms');
  const [deadline, setDeadline] = useState('');
  const [maxMarks, setMaxMarks] = useState('100');
  const [assignMessage, setAssignMessage] = useState('');

  // Mark Attendance State
  const [attCourse, setAttCourse] = useState('Data Structures & Algorithms');
  const [attDate, setAttDate] = useState(new Date().toISOString().split('T')[0]);
  const [attMessage, setAttMessage] = useState('');
  const [studentStatuses, setStudentStatuses] = useState<{[key: string]: string}>({});

  // Grading State
  const [gradingMarks, setGradingMarks] = useState('');
  const [gradingFeedback, setGradingFeedback] = useState('');
  const [gradingMessage, setGradingMessage] = useState('');
  const [activeSubmissionId, setActiveSubmissionId] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      fetchFacultyData();
    } else {
      window.location.href = '/login';
    }
  }, []);

  const fetchFacultyData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch all assignments (we will filter those created by this faculty, or show all for convenience)
      const assignData = await apiFetch('/api/assignments').catch(() => ({ assignments: [] }));
      setAssignments(assignData.assignments || []);

      // Fetch all students in the database to populate the attendance list
      const usersData = await apiFetch('/api/auth/users').catch(() => ({ users: [] }));
      const students = (usersData.users || []).filter((u: any) => u.role === 'student');
      setStudentsList(students);

      // Pre-populate attendance rosters with 'present'
      const initialStatuses: {[key: string]: string} = {};
      students.forEach((s: any) => {
        initialStatuses[s.id] = 'present';
      });
      setStudentStatuses(initialStatuses);

      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setError('Could not fetch faculty records from the server.');
      setLoading(false);
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    setAssignMessage('');
    try {
      const res = await apiFetch('/api/assignments', {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          course,
          deadline: new Date(deadline),
          maxMarks: parseInt(maxMarks)
        })
      });
      setAssignMessage('Assignment created successfully! 📝');
      setTitle('');
      setDescription('');
      setDeadline('');
      fetchFacultyData();
    } catch (err: any) {
      setAssignMessage(err.message || 'Failed to create assignment.');
    }
  };

  const handleMarkAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    setAttMessage('');
    try {
      const studentsRoster = Object.entries(studentStatuses).map(([studentId, status]) => ({
        student: studentId,
        status
      }));

      await apiFetch('/api/attendance/session', {
        method: 'POST',
        body: JSON.stringify({
          course: attCourse,
          date: new Date(attDate),
          students: studentsRoster
        })
      });

      setAttMessage('Attendance session created and saved! 📋');
    } catch (err: any) {
      setAttMessage(err.message || 'Failed to mark attendance.');
    }
  };

  const handleGradeSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignmentForGrading || !activeSubmissionId) return;
    setGradingMessage('');
    try {
      await apiFetch(`/api/assignments/${selectedAssignmentForGrading._id}/grade/${activeSubmissionId}`, {
        method: 'PUT',
        body: JSON.stringify({
          marks: parseInt(gradingMarks),
          feedback: gradingFeedback
        })
      });

      setGradingMessage('Graded successfully! ✅');
      setGradingMarks('');
      setGradingFeedback('');
      setActiveSubmissionId('');
      // Refresh
      fetchFacultyData();
      // Reset selected grading UI
      setSelectedAssignmentForGrading(null);
    } catch (err: any) {
      setGradingMessage(err.message || 'Failed to submit grade.');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const toggleStudentStatus = (studentId: string) => {
    setStudentStatuses(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'present' ? 'absent' : prev[studentId] === 'absent' ? 'late' : 'present'
    }));
  };

  // Submissions stats chart
  const getSubmissionStats = () => {
    return assignments.map(a => ({
      name: a.title.length > 15 ? a.title.slice(0, 15) + '...' : a.title,
      submissions: a.submissions?.length || 0
    }));
  };

  const totalGraded = assignments.reduce((acc, current) => {
    const graded = current.submissions?.filter((sub: any) => sub.status === 'graded').length || 0;
    return acc + graded;
  }, 0);

  const totalSubmissions = assignments.reduce((acc, current) => {
    return acc + (current.submissions?.length || 0);
  }, 0);

  const pendingGradingCount = totalSubmissions - totalGraded;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-slate-50 to-indigo-50/50 text-slate-800 pb-12">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/80 border-b border-slate-100 shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎓</span>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Smart Campus</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider">Faculty Portal</span>
          <div className="h-6 w-[1px] bg-slate-200"></div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold shadow-sm">
              {user?.name?.[0] || 'F'}
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
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 rounded-3xl p-6 md:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="relative z-10">
            <span className="bg-white/20 text-white text-xs px-3.5 py-1.5 rounded-full font-bold uppercase tracking-widest border border-white/10">Department: {user?.department || 'CSE'}</span>
            <h2 className="text-3xl font-extrabold mt-3">Welcome back, {user?.name || 'Professor'}</h2>
            <p className="text-blue-100/90 mt-1 font-medium">Create assignments, track grades, and record student attendance sessions.</p>
          </div>
        </div>

        {/* Faculty stats summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm border-l-4 border-blue-500">
            <p className="text-xs uppercase font-bold text-slate-400">Total Assignments</p>
            <p className="text-3xl font-black text-blue-600 mt-2">{assignments.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm border-l-4 border-emerald-500">
            <p className="text-xs uppercase font-bold text-slate-400">Students Taught</p>
            <p className="text-3xl font-black text-emerald-600 mt-2">{studentsList.length || 42}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm border-l-4 border-amber-500">
            <p className="text-xs uppercase font-bold text-slate-400">Pending Grading</p>
            <p className="text-3xl font-black text-amber-500 mt-2">{pendingGradingCount}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm border-l-4 border-purple-500">
            <p className="text-xs uppercase font-bold text-slate-400">Graded Submissions</p>
            <p className="text-3xl font-black text-purple-600 mt-2">{totalGraded}</p>
          </div>
        </div>

        {/* Dashboard Actions and Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Side: Creation Forms */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Create Assignment Form */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                <PlusCircle className="w-5 h-5 text-indigo-600" /> Create Assignment
              </h3>
              
              <form onSubmit={handleCreateAssignment} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500">Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Tree Traversal Algorithms" 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                      className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500">Course</label>
                    <select 
                      value={course} 
                      onChange={(e) => setCourse(e.target.value)} 
                      className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs focus:outline-none"
                    >
                      <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Database Management Systems">Database Management Systems</option>
                      <option value="Operating Systems">Operating Systems</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500">Description</label>
                  <textarea 
                    placeholder="Provide details, rules, and grading rubrics..." 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    rows={3}
                    className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs focus:outline-none"
                    required
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500">Deadline</label>
                    <input 
                      type="date" 
                      value={deadline} 
                      onChange={(e) => setDeadline(e.target.value)} 
                      className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500">Max Marks</label>
                    <input 
                      type="number" 
                      value={maxMarks} 
                      onChange={(e) => setMaxMarks(e.target.value)} 
                      className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3 bg-indigo-600 text-white rounded-xl text-xs font-extrabold hover:bg-indigo-700 transition"
                >
                  Publish Assignment
                </button>
              </form>

              {assignMessage && (
                <p className="mt-4 p-2 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-700 text-center font-semibold">
                  {assignMessage}
                </p>
              )}
            </div>

            {/* Mark Attendance Roster Form */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Clipboard className="w-5 h-5 text-emerald-600" /> Attendance Roster Session
              </h3>
              
              <form onSubmit={handleMarkAttendance} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500">Select Class</label>
                    <select 
                      value={attCourse} 
                      onChange={(e) => setAttCourse(e.target.value)} 
                      className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs focus:outline-none"
                    >
                      <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Database Management Systems">Database Management Systems</option>
                      <option value="Operating Systems">Operating Systems</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500">Session Date</label>
                    <input 
                      type="date" 
                      value={attDate} 
                      onChange={(e) => setAttDate(e.target.value)} 
                      className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="border border-slate-100 rounded-xl overflow-hidden mt-4">
                  <div className="bg-slate-50 p-2.5 border-b border-slate-100 grid grid-cols-12 text-[10px] font-bold uppercase text-slate-400 tracking-wider text-center">
                    <span className="col-span-6 text-left pl-3">Student Name</span>
                    <span className="col-span-3">Department</span>
                    <span className="col-span-3">Status</span>
                  </div>
                  <div className="max-h-48 overflow-y-auto divide-y divide-slate-100">
                    {studentsList.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-4">No students registered in DB.</p>
                    ) : (
                      studentsList.map((st: any) => (
                        <div key={st._id} className="p-3 grid grid-cols-12 text-xs items-center text-center">
                          <span className="col-span-6 text-left pl-3 font-semibold text-slate-700">{st.name}</span>
                          <span className="col-span-3 text-slate-500 font-bold uppercase">{st.department || 'CSE'}</span>
                          <span className="col-span-3 flex justify-center">
                            <button 
                              type="button" 
                              onClick={() => toggleStudentStatus(st._id)}
                              className={`px-3 py-1 rounded-full text-[10px] font-extrabold capitalize transition ${studentStatuses[st._id] === 'present' ? 'bg-emerald-100 text-emerald-800' : studentStatuses[st._id] === 'absent' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}
                            >
                              {studentStatuses[st._id] || 'present'}
                            </button>
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3 bg-emerald-600 text-white rounded-xl text-xs font-extrabold hover:bg-emerald-700 transition"
                >
                  Save Attendance Session
                </button>
              </form>

              {attMessage && (
                <p className="mt-4 p-2 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-700 text-center font-semibold">
                  {attMessage}
                </p>
              )}
            </div>

          </div>

          {/* Right Side: Grading & Charts */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Review & Grade Submission */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-amber-500" /> Grade Student Submissions
              </h3>

              {!selectedAssignmentForGrading ? (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500">Select an assignment to view submissions:</p>
                  {assignments.map(a => (
                    <button 
                      key={a._id}
                      onClick={() => setSelectedAssignmentForGrading(a)}
                      className="w-full p-3 bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-200 transition text-left rounded-xl text-xs flex justify-between items-center"
                    >
                      <div>
                        <span className="font-extrabold text-slate-700">{a.title}</span>
                        <p className="text-[10px] text-slate-400 mt-0.5">{a.course}</p>
                      </div>
                      <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-700 font-extrabold rounded-full text-[10px]">
                        {a.submissions?.length || 0} Subs
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-extrabold text-slate-700">Submissions for: {selectedAssignmentForGrading.title}</span>
                    <button onClick={() => setSelectedAssignmentForGrading(null)} className="text-[10px] text-indigo-600 hover:underline">← Back</button>
                  </div>

                  <div className="space-y-4 max-h-56 overflow-y-auto mb-4">
                    {selectedAssignmentForGrading.submissions?.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-4">No submissions yet for this assignment.</p>
                    ) : (
                      selectedAssignmentForGrading.submissions.map((sub: any) => (
                        <div key={sub._id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-start gap-4">
                          <div>
                            <p className="text-xs font-bold text-slate-700">Student ID: {sub.student?.name || sub.student || 'Unknown'}</p>
                            {sub.githubLink && (
                              <a href={sub.githubLink} target="_blank" rel="noreferrer" className="text-[10px] text-indigo-600 hover:underline mt-0.5 block">Github: {sub.githubLink}</a>
                            )}
                            <p className="text-[10px] text-slate-400 mt-1">Status: <span className="font-bold">{sub.status}</span></p>
                          </div>
                          {sub.status !== 'graded' && activeSubmissionId !== sub._id && (
                            <button 
                              onClick={() => {
                                setActiveSubmissionId(sub._id);
                                setGradingMarks(sub.marks ? String(sub.marks) : '');
                                setGradingFeedback(sub.feedback || '');
                              }}
                              className="px-3 py-1 bg-amber-600 text-white rounded-lg text-[10px] font-bold hover:bg-amber-700 transition"
                            >
                              Grade
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {activeSubmissionId && (
                    <form onSubmit={handleGradeSubmission} className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-3">
                      <h4 className="text-xs font-bold text-indigo-900">Grading Form</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500">Marks (Max {selectedAssignmentForGrading.maxMarks})</label>
                          <input 
                            type="number" 
                            value={gradingMarks} 
                            onChange={(e) => setGradingMarks(e.target.value)} 
                            className="w-full mt-1 p-2 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-xs focus:outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500">Feedback</label>
                          <input 
                            type="text" 
                            placeholder="Great job!" 
                            value={gradingFeedback} 
                            onChange={(e) => setGradingFeedback(e.target.value)} 
                            className="w-full mt-1 p-2 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-xs focus:outline-none"
                            required
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button type="submit" className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-extrabold transition">Submit Score</button>
                        <button type="button" onClick={() => setActiveSubmissionId('')} className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold transition">Cancel</button>
                      </div>
                    </form>
                  )}

                  {gradingMessage && (
                    <p className="mt-4 p-2 bg-indigo-100 border border-indigo-200 rounded-xl text-xs text-indigo-700 text-center font-semibold">
                      {gradingMessage}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Recharts Chart: Submissions per assignment */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-md font-bold text-slate-800 flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-indigo-600" /> Submissions Analytics
              </h3>
              
              <div className="h-56">
                {isMounted && getSubmissionStats().length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getSubmissionStats()}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Bar dataKey="submissions" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-xs text-slate-500 text-center py-20">No active assignment data to display.</p>
                )}
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
