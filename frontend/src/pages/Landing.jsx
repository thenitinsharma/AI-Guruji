import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  BookOpen,
  Mic,
  MessageCircle,
  GraduationCap,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Users,
  Zap,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

const features = [
  {
    icon: MessageCircle,
    title: 'Doubt Solver',
    desc: 'गणित, विज्ञान, हिंदी — किसी भी विषय में step-by-step Hindi में समझाएँ।',
    color: 'from-orange-500 to-amber-500',
  },
  {
    icon: MapPin,
    title: 'UP Board Focus',
    desc: 'Class 9–12 UP Board syllabus — desi examples: khet, mela, cricket, chai।',
    color: 'from-emerald-600 to-green-500',
  },
  {
    icon: Mic,
    title: 'आवाज़ से पूछें',
    desc: 'Hindi voice input — type ki zaroorat nahi, seedha bol kar sawal poochho।',
    color: 'from-indigo-700 to-indigo-500',
  },
  {
    icon: BookOpen,
    title: 'सरल भाषा',
    desc: 'Awadhi-Hinglish style — jaise gaon ka anubhavi master ji samjhata hai।',
    color: 'from-violet-600 to-purple-500',
  },
];

const steps = [
  { num: '01', title: 'शुरू करें', desc: 'Landing se ek click mein chat khulegi' },
  { num: '02', title: 'Sawal likho ya bolo', desc: 'Text ya mic se apna doubt share karo' },
  { num: '03', title: 'Guruji samjhaye', desc: 'HTML format mein clear, structured jawab milega' },
];

const subjects = ['गणित', 'विज्ञान', 'हिंदी', 'सामाजिक विज्ञान', 'अंग्रेज़ी'];

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#FAFBFE] overflow-x-hidden">
      {/* Tricolor accent */}
      <div className="h-1.5 w-full flex">
        <span className="flex-1 bg-[#FF6B35]" />
        <span className="flex-1 bg-white" />
        <span className="flex-1 bg-[#138808]" />
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-900 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-200/50 group-hover:scale-105 transition-transform">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-indigo-950 text-lg leading-none block">AI गुरुजी</span>
              <span className="text-[10px] text-gray-500 font-medium tracking-wide">Team Zenith</span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-gray-500 font-medium">UP Board • Class 9–12</span>
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF6B35] to-orange-500 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-lg shadow-orange-200/60 hover:shadow-orange-300/80 hover:-translate-y-0.5 transition-all"
            >
              Chat शुरू करें
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-12 pb-20 sm:pt-16 sm:pb-28 px-4 sm:px-6">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-200/40 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-32 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-green-200/25 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="inline-flex items-center gap-2 bg-white border border-orange-100 text-orange-700 text-xs font-semibold px-4 py-2 rounded-full shadow-sm mb-6"
          >
            <Zap size={14} className="text-orange-500" />
            EdTech • AI for Bharat
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <motion.h1
                variants={fadeUp}
                custom={1}
                initial="hidden"
                animate="visible"
                className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-indigo-950 leading-[1.15] tracking-tight"
              >
                Aapka{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] via-orange-500 to-amber-500">
                  Personal AI
                </span>
                <br />
                <span className="font-['Noto_Sans_Devanagari']">शिक्षक</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                custom={2}
                initial="hidden"
                animate="visible"
                className="mt-6 text-lg text-gray-600 leading-relaxed max-w-xl font-['Noto_Sans_Devanagari']"
              >
                UP Board के छात्रों के लिए — हिंदी में doubts solve, desi examples के साथ,
                जैसे आपके master ji samjhate hain। बिल्कुल free, तुरंत jawab।
              </motion.p>

              <motion.div
                variants={fadeUp}
                custom={3}
                initial="hidden"
                animate="visible"
                className="mt-8 flex flex-wrap gap-4"
              >
                <Link
                  to="/chat"
                  className="inline-flex items-center gap-2 bg-indigo-900 hover:bg-indigo-800 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-indigo-200/50 transition-all hover:-translate-y-0.5"
                >
                  <GraduationCap size={22} />
                  अभी पढ़ाई शुरू करें
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center gap-2 bg-white border-2 border-gray-200 text-gray-700 font-semibold px-6 py-4 rounded-2xl hover:border-indigo-200 hover:bg-indigo-50/50 transition-all"
                >
                  और जानें
                </a>
              </motion.div>

              <motion.div
                variants={fadeUp}
                custom={4}
                initial="hidden"
                animate="visible"
                className="mt-10 flex flex-wrap gap-2"
              >
                {subjects.map((s) => (
                  <span
                    key={s}
                    className="text-xs font-medium bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg"
                  >
                    {s}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Hero card mockup */}
            <motion.div
              variants={fadeUp}
              custom={2}
              initial="hidden"
              animate="visible"
              className="relative"
            >
              <div className="bg-white rounded-3xl shadow-2xl shadow-indigo-100/80 border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 px-5 py-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                    <Sparkles className="text-orange-300 w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-white font-bold">AI गुरुजी</p>
                    <p className="text-indigo-200 text-xs flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      Online • Doubt Solver
                    </p>
                  </div>
                  <span className="ml-auto text-xs bg-orange-500/90 text-white px-2.5 py-1 rounded-full font-bold">
                    🔥 Streak
                  </span>
                </div>
                <div className="p-5 space-y-4 bg-[#F8FAFC] min-h-[280px]">
                  <div className="flex justify-end">
                    <div className="bg-orange-500 text-white text-sm px-4 py-2.5 rounded-2xl rounded-br-md max-w-[75%]">
                      Pythagoras theorem samjhao
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-900 flex-shrink-0 flex items-center justify-center">
                      <Sparkles size={14} className="text-white" />
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3 text-sm text-gray-700 shadow-sm max-w-[85%] font-['Noto_Sans_Devanagari']">
                      <p className="font-bold text-indigo-900 text-xs mb-1">📌 पाइथागोरस प्रमेय</p>
                      <p className="text-gray-600 leading-relaxed">
                        Khet ke kone par seedha rasta — <code className="text-orange-700 bg-orange-50 px-1 rounded">a² + b² = c²</code>
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <div className="h-10 flex-1 bg-gray-100 rounded-xl" />
                    <div className="w-10 h-10 bg-indigo-900 rounded-xl" />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg">
                ✓ 100% Hindi responses
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-100 bg-white py-10 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '9–12', label: 'Class Range' },
            { value: 'Hindi', label: 'Primary Language' },
            { value: '24/7', label: 'Always Available' },
            { value: 'Free', label: 'No Cost' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <p className="text-2xl sm:text-3xl font-extrabold text-indigo-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-indigo-950">
              Kyun chune <span className="text-[#FF6B35]">AI गुरुजी</span>?
            </h2>
            <p className="mt-3 text-gray-500 max-w-lg mx-auto">
              Tier 2/3 cities ke students ke liye banaya gaya — simple, fast, aur apni bhasha mein।
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-50/50 hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg`}
                >
                  <f.icon className="text-white w-6 h-6" />
                </div>
                <h3 className="font-bold text-indigo-950 text-lg">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed font-['Noto_Sans_Devanagari']">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-b from-indigo-950 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-6xl mx-auto relative">
          <h2 className="text-3xl font-extrabold text-center mb-12">Kaise kaam karta hai?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
              >
                <span className="text-4xl font-black text-orange-400/80">{step.num}</span>
                <h3 className="text-xl font-bold mt-2 font-['Noto_Sans_Devanagari']">{step.title}</h3>
                <p className="text-indigo-200 text-sm mt-2">{step.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 bg-[#FF6B35] hover:bg-orange-500 text-white font-bold px-8 py-4 rounded-2xl transition-all hover:scale-[1.02]"
            >
              Abhi try karein — free hai
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-orange-50 to-indigo-50 rounded-3xl p-8 sm:p-10 border border-orange-100 text-center">
          <Users className="w-10 h-10 text-indigo-700 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-indigo-950">Built for Bharat&apos;s students</h3>
          <ul className="mt-6 space-y-3 text-left max-w-md mx-auto">
            {[
              'UP Board syllabus aligned explanations',
              'Short sentences — easy to read on mobile',
              'Real-life analogies: khet, nadi, mela, cricket',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-gray-600 text-sm">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="bg-white border-t border-gray-100 py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <p className="font-bold text-indigo-950 text-lg">AI गुरुजी</p>
            <p className="text-sm text-gray-500 mt-1">Team Zenith • GDG Hackathon</p>
          </div>
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 bg-indigo-900 text-white font-semibold px-6 py-3 rounded-xl hover:bg-indigo-800 transition-colors"
          >
            Chat par jayein
            <ArrowRight size={18} />
          </Link>
        </div>
        <p className="text-center text-xs text-gray-400 mt-8">
          © {new Date().getFullYear()} AI Guruji — UP Board Class 9-12
        </p>
      </footer>
    </div>
  );
};

export default Landing;
