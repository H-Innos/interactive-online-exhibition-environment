"use client";

import Image from "next/image";

const Footer = () => {
  return (
    <footer className="relative w-full bg-white py-6 text-primary-dark">
      <div className="absolute inset-x-0 top-0 -z-10 h-10 bg-gradient-to-b from-gray-200 to-white"></div>
      <div
        className="absolute inset-x-0 -top-10 mx-auto flex h-36 w-36 items-center justify-center rounded-full border-white bg-white p-4"
        style={{ boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.05)" }}
      >
        <Image
          src="/logos/ut-blue.svg"
          alt="Footer Logo"
          width={120}
          height={120}
          className="object-contain"
        />
      </div>
      <div className="container mx-auto mt-28 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="text-center md:pl-0 md:text-left">
          <h3 className="mb-1 text-base font-bold">Contact Information</h3>
          <p className="text-sm">
            University of Tartu Library
            <br />
            W. Struve 1
            <br />
            50091 Tartu, EST
          </p>
          <p>
            <a href="mailto:library@ut.ee" className="text-sm hover:underline">
              library@ut.ee
            </a>
          </p>
        </div>
        <div className="text-center">
          <div className="flex flex-col items-center">
            <Image
              src="/logos/pins.svg"
              alt="Map Pin"
              width={30}
              height={30}
              className="mb-1"
            />
            <a
              href="https://virtualtour.ut.ee/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-bold hover:underline"
            >
              Map of UT Buildings
            </a>
          </div>
        </div>
        <div></div>
      </div>
    </footer>
  );
};

export default Footer;
