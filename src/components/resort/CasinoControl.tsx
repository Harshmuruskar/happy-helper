import { createContext, useContext, useState } from "react";
import { Dices } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CasinoContextType {
  spinKey: number;
  triggerSpinAll: () => void;
}

const CasinoContext = createContext<CasinoContextType>({
  spinKey: 0,
  triggerSpinAll: () => {},
});

export function CasinoProvider({ children }: { children: React.ReactNode }) {
  const [spinKey, setSpinKey] = useState(1);

  const triggerSpinAll = () => {
    setSpinKey((k) => k + 1);
  };

  return (
    <CasinoContext.Provider
      value={{
        spinKey,
        triggerSpinAll,
      }}
    >
      {children}
    </CasinoContext.Provider>
  );
}

export function useCasino() {
  return useContext(CasinoContext);
}

export function CasinoRollButton({ className = "" }: { className?: string }) {
  const { triggerSpinAll } = useCasino();
  const [spinning, setSpinning] = useState(false);

  const handleRoll = () => {
    setSpinning(true);
    triggerSpinAll();
    setTimeout(() => setSpinning(false), 1200);
  };

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={handleRoll}
        title="Spin all casino number reels in this section"
        className="h-8 gap-1.5 border-[var(--champagne)]/60 bg-[var(--gold-soft)]/50 px-2.5 text-xs font-semibold text-[var(--champagne)] shadow-sm hover:bg-[var(--champagne)] hover:text-black transition-all"
      >
        <Dices
          className={`size-3.5 transition-transform duration-700 ${
            spinning ? "rotate-180 scale-125" : ""
          }`}
        />
        <span>Spin Reels</span>
      </Button>
    </div>
  );
}
