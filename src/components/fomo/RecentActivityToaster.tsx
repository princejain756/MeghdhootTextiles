import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";

const NAMES = [
  "Aanya (Jaipur)",
  "Riya (Surat)",
  "Kabir (Delhi)",
  "Meera (Pune)",
  "Ishaan (Indore)",
  "Zoya (Mumbai)",
  "Arjun (Ahmedabad)",
  "Sara (Ludhiana)",
  "Dev (Kolkata)",
  "Anika (Bengaluru)",
];

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function RecentActivityToaster() {
  useEffect(() => {
    const fire = () => {
      const name = NAMES[randomBetween(0, NAMES.length - 1)];
      const qty = randomBetween(1, 4);
      toast({
        title: "Recently booked",
        description: `${name} reserved ${qty} set${qty > 1 ? "s" : ""} · Dispatch 2–5 days`,
      });
    };

    const initialDelay = randomBetween(8, 18) * 1000;
    let t = setTimeout(function loop() {
      fire();
      const next = randomBetween(30, 70) * 1000;
      t = setTimeout(loop, next);
    }, initialDelay);
    return () => clearTimeout(t);
  }, []);

  return null;
}

