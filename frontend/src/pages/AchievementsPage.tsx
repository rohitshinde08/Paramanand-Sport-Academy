import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface AchievementItem {
  id: number;
  title: string;
  category: string;
  description: string;
  image_url: string;
  year: number;
}

const AchievementsPage: React.FC = () => {
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);

  useEffect(() => {
    axios.get('/api/content/achievements')
      .then(res => setAchievements(res.data))
      .catch(err => console.error('Error fetching achievements:', err));
  }, []);

  const resolveImage = (url: string) => url ? (url.startsWith('http') || url.startsWith('/uploads') ? url : `/${url}`) : '';

  return (
    <div className="w-full overflow-x-hidden">
      {/* Banner */}
      <section className="relative min-h-[50vh] flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/img/banners/mainbanner1.jpg')" }}>
        <h1 className="relative z-10 text-white text-[clamp(4rem,6vw,5.5rem)] font-heading font-extrabold uppercase tracking-widest animate-fade-in-up">Our Achievements</h1>
      </section>

      {/* Main Content */}
      <section className="py-24 px-[5%] lg:px-[9%] bg-bg-light">
        <h2 className="text-center text-[clamp(3.2rem,5vw,4.5rem)] font-extrabold text-primary mb-20 capitalize">PSA <span className="text-accent relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-1 after:bg-accent after:rounded-sm">Hall of Fame</span></h2>
        
        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-12 max-w-[1400px] mx-auto">
          {achievements.map(ach => (
            <div key={ach.id} className="bg-white shadow-soft rounded-[20px] overflow-hidden flex flex-col hover:-translate-y-2 hover:shadow-elevated transition-all duration-300 group">
              <div className="w-full h-[300px] overflow-hidden relative">
                <img 
                  src={resolveImage(ach.image_url)} 
                  alt={ach.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-10 flex-grow flex flex-col">
                <h3 className="text-[2.4rem] font-heading font-bold text-primary mb-3">{ach.title}</h3>
                <div>
                  <span className="inline-block bg-accent text-primary px-5 py-1 rounded-full text-[1.3rem] font-bold mb-5 shadow-sm">
                    {ach.category} - {ach.year}
                  </span>
                </div>
                <p className="text-[1.5rem] leading-[1.7] text-text-muted">{ach.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AchievementsPage;
