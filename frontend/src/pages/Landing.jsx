import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } }
};

const StatCard = ({ value, label, icon, delay = 0 }) => (
  <motion.div
    variants={fadeUp}
    custom={delay}
    className="glass-green rounded-2xl p-6 text-center relative overflow-hidden group"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="text-3xl mb-2">{icon}</div>
    <div className="font-display text-3xl font-bold gradient-text mb-1">{value}</div>
    <div className="text-gray-400 text-sm">{label}</div>
  </motion.div>
);

const FeatureCard = ({ icon, title, desc, tag }) => (
  <motion.div
    variants={fadeUp}
    className="card group hover:glow-green cursor-pointer"
  >
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600/30 to-emerald-600/20 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform border border-primary-500/20">
      {icon}
    </div>
    {tag && <span className="badge-green mb-3 text-xs">{tag}</span>}
    <h3 className="font-display text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
  </motion.div>
);

const ProblemStat = ({ stat, label, icon, color }) => (
  <motion.div variants={fadeUp} className="flex items-start gap-4 p-5 glass rounded-2xl border border-red-500/10">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${color}`}>{icon}</div>
    <div>
      <div className="font-display text-2xl font-bold text-white">{stat}</div>
      <div className="text-gray-400 text-sm">{label}</div>
    </div>
  </motion.div>
);

export default function Landing() {
  const featuresRef = useRef(null);
  const impactRef = useRef(null);
  const featuresInView = useInView(featuresRef, { once: true, margin: '-100px' });
  const impactInView = useInView(impactRef, { once: true, margin: '-100px' });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/8 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 glass-green px-4 py-2 rounded-full text-sm text-primary-300 mb-8 border border-primary-500/20">
              <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
              AI-Powered Agricultural Intelligence Platform
              <span className="badge-green ml-1">v1.0</span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] mb-6 tracking-tight">
              Growing Smarter
              <br />
              <span className="gradient-text">With AI</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              AgriNova AI reduces food wastage by 32%, increases farmer income by 28%, 
              and revolutionizes agriculture with predictive AI, smart cold storage, and direct market access.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary text-base px-8 py-4 shadow-lg shadow-primary-500/30">
                Start for Free →
              </Link>
              <Link to="/login" className="btn-ghost text-base px-8 py-4">
                View Dashboard
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                { value: '32%', label: 'Food Waste Reduced', icon: '♻️' },
                { value: '28%', label: 'Income Increase', icon: '💰' },
                { value: '12K+', label: 'Farmers Benefited', icon: '👨‍🌾' },
                { value: '1.2K t', label: 'CO₂ Saved', icon: '🌍' },
              ].map((s, i) => (
                <StatCard key={i} {...s} delay={i * 0.1} />
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-5 h-8 border-2 border-primary-500/40 rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-primary-400 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Problem Section */}
      <section id="impact" className="py-24 px-4 relative" ref={impactRef}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            animate={impactInView ? 'visible' : 'hidden'}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="text-center mb-16">
              <span className="badge-red mb-4">The Problem We Solve</span>
              <h2 className="section-title mb-4">Agriculture is Broken</h2>
              <p className="section-subtitle max-w-2xl mx-auto">
                Farmers lose billions due to information gaps, food waste, and market inefficiencies. We're changing that.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
              {[
                { stat: '₹90,000 Cr', label: 'Annual post-harvest losses in India', icon: '📉', color: 'bg-red-500/20' },
                { stat: '40%', label: 'Of all food produced is wasted before reaching consumers', icon: '🗑️', color: 'bg-orange-500/20' },
                { stat: '58%', label: 'Farmers sell crops at less than market value', icon: '😔', color: 'bg-yellow-500/20' },
                { stat: '70%', label: 'Of India\'s poor are farmers or farm workers', icon: '🏚️', color: 'bg-red-500/20' },
                { stat: '2.5°C', label: 'Average temperature rise threatening crop yields', icon: '🌡️', color: 'bg-orange-500/20' },
                { stat: '80%', label: 'Smallholders lack access to real-time market data', icon: '📵', color: 'bg-yellow-500/20' },
              ].map((s, i) => (
                <ProblemStat key={i} {...s} />
              ))}
            </div>

            <motion.div variants={fadeUp} className="glass-green rounded-3xl p-8 text-center border border-primary-500/20">
              <h3 className="font-display text-2xl font-bold text-white mb-3">Our Mission</h3>
              <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
                To democratize agricultural intelligence — giving every farmer, regardless of landholding size,
                access to AI-powered market insights, smart storage solutions, and direct buyer connections 
                that were once only available to large agribusinesses.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 relative" ref={featuresRef}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-900/5 to-transparent" />
        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            animate={featuresInView ? 'visible' : 'hidden'}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="text-center mb-16">
              <span className="badge-green mb-4">Platform Features</span>
              <h2 className="section-title mb-4">Everything Farmers Need</h2>
              <p className="section-subtitle max-w-2xl mx-auto">
                A complete agricultural intelligence suite powered by AI, real-time data, and community.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon="🤖"
                title="AI Price Prediction"
                desc="Predict crop prices with 85%+ accuracy using machine learning models trained on 10+ years of market data. Know the best time to sell."
                tag="AI-Powered"
              />
              <FeatureCard
                icon="❄️"
                title="Smart Cold Storage"
                desc="IoT-connected cold storage monitoring with real-time temperature, humidity tracking, and solar efficiency metrics. Reduce spoilage by 40%."
                tag="IoT"
              />
              <FeatureCard
                icon="🛒"
                title="Farmer Marketplace"
                desc="Direct farm-to-buyer marketplace eliminating middlemen. List produce, set your price, and connect directly with verified buyers."
                tag="Zero Middlemen"
              />
              <FeatureCard
                icon="📊"
                title="Analytics Dashboard"
                desc="Comprehensive sustainability and business analytics. Track food waste reduction, carbon savings, income growth, and demand trends."
                tag="Real-time"
              />
              <FeatureCard
                icon="💬"
                title="AgriBot AI Assistant"
                desc="24/7 AI-powered agricultural assistant powered by Google Gemini. Get instant advice on crops, diseases, storage, and government schemes."
                tag="Gemini AI"
              />
              <FeatureCard
                icon="🌾"
                title="Crop Recommendations"
                desc="Region-specific, season-aware crop recommendations based on soil type, water availability, market demand, and climate data."
                tag="Smart"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="text-center mb-16">
              <h2 className="section-title mb-4">How AgriNova AI Works</h2>
              <p className="section-subtitle">Three steps to transform your farming operation</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-px bg-gradient-to-r from-primary-500/50 via-primary-400/50 to-primary-500/50" />
              {[
                { step: '01', icon: '📝', title: 'Register & Set Up', desc: 'Create your farmer profile, add your location, crop types, and farm size. Takes 2 minutes.' },
                { step: '02', icon: '🤖', title: 'Get AI Insights', desc: 'Our AI analyzes market data, weather patterns, and demand trends to give you actionable recommendations.' },
                { step: '03', icon: '💰', title: 'Sell & Profit', desc: 'List on the marketplace, connect with buyers, use cold storage insights to time your sales perfectly.' },
              ].map((s, i) => (
                <motion.div key={i} variants={fadeUp} className="text-center relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600/40 to-emerald-600/20 border border-primary-500/30 flex items-center justify-center text-2xl mx-auto mb-4 relative z-10">
                    {s.icon}
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-primary-600 rounded-full text-xs font-bold text-white flex items-center justify-center">
                      {s.step.slice(-1)}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4" id="about">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="text-center mb-16">
              <h2 className="section-title mb-4">Farmer Stories</h2>
              <p className="section-subtitle">Real impact, real lives changed</p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: 'Rajan Patel', location: 'Gujarat', crop: 'Cotton Farmer', quote: 'AgriNova\'s price prediction saved me from selling at low prices. Waited 3 weeks and got 22% more for my cotton crop!', income: '+₹45,000', avatar: 'R' },
                { name: 'Sunita Devi', location: 'Punjab', crop: 'Wheat & Vegetables', quote: 'The cold storage monitoring alerts saved my 8 tons of onions from spoilage. The AI chatbot helped me with organic certification too.', income: '+₹68,000', avatar: 'S' },
                { name: 'Mohan Reddy', location: 'Andhra Pradesh', crop: 'Rice Farmer', quote: 'Direct marketplace connected me with bulk buyers in Hyderabad. No middlemen means 30% more profit for the same harvest!', income: '+₹52,000', avatar: 'M' },
              ].map((t, i) => (
                <motion.div key={i} variants={fadeUp} className="card relative">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-emerald-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{t.name}</div>
                      <div className="text-gray-500 text-xs">{t.crop} · {t.location}</div>
                    </div>
                    <div className="ml-auto badge-green">{t.income}</div>
                  </div>
                  <div className="text-gray-300 text-sm leading-relaxed italic">"{t.quote}"</div>
                  <div className="mt-4 flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-sm">★</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="relative glass-green rounded-3xl p-12 text-center border border-primary-500/20 overflow-hidden"
          >
            <div className="absolute inset-0 bg-grid-pattern opacity-20" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-primary-400 to-transparent" />
            <div className="relative z-10">
              <div className="text-4xl mb-4">🚀</div>
              <h2 className="font-display text-4xl font-bold text-white mb-4">
                Ready to Transform Your Farm?
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Join 12,000+ farmers already using AgriNova AI to grow smarter, reduce waste, and increase profits. Free to start.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register" className="btn-primary text-base px-10 py-4 shadow-lg shadow-primary-500/40">
                  Start Free Today →
                </Link>
                <Link to="/login" className="btn-ghost text-base px-8 py-4">
                  Sign In
                </Link>
              </div>
              <p className="text-gray-500 text-sm mt-6">No credit card required · Free forever for basic features</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-emerald-500 flex items-center justify-center">🌱</div>
                <span className="font-display font-bold gradient-text">AgriNova AI</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">AI-powered agricultural intelligence platform for the modern farmer.</p>
            </div>
            {[
              { title: 'Platform', links: ['Dashboard', 'Cold Storage', 'Marketplace', 'Analytics'] },
              { title: 'Resources', links: ['Documentation', 'API Reference', 'Blog', 'Support'] },
              { title: 'Company', links: ['About Us', 'Careers', 'Privacy Policy', 'Terms of Service'] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="text-white font-semibold mb-4 text-sm">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link, j) => (
                    <li key={j}><a href="#" className="text-gray-500 hover:text-primary-400 text-sm transition-colors">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">© 2024 AgriNova AI. Built with 💚 for farmers.</p>
            <div className="flex items-center gap-4">
              <span className="badge-green">🌍 Sustainable</span>
              <span className="badge-blue">🤖 AI-Powered</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
