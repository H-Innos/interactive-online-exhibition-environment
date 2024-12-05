import React from "react";
import i18n from "~/i18n";

const LanguageOptions = () => {
  const changeLanguage = async (lng: string | undefined) => {
    try {
      await i18n.changeLanguage(lng);
    } catch (error) {
      console.error("Error changing language:", error);
    }
  };

  return (
    <>
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
    </>
  );
};

export default LanguageOptions;
