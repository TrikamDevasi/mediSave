import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useTransform, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { 
  Search, 
  MapPin, 
  Camera, 
  Zap,
  Flame,
  HeartPulse,
  ChevronRight,
  Bot,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import SearchBar from "@/components/common/SearchBar";
import Footer from "@/components/layout/Footer";
import { MagneticButton } from "@/components/common/MagneticButton";
import { ScrambleNumber } from "@/components/common/ScrambleNumber";
import { ParticleField } from "@/components/common/ParticleField";
import { CityFlip } from "@/components/common/CityFlip";
import { AnimatedHeadline } from "@/components/common/AnimatedHeadline";
import { usePageTransition } from "./__root";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const tickerItems = [
  { icon: "💊", text: "₹2.4 Cr saved today" },
  { icon: "🏥", text: "50,234 pharmacies listed" },
  { icon: "💰", text: "Avg family saves ₹12,000/yr" },
  { icon: "⚡", text: "Prices updated every 2 hours" },
  { icon: "🇮🇳", text: "Available in 450+ cities" },
]

const categoriesTop = [
  { emoji: "💊", label: "Antibiotics" },
  { emoji: "🩸", label: "Diabetes" },
  { emoji: "❤️", label: "Cardiac" },
  { emoji: "🧴", label: "Vitamins" },
  { emoji: "💉", label: "Generics" },
  { emoji: "🦴", label: "Ortho" },
  { emoji: "🧠", label: "Neuro" },
  { emoji: "✨", label: "Skin" },
  { emoji: "🫁", label: "Respiratory" },
  { emoji: "👁️", label: "Eye Care" },
]

const categoriesBottom = [
  { emoji: "🏛️", label: "Jan Aushadhi" },
  { emoji: "🧪", label: "Generic" },
  { emoji: "🏷️", label: "Branded" },
  { emoji: "🛒", label: "OTC" },
  { emoji: "📄", label: "Prescription" },
  { emoji: "🌿", label: "Ayurvedic" },
  { emoji: "🩹", label: "First Aid" },
  { emoji: "🍼", label: "Baby Care" },
]

const trendingTopics = [
  { rank: "01", name: "Metformin 500mg", meta: "2,341 searches today · Diabetes", change: "12%", up: true },
  { rank: "02", name: "Atorvastatin 10mg", meta: "1,892 searches today · Cardiac", change: "8%", up: true },
  { rank: "03", name: "Pantoprazole 40mg", meta: "1,450 searches today · Gastric", change: "5%", up: false },
  { rank: "04", name: "Azithromycin 500mg", meta: "1,210 searches today · Antibiotic", change: "15%", up: true },
  { rank: "05", name: "Cetirizine 10mg", meta: "980 searches today · Allergy", change: "3%", up: true },
  { rank: "06", name: "Paracetamol 650mg", meta: "850 searches today · Fever", change: "2%", up: false },
]

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const { scrollY } = useScroll()
  const { startTransition } = usePageTransition()
  
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])

  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault()
    startTransition(e.clientX, e.clientY, path)
  }

  return (
    <AppLayout>
      <div className="flex flex-col">
        
        {/* ─── FIX 7: HERO SECTION ─── */}
        <section className="hero-section">
          {/* Background Layers */}
          <div className="aurora-bg" />
          <ParticleField />

          <div className="hero-inner">
            {/* LEFT — text content */}
            <motion.div style={{ opacity: heroOpacity }} className="flex flex-col items-start text-left">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-6"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                Prices updated 2 min ago
              </motion.div>

              <CityFlip />

              <div style={{ perspective: "1000px" }} className="flex flex-col text-left mt-4">
                <h1 className="text-4xl sm:text-6xl font-light tracking-tight text-foreground/70 leading-tight">
                  <AnimatedHeadline text="Save up to" delay={0.2} />
                </h1>
                <h1 className="text-7xl sm:text-9xl font-black tracking-tighter leading-none mt-2">
                  <span className="shimmer-text">
                     <AnimatedHeadline text="₹12,000 yearly" delay={0.4} />
                  </span>
                </h1>
                <h1 className="text-4xl sm:text-6xl font-light tracking-tight text-foreground/70 mt-2">
                  <AnimatedHeadline text="on medicines" delay={0.6} />
                </h1>
              </div>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 text-lg sm:text-xl text-muted-foreground max-w-[40ch] leading-relaxed text-left text-wrap-pretty"
              >
                Compare prices across 50,000+ pharmacies in India. Find generic alternatives instantly.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
              >
                <MagneticButton className="w-full sm:w-auto">
                  <Link to="/search" onClick={(e) => handleNav(e, "/search")} className="flex h-14 items-center justify-center gap-3 rounded-full bg-primary px-8 font-black text-white shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 text-sm uppercase tracking-widest">
                    <MapPin className="h-5 w-5" />
                    Find Cheapest Near Me
                  </Link>
                </MagneticButton>
                <MagneticButton className="w-full sm:w-auto">
                  <Link to="/scan" onClick={(e) => handleNav(e, "/scan")} className="flex h-14 items-center justify-center gap-3 rounded-full border border-border bg-surface/50 backdrop-blur-md px-8 font-black text-foreground transition-all hover:scale-[1.02] active:scale-95 text-sm uppercase tracking-widest">
                    <Camera className="h-5 w-5 text-primary" />
                    Scan Prescription
                  </Link>
                </MagneticButton>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-12 flex items-center gap-10 border-t border-divider pt-8 w-full"
              >
                <div className="flex flex-col text-left">
                  <div className="text-2xl font-black text-foreground tabular-nums">
                    <ScrambleNumber value="2.4" suffix="Cr" />
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 mt-1">Saved Today</div>
                </div>
                <div className="flex flex-col text-left">
                  <div className="text-2xl font-black text-foreground tabular-nums">
                    <ScrambleNumber value="1.2" suffix="L" />
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 mt-1">Medicines</div>
                </div>
                <div className="flex flex-col text-left">
                  <div className="text-2xl font-black text-foreground tabular-nums">
                    <ScrambleNumber value="50" suffix="K" />
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 mt-1">Pharmacies</div>
                </div>
              </motion.div>
            </motion.div>
            
            {/* RIGHT — medicine card mockup (hidden on mobile) */}
            <div className="hidden lg:flex justify-center relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-[400px]"
              >
                <Card padding="none" className="p-12 bg-surface/90 backdrop-blur-xl border-divider shadow-2xl relative overflow-hidden group rounded-[32px]">
                  <div className="flex items-center justify-between mb-8">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="primary" size="sm" className="bg-accent/10 text-accent border-transparent">
                      SAVE 73%
                    </Badge>
                  </div>
                  <h3 className="text-2xl font-black text-foreground text-left">Metformin 500mg</h3>
                  <p className="text-sm text-muted-foreground mt-1 text-left">Type 2 Diabetes Control</p>
                  
                  <div className="mt-10 space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                        <span>Apollo Pharmacy</span>
                        <span>₹68.00</span>
                      </div>
                      <div className="h-2 w-full bg-divider rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} whileInView={{ width: "100%" }} transition={{ duration: 1 }} className="h-full bg-error" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-success">
                        <span>Jan Aushadhi</span>
                        <span>₹18.40</span>
                      </div>
                      <div className="h-2 w-full bg-divider rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} whileInView={{ width: "27%" }} transition={{ duration: 1 }} className="h-full bg-success shadow-[0_0_15px_rgba(34,197,94,0.3)]" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 flex items-center -space-x-3">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="h-10 w-10 rounded-full border-4 border-surface bg-surface-offset" />
                    ))}
                    <div className="h-10 w-10 rounded-full border-4 border-surface bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary">+8</div>
                  </div>
                </Card>
                <div className="absolute -inset-10 bg-primary/20 blur-[100px] rounded-full -z-10 animate-pulse" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── STATS TICKER ─── */}
        <div className="w-full bg-foreground py-4 border-y border-divider overflow-hidden">
          <div className="flex gap-16 animate-marquee whitespace-nowrap">
            {[...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-background font-black text-xs uppercase tracking-[0.2em]">
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── FIX 6: BENTO GRID ─── */}
        <section className="bento-section">
          <div className="container">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div className="text-left">
                <h2 className="text-5xl sm:text-7xl font-black tracking-tighter text-foreground leading-none">Built for India.</h2>
                <p className="mt-4 text-xl text-muted-foreground font-medium">Every feature designed to put money back in your pocket.</p>
              </div>
              <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
                <Zap className="h-4 w-4" /> Live System 2.0
              </div>
            </div>

            <div className="bento-grid">
              {/* Cell 1: Search (Wide) */}
              <Card padding="xl" className="bento-wide group text-left relative overflow-hidden bg-surface-2 border-divider">
                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-3xl font-black text-foreground tracking-tight">Find any medicine</h3>
                    <Search className="h-8 w-8 text-primary" />
                  </div>
                  <div className="w-full">
                    <SearchBar variant="plain" />
                  </div>
                  <p className="mt-auto pt-8 text-sm text-muted-foreground font-medium">Search 50,000+ branded and generic medicines across India instantly.</p>
                </div>
                <div className="absolute bottom-[-20%] right-[-10%] w-80 h-80 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
              </Card>

              {/* Cell 2: Scan */}
              <Card hoverable padding="xl" className="text-left group cursor-pointer" onClick={(e) => handleNav(e, "/scan")}>
                <div className="h-14 w-14 rounded-[var(--radius-lg)] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                  <Camera className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-black text-foreground mb-3 tracking-tight">Scan & Save</h3>
                <p className="text-sm text-muted-foreground font-medium">Find cheaper alternatives instantly by scanning your prescription.</p>
              </Card>

              {/* Cell 3: Nearby */}
              <Card hoverable padding="xl" className="text-left group cursor-pointer" onClick={(e) => handleNav(e, "/nearby")}>
                <div className="flex items-center gap-2 mb-8">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">Live Radar</span>
                </div>
                <div className="space-y-3">
                  {['Apollo 0.3km', 'MedPlus 0.8km', 'Jan Aushadhi 1.1km'].map(p => (
                    <div key={p} className="flex items-center justify-between text-[11px] font-black p-3 bg-surface-2 rounded-[var(--radius-md)] border border-divider group-hover:border-primary/20 transition-colors">
                      <span>{p.split(' ')[0]}</span>
                      <span className="text-muted-foreground tabular-nums">{p.split(' ')[1]}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Cell 4: Social Proof (Wide) */}
              <Card padding="xl" className="bento-wide flex flex-col md:flex-row items-center justify-between gap-8 text-left">
                <div className="flex-1 flex flex-col">
                  <div className="flex gap-1 mb-6">
                    {[1,2,3,4,5].map(i => <Flame key={i} className="h-5 w-5 fill-orange-500 text-orange-500" />)}
                  </div>
                  <h3 className="text-3xl font-black text-foreground tracking-tight">Trusted by 1L+ Families</h3>
                  <p className="text-sm text-muted-foreground font-medium mt-3">Verified users saving thousands daily across 28 states.</p>
                </div>
                <div className="flex items-center -space-x-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className={`h-16 w-16 rounded-full border-4 border-surface-2 flex items-center justify-center font-black text-xs text-white bg-gradient-to-br shadow-lg ${i===1?'from-primary to-teal-400':i===2?'from-orange-500 to-amber-400':i===3?'from-purple-500 to-indigo-400':'from-blue-500 to-cyan-400'}`}>
                      {i===1?'RK':i===2?'MA':i===3?'SV':'AJ'}
                    </div>
                  ))}
                  <div className="h-16 w-16 rounded-full border-4 border-surface-2 bg-surface-offset flex items-center justify-center text-[10px] font-black text-muted-foreground shadow-lg">
                    +99k
                  </div>
                </div>
              </Card>

              {/* Cell 5: MediBot */}
              <Card padding="xl" className="text-left relative overflow-hidden group bg-surface-2 border-divider">
                <div className="relative z-10 h-full flex flex-col">
                  <div className="h-12 w-12 rounded-[var(--radius-lg)] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 group-hover:rotate-12 transition-transform">
                    <Bot className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-black text-foreground tracking-tight">Ask MediBot</h3>
                  <p className="mt-3 text-xs text-muted-foreground leading-relaxed font-medium">Instant medical info on alternatives, dosages, and side effects.</p>
                  <div className="mt-auto pt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
                    Start Consultation <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
                <div className="absolute bottom-[-10%] right-[-10%] h-32 w-32 bg-primary/5 blur-3xl rounded-full" />
              </Card>
            </div>
          </div>
        </section>

        {/* ─── CATEGORY MARQUEE ─── */}
        <section className="py-16 border-y border-divider overflow-hidden bg-surface-offset">
          <div className="space-y-8">
            <div className="flex gap-6 animate-marquee whitespace-nowrap px-4">
              {[...categoriesTop, ...categoriesTop, ...categoriesTop].map((c, i) => (
                <Link key={i} to="/search" search={{ q: c.label }} className="px-8 py-4 rounded-full border border-divider bg-surface-2 hover:border-primary/50 hover:shadow-lg transition-all flex items-center gap-3 font-black text-xs uppercase tracking-widest text-foreground">
                  <span>{c.emoji}</span>
                  <span>{c.label}</span>
                </Link>
              ))}
            </div>
            <div className="flex gap-6 animate-marquee-reverse whitespace-nowrap px-4">
              {[...categoriesBottom, ...categoriesBottom, ...categoriesBottom].map((c, i) => (
                <Link key={i} to="/search" search={{ q: c.label }} className="px-8 py-4 rounded-full border border-divider bg-surface-2 hover:border-primary/50 hover:shadow-lg transition-all flex items-center gap-3 font-black text-xs uppercase tracking-widest text-foreground">
                  <span>{c.emoji}</span>
                  <span>{c.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── SOCIAL PROOF SECTION ── */}
        <section style={{
          width: '100%',
          padding: 'clamp(64px, 10vw, 120px) 0',
          background: 'var(--color-bg)',
          overflow: 'hidden',
        }}>
          <div style={{
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 clamp(16px, 4vw, 48px)',
          }}>

            {/* ── FEATURED IN ROW ── */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '48px',
              marginBottom: '64px',
              flexWrap: 'wrap',
            }}>
              <span style={{
                fontSize: '11px',
                fontWeight: '600',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-text-faint)',
              }}>
                Featured In
              </span>
              {['Economic Times', 'YourStory', 'MINT', 'Inc42'].map(pub => (
                <span key={pub} style={{
                  fontSize: 'clamp(15px, 2vw, 20px)',
                  fontWeight: '700',
                  fontStyle: 'italic',
                  color: 'var(--color-text-faint)',
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '-0.02em',
                }}>
                  {pub}
                </span>
              ))}
            </div>

            {/* ── TWO CARDS GRID ── */}
            <div className="trust-grid" style={{
              display: 'grid',
              gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr',
              gap: '20px',
              alignItems: 'stretch',
            }}>

              {/* LEFT — Doctor Quote Card */}
              <div className="trust-doctor-card-new" style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '24px',
                padding: 'clamp(24px, 4vw, 40px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '320px',
              }}>
                <div>
                  {/* Badge */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'color-mix(in oklab, var(--color-primary) 12%, var(--color-surface))',
                    border: '1px solid color-mix(in oklab, var(--color-primary) 20%, transparent)',
                    borderRadius: '9999px',
                    padding: '4px 12px',
                    width: 'fit-content',
                    marginBottom: '20px',
                  }}>
                    <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--color-primary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      Clinical Insight
                    </span>
                  </div>

                  {/* Quote */}
                  <blockquote style={{
                    fontSize: 'clamp(20px, 2.5vw, 28px)',
                    fontWeight: '700',
                    fontFamily: 'var(--font-display)',
                    lineHeight: '1.25',
                    color: 'var(--color-text)',
                    margin: '0 0 20px 0',
                    flex: 1,
                    textAlign: 'left'
                  }}>
                    "A game-changer for chronic patients."
                  </blockquote>

                  {/* Small quote body */}
                  <p style={{
                    fontSize: '13px',
                    color: 'var(--color-text-muted)',
                    lineHeight: '1.6',
                    marginBottom: '20px',
                    textAlign: 'left'
                  }}>
                    "As a cardiologist, I see many patients skip doses due to cost.
                    MediSave empowers them to find affordable generics without
                    compromising quality — it's a vital tool for patient compliance."
                  </p>
                </div>

                {/* Doctor attribution */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px', height: '36px',
                    borderRadius: '50%',
                    background: 'var(--color-surface-offset)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '14px', fontWeight: '700', color: 'var(--color-primary)',
                  }}>
                    A
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text)', margin: 0 }}>
                      Dr. Arvinder Singh
                    </p>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', margin: 0 }}>
                      MBBS, MD — Cardiologist
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT — Government Compliance Card */}
              <div className="trust-govt-card-new" style={{
                background: 'var(--color-primary)',
                borderRadius: '24px',
                padding: 'clamp(24px, 4vw, 40px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '320px',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{ position: 'relative', zIndex: 10 }}>
                  {/* Badge */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(255,255,255,0.15)',
                    borderRadius: '9999px',
                    padding: '4px 12px',
                    width: 'fit-content',
                    marginBottom: '20px',
                  }}>
                    <span style={{ fontSize: '11px', fontWeight: '600', color: 'white', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      CDSC Compliant
                    </span>
                  </div>

                  {/* Heading */}
                  <h2 style={{
                    fontSize: 'clamp(28px, 3.5vw, 48px)',
                    fontWeight: '900',
                    fontFamily: 'var(--font-display)',
                    lineHeight: '1.05',
                    color: 'white',
                    margin: '0 0 16px 0',
                    flex: 1,
                    textAlign: 'left'
                  }}>
                    Supporting India's Vision for Affordable Healthcare.
                  </h2>

                  {/* Body */}
                  <p style={{
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.75)',
                    lineHeight: '1.6',
                    marginBottom: '24px',
                    textAlign: 'left'
                  }}>
                    We strictly list only government-approved Jan Aushadhi Branded and
                    NABL-accredited pharmacies. Our data is cross-referenced with the
                    NPPA (National Pharmaceutical Pricing Authority) monthly.
                  </p>
                </div>

                {/* CTA buttons */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', position: 'relative', zIndex: 10 }}>
                  <button style={{
                    padding: '10px 20px',
                    borderRadius: '9999px',
                    background: 'white',
                    color: 'var(--color-primary)',
                    fontWeight: '700',
                    fontSize: '13px',
                    border: 'none',
                    cursor: 'pointer',
                  }}>
                    Verified Stores
                  </button>
                  <button style={{
                    padding: '10px 20px',
                    borderRadius: '9999px',
                    background: 'rgba(255,255,255,0.15)',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '13px',
                    border: '1px solid rgba(255,255,255,0.3)',
                    cursor: 'pointer',
                  }}>
                    See Accreditations
                  </button>
                </div>

                {/* Decorative background circle */}
                <div style={{
                  position: 'absolute',
                  bottom: '-60px',
                  right: '-60px',
                  width: '200px',
                  height: '200px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.06)',
                  pointerEvents: 'none',
                }} />
              </div>

            </div>
          </div>
        </section>

        {/* ─── FIX 9: TRENDING SECTION ─── */}
        <section className="py-32 bg-surface-offset/20">
          <div className="container">
            <div className="text-left mb-16 max-w-2xl">
               <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-widest mb-6">
                 <Flame className="h-3.5 w-3.5" /> High Demand Trends
               </div>
               <h2 className="text-5xl sm:text-7xl font-black tracking-tighter leading-none">What Indians are searching for</h2>
            </div>

            <div className="trending-grid">
              {trendingTopics.map((item, i) => (
                <Link 
                  key={i} 
                  to="/search" 
                  search={{ q: item.name }}
                  className="trending-item group hover:border-primary/50 transition-all shadow-sm hover:shadow-xl"
                >
                  <div className="flex flex-col items-center justify-center shrink-0">
                    <span className="text-3xl font-black text-foreground/10 group-hover:text-primary/20 transition-colors tabular-nums leading-none">
                      {item.rank}
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col justify-center min-w-0">
                    <h3 className="text-xl font-black group-hover:text-primary transition-colors truncate-single leading-tight">{item.name}</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground opacity-60 mt-1.5 truncate-single">
                      {item.meta}
                    </p>
                  </div>
                  <div className={`flex flex-col items-end justify-center ${item.up ? 'text-success' : 'text-error'} shrink-0 ml-4`}>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold">{item.up ? '↑' : '↓'}</span>
                      <span className="text-lg font-black tabular-nums leading-none">{item.change}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FIX 11: LIVE STREAM BAR ─── */}
        <section className="live-stream-bar">
           <div className="container flex items-center justify-between mb-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">Live Savings Stream</h3>
              <div className="flex items-center gap-2">
                 <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-success">Verified Transactions</span>
              </div>
           </div>
           <div className="live-stream-cards-container overflow-hidden">
               <div className="live-stream-cards animate-marquee no-scrollbar">
                  {[...Array(3)].map((_, groupIndex) => (
                    <div key={groupIndex} className="flex gap-4 pr-4">
                      {[
                        { user: "Rahul K.", saved: "₹840", item: "Metformin" },
                        { user: "Priya S.", saved: "₹1,250", item: "Atorvastatin" },
                        { user: "Amit V.", saved: "₹450", item: "Pantoprazole" },
                        { user: "Sneha M.", saved: "₹2,100", item: "Amoxicillin" },
                        { user: "Vikram R.", saved: "₹150", item: "Paracetamol" },
                        { user: "Neha G.", saved: "₹670", item: "Azithromycin" },
                      ].map((s, i) => (
                        <div key={`${groupIndex}-${i}`} className="live-stream-card group hover:border-primary/50 transition-colors">
                           <div className="flex items-center gap-4">
                              <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-[10px]">
                                 {s.user.split(' ')[0][0]}{s.user.split(' ')[1][0]}
                              </div>
                              <div className="text-left">
                                <div className="font-black text-foreground">{s.user} saved <span className="amount">{s.saved}</span></div>
                                <div className="text-[10px] font-black uppercase tracking-widest opacity-40">on {s.item}</div>
                              </div>
                           </div>
                        </div>
                      ))}
                    </div>
                  ))}
               </div>
            </div>
        </section>

        {/* Community Impact */}
        <section className="py-40 relative overflow-hidden">
           <div className="container relative z-10">
              <div className="max-w-4xl mx-auto text-center">
                <div className="inline-block px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-10">
                   National Impact
                </div>
                <h2 className="text-6xl sm:text-8xl font-black tracking-tighter mb-10 leading-none">
                   We've put <span className="shimmer-text">₹2.4 Crores</span> back into Indian pockets.
                </h2>
                <p className="text-xl text-muted-foreground font-medium mb-20 max-w-2xl mx-auto text-wrap-pretty leading-relaxed">
                   That's more than just money. It's better nutrition, better education, and a higher quality of life for 1.2 Lakh+ families.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                   {[
                     { label: "Families Helped", value: "1.2L+" },
                     { label: "States Covered", value: "28" },
                     { label: "Active Stores", value: "50K+" },
                     { label: "Daily Queries", value: "1.5M" }
                   ].map(stat => (
                     <div key={stat.label} className="text-center group">
                        <div className="text-4xl font-black text-foreground mb-2 group-hover:text-primary transition-colors tabular-nums">{stat.value}</div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">{stat.label}</div>
                     </div>
                   ))}
                </div>
              </div>
           </div>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/10 blur-[150px] rounded-full -z-10" />
        </section>

        <Footer />
      </div>
    </AppLayout>
  );
}
