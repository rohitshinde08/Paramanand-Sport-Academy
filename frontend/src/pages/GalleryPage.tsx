import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface GalleryItem {
  id: number;
  category: string;
  image_url: string;
  title: string;
}

const GalleryPage: React.FC = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    axios.get('/api/content/gallery')
      .then(res => setGalleryItems(res.data))
      .catch(err => console.error('Error fetching gallery:', err));
  }, []);

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'events', label: 'Events' },
    { value: 'gym', label: 'Gymnastics' },
    { value: 'basket', label: 'Basketball' },
    { value: 'badminton', label: 'Badminton' },
    { value: 'cricket', label: 'Cricket' },
    { value: 'skating', label: 'Skating' },
    { value: 'football', label: 'Football' },
    { value: 'archery', label: 'Archery' },
    { value: 'fencing', label: 'Fencing' },
    { value: 'mall', label: 'Mallakhamba' },
    { value: 'dance', label: 'Dance' },
    { value: 'chess', label: 'Chess' },
    { value: 'taekwondo', label: 'Taekwondo' }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  const resolveImage = (url: string) => url ? (url.startsWith('http') || url.startsWith('/uploads') ? url : `/${url}`) : '';

  return (
    <div className="w-full overflow-x-hidden">
      {/* Banner */}
      <section className="relative min-h-[50vh] flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/img/sports-background-with-blue-shape_571891-33.jpg')" }}>
        <h1 className="relative z-10 text-white text-[clamp(4rem,6vw,5.5rem)] font-heading font-extrabold uppercase tracking-widest animate-fade-in-up">Photo Gallery</h1>
      </section>

      <section className="py-24 px-[5%] lg:px-[9%] bg-bg-light min-h-screen">
        <h2 className="text-[3.5rem] font-heading font-bold text-primary text-center mb-16">Our Photo Gallery</h2>
        
        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-16 max-w-[1200px] mx-auto">
          {categories.map(cat => (
            <button 
              key={cat.value} 
              onClick={() => setSelectedCategory(cat.value)} 
              className={`px-8 py-3 rounded-xl text-[1.4rem] font-semibold transition-all duration-300 ${
                selectedCategory === cat.value 
                  ? 'bg-primary text-white shadow-md' 
                  : 'bg-white text-text-muted hover:bg-gray-100 hover:text-primary shadow-sm border border-gray-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-8 max-w-[1400px] mx-auto">
          {filteredItems.map(item => (
            <div key={item.id} className="relative h-[280px] rounded-[16px] overflow-hidden shadow-soft group cursor-pointer bg-white">
              <img 
                src={resolveImage(item.image_url)} 
                alt={item.title || "Gallery Item"} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {item.title && (
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-[1.3rem] font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 inline-block">
                    {item.title}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {filteredItems.length === 0 && (
          <div className="text-center mt-24">
            <i className="far fa-images text-[6rem] text-gray-300 mb-6"></i>
            <p className="text-[1.8rem] text-text-muted font-medium">No photos found in this category.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default GalleryPage;
