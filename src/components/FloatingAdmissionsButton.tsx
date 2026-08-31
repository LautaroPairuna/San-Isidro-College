'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ADMISSIONS_FORM_URL } from '@/lib/siteConfig';

export default function FloatingAdmissionsButton() {
  const t = useTranslations('home');

  return (
    <Link
      href={ADMISSIONS_FORM_URL}
      target="_blank"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#1e804b] text-white rounded-full shadow-lg hover:bg-[#166038] transition-all duration-300 hover:scale-105 group"
    >
      <div className="relative w-8 h-8">
        <img src="/images/ico-admisiones.svg" alt={t('hero.admisionButton')} className="absolute inset-0 h-full w-full object-contain" />
      </div>
      <span className="font-medium hidden sm:inline-block">
        {t('hero.admisionButton')}
      </span>
      <span className="font-medium sm:hidden">
        Admisiones
      </span>
    </Link>
  );
}
