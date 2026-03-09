import OffersClient from './OffersClient'

export default function OffersPage({
  searchParams,
}: {
  searchParams: { email?: string }
}) {
  const email = searchParams.email ?? ''
  return <OffersClient email={email} />
}
