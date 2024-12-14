"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import SlideInMenu from "~/components/slide-in-menu";
import { useTranslation } from "react-i18next";
import i18n from "~/i18n";
import { Button } from "~/components/ui/button";
import { logout } from "~/server/auth/actions";
import LoginDropdown from "~/components/log-in-dropdown";
import { useSession } from "~/lib/contexts/SessionProvider";

const Header = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const changeLanguage = async (lng: string | undefined) => {
    try {
      await i18n.changeLanguage(lng);
      localStorage.setItem("language", lng ?? "en");
    } catch (error) {
      console.error("Error changing language:", error);
    }
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      void i18n.changeLanguage(savedLanguage).catch((error) => {
        console.error("Error setting saved language:", error);
      });
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const { session } = useSession();

  return (
    <>
      <header className="relative h-28 w-full overflow-hidden bg-secondary text-text-dark">
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

            {session ? (
              <Button
                onClick={async () => await logout()}
                className="hidden sm:block"
              >
                {" "}
                {t("logout")}
              </Button>
            ) : (
              <LoginDropdown />
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
