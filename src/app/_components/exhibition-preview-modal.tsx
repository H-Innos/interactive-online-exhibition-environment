import React, { useEffect, useRef } from 'react';
import { Exhibition } from '~/lib/types/entities';
import { useTranslation } from 'react-i18next';

interface ExhibitionPreviewModalProps {
  exhibition: Exhibition;
  onClose: () => void;
}

const ExhibitionPreviewModal: React.FC<ExhibitionPreviewModalProps> = ({ exhibition, onClose }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const handleIframeLoad = () => {
      if (iframeRef.current && iframeRef.current.contentDocument) {
        const doc = iframeRef.current.contentDocument;

        const previewBanner = doc.createElement('div');
        previewBanner.id = 'preview-banner';
        previewBanner.innerHTML = t('preview');
        previewBanner.style.cssText = `
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background-color: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 10px 20px;
          font-size: 24px;
          font-weight: bold;
          border-radius: 5px;
          z-index: 1000;
        `;
        doc.body.appendChild(previewBanner);

        const backButton = doc.createElement('button');
        backButton.innerHTML = t('backToEditor');
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
        backButton.onclick = (e) => {
          e.preventDefault();
          onClose();
        };
        doc.body.appendChild(backButton);

        const allLinks = doc.getElementsByTagName('a');
        const allButtons = doc.getElementsByTagName('button');
        
        const disableElement = (el: HTMLElement) => {
          if (el !== backButton) {
            el.style.pointerEvents = 'none';
            el.style.opacity = '0.5';
            el.onclick = (e) => e.preventDefault();
          }
        };

        for (let i = 0; i < allLinks.length; i++) disableElement(allLinks[i]);
        for (let i = 0; i < allButtons.length; i++) disableElement(allButtons[i]);

        doc.addEventListener('submit', (e) => e.preventDefault());
      }
    };

    if (iframeRef.current) {
      iframeRef.current.addEventListener('load', handleIframeLoad);
    }

    return () => {
      if (iframeRef.current) {
        iframeRef.current.removeEventListener('load', handleIframeLoad);
      }
    };
  }, [onClose, t]);

  useEffect(() => {
    const updatePreviewText = () => {
      if (iframeRef.current && iframeRef.current.contentDocument) {
        const doc = iframeRef.current.contentDocument;
        const previewBanner = doc.getElementById('preview-banner');
        if (previewBanner) {
          previewBanner.innerHTML = t('preview');
        }
        const backButton = doc.querySelector('button');
        if (backButton) {
          backButton.innerHTML = t('backToEditor');
        }
      }
    };

    updatePreviewText();
  }, [i18n.language, t]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-[95%] h-[95%] bg-white p-4 rounded-lg shadow-lg relative">
        <iframe
          ref={iframeRef}
          src={`/${exhibition.id}`}
          className="w-full h-full border-2 border-gray-300 rounded-md"
          title="Exhibition Preview"
        />
      </div>
    </div>
  );
};

export default ExhibitionPreviewModal;