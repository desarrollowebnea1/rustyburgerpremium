import { SiteNavbar } from "./SiteNavbar";
import { SiteFooter } from "./SiteFooter";
import { RustyFooter } from "./RustyFooter";
import { HomeHorizontalNav } from "@/components/home/HomeHorizontalNav";

type PageShellProps = {
  children: React.ReactNode;
  footer?: "default" | "rusty";
  /** Home vertical — navbar + footer premium, sin barra inferior flotante */
  verticalHome?: boolean;
};

export function PageShell({
  children,
  footer = "default",
  verticalHome = false,
}: PageShellProps) {
  return (
    <>
      <SiteNavbar />
      <main className="min-h-screen overflow-x-hidden">{children}</main>
      {verticalHome ? (
        <RustyFooter />
      ) : footer === "rusty" ? (
        <RustyFooter />
      ) : (
        <SiteFooter />
      )}
      {!verticalHome && <HomeHorizontalNav />}
    </>
  );
}
