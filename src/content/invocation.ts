/**
 * The opening verse of the Śyāmalā Daṇḍakam, traditionally ascribed to
 * Kālidāsa — the invocation to Śyāmalā Devī, who is pictured holding the
 * veena. Ancient text, public domain.
 *
 * "I call to mind the daughter of Mātaṅga, who fondly plays a veena set with
 *  gems, languid with bliss, her speech sweet and playful, her tender form
 *  lit like a sapphire."
 */
export const INVOCATION = {
  latin: [
    'māṇikya-vīṇām upalālayantīṁ',
    'madālasāṁ mañjula-vāg-vilāsām',
    'māhendra-nīla-dyuti-komalāṅgīṁ',
    'mātaṅga-kanyāṁ manasā smarāmi',
  ],
  devanagari: [
    'माणिक्यवीणामुपलालयन्तीं',
    'मदालसां मञ्जुलवाग्विलासाम् ।',
    'माहेन्द्रनीलद्युतिकोमलाङ्गीं',
    'मातङ्गकन्यां मनसा स्मरामि ॥',
  ],
  telugu: [
    'మాణిక్యవీణాముపలాలయంతీం',
    'మదాలసాం మంజులవాగ్విలాసామ్ ।',
    'మాహేంద్రనీలద్యుతికోమలాంగీం',
    'మాతంగకన్యాం మనసా స్మరామి ॥',
  ],
  meaning:
    'I call to mind the daughter of Mātaṅga, who fondly plays a veena set with gems, languid with bliss, her speech sweet and playful, her tender form lit like a sapphire.',
  source: 'Śyāmalā Daṇḍakam, opening verse — ascribed to Kālidāsa',
} as const

export type ScriptChoice = 'latin' | 'devanagari' | 'telugu'
