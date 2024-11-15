'use client';

import { useState, useEffect } from 'react';
import { Menu, X, LogIn } from 'lucide-react';
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import i18n from '~/i18n';

export default function SlideInMenu() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const changeLanguage = async (lng: string) => {
    try {
      await i18n.changeLanguage(lng);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  return (
    <>
      <Button
        variant="default"
        className="sticky top-8 right-4 z-50 text-2xl text-gray-600"
        onClick={() => setIsOpen(true)}>
        ☰        
        <span className="sr-only">{t('slideInMenu.openMenu')}</span>
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-[70vw] sm:w-[400px] bg-background p-6 overflow-y-auto transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">{t('slideInMenu.close')}</span>
        </Button>

        <h2 className="text-2xl font-bold mb-6">{t('slideInMenu.menu')}</h2>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('slideInMenu.email')}</Label>
            <Input id="email" type="email" placeholder="m@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t('slideInMenu.password')}</Label>
            <Input id="password" type="password" />
          </div>
          <Button className="w-full bg-primary-dark text-white">
            <LogIn className="mr-2 h-4 w-4" /> {t('slideInMenu.logIn')}
          </Button>
        </div>

        <div className="mt-8 space-y-2">
          <Link href="/" className="block border-t border-b border-gray-300 py-2">
            {t('allExhibitions')}
          </Link>
          <Link href="/dashboard" className="block border-gray-300">
            {t('dashboardNav')}
          </Link>
          <Link href="/archive" className="block border-t border-b border-gray-300 py-2">
            {t('archive')}
          </Link>
        </div>

        <div className="mt-8 w-full">
          <div className="flex space-x-4">
            <h3 className="text-lg font-semibold">{t('slideInMenu.language')}</h3>
            <div className="space-x-2">
              <button
                className={`hover:text-primary-dark text-text-dark text-lg ${i18n.language === 'en' ? 'font-bold' : ''}`}
                onClick={() => changeLanguage('en')}
              >
                ENG
              </button>
              <span className="text-text-dark">|</span>
              <button
                className={`hover:text-primary-dark text-text-dark text-lg ${i18n.language === 'est' ? 'font-bold' : ''}`}
                onClick={() => changeLanguage('est')}
              >
                EST
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}