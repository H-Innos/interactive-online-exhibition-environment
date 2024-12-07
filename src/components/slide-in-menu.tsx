"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import i18n from "~/i18n";
import { useSession } from "~/lib/contexts/SessionProvider";
import { LoginForm } from "./log-in-dropdown";
import { logout } from "~/server/auth/actions";

export default function SlideInMenu() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const changeLanguage = async (lng: string) => {
    try {
      await i18n.changeLanguage(lng);
    } catch (error) {
      console.error("Error changing language:", error);
    }
  };

  const { session } = useSession();

  return (
    <>
      <Button
        variant="ghost"
        className="sticky right-4 top-8 z-10 text-2xl text-gray-600"
        onClick={() => setIsOpen(true)}
      >
        ☰<span className="sr-only">{t("slideInMenu.openMenu")}</span>
      </Button>

      {isOpen && (
        <div
          className="z-9 fixed inset-0 bg-black bg-opacity-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed right-0 top-0 z-[1000] h-full w-[70vw] overflow-y-auto bg-background p-6 transition-transform duration-300 ease-in-out sm:w-[400px] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 z-10"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">{t("slideInMenu.close")}</span>
        </Button>

        <h2 className="mb-6 text-2xl font-bold">{t("slideInMenu.menu")}</h2>

        {session ? (
          <Button
            onClick={async () => await logout()}
            className="flex sm:hidden"
          >
            {" "}
            {t("logout")}
          </Button>
        ) : (
          <LoginForm onSubmit={() => setIsOpen(false)} />
        )}

        <div className="mt-8 space-y-2">
          <Link
            href="/"
            className="block border-b border-t border-gray-300 py-2"
          >
            {t("allExhibitions")}
          </Link>
          {!!session && (
            <>
              <Link href="/dashboard" className="block border-gray-300">
                {t("dashboardNav")}
              </Link>
              <Link
                href="/dashboard/archive"
                className="block border-b border-t border-gray-300 py-2"
              >
                {t("archive.title")}
              </Link>
            </>
          )}
        </div>

        <div className="mt-8 w-full">
          <div className="flex space-x-4">
            <h3 className="text-lg font-semibold">
              {t("slideInMenu.language")}
            </h3>
            <div className="space-x-2">
              <button
                className={`text-lg text-text-dark hover:text-primary-dark ${i18n.language === "en" ? "font-bold" : ""}`}
                onClick={() => changeLanguage("en")}
              >
                ENG
              </button>
              <span className="text-text-dark">|</span>
              <button
                className={`text-lg text-text-dark hover:text-primary-dark ${i18n.language === "est" ? "font-bold" : ""}`}
                onClick={() => changeLanguage("est")}
              >
                EST
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
