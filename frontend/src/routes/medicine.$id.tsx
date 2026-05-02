import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  Info, 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  TrendingUp, 
  Share2, 
  Heart,
  Navigation
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { usePageTransition } from "./__root";

export const Route = createFileRoute("/medicine/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.id} — Compare prices & generics | MediSave` },
      { name: "description", content: "Compare branded and generic medicine prices, see 7-day trends, and find Jan Aushadhi alternatives." },
    ],
  }),
  component: MedicineDetailPage,
});

const pharmacyPrices = [
  { name: "Jan Aushadhi", price: 18, pack: "10 tabs", savings: "73%", color: "var(--color-primary)" },
  { name: "MedPlus",      price: 52, pack: "10 tabs", savings: "24%", color: "var(--color-success)" },
  { name: "Apollo",       price: 68, pack: "10 tabs", savings: "—",   color: "var(--color-border-strong)" },
];

const genericAlternatives = [
  { name: "Atorfit 10", price: 22, manufacturer: "Ajanta Pharma", equivalent: "Lipitor 10mg" },
  { name: "Atorva 10",  price: 24, manufacturer: "Zydus Cadila", equivalent: "Lipitor 10mg" },
  { name: "Lipicard 10", price: 26, manufacturer: "USV Ltd",      equivalent: "Lipitor 10mg" },
];

function MedicineDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { startTransition } = usePageTransition();
  const [openSections, setOpenSections] = useState<string[]>(["uses"]);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    startTransition(e.clientX, e.clientY, path);
  };

  return (
    <AppLayout hideNav>
      <div className="min-h-screen pb-32">
        
        {/* Dynamic Header */}
        <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-xl border-b border-divider px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => window.history.back()} className="p-2 -ml-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="font-bold text-sm truncate max-w-[180px]">{id.replace(/-/g, " ")}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-muted-foreground hover:text-foreground"><Share2 className="h-4 w-4" /></button>
            <button className="p-2 text-muted-foreground hover:text-foreground"><Heart className="h-4 w-4" /></button>
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-4 py-8">
          
          {/* SECTION 1: IDENTITY */}
          <section className="mb-10">
             <div className="flex flex-wrap gap-2 mb-4">
               <Badge variant="primary">Cholesterol</Badge>
               <Badge variant="warning" icon={<Info className="h-3 w-3" />}>Prescription Required</Badge>
             </div>
             <h1 className="text-4xl font-black tracking-tighter text-foreground mb-1 capitalize">
               {id.replace(/-/g, " ")} 10mg
             </h1>
             <p className="text-muted-foreground font-medium">Generic name: <span className="text-foreground">Atorvastatin Calcium</span></p>
             <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50 mt-2">Manufacturer: Pfizer India Ltd.</p>
          </section>

          {/* SECTION 2: PRICE WINNER HERO */}
          <section className="mb-12">
            <Card variant="teal" padding="lg" className="shadow-2xl shadow-primary/20 relative overflow-hidden group">
               <div className="relative z-10">
                 <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-4">
                   <TrendingUp className="h-4 w-4" /> Best Price Guaranteed
                 </div>
                 <h2 className="text-xl font-bold text-white/80 mb-1">Jan Aushadhi Kendra</h2>
                 <div className="text-5xl font-black tracking-tighter text-white mb-4">
                   ₹18.00 <span className="text-lg font-medium text-white/60 tracking-normal">/ strip of 10</span>
                 </div>
                 <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 mb-8">
                    <p className="text-sm font-bold text-white/90">
                      You save <span className="text-white text-lg">₹50</span> vs Apollo Pharmacy (73% off)
                    </p>
                 </div>
                 <Button 
                   variant="secondary" 
                   size="lg" 
                   fullWidth 
                   className="bg-white text-primary border-transparent hover:bg-white/90 font-black uppercase tracking-widest text-xs"
                   onClick={(e) => handleNav(e, "/nearby")}
                 >
                   Navigate to nearest store <Navigation className="h-4 w-4 ml-2" />
                 </Button>
               </div>
               <div className="absolute right-[-10%] top-[-20%] w-64 h-64 bg-white/5 rounded-full blur-[80px]" />
            </Card>
          </section>

          {/* SECTION 3: PRICE COMPARISON TABLE */}
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black tracking-tight">Price Comparison</h3>
              <Badge variant="success" dot>Live Prices</Badge>
            </div>
            
            <Card padding="none" className="overflow-hidden">
               <table className="w-full text-left">
                 <thead>
                   <tr className="bg-surface-2 border-b border-divider">
                     <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pharmacy</th>
                     <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pack</th>
                     <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Price</th>
                     <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Savings</th>
                   </tr>
                 </thead>
                 <tbody onMouseEnter={() => setInView(true)}>
                    {pharmacyPrices.map((p, i) => (
                      <tr key={p.name} className="border-b border-divider last:border-0 hover:bg-surface-2 transition-colors group">
                        <td className="px-6 py-5">
                          <div className="font-bold text-foreground">{p.name}</div>
                        </td>
                        <td className="px-6 py-5 text-sm text-muted-foreground">{p.pack}</td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-1.5">
                            <span className="font-black text-foreground">₹{p.price.toFixed(2)}</span>
                            <div className="w-24 h-1.5 bg-divider rounded-full overflow-hidden">
                               <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: inView ? p.savings === "—" ? "100%" : p.savings : 0 }}
                                 transition={{ delay: i * 0.1, duration: 0.8, ease: "easeOut" }}
                                 className="h-full"
                                 style={{ backgroundColor: p.color }}
                               />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <span className={`text-xs font-black ${p.savings !== "—" ? 'text-success bg-success-light px-2 py-1 rounded-full' : 'text-muted-foreground'}`}>
                            {p.savings}
                          </span>
                        </td>
                      </tr>
                    ))}
                 </tbody>
               </table>
            </Card>
          </section>

          {/* SECTION 4: GENERIC ALTERNATIVES */}
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-lg font-black tracking-tight">Generic Alternatives</h3>
               <Link to="/about" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Why safe?</Link>
            </div>
            <div className="no-scrollbar flex gap-4 overflow-x-auto pb-6">
               {genericAlternatives.map((g) => (
                 <Card key={g.name} className="min-w-[240px] shrink-0 hoverable" padding="md">
                    <Badge variant="primary" size="sm" className="mb-3">Equivalent to {g.equivalent}</Badge>
                    <h4 className="text-lg font-black text-foreground mb-1">{g.name}</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 mb-4">{g.manufacturer}</p>
                    <div className="flex items-center justify-between mt-auto">
                       <span className="text-xl font-black text-primary">₹{g.price}</span>
                       <Button variant="ghost" size="sm" icon={<ArrowRight className="h-4 w-4" />}>Details</Button>
                    </div>
                 </Card>
               ))}
            </div>
          </section>

          {/* SECTION 5: MEDICINE INFO */}
          <section className="mb-16 space-y-4">
             <h3 className="text-lg font-black tracking-tight mb-6">Medicine Information</h3>
             
             {[
               { id: 'uses', title: 'What is it used for?', content: 'Atorvastatin is used along with a proper diet to help lower "bad" cholesterol and fats (such as LDL, triglycerides) and raise "good" cholesterol (HDL) in the blood.' },
               { id: 'side', title: 'Common Side Effects', content: 'Muscle pain, tenderness, or weakness; Confusion or memory problems; Fever, unusual tiredness, and dark colored urine.' },
               { id: 'dosage', title: 'Dosage Instructions', content: 'Follow all directions on your prescription label. Your doctor may occasionally change your dose to make sure you get the best results.' }
             ].map((section) => (
               <Card 
                 key={section.id} 
                 padding="none" 
                 className="overflow-hidden transition-all duration-300"
               >
                 <button 
                   onClick={() => toggleSection(section.id)}
                   className="w-full flex items-center justify-between px-6 py-5 hover:bg-surface-2 transition-colors"
                 >
                    <span className="font-bold text-foreground">{section.title}</span>
                    {openSections.includes(section.id) ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                 </button>
                 <AnimatePresence>
                    {openSections.includes(section.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed"
                      >
                        {section.content}
                      </motion.div>
                    )}
                 </AnimatePresence>
               </Card>
             ))}
             
             <div className="flex items-start gap-3 p-4 bg-surface-2 rounded-2xl border border-divider mt-8">
               <ShieldCheck className="h-5 w-5 text-success shrink-0" />
               <p className="text-[10px] font-medium text-muted-foreground leading-relaxed">
                 Medical information provided is for educational purposes only. Always consult a certified medical professional before starting any new medication.
               </p>
             </div>
          </section>

          {/* SECTION 6: NEARBY JAN AUSHADHI */}
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black tracking-tight">Nearby Jan Aushadhi</h3>
              <Button variant="ghost" size="sm" onClick={(e) => handleNav(e, "/nearby")}>View on Map →</Button>
            </div>
            <div className="space-y-3">
               {[
                 { name: "Janakpuri Kendra", dist: "0.8 km", status: "Open" },
                 { name: "Vikaspuri Block C", dist: "1.4 km", status: "Open" },
               ].map((store) => (
                 <div key={store.name} className="flex items-center justify-between p-4 rounded-2xl border border-divider hover:border-primary/50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                       <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                          <MapPin className="h-5 w-5" />
                       </div>
                       <div>
                          <div className="font-bold text-foreground group-hover:text-primary transition-colors">{store.name}</div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">{store.dist} away</div>
                       </div>
                    </div>
                    <div className="text-success text-[10px] font-black uppercase tracking-widest">{store.status}</div>
                 </div>
               ))}
            </div>
          </section>

        </div>

        {/* STICKY BOTTOM BAR */}
        <div className="fixed bottom-0 inset-x-0 z-40 bg-background/80 backdrop-blur-xl border-t border-divider p-4 flex items-center justify-between gap-4 max-w-3xl mx-auto">
           <Button variant="secondary" size="lg" onClick={() => window.history.back()} className="shrink-0">
             <ArrowLeft className="h-5 w-5" />
           </Button>
           <Button 
             variant="primary" 
             size="xl" 
             fullWidth 
             className="shadow-xl shadow-primary/20 text-xs uppercase tracking-[0.2em] font-black"
             onClick={(e) => handleNav(e, "/nearby")}
           >
             Get for ₹18 at Jan Aushadhi
           </Button>
        </div>

      </div>
    </AppLayout>
  );
}
