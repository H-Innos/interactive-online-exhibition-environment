"use client";

import Link from "next/link";

const Header = () => {
  return (
    <header className="w-full bg-background text-text-dark shadow relative overflow-hidden h-24">
      <div className="absolute inset-y-0 left-0 bg-[#2C5696] skew-x-[15deg] origin-bottom-left h-full w-[20%] z-0 px-8"></div>
      <div className="relative z-10 flex justify-between items-center pr-8 py-0 h-full">
        <div className="flex items-center h-full">
          <div className="relative w-56 h-full overflow-hidden ml-8"> 
            {/* logo skew effect container */}
            <div className="absolute inset-y-0 left-0 bg-[#2C5696] skew-x-[15deg] origin-bottom-left h-full w-full pl-10 z-0"></div>
            <a href="/" className="relative z-10 flex items-center h-full pl-10">
            <img
              src="/logos/UT_website_logo_white_est.svg"
              alt="UT Website Logo"
              className="h-32 w-auto"
            />
            </a>
          </div>
        </div>

        {/* navigation links */}
        <nav className="flex-grow flex justify-center space-x-6 ml-16 h-full items-center">
          <Link href="/">
            <span className="hover:text-primary-dark cursor-pointer text-text-dark">Dashboard</span>
          </Link>
          <Link href="/exhibitions">
            <span className="hover:text-primary-dark cursor-pointer text-text-dark">All Exhibitions</span>
          </Link>
          <Link href="/archive">
            <span className="hover:text-primary-dark cursor-pointer text-text-dark">Archive</span>
          </Link>
        </nav>

        {/* language options and login button */}
        <div className="flex items-center space-x-4 h-full">
          <button className="hover:text-primary-dark text-text-dark">ENG</button>
          <button className="hover:text-primary-dark text-text-dark">EST</button>
          <button className="bg-primary-dark text-white px-4 py-2 rounded hover:bg-primary-dark_hover">
            Log In
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
