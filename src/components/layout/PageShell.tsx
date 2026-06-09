import { HomeFloatingNav } from "@/components/home/HomeFloatingNav";
import { HomeHorizontalNav } from "@/components/home/HomeHorizontalNav";
import { SiteNavbar } from "./SiteNavbar";
import { SiteFooter } from "./SiteFooter";
import { RustyFooter } from "./RustyFooter";

type PageShellProps = {
  children: React.ReactNode;
  footer?: "default" | "rusty";
  /** Home responsive: horizontal lg+ / vertical mobile */
  responsiveHome?: boolean;
};

export function PageShell({
  children,
  footer = "default",
  responsiveHome = false,
}: PageShellProps) {
  if (responsiveHome) {
    return (
      <>
        <div className="hidden lg:block">
          <HomeFloatingNav />
        </div>
        <div className="lg:hidden">
          <SiteNavbar />
        </div>
        <main className="overflow-x-hidden">{children}</main>
        <div className="lg:hidden">
          <RustyFooter />
        </div>
        <div className="hidden lg:block">
          <HomeHorizontalNav />
        </div>
      </>
    );
  }

  return (
    <>
      <SiteNavbar />
      <main className="min-h-screen overflow-x-hidden">{children}</main>
      {footer === "rusty" ? <RustyFooter /> : <SiteFooter />}
      <HomeHorizontalNav />
    </>
  );
}
