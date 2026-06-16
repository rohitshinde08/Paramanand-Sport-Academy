import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

interface Sport {
  id: number;
  name: string;
  slug: string;
  description: string;
  schedule_json: Record<string, string>;
  image_url: string;
}

interface GalleryItem {
  id: number;
  category: string;
  image_url: string;
}

const SportDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [sport, setSport] = useState<Sport | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setRegisterSuccess(false);

    axios.get(`/api/content/sports/${slug}`)
      .then(res => {
        setSport(res.data);
        
        let category = slug;
        if (slug === 'gymnastics') category = 'gym';
        if (slug === 'basketball') category = 'basket';
        if (slug === 'mallakhamba') category = 'mall';
        if (slug === 'taekwondo') category = 'taekwondo';

        axios.get('/api/content/gallery')
          .then(gRes => {
            const items = gRes.data.filter((item: any) => item.category === category);
            setGalleryItems(items);
          })
          .catch(gErr => console.error('Error fetching gallery for sport:', gErr));
      })
      .catch(err => console.error('Error fetching sport details:', err))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleScrollLeft = () => {
    if (containerRef.current) containerRef.current.scrollLeft -= containerRef.current.clientWidth;
  };

  const handleScrollRight = () => {
    if (containerRef.current) containerRef.current.scrollLeft += containerRef.current.clientWidth;
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sport) return;
    setRegisterLoading(true);

    axios.post('/api/registrations/', {
      full_name: fullName, email, phone_number: phoneNumber, birth_date: birthDate, sports: [sport.name]
    })
      .then(() => {
        setRegisterSuccess(true);
        setFullName(''); setEmail(''); setPhoneNumber(''); setBirthDate('');
      })
      .catch(err => {
        console.error('Registration failed:', err);
        alert('Failed to submit registration. Please try again.');
      })
      .finally(() => setRegisterLoading(false));
  };

  if (loading) return <div className="min-h-[80vh] flex justify-center items-center text-4xl text-primary font-heading font-semibold">Loading sport details...</div>;

  if (!sport) return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center gap-8">
      <h2 className="text-4xl text-primary font-heading font-bold">Sport Not Found</h2>
      <Link to="/" className="px-10 py-4 bg-primary text-white rounded-full text-2xl hover:bg-primary-light transition-colors">Back to Home</Link>
    </div>
  );

  const isVideo = sport.image_url.includes('.mp4') || sport.image_url.includes('.webm') || sport.image_url.includes('player.vimeo');

  const resolveImage = (url: string) => url ? (url.startsWith('http') || url.startsWith('/uploads') ? url : `/${url}`) : '';

  return (
    <div className="w-full overflow-x-hidden">
      {/* Banner */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: isVideo ? 'none' : `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${resolveImage(sport.image_url)})` }}>
        {isVideo && (
          <video autoPlay muted loop className="absolute inset-0 w-full h-full object-cover z-0">
            <source src={resolveImage(sport.image_url)} type="video/mp4" />
          </video>
        )}
      </section>

      {/* Main Details */}
      <div className="py-20 px-[5%] lg:px-[9%] flex flex-wrap lg:flex-nowrap gap-16 items-start bg-bg-light">
        <div className="flex-[2_1_400px]">
          <h1 className="text-[4rem] text-primary font-heading font-extrabold uppercase mb-8">{sport.name}</h1>
          <p className="text-[1.6rem] leading-[1.8] text-text-dark">{sport.description}</p>
        </div>

        {/* Schedule Card */}
        <div className="flex-[1_1_300px] bg-white rounded-b-2xl border-t-[60px] border-primary p-10 shadow-soft sticky top-32">
          <h2 className="text-3xl font-heading font-bold text-primary mb-8 flex items-center gap-3">
            Schedule <i className="far fa-clock text-accent"></i>
          </h2>
          <div className="flex flex-col gap-6">
            {Object.entries(sport.schedule_json).map(([ageGroup, timing]) => (
              <div key={ageGroup} className="border-b border-gray-100 pb-4 last:border-0">
                <span className="text-accent text-[1.4rem] font-bold block mb-1">For {ageGroup}</span>
                <span className="text-[1.5rem] text-text-dark font-medium">{timing}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Reel */}
      {galleryItems.length > 0 && (
        <section className="py-24 px-[5%] lg:px-[9%] bg-white relative">
          <h2 className="text-center text-[clamp(3.2rem,5vw,4.5rem)] font-extrabold text-primary mb-16 capitalize">Training <span className="text-accent relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-1 after:bg-accent after:rounded-sm">Moments</span></h2>
          
          <div className="relative group">
            <button onClick={handleScrollLeft} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-16 h-16 bg-white rounded-full shadow-elevated flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><i className="fas fa-chevron-left text-primary text-2xl"></i></button>
            <div ref={containerRef} className="flex overflow-x-auto gap-8 scroll-smooth snap-x pb-8 hide-scrollbar">
              {galleryItems.map(item => (
                <div key={item.id} className="flex-none w-[280px] h-[380px] snap-start rounded-2xl overflow-hidden shadow-soft">
                  <img src={resolveImage(item.image_url)} alt="Sport visual" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
            <button onClick={handleScrollRight} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-16 h-16 bg-white rounded-full shadow-elevated flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><i className="fas fa-chevron-right text-primary text-2xl"></i></button>
          </div>
        </section>
      )}

      {/* Registration Form */}
      <section className="py-24 px-[5%] lg:px-[9%] bg-bg-light">
        <h2 className="text-center text-[clamp(2.8rem,4vw,3.8rem)] font-extrabold text-primary mb-12">Register Now for {sport.name}!</h2>
        <div className="max-w-[600px] mx-auto bg-white p-12 rounded-[24px] shadow-elevated border border-gray-100">
          <div className="flex justify-center mb-10">
            <img src="/img/psa.png" alt="logo" className="h-24 rounded-full shadow-sm" />
          </div>
          
          {registerSuccess ? (
            <div className="text-center py-8">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-check text-4xl text-green-500"></i>
              </div>
              <h3 className="text-3xl font-heading font-bold text-primary mb-4">Success!</h3>
              <p className="text-xl text-text-muted mb-8">Your details have been successfully submitted for {sport.name}!</p>
              <button onClick={() => setRegisterSuccess(false)} className="px-10 py-4 bg-primary text-white rounded-full text-xl font-medium hover:bg-primary-light transition-colors">Submit Another</button>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="flex flex-col gap-8">
              <div>
                <label className="block text-[1.4rem] font-bold text-text-dark mb-3">Full Name</label>
                <input type="text" placeholder="Enter full name" required value={fullName} onChange={e => setFullName(e.target.value)} className="w-full p-5 text-[1.4rem] border border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 focus:bg-white" />
              </div>
              <div>
                <label className="block text-[1.4rem] font-bold text-text-dark mb-3">Email Address</label>
                <input type="email" placeholder="Enter email address" required value={email} onChange={e => setEmail(e.target.value)} className="w-full p-5 text-[1.4rem] border border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 focus:bg-white" />
              </div>
              <div className="flex flex-col sm:flex-row gap-8">
                <div className="flex-1">
                  <label className="block text-[1.4rem] font-bold text-text-dark mb-3">Phone Number</label>
                  <input type="tel" placeholder="Enter phone number" required value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} className="w-full p-5 text-[1.4rem] border border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 focus:bg-white" />
                </div>
                <div className="flex-1">
                  <label className="block text-[1.4rem] font-bold text-text-dark mb-3">Birth Date</label>
                  <input type="date" required value={birthDate} onChange={e => setBirthDate(e.target.value)} className="w-full p-5 text-[1.4rem] border border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 focus:bg-white" />
                </div>
              </div>
              <button type="submit" disabled={registerLoading} className="w-full py-6 mt-4 text-[1.6rem] font-bold bg-primary text-white rounded-xl shadow-md hover:bg-primary-light hover:shadow-lg hover:-translate-y-1 transition-all disabled:opacity-70 disabled:hover:translate-y-0">
                {registerLoading ? 'Submitting...' : 'Complete Registration'}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default SportDetail;
