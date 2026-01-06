'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function FloatingAdmissionsButton() {
  const t = useTranslations('home');

  return (
    <Link
      href="https://docs.google.com/forms/d/e/1FAIpQLSdTZNnLscG2J5nk8azmzbifaCX1n-2Ft1dPHmOgyRoD9POURA/viewform"
      target="_blank"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#1e804b] text-white rounded-full shadow-lg hover:bg-[#166038] transition-all duration-300 hover:scale-105 group"
    >
      <div className="relative w-8 h-8">
        <Image
          src="/images/ico-admisiones.svg"
          alt={t('hero.admisionButton')}
          fill
          className="object-contain"
        />
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
