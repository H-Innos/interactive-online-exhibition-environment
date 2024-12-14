"use client";

const Footer = () => {
  return (
    <footer className="w-full bg-secondary py-4 text-text-dark">
      <div className="container mx-auto text-center">
        <p>
          © {new Date().getFullYear()} UTLib Näitused. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
