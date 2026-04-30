export type Pharmacy = {
  id: string;
  name: string;
  distanceKm: number;
  walkMin: number;
  closesAt: string;
  open: boolean;
  janAushadhi?: boolean;
  cheapest?: boolean;
  pin: { top: string; left: string };
};

export const pharmacies: Pharmacy[] = [
  {
    id: "p1",
    name: "Apollo Pharmacy",
    distanceKm: 0.4,
    walkMin: 5,
    closesAt: "10 PM",
    open: true,
    pin: { top: "30%", left: "45%" },
  },
  {
    id: "p2",
    name: "Jan Aushadhi Kendra",
    distanceKm: 1.2,
    walkMin: 14,
    closesAt: "8 PM",
    open: true,
    janAushadhi: true,
    cheapest: true,
    pin: { top: "40%", left: "30%" },
  },
  {
    id: "p3",
    name: "MedPlus",
    distanceKm: 1.8,
    walkMin: 21,
    closesAt: "9 PM",
    open: true,
    pin: { top: "50%", left: "60%" },
  },
  {
    id: "p4",
    name: "Independent Pharmacy",
    distanceKm: 2.1,
    walkMin: 25,
    closesAt: "11 PM",
    open: true,
    pin: { top: "65%", left: "50%" },
  },
];
