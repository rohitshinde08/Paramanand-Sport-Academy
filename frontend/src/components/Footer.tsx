import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, ChevronRight } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-slate-300 py-16 px-6 md:px-12 lg:px-20 border-t-[6px] border-accent font-body relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative z-10">
        
        {/* Brand & Socials */}
        <div className="space-y-8 lg:col-span-1">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white p-2 shadow-lg">
              <img src="/img/psa.png" alt="PSA Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-heading text-white leading-tight">Parmanand</h3>
              <p className="text-accent text-sm font-bold uppercase tracking-widest">Sports Academy</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            Nashik's premier destination for elite athletic development, combining world-class facilities with championship-level coaching.
          </p>
          <div className="flex gap-4">
            <a href="https://www.facebook.com/people/Parmanand-Sports-Academy-Nashik/100086375480373/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-accent hover:text-primary transition-all shadow-md hover:-translate-y-1">
              <Facebook size={18} />
            </a>
            <a href="https://www.instagram.com/parmanandsports.nashik/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-accent hover:text-primary transition-all shadow-md hover:-translate-y-1">
              <Instagram size={18} />
            </a>
            <a href="https://www.youtube.com/@paramanandsportsacadamy9671" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-accent hover:text-primary transition-all shadow-md hover:-translate-y-1">
              <Youtube size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="lg:ml-12">
          <h4 className="text-white font-bold font-heading mb-6 text-lg">Quick Links</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link to="/" className="flex items-center gap-2 hover:text-accent transition-colors group">
                <ChevronRight size={14} className="text-accent group-hover:translate-x-1 transition-transform" /> Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="flex items-center gap-2 hover:text-accent transition-colors group">
                <ChevronRight size={14} className="text-accent group-hover:translate-x-1 transition-transform" /> About Us
              </Link>
            </li>
            <li>
              <Link to="/achievements" className="flex items-center gap-2 hover:text-accent transition-colors group">
                <ChevronRight size={14} className="text-accent group-hover:translate-x-1 transition-transform" /> Achievements
              </Link>
            </li>
            <li>
              <Link to="/gallery" className="flex items-center gap-2 hover:text-accent transition-colors group">
                <ChevronRight size={14} className="text-accent group-hover:translate-x-1 transition-transform" /> Gallery
              </Link>
            </li>
          </ul>
        </div>

        {/* Academy */}
        <div>
          <h4 className="text-white font-bold font-heading mb-6 text-lg">Academy</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link to="/register" className="flex items-center gap-2 hover:text-accent transition-colors group">
                <ChevronRight size={14} className="text-accent group-hover:translate-x-1 transition-transform" /> Join Academy
              </Link>
            </li>
            <li>
              <Link to="/contact" className="flex items-center gap-2 hover:text-accent transition-colors group">
                <ChevronRight size={14} className="text-accent group-hover:translate-x-1 transition-transform" /> Support & FAQs
              </Link>
            </li>
            <li>
              <Link to="/admin/login" className="flex items-center gap-2 hover:text-accent transition-colors group">
                <ChevronRight size={14} className="text-accent group-hover:translate-x-1 transition-transform" /> Staff Login
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-white font-bold font-heading mb-6 text-lg">Contact Us</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-accent shrink-0 mt-0.5" />
              <span className="leading-relaxed">Untwadi, Jagtap Nagar, Nashik, Maharashtra 422008</span>
            </li>
            <li>
              <a href="tel:8080533887" className="flex items-center gap-3 hover:text-accent transition-colors">
                <Phone size={18} className="text-accent shrink-0" />
                80805 33887
              </a>
            </li>
            <li>
              <a href="mailto:prasadsangle008@gmail.com" className="flex items-center gap-3 hover:text-accent transition-colors">
                <Mail size={18} className="text-accent shrink-0" />
                prasadsangle008@gmail.com
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 relative z-10">
        <p>&copy; {new Date().getFullYear()} Parmanand Sports Academy. All rights reserved.</p>
        <div className="flex gap-6">
          <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
