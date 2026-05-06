import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, User, History, Zap, Activity } from 'lucide-react';

export default function App() {
  const [formData, setFormData] = useState({
    age: 20,
    experience: 2,
    flexibility: 5
  });
  const [prediction, setPrediction] = useState<null | { style: string, confidence: number }>(null);
  const [loading, setLoading] = useState(false);

  // Local prediction logic as fallback if API is not available
  const getLocalPrediction = (age: number, exp: number, flex: number) => {
    if (flex > 8 && age < 20) return { style: "Ballet", confidence: 0.92 };
    if (age > 25 && flex < 5) return { style: "Salsa", confidence: 0.88 };
    if (exp > 5 && flex > 6) return { style: "Jazz", confidence: 0.85 };
    return { style: "Hip Hop", confidence: 0.78 };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate network delay for the feel
    await new Promise(r => setTimeout(r, 1500));

    try {
      // Attempt to call the FastAPI backend
      const response = await fetch('http://localhost:3000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setPrediction({ style: data.prediction, confidence: data.confidence });
      } else {
        throw new Error('Backend unreachable');
      }
    } catch (err) {
      console.log("Using client-side prediction logic (Backend may not be running in this environment)");
      const result = getLocalPrediction(formData.age, formData.experience, formData.flexibility);
      setPrediction(result);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans bg-brand-cream tracking-tight">
      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center border-b border-black/5 bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="text-2xl font-serif font-bold tracking-tight text-brand-olive uppercase italic">
          Lumina Dance Academy
        </div>
        <div className="hidden md:flex space-x-8 text-sm font-medium uppercase tracking-wider text-black/60">
          <a href="#" className="hover:text-brand-olive transition-colors underline underline-offset-8 decoration-brand-olive/30">Programs</a>
          <a href="#" className="underline underline-offset-8 text-brand-olive">Predict Style</a>
          <a href="#" className="hover:text-brand-olive transition-colors">Instructors</a>
          <a href="#" className="hover:text-brand-olive transition-colors">Schedule</a>
        </div>
        <button className="bg-brand-olive text-white px-6 py-2 rounded-full text-sm font-medium hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-olive/20">
          Join Us
        </button>
      </nav>

      {/* Hero Section */}
      <header className="px-6 py-20 md:py-32 max-w-7xl mx-auto text-center">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
        >
          <span className="text-brand-olive font-serif italic text-xl mb-4 block">Intelligence in motion</span>
          <h1 className="text-6xl md:text-8xl font-serif font-light leading-tight mb-8">
            Discover Your <br /> 
            <span className="italic">Perfect Rhythm</span>
          </h1>
          <p className="max-w-2xl mx-auto text-black/60 text-lg md:text-xl font-light mb-12">
            Our machine learning engine analyzes your profile to match you with the dance style that fits your soul.
          </p>
        </motion.div>
      </header>

      {/* Main Content: Prediction Form */}
      <main className="px-6 pb-32 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          
          {/* Left Side: Form */}
          <motion.div 
            className="bg-white p-8 rounded-[32px] shadow-2xl shadow-black/5 border border-black/5"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-serif mb-8 flex items-center gap-3">
              <Sparkles className="text-brand-olive w-6 h-6" />
              Student Profile
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="space-y-4">
                <label className="flex justify-between text-sm font-medium uppercase tracking-widest text-black/40">
                  <span>Age</span>
                  <span className="text-brand-olive">{formData.age} yrs</span>
                </label>
                <input 
                  type="range" min="5" max="80" 
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: Number(e.target.value)})}
                  className="w-full h-1 bg-black/5 rounded-lg appearance-none cursor-pointer accent-brand-olive" 
                />
              </div>

              <div className="space-y-4">
                <label className="flex justify-between text-sm font-medium uppercase tracking-widest text-black/40">
                  <span>Years of Experience</span>
                  <span className="text-brand-olive">{formData.experience} yrs</span>
                </label>
                <input 
                  type="range" min="0" max="30" 
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: Number(e.target.value)})}
                  className="w-full h-1 bg-black/5 rounded-lg appearance-none cursor-pointer accent-brand-olive" 
                />
              </div>

              <div className="space-y-4">
                <label className="flex justify-between text-sm font-medium uppercase tracking-widest text-black/40">
                  <span>Flexibility Score</span>
                  <span className="text-brand-olive">{formData.flexibility}/10</span>
                </label>
                <input 
                  type="range" min="1" max="10" 
                  value={formData.flexibility}
                  onChange={(e) => setFormData({...formData, flexibility: Number(e.target.value)})}
                  className="w-full h-1 bg-black/5 rounded-lg appearance-none cursor-pointer accent-brand-olive" 
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-6 rounded-2xl text-lg font-medium hover:bg-brand-olive transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {loading ? (
                  <Activity className="animate-spin" />
                ) : (
                  <>
                    Analyze Profile <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Right Side: Results */}
          <div className="space-y-8">
            <AnimatePresence mode="wait">
              {prediction ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="bg-brand-olive text-white p-12 rounded-[32px] shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                  
                  <span className="text-white/60 text-sm font-medium uppercase tracking-widest block mb-4">Your Matched Style</span>
                  <h3 className="text-6xl font-serif italic mb-6">{prediction.style}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs tracking-widest uppercase text-white/60 mb-2">
                      <span>Match Confidence</span>
                      <span>{(prediction.confidence * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-white"
                        initial={{ width: 0 }}
                        animate={{ width: `${prediction.confidence * 100}%` }}
                        transition={{ delay: 0.5, duration: 1 }}
                      />
                    </div>
                  </div>
                  <p className="mt-8 text-white/80 leading-relaxed font-light italic">
                    "Based on your profile, {prediction.style} is where your physical potential meets your rhythmic instinct."
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-black/5 border border-dashed border-black/10 p-12 rounded-[32px] flex flex-col items-center justify-center text-center min-h-[400px]"
                >
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <User className="text-black/20 w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-serif text-black/40 italic">Waiting for profile data...</h3>
                  <p className="text-black/30 text-sm mt-4 uppercase tracking-widest max-w-xs">
                    Complete the form on the left to see your personalized AI recommendation
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-black/5 flex flex-col items-center gap-2">
                <History className="w-4 h-4 text-brand-olive" />
                <span className="text-[10px] uppercase font-bold tracking-tighter opacity-40">Precision</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-black/5 flex flex-col items-center gap-2">
                <Zap className="w-4 h-4 text-brand-olive" />
                <span className="text-[10px] uppercase font-bold tracking-tighter opacity-40">Instant</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-black/5 flex flex-col items-center gap-2">
                <Activity className="w-4 h-4 text-brand-olive" />
                <span className="text-[10px] uppercase font-bold tracking-tighter opacity-40">Dynamic</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-20 border-t border-black/5 text-center">
        <p className="text-[10px] uppercase tracking-[0.2em] text-black/30 mb-8 font-bold">
          © 2026 Lumina Dance Academy • ML Recommender System
        </p>
        <div className="flex justify-center gap-12 grayscale opacity-40 transition-all duration-700">
           <span className="font-serif italic text-sm">Paris</span>
           <span className="font-serif italic text-sm">New York</span>
           <span className="font-serif italic text-sm">Tokyo</span>
        </div>
      </footer>
    </div>
  );
}
