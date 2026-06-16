import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Edit, Plus, Image as ImageIcon, Search, UploadCloud } from 'lucide-react';

interface GalleryItem {
  id: number;
  category: string;
  image_url: string;
  title: string;
}

interface Sport {
  id: number;
  slug: string;
  name: string;
}

const AdminGallery: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterSport, setFilterSport] = useState('all');
  
  // Form State
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newItem, setNewItem] = useState({ category: '', image_url: '', title: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Fetch Gallery Items
      const galRes = await axios.get('/api/content/gallery', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(galRes.data);
      
      // Fetch Sports for the dropdown validation
      const sportRes = await axios.get('/api/content/sports', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSports(sportRes.data);
      
      // Set default category to first sport if available
      if (sportRes.data.length > 0) {
        setNewItem(prev => ({ ...prev, category: sportRes.data[0].slug }));
      }
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/content/gallery/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error deleting item", error);
      alert("Failed to delete item.");
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingId(item.id);
    setNewItem({ category: item.category, image_url: item.image_url, title: item.title || '' });
    setSelectedFile(null); // Clear any pending upload
    setIsAdding(true);
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setSelectedFile(null);
    setNewItem({ 
      category: sports.length > 0 ? sports[0].slug : '', 
      image_url: '', 
      title: '' 
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.category) {
      alert("Please select a sport category.");
      return;
    }

    if (!selectedFile && !newItem.image_url) {
      alert("Please upload an image.");
      return;
    }

    setUploading(true);
    let finalImageUrl = newItem.image_url;

    try {
      const token = localStorage.getItem('token');

      // 1. Upload File if a new one is selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        
        const uploadRes = await axios.post('/api/uploads/', formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        finalImageUrl = uploadRes.data.url;
      }

      // 2. Save/Update DB record
      const payload = { ...newItem, image_url: finalImageUrl };

      if (editingId) {
        const res = await axios.put(`/api/content/gallery/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setItems(items.map(i => i.id === editingId ? res.data : i));
      } else {
        const res = await axios.post('/api/content/gallery', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setItems([res.data, ...items]);
      }
      
      resetForm();
    } catch (error) {
      console.error("Error saving item", error);
      alert("Failed to save. Make sure your file is a valid image type.");
    } finally {
      setUploading(false);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.category.toLowerCase().includes(search.toLowerCase()) || (item.title && item.title.toLowerCase().includes(search.toLowerCase()));
    const matchesSport = filterSport === 'all' || item.category === filterSport;
    return matchesSearch && matchesSport;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-primary">Gallery Manager</h1>
          <p className="text-slate-500">Manage all academy photos and link them to specific sports.</p>
        </div>
        <button 
          onClick={() => isAdding ? resetForm() : setIsAdding(true)}
          className={`px-6 py-3 rounded-xl font-bold transition flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${
            isAdding ? 'bg-slate-200 text-slate-700' : 'bg-primary text-white hover:bg-primary-light'
          }`}
        >
          {isAdding ? 'Cancel' : <><Plus size={20}/> Add New Photo</>}
        </button>
      </div>

      {/* Add / Edit Form */}
      {isAdding && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 animate-fade-in">
          <h2 className="text-xl font-bold text-primary mb-6">{editingId ? 'Edit Photo' : 'Upload New Photo'}</h2>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Related Sport (Required)</label>
              <select 
                value={newItem.category}
                onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:outline-none bg-slate-50"
                required
              >
                {sports.map(sport => (
                  <option key={sport.id} value={sport.slug}>{sport.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Upload Image File</label>
              <div className="relative">
                <input 
                  type="file" 
                  accept="image/jpeg, image/png, image/webp"
                  onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full px-4 py-[9px] rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:outline-none file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer bg-slate-50"
                />
              </div>
              {editingId && newItem.image_url && !selectedFile && (
                <p className="text-xs text-slate-500 mt-2">Current image: {newItem.image_url}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Caption / Title (Optional)</label>
              <input 
                type="text" 
                value={newItem.title}
                onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:outline-none bg-slate-50"
                placeholder="E.g. State Championship Finals"
              />
            </div>
            
            <div className="md:col-span-2 flex justify-end gap-3 mt-2">
              <button type="submit" disabled={uploading} className="bg-accent text-primary px-8 py-3 rounded-xl font-bold hover:brightness-110 transition shadow flex items-center gap-2 disabled:opacity-70">
                {uploading ? (
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <UploadCloud size={20} />
                )}
                {uploading ? 'Uploading...' : (editingId ? 'Save Changes' : 'Upload Photo')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center gap-4 justify-between">
        
        <div className="flex items-center gap-3 w-full sm:w-auto bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
          <Search className="text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by title..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 outline-none text-slate-700 bg-transparent"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-sm font-semibold text-slate-500 whitespace-nowrap">Filter Sport:</span>
          <select 
            value={filterSport}
            onChange={(e) => setFilterSport(e.target.value)}
            className="w-full sm:w-48 px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:outline-none bg-slate-50 text-slate-700 font-medium"
          >
            <option value="all">All Sports</option>
            {sports.map(sport => (
              <option key={sport.id} value={sport.slug}>{sport.name}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-500">Loading gallery...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 group relative flex flex-col">
              <div className="aspect-square relative overflow-hidden bg-slate-100 border-b border-slate-100">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={(e) => e.currentTarget.style.display = 'none'} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><ImageIcon className="text-slate-300" size={40}/></div>
                )}
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                  <button onClick={() => handleEdit(item)} className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary hover:bg-accent transition hover:scale-110 shadow-xl">
                    <Edit size={20} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition hover:scale-110 shadow-xl">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent bg-accent/10 px-2 py-1 rounded-md w-max mb-2">{item.category}</span>
                <h3 className="font-semibold text-slate-800 line-clamp-2 leading-tight">{item.title || "Untitled"}</h3>
              </div>
            </div>
          ))}
          {filteredItems.length === 0 && (
             <div className="col-span-full text-center py-20 text-slate-500 bg-white rounded-2xl border border-slate-100 border-dashed">
               No images match your filters.
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminGallery;
