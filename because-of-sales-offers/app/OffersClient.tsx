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
    title: 'Sales Training #1',
    description:
      'Every morning: one hot market trend, one talk track, one objection handle. A 3-minute read built for closers.',
    type: 'Daily Newsletter',
  },
  {
    id: 1,
    emoji: '🧠',
    tag: 'Training',
    title: 'Sales Training #2',
    description:
      '47 battle-tested openers, rebuttals, and voicemail scripts used by top earners across 12 industries.',
    type: 'PDF Guide',
  },
  {
    id: 2,
    emoji: '🎯',
    tag: 'Pipeline Tool',
    title: 'Sales Training #3',
    description:
      'The exact spreadsheet system used to track, forecast, and close a 6-figure personal quota. Free template included.',
    type: 'Spreadsheet Template',
  },
  {
    id: 3,
    emoji: '🎙️',
    tag: 'Coaching',
    title: 'Sales Training #4',
    description:
      'Daily 5-minute audio coaching drops to build the mindset that separates top 1% reps from everyone else.',
    type: 'Audio Series',
  },
  {
    id: 4,
    emoji: '💼',
    tag: 'Career',
    title: 'Sales Training #5',
    description:
      'Word-for-word scripts to negotiate your base, OTE, equity, and territory before you sign the offer letter.',
    type: 'eBook',
  },
]

export default function OffersClient({ email }: { email: string }) {
  const [selected, setSelected] = useState<boolean[]>(OFFERS.map(() => false))
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const selectedCount = selected.filter(Boolean).length
  const allSelected   = selectedCount === OFFERS.length

  function toggleCard(idx: number) {
    setSelected(prev => prev.map((v, i) => (i === idx ? !v : v)))
  }

  function toggleSelectAll() {
    setSelected(OFFERS.map(() => !allSelected))
  }

  async function submitClaim(overrideSelectAll = false) {
    const finalSelected = overrideSelectAll ? OFFERS.map(() => true) : selected
    setLoading(true)
    const payload = {
      email,
      opted_in_at:    new Date().toISOString(),
      source:         'beehiiv',
      offers_claimed: OFFERS.filter((_, i) => finalSelected[i]).map(o => o.title),
    }
    try {
      // await fetch(WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      console.log('Opt-in payload:', payload)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
    setShowModal(false)
    setSubmitted(true)
  }

  function handleClaim() {
    if (!allSelected) {
      setShowModal(true)
    } else {
      submitClaim(false)
    }
  }

  function handleSkip() {
    submitClaim(false)
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
        <span>One last step before you are in</span>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} />
        </div>
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
          You like free stuff?
        </h1>
        <p className={styles.heroSub}>
          Hand-picked resources to meet you where you are at. Grab any of the following resources that may be useful to you. All free, always.
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
            onClick={handleClaim}
            disabled={selectedCount === 0 || loading}
          >
            {loading ? 'Sending...' : 'Send Me My Free Resources'}
          </button>

          <button
            className={styles.btnSkip}
            onClick={handleSkip}
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

      {/* UPSELL MODAL */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalCard} onClick={e => e.stopPropagation()}>
            <div className={styles.modalIcon}>⚠️</div>
            <h2 className={styles.modalTitle}>Hold on — you are leaving resources on the table.</h2>
            <p className={styles.modalBody}>
              This page disappears the moment you continue. Once it is gone, these resources are gone with it. There is no coming back to this offer.
            </p>
            <div className={styles.modalMissing}>
              <p className={styles.modalMissingLabel}>You are about to miss out on:</p>
              <ul className={styles.modalMissingList}>
                {OFFERS.filter((_, i) => !selected[i]).map(o => (
                  <li key={o.id}>
                    <span>{o.emoji}</span>
                    <span>{o.title}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              className={styles.modalBtnPrimary}
              onClick={() => submitClaim(true)}
              disabled={loading}
            >
              {loading ? 'Grabbing everything...' : 'Grab All 5 — Yes, All of Them'}
            </button>
            <button
              className={styles.modalBtnSecondary}
              onClick={() => submitClaim(false)}
              disabled={loading}
            >
              I will pass for now
            </button>
          </div>
        </div>
      )}

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
