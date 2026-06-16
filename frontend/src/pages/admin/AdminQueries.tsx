import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, Clock, Search, Mail } from 'lucide-react';

interface Query {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  message: string;
  status: 'pending' | 'resolved';
  created_at: string;
}

const AdminQueries: React.FC = () => {
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:8000/api/queries/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQueries(res.data);
    } catch (error) {
      console.error("Error fetching queries", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8000/api/queries/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQueries(queries.map(q => q.id === id ? { ...q, status: status as any } : q));
    } catch (error) {
      console.error("Error updating status", error);
      alert("Failed to update status.");
    }
  };

  const filteredQueries = queries.filter(q => 
    q.full_name.toLowerCase().includes(search.toLowerCase()) || 
    q.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-primary">Contact Queries</h1>
          <p className="text-slate-500">Respond to and manage messages from the website.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center bg-slate-50">
          <div className="flex items-center gap-3 w-full max-w-md bg-white px-4 py-2 rounded-xl border border-slate-200">
            <Search className="text-slate-400" size={20} />
            <input 
              type="text" placeholder="Search sender name or email..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="flex-1 outline-none text-slate-700 bg-transparent"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-10 text-center text-slate-500">Loading queries...</div>
          ) : filteredQueries.length === 0 ? (
            <div className="p-10 text-center text-slate-500">No queries found.</div>
          ) : (
            filteredQueries.map(query => (
              <div key={query.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-1">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                        {query.full_name}
                        {query.status === 'pending' ? (
                          <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"><Clock size={12}/> Pending</span>
                        ) : (
                          <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"><CheckCircle size={12}/> Resolved</span>
                        )}
                      </h3>
                      <p className="text-sm text-slate-500 mb-1">{query.email} • {query.phone_number}</p>
                      <p className="text-xs text-slate-400">{new Date(query.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    {query.status === 'pending' && (
                      <button 
                        onClick={() => updateStatus(query.id, 'resolved')}
                        className="px-4 py-2 bg-primary text-white font-semibold rounded-xl hover:bg-primary-light transition flex items-center gap-2 shadow"
                      >
                        <CheckCircle size={16} /> Mark as Resolved
                      </button>
                    )}
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-700 whitespace-pre-wrap ml-0 md:ml-16">
                  {query.message}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminQueries;
