'use client';
import Link from 'next/link';

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">🎓 Smart Campus Admin</h1>
        <Link href="/dashboard/admin" className="text-indigo-600 hover:underline">← Back</Link>
      </header>
      <main className="max-w-7xl mx-auto px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Campus Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">User Distribution</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center"><span className="text-sm text-gray-600">Students</span><div className="flex items-center gap-2"><div className="w-48 bg-gray-200 rounded-full h-3"><div className="bg-blue-500 h-3 rounded-full" style={{width:'70%'}}></div></div><span className="text-sm font-semibold">280</span></div></div>
              <div className="flex justify-between items-center"><span className="text-sm text-gray-600">Faculty</span><div className="flex items-center gap-2"><div className="w-48 bg-gray-200 rounded-full h-3"><div className="bg-green-500 h-3 rounded-full" style={{width:'15%'}}></div></div><span className="text-sm font-semibold">45</span></div></div>
              <div className="flex justify-between items-center"><span className="text-sm text-gray-600">Coordinators</span><div className="flex items-center gap-2"><div className="w-48 bg-gray-200 rounded-full h-3"><div className="bg-purple-500 h-3 rounded-full" style={{width:'8%'}}></div></div><span className="text-sm font-semibold">15</span></div></div>
              <div className="flex justify-between items-center"><span className="text-sm text-gray-600">Admins</span><div className="flex items-center gap-2"><div className="w-48 bg-gray-200 rounded-full h-3"><div className="bg-red-500 h-3 rounded-full" style={{width:'3%'}}></div></div><span className="text-sm font-semibold">10</span></div></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center"><span className="text-sm text-gray-600">CSE</span><div className="flex items-center gap-2"><div className="w-48 bg-gray-200 rounded-full h-3"><div className="bg-indigo-500 h-3 rounded-full" style={{width:'82%'}}></div></div><span className="text-sm font-semibold">82%</span></div></div>
              <div className="flex justify-between items-center"><span className="text-sm text-gray-600">IT</span><div className="flex items-center gap-2"><div className="w-48 bg-gray-200 rounded-full h-3"><div className="bg-indigo-500 h-3 rounded-full" style={{width:'78%'}}></div></div><span className="text-sm font-semibold">78%</span></div></div>
              <div className="flex justify-between items-center"><span className="text-sm text-gray-600">ECE</span><div className="flex items-center gap-2"><div className="w-48 bg-gray-200 rounded-full h-3"><div className="bg-indigo-500 h-3 rounded-full" style={{width:'75%'}}></div></div><span className="text-sm font-semibold">75%</span></div></div>
              <div className="flex justify-between items-center"><span className="text-sm text-gray-600">MECH</span><div className="flex items-center gap-2"><div className="w-48 bg-gray-200 rounded-full h-3"><div className="bg-indigo-500 h-3 rounded-full" style={{width:'71%'}}></div></div><span className="text-sm font-semibold">71%</span></div></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md text-center"><p className="text-gray-500 text-sm">Total Assignments</p><p className="text-3xl font-bold text-blue-600">48</p></div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center"><p className="text-gray-500 text-sm">Submissions Today</p><p className="text-3xl font-bold text-green-600">23</p></div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center"><p className="text-gray-500 text-sm">Events This Month</p><p className="text-3xl font-bold text-purple-600">6</p></div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center"><p className="text-gray-500 text-sm">Placed Students</p><p className="text-3xl font-bold text-orange-600">89</p></div>
        </div>
      </main>
    </div>
  );
}
