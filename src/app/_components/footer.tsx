"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="relative w-full bg-white py-6 text-primary-dark">
      <div className="absolute inset-x-0 top-0 -z-10 h-10 bg-gradient-to-b from-gray-200 to-white"></div>
      <div
        className="absolute inset-x-0 -top-10 mx-auto flex h-36 w-36 items-center justify-center rounded-full border-white bg-white p-4"
        style={{ boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.05)" }}
      >
        <Image
          src="/logos/ut-blue.svg"
          alt={t("footer.logoAlt")}
          width={120}
          height={120}
          className="object-contain"
        />
      </div>
      <div className="container mx-auto mt-28 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="text-center md:pl-0 md:text-left">
          <h3 className="text-md mb-1 font-bold">{t("footer.contactTitle")}</h3>
          <p className="text-md">
            {t("footer.universityName")}
            <br />
            {t("footer.addressLine1")}
            <br />
            {t("footer.addressLine2")}
          </p>
          <p>
            <a href="mailto:library@ut.ee" className="text-md hover:underline">
              {t("footer.email")}
            </a>
          </p>
        </div>
        <div className="text-center">
          <div className="flex flex-col items-center">
            <Image
              src="/logos/pins.svg"
              alt={t("footer.mapPinAlt")}
              width={44}
              height={44}
            />
            <a
              href="https://virtualtour.ut.ee/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-xl hover:underline"
            >
              {t("footer.mapLink")}
            </a>
          </div>
        </div>
        <div></div>
      </div>
    </footer>
  );
};

export default Footer;
