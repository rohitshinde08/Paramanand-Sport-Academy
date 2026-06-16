import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { CheckCircle, AlertCircle, ShieldAlert } from 'lucide-react';

const Register: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  
  const [availableSports, setAvailableSports] = useState<string[]>([]);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  
  const [showPopup, setShowPopup] = useState(false);
  const [popupText, setPopupText] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('/api/content/sports')
      .then(res => {
        if (res.data.length > 0) {
          setAvailableSports(res.data.map((s: any) => s.name));
        } else {
          // Fallback if API fails or no sports seeded
          setAvailableSports(["Gymnastics", "Basketball", "Cricket", "Football", "Badminton", "Archery", "Dance", "Mallakhamb", "Skating"]);
        }
      })
      .catch(err => {
        console.error('Error loading sports for registration:', err);
        setAvailableSports(["Gymnastics", "Basketball", "Cricket", "Football", "Badminton", "Archery", "Dance", "Mallakhamb", "Skating"]);
      });
  }, []);

  const handleSportToggle = (sport: string) => {
    if (selectedSports.includes(sport)) {
      setSelectedSports(prev => prev.filter(s => s !== sport));
    } else {
      setSelectedSports(prev => [...prev, sport]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSports.length === 0) {
      alert("Please choose at least one sport to register!");
      return;
    }
    
    setLoading(true);
    setIsError(false);

    axios.post('/api/registrations/', {
      full_name: fullName, email, phone_number: phoneNumber, birth_date: birthDate, sports: selectedSports
    })
      .then(() => {
        setPopupText('Your details have been successfully submitted! Our team will review your application and contact you shortly.');
        setIsError(false);
        setShowPopup(true);
        setFullName(''); setEmail(''); setPhoneNumber(''); setBirthDate(''); setSelectedSports([]);
      })
      .catch(err => {
        console.error('Registration failed:', err);
        setPopupText('Registration failed. Please check your connection and try again.');
        setIsError(true);
        setShowPopup(true);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6 font-body text-primary relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

      <section className="w-full max-w-2xl mx-auto bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-slate-100 relative z-10 animate-fade-in-up">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-white p-2 shadow-lg border border-slate-100 flex items-center justify-center">
            <img src="/img/psa.png" alt="logo" className="w-full h-full object-contain" />
          </div>
        </div>
        
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold font-heading text-primary tracking-tight mb-2">Join The Academy</h2>
          <p className="text-slate-500 text-lg">Take the first step towards athletic excellence.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
            <input type="text" placeholder="John Doe" required value={fullName} onChange={e => setFullName(e.target.value)} className="w-full p-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-slate-50 focus:bg-white" />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
            <input type="email" placeholder="john@example.com" required value={email} onChange={e => setEmail(e.target.value)} className="w-full p-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-slate-50 focus:bg-white" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
              <input type="tel" placeholder="+91 98765 43210" required value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} className="w-full p-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-slate-50 focus:bg-white" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Date of Birth</label>
              <input type="date" required value={birthDate} onChange={e => setBirthDate(e.target.value)} className="w-full p-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-slate-50 focus:bg-white text-slate-700" />
            </div>
          </div>

          <div className="pt-2">
            <h3 className="text-base font-bold text-primary mb-4">Select Discipline(s)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {availableSports.map(sport => (
                <div key={sport} className={`border rounded-xl p-3 cursor-pointer transition-all flex items-center gap-3 ${selectedSports.includes(sport) ? 'bg-primary/5 border-primary shadow-sm' : 'border-slate-200 hover:border-slate-300 bg-white'}`} onClick={() => handleSportToggle(sport)}>
                  <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${selectedSports.includes(sport) ? 'bg-primary border-primary' : 'border-slate-300'}`}>
                    {selectedSports.includes(sport) && <CheckCircle className="text-white w-4 h-4" />}
                  </div>
                  <span className={`text-sm font-semibold select-none ${selectedSports.includes(sport) ? 'text-primary' : 'text-slate-600'}`}>{sport}</span>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 mt-6 text-lg font-bold bg-primary text-white rounded-xl shadow-lg hover:bg-primary-light hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center">
            {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Submit Application'}
          </button>
        </form>

        {/* Admin Login Link */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-500">
            Academy Staff Member?{' '}
            <Link to="/admin/login" className="text-primary font-bold hover:text-accent hover:underline flex items-center justify-center gap-1 mt-1">
              <ShieldAlert size={14} /> Log in to Dashboard
            </Link>
          </p>
        </div>

        {/* Modal Overlay */}
        {showPopup && (
          <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-sm w-full animate-fade-in-up relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-accent to-primary"></div>
              
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isError ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                {isError ? <AlertCircle size={40} /> : <CheckCircle size={40} />}
              </div>
              <h2 className="text-2xl font-bold font-heading text-primary mb-3">
                {isError ? 'Oops!' : 'Application Sent'}
              </h2>
              <p className="text-sm text-slate-500 mb-8 leading-relaxed">{popupText}</p>
              <button onClick={() => setShowPopup(false)} className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-light transition-colors w-full">
                Close
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Register;
