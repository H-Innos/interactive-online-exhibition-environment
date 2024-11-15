"use client";

import { useState, useEffect } from "react";

const useResponsiveVisibleDrafts = () => {
  const [visibleDrafts, setVisibleDrafts] = useState(getInitialVisibleDrafts());

  useEffect(() => {
    const updateVisibleDrafts = () => {
      if (window.innerWidth < 768) setVisibleDrafts(1); // sm: 1 column
      else if (window.innerWidth < 1024) setVisibleDrafts(2); // md: 2 columns
      else if (window.innerWidth < 1280) setVisibleDrafts(3); // lg: 3 columns
      else if (window.innerWidth < 1536) setVisibleDrafts(3); // xl: 3 columns
      else setVisibleDrafts(4); // 2xl: 4 columns
    };

    window.addEventListener("resize", updateVisibleDrafts);
    updateVisibleDrafts();

    return () => window.removeEventListener("resize", updateVisibleDrafts);
  }, []);

  function getInitialVisibleDrafts() {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 768) return 1; // sm: 1 column
      if (window.innerWidth < 1024) return 2; // md: 2 columns
      if (window.innerWidth < 1280) return 3; // lg: 3 columns
      if (window.innerWidth < 1536) return 4; // xl: 3 columns
      return 4; // 2xl: 4 columns
    }
    return 4;
  }

  return visibleDrafts;
};

export default useResponsiveVisibleDrafts;

