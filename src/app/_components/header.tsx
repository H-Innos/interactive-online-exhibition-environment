"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import SlideInMenu from "~/components/slide-in-menu";

const Header = () => {
  const [isMenuOpen] = useState(false);

  return (
    <>
      <header className="w-full bg-background_dark text-text-dark relative overflow-hidden h-28">
        <div className="relative flex justify-between items-center h-full px-4 sm:px-8">
          <div
            className="
              absolute inset-y-0 left-0
              w-4/5
              sm:w-1/2 
              lg:w-[32%] 
              bg-[#2C5696] 
              skew-x-[15deg] 
              origin-bottom-left 
              z-0 
              transition-all duration-300
            "
          ></div>

          <a href="/" className="relative z-10 flex items-center pl-4 sm:pl-8">
            <Image
              src="/logos/UT_website_logo_white_est.svg"
              alt="Logo"
              width={248}
              height={48}
            />
          </a>

          <div className="relative z-10 flex items-center space-x-4 sm:space-x-6">
            <button className="hover:text-primary-dark text-text-dark text-lg hidden sm:block">ENG</button>
            <button className="hover:text-primary-dark text-text-dark text-lg hidden sm:block">EST</button>
            <div className="block sm:hidden"> 
              <SlideInMenu />
            </div>
            <button className="bg-primary-dark text-white px-4 py-2 rounded hover:bg-primary-dark_hover hidden sm:block">
              Log In
            </button>
          </div>
        </div>
      </header>

      <nav className={`w-full bg-background text-text-dark overflow-hidden ${isMenuOpen ? 'block' : 'hidden'} mt-4 sm:flex justify-center items-center space-x-0 sm:space-x-32`}>
        <Link href="/">
          <span className="relative cursor-pointer text-text-dark text-lg block sm:inline-block group">
            All exhibitions
            <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#2C5696] scale-x-0 transition-transform duration-300 ease-in-out group-hover:scale-x-100"></span>
          </span>
        </Link>
        <Link href="/admin/dashboard">
          <span className="relative cursor-pointer text-text-dark text-lg block sm:inline-block group">
            Dashboard
            <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#2C5696] scale-x-0 transition-transform duration-300 ease-in-out group-hover:scale-x-100"></span>
          </span>
        </Link>
        <Link href="/admin/archive">
          <span className="relative cursor-pointer text-text-dark text-lg block sm:inline-block group">
            Archive
            <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#2C5696] scale-x-0 transition-transform duration-300 ease-in-out group-hover:scale-x-100"></span>
          </span>
        </Link>
      </nav>


    </>
  );
};

export default Header;