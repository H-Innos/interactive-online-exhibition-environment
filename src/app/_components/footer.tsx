"use client";

const Footer = () => {
  return (
    <footer className="w-full bg-background_dark text-text-dark py-4 mt-8">
      <div className="container mx-auto text-center">
        <p>© {new Date().getFullYear()} UTLib Näitused. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
