import { createFileRoute, redirect } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { 
  TrendingUp, 
  Clock, 
  ChevronRight, 
  ArrowRight,
  ShieldCheck,
  History,
  PiggyBank,
  Zap,
  Target,
  MapPin,
  Bookmark,
  Bell,
  Settings,
  User
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrambleNumber } from "@/components/common/ScrambleNumber";
import { MorphBlob } from "@/components/common/MorphBlob";
import { usePageTransition } from "./__root";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: ({ location }) => {
    // If not authenticated, redirect to login
    const token = typeof window !== 'undefined' && localStorage.getItem('medisave_auth_token');
    if (!token) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: DashboardPage,
});

function DashboardPage() {
  const { startTransition } = usePageTransition();

  useEffect(() => {
    document.title = "My Savings — MediSave";
  }, []);

  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    startTransition(e.clientX, e.clientY, path);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
        
        {/* Sticky Sub-Header — Fix 1.1: Z-Index Scale */}
        <header className="sticky top-0 z-[var(--z-sticky)] w-full bg-background/80 backdrop-blur-xl border-b border-divider px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
               <User className="h-4 w-4" />
            </div>
            <h1 className="font-black text-sm tracking-tight">My MediSave</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-3 text-muted-foreground hover:text-foreground transition-colors" aria-label="Notifications"><Bell className="h-5 w-5" /></button>
            <button className="p-3 text-muted-foreground hover:text-foreground transition-colors" aria-label="Settings"><Settings className="h-5 w-5" /></button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-12 w-full pb-32">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-left"
          >
             <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-[0.3em] mb-4">
               <ShieldCheck className="h-4 w-4" /> Verified Citizen Account
             </div>
             <h2 className="text-5xl sm:text-7xl font-black tracking-tighter text-foreground leading-none">
               Hey, Trikam 👋
             </h2>
          </motion.div>

          {/* KPI SECTION — Fix 3.4: Bento Grid Consistency */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
             {/* Main Savings Card */}
             <Card variant="teal" padding="xl" className="lg:col-span-2 shadow-2xl shadow-primary/20 relative overflow-hidden group min-h-[300px] flex flex-col justify-between text-left">
                <div className="relative z-10">
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-4">Total Healthcare Savings</p>
                   <div className="text-7xl sm:text-9xl font-black tracking-tighter text-white leading-none">
                      ₹<ScrambleNumber value="14,250" />
                   </div>
                </div>
                <div className="relative z-10 mt-8">
                   <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full px-5 py-2.5 border border-white/10 text-white font-black text-xs uppercase tracking-widest">
                      <TrendingUp className="h-4 w-4" /> +₹1,240 saved this month
                   </div>
                </div>
                <div className="absolute right-[-10%] top-[-20%] w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />
                <MorphBlob />
             </Card>

             {/* Goal Progress — Fix 1.2: Stacking Isolation */}
             <Card variant="elevated" padding="xl" className="flex flex-col justify-between text-left relative overflow-hidden">
                <div className="relative z-10">
                   <div className="h-14 w-14 rounded-[var(--radius-lg)] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-8 shadow-sm">
                      <Target className="h-7 w-7" />
                   </div>
                   <h3 className="text-2xl font-black text-foreground tracking-tight">Savings Milestone</h3>
                   <p className="text-sm text-muted-foreground mt-2 font-medium">Target: ₹20,000 / year</p>
                </div>
                <div className="relative z-10 mt-8">
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] mb-3">
                      <span className="text-primary">71% Reached</span>
                      <span className="opacity-40">₹5,750 to go</span>
                   </div>
                   <div className="h-3 w-full bg-divider rounded-full overflow-hidden border border-divider">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "71%" }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full bg-primary shadow-[0_0_15px_rgba(13,158,166,0.3)]"
                      />
                   </div>
                </div>
             </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
             {/* RECENT ACTIVITY — Fix 3.3: Text Alignment */}
             <div className="text-left">
                <div className="flex items-center justify-between mb-10 px-2">
                   <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
                     <History className="h-6 w-6 text-primary" /> Savings History
                   </h3>
                   <Button variant="ghost" size="sm" className="text-[10px] uppercase font-black tracking-widest">View History</Button>
                </div>
                <div className="space-y-4">
                   {[
                     { name: "Metformin 500mg", date: "24 Apr", saved: "₹142", pharmacy: "Jan Aushadhi", icon: "💊" },
                     { name: "Pantoprazole 40mg", date: "12 Apr", saved: "₹210", pharmacy: "MedPlus", icon: "🧪" },
                     { name: "Atorvastatin 10mg", date: "05 Apr", saved: "₹85", pharmacy: "Jan Aushadhi", icon: "💊" },
                   ].map((item, i) => (
                     <Card 
                       key={i} 
                       padding="md" 
                       hoverable 
                       className="flex items-center justify-between group border border-divider hover:border-primary/20 transition-all"
                     >
                        <div className="flex items-center gap-5 flex-text-fix">
                           <div className="h-14 w-14 rounded-[var(--radius-lg)] bg-surface-2 border border-divider flex items-center justify-center text-2xl grayscale group-hover:grayscale-0 transition-all group-hover:bg-primary/5 shrink-0">
                              {item.icon}
                           </div>
                           <div className="flex-text-fix">
                              <h4 className="font-black text-lg text-foreground group-hover:text-primary transition-colors truncate-single">{item.name}</h4>
                              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.1em] mt-1 opacity-60 truncate-single">{item.date} · {item.pharmacy}</p>
                           </div>
                        </div>
                        <div className="text-right shrink-0">
                           <div className="text-success font-black tracking-tighter text-2xl tabular-nums">+{item.saved}</div>
                           <div className="text-[9px] font-black uppercase text-muted-foreground tracking-widest opacity-40">Cashback</div>
                        </div>
                     </Card>
                   ))}
                </div>
             </div>

             {/* SMART SUGGESTIONS */}
             <div className="space-y-8 text-left">
                <div className="px-2">
                   <h3 className="text-xl font-black tracking-tight flex items-center gap-3 mb-10">
                     <Zap className="h-6 w-6 text-accent" /> Insight Radar
                   </h3>
                </div>

                <Card variant="default" padding="xl" className="bg-accent/5 border-accent/10 relative overflow-hidden group shadow-sm text-left">
                   <div className="relative z-10">
                      <Badge variant="primary" className="bg-accent text-white border-transparent mb-6">Actionable Tip</Badge>
                      <h4 className="text-2xl font-black text-foreground mb-3 tracking-tight">Switch to 90-day supply</h4>
                      <p className="text-base text-muted-foreground leading-relaxed max-w-sm font-medium text-wrap-pretty">
                        You can save an extra <span className="text-accent font-black">₹450</span> every quarter by switching your Metformin prescription to a bulk Jan Aushadhi supply.
                      </p>
                      <Button variant="ghost" size="md" className="mt-8 text-accent hover:text-accent font-black p-0 group/btn" rightIcon={<ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />}>
                         Apply Smart Suggestion
                      </Button>
                   </div>
                   <PiggyBank className="absolute right-[-5%] bottom-[-5%] h-40 w-40 text-accent/10 -rotate-12 group-hover:rotate-0 transition-transform duration-700 pointer-events-none" />
                </Card>

                <div className="grid grid-cols-2 gap-6">
                   <Card hoverable padding="lg" className="flex flex-col items-center text-center group cursor-pointer">
                      <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-5 group-hover:scale-110 transition-transform">
                         <Bookmark className="h-7 w-7" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest">Saved Medicines</span>
                   </Card>
                   <Card hoverable padding="lg" className="flex flex-col items-center text-center group cursor-pointer" onClick={(e) => handleNav(e, "/nearby")}>
                      <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-5 group-hover:scale-110 transition-transform">
                         <MapPin className="h-7 w-7" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest">Store Radar</span>
                   </Card>
                </div>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
}
