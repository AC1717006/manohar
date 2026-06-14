"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearAdminToken } from "@/lib/adminAuth";

const LINKS = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/customers", label: "Customers" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    clearAdminToken();
    router.push("/admin/login");
  }

  return (
    <aside className="flex w-full flex-col border-r border-gold/15 bg-royal-charcoal p-4 sm:w-56">
      <div className="mb-6 px-2">
        <p className="font-serif text-lg text-gradient-gold">Admin Panel</p>
        <p className="text-xs text-gold-light/50">Surendra Sa Rajputi Fashion</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              pathname?.startsWith(link.href)
                ? "bg-gold/10 text-gold"
                : "text-gold-light/70 hover:bg-gold/5 hover:text-gold"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <button
        onClick={handleLogout}
        className="mt-4 rounded-lg border border-gold/20 px-3 py-2 text-sm text-gold-light/70 transition-colors hover:border-gold/50 hover:text-gold"
      >
        Logout
      </button>
    </aside>
  );
}
