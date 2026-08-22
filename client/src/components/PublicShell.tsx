import { Link, useLocation } from "wouter";
import { Leaf, MapPinned, ScanLine, Sprout } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Locale } from "@/lib/i18n";

export default function PublicShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { locale, setLocale, t } = useLanguage();
  const links = [
    { href: "/", label: t("nav.scan"), icon: ScanLine },
    { href: "/history", label: t("nav.archive"), icon: Sprout },
    { href: "/map", label: t("nav.map"), icon: MapPinned },
  ];
  return (
    <div className="public-shell" dir={locale === "ar" ? "rtl" : "ltr"}>
      <header className="field-nav">
        <Link href="/" className="field-brand"><span className="brand-mark"><Leaf size={17} /></span><span>CropGuide</span><em>{t("home.eyebrow")}</em></Link>
        <nav aria-label="Main navigation">
          {links.map(link => {
            const Icon = link.icon;
            return <Link key={link.href} href={link.href} className={location === link.href ? "active" : ""}><Icon size={15} /><span>{link.label}</span></Link>;
          })}
        </nav>
        <div className="nav-tools">
          <label className="sr-only" htmlFor="cropguide-language">{t("nav.language")}</label>
          <select id="cropguide-language" className="language-picker" value={locale} onChange={event => setLocale(event.target.value as Locale)}>
            <option value="en">EN</option>
            <option value="fr">FR</option>
            <option value="ar">العربية</option>
          </select>
          <span className="local-note">{t("nav.local")}</span>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
