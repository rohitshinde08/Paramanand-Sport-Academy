import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, Variants, useInView, useScroll, useTransform } from 'framer-motion';
import { ChevronRight, Award, Users, Star, Activity, Quote } from 'lucide-react';
import Hero3D from '../components/Hero3D';

interface SportItem { id: number; name: string; slug: string; image_url: string; }
interface CoachItem { id: number; name: string; specialty: string; bio: string; image_url: string; }
interface TestimonialItem { id: number; parent_name: string; relationship: string; feedback: string; image_url: string; }

function AnimatedCounter({ target, isFloat = false }: { target: number, isFloat?: boolean }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const step = isFloat ? (target / (duration / 16)) : Math.max(1, Math.floor(target / (duration / 16)));
      
      const timer = setInterval(() => {
        start += step;
        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, target, isFloat]);

  return <span ref={ref}>{isFloat ? count.toFixed(1) : Math.floor(count)}</span>;
}

// Framer Motion Variants for Staggered Animations
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } }
};

export default function Home() {
  const [sports, setSports] = useState<SportItem[]>([]);
  const [coaches, setCoaches] = useState<CoachItem[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);

  // Horizontal Scroll Setup
  const horizontalScrollRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: horizontalScrollRef });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-65%"]);
  
  useEffect(() => {
    Promise.all([
      axios.get('/api/content/sports').then(res => setSports(res.data.slice(0, 6))),
      axios.get('/api/content/coaches').then(res => setCoaches(res.data.slice(0, 4))),
      axios.get('/api/content/testimonials').then(res => setTestimonials(res.data.slice(0, 4)))
    ]).catch(err => console.error('Error fetching home data:', err));
  }, []);

  const resolveImage = (url: string) => url ? (url.startsWith('http') || url.startsWith('/uploads') ? url : `/${url}`) : '';

  return (
    <div className="w-full overflow-clip bg-bg-light font-body text-primary">
      
      {/* Interactive WebGL Hero Section */}
      <Hero3D />

      {/* Featured Sports - Cinematic Horizontal Scroll */}
      <section ref={horizontalScrollRef} className="relative h-[200vh] bg-slate-900">
        <div className="sticky top-0 flex flex-col h-screen justify-center overflow-hidden py-12 md:py-24">
          
          <div className="px-6 md:px-12 lg:px-24 mb-8 md:mb-16 flex-shrink-0">
            <h2 className="text-5xl md:text-7xl font-extrabold font-heading text-white mb-2 md:mb-4 tracking-tighter">ELITE <span className="text-accent">PROGRAMS</span></h2>
            <p className="text-slate-300 max-w-xl text-lg md:text-xl font-light">
              Comprehensive, champion-tier training methodologies customized for your discipline.
            </p>
          </div>

          <motion.div style={{ x }} className="flex gap-6 md:gap-8 px-6 md:px-12 lg:px-24 items-center flex-grow-0">
            {sports.map((sport) => (
              <div 
                key={sport.id} 
                className="relative w-[85vw] sm:w-[60vw] md:w-[40vw] lg:w-[32vw] h-[55vh] md:h-[60vh] overflow-hidden rounded-3xl flex-shrink-0 group shadow-2xl"
              >
                <img 
                  src={resolveImage(sport.image_url)} 
                  alt={sport.name} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/30 to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-10">
                  <h3 className="text-4xl md:text-5xl font-extrabold font-heading text-white mb-6 tracking-wide drop-shadow-md">{sport.name}</h3>
                  <Link to={`/sports/${sport.slug}`} className="inline-flex items-center gap-3 bg-accent text-primary px-8 py-4 rounded-full font-bold text-base hover:scale-105 hover:bg-white transition-all shadow-xl">
                    View Details <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            ))}
            {/* Spacer at the end to ensure smooth stop */}
            <div className="w-[5vw] sm:w-[15vw] flex-shrink-0" />
          </motion.div>
        </div>
      </section>

      {/* Quick Facts Strip */}
      <section className="bg-primary py-20 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-primary/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-accent/10 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 divide-x divide-primary-light/30">
            {[
              { icon: Activity, count: 724, label: "Active Athletes" },
              { icon: Award, count: 508, label: "Medals Won" },
              { icon: Users, count: 436, label: "Expert Coaches" },
              { icon: Star, count: 4.8, label: "Average Rating", isFloat: true }
            ].map((stat, i) => (
              <div key={i} className="text-center px-4 flex flex-col items-center">
                <stat.icon className="w-8 h-8 text-accent mb-4 opacity-90" />
                <div className="text-4xl md:text-5xl font-bold font-heading text-white mb-2">
                  <AnimatedCounter target={stat.count} isFloat={stat.isFloat} />{!stat.isFloat && '+'}
                </div>
                <div className="text-sm uppercase tracking-widest text-slate-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expert Coaches */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-primary mb-4">World-Class Coaching</h2>
            <p className="text-slate-500 max-w-2xl text-base">Train under the guidance of former champions and certified professionals.</p>
          </div>
          <Link to="/about" className="text-primary font-semibold flex items-center gap-2 hover:text-accent transition-colors">
            Meet all coaches <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
        >
          {coaches.map(coach => (
            <motion.div key={coach.id} variants={fadeUpVariant} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="relative inline-block mb-6">
                <img src={resolveImage(coach.image_url)} alt={coach.name} className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-sm" />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-accent text-primary text-[0.65rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap border border-white">
                  {coach.specialty}
                </div>
              </div>
              <h3 className="text-lg font-bold text-primary mb-2">{coach.name}</h3>
              <p className="text-sm text-slate-500 line-clamp-3">{coach.bio}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-primary mb-4">Athlete Success Stories</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-base">Hear from the parents and athletes who have transformed their skills with us.</p>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={staggerContainer}
          >
            {testimonials.map(testimonial => (
              <motion.div key={testimonial.id} variants={fadeUpVariant} className="bg-slate-50 p-8 md:p-10 rounded-3xl relative">
                <Quote className="absolute top-8 right-8 w-12 h-12 text-slate-200" />
                <p className="text-base md:text-lg text-slate-700 italic mb-8 relative z-10 leading-relaxed">"{testimonial.feedback}"</p>
                <div className="flex items-center gap-4">
                  <img src={resolveImage(testimonial.image_url)} alt={testimonial.parent_name} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                  <div>
                    <h4 className="text-base font-bold text-primary">{testimonial.parent_name}</h4>
                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">{testimonial.relationship}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Founders & Call to Action */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="bg-primary rounded-[2rem] overflow-hidden relative shadow-xl">
          <div className="absolute inset-0 bg-[url('/img/banners/banner2.jpeg')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-transparent"></div>
          
          <div className="relative z-10 p-10 md:p-16 lg:p-24 max-w-3xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-white mb-6">Ready to elevate your game?</h2>
            <p className="text-lg text-slate-300 mb-10 leading-relaxed">
              Join Parmanand Sports Academy today. Experience elite coaching, modern facilities, and a community dedicated to winning.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="px-8 py-4 rounded-full bg-accent text-primary font-bold text-base transition-transform hover:scale-105 shadow-lg">
                Register Online Now
              </Link>
              <Link to="/contact" className="px-8 py-4 rounded-full bg-white/10 text-white font-medium text-base border border-white/20 backdrop-blur-sm transition-colors hover:bg-white/20">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
