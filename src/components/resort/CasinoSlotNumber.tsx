import { useEffect, useMemo, useState } from "react";
import { playJackpotChime, playReelLock } from "@/lib/casinoAudio";

interface CasinoSlotNumberProps {
  value: string | number;
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
  mode?: "inline" | "slot" | "jackpot";
  interactive?: boolean;
  spinTrigger?: any;
  enableAudio?: boolean;
  prefix?: string;
  suffix?: string;
}

interface SingleDigitReelProps {
  digit: number;
  reelIndex: number;
  totalDigits: number;
  spinKey: number;
  baseDelay: number;
  stagger: number;
  baseDuration: number;
  enableAudio: boolean;
  isLastDigit: boolean;
}

function SingleDigitReel({
  digit,
  reelIndex,
  totalDigits,
  spinKey,
  baseDelay,
  stagger,
  baseDuration,
  enableAudio,
  isLastDigit,
}: SingleDigitReelProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  // 1 full cycle of 0-9 before landing on the target digit for a fast, crisp mechanical roll
  const revolutions = 1;
  const targetIndex = revolutions * 10 + digit;
  const totalItems = targetIndex + 1;

  // Generate sequence: [0, 1, 2, ..., 9, 0, 1, ..., targetDigit]
  const tape = useMemo(() => {
    return Array.from({ length: totalItems }, (_, i) => i % 10);
  }, [totalItems]);

  const reelDelay = baseDelay + reelIndex * stagger;
  const reelDuration = baseDuration + reelIndex * 60;

  useEffect(() => {
    setHasStarted(false);
    setIsLocked(false);

    const frame = requestAnimationFrame(() => {
      const timer = setTimeout(() => {
        setHasStarted(true);
      }, 20);
      return () => clearTimeout(timer);
    });

    const lockTimer = setTimeout(() => {
      setIsLocked(true);
      if (enableAudio) {
        playReelLock(reelIndex);
        if (isLastDigit) {
          playJackpotChime();
        }
      }
    }, reelDelay + reelDuration);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(lockTimer);
    };
  }, [spinKey, digit, reelDelay, reelDuration, reelIndex, isLastDigit, enableAudio]);

  if (isLocked) {
    return (
      <span
        className="casino-reel-settled select-none"
        style={{
          display: "inline-block",
          verticalAlign: "-0.12em",
          height: "1.2em",
          lineHeight: "1.2em",
          fontVariantNumeric: "tabular-nums",
          fontFeatureSettings: '"tnum"',
          background: "transparent",
          fontFamily: "inherit",
          fontWeight: "inherit",
          color: "inherit",
        }}
      >
        {digit}
      </span>
    );
  }

  const translateY = hasStarted ? `-${targetIndex * 1.2}em` : "0em";

  return (
    <span
      className="casino-reel-wheel select-none"
      style={{
        display: "inline-block",
        overflow: "hidden",
        verticalAlign: "-0.12em",
        height: "1.2em",
        lineHeight: "1.2em",
        fontVariantNumeric: "tabular-nums",
        fontFeatureSettings: '"tnum"',
        background: "transparent",
        fontFamily: "inherit",
        fontWeight: "inherit",
        color: "inherit",
      }}
    >
      <span
        className="casino-reel-strip"
        style={{
          display: "flex",
          flexDirection: "column",
          willChange: "transform",
          transform: `translateY(${translateY})`,
          transition: hasStarted
            ? `transform ${reelDuration}ms cubic-bezier(0.12, 0.8, 0.28, 1.05) ${reelDelay}ms`
            : "none",
          background: "transparent",
          fontFamily: "inherit",
          fontWeight: "inherit",
          color: "inherit",
        }}
      >
        {tape.map((num, idx) => (
          <span
            key={idx}
            className="casino-reel-digit"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              height: "1.2em",
              lineHeight: "1.2em",
              flex: "0 0 1.2em",
              flexShrink: 0,
              fontFamily: "inherit",
              fontWeight: "inherit",
              color: "inherit",
              background: "transparent",
            }}
          >
            {num}
          </span>
        ))}
      </span>
    </span>
  );
}

export function CasinoSlotNumber({
  value,
  className = "",
  delay = 40,
  duration = 850,
  stagger = 90,
  interactive = false,
  spinTrigger,
  enableAudio = false,
  prefix,
  suffix,
}: CasinoSlotNumberProps) {
  const [internalSpinKey, setInternalSpinKey] = useState(0);

  useEffect(() => {
    if (spinTrigger !== undefined) {
      setInternalSpinKey((k) => k + 1);
    }
  }, [spinTrigger]);

  const fullStr = `${prefix ?? ""}${value ?? ""}${suffix ?? ""}`;

  const parsedTokens = useMemo(() => {
    const chars = fullStr.split("");
    let digitCounter = 0;
    const tokens = chars.map((char) => {
      const isDigit = /^[0-9]$/.test(char);
      const digitIndex = isDigit ? digitCounter++ : -1;
      return {
        char,
        isDigit,
        digit: isDigit ? Number.parseInt(char, 10) : null,
        digitIndex,
      };
    });
    return { tokens, totalDigits: digitCounter };
  }, [fullStr]);

  const handleInteractiveClick = () => {
    if (!interactive) return;
    setInternalSpinKey((k) => k + 1);
  };

  const containerClasses = [
    "inline-flex items-baseline font-inherit",
    interactive ? "cursor-pointer" : "cursor-default",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      className={containerClasses}
      onClick={handleInteractiveClick}
      title={interactive ? "Click to spin reels" : undefined}
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        background: "transparent",
        fontFamily: "inherit",
        fontWeight: "inherit",
        color: "inherit",
      }}
    >
      {parsedTokens.tokens.map((token, idx) => {
        if (token.isDigit && token.digit !== null) {
          return (
            <SingleDigitReel
              key={`${idx}-${token.digitIndex}`}
              digit={token.digit}
              reelIndex={token.digitIndex}
              totalDigits={parsedTokens.totalDigits}
              spinKey={internalSpinKey}
              baseDelay={delay}
              stagger={stagger}
              baseDuration={duration}
              enableAudio={enableAudio}
              isLastDigit={token.digitIndex === parsedTokens.totalDigits - 1}
            />
          );
        }

        // Delimiters, currency symbols, commas, percent, letters
        return (
          <span
            key={idx}
            className="inline-block select-none"
            style={{
              lineHeight: "inherit",
              fontFamily: "inherit",
              fontWeight: "inherit",
              color: "inherit",
              background: "transparent",
              whiteSpace: "pre",
            }}
          >
            {token.char}
          </span>
        );
      })}
    </span>
  );
}
