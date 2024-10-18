"use client";

import Link from "next/link";

const Header = () => {
  return (
    <>
      <header className="w-full bg-background_dark text-text-dark relative overflow-hidden h-28">
        <div className="relative flex justify-between items-center h-full">
          {/* blue background with responsive width */}
          <div
            className="
              absolute inset-y-0 left-0
              w-3/5
              sm:w-1/2 
              lg:w-[32%] 
              bg-[#2C5696] 
              skew-x-[15deg] 
              origin-bottom-left 
              z-0 
              transition-all duration-300
            "
          ></div>

          <a href="/" className="relative z-10 flex items-center pl-8">
            <img
              src="/logos/UT_website_logo_white_est.svg"
              alt="UT Website Logo"
              className="h-[48px] w-auto"
            />
          </a>

          <div className="relative z-10 flex items-center pr-8 space-x-6">
            <button className="hover:text-primary-dark text-text-dark text-lg">ENG</button>
            <button className="hover:text-primary-dark text-text-dark text-lg">EST</button>
            <button className="bg-primary-dark text-white px-4 py-2 rounded hover:bg-primary-dark_hover">
              Log In
            </button>
          </div>
        </div>
      </header>

      <nav className="w-full bg-background text-text-dark overflow-hidden h-16 flex justify-center items-center space-x-32">
        <Link href="/">
          <span className="hover:text-primary-dark cursor-pointer text-text-dark text-lg hover:border-b-2 hover:border-[#2C5696]">
            Dashboard
          </span>
        </Link>
        <Link href="/exhibitions">
          <span className="hover:text-primary-dark cursor-pointer text-text-dark text-lg hover:border-b-2 hover:border-[#2C5696]">
            All Exhibitions
          </span>
        </Link>
        <Link href="/archive">
          <span className="hover:text-primary-dark cursor-pointer text-text-dark text-lg hover:border-b-2 hover:border-[#2C5696]">
            Archive
          </span>
        </Link>
      </nav>
    </>
  );
};

export default Header;
