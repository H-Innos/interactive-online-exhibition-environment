import React, { useEffect, useRef } from "react";
import type { Exhibition } from "~/lib/types/entities";
import { useTranslation } from "react-i18next";

interface ExhibitionPreviewModalProps {
  exhibition: Exhibition;
  onClose: () => void;
}

const ExhibitionPreviewModal: React.FC<ExhibitionPreviewModalProps> = ({
  exhibition,
  onClose,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const handleIframeLoad = () => {
      const doc = iframeRef.current?.contentDocument;
      if (doc) {
        const disableInteractions = () => {
          const style = doc.createElement("style");
          style.innerHTML = `
            * {
              pointer-events: none !important;
            }
            #back-button {
              pointer-events: auto !important;
            }
          `;
          doc.head.appendChild(style);
        };

        const backButton = doc.createElement("button");
        backButton.id = "back-button";
        backButton.innerHTML = t("backToEditor");
        backButton.style.cssText = `
          position: fixed;
          top: 20px;
          left: 20px;
          background-color: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 10px 15px;
          font-size: 16px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          z-index: 1000;
        `;
        backButton.onclick = (e: MouseEvent) => {
          e.preventDefault();
          onClose();
        };
        doc.body.appendChild(backButton);

        disableInteractions();
      }
    };

    const iframe = iframeRef.current;
    iframe?.addEventListener("load", handleIframeLoad);

    return () => {
      iframe?.removeEventListener("load", handleIframeLoad);
    };
  }, [onClose, t]);

  useEffect(() => {
    const updatePreviewText = () => {
      const doc = iframeRef.current?.contentDocument;
      if (doc) {
        const previewBanner = doc.getElementById("preview-banner");
        if (previewBanner) {
          previewBanner.innerHTML = t("preview");
        }
        const backButton = doc.getElementById("back-button");
        if (backButton) {
          backButton.innerHTML = t("backToEditor");
        }
      }
    };

    updatePreviewText();
  }, [i18n.language, t]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative h-[95%] w-[95%] rounded-lg bg-white p-4 shadow-lg">
        <iframe
          ref={iframeRef}
          src={`/${exhibition.id}`}
          className="h-full w-full rounded-md border-2 border-gray-300"
          title="Exhibition Preview"
        />
      </div>
    </div>
  );
};

export default ExhibitionPreviewModal;
