"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();

  // States
  const [isGenreOpen, setIsGenreOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Role Checks
  const isAdmin = session?.user?.role === "admin";
  const isWriter = session?.user?.role === "writer";

  // Handle Scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const genres = ["FICTION", "NON_FICTION"];

  const formatGenre = (genre: string) => {
    return genre
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const getGenreSlug = (genre: string) => {
    return genre === "FICTION" ? "fiction" : "non-fiction";
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent ${
        scrolled || isMobileMenuOpen
          ? "bg-white/95 backdrop-blur-md border-gray-200 shadow-sm"
          : "bg-white/60 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* --- Left Side (Logo + Desktop Nav) --- */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link
              href="/"
              className="group flex items-center gap-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="text-2xl font-extrabold tracking-tighter bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
                AyoKitaNulis
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex gap-1 text-sm font-medium items-center text-gray-600">
              {/* ADMIN & WRITER LINKS */}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="mr-2 px-3 py-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 flex items-center gap-1 border border-red-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M10.362 1.093a.75.75 0 0 0-.724 0L2.523 5.018 10 9.143l7.477-4.125-7.115-3.925ZM1.25 5.75v6.5a.75.75 0 0 0 .375.65l7.75 4.5a.75.75 0 0 0 .75 0l7.75-4.5a.75.75 0 0 0 .375-.65v-6.5l-7.639 4.215a.75.75 0 0 1-.722 0L1.25 5.75Z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">Admin</span>
                </Link>
              )}

              {isWriter && (
                <Link
                  href="/user"
                  className="mr-2 px-3 py-2 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all duration-200 flex items-center gap-1 border border-indigo-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                  </svg>
                  <span className="font-semibold">Studio</span>
                </Link>
              )}

              <NavLink href="/">Home</NavLink>
              <NavLink href="/authors">Authors</NavLink>
              <NavLink href="/explore">Explore</NavLink> {/* ← NEW: Explore Link */}

              {/* Desktop Genre Dropdown */}
              <div className="relative group">
                <button
                  onClick={() => setIsGenreOpen(!isGenreOpen)}
                  onBlur={() => setTimeout(() => setIsGenreOpen(false), 200)}
                  className="flex items-center gap-1 px-3 py-2 rounded-full hover:bg-gray-100 transition-all focus:outline-none hover:text-blue-600"
                >
                  Genre
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isGenreOpen ? "rotate-180 text-blue-600" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div
                  className={`absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl ring-1 ring-black ring-opacity-5 overflow-hidden transform transition-all duration-200 origin-top-left ${
                    isGenreOpen
                      ? "opacity-100 scale-100 translate-y-0"
                      : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                  }`}
                >
                  <div className="py-2 max-h-96 overflow-y-auto">
                    {genres.map((genre) => (
                      <Link
                        key={genre}
                        href={`/genres/${getGenreSlug(genre)}`}
                        className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        onClick={() => setIsGenreOpen(false)}
                      >
                        {formatGenre(genre)}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- Right Side (Search + Auth + Mobile Toggle) --- */}
          <div className="flex items-center gap-4">
            {/* Desktop Search */}
            <form action="/search" className="relative hidden md:block group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                name="q"
                placeholder="Search books..."
                className="pl-10 pr-4 py-2 w-64 bg-gray-100 text-gray-900 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all border border-transparent focus:border-blue-500/50"
              />
            </form>

            <div className="h-6 w-px bg-gray-200 hidden md:block"></div>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center">
              {session ? (
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-semibold text-gray-700 leading-none">{session.user?.name}</span>
                    <span className="text-[10px] text-gray-400 leading-none mt-1 capitalize">{session.user?.role}</span>
                  </div>
                  <button onClick={() => signOut({ callbackUrl: "/" })} className="p-2 rounded-full text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all" title="Sign Out">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                    </svg>
                  </button>
                </div>
              ) : (
                <Link href="/login" className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-all hover:shadow-lg hover:shadow-gray-900/20">
                  <span>Sign In</span>
                </Link>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg max-h-[90vh] overflow-y-auto">
          <div className="px-4 pt-4 pb-6 space-y-3">
            <form action="/search" className="relative mb-6">
              <input
                type="text"
                name="q"
                placeholder="Search books..."
                className="w-full pl-4 pr-4 py-3 bg-gray-50 text-gray-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 border border-gray-200"
              />
            </form>

            <div className="flex flex-col space-y-2">
              {isAdmin && (
                <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl bg-red-50 text-red-600 font-semibold flex items-center gap-2">
                  Admin Dashboard
                </Link>
              )}

              {isWriter && (
                <Link href="/user" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl bg-indigo-50 text-indigo-600 font-semibold flex items-center gap-2">
                  Writer Studio
                </Link>
              )}

              <MobileNavLink href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</MobileNavLink>
              <MobileNavLink href="/authors" onClick={() => setIsMobileMenuOpen(false)}>Authors</MobileNavLink>
              <MobileNavLink href="/explore" onClick={() => setIsMobileMenuOpen(false)}>Explore</MobileNavLink> {/* ← NEW in mobile */}

              {/* Mobile Genre Accordion */}
              <div className="border-t border-gray-100 pt-2 mt-2">
                <button
                  onClick={() => setIsGenreOpen(!isGenreOpen)}
                  className="flex items-center justify-between w-full px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-xl"
                >
                  <span>Browse Genres</span>
                  <svg className={`w-4 h-4 transition-transform ${isGenreOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isGenreOpen && (
                  <div className="pl-4 space-y-1 mt-1">
                    {genres.map((genre) => (
                      <Link
                        key={genre}
                        href={`/genres/${getGenreSlug(genre)}`}
                        onClick={() => {
                          setIsGenreOpen(false);
                          setIsMobileMenuOpen(false);
                        }}
                        className="block px-4 py-2 text-sm text-gray-500 hover:text-blue-600 border-l-2 border-transparent hover:border-blue-600"
                      >
                        {formatGenre(genre)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Auth */}
            <div className="border-t border-gray-100 pt-4 mt-4">
              {session ? (
                <div className="flex items-center justify-between px-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">{session.user?.name}</span>
                    <span className="text-xs text-gray-500 capitalize">{session.user?.role}</span>
                  </div>
                  <button onClick={() => signOut({ callbackUrl: "/" })} className="px-4 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center px-4 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    className="px-3 py-2 rounded-full hover:bg-gray-100 hover:text-blue-600 transition-all duration-200"
  >
    {children}
  </Link>
);

const MobileNavLink = ({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    onClick={onClick}
    className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
  >
    {children}
  </Link>
);

export default Navbar;