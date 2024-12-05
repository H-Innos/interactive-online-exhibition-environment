import { Link } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

function NavBar() {
  const { t } = useTranslation();
  return (
    <nav className="mt-4 hidden w-full items-center justify-center space-x-0 overflow-hidden bg-background text-text-dark sm:block sm:flex sm:space-x-32">
      <Link href="/">
        <span className="group relative block cursor-pointer text-lg text-text-dark sm:inline-block">
          {t("allExhibitions")}
          <span className="absolute bottom-0 left-0 h-[2px] w-full scale-x-0 bg-[#2C5696] transition-transform duration-300 ease-in-out group-hover:scale-x-100"></span>
        </span>
      </Link>
      {/* <Link href="/dashboard">
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
      </Link> */}
    </nav>
  );
}

export default NavBar;
