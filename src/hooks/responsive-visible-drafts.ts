"use client";

import { useState, useEffect } from "react";

const useResponsiveVisibleDrafts = () => {
  const [visibleDrafts, setVisibleDrafts] = useState(getInitialVisibleDrafts());

  useEffect(() => {
    const updateVisibleDrafts = () => {
      if (window.innerWidth < 768) setVisibleDrafts(1);
      else if (window.innerWidth < 1200) setVisibleDrafts(2);
      else if (window.innerWidth < 1536) setVisibleDrafts(3);
      else setVisibleDrafts(4);
    };

    window.addEventListener("resize", updateVisibleDrafts);
    updateVisibleDrafts();

    return () => window.removeEventListener("resize", updateVisibleDrafts);
  }, []);

  function getInitialVisibleDrafts() {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 768) return 1;
      if (window.innerWidth < 1200) return 2;
      if (window.innerWidth < 1536) return 3;
      return 4;
    }
    return 4;
  }

  return visibleDrafts;
};

export default useResponsiveVisibleDrafts;
