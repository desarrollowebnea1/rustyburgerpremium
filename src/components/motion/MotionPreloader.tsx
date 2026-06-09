"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { RustyLogoMark } from "@/components/ui/RustyLogoMark";
import { useHomeMotion } from "@/context/HomeMotionContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function MotionPreloader() {
  const { completePreloader } = useHomeMotion();
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (reducedMotion) {
      setProgress(100);
      const t = setTimeout(() => {
        setVisible(false);
        completePreloader();
      }, 300);
      return () => clearTimeout(t);
    }

    let frame = 0;
    const duration = 900;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (elapsed < duration) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const onLoad = () => {
      registerGsap();
      setProgress(100);
      const panel = document.getElementById("rusty-preloader");
      if (panel) {
        gsap
          .timeline({
            onComplete: () => {
              setVisible(false);
              completePreloader();
            },
          })
          .to("#preloader-logo", {
            scale: 1.08,
            opacity: 0,
            duration: 0.45,
            ease: "power2.inOut",
          })
          .to(
            panel,
            {
              yPercent: -100,
              duration: 0.9,
              ease: "power3.inOut",
            },
            "-=0.15"
          );
      } else {
        setVisible(false);
        completePreloader();
      }
    };

    if (document.readyState === "complete") {
      const t = setTimeout(onLoad, 650);
      return () => {
        cancelAnimationFrame(frame);
        clearTimeout(t);
      };
    }

    window.addEventListener("load", onLoad);
    const fallback = setTimeout(onLoad, 2200);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("load", onLoad);
      clearTimeout(fallback);
    };
  }, [completePreloader, reducedMotion]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          id="rusty-preloader"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#F1EFE8]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="hero-cream-grain absolute inset-0" aria-hidden />
          <motion.div
            id="preloader-logo"
            className="relative z-10 w-[38vw] max-w-[200px] md:max-w-[240px]"
            animate={reducedMotion ? {} : { opacity: [0.92, 1, 0.92] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          >
            <RustyLogoMark size="xl" tone="light" />
          </motion.div>
          <div className="relative z-10 mt-10 h-px w-32 overflow-hidden bg-[#050505]/10 md:w-40">
            <motion.div
              className="h-full origin-left bg-rusty-orange"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            />
          </div>
          <p className="relative z-10 mt-4 font-body text-[9px] font-light uppercase tracking-[0.55em] text-[#050505]/40">
            Feast mode on
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
