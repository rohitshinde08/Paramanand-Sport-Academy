import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle, Search, Clock } from 'lucide-react';

interface Registration {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  birth_date: string;
  sports: string[];
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

const AdminRegistrations: React.FC = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/registrations/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRegistrations(res.data);
    } catch (error) {
      console.error("Error fetching registrations", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/registrations/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRegistrations(registrations.map(r => r.id === id ? { ...r, status: status as any } : r));
    } catch (error) {
      console.error("Error updating status", error);
      alert("Failed to update status.");
    }
  };

  const filteredRegistrations = registrations.filter(r => {
    const matchesSearch = r.full_name.toLowerCase().includes(search.toLowerCase()) || r.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-primary">Student Registrations</h1>
          <p className="text-slate-500">Approve or reject new athlete applications.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50">
          <div className="flex items-center gap-3 w-full sm:w-96 bg-white px-4 py-2 rounded-xl border border-slate-200">
            <Search className="text-slate-400" size={20} />
            <input 
              type="text" placeholder="Search name or email..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="flex-1 outline-none text-slate-700 bg-transparent"
            />
          </div>
          
          <div className="flex gap-2">
            <button onClick={() => setFilterStatus('all')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${filterStatus === 'all' ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-200'}`}>All</button>
            <button onClick={() => setFilterStatus('pending')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${filterStatus === 'pending' ? 'bg-yellow-500 text-white' : 'text-slate-600 hover:bg-slate-200'}`}>Pending</button>
            <button onClick={() => setFilterStatus('approved')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${filterStatus === 'approved' ? 'bg-green-500 text-white' : 'text-slate-600 hover:bg-slate-200'}`}>Approved</button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-slate-500 text-sm uppercase tracking-wider border-b border-slate-100">
                <th className="p-4 font-semibold">Athlete Name & Contact</th>
                <th className="p-4 font-semibold">Age / DOB</th>
                <th className="p-4 font-semibold">Selected Sports</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500">Loading registrations...</td></tr>
              ) : filteredRegistrations.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500">No registrations found.</td></tr>
              ) : (
                filteredRegistrations.map(reg => (
                  <tr key={reg.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-primary">{reg.full_name}</div>
                      <div className="text-sm text-slate-500">{reg.email} • {reg.phone_number}</div>
                    </td>
                    <td className="p-4 text-slate-600">{new Date(reg.birth_date).toLocaleDateString()}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {reg.sports.map(sport => (
                          <span key={sport} className="px-2 py-1 text-xs font-semibold bg-blue-50 text-blue-700 rounded-md">{sport}</span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      {reg.status === 'pending' && <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full text-xs font-bold w-max"><Clock size={14}/> Pending</span>}
                      {reg.status === 'approved' && <span className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold w-max"><CheckCircle size={14}/> Approved</span>}
                      {reg.status === 'rejected' && <span className="flex items-center gap-1 text-red-600 bg-red-50 px-3 py-1 rounded-full text-xs font-bold w-max"><XCircle size={14}/> Rejected</span>}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {reg.status !== 'approved' && (
                        <button onClick={() => updateStatus(reg.id, 'approved')} className="px-3 py-1.5 bg-green-100 text-green-700 font-semibold rounded-lg hover:bg-green-200 transition text-sm">Approve</button>
                      )}
                      {reg.status !== 'rejected' && (
                        <button onClick={() => updateStatus(reg.id, 'rejected')} className="px-3 py-1.5 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition text-sm">Reject</button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminRegistrations;
