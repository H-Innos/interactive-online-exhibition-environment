"use client";

import Link from "next/link";

const Header = () => {
  return (
    <header className="w-full bg-background text-text-dark shadow">
      <div className="flex justify-between items-center px-4 py-4">
        {/* Left Section: Logo and Text */}
        <div className="flex items-center">
          <img
            src="/logos/tartu_logo.png"
            alt="Logo"
            className="h-16 w-16" // Adjusted size of the logo
          />
          <span className="ml-3 text-2xl font-semibold text-primary-dark">
            UTLib Näitused
          </span>
        </div>

        {/* Center Section: Navigation Links */}
        <nav className="flex-grow flex justify-center space-x-6 ml-16">
          <Link href="/">
            <span className="hover:text-primary-dark cursor-pointer">Dashboard</span>
          </Link>
          <Link href="/exhibitions">
            <span className="hover:text-primary-dark cursor-pointer">All Exhibitions</span>
          </Link>
          <Link href="/archive">
            <span className="hover:text-primary-dark cursor-pointer">Archive</span>
          </Link>
        </nav>

        {/* Right Section: Language Options and Login Button */}
        <div className="flex items-center space-x-4">
          <button className="hover:text-primary-dark">ENG</button>
          <button className="hover:text-primary-dark">EST</button>
          <button className="bg-primary-dark text-white px-4 py-2 rounded hover:bg-primary">
            Log In
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
