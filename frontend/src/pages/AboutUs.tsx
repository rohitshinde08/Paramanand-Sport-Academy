import React from 'react';
import { motion } from 'framer-motion';
import { Target, Compass, Dumbbell, Medal, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutUs: React.FC = () => {
  return (
    <div className="w-full bg-white font-body text-primary pt-24">
      {/* 1. Ultra-Clean Typography Hero */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-16">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          <h4 className="text-accent font-bold tracking-widest uppercase mb-6 text-sm">About The Academy</h4>
          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold font-heading text-primary leading-[1.05] tracking-tight mb-8">
            We don't just train athletes. <br/>
            <span className="text-slate-300">We forge champions.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 font-light max-w-2xl leading-relaxed">
            Parmanand Sports Academy is Nashik's premier destination for elite athletic development, combining world-class facilities with championship-level coaching.
          </p>
        </motion.div>
      </section>

      {/* 2. Edge-to-Edge Parallax Image Banner */}
      <section className="w-full h-[60vh] md:h-[75vh] relative overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          viewport={{ once: true }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/img/banners/aboutba.jpeg')" }}
        >
          <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
        </motion.div>
      </section>

      {/* 3. Sticky Scroll Editorial Section for Mission/Vision */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-32">
        <div className="flex flex-col lg:flex-row gap-16 md:gap-24 relative">
          
          {/* Sticky Left Column */}
          <div className="lg:w-1/3 relative">
            <div className="lg:sticky lg:top-32">
              <h2 className="text-4xl md:text-5xl font-bold font-heading text-primary mb-6 leading-tight">Our Core<br className="hidden lg:block" /> Philosophy.</h2>
              <p className="text-slate-500 text-lg mb-8">
                The principles that have guided hundreds of our athletes to state, national, and international success.
              </p>
              <div className="w-20 h-1.5 bg-accent rounded-full"></div>
            </div>
          </div>

          {/* Scrolling Right Column */}
          <div className="lg:w-2/3 space-y-24">
            
            {/* Vision */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="flex gap-8 md:gap-12"
            >
              <div className="hidden md:block">
                <span className="text-6xl font-bold font-heading text-slate-100">01</span>
              </div>
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg">
                    <Compass className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold font-heading text-primary">The Vision</h3>
                </div>
                <p className="text-xl text-slate-600 leading-relaxed font-light">
                  We foresee ourselves as the absolute frontrunners in the sports arena. By anticipating the increasing demands of modern sports science and competition, we aim to build a reputation as the definitive proving ground for athletic talent in India.
                </p>
              </div>
            </motion.div>

            {/* Mission */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="flex gap-8 md:gap-12"
            >
              <div className="hidden md:block">
                <span className="text-6xl font-bold font-heading text-slate-100">02</span>
              </div>
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg">
                    <Target className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold font-heading text-primary">The Mission</h3>
                </div>
                <p className="text-xl text-slate-600 leading-relaxed font-light">
                  To provide a comprehensive range of sports and recreational activities for all sports lovers irrespective of age. We are committed to developing a deeply ingrained sporty culture, promoting holistic health, and utilizing expert coaches to carve out distinctive talent.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 4. The Standards - Dark Section */}
      <section className="bg-primary text-white py-32 relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold font-heading mb-8 leading-tight">Uncompromising<br/>Standards.</h2>
              <p className="text-xl text-slate-300 leading-relaxed mb-12 font-light">
                Talent is universal, but opportunity is not. We bridge that gap by providing infrastructure that rivals international training facilities, ensuring our athletes have every tool necessary to succeed.
              </p>
              <ul className="space-y-8">
                <li className="flex items-start gap-5">
                  <div className="mt-1 bg-accent/20 p-3 rounded-xl">
                    <Dumbbell className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 text-white">State-of-the-Art Infrastructure</h4>
                    <p className="text-slate-400 font-light leading-relaxed">Imported equipment and scientifically designed training grounds to ensure optimal athletic development and injury prevention.</p>
                  </div>
                </li>
                <li className="flex items-start gap-5">
                  <div className="mt-1 bg-accent/20 p-3 rounded-xl">
                    <Medal className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 text-white">Elite Coaching Staff</h4>
                    <p className="text-slate-400 font-light leading-relaxed">Our trainers aren't just enthusiasts; they are former international competitors, certified professionals, and tactical experts.</p>
                  </div>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative lg:ml-auto"
            >
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl relative max-w-md mx-auto lg:mx-0">
                <img src="/img/banners/gymnastics.jpeg" alt="Training Facility" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-primary/20 mix-blend-overlay"></div>
              </div>
              {/* Floating Stat Card */}
              <div className="absolute -bottom-8 -left-8 md:-left-12 bg-white text-primary p-8 rounded-3xl shadow-2xl max-w-[280px]">
                <div className="text-6xl font-bold font-heading mb-2 text-primary">10<span className="text-accent">+</span></div>
                <div className="text-sm font-bold uppercase tracking-widest text-slate-500 leading-snug">Years of Building Champions</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. Clean CTA Section */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-bold font-heading text-primary mb-8 tracking-tight">Your legacy starts today.</h2>
          <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Stop waiting for the perfect moment. Join Parmanand Sports Academy and surround yourself with a community dedicated to winning.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/register" className="w-full sm:w-auto px-10 py-5 rounded-full bg-primary text-white font-bold text-lg hover:bg-primary-light transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-3">
              Join The Academy <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/contact" className="w-full sm:w-auto px-10 py-5 rounded-full bg-white text-primary font-bold text-lg border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all">
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutUs;
