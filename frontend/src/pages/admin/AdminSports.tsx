import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Edit, Plus, CheckCircle, Search } from 'lucide-react';

interface Sport {
  id: number;
  slug: string;
  name: string;
  description: string;
  image_url: string;
  schedule_json: any;
}

const AdminSports: React.FC = () => {
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Form State
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: '',
    schedule_json: '{"Monday to Friday": "6:00am - 8:00am"}'
  });

  useEffect(() => {
    fetchSports();
  }, []);

  const fetchSports = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8000/api/content/sports');
      setSports(res.data);
    } catch (error) {
      console.error("Error fetching sports", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("WARNING: Deleting a sport might break references in Gallery or Registrations. Are you sure?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/content/sports/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSports(sports.filter(s => s.id !== id));
    } catch (error) {
      console.error("Error deleting sport", error);
      alert("Failed to delete sport.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        ...formData,
        schedule_json: JSON.parse(formData.schedule_json) // Ensure valid JSON
      };

      if (editingId) {
        // Update
        const res = await axios.put(`http://localhost:8000/api/content/sports/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSports(sports.map(s => s.id === editingId ? res.data : s));
      } else {
        // Create
        const res = await axios.post('http://localhost:8000/api/content/sports', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSports([...sports, res.data]);
      }
      
      resetForm();
    } catch (error: any) {
      console.error("Error saving sport", error);
      alert("Failed to save sport. Check JSON format.");
    }
  };

  const handleEdit = (sport: Sport) => {
    setEditingId(sport.id);
    setFormData({
      name: sport.name,
      slug: sport.slug,
      description: sport.description,
      image_url: sport.image_url,
      schedule_json: JSON.stringify(sport.schedule_json, null, 2)
    });
    setIsAdding(true);
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      name: '', slug: '', description: '', image_url: '', schedule_json: '{"Monday to Friday": "6:00am - 8:00am"}'
    });
  };

  const filteredSports = sports.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-primary">Manage Sports</h1>
          <p className="text-slate-500">Add, edit, or remove academy disciplines.</p>
        </div>
        <button 
          onClick={() => isAdding ? resetForm() : setIsAdding(true)}
          className={`px-6 py-3 rounded-xl font-bold transition flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${
            isAdding ? 'bg-slate-200 text-slate-700' : 'bg-primary text-white hover:bg-primary-light'
          }`}
        >
          {isAdding ? 'Cancel' : <><Plus size={20}/> Add New Sport</>}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 animate-fade-in">
          <h2 className="text-xl font-bold text-primary mb-6">{editingId ? 'Edit Sport' : 'Create New Sport'}</h2>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Sport Name</label>
              <input 
                type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:outline-none" required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Slug (URL identifier)</label>
              <input 
                type="text" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:outline-none" required
                placeholder="e.g. table-tennis"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Banner Image URL</label>
              <input 
                type="text" value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:outline-none" required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
              <textarea 
                value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={3}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:outline-none" required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Schedule (JSON format)</label>
              <textarea 
                value={formData.schedule_json} onChange={(e) => setFormData({...formData, schedule_json: e.target.value})} rows={3}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:outline-none font-mono text-sm" required
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-4 mt-4">
              <button type="submit" className="bg-accent text-primary px-8 py-3 rounded-xl font-bold hover:brightness-110 transition shadow">
                {editingId ? 'Save Changes' : 'Create Sport'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="text-slate-400" size={20} />
          <input 
            type="text" placeholder="Search sports..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="flex-1 outline-none text-slate-700 bg-transparent"
          />
        </div>
        
        {loading ? (
          <div className="p-10 text-center text-slate-500">Loading sports...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold">Sport</th>
                  <th className="p-4 font-semibold">Slug</th>
                  <th className="p-4 font-semibold hidden md:table-cell">Schedule Excerpt</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSports.map(sport => (
                  <tr key={sport.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                          <img src={sport.image_url} alt={sport.name} className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
                        </div>
                        <span className="font-bold text-primary">{sport.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-500 font-mono text-sm">{sport.slug}</td>
                    <td className="p-4 text-slate-500 text-sm hidden md:table-cell max-w-[200px] truncate">
                      {JSON.stringify(sport.schedule_json)}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(sport)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(sport.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredSports.length === 0 && (
                  <tr><td colSpan={4} className="p-8 text-center text-slate-500">No sports found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSports;
