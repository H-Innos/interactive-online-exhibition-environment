"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import SlideInMenu from "~/components/slide-in-menu";
import { useTranslation } from "react-i18next";
import i18n from "~/i18n";
import { usePathname } from "next/navigation";

const Header = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const idPathRegex = /\d+$/;
  const dashboardPathRegex = /\/dashboard(\/|$)/;
  const isNoHeaderPath =
    idPathRegex.exec(pathname) !== null ||
    dashboardPathRegex.exec(pathname) !== null;

  const changeLanguage = async (lng: string | undefined) => {
    try {
      await i18n.changeLanguage(lng);
    } catch (error) {
      console.error("Error changing language:", error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className="relative h-28 w-full overflow-hidden bg-background_dark text-text-dark">
        <div className="relative flex h-full items-center justify-between px-4 sm:px-8">
          <div className="absolute inset-y-0 left-0 z-0 w-4/5 origin-bottom-left skew-x-[15deg] bg-[#2C5696] transition-all duration-300 sm:w-1/2 lg:w-[32%]"></div>

          <a href="/" className="relative z-10 flex items-center pl-4 sm:pl-8">
            <Image
              src="/logos/UT_website_logo_white_est.svg"
              alt="Logo"
              width={248}
              height={48}
            />
          </a>

          <div className="relative z-10 flex items-center space-x-4 sm:space-x-6">
            <button
              onClick={() => changeLanguage("en")}
              className={`hidden text-lg text-text-dark hover:text-primary-dark sm:block ${i18n.language === "en" ? "font-bold" : ""}`}
            >
              ENG
            </button>
            <button
              onClick={() => changeLanguage("est")}
              className={`hidden text-lg text-text-dark hover:text-primary-dark sm:block ${i18n.language === "est" ? "font-bold" : ""}`}
            >
              EST
            </button>

            <div className="block sm:hidden">
              <div
                onClick={toggleMenu}
                className="cursor-pointer text-text-dark"
              >
                <SlideInMenu />
              </div>
            </div>

            <button className="hidden rounded bg-primary-dark px-4 py-2 text-white hover:bg-primary-dark_hover sm:block">
              {t("login")}
            </button>
          </div>
        </div>
      </header>

      {!isMenuOpen && !isNoHeaderPath && (
        <nav className="mt-4 hidden w-full items-center justify-center space-x-0 overflow-hidden bg-background text-text-dark sm:flex sm:space-x-32">
          <Link href="/">
            <span className="group relative block cursor-pointer text-lg text-text-dark sm:inline-block">
              {t("allExhibitions")}
              <span className="absolute bottom-0 left-0 h-[2px] w-full scale-x-0 bg-[#2C5696] transition-transform duration-300 ease-in-out group-hover:scale-x-100"></span>
            </span>
          </Link>
          <Link href="/dashboard">
            <span className="group relative block cursor-pointer text-lg text-text-dark sm:inline-block">
              {t("dashboardNav")}
              <span className="absolute bottom-0 left-0 h-[2px] w-full scale-x-0 bg-[#2C5696] transition-transform duration-300 ease-in-out group-hover:scale-x-100"></span>
            </span>
          </Link>
          <Link href="/dashboard/archive">
            <span className="group relative block cursor-pointer text-lg text-text-dark sm:inline-block">
              {t("archive.title")}
              <span className="absolute bottom-0 left-0 h-[2px] w-full scale-x-0 bg-[#2C5696] transition-transform duration-300 ease-in-out group-hover:scale-x-100"></span>
            </span>
          </Link>
        </nav>
      )}
    </>
  );
};

export default Header;
