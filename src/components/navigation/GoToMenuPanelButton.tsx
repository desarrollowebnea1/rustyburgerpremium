"use client";

import { useGoToHomeMenuPanel } from "@/hooks/useGoToHomeMenuPanel";

type GoToMenuPanelButtonProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

/** CTA público — panel MENU horizontal (nunca /menu vertical). */
export function GoToMenuPanelButton({
  children,
  className = "",
  onClick,
}: GoToMenuPanelButtonProps) {
  const goToMenuPanel = useGoToHomeMenuPanel();

  return (
    <button
      type="button"
      onClick={() => {
        onClick?.();
        goToMenuPanel();
      }}
      className={className}
    >
      {children}
    </button>
  );
}
