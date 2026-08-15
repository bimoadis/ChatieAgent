import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer wrap">
      <div className="foot">
        <span>Chatie Agent © 2026</span>
        <Link href="#top">Docs</Link>
        <Link href="#top">Pricing</Link>
        <Link href="#top">Changelog</Link>
        <Link href="#top">Privacy</Link>
        <span className="sp mono" style={{ fontSize: "11px" }}>
          EDUCATIONAL USE ONLY
        </span>
      </div>
    </footer>
  );
}
