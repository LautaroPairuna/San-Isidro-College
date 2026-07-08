import Image from 'next/image'
import type { ComponentProps } from 'react'
import { Link } from '@/i18n/navigation'

type AcademicLevelCardHref = ComponentProps<typeof Link>['href']

export type AcademicLevelCardItem = {
  key: string
  title: string
  description: string
  href: AcademicLevelCardHref
  imageSrc: string
  imageAlt: string
  color: string
  ctaLabel: string
}

type AcademicLevelCardsProps = {
  title: string
  items: AcademicLevelCardItem[]
  columnsClassName?: string
}

export default function AcademicLevelCards({
  title,
  items,
  columnsClassName = 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
}: AcademicLevelCardsProps) {
  if (items.length === 0) return null

  return (
    <section className="mt-16 space-y-8">
      <h3 className="text-3xl md:text-4xl font-bold text-gray-800 text-shadow-bold-movil">
        {title}
      </h3>

      <div className={`grid gap-6 ${columnsClassName}`}>
        {items.map((item) => (
          <Link key={item.key} href={item.href} className="group block h-full">
            <article className="h-full overflow-hidden rounded-3xl bg-white shadow-xl transition-transform duration-300 group-hover:-translate-y-1">
              <div
                className="relative overflow-hidden"
                style={{ backgroundColor: item.color, height: '280px' }}
              >
                <Image
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: `linear-gradient(to bottom, ${item.color}e6 0%, ${item.color}bf 34%, transparent 72%)` }}
                />
                <div className="absolute inset-x-0 top-0 flex h-[38%] items-center justify-center px-6">
                  <h4 className="text-center text-2xl font-bold leading-tight text-white">
                    {item.title}
                  </h4>
                </div>
              </div>

              <div className="space-y-4 p-6">
                <p className="text-gray-700 leading-relaxed">{item.description}</p>
                <span className="font-semibold text-[#1e804b] group-hover:underline">
                  {item.ctaLabel}
                </span>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  )
}
