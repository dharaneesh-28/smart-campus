
'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function AdminUsersPage() {
  const [users] = useState([
    { id: 1, name: 'Dharaneesh', email: 'dharaneesh@gmail.com', role: 'admin', department: 'CSE' },
    { id: 2, name: 'Ravi Kumar', email: 'ravi@gmail.com', role: 'faculty', department: 'CSE' },
    { id: 3, name: 'Priya S', email: 'priya@gmail.com', role: 'student', department: 'IT' },
    { id: 4, name: 'Arun M', email: 'arun@gmail.com', role: 'student', department: 'ECE' },
    { id: 5, name: 'Deepa R', email: 'deepa@gmail.com', role: 'coordinator', department: 'CSE' },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">🎓 Smart Campus Admin</h1>
        <Link href="/dashboard/admin" className="text-indigo-600 hover:underline">← Back</Link>
      </header>
      <main className="max-w-6xl mx-auto px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Users</h2>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-indigo-50"><tr><th className="px-6 py-3 text-left text-sm font-semibold">Name</th><th className="px-6 py-3 text-left text-sm font-semibold">Email</th><th className="px-6 py-3 text-left text-sm font-semibold">Role</th><th className="px-6 py-3 text-left text-sm font-semibold">Department</th><th className="px-6 py-3 text-left text-sm font-semibold">Actions</th></tr></thead>
            <tbody>{users.map((u) => (<tr key={u.id} className="border-t"><td className="px-6 py-4 text-sm">{u.name}</td><td className="px-6 py-4 text-sm">{u.email}</td><td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.role==='admin'?'bg-red-100 text-red-700':u.role==='faculty'?'bg-blue-100 text-blue-700':u.role==='coordinator'?'bg-purple-100 text-purple-700':'bg-green-100 text-green-700'}`}>{u.role}</span></td><td className="px-6 py-4 text-sm">{u.department}</td><td className="px-6 py-4"><button className="text-indigo-600 hover:underline text-sm">Edit</button></td></tr>))}</tbody>
          </table>
        </div>
      </main>
    </div>
  );
}