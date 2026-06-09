"use client";

export type HomeProgressPanel = {
  label: string;
};

type HorizontalProgressBarProps = {
  progress: number;
  activeIndex: number;
  panels: HomeProgressPanel[];
};

const labelStyle =
  "font-display uppercase [text-shadow:0_0_10px_rgba(255,255,255,0.85),0_1px_4px_rgba(5,5,5,0.25)]";

export function HorizontalProgressBar({
  progress,
  activeIndex,
  panels,
}: HorizontalProgressBarProps) {
  const clamped = Math.min(1, Math.max(0, progress));
  const fillPct = `${clamped * 100}%`;
  const counter = `${String(activeIndex + 1).padStart(2, "0")} / ${String(panels.length).padStart(2, "0")}`;
  const activeLabel = panels[activeIndex]?.label ?? panels[0]?.label ?? "";

  return (
    <div
      className="pointer-events-none fixed left-1/2 z-[92] w-[calc(100vw-40px)] max-w-none -translate-x-1/2 bottom-[58px] md:bottom-[62px] md:w-[min(760px,calc(100vw-48px))]"
      role="progressbar"
      aria-valuenow={Math.round(clamped * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Avance del canvas: panel ${activeIndex + 1} de ${panels.length}, ${activeLabel}`}
    >
      <div className="mb-1 hidden items-end justify-between gap-2 md:flex">
        <span className={`${labelStyle} text-[6px] tracking-[0.3em] text-[#050505]/55`}>
          <span className="text-[#F18700]">{String(activeIndex + 1).padStart(2, "0")}</span>{" "}
          {activeLabel}
        </span>
        <span className={`${labelStyle} text-[6px] tracking-[0.36em] text-[#050505]/45`}>
          {counter}
        </span>
        <span
          className={`${labelStyle} text-[6px] tracking-[0.3em] ${
            activeIndex >= panels.length - 1 ? "text-[#F18700]" : "text-[#050505]/40"
          }`}
        >
          FIN
        </span>
      </div>

      <div
        className="relative h-[2px] overflow-hidden rounded-full bg-[#050505]/10 md:h-[3px]"
        aria-hidden
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-[#F18700] transition-[width] duration-75 ease-out will-change-[width]"
          style={{ width: fillPct }}
        />
      </div>

      <ul className="mt-1 hidden flex-wrap items-center justify-center gap-x-1.5 gap-y-0 md:flex">
        {panels.map((panel, index) => {
          const isActive = index === activeIndex;
          return (
            <li key={panel.label} className="flex items-center gap-1.5">
              {index > 0 && (
                <span className={`${labelStyle} text-[6px] text-[#050505]/20`} aria-hidden>
                  ·
                </span>
              )}
              <span
                className={`${labelStyle} text-[6px] tracking-[0.26em] transition-colors ${
                  isActive ? "text-[#F18700]" : "text-[#050505]/38"
                }`}
              >
                {panel.label}
              </span>
            </li>
          );
        })}
      </ul>

      <ul className="mt-1 flex items-center justify-center gap-1 md:hidden" aria-hidden>
        {panels.map((panel, index) => {
          const isActive = index === activeIndex;
          return (
            <li key={panel.label}>
              <span
                className={`block rounded-full transition-all ${
                  isActive ? "h-1 w-1 bg-[#F18700]" : "h-0.5 w-0.5 bg-[#050505]/25"
                }`}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
