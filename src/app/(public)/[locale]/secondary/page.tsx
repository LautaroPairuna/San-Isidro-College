import AcademicLevelDetailPage from '@/components/AcademicLevelDetailPage'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ locale: string }>
}

export default async function SecondaryPage({ params }: PageProps) {
  const { locale } = await params
  return <AcademicLevelDetailPage locale={locale} level="secondary" />
}
