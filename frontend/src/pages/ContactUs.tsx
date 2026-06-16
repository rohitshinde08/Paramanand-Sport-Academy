import React, { useState } from 'react';
import axios from 'axios';

const ContactUs: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg('');

    axios.post('/api/queries/', {
      full_name: fullName,
      email: email,
      phone_number: phoneNumber,
      message: message
    })
      .then(() => {
        setStatusMsg('Thank you! Your query has been successfully submitted.');
        setFullName('');
        setEmail('');
        setPhoneNumber('');
        setMessage('');
      })
      .catch(err => {
        console.error('Error submitting query:', err);
        setStatusMsg('Failed to submit query. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="w-full overflow-x-hidden">
      {/* Banner */}
      <section className="relative min-h-[50vh] flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://media.istockphoto.com/id/1311934969/photo/contact-us.jpg?s=612x612&w=0&k=20&c=_vmYyAX0aFi-sHH8eYS-tLLNfs1ZWXnNB8M7_KWwhgg=')" }}>
        <h1 className="relative z-10 text-white text-[clamp(4rem,6vw,5.5rem)] font-heading font-extrabold uppercase tracking-widest animate-fade-in-up">Contact Us</h1>
      </section>

      {/* Main Content */}
      <div className="py-24 px-[5%] lg:px-[9%] bg-bg-light">
        <div className="flex flex-wrap lg:flex-nowrap gap-16 max-w-[1200px] mx-auto">
          
          {/* Form Section */}
          <form onSubmit={handleSubmit} className="flex-[1_1_400px] bg-white p-12 rounded-[24px] shadow-soft hover:shadow-elevated transition-shadow duration-300 border border-gray-50">
            <div className="mb-10">
              <h2 className="text-[3.2rem] font-heading font-bold text-primary mb-2">Get in Touch</h2>
              <p className="text-[1.5rem] text-text-muted">Have questions? Leave us a message and we'll get back to you shortly.</p>
            </div>

            {statusMsg && (
              <div className={`p-6 mb-8 rounded-xl text-[1.4rem] font-medium border ${statusMsg.includes('successfully') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                {statusMsg}
              </div>
            )}

            <div className="flex flex-col gap-8">
              <div>
                <label className="block text-[1.2rem] font-bold text-text-dark mb-3 tracking-wide">FULL NAME</label>
                <input type="text" placeholder="Enter your name..." required value={fullName} onChange={e => setFullName(e.target.value)} className="w-full p-5 text-[1.4rem] border border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 focus:bg-white" />
              </div>
              <div>
                <label className="block text-[1.2rem] font-bold text-text-dark mb-3 tracking-wide">EMAIL</label>
                <input type="email" placeholder="Enter email..." required value={email} onChange={e => setEmail(e.target.value)} className="w-full p-5 text-[1.4rem] border border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 focus:bg-white" />
              </div>
              <div>
                <label className="block text-[1.2rem] font-bold text-text-dark mb-3 tracking-wide">PHONE NUMBER</label>
                <input type="tel" placeholder="Enter phone number..." required value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} className="w-full p-5 text-[1.4rem] border border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 focus:bg-white" />
              </div>
              <div>
                <label className="block text-[1.2rem] font-bold text-text-dark mb-3 tracking-wide">WHAT DO YOU HAVE IN MIND?</label>
                <textarea placeholder="Enter query..." required value={message} onChange={e => setMessage(e.target.value)} className="w-full h-[140px] p-5 text-[1.4rem] border border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 focus:bg-white resize-none"></textarea>
              </div>
            </div>
            
            <button type="submit" disabled={loading} className="w-full py-6 mt-10 text-[1.6rem] font-bold bg-primary text-white rounded-xl shadow-md hover:bg-primary-light hover:shadow-lg hover:-translate-y-1 transition-all disabled:opacity-70 disabled:hover:translate-y-0">
              {loading ? 'Submitting...' : 'Submit Message'}
            </button>
          </form>
          
          {/* Info Section */}
          <div className="flex-[1_1_400px]">
            <div className="bg-white p-12 rounded-[24px] shadow-soft border border-gray-50 h-full flex flex-col">
              <h2 className="text-[2.8rem] font-heading font-bold text-primary mb-10 border-b border-gray-100 pb-4">Reach us at</h2>
              
              <div className="mb-8">
                <h3 className="text-[1.6rem] font-bold text-text-dark uppercase tracking-widest mb-2 flex items-center gap-3">
                  <i className="fas fa-map-marker-alt text-accent text-2xl"></i> Address
                </h3>
                <p className="text-[1.5rem] text-text-muted leading-relaxed">Untwadi, Jagtap Nagar, Nashik, Maharashtra 422008</p>
              </div>
              
              <div className="mb-8">
                <h3 className="text-[1.6rem] font-bold text-text-dark uppercase tracking-widest mb-2 flex items-center gap-3">
                  <i className="fas fa-phone text-accent text-2xl"></i> Phone
                </h3>
                <p className="text-[1.8rem] font-bold text-red-600">80805 33887</p>
              </div>
              
              <div className="mb-10">
                <h3 className="text-[1.6rem] font-bold text-text-dark uppercase tracking-widest mb-2 flex items-center gap-3">
                  <i className="fas fa-envelope text-accent text-2xl"></i> Email
                </h3>
                <p className="text-[1.5rem] text-text-muted">prasadsangle008@gmail.com</p>
              </div>
              
              <div className="w-full h-[300px] rounded-2xl overflow-hidden shadow-inner mt-auto">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3749.603212120308!2d73.76301137440555!3d19.983182422869262!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bddeb3464530f1b%3A0x378c9740ecb3760b!2sParmanand%20Sports%20Academy%20%7C%20Nashik!5e0!3m2!1sen!2sin!4v1685638950461!5m2!1sen!2sin" 
                  className="w-full h-full border-0" 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactUs;
