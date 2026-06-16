import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Menu, X, ChevronDown } from 'lucide-react';

const getSportIconClass = (slug: string) => {
  const map: Record<string, string> = {
    'gymnastics': 'fas fa-running',
    'basketball': 'fas fa-basketball-ball',
    'cricket': 'fas fa-baseball-ball',
    'football': 'fas fa-futbol',
    'badminton': 'fas fa-table-tennis',
    'archery': 'fas fa-bullseye',
    'dance': 'fas fa-music',
    'mallakhamb': 'fas fa-dumbbell',
    'skating': 'fas fa-skating',
    'chess': 'fas fa-chess',
    'fencing': 'fas fa-khanda',
    'taekwondo': 'fas fa-user-ninja'
  };
  return map[slug.toLowerCase()] || 'fas fa-medal';
};

interface SportItem {
  id: number;
  name: string;
  slug: string;
}

export default function Header() {
  const [menuActive, setMenuActive] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [sports, setSports] = useState<SportItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    axios.get('/api/content/sports')
      .then(res => setSports(res.data))
      .catch(err => console.error('Error fetching sports for header:', err));

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuActive(false);
    
    // Check auth status whenever location changes or component mounts
    if (localStorage.getItem('token')) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-primary/95 backdrop-blur-md shadow-lg py-4' : 'bg-gradient-to-b from-primary/80 to-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        
        <Link to="/" className="flex items-center gap-3 group">
          <img src="/img/psa.png" alt="PSA Logo" className="h-11 w-11 rounded-full shadow-sm bg-white p-0.5 transition-transform group-hover:scale-105" />
          <span className="text-white font-heading font-bold text-xl tracking-tight hidden sm:block group-hover:text-accent transition-colors">
            Parmanand Sports
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-slate-100 hover:text-white transition-colors">Home</Link>
          <Link to="/about" className="text-sm font-medium text-slate-100 hover:text-white transition-colors">About</Link>
          
          <div className="relative group">
            <button className="text-sm font-medium text-slate-100 hover:text-white transition-colors flex items-center gap-1 py-2">
              Sports <ChevronDown className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top scale-95 group-hover:scale-100 flex flex-col overflow-hidden">
              {sports.length > 0 ? (
                sports.map(sport => {
                  const iconClass = getSportIconClass(sport.slug);
                  return (
                    <Link key={sport.id} to={`/sports/${sport.slug}`} className="px-5 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors flex items-center gap-3 border-b border-slate-50 last:border-none">
                      <i className={`${iconClass} text-accent shrink-0 text-center w-5 text-base`}></i>
                      {sport.name}
                    </Link>
                  );
                })
              ) : (
                <>
                  <Link to="/sports/gymnastics" className="px-5 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors flex items-center gap-3 border-b border-slate-50">
                    <i className="fas fa-running text-accent shrink-0 text-center w-5 text-base"></i> Gymnastics
                  </Link>
                  <Link to="/sports/basketball" className="px-5 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors flex items-center gap-3 text-left">
                    <i className="fas fa-basketball-ball text-accent shrink-0 text-center w-5 text-base"></i> Basketball
                  </Link>
                </>
              )}
            </div>
          </div>

          <Link to="/achievements" className="text-sm font-medium text-slate-100 hover:text-white transition-colors">Achievements</Link>
          <Link to="/gallery" className="text-sm font-medium text-slate-100 hover:text-white transition-colors">Gallery</Link>
          <Link to="/contact" className="text-sm font-medium text-slate-100 hover:text-white transition-colors">Contact</Link>
          
          {isAdminRoute && (
            <Link to="/admin/dashboard" className="text-sm font-bold text-red-400 hover:text-red-300 transition-colors">Dashboard</Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link to="/admin/dashboard" className="hidden sm:inline-flex text-sm font-bold text-accent hover:text-white transition-colors">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="hidden sm:inline-flex items-center justify-center bg-red-500/20 text-red-100 border border-red-500/50 px-6 py-2.5 rounded-full text-sm font-bold transition-all hover:bg-red-500 hover:text-white shadow-md">
                Logout
              </button>
            </>
          ) : (
            <Link to="/register" className="hidden sm:inline-flex items-center justify-center bg-accent text-primary px-6 py-2.5 rounded-full text-sm font-bold transition-all hover:bg-accent-hover hover:scale-105 shadow-md hover:shadow-lg">
              Register
            </Link>
          )}
          <button onClick={() => setMenuActive(!menuActive)} className="lg:hidden text-white p-2 hover:text-accent transition-colors">
            {menuActive ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <div className={`lg:hidden fixed inset-0 top-[72px] bg-primary/95 backdrop-blur-xl transition-all duration-300 ${menuActive ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <nav className={`flex flex-col items-center justify-center h-[calc(100vh-72px)] gap-8 p-6 transition-transform duration-500 delay-100 ${menuActive ? 'translate-y-0' : 'translate-y-8'}`}>
          <Link to="/" className="text-xl font-medium text-white hover:text-accent transition-colors">Home</Link>
          <Link to="/about" className="text-xl font-medium text-white hover:text-accent transition-colors">About</Link>
          {sports.length > 0 ? (
            <Link to={`/sports/${sports[0].slug}`} className="text-xl font-medium text-white hover:text-accent transition-colors">Sports</Link>
          ) : (
            <Link to="/sports/gymnastics" className="text-xl font-medium text-white hover:text-accent transition-colors">Sports</Link>
          )}
          <Link to="/achievements" className="text-xl font-medium text-white hover:text-accent transition-colors">Achievements</Link>
          <Link to="/gallery" className="text-xl font-medium text-white hover:text-accent transition-colors">Gallery</Link>
          <Link to="/contact" className="text-xl font-medium text-white hover:text-accent transition-colors">Contact</Link>
          
          {isLoggedIn ? (
            <>
              <Link to="/admin/dashboard" className="w-full max-w-xs text-center border border-accent text-accent px-8 py-4 rounded-full text-lg font-bold mt-4 shadow-lg">
                Admin Dashboard
              </Link>
              <button onClick={handleLogout} className="w-full max-w-xs text-center bg-red-500/20 text-red-200 border border-red-500/50 px-8 py-4 rounded-full text-lg font-bold mt-2 shadow-lg">
                Logout
              </button>
            </>
          ) : (
            <Link to="/register" className="w-full max-w-xs text-center bg-accent text-primary px-8 py-4 rounded-full text-lg font-bold mt-4 shadow-lg">
              Register Now
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
