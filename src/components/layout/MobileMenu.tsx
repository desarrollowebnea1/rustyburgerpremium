"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants";
import { useHomeMotion } from "@/context/HomeMotionContext";
import { HOME_NAV_LINKS } from "@/lib/home-panels";
import { GoToMenuPanelButton } from "@/components/navigation/GoToMenuPanelButton";

type MobileMenuProps = {
  onClose: () => void;
};

export function MobileMenu({ onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { scrollToPanel } = useHomeMotion();

  return (
    <motion.div
      className="fixed inset-0 z-40 flex flex-col bg-rusty-carbon pt-24"
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ type: "spring", damping: 28, stiffness: 280 }}
    >
      <div className="absolute inset-0 bg-checker-rusty bg-checker opacity-10" />
      <nav className="relative flex flex-1 flex-col gap-2 px-6">
        {isHome
          ? HOME_NAV_LINKS.map((link, i) => (
              <motion.div
                key={`${link.panelId}-${link.label}`}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 + i * 0.06 }}
              >
                <button
                  type="button"
                  onClick={() => {
                    scrollToPanel(link.panelId);
                    onClose();
                  }}
                  className="block w-full border-b border-rusty-gray/40 py-5 text-left font-display text-4xl uppercase text-rusty-cream hover:text-rusty-orange"
                >
                  {link.label}
                </button>
              </motion.div>
            ))
          : NAV_LINKS.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 + i * 0.06 }}
              >
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="block border-b border-rusty-gray/40 py-5 font-display text-4xl uppercase text-rusty-cream hover:text-rusty-orange"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GoToMenuPanelButton
            onClick={onClose}
            className="w-full border-2 border-rusty-orange bg-rusty-orange px-6 py-4 text-center font-display text-sm uppercase tracking-wider text-rusty-carbon transition hover:bg-rusty-orangeBright"
          >
            PEDÍ AHORA
          </GoToMenuPanelButton>
        </motion.div>
      </nav>
      <p className="relative px-6 pb-10 font-display text-xs uppercase tracking-[0.3em] text-rusty-cream/30">
        FEAST MODE ON · ZERO REGRETS
      </p>
    </motion.div>
  );
}
