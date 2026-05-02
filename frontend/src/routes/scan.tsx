import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Camera, 
  X, 
  Zap, 
  CheckCircle2, 
  Info,
  ChevronLeft,
  Search,
  Sparkles,
  ArrowRight
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { usePageTransition } from "./__root";
import MediCard from "@/components/medicine/MediCard";
import { searchResultsMock } from "@/data/mockMedicines";

export const Route = createFileRoute("/scan")({
  component: ScanPage,
});

function ScanPage() {
  const [isScanning, setIsScanning] = useState(true);
  const [hasDetected, setHasDetected] = useState(false);
  const [detectedMedicine, setDetectedMedicine] = useState<any>(null);
  const navigate = useNavigate();
  const { startTransition } = usePageTransition();

  useEffect(() => {
    document.title = "Scan Prescription — MediSave";
    
    // Mock detection after 3 seconds
    const timer = setTimeout(() => {
      setIsScanning(false);
      setHasDetected(true);
      setDetectedMedicine(searchResultsMock[0]); // Mock detected Metformin
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    startTransition(e.clientX, e.clientY, "/");
  };

  return (
    <AppLayout>
      <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6">
        
        {/* Header Overlay */}
        <div className="absolute top-0 left-0 right-0 p-8 flex items-center justify-between z-10">
          <button 
            onClick={handleBack}
            className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 text-white"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 backdrop-blur-md border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
            <Sparkles className="h-3.5 w-3.5" /> AI Scanner Active
          </div>
          <div className="h-12 w-12" /> {/* Spacer */}
        </div>

        {/* Viewfinder Area */}
        <div className="relative w-full max-w-sm aspect-square flex items-center justify-center">
          <AnimatePresence mode="wait">
            {isScanning ? (
              <motion.div 
                key="viewfinder"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="scan-viewfinder"
              >
                <div className="scan-corner corner-tl" />
                <div className="scan-corner corner-tr" />
                <div className="scan-corner corner-bl" />
                <div className="scan-corner corner-br" />
                <div className="scan-laser" />
                <div className="scan-pulse" />
                
                {/* Background camera simulation placeholder */}
                <div className="absolute inset-4 rounded-xl bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center overflow-hidden">
                   <div className="w-64 h-32 border-2 border-dashed border-white/10 rounded-lg flex items-center justify-center">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Align medicine strip</p>
                   </div>
                </div>
              </motion.div>
            ) : hasDetected ? (
              <motion.div 
                key="success"
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                className="flex flex-col items-center"
              >
                <div className="h-32 w-32 rounded-full bg-success flex items-center justify-center shadow-[0_0_80px_rgba(34,197,94,0.4)] border-8 border-white/20">
                   <CheckCircle2 className="h-16 w-16 text-white" strokeWidth={3} />
                </div>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8 text-white font-black text-2xl tracking-tight"
                >
                  Medicine Detected
                </motion.p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Instructions Overlay */}
        <AnimatePresence>
          {isScanning && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-12 text-center"
            >
              <p className="text-white font-bold text-lg">Scanning for prices...</p>
              <p className="text-white/40 text-xs mt-2 font-medium">Keep your camera steady and ensure good lighting</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result Slide-up */}
        <AnimatePresence>
          {hasDetected && detectedMedicine && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.8 }}
              className="absolute bottom-0 left-0 right-0 bg-surface rounded-t-[40px] p-8 shadow-[0_-20px_100px_rgba(0,0,0,0.5)] border-t border-white/10 z-20"
            >
              <div className="flex justify-center mb-6">
                <div className="w-12 h-1.5 rounded-full bg-divider" />
              </div>
              
              <div className="flex items-center justify-between mb-8">
                 <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Scan Result</span>
                    <h2 className="text-2xl font-black text-foreground tracking-tight mt-1">{detectedMedicine.medicineName}</h2>
                 </div>
                 <button 
                   onClick={() => { setHasDetected(false); setIsScanning(true); }}
                   className="p-3 rounded-full bg-surface-2 border border-divider text-muted-foreground hover:text-primary transition-colors"
                 >
                   <Camera className="h-5 w-5" />
                 </button>
              </div>

              <div className="mb-8">
                <MediCard 
                  result={detectedMedicine} 
                  cheapest={true} 
                  medicineName={detectedMedicine.medicineName} 
                />
              </div>

              <div className="flex gap-4">
                 <button 
                   onClick={(e) => startTransition(e.clientX, e.clientY, `/search?q=${detectedMedicine.medicineName}`)}
                   className="flex-1 bg-surface-2 border border-divider text-foreground font-black py-4 rounded-2xl flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
                 >
                   <Search className="h-4 w-4" /> Compare All
                 </button>
                 <button 
                   onClick={(e) => startTransition(e.clientX, e.clientY, `/medicine/${detectedMedicine.id}`)}
                   className="flex-1 bg-primary text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 text-xs uppercase tracking-widest shadow-xl shadow-primary/20"
                 >
                   Buy Now <ArrowRight className="h-4 w-4" />
                 </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </AppLayout>
  );
}