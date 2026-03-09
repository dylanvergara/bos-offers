'use client'

import { useState } from 'react'
import Image from 'next/image'
import styles from './offers.module.css'

const THANK_YOU_URL = 'https://becauseofsales.beehiiv.com' // swap to real URL
const WEBHOOK_URL   = '/api/opt-in'

interface Offer {
  id: number
  emoji: string
  tag: string
  title: string
  description: string
  type: string
}

const OFFERS: Offer[] = [
  {
    id: 0,
    emoji: '📈',
    tag: 'Sales Intelligence',
    title: 'The Daily Deal Sheet',
    description:
      'Every morning: one hot market trend, one talk track, one objection handle. A 3-minute read built for closers.',
    type: 'Daily Newsletter',
  },
  {
    id: 1,
    emoji: '🧠',
    tag: 'Training',
    title: 'Cold Call Mastery Playbook',
    description:
      '47 battle-tested openers, rebuttals, and voicemail scripts used by top earners across 12 industries.',
    type: 'PDF Guide',
  },
  {
    id: 2,
    emoji: '🎯',
    tag: 'Pipeline Tool',
    title: 'The $100K Pipeline Tracker',
    description:
      'The exact spreadsheet system used to track, forecast, and close a 6-figure personal quota. Free template included.',
    type: 'Spreadsheet Template',
  },
  {
    id: 3,
    emoji: '🎙️',
    tag: 'Coaching',
    title: '7-Day Mental Edge Challenge',
    description:
      'Daily 5-minute audio coaching drops to build the mindset that separates top 1% reps from everyone else.',
    type: 'Audio Series',
  },
  {
    id: 4,
    emoji: '💼',
    tag: 'Career',
    title: 'The Comp Negotiation Bible',
    description:
      'Word-for-word scripts to negotiate your base, OTE, equity, and territory before you sign the offer letter.',
    type: 'eBook',
  },
]

export default function OffersClient({ email }: { email: string }) {
  const [selected, setSelected] = useState<boolean[]>(OFFERS.map(() => false))
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const selectedCount = selected.filter(Boolean).length
  const allSelected   = selectedCount === OFFERS.length

  function toggleCard(idx: number) {
    setSelected(prev => prev.map((v, i) => (i === idx ? !v : v)))
  }

  function toggleSelectAll() {
    setSelected(OFFERS.map(() => !allSelected))
  }

  async function handleClaim(skip = false) {
    setLoading(true)
    const payload = {
      email,
      opted_in_at:    new Date().toISOString(),
      source:         'beehiiv',
      offers_claimed: skip ? [] : OFFERS.filter((_, i) => selected[i]).map(o => o.title),
    }

    try {
      // Uncomment when API route is ready:
      // await fetch(WEBHOOK_URL, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload),
      // })
      console.log('Opt-in payload:', payload)
    } catch (e) {
      console.error(e)
    }

    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className={styles.successPage}>
        <div className={styles.successCard}>
          <span className={styles.successEmoji}>🎉</span>
          <h2 className={styles.successTitle}>You are all set!</h2>
          <p className={styles.successBody}>
            Your free resources are on the way. Check your inbox in the next few minutes.
          </p>
          <button
            className={styles.btnDone}
            onClick={() =>
              (window.location.href =
                THANK_YOU_URL + (email ? `?email=${encodeURIComponent(email)}` : ''))
            }
          >
            Continue to Welcome Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>

      {/* TOP BAR */}
      <div className={styles.topbar}>
        One last step before you are in
      </div>

      {/* HERO */}
      <header className={styles.hero}>
        <Image
          src="/logo.jpg"
          alt="Because of Sales"
          width={260}
          height={80}
          className={styles.logo}
          priority
        />
        <h1 className={styles.heroTitle}>
          Grab your free resources.
        </h1>
        <p className={styles.heroSub}>
          Hand-picked for sales pros. Select what is useful to you. All free.
        </p>
        {email && (
          <div className={styles.emailBadge}>
            <span className={styles.emailDot} />
            Sending to {email}
          </div>
        )}
      </header>

      <main className={styles.main}>

        {/* SELECT ALL - TOP */}
        <SelectAllButton allSelected={allSelected} count={selectedCount} onToggle={toggleSelectAll} />

        {/* OFFER CARDS */}
        <ul className={styles.offersList}>
          {OFFERS.map((offer, idx) => (
            <li key={offer.id}>
              <button
                className={`${styles.offerCard} ${selected[idx] ? styles.offerCardSelected : ''}`}
                onClick={() => toggleCard(idx)}
                aria-pressed={selected[idx]}
              >
                <span className={styles.offerCheckbox} aria-hidden>
                  {selected[idx] ? '✓' : ''}
                </span>
                <span className={styles.offerEmoji} aria-hidden>{offer.emoji}</span>
                <span className={styles.offerBody}>
                  <span className={styles.offerTag}>{offer.tag}</span>
                  <span className={styles.offerTitle}>{offer.title}</span>
                  <span className={styles.offerDesc}>{offer.description}</span>
                  <span className={styles.offerMeta}>
                    <span className={styles.offerFree}>FREE</span>
                    <span className={styles.offerDot} />
                    <span className={styles.offerType}>{offer.type}</span>
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        {/* SELECT ALL - BOTTOM */}
        <SelectAllButton allSelected={allSelected} count={selectedCount} onToggle={toggleSelectAll} />

        {/* CTA */}
        <div className={styles.ctaSection}>
          {selectedCount > 0 && (
            <p className={styles.selectedCount}>
              <strong>{selectedCount} resource{selectedCount !== 1 ? 's' : ''} selected</strong> and ready to claim
            </p>
          )}

          <button
            className={styles.btnClaim}
            onClick={() => handleClaim(false)}
            disabled={selectedCount === 0 || loading}
          >
            {loading ? 'Sending...' : 'Send Me My Free Resources'}
          </button>

          <button
            className={styles.btnSkip}
            onClick={() => handleClaim(true)}
          >
            No thanks, continue without selecting
          </button>
        </div>

      </main>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <p className={styles.footerDisclaimer}>
          The resources listed above are provided by third-party partners. By selecting and claiming any resource, you acknowledge that Because of Sales may share your contact information with the respective partner(s) for the purpose of fulfilling your request. Each partner's privacy policy governs their use of your data.
        </p>
        <p className={styles.footerCopy}>
          &copy; {new Date().getFullYear()} Because of Sales. All rights reserved.
        </p>
      </footer>

    </div>
  )
}

function SelectAllButton({
  allSelected,
  count,
  onToggle,
}: {
  allSelected: boolean
  count: number
  onToggle: () => void
}) {
  return (
    <button
      className={`${styles.btnSelectAll} ${allSelected ? styles.btnSelectAllActive : ''}`}
      onClick={onToggle}
    >
      <span className={styles.selectAllCheck}>{allSelected ? '✓' : '☐'}</span>
      <span>
        {allSelected
          ? `All ${count} selected. You are locked in.`
          : 'Grab Everything. Select All 5.'}
      </span>
      {!allSelected && <span className={styles.selectAllBadge}>FREE</span>}
    </button>
  )
}
