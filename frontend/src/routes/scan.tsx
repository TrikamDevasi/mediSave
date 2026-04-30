import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Camera,
  Check,
  FileImage,
  Image as ImageIcon,
  Loader2,
  RotateCcw,
  ShieldCheck,
  X,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: "Scan Prescription — MediSave" },
      {
        name: "description",
        content: "Scan or upload a prescription to identify medicines and compare prices nearby.",
      },
    ],
  }),
  component: ScannerPage,
});

type ScannerMode = "idle" | "camera" | "preview" | "scanning" | "success" | "error";

type ExtractedMedicine = {
  id: string;
  name: string;
  strength: string;
};

const scanSteps = [
  "Checking image clarity",
  "Reading prescription text",
  "Identifying medicines",
  "Finding best prices",
];

const initialExtractedMedicines: ExtractedMedicine[] = [
  { id: "metformin", name: "Metformin", strength: "500mg" },
  { id: "atorvastatin", name: "Atorvastatin", strength: "10mg" },
  { id: "telmisartan", name: "Telmisartan", strength: "40mg" },
];

const medicineKey = (medicine: Pick<ExtractedMedicine, "name" | "strength">) =>
  `${medicine.name.trim().toLowerCase()}|${medicine.strength.trim().toLowerCase()}`;

function ScannerPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const rafRef = useRef<number | null>(null);
  const [mode, setMode] = useState<ScannerMode>("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [lastEditedMedicineId, setLastEditedMedicineId] = useState<string | null>(null);
  const [extractedMedicines, setExtractedMedicines] = useState<ExtractedMedicine[]>(
    initialExtractedMedicines,
  );

  const scanning = mode === "scanning";
  const hasPreview = Boolean(previewUrl);
  const duplicateMedicineKeys = useMemo(() => {
    const counts = new Map<string, number>();
    extractedMedicines.forEach((medicine) => {
      const key = medicineKey(medicine);
      if (key !== "|") counts.set(key, (counts.get(key) ?? 0) + 1);
    });
    return new Set([...counts].filter(([, count]) => count > 1).map(([key]) => key));
  }, [extractedMedicines]);
  const hasDuplicateMedicines = duplicateMedicineKeys.size > 0;

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      stopCamera();
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const resetScan = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    stopCamera();
    setProgress(0);
    setStepIndex(0);
    setError(null);
    setMode(previewUrl ? "preview" : "idle");
  };

  const setNewPreview = (url: string | null) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(url);
  };

  const openCamera = async () => {
    resetScan();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      setMode("camera");
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      setError("Camera access was blocked. Allow camera permission or upload a prescription image.");
      setMode("error");
    }
  };

  const captureFrame = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) {
      setError("Camera preview is still loading. Try again in a moment.");
      setMode("error");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) {
        setError("We could not capture this image. Please retake or upload from gallery.");
        setMode("error");
        return;
      }
      setNewPreview(URL.createObjectURL(blob));
      stopCamera();
      setMode("preview");
    }, "image/jpeg");
  };

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    resetScan();
    if (!file.type.startsWith("image/")) {
      setError("Please upload a clear prescription image in JPG, PNG, or WEBP format.");
      setMode("error");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("This image is too large. Please upload an image below 8 MB.");
      setMode("error");
      return;
    }
    stopCamera();
    setNewPreview(URL.createObjectURL(file));
    setMode("preview");
    event.target.value = "";
  };

  const startScan = () => {
    if (!hasPreview) {
      setError("Add a prescription photo first, then start scanning.");
      setMode("error");
      return;
    }

    setError(null);
    setMode("scanning");
    setProgress(0);
    setStepIndex(0);
    const start = performance.now();
    const tick = () => {
      const ratio = Math.min(1, (performance.now() - start) / 3200);
      setProgress(Math.round(ratio * 100));
      setStepIndex(Math.min(scanSteps.length - 1, Math.floor(ratio * scanSteps.length)));
      if (ratio < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    timers.current.push(
      setTimeout(() => {
        const failed = Math.random() < 0.12;
        if (failed) {
          setError("The prescription text was not clear enough. Retake in brighter light or upload a sharper image.");
          setMode("error");
          return;
        }
        setExtractedMedicines(initialExtractedMedicines);
        setMode("success");
      }, 3300),
    );
  };

  const updateExtractedMedicine = (
    id: string,
    field: keyof Pick<ExtractedMedicine, "name" | "strength">,
    value: string,
  ) => {
    setLastEditedMedicineId(id);
    setExtractedMedicines((items) =>
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const removeExtractedMedicine = (id: string) => {
    if (lastEditedMedicineId === id) setLastEditedMedicineId(null);
    setExtractedMedicines((items) => items.filter((item) => item.id !== id));
  };

  const compareReviewedMedicines = () => {
    if (hasDuplicateMedicines) return;
    const query = extractedMedicines
      .map((medicine) => `${medicine.name} ${medicine.strength}`.trim())
      .filter(Boolean)
      .join(", ");
    navigate({ to: "/search", search: { q: query || "prescription" } });
  };

  return (
    <AppLayout>
      <div className="px-4 pt-4 pb-28">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-foreground">Scan Prescription</h1>
            <p className="text-sm text-mutedfg">Capture, review, and compare prices in seconds</p>
          </div>
          <div className="rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary-dark">
            Guided
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 text-xs font-medium text-mutedfg">
          {["Add photo", "Scan", "Compare"].map((label, index) => {
            const active =
              (index === 0 && ["idle", "camera", "preview"].includes(mode)) ||
              (index === 1 && scanning) ||
              (index === 2 && mode === "success");
            return (
              <div key={label} className="flex items-center gap-2">
                <span
                  className={
                    active
                      ? "grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground"
                      : "grid h-6 w-6 place-items-center rounded-full bg-muted text-mutedfg"
                  }
                >
                  {index + 1}
                </span>
                <span>{label}</span>
              </div>
            );
          })}
        </div>

        <Card className="mt-5 overflow-hidden rounded-2xl border-border bg-card shadow-sm">
          <CardContent className="p-0">
            <div className="relative h-[360px] bg-primary-light/30">
              <div className="absolute inset-4 rounded-2xl border-2 border-dashed border-primary/60" />
              <span className="absolute left-6 top-6 h-7 w-7 rounded-tl-lg border-l-4 border-t-4 border-primary" />
              <span className="absolute right-6 top-6 h-7 w-7 rounded-tr-lg border-r-4 border-t-4 border-primary" />
              <span className="absolute bottom-6 left-6 h-7 w-7 rounded-bl-lg border-b-4 border-l-4 border-primary" />
              <span className="absolute bottom-6 right-6 h-7 w-7 rounded-br-lg border-b-4 border-r-4 border-primary" />

              {mode === "camera" ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="h-full w-full object-cover"
                />
              ) : previewUrl ? (
                <img src={previewUrl} alt="Prescription preview" className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full place-items-center px-8 text-center">
                  <div>
                    <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-card text-primary shadow-sm">
                      <FileImage className="h-7 w-7" />
                    </div>
                    <p className="mt-4 text-sm font-semibold text-foreground">Add a clear prescription photo</p>
                    <p className="mt-1 text-xs text-mutedfg">Keep all medicine names inside the frame</p>
                  </div>
                </div>
              )}

              {scanning && (
                <motion.div
                  initial={{ y: 24 }}
                  animate={{ y: 312 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-x-7 top-0 h-0.5 bg-primary shadow-[0_0_12px_color-mix(in_oklab,var(--primary)_80%,transparent)]"
                />
              )}
            </div>
          </CardContent>
        </Card>

        <AnimatePresence mode="wait">
          {mode === "error" && error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4"
            >
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Scan needs attention</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          {scanning && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 rounded-2xl border border-border bg-card p-4"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-foreground">{scanSteps[stepIndex]}</span>
                <span className="tabular-nums text-mutedfg">{progress}%</span>
              </div>
              <Progress value={progress} className="mt-3" />
              <div className="mt-3 flex items-center gap-2 text-xs text-mutedfg">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                Matching medicines with trusted pharmacy prices
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <motion.div whileTap={{ scale: 0.97 }}>
            <Button type="button" variant="outline" className="h-12 w-full rounded-full" onClick={openCamera}>
              <Camera className="h-4 w-4" />
              Camera
            </Button>
          </motion.div>
          <motion.div whileTap={{ scale: 0.97 }}>
            <Button
              type="button"
              variant="outline"
              className="h-12 w-full rounded-full"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="h-4 w-4" />
              Upload
            </Button>
          </motion.div>
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />

        {mode === "camera" ? (
          <div className="mt-3 grid grid-cols-2 gap-3">
            <motion.div whileTap={{ scale: 0.97 }}>
              <Button type="button" className="h-12 w-full rounded-full" onClick={captureFrame}>
                <Camera className="h-4 w-4" />
                Capture
              </Button>
            </motion.div>
            <motion.div whileTap={{ scale: 0.97 }}>
              <Button type="button" variant="secondary" className="h-12 w-full rounded-full" onClick={resetScan}>
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </motion.div>
          </div>
        ) : (
          <div className="mt-3 grid grid-cols-[1fr_auto] gap-3">
            <motion.div whileTap={{ scale: 0.97 }}>
              <Button type="button" className="h-12 w-full rounded-full" onClick={startScan} disabled={scanning}>
                {scanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                {hasPreview ? "Start guided scan" : "Add photo to scan"}
              </Button>
            </motion.div>
            <motion.div whileTap={{ scale: 0.97 }}>
              <Button type="button" variant="secondary" size="icon" className="h-12 w-12 rounded-full" onClick={resetScan}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {mode === "success" && (
          <motion.div
            initial={{ y: 420, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 420, opacity: 0 }}
            transition={{ type: "spring", damping: 24, stiffness: 220 }}
            className="fixed inset-x-0 bottom-16 z-30 mx-auto max-w-2xl px-3"
          >
            <div className="rounded-t-2xl border-x border-t border-border bg-card p-5 shadow-2xl">
              <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-border" />
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-foreground">Review extracted medicines</h2>
                  <p className="text-xs text-mutedfg">Edit names or strengths before comparing prices</p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setMode("preview")}
                  className="grid h-8 w-8 place-items-center rounded-full text-mutedfg hover:bg-muted"
                  aria-label="Close results"
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </div>
              <ul className="mt-3 space-y-2">
                {extractedMedicines.map((medicine) => {
                  const isDuplicate = duplicateMedicineKeys.has(medicineKey(medicine));
                  const showInlineDuplicateWarning = isDuplicate && lastEditedMedicineId === medicine.id;
                  return (
                  <li key={medicine.id} className={isDuplicate ? "rounded-lg border border-warning bg-background p-3" : "rounded-lg bg-background p-3"}>
                    <div className={isDuplicate ? "mb-2 flex items-center gap-2 text-xs font-semibold text-warning" : "mb-2 flex items-center gap-2 text-xs font-semibold text-success"}>
                      <span className={isDuplicate ? "grid h-5 w-5 place-items-center rounded-full bg-warning text-primary-foreground" : "grid h-5 w-5 place-items-center rounded-full bg-success text-primary-foreground"}>
                        <Check className="h-3 w-3" />
                      </span>
                      {isDuplicate ? "Duplicate found" : "Extracted"}
                    </div>
                    <div className="grid grid-cols-[1fr_92px_32px] gap-2">
                      <Input
                        value={medicine.name}
                        aria-label="Medicine name"
                        onChange={(event) => updateExtractedMedicine(medicine.id, "name", event.target.value)}
                        className="h-10 bg-card text-sm"
                      />
                      <Input
                        value={medicine.strength}
                        aria-label="Medicine strength"
                        onChange={(event) => updateExtractedMedicine(medicine.id, "strength", event.target.value)}
                        className="h-10 bg-card text-sm"
                      />
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        type="button"
                        onClick={() => removeExtractedMedicine(medicine.id)}
                        className="grid h-10 w-8 place-items-center rounded-md text-mutedfg hover:bg-muted"
                        aria-label={`Remove ${medicine.name}`}
                      >
                        <X className="h-4 w-4" />
                      </motion.button>
                    </div>
                    {showInlineDuplicateWarning && (
                      <p className="mt-2 flex items-start gap-1.5 text-xs font-medium text-warning" role="alert" aria-live="polite">
                        <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        This medicine and strength already exists. Change the name or strength to continue.
                      </p>
                    )}
                  </li>
                  );
                })}
              </ul>
              {hasDuplicateMedicines && (
                <Alert className="mt-3 border-warning text-warning">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Duplicate medicine detected</AlertTitle>
                  <AlertDescription>
                    Keep only one entry for each medicine and strength before comparing prices.
                  </AlertDescription>
                </Alert>
              )}
              <motion.div whileTap={{ scale: 0.97 }} className="mt-4">
                <Button
                  type="button"
                  className="h-12 w-full rounded-full"
                  onClick={compareReviewedMedicines}
                  disabled={extractedMedicines.length === 0 || hasDuplicateMedicines}
                >
                  Compare reviewed medicines →
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}

export default ScannerPage;