"use client";

import Link from "next/link";

const Header = () => {
  return (
    <>
      <header className="w-full bg-background_dark text-text-dark relative overflow-hidden h-28">
        <div className="absolute inset-y-0 left-0 bg-[#2C5696] skew-x-[15deg] origin-bottom-left h-full w-[32%] z-0 px-4"></div>
        <div className="relative z-10 flex justify-between items-center pr-8 py-0 h-full">
          <div className="flex items-center h-full">
            {/* logo skew effect container */}
            <a href="/" className="relative z-10 flex items-center h-full pl-32"> {/* Increased left padding from pl-10 to pl-20 */}
              <img
                src="/logos/UT_website_logo_white_est.svg"
                alt="UT Website Logo"
                className="h-[48px] w-auto"
              />
            </a>
          </div>

          {/* language options and login button */}
          <div className="flex items-center space-x-10 h-full">
            <button className="hover:text-primary-dark text-text-dark text-l">ENG</button>
            <button className="hover:text-primary-dark text-text-dark text-l">EST</button>
            <button className="bg-primary-dark text-white px-4 py-2 rounded hover:bg-primary-dark_hover">
              Log In
            </button>
          </div>
        </div>
      </header>

      {/* Navigation links below the header */}
      <nav className="w-full bg-background text-text-dark overflow-hidden h-16 flex justify-center items-center space-x-32">
        <Link href="/">
          <span className="hover:text-primary-dark cursor-pointer text-text-dark text-l hover:border-b-2 hover:border-[#2C5696]">
            Dashboard
          </span>
        </Link>
        <Link href="/exhibitions">
          <span className="hover:text-primary-dark cursor-pointer text-text-dark text-l hover:border-b-2 hover:border-[#2C5696]">
            All Exhibitions
          </span>
        </Link>
        <Link href="/archive">
          <span className="hover:text-primary-dark cursor-pointer text-text-dark text-l hover:border-b-2 hover:border-[#2C5696]">
            Archive
          </span>
        </Link>
      </nav>
    </>
  );
};

export default Header;
