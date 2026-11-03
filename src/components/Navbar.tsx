"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiMenu } from "react-icons/fi";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
];

const blur = () => (document.activeElement as HTMLElement | null)?.blur();

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const handleLogout = async () => {
    blur();
    await logout();
    toast.success("You have been logged out");
    router.push("/");
  };

  const navItems = links.map((l) => (
    <li key={l.href}>
      <Link
        href={l.href}
        className={isActive(l.href) ? "font-semibold text-primary border-b-2 border-primary rounded-none" : ""}
      >
        {l.label}
      </Link>
    </li>
  ));

  return (
    <header className="sticky top-0 z-40 border-b border-base-300 bg-base-100/90 backdrop-blur">
      <div className="page-wrap navbar min-h-16 px-0">
        <div className="navbar-start">
          <div className="dropdown lg:hidden">
            <button tabIndex={0} className="btn btn-ghost btn-circle" aria-label="Open menu">
              <FiMenu className="text-xl" />
            </button>
            <ul
              tabIndex={0}
              onClick={blur}
              className="menu dropdown-content mt-3 w-56 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg"
            >
              {navItems}
            </ul>
          </div>
          <Logo />
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-1 px-1">{navItems}</ul>
        </div>

        <div className="navbar-end gap-2">
          <ThemeToggle />
          {loading ? (
            <div className="skeleton h-10 w-10 rounded-full" />
          ) : user ? (
            <div className="dropdown dropdown-end">
              <button tabIndex={0} className="avatar" aria-label="Open account menu" title={user.name}>
                <div className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-100">
                  {user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.image} alt={user.name} referrerPolicy="no-referrer" />
                  ) : (
                    <span className="grid h-full w-full place-items-center bg-primary text-primary-content font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </button>
              <ul
                tabIndex={0}
                onClick={blur}
                className="menu dropdown-content mt-3 w-60 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg"
              >
                <li className="menu-title px-3 py-2">
                  <span className="block font-semibold text-base-content">{user.name}</span>
                  <span className="block text-xs font-normal opacity-70">{user.email}</span>
                </li>
                <li><Link href="/dashboard">Dashboard</Link></li>
                <li><Link href="/add-studio">Add New Studio</Link></li>
                <li><Link href="/my-listings">My Studio Listings</Link></li>
                <li><Link href="/my-bookings">My Bookings</Link></li>
                <li><button onClick={handleLogout} className="text-error">Logout</button></li>
              </ul>
            </div>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost btn-sm sm:btn-md">Login</Link>
              <Link href="/register" className="btn btn-primary btn-sm sm:btn-md">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
