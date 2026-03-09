import OffersClient from './OffersClient'

export const dynamic = 'force-dynamic'

export default function OffersPage({
  searchParams,
}: {
  searchParams: { email?: string }
}) {
  const email = searchParams.email ?? ''
  return <OffersClient email={email} />
}
