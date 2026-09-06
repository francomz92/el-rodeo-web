import React, { memo, useId, useEffect, useState, type HTMLAttributes } from "react";
import { cn } from "@lib/utils/cssStyle.lib";

interface RippleSpinnerProps extends HTMLAttributes<HTMLDivElement> {
    size?: "sm" | "md" | "lg";
    fullScreen?: boolean;
}

const rippleSpinnerSizeConfig = {
    sm: { container: "size-6", borderWidth: "border" },
    md: { container: "size-12", borderWidth: "border-2" },
    lg: { container: "size-24", borderWidth: "border-[3px]" },
} as const;

const RippleSpinner = memo(({ size = "md", fullScreen = false, className, ...props }: RippleSpinnerProps) => {
    const config = rippleSpinnerSizeConfig[size] || rippleSpinnerSizeConfig.md;
    const displayFull = fullScreen ? "top-0 left-0 min-w-full min-h-full bg-black/10" : "";

    return (
        <div className={cn("absolute grid place-content-center", displayFull)}>
            <div className={cn("relative", config.container, className)} {...props}>
                {[0, 1, 2].map((index) => (
                    <span
                        key={index}
                        className={cn("absolute inset-0 rounded-full border-current bg-current/0.03 animate-ripple", config.borderWidth)}
                        style={{
                            animationDelay: `${index * 0.6}s`,
                        }}
                    />
                ))}
            </div>
        </div>
    );
});

RippleSpinner.displayName = "RippleSpinner";

type TextMorphProps = {
    words: string[];
    interval?: number;
    className?: string;
};

export function TextMorph({ words, interval = 2000, className }: TextMorphProps) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (!words.length) return;

        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % words.length);
        }, interval);

        return () => clearInterval(timer);
    }, [words, interval]);

    const currentWord = words[index] ?? "";

    if (!words.length) return null;

    return (
        <span
            key={currentWord} // Cambiar la key reinicia la animación de las letras al cambiar de palabra
            className={cn("inline-flex gap-0.5 overflow-hidden", className)}
        >
            {Array.from(currentWord).map((char, i) => (
                <span
                    key={`${currentWord}-${i}`}
                    className="inline-block opacity-0 animate-char-in"
                    style={{ animationDelay: `${i * 30}ms` }}
                >
                    {char === " " ? "\u00A0" : char}
                </span>
            ))}
        </span>
    );
}

interface LiquidWaveSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: "sm" | "md" | "lg";
    texts?: string[];
}

const sizeConfig = {
    sm: {
        container: "w-full gap-3",
        svgWidth: 80,
        svgHeight: 80,
        fontSize: "text-xs",
    },
    md: {
        container: "w-full gap-6",
        svgWidth: 120,
        svgHeight: 120,
        fontSize: "text-sm",
    },
    lg: {
        container: "w-full gap-8",
        svgWidth: 180,
        svgHeight: 180,
        fontSize: "text-base",
    },
} as const;

const WAVE_PATH =
    "M 0 36.5 " +
    "C 67.43 36.5, 99.09 15.5, 160.53 15.5 C 221.98 15.5, 250.54 36.5, 300 36.5 " +
    "C 348.56 36.5, 397.30 7, 457.63 7 C 517.96 7, 539.66 36.5, 600 36.5 " +
    "C 667.43 36.5, 699.09 15.5, 760.53 15.5 C 821.98 15.5, 850.54 36.5, 900 36.5 " +
    "C 948.56 36.5, 997.30 7, 1057.63 7 C 1117.96 7, 1139.66 36.5, 1200 36.5 " +
    "L 1200 800 L 0 800 Z";

const WaveSpinner = memo(({ size = "md", texts = ["Cargando..."], className, ...props }: LiquidWaveSpinnerProps) => {
    const config = sizeConfig[size] || sizeConfig.md;
    const clipId = useId();

    return (
            <div
                className={cn(
                    "fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/60 backdrop-blur-[1px]",
                    config.container,
                    className,
                )}
                {...props}
            >
                <svg viewBox="0 0 500 240" width={config.svgWidth} height={config.svgHeight} aria-hidden="true">
                    <defs>
                        <clipPath id={clipId}>
                            <circle cx="249.5" cy="249.5" r="107.5" />
                        </clipPath>
                    </defs>

                    <circle cx="249.5" cy="249.5" r="107.5" className="fill-muted" />

                    <g clipPath={`url(#${clipId})`}>
                        {/* Ola Trasera (Fondo) */}
                        <g className="animate-liquid-fill-bg">
                            <g className="animate-wave-left">
                                <path d={WAVE_PATH} className="fill-primary" style={{ opacity: 0.4 }} />
                            </g>
                        </g>

                        {/* Ola Delantera (Frente) */}
                        <g className="animate-liquid-fill-fg">
                            <g className="animate-wave-right">
                                <path d={WAVE_PATH} className="fill-primary" />
                            </g>
                        </g>
                    </g>
                </svg>

                <div className="flex items-center gap-1 text-muted-foreground select-none">
                    <TextMorph
                        words={texts}
                        interval={2000}
                        className={cn("font-medium", config.fontSize)}
                    />
                </div>
            </div>
    );
});

WaveSpinner.displayName = "LiquidWaveSpinner";

export default { RippleSpinner, WaveSpinner };
