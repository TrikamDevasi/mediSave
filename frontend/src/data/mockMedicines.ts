export type Medicine = {
  id: string;
  name: string;
  dosage: string;
  brand: string;
  manufacturer: string;
  mrp: number;
  cheapest: number;
  cheapestAt: string;
  savings: number;
  savingsPct: number;
  isJanAushadhi?: boolean;
};

export type SearchResult = {
  id: string;
  pharmacy: string;
  distanceKm?: number;
  online?: boolean;
  janAushadhi?: boolean;
  price: number;
  mrp: number;
  inStock: boolean;
  medicineName?: string;
};

export const recentlySearched: Medicine[] = [
  {
    id: "atorvastatin-10",
    name: "Atorvastatin",
    dosage: "10mg",
    brand: "Lipitor",
    manufacturer: "Pfizer",
    mrp: 98,
    cheapest: 36,
    cheapestAt: "MedPlus",
    savings: 62,
    savingsPct: 63,
  },
  {
    id: "metformin-500",
    name: "Metformin",
    dosage: "500mg",
    brand: "Glucophage",
    manufacturer: "Sun Pharma",
    mrp: 63,
    cheapest: 18,
    cheapestAt: "Jan Aushadhi",
    savings: 45,
    savingsPct: 71,
    isJanAushadhi: true,
  },
];

export const searchResultsMock: SearchResult[] = [
  { id: "r1", pharmacy: "Apollo Pharmacy", medicineName: "Atorvastatin 10mg", distanceKm: 0.4, price: 89, mrp: 98, inStock: true },
  { id: "r2", pharmacy: "MedPlus", medicineName: "Atorvastatin 10mg", distanceKm: 0.7, price: 36, mrp: 98, inStock: true },
  { id: "r3", pharmacy: "Netmeds", medicineName: "Atorvastatin 10mg", online: true, price: 76, mrp: 98, inStock: true },
  { id: "r4", pharmacy: "Jan Aushadhi", medicineName: "Atorvastatin 10mg", distanceKm: 1.2, price: 8, mrp: 98, inStock: true, janAushadhi: true },
  { id: "r5", pharmacy: "PharmEasy", medicineName: "Atorvastatin 10mg", online: true, price: 79, mrp: 98, inStock: false },
  { id: "r6", pharmacy: "MedPlus", medicineName: "Metformin 500mg", distanceKm: 0.7, price: 18, mrp: 63, inStock: true },
  { id: "r7", pharmacy: "Apollo Pharmacy", medicineName: "Metformin 500mg", distanceKm: 0.4, price: 54, mrp: 63, inStock: true },
];


export const priceTrend7d = [
  { day: "Mon", price: 89 },
  { day: "Tue", price: 92 },
  { day: "Wed", price: 88 },
  { day: "Thu", price: 86 },
  { day: "Fri", price: 84 },
  { day: "Sat", price: 80 },
  { day: "Sun", price: 76 },
];

export const generics = [
  { name: "Atorfit 10mg", manufacturer: "Cipla", price: 36, savingsPct: 64, recommended: true },
  { name: "Stortin 10mg", manufacturer: "Sun Pharma", price: 42, savingsPct: 57 },
  { name: "Jan Aushadhi Atorvastatin", manufacturer: "Govt. of India", price: 8, savingsPct: 92, janAushadhi: true },
];

export const monthlySavings = [
  { month: "Nov", value: 820 },
  { month: "Dec", value: 640 },
  { month: "Jan", value: 1100 },
  { month: "Feb", value: 920 },
  { month: "Mar", value: 1050 },
  { month: "Apr", value: 1247 },
];

export const myMedicines = [
  { id: "m1", name: "Atorvastatin", dosage: "10mg", lastDate: "15 Apr", lastPrice: 36, saved: 62, reminder: true },
  { id: "m2", name: "Metformin", dosage: "500mg", lastDate: "12 Apr", lastPrice: 18, saved: 45, reminder: false },
  { id: "m3", name: "Telmisartan", dosage: "40mg", lastDate: "10 Apr", lastPrice: 28, saved: 38, reminder: true },
];
