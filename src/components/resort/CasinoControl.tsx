import { createContext, useContext, useState } from "react";
import { Dices, Volume2, VolumeX, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isCasinoSoundEnabled, toggleCasinoSound } from "@/lib/casinoAudio";

interface CasinoContextType {
  spinKey: number;
  triggerSpinAll: () => void;
  audioEnabled: boolean;
  toggleAudio: () => void;
}

const CasinoContext = createContext<CasinoContextType>({
  spinKey: 0,
  triggerSpinAll: () => {},
  audioEnabled: true,
  toggleAudio: () => {},
});

export function CasinoProvider({ children }: { children: React.ReactNode }) {
  const [spinKey, setSpinKey] = useState(1);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const triggerSpinAll = () => {
    setSpinKey((k) => k + 1);
  };

  const handleToggleAudio = () => {
    const next = toggleCasinoSound();
    setAudioEnabled(next);
  };

  return (
    <CasinoContext.Provider
      value={{
        spinKey,
        triggerSpinAll,
        audioEnabled,
        toggleAudio: handleToggleAudio,
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
  const { spinKey, triggerSpinAll, audioEnabled, toggleAudio } = useCasino();
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

      <Button
        variant="ghost"
        size="icon"
        onClick={toggleAudio}
        title={audioEnabled ? "Casino audio clicks enabled (click to mute)" : "Casino audio muted (click to enable)"}
        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
      >
        {audioEnabled ? (
          <Volume2 className="size-3.5 text-[var(--champagne)]" />
        ) : (
          <VolumeX className="size-3.5 text-muted-foreground" />
        )}
      </Button>
    </div>
  );
}
