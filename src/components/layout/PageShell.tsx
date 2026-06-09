import { HomeFloatingNav } from "@/components/home/HomeFloatingNav";
import { HomeHorizontalNav } from "@/components/home/HomeHorizontalNav";
import { SiteNavbar } from "./SiteNavbar";
import { SiteFooter } from "./SiteFooter";
import { RustyFooter } from "./RustyFooter";

type PageShellProps = {
  children: React.ReactNode;
  footer?: "default" | "rusty";
  /** Home canvas horizontal — sin footer vertical */
  horizontalHome?: boolean;
};

export function PageShell({
  children,
  footer = "default",
  horizontalHome = false,
}: PageShellProps) {
  return (
    <>
      {horizontalHome ? <HomeFloatingNav /> : <SiteNavbar />}
      <main
        className={
          horizontalHome
            ? "overflow-x-hidden"
            : "min-h-screen overflow-x-hidden"
        }
      >
        {children}
      </main>
      {!horizontalHome && (footer === "rusty" ? <RustyFooter /> : <SiteFooter />)}
      <HomeHorizontalNav />
    </>
  );
}
