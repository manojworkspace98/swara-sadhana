// Generated from the drafted teaching content, then fact-checked and
// corrected. Edit this file directly — the draft is not kept.
//
// Every term a beginner meets before they can read a line of notation,
// with a respelling because a word you cannot say is a word you will not use.
import type { GlossaryTerm } from './types'

export const GLOSSARY: GlossaryTerm[] = [
  {
    "id": "adi-tala",
    "term": "adi tala",
    "iso": "ādi tāḷa",
    "devanagari": "आदि ताल",
    "telugu": "ఆది తాళం",
    "say": "AA-di TAA-lum",
    "short": "The most common tala: eight beats, counted as a four-beat laghu followed by two drutams — clap-2-3-4, clap-wave, clap-wave.",
    "see": [
      "tala",
      "laghu",
      "drutam",
      "kriya",
      "avartana"
    ],
    "body": [
      {
        "kind": "p",
        "text": "Its full name is chatusra jati triputa tala. Triputa means [[laghu]] plus [[drutam]] plus drutam; chatusra jati makes that laghu four beats long. Four plus two plus two is eight. Almost everything you learn as a beginner is set in it."
      },
      {
        "kind": "audio",
        "label": "Adi tala, cycling",
        "demo": {
          "kind": "tala",
          "talaId": "adi"
        }
      },
      {
        "kind": "p",
        "text": "The gesture in full: clap the palm down, then count three fingers against the palm — most teachers start from the little finger and work inward. Then clap and turn the hand over. Then clap and turn again. That is one [[avartana]], and then it begins again."
      },
      {
        "kind": "try",
        "text": "Count eight cycles at a steady speed without watching the demo. Then do it again, saying 'ta ka dhi mi' on every beat. The second version is where you find out whether the hand was really independent.",
        "demo": {
          "kind": "tala",
          "talaId": "adi"
        }
      },
      {
        "kind": "note",
        "text": "Adi is so dominant early on that beginners can mistake it for rhythm itself. It is one cycle among many, and the [[alankara|alankaras]] exist largely to break that assumption before it hardens."
      }
    ]
  },
  {
    "id": "akara",
    "term": "akara",
    "iso": "ākāra",
    "devanagari": "आकार",
    "telugu": "ఆకారం",
    "say": "AA-kaa-ra",
    "short": "Singing on the open vowel 'aa' instead of on swara names or words, so that nothing is left to listen to but the pitch and the quality of your voice.",
    "see": [
      "karvai",
      "sadhana",
      "sruti"
    ],
    "body": [
      {
        "kind": "p",
        "text": "A consonant gives you a fresh start on every note. It hides the join between one pitch and the next, and it hides an unsteady tone underneath the attack. A vowel gives you none of that. Sung on akara, a phrase exposes every wobble, every scoop into a note, and every place the breath ran out."
      },
      {
        "kind": "try",
        "text": "Turn on the drone. Take a comfortable breath and sing Sa on 'aa' for as long as the breath lasts. Start on the pitch rather than sliding up to it. Do it three times. Listen for the point where the note and the drone stop interfering with each other.",
        "demo": {
          "kind": "drone"
        }
      },
      {
        "kind": "p",
        "text": "Practising long tones this way is old and standard, and some schools extend it to other vowels — 'ee' and 'oo' — for the different things they do to the throat and the resonance. Which vowels are used, and how much time is given to them, differs from teacher to teacher."
      },
      {
        "kind": "watch",
        "text": "The vowel drifting toward 'aw' or 'uh' as the breath runs down. The pitch almost always goes with it, and the drift is easier to hear than the flatness that causes it."
      }
    ]
  },
  {
    "id": "akshara",
    "term": "akshara",
    "iso": "akṣara",
    "devanagari": "अक्षर",
    "telugu": "అక్షరం",
    "say": "UK-sha-ra",
    "short": "One beat of the tala — the unit you actually count, so Adi tala's eight counts are eight aksharas.",
    "see": [
      "tala",
      "adi-tala",
      "gati",
      "kalam"
    ],
    "body": [
      {
        "kind": "p",
        "text": "The akshara is the count itself, not a duration in seconds. How long one akshara lasts depends on the tempo you have chosen. The same eight aksharas of [[adi-tala|Adi tala]] can take four seconds or twenty."
      },
      {
        "kind": "audio",
        "label": "Eight aksharas, one cycle of Adi tala",
        "demo": {
          "kind": "tala",
          "talaId": "adi"
        }
      },
      {
        "kind": "p",
        "text": "Each akshara divides into equal smaller units, and how many depends on the [[gati]]. Four is the default. When you sing two notes per beat, you are putting two notes inside one akshara — the akshara has not changed size."
      },
      {
        "kind": "note",
        "text": "Terminology genuinely varies here. Some teachers use 'matra' for the subdivision inside a beat; others use it for the beat itself. If a book and your teacher seem to disagree, ask which they mean rather than assuming one of them is wrong."
      }
    ]
  },
  {
    "id": "alankara",
    "term": "alankara",
    "iso": "alaṅkāra",
    "devanagari": "अलङ्कार",
    "telugu": "అలంకారం",
    "say": "a-lung-KAA-ra",
    "short": "Patterned exercises sung in seven different talas — the point in the syllabus where rhythm, rather than melody, becomes the thing being practised.",
    "see": [
      "tala",
      "varisai",
      "anga",
      "adi-tala",
      "geetam"
    ],
    "body": [
      {
        "kind": "p",
        "text": "Up to this point everything has been in [[adi-tala|Adi tala]], and a student can easily start believing Adi is simply what rhythm is. The alankaras break that. There is one for each of the seven basic talas — Dhruva, Matya, Rupaka, Jhampa, Triputa, Ata and Eka — and they are normally sung in [[mayamalavagowla]], so that only the rhythm is new."
      },
      {
        "kind": "p",
        "text": "Because the [[laghu]] in each of those talas can take five different lengths, the seven talas generate thirty-five in the complete system. The alankaras are ordinarily learned in one standard length each, which is quite enough work."
      },
      {
        "kind": "audio",
        "label": "Rupaka tala",
        "demo": {
          "kind": "tala",
          "talaId": "rupaka"
        }
      },
      {
        "kind": "p",
        "text": "Sing them with the hand counting and the mouth naming swaras, in three speeds, as before. What is being built is the ability to hold an uneven cycle — ten beats, fourteen beats — without a metronome and without anyone else keeping it for you."
      },
      {
        "kind": "note",
        "text": "The word alankara also means ornament in a broader sense across Indian aesthetics, and older music texts use it for melodic figures rather than for this exercise set. In teaching today it means these exercises."
      }
    ]
  },
  {
    "id": "anga",
    "term": "anga",
    "iso": "aṅga",
    "devanagari": "अङ्ग",
    "telugu": "అంగం",
    "say": "UNG-ga",
    "short": "A named part of a tala — talas are assembled by stringing a few standard parts together, each with its own count and its own hand gesture.",
    "see": [
      "laghu",
      "drutam",
      "anudrutam",
      "tala",
      "kriya"
    ],
    "body": [
      {
        "kind": "p",
        "text": "Three angas do nearly all the work in practice: the [[laghu]], which is a clap followed by finger counts and whose length varies; the [[drutam]], always two counts; and the [[anudrutam]], always one. Every tala you are likely to meet as a beginner is some arrangement of these."
      },
      {
        "kind": "p",
        "text": "Older theory lists six angas, adding the guru, the plutam and the kakapadam. These appear in rare talas and in books about rhythm. You can go a long way without ever using them."
      },
      {
        "kind": "audio",
        "label": "Adi tala: one laghu of four, then two drutams",
        "demo": {
          "kind": "tala",
          "talaId": "adi"
        }
      },
      {
        "kind": "note",
        "text": "In notation, a laghu is a vertical bar with its length written beside it, a drutam is a circle, and an anudrutam is a crescent. Symbols and their placement vary a little between books."
      }
    ]
  },
  {
    "id": "anudrutam",
    "term": "anudrutam",
    "iso": "anudrutaṁ",
    "devanagari": "अनुद्रुत",
    "telugu": "అనుద్రుతం",
    "say": "un-u-DHRU-tham",
    "short": "A one-beat part of a tala: a single clap, and nothing after it.",
    "see": [
      "anga",
      "laghu",
      "drutam",
      "alankara"
    ],
    "body": [
      {
        "kind": "p",
        "text": "The anudrutam is the smallest anga and the least used. You will meet it once you leave [[adi-tala|Adi tala]], most often in Jhampa tala."
      },
      {
        "kind": "p",
        "text": "Jhampa is built as laghu, then anudrutam, then drutam. In its usual seven-beat laghu that gives seven plus one plus two — ten counts, arranged very unevenly. Cycles like this are exactly why the [[alankara|alankaras]] exist."
      },
      {
        "kind": "audio",
        "label": "Say the word",
        "demo": {
          "kind": "say",
          "text": "anudrutam"
        }
      }
    ]
  },
  {
    "id": "anupallavi",
    "term": "anupallavi",
    "iso": "anupallavi",
    "devanagari": "अनुपल्लवी",
    "telugu": "అనుపల్లవి",
    "say": "un-u-PUL-la-vi",
    "short": "The second section of a composition, which usually rises into the upper register and then leads back into the pallavi.",
    "see": [
      "pallavi",
      "charanam",
      "tara",
      "keerthana"
    ],
    "body": [
      {
        "kind": "p",
        "text": "Its job is contrast. Where a [[pallavi]] often stays close to Sa, the anupallavi typically climbs into [[tara]] — the register above your home octave. That climb is a large part of why a song feels like it is going somewhere."
      },
      {
        "kind": "p",
        "text": "The second half of a [[charanam]] very often reuses the anupallavi's melody outright. Learning the anupallavi thoroughly therefore pays twice, and noticing the reuse makes the charanam far less daunting than its length suggests."
      },
      {
        "kind": "note",
        "text": "Not every composition has one. Some go straight from pallavi to charanam. Others merge the two into a single section called samashti charanam, which is common in Dikshitar's compositions."
      }
    ]
  },
  {
    "id": "arohana",
    "term": "arohana",
    "iso": "ārōhaṇa",
    "devanagari": "आरोहण",
    "telugu": "ఆరోహణ",
    "say": "aa-ROH-ha-na",
    "short": "The ascending sequence of a raga's swaras, from Sa up to the Sa above.",
    "see": [
      "avarohana",
      "raga",
      "melakarta",
      "janya"
    ],
    "body": [
      {
        "kind": "p",
        "text": "It is written left to right and read as an instruction about what is allowed going up. Not every raga climbs in a straight line. Some omit swaras on the way up; some double back on themselves, which is called vakra, so the ascent zigzags rather than rising evenly."
      },
      {
        "kind": "audio",
        "label": "The ascent of Mayamalavagowla",
        "demo": {
          "kind": "swaras",
          "ragaId": "mayamalavagowla",
          "bpm": 56,
          "swaras": [
            {
              "swara": "S",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "R",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "G",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "M",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "P",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "D",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "N",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "S",
              "octave": 1,
              "duration": 2
            }
          ]
        }
      },
      {
        "kind": "p",
        "text": "The arohana and [[avarohana]] together are the first thing anyone tells you about a raga. They are also the least of what you need to sing it. Treat them as a skeleton: correct, necessary, and nothing like the living thing."
      },
      {
        "kind": "audio",
        "label": "Say the word",
        "demo": {
          "kind": "say",
          "text": "arohana"
        }
      }
    ]
  },
  {
    "id": "avarohana",
    "term": "avarohana",
    "iso": "avarōhaṇa",
    "devanagari": "अवरोहण",
    "telugu": "అవరోహణ",
    "say": "uh-va-ROH-ha-na",
    "short": "The descending sequence of a raga's swaras, from the upper Sa back down — often not the reverse of the ascent, and the difference is part of the raga's identity.",
    "see": [
      "arohana",
      "raga",
      "janya"
    ],
    "body": [
      {
        "kind": "p",
        "text": "The asymmetry is the interesting part. A raga may include a swara only on the way down, or descend through notes it skipped going up, or zigzag on the descent while climbing straight. When two ragas share the same set of pitches, the difference between their descents is frequently what separates them."
      },
      {
        "kind": "audio",
        "label": "The descent of Mayamalavagowla",
        "demo": {
          "kind": "swaras",
          "ragaId": "mayamalavagowla",
          "bpm": 56,
          "swaras": [
            {
              "swara": "S",
              "octave": 1,
              "duration": 1
            },
            {
              "swara": "N",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "D",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "P",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "M",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "G",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "R",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "S",
              "octave": 0,
              "duration": 2
            }
          ]
        }
      },
      {
        "kind": "note",
        "text": "Books spell these words several ways — arohanam, aarohana, ārōhaṇa, and the same for the descent. They all mean the same thing. Mayamalavagowla descends by the exact reverse of its ascent. That is true of all seventy-two parent scales — it is part of what makes a scale a parent — and it is one reason a beginner's first raga is drawn from that group rather than from the janyas."
      }
    ]
  },
  {
    "id": "avartana",
    "term": "avartana",
    "iso": "āvartana",
    "devanagari": "आवर्तन",
    "telugu": "ఆవర్తనం",
    "say": "aa-VUR-ta-na",
    "short": "One complete pass through the tala cycle, from its first beat around to its first beat again.",
    "see": [
      "tala",
      "adi-tala",
      "pallavi",
      "akshara"
    ],
    "body": [
      {
        "kind": "p",
        "text": "Musicians measure musical length in avartanas the way other traditions measure in bars. 'The pallavi is two avartanas' is a complete and precise statement about how long a line is. Learn to hear the cycle turning over, because everything else in rhythm depends on knowing where you are inside it."
      },
      {
        "kind": "audio",
        "label": "Adi tala, several avartanas in a row",
        "demo": {
          "kind": "tala",
          "talaId": "adi"
        }
      },
      {
        "kind": "p",
        "text": "The first beat of an avartana is called samam. It is the point of arrival, and landing on it is what makes a rhythmic phrase feel finished. A composition does not always begin on samam, though. Where its line starts relative to the first beat is called the eduppu, and it is fixed by the composition."
      },
      {
        "kind": "watch",
        "text": "Losing count during a long held note. The mind attends to the pitch, the hand goes quiet, and you arrive back a beat early with no idea how. Keep the hand moving through the hold."
      }
    ]
  },
  {
    "id": "charanam",
    "term": "charanam",
    "iso": "caraṇaṁ",
    "devanagari": "चरणम्",
    "telugu": "చరణం",
    "say": "CHA-ra-nam",
    "short": "The final and usually longest section, which often reuses the anupallavi's melody in its second half and ends by returning to the pallavi.",
    "see": [
      "pallavi",
      "anupallavi",
      "keerthana",
      "sahitya"
    ],
    "body": [
      {
        "kind": "p",
        "text": "A composition may have one charanam or several. In performance, singers commonly select — one charanam in a short rendering, more when there is time. Which ones get sung is a matter of the occasion and of the [[patantara]]."
      },
      {
        "kind": "p",
        "text": "The composer's signature, called the mudra, usually sits in the charanam. Tyagaraja's compositions name Tyagaraja, Dikshitar's name Guruguha, Syama Sastri's name Syama Krishna. Before printing and copyright, this is how authorship travelled with a song."
      },
      {
        "kind": "note",
        "text": "Some compositions have a samashti charanam — one section doing the work of both anupallavi and charanam."
      },
      {
        "kind": "watch",
        "text": "Skipping the charanam because it is long. The charanam usually carries the substance of the text; the pallavi is frequently only an invocation. Learning the pallavi alone gives you the tune and very little of the song."
      }
    ]
  },
  {
    "id": "dhatu-varisai",
    "term": "dhatu varisai",
    "iso": "dhātu varisai",
    "say": "DHAA-thu va-ri-SAI",
    "short": "Exercise patterns built on leaps rather than steps — the voice has to jump to a note it did not walk to, and land on it in tune.",
    "see": [
      "varisai",
      "janta-varisai",
      "alankara",
      "sahitya"
    ],
    "body": [
      {
        "kind": "p",
        "text": "Where [[sarali-varisai|sarali]] moves between neighbours and [[janta-varisai|janta]] repeats, dhatu opens gaps: Sa Ga Ri Ga, then Sa Ma Ga Ma, then Sa Pa Ma Pa, and onward. The exact patterns vary between schools; that is one common form."
      },
      {
        "kind": "audio",
        "label": "A common dhatu pattern",
        "demo": {
          "kind": "swaras",
          "ragaId": "mayamalavagowla",
          "bpm": 60,
          "swaras": [
            {
              "swara": "S",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "G",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "R",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "G",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "S",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "M",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "G",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "M",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "S",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "P",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "M",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "P",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "S",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "D",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "P",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "D",
              "octave": 0,
              "duration": 1
            }
          ]
        }
      },
      {
        "kind": "p",
        "text": "The difficulty here is real and worth naming. Stepwise motion lets the ear find a note by nearness — you can feel your way to it. A leap gives you nothing to feel your way along; you have to hear the target before you sing it. That is the skill that later makes fast passages accurate rather than approximate."
      },
      {
        "kind": "note",
        "text": "Be careful with the word dhatu. Here it refers to the leap. In discussion of compositions, the same word names the melodic setting as opposed to the words — see [[sahitya]]. Two established uses, no connection worth reasoning from."
      }
    ]
  },
  {
    "id": "drutam",
    "term": "drutam",
    "iso": "drutaṁ",
    "devanagari": "द्रुत",
    "telugu": "ద్రుతం",
    "say": "DHRU-tham",
    "short": "A two-beat part of a tala: one clap, then the hand turned over palm-up — always exactly two counts, in every tala.",
    "see": [
      "anga",
      "laghu",
      "anudrutam",
      "adi-tala"
    ],
    "body": [
      {
        "kind": "p",
        "text": "Unlike the [[laghu]], the drutam never changes size. Whatever jati a tala is in, its drutams are two beats. This makes them the fixed points you can hold on to when you are learning an unfamiliar cycle."
      },
      {
        "kind": "audio",
        "label": "Adi tala — the last four beats are two drutams",
        "demo": {
          "kind": "tala",
          "talaId": "adi"
        }
      },
      {
        "kind": "note",
        "text": "Written as a small circle. The turning-over gesture is sometimes called visarjita; you will mostly hear it called simply the wave."
      },
      {
        "kind": "watch",
        "text": "Letting the clap and the turn run together so the two beats blur into one gesture. The wave is a count in its own right, not a follow-through from the clap."
      }
    ]
  },
  {
    "id": "gamaka",
    "term": "gamaka",
    "iso": "gamaka",
    "devanagari": "गमक",
    "telugu": "గమకం",
    "say": "GA-ma-ka",
    "short": "The shaping of a note — the slides, oscillations and approaches — which in Carnatic music is part of what the note is, not a decoration laid on top of it.",
    "see": [
      "raga",
      "swara",
      "sangati",
      "patantara"
    ],
    "body": [
      {
        "kind": "p",
        "text": "Here is the claim in its strong form, because the weak form misleads: in many ragas, certain swaras are never sung as steady pitches. Their movement is not added to them afterwards. If you remove it, the pitches are unchanged and the raga is gone. This is the single hardest thing for a listener from another tradition to accept, and the sooner it is accepted the faster everything else goes."
      },
      {
        "kind": "p",
        "text": "Which shaping belongs where depends on the [[raga]] and on the phrase, never on the swara alone. The same pitch is oscillated in one raga and left plain in another, and oscillated one way in a rising phrase and another way in a falling one. This is why a raga cannot be fully written down, and why teaching happens by a teacher singing a phrase until the student can return it."
      },
      {
        "kind": "note",
        "text": "Older texts list ten kinds of gamaka, the dasavidha gamakas, but the lists differ from text to text and do not line up neatly with what teachers actually teach. The names are worth meeting eventually. They are not worth memorising now."
      },
      {
        "kind": "watch",
        "text": "Adding wobble early. Most teachers keep the [[varisai|varisais]] plain and straight for a long time, and the reason is specific: a wobble that starts life as a way of disguising an inaccurate pitch becomes a habit, and it is very hard to remove once the ear has stopped noticing it."
      }
    ]
  },
  {
    "id": "gati",
    "term": "gati",
    "iso": "gati",
    "devanagari": "गति",
    "telugu": "గతి",
    "say": "GA-thi",
    "short": "How many equal sub-beats each count of the tala is divided into — four is the default, three gives a lilt, and five and seven are the genuinely difficult ones.",
    "see": [
      "akshara",
      "laghu",
      "kalam",
      "tala"
    ],
    "body": [
      {
        "kind": "p",
        "text": "The tala tells you how many beats. The gati tells you what happens inside each one. Sing four even syllables per beat and you are in chatusra gati; sing three and you are in tisra gati, and the whole piece takes on a swing without any beat having moved."
      },
      {
        "kind": "p",
        "text": "The five gatis use the same names as the laghu lengths: tisra three, chatusra four, khanda five, misra seven, sankirna nine. In Tamil usage the same idea is called nadai."
      },
      {
        "kind": "try",
        "text": "Count Adi tala with your hand. On every beat, say 'ta ka dhi mi' — four syllables to a beat. When that is steady, switch to 'ta ki ta' — three to a beat — without changing how fast your hand moves. The second one is much harder than it sounds, and the difficulty is the whole point.",
        "demo": {
          "kind": "tala",
          "talaId": "adi"
        }
      },
      {
        "kind": "watch",
        "text": "Confusing gati with jati. Jati sets the length of the [[laghu]] and so the size of the whole cycle. Gati sets the subdivision inside each beat. Adi tala is chatusra jati and is normally sung in chatusra gati, but it can be sung in tisra gati and still be Adi tala."
      }
    ]
  },
  {
    "id": "geetam",
    "term": "geetam",
    "iso": "gītaṁ",
    "devanagari": "गीतम्",
    "telugu": "గీతం",
    "say": "GEE-tham",
    "short": "The first actual song a student learns: simple words, roughly one note per syllable, no repeats and no elaboration, sung straight through from beginning to end.",
    "see": [
      "alankara",
      "swarajati",
      "janya",
      "sahitya"
    ],
    "body": [
      {
        "kind": "p",
        "text": "Geetams come after the [[alankara|alankaras]]. They are the first time swara names are put away and words take their place, which turns out to be harder than expected — the swara name told you the pitch, and the word does not."
      },
      {
        "kind": "p",
        "text": "Most first geetams are in Malahari, a [[janya]] of [[mayamalavagowla]], so the pitch positions are already familiar. 'Sri Gananatha' is the one most commonly taught first, though which geetam a school starts with varies."
      },
      {
        "kind": "p",
        "text": "A geetam has no named sections — no pallavi, no anupallavi, no charanam. It runs from start to finish, though most end by returning to a piece of the opening line. That simplicity is why it comes before the [[swarajati]], which introduces sections, and long before the [[varnam]]."
      },
      {
        "kind": "note",
        "text": "Geetams are short and are often dismissed as trivial. They are also the first place where words, melody and [[tala]] have to be held together at once, which is a genuinely new problem and not a small one."
      }
    ]
  },
  {
    "id": "janta-varisai",
    "term": "janta varisai",
    "iso": "jaṇṭa varisai",
    "telugu": "జంట స్వరాలు",
    "say": "JUN-ta va-ri-SAI",
    "short": "The exercise set where every swara is sung twice before moving on — the doubling is where the voice first learns to strike a note cleanly instead of sliding onto it.",
    "see": [
      "varisai",
      "sarali-varisai",
      "dhatu-varisai",
      "gamaka"
    ],
    "body": [
      {
        "kind": "p",
        "text": "Sa Sa, Ri Ri, Ga Ga, Ma Ma, and so on up and back. It looks trivial written down. It is not, because the second note of each pair has to arrive on the pitch without being re-approached, and most beginners cannot do that at first."
      },
      {
        "kind": "audio",
        "label": "Janta varisai, first pattern",
        "demo": {
          "kind": "swaras",
          "ragaId": "mayamalavagowla",
          "bpm": 66,
          "swaras": [
            {
              "swara": "S",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "S",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "R",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "R",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "G",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "G",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "M",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "M",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "P",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "P",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "D",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "D",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "N",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "N",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "S",
              "octave": 1,
              "duration": 2
            }
          ]
        }
      },
      {
        "kind": "p",
        "text": "The second note of each pair is usually given some weight — a small push, produced from the breath rather than squeezed in the throat. That stress is the first groundwork for [[gamaka]]. How much emphasis, and how early it is introduced, differs between schools; some teachers keep both notes flat and plain for a long time."
      },
      {
        "kind": "watch",
        "text": "Letting the two notes merge into one long note. If someone listening cannot count the pairs, the exercise is not being done, however pleasant it sounds."
      }
    ]
  },
  {
    "id": "janya",
    "term": "janya",
    "iso": "janya",
    "devanagari": "जन्य",
    "telugu": "జన్య",
    "say": "JUN-ya",
    "short": "A raga derived from a parent scale — by leaving swaras out, by zigzagging, or by using different notes going up and coming down — which is what most ragas are.",
    "see": [
      "melakarta",
      "raga",
      "mayamalavagowla",
      "geetam"
    ],
    "body": [
      {
        "kind": "p",
        "text": "Most ragas are janya ragas — there are thousands of them against seventy-two parents. The parent scale supplies the pitch positions; the janya then does something to it. Leaving notes out is called varja. Moving out of order is vakra. Borrowing a note that is foreign to the parent is bhashanga."
      },
      {
        "kind": "p",
        "text": "Malahari is a good first example. It is a janya of [[mayamalavagowla]] that leaves out Ga and Ni going up, brings Ga back on the way down, and leaves Ni out altogether. Five notes ascending, six descending. The first [[geetam|geetams]] a student learns are usually in it, so that the pitch positions are already familiar and only the words are new."
      },
      {
        "kind": "p",
        "text": "Parent assignment is not always obvious, and it is not always agreed. A raga missing two swaras could sit consistently under more than one parent, and different books file it differently. Treat the parent as a filing system rather than as a fact about how the raga sounds."
      },
      {
        "kind": "audio",
        "label": "Say the word",
        "demo": {
          "kind": "say",
          "text": "janya"
        }
      }
    ]
  },
  {
    "id": "jaru",
    "term": "jaru",
    "iso": "jāru",
    "telugu": "జారు",
    "say": "JAA-ru",
    "short": "A slide — arriving at a note from above or below by gliding into it rather than landing on it.",
    "see": [
      "gamaka",
      "kampitam",
      "swara"
    ],
    "body": [
      {
        "kind": "p",
        "text": "The voice starts at one pitch and slides continuously to another, with no separate attack on the way. Sliding up into a note and sliding down into it are treated as different ornaments, because they sound different and are used in different places."
      },
      {
        "kind": "p",
        "text": "Sung deliberately, a jaru is expressive. Sung by accident, it is the beginner habit of scooping into every note from below because the pitch was not ready before the sound started. The difference is control, and the cure for the accidental version is slow practice against the drone."
      }
    ]
  },
  {
    "id": "jati",
    "term": "jati",
    "iso": "jāti",
    "devanagari": "जाति",
    "telugu": "జాతి",
    "say": "JAA-thi",
    "short": "The setting that fixes how long a laghu is — the same tala counted in a different jati has a different number of beats.",
    "see": [
      "laghu",
      "tala",
      "adi-tala",
      "anga"
    ],
    "body": [
      {
        "kind": "p",
        "text": "A [[laghu]] is not a fixed length. It can be three beats, four, five, seven or nine, and the jati is what says which. The five are called tisra (3), chatusra (4), khanda (5), misra (7) and sankeerna (9)."
      },
      {
        "kind": "p",
        "text": "This is why a tala needs two names to be pinned down. Triputa tala is a laghu followed by two [[drutam|drutams]]. In chatusra jati that laghu is four beats, so the cycle runs 4 + 2 + 2 = eight [[akshara|aksharas]] — and that is [[adi-tala|Adi tala]], the one nearly every exercise you will sing is in. Put the same triputa in tisra jati and the cycle becomes 3 + 2 + 2 = seven."
      },
      {
        "kind": "audio",
        "label": "Adi tala — triputa in chatusra jati, eight beats",
        "demo": {
          "kind": "tala",
          "talaId": "adi"
        }
      },
      {
        "kind": "note",
        "text": "You will meet \"jati\" in a second, unrelated sense: the spoken drum syllables — ta ka di mi and their relatives — used in dance and in percussion. Same word, different subject."
      }
    ]
  },
  {
    "id": "kala-pramanam",
    "term": "kala pramanam",
    "iso": "kāla pramāṇa",
    "devanagari": "काल प्रमाण",
    "telugu": "కాల ప్రమాణం",
    "say": "KAA-la pra-MAA-nam",
    "short": "The tempo a piece is set at and held to — holding it steady is treated as a skill in its own right, not a side effect of knowing the notes.",
    "see": [
      "laya",
      "kalam",
      "tala"
    ],
    "body": [
      {
        "kind": "p",
        "text": "Literally the measure of time. In practice it means: you chose a speed, and you are still at that speed when the piece ends. Teachers correct kala pramanam constantly, because a student who drifts has not yet separated \"what to sing\" from \"when to sing it\"."
      },
      {
        "kind": "p",
        "text": "It is not the same as [[kalam]]. Kalam is which speed of a fixed set you are singing an exercise at; kala pramanam is whether you are holding whatever speed you chose."
      },
      {
        "kind": "try",
        "text": "Sing one [[avartana]] of Adi tala with the count running, then keep singing after the count stops and see where you have ended up. The gap is your kala pramanam, and it closes with practice.",
        "demo": {
          "kind": "tala",
          "talaId": "adi"
        }
      }
    ]
  },
  {
    "id": "kalai",
    "term": "kalai",
    "say": "ku-LIGH",
    "short": "How many counts each beat of the tala is given — in two kalai the whole cycle is stretched to twice its length, which is how varnams and many keerthanas are sung.",
    "see": [
      "tala",
      "akshara",
      "varnam",
      "kalam"
    ],
    "body": [
      {
        "kind": "p",
        "text": "In one kalai — the ordinary case, and the one every exercise here uses — each [[akshara]] of the [[tala]] gets one count. In two kalai each gets two, so an eight-beat cycle occupies sixteen counts of the hand and the music inside it has twice as much room."
      },
      {
        "kind": "p",
        "text": "Nothing about the tala itself changes. It is still Adi tala, still eight aksharas, still the same [[anga|angas]] in the same order. What changes is how much music is laid inside each beat."
      },
      {
        "kind": "note",
        "text": "You will not need this until you reach a [[varnam]], which is commonly sung in two kalai. It is listed here because the word turns up in descriptions of pieces long before a student is taught what it means."
      }
    ]
  },
  {
    "id": "kalam",
    "term": "kalam",
    "iso": "kālaṁ",
    "devanagari": "काल",
    "telugu": "కాలం",
    "say": "KAA-lum",
    "short": "The speed layer you are singing in: first speed puts one note on each beat, second speed two, third speed four — the tala stays exactly the same size, you just fit more inside it.",
    "see": [
      "akshara",
      "gati",
      "sarali-varisai",
      "tala"
    ],
    "body": [
      {
        "kind": "p",
        "text": "Exercises are sung in three speeds, one after another, and this is not the same thing as playing them faster. The beat does not move. In second speed you are singing twice as many notes into a cycle of unchanged length, which is a harder and more useful skill than raising the tempo."
      },
      {
        "kind": "audio",
        "label": "First speed — one swara per beat",
        "demo": {
          "kind": "swaras",
          "ragaId": "mayamalavagowla",
          "bpm": 60,
          "swaras": [
            {
              "swara": "S",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "R",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "G",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "M",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "P",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "D",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "N",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "S",
              "octave": 1,
              "duration": 1
            }
          ]
        }
      },
      {
        "kind": "audio",
        "label": "Second speed — two per beat, same eight beats",
        "demo": {
          "kind": "swaras",
          "ragaId": "mayamalavagowla",
          "bpm": 60,
          "swaras": [
            {
              "swara": "S",
              "octave": 0,
              "duration": 0.5
            },
            {
              "swara": "R",
              "octave": 0,
              "duration": 0.5
            },
            {
              "swara": "G",
              "octave": 0,
              "duration": 0.5
            },
            {
              "swara": "M",
              "octave": 0,
              "duration": 0.5
            },
            {
              "swara": "P",
              "octave": 0,
              "duration": 0.5
            },
            {
              "swara": "D",
              "octave": 0,
              "duration": 0.5
            },
            {
              "swara": "N",
              "octave": 0,
              "duration": 0.5
            },
            {
              "swara": "S",
              "octave": 1,
              "duration": 0.5
            },
            {
              "swara": "S",
              "octave": 1,
              "duration": 0.5
            },
            {
              "swara": "N",
              "octave": 0,
              "duration": 0.5
            },
            {
              "swara": "D",
              "octave": 0,
              "duration": 0.5
            },
            {
              "swara": "P",
              "octave": 0,
              "duration": 0.5
            },
            {
              "swara": "M",
              "octave": 0,
              "duration": 0.5
            },
            {
              "swara": "G",
              "octave": 0,
              "duration": 0.5
            },
            {
              "swara": "R",
              "octave": 0,
              "duration": 0.5
            },
            {
              "swara": "S",
              "octave": 0,
              "duration": 0.5
            }
          ]
        }
      },
      {
        "kind": "note",
        "text": "A related term, kala pramanam, means the tempo you have chosen and are holding. Holding one steadily is a separate skill from being able to sing fast, and it is rarer. Be aware that regional usage of these words differs — 'kalai' turns up in varnam practice with a related but distinct sense."
      },
      {
        "kind": "watch",
        "text": "Accelerating as a phrase becomes familiar. Nearly everyone does it, nobody notices themselves doing it, and it is the reason to keep counting with the hand."
      }
    ]
  },
  {
    "id": "kampitam",
    "term": "kampitam",
    "iso": "kampita",
    "devanagari": "कम्पित",
    "telugu": "కంపితం",
    "say": "kum-PI-tham",
    "short": "The oscillating gamaka — a note shaken between itself and a neighbour rather than held straight, and the most common ornament in the music.",
    "see": [
      "gamaka",
      "raga",
      "karvai"
    ],
    "body": [
      {
        "kind": "p",
        "text": "A kampitam is a controlled wobble. The voice moves between the note and one beside it, at a speed and width that belong to that particular [[raga]] and that particular phrase. It is written, if at all, as a small squiggle over the swara, which tells you almost nothing about how it should actually sound."
      },
      {
        "kind": "p",
        "text": "This is the ornament that most distinguishes a Carnatic phrase from the same notes played on a keyboard. In many ragas a swara sung perfectly straight sounds wrong — not plain, but wrong, the way a mispronounced word is wrong."
      },
      {
        "kind": "watch",
        "text": "A kampitam is not vibrato. Vibrato is a small even shimmer applied to any note by habit; a kampitam has a specific width, speed and destination, and changes from raga to raga. Learning it from notation is not possible. It is learnt by listening and imitating."
      }
    ]
  },
  {
    "id": "karvai",
    "term": "karvai",
    "iso": "kārvai",
    "say": "KAAR-vai",
    "short": "A long held note inside a phrase — a rest that is sung rather than left silent, and the place where a singer's control is most exposed.",
    "see": [
      "akara",
      "varnam",
      "akshara",
      "sruti"
    ],
    "body": [
      {
        "kind": "p",
        "text": "In swara passages and in [[varnam|varnams]], not every note gets one beat. Some are held across several counts while the [[tala]] keeps moving underneath. That hold is the karvai. It is written into the composition; it is not a pause you take when you need one."
      },
      {
        "kind": "p",
        "text": "Fast passages forgive a slightly wrong note, because the note is gone before anyone can settle on it. A karvai forgives nothing. The pitch sits still next to the drone for two or three seconds, and any drift becomes obvious to everyone in the room, including you."
      },
      {
        "kind": "audio",
        "label": "A phrase with two long karvais in it",
        "demo": {
          "kind": "swaras",
          "ragaId": "mayamalavagowla",
          "bpm": 60,
          "swaras": [
            {
              "swara": "S",
              "octave": 0,
              "duration": 4
            },
            {
              "swara": "R",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "G",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "M",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "P",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "P",
              "octave": 0,
              "duration": 4
            }
          ]
        }
      },
      {
        "kind": "note",
        "text": "The word is Tamil in origin and is used across the tradition regardless of which language a school teaches in. Some teachers simply say 'hold'."
      }
    ]
  },
  {
    "id": "kattai",
    "term": "kattai",
    "iso": "kaṭṭai",
    "say": "KUT-tai",
    "short": "The number that names your chosen sruti — '5 kattai' fixes a particular pitch as your Sa, and once chosen you keep it, because your whole sense of the scale is built on it.",
    "see": [
      "sruti",
      "tanpura",
      "sthayi",
      "tara"
    ],
    "body": [
      {
        "kind": "p",
        "text": "Sruti boxes and apps are labelled with these numbers, usually 1 to 7 with half-steps between them. On the convention most electronic boxes use, 1 corresponds to the pitch a piano calls C, so 5 kattai is G. Labelling is not perfectly universal, so check what a given device means before trusting the number."
      },
      {
        "kind": "p",
        "text": "As a rough guide only: many male voices settle somewhere between 1 and 3 kattai, and many female voices between about 4.5 and 6. These are starting points for a conversation with a teacher, not categories. Voices differ from each other far more than the ranges suggest."
      },
      {
        "kind": "try",
        "text": "Play the drone and sing Sa. Then move it up and try again, and down and try again. The right sruti is the one where the low notes speak without pushing and the high notes arrive without strain. Judge on both ends, not on the comfortable one.",
        "demo": {
          "kind": "drone"
        }
      },
      {
        "kind": "watch",
        "text": "Choosing a low sruti because your low notes sound rich and impressive. You pay for it every time a piece goes into [[tara]], which is most pieces, in the [[anupallavi]], every time."
      },
      {
        "kind": "note",
        "text": "The word is Tamil in origin and is used across the tradition regardless of which language a school teaches in."
      }
    ]
  },
  {
    "id": "keerthana",
    "term": "keerthana",
    "iso": "kīrtana",
    "devanagari": "कीर्तन",
    "telugu": "కీర్తన",
    "say": "KEER-tha-na",
    "short": "A devotional song in three sections — pallavi, anupallavi, charanam — and the form most of the Carnatic concert repertoire takes.",
    "see": [
      "pallavi",
      "anupallavi",
      "charanam",
      "sangati",
      "varnam"
    ],
    "body": [
      {
        "kind": "p",
        "text": "The three sections and the way you move between them: [[pallavi]], then [[anupallavi]], then the pallavi again, then [[charanam]], then the pallavi again to close. The returning line is the spine of the form."
      },
      {
        "kind": "p",
        "text": "On keerthana versus kriti: the usual distinction is that a keerthana puts the words first, with a straightforward melody that repeats for each stanza, while a kriti is musically more elaborate, its melodic detail fixed in place, carrying [[sangati|sangatis]] and sometimes composed swara passages. In everyday speech the two words are used interchangeably and many pieces are called both."
      },
      {
        "kind": "p",
        "text": "You will not learn one whole. It arrives a line at a time — the pallavi first, over several sessions, then the anupallavi, then the charanam, then the sangatis layered on afterwards. Weeks, not an evening."
      },
      {
        "kind": "note",
        "text": "Three composers of the late eighteenth and early nineteenth centuries dominate the repertoire: Tyagaraja, Muthuswami Dikshitar and Syama Sastri. Many others matter a great deal, but this is where most students begin and where most concerts spend their time."
      }
    ]
  },
  {
    "id": "kriya",
    "term": "kriya",
    "iso": "kriyā",
    "devanagari": "क्रिया",
    "telugu": "క్రియ",
    "say": "kri-YAA",
    "short": "The hand movements that count the tala — the claps, the finger counts and the palm-up wave — which make the cycle visible instead of only felt.",
    "see": [
      "tala",
      "anga",
      "laghu",
      "adi-tala"
    ],
    "body": [
      {
        "kind": "p",
        "text": "You count on the palm of the other hand, or on your thigh, and you do it for the whole piece. This is not optional and it is not a beginner's crutch that gets discarded later. Professional musicians count throughout concerts. The tala is a physical act in this tradition."
      },
      {
        "kind": "p",
        "text": "Some kriyas make a sound and some do not — the clap is audible, the turn of the hand is not — and the older texts classify them on exactly that basis. What matters in practice is that both are unmistakable to anyone watching, including the accompanists."
      },
      {
        "kind": "try",
        "text": "Put your left palm up in front of you and count Adi tala on it with your right hand while the demo plays. Do not sing anything. Do it until the pattern survives you thinking about something else.",
        "demo": {
          "kind": "tala",
          "talaId": "adi"
        }
      },
      {
        "kind": "watch",
        "text": "The hand following the voice. When a passage gets hard, the beginner's hand slows to match the mouth, which destroys the very thing it was there to protect. The hand leads and the voice fits into it."
      }
    ]
  },
  {
    "id": "laghu",
    "term": "laghu",
    "iso": "laghu",
    "devanagari": "लघु",
    "telugu": "లఘువు",
    "say": "LU-ghu",
    "short": "The one part of a tala whose length changes: a clap followed by finger counts, adding up to 3, 4, 5, 7 or 9 beats depending on the tala's jati.",
    "see": [
      "anga",
      "drutam",
      "adi-tala",
      "gati",
      "kriya"
    ],
    "body": [
      {
        "kind": "p",
        "text": "The gesture is always the same shape: one clap, then a finger count for each remaining beat, tapped against the palm. Most teachers count starting from the little finger and work inward. A laghu of four is a clap and three fingers."
      },
      {
        "kind": "p",
        "text": "The five available lengths have names. Tisra is three, chatusra four, khanda five, misra seven, sankirna nine. The chosen length is called the tala's jati, and it is the only thing that changes the total size of a cycle."
      },
      {
        "kind": "try",
        "text": "Count along with Adi tala and watch only the first four beats. Clap, then little finger, ring finger, middle finger. Say the numbers aloud the first few times. The gesture has to become automatic, because eventually you will be doing it while thinking about something else entirely.",
        "demo": {
          "kind": "tala",
          "talaId": "adi"
        }
      },
      {
        "kind": "watch",
        "text": "Counting the fingers as a decorative flutter rather than as four distinct beats. If someone watching cannot tell which beat you are on, the laghu is not doing its job."
      }
    ]
  },
  {
    "id": "laya",
    "term": "laya",
    "iso": "laya",
    "devanagari": "लय",
    "telugu": "లయ",
    "say": "LU-ya",
    "short": "Tempo, and more broadly the sense of musical time — a singer said to have good laya is one whose pulse does not drift.",
    "see": [
      "kala-pramanam",
      "tala",
      "kalam"
    ],
    "body": [
      {
        "kind": "p",
        "text": "Laya is the flow of time underneath the music. It is used loosely for tempo, and more seriously for the faculty of holding time steadily while doing something else difficult. The two are related: nobody keeps a steady pulse by watching a clock, they keep it by having internalised one."
      },
      {
        "kind": "p",
        "text": "This is worth naming early because it is the part of your musicianship that the [[tala]] exercises are actually building. Singing the right notes is one skill. Singing them without the pulse sagging when the phrase gets hard is a different one, and it is the one an audience notices."
      },
      {
        "kind": "watch",
        "text": "Almost every beginner speeds up when a passage is easy and slows down when it is hard. You will not hear yourself doing it. Practising with the metronome running, rather than only checking against it afterwards, is what fixes this."
      }
    ]
  },
  {
    "id": "madhya",
    "term": "madhya",
    "iso": "madhya",
    "devanagari": "मध्य",
    "telugu": "మధ్య",
    "say": "MUDH-ya",
    "short": "Your home octave — the register that begins on the Sa you chose and where nearly all early practice happens.",
    "see": [
      "sthayi",
      "mandra",
      "tara",
      "sarali-varisai"
    ],
    "body": [
      {
        "kind": "p",
        "text": "Everything in the beginner's syllabus lives here first. The [[varisai|varisais]] start in madhya, the first songs sit in madhya, and the register is where your voice is most honest — no strain at the top, no thinness at the bottom, so a wrong pitch has nowhere to hide."
      },
      {
        "kind": "audio",
        "label": "The home octave, Sa to Sa",
        "demo": {
          "kind": "swaras",
          "ragaId": "mayamalavagowla",
          "bpm": 60,
          "swaras": [
            {
              "swara": "S",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "R",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "G",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "M",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "P",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "D",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "N",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "S",
              "octave": 1,
              "duration": 2
            }
          ]
        }
      },
      {
        "kind": "p",
        "text": "When you write or read swara notation, madhya notes carry no mark at all. Only the registers above and below are marked. The middle is the default, in notation as in practice."
      }
    ]
  },
  {
    "id": "mandra",
    "term": "mandra",
    "iso": "mandra",
    "devanagari": "मन्द्र",
    "telugu": "మంద్ర",
    "say": "MUN-dra",
    "short": "The register below your home octave — the low notes, written with a dot under the swara letter.",
    "see": [
      "sthayi",
      "madhya",
      "tara"
    ],
    "body": [
      {
        "kind": "p",
        "text": "Mandra runs from the Pa below your Sa down toward the Sa an octave below. Most beginners find it thin and breathy. That is normal. The low register develops slowly and does not respond to effort; it responds to time spent singing quietly against the drone."
      },
      {
        "kind": "audio",
        "label": "Climbing out of the lower register into your Sa",
        "demo": {
          "kind": "swaras",
          "ragaId": "mayamalavagowla",
          "bpm": 50,
          "swaras": [
            {
              "swara": "P",
              "octave": -1,
              "duration": 1
            },
            {
              "swara": "D",
              "octave": -1,
              "duration": 1
            },
            {
              "swara": "N",
              "octave": -1,
              "duration": 1
            },
            {
              "swara": "S",
              "octave": 0,
              "duration": 3
            }
          ]
        }
      },
      {
        "kind": "p",
        "text": "You cannot skip it. A great many compositions dip below Sa in their opening line, so the first song you learn will very likely ask for notes you do not yet have. Working on mandra is not preparation for later; it is part of the current work."
      },
      {
        "kind": "watch",
        "text": "Pushing for volume down here. Force makes the low register worse, not louder. Let it be soft and let it be accurate, and check it against the drone rather than against how impressive it feels in your chest."
      }
    ]
  },
  {
    "id": "mayamalavagowla",
    "term": "mayamalavagowla",
    "iso": "māyāmāḷavagauḷa",
    "devanagari": "मायामालवगौल",
    "telugu": "మాయామాళవగౌళ",
    "say": "MAA-yaa-MAA-la-va-GOW-la",
    "short": "The fifteenth parent scale, and traditionally the first raga a student learns — its intervals are laid out symmetrically, with a narrow step at each end of each half and a wide leap in the middle.",
    "see": [
      "melakarta",
      "sarali-varisai",
      "varisai",
      "swarasthana"
    ],
    "body": [
      {
        "kind": "p",
        "text": "Its swaras are Sa, the lowest Ri, the highest Ga, the lower Ma, Pa, the lowest Da and the highest Ni. In plain terms: the second note sits very close to Sa, then there is a wide jump to the third, then a small step to the fourth. The identical shape repeats starting from Pa. The upper half of the scale is a copy of the lower half."
      },
      {
        "kind": "audio",
        "label": "Mayamalavagowla, up and down",
        "demo": {
          "kind": "swaras",
          "ragaId": "mayamalavagowla",
          "bpm": 52,
          "swaras": [
            {
              "swara": "S",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "R",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "G",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "M",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "P",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "D",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "N",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "S",
              "octave": 1,
              "duration": 2
            },
            {
              "swara": "N",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "D",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "P",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "M",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "G",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "R",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "S",
              "octave": 0,
              "duration": 2
            }
          ]
        }
      },
      {
        "kind": "p",
        "text": "The reason usually given for starting here is that symmetry plus difficulty is a good teaching combination. The two narrow steps demand precise placement — a beginner who is slightly off will hear it immediately — and the two wide leaps train the voice to jump accurately. Because the halves match, a mistake in one half is audible against the other."
      },
      {
        "kind": "p",
        "text": "The practice of starting beginners in this raga, along with the whole graded syllabus of [[varisai|varisais]], [[alankara|alankaras]] and [[geetam|geetams]], is traditionally credited to Purandara Dasa in the sixteenth century. That attribution is what the tradition holds; it is not something documented in the way a modern historian would want."
      },
      {
        "kind": "watch",
        "text": "It will sound strange at first, and slightly bleak. The semitone right next to Sa is unlike anything in the scales most listeners grow up with. That strangeness is doing work: unfamiliar intervals are much easier to check than familiar ones, because you cannot coast on what you expect to hear."
      }
    ]
  },
  {
    "id": "melakarta",
    "term": "melakarta",
    "iso": "mēḷakarta",
    "devanagari": "मेलकर्ता",
    "telugu": "మేళకర్త",
    "say": "MAY-la-kar-ta",
    "short": "One of the 72 parent scales — those using all seven swara names, in straight order, identically up and down — from which every other raga is treated as derived.",
    "see": [
      "janya",
      "swarasthana",
      "mayamalavagowla",
      "raga"
    ],
    "body": [
      {
        "kind": "p",
        "text": "To qualify, a scale must contain all seven swara names with none missing, must use the same notes ascending and descending, and must run in straight order with no zigzag. Scales meeting all three conditions are the parents. Everything else is filed underneath one of them."
      },
      {
        "kind": "p",
        "text": "There are exactly seventy-two, and the number is not arbitrary. Ri and Ga can be combined in six ways, since Ri must sit below Ga. Da and Ni likewise give six. Ma has two positions. Six times six times two is seventy-two."
      },
      {
        "kind": "p",
        "text": "Each has a number and a name, and the name encodes the number through an old letter-to-digit system called katapayadi, so a musician who knows the scheme can derive the exact notes from the name alone. The seventy-two scheme is credited to Venkatamakhin in the seventeenth century; the names in use today come from later sources."
      },
      {
        "kind": "audio",
        "label": "Mayamalavagowla, the fifteenth of the seventy-two",
        "demo": {
          "kind": "swaras",
          "ragaId": "mayamalavagowla",
          "bpm": 56,
          "swaras": [
            {
              "swara": "S",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "R",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "G",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "M",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "P",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "D",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "N",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "S",
              "octave": 1,
              "duration": 2
            }
          ]
        }
      },
      {
        "kind": "note",
        "text": "You will see mela, melakarta, melakartha and janaka raga used for the same idea — janaka meaning parent, the counterpart of [[janya]]. Many of the seventy-two are theoretical constructions that no one performs; a few dozen carry real repertoire."
      }
    ]
  },
  {
    "id": "pallavi",
    "term": "pallavi",
    "iso": "pallavi",
    "devanagari": "पल्लवी",
    "telugu": "పల్లవి",
    "say": "PUL-la-vi",
    "short": "The opening section of a composition and the line you return to after every other section — usually one or two lines, and the part that carries the song's identity.",
    "see": [
      "anupallavi",
      "charanam",
      "keerthana",
      "avartana",
      "sangati"
    ],
    "body": [
      {
        "kind": "p",
        "text": "It comes back constantly. Sing the pallavi, sing the anupallavi, return to the pallavi, sing the charanam, return to the pallavi. Because you sing it more than anything else, it is where [[sangati|sangatis]] accumulate and where a performance does most of its work."
      },
      {
        "kind": "p",
        "text": "Where the line begins relative to the first beat of the cycle is called the eduppu, and it is fixed by the composition. Many pallavis do not start on the first beat. Getting the eduppu wrong puts the entire song in the wrong place against the [[tala]], and the error is invisible to the person making it and obvious to everyone else."
      },
      {
        "kind": "audio",
        "label": "Adi tala — hear where the first beat lands",
        "demo": {
          "kind": "tala",
          "talaId": "adi"
        }
      },
      {
        "kind": "note",
        "text": "A second, advanced sense: in ragam–tanam–pallavi, the pallavi is a single composed line set to a tala and used as the raw material for extended improvisation. It shares the name and almost nothing else."
      }
    ]
  },
  {
    "id": "patantara",
    "term": "patantara",
    "iso": "pāṭhāntara",
    "devanagari": "पाठान्तर",
    "telugu": "పాఠాంతరం",
    "say": "paa-TAAN-tha-ra",
    "short": "The version of a composition handed down in one teacher's lineage — different lineages sing the same song with different sangatis, different phrasing, sometimes different words.",
    "see": [
      "sangati",
      "gamaka",
      "keerthana",
      "sarali-varisai"
    ],
    "body": [
      {
        "kind": "p",
        "text": "The word comes from textual scholarship, where it means a variant reading of a manuscript. The idea carries over exactly: no single authoritative copy exists, and what survives is several careful transmissions that differ."
      },
      {
        "kind": "p",
        "text": "The reason is structural. This music travelled by ear for generations. Notation exists and is useful, but it records a skeleton — it cannot capture [[gamaka]], and gamaka is a large part of what a version is. So notation never froze the repertoire the way a score does elsewhere."
      },
      {
        "kind": "p",
        "text": "What to do about it: sing what your teacher taught you. Do not correct their version against a recording, and do not assume a famous recording is the original — it is somebody's patantara too. A difference between two lineages is not a mistake in one of them."
      },
      {
        "kind": "note",
        "text": "This is also why two books give different counts of [[sarali-varisai|sarali varisais]], different alankara patterns and different clapping for the chapu talas. Where sources disagree, your teacher's practice is the one that governs your singing."
      }
    ]
  },
  {
    "id": "raga",
    "term": "raga",
    "iso": "rāga",
    "devanagari": "राग",
    "telugu": "రాగం",
    "say": "RAA-ga",
    "short": "Not a scale but a way of moving: which swaras a melody may use, how each one is approached and left, which phrases belong to it, and which notes it comes to rest on.",
    "see": [
      "arohana",
      "avarohana",
      "gamaka",
      "melakarta",
      "janya"
    ],
    "body": [
      {
        "kind": "p",
        "text": "A scale is a list of notes. A raga is a set of habits. Two ragas can use exactly the same seven pitches and still be unmistakably different, because one of them leans on Ga, slides into Da from above, and never lingers on Ni, while the other does none of those things. Learning a raga means learning what it does, not only what it contains."
      },
      {
        "kind": "p",
        "text": "This is where [[gamaka]] comes in, and it is the point at which Carnatic music departs most sharply from what a beginner expects. In many ragas, certain swaras are never sung as plain steady pitches at all. The oscillation is not applied to the note; it is the note. Play a raga's pitches straight on a keyboard and you have the notes and none of the raga."
      },
      {
        "kind": "audio",
        "label": "Mayamalavagowla, up and down",
        "demo": {
          "kind": "swaras",
          "ragaId": "mayamalavagowla",
          "bpm": 56,
          "swaras": [
            {
              "swara": "S",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "R",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "G",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "M",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "P",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "D",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "N",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "S",
              "octave": 1,
              "duration": 2
            },
            {
              "swara": "N",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "D",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "P",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "M",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "G",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "R",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "S",
              "octave": 0,
              "duration": 2
            }
          ]
        }
      },
      {
        "kind": "p",
        "text": "You will be given a raga's [[arohana]] and [[avarohana]] first, because they are writable. They are also the smallest part of what you need. The rest arrives by hearing it — which is why a teacher sings a phrase at you and waits for you to sing it back, over and over, rather than explaining it."
      },
      {
        "kind": "note",
        "text": "The word carries a sense of colouring or tinting. The tradition treats a raga as having a character rather than as meaning something in particular, and descriptions of what a given raga evokes vary considerably between musicians and between regions."
      }
    ]
  },
  {
    "id": "sadhana",
    "term": "sadhana",
    "iso": "sādhana",
    "devanagari": "साधना",
    "telugu": "సాధన",
    "say": "SAA-dha-na",
    "short": "Practice — regular, unglamorous, and the only thing that moves you forward; the word means disciplined effort toward a goal, not merely repetition.",
    "see": [
      "varisai",
      "akara",
      "sruti",
      "tanpura"
    ],
    "body": [
      {
        "kind": "p",
        "text": "What a beginner's session actually contains: start the drone; sing Sa on [[akara]] for a few minutes; run the [[varisai|varisais]] you know in first and second speed, counting the [[tala]] with your hand; then work on whatever is new. Twenty minutes. Daily."
      },
      {
        "kind": "p",
        "text": "The distribution matters more than the total. Twenty minutes across seven mornings is what the voice responds to. Three hours on a Sunday builds far less and leaves you hoarse, because the thing being trained is a set of fine motor habits and an ear, and neither is built by volume."
      },
      {
        "kind": "p",
        "text": "It is slow, and it is worth saying plainly rather than softening. Months of exercises before a song is the normal shape of this. The syllabus is built that way deliberately: everything that comes afterwards rests on pitch accuracy, and pitch accuracy is installed only by time spent next to a drone."
      },
      {
        "kind": "try",
        "text": "On a day with no time, do this instead of nothing: start the drone, sing Sa for four breaths, stop. It keeps the ear and it keeps the habit. A goal you can meet on a bad day is worth more than one you meet only on a good one.",
        "demo": {
          "kind": "drone"
        }
      },
      {
        "kind": "watch",
        "text": "Practising along with a recording. You cannot hear your own pitch underneath someone else's voice, so what you train is the ability to blend, not the ability to be accurate. Use the drone and your own voice, alone."
      }
    ]
  },
  {
    "id": "sahitya",
    "term": "sahitya",
    "iso": "sāhitya",
    "devanagari": "साहित्य",
    "telugu": "సాహిత్యం",
    "say": "SAA-hi-thya",
    "short": "The words of a composition — the text itself, as opposed to the tune — usually devotional or philosophical poetry in Telugu, Sanskrit, Tamil or Kannada.",
    "see": [
      "keerthana",
      "geetam",
      "charanam",
      "pallavi"
    ],
    "body": [
      {
        "kind": "p",
        "text": "Musicians talk about a composition as having two parts: the dhatu, meaning its melodic setting, and the matu, meaning its words. Sahitya is the second. Note that dhatu here is a different use of the word from the one in [[dhatu-varisai|dhatu varisai]]."
      },
      {
        "kind": "p",
        "text": "The words are not incidental to the music. Which syllable falls on which beat, how long each is held, which syllable receives a [[gamaka]] — all of that is fixed by the composition. Singing the right tune with the syllables placed differently is an error, not a personal variation."
      },
      {
        "kind": "audio",
        "label": "Say the word",
        "demo": {
          "kind": "say",
          "text": "sahitya"
        }
      },
      {
        "kind": "note",
        "text": "Many students learn the words as sounds without knowing the language. That is completely normal and it is also a loss, because the meaning changes how a line is phrased and where it wants to breathe. Translations of the common repertoire are easy to find and worth twenty minutes."
      }
    ]
  },
  {
    "id": "sangati",
    "term": "sangati",
    "iso": "saṅgati",
    "devanagari": "सङ्गति",
    "telugu": "సంగతి",
    "say": "SUN-ga-thi",
    "short": "A composed variation of a line — the same words in the same place in the tala, sung again with a fuller melody, several times over, each one a little more elaborate.",
    "see": [
      "pallavi",
      "keerthana",
      "patantara",
      "gamaka"
    ],
    "body": [
      {
        "kind": "p",
        "text": "In practice: the [[pallavi]] is sung plain, then again with a small addition, then again with more. The words do not change, the tala position does not change, the melody grows. A well-built sequence of sangatis feels like something opening rather than like repetition."
      },
      {
        "kind": "p",
        "text": "Sangatis are learned, not improvised on the spot. They come down from the composer and from the teaching lineage. Which sangatis a piece has, how many, and in what order differ between [[patantara|patantaras]], and none of the versions is the wrong one."
      },
      {
        "kind": "p",
        "text": "Tyagaraja is traditionally credited with developing the sangati into a structural device rather than an occasional flourish. As with most attributions in this repertoire, that is what the tradition holds rather than something independently documented."
      },
      {
        "kind": "watch",
        "text": "Grafting sangatis from a recording onto the version your teacher gave you. The two lineages may not fit together — the phrases assume different approaches to the same notes — and the seam is usually audible to anyone who knows either version."
      }
    ]
  },
  {
    "id": "sarali-varisai",
    "term": "sarali varisai",
    "iso": "saraḷi varisai",
    "telugu": "సరళీ స్వరాలు",
    "say": "sa-ra-li va-ri-SAI",
    "short": "The first exercise set: short patterns that step up and down the scale of Mayamalavagowla, set in Adi tala, usually fourteen of them.",
    "see": [
      "varisai",
      "janta-varisai",
      "mayamalavagowla",
      "adi-tala",
      "kalam"
    ],
    "body": [
      {
        "kind": "p",
        "text": "The first one is the plainest thing in the whole tradition: Sa Ri Ga Ma, Pa Da Ni Sa, then Sa Ni Da Pa, Ma Ga Ri Sa. Eight beats up, eight beats down — one [[avartana]] of [[adi-tala|Adi tala]] each way. The rest of the set works through variations of the same idea."
      },
      {
        "kind": "audio",
        "label": "The first sarali varisai, first speed",
        "demo": {
          "kind": "swaras",
          "ragaId": "mayamalavagowla",
          "bpm": 60,
          "swaras": [
            {
              "swara": "S",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "R",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "G",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "M",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "P",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "D",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "N",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "S",
              "octave": 1,
              "duration": 1
            },
            {
              "swara": "S",
              "octave": 1,
              "duration": 1
            },
            {
              "swara": "N",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "D",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "P",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "M",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "G",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "R",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "S",
              "octave": 0,
              "duration": 1
            }
          ]
        }
      },
      {
        "kind": "p",
        "text": "Each one is sung in three speeds: one swara per beat, then two, then four. The [[tala]] does not change between them — see [[kalam]]. Most teachers will not move you to the next varisai until all three speeds are clean."
      },
      {
        "kind": "try",
        "text": "Sing the first sarali varisai with the drone running, counting Adi tala with your hand. Say each swara name out loud as you sing it. If the hand and the voice come apart, slow down until they do not.",
        "demo": {
          "kind": "tala",
          "talaId": "adi"
        }
      },
      {
        "kind": "note",
        "text": "The number of sarali varisais and their exact order differ between schools. Most books print fourteen; some give more, and some order them differently. Sing your teacher's set. Where a book and a teacher disagree, the teacher governs — see [[patantara]]."
      }
    ]
  },
  {
    "id": "sruti",
    "term": "sruti",
    "iso": "śruti",
    "devanagari": "श्रुति",
    "telugu": "శ్రుతి",
    "say": "SHROO-thi",
    "short": "The one pitch you choose as your home note — you call it Sa, a drone holds it under you the whole time you sing, and every other note is heard as a distance from it.",
    "see": [
      "swara",
      "tanpura",
      "kattai",
      "sadhana"
    ],
    "body": [
      {
        "kind": "p",
        "text": "Carnatic music has no fixed concert pitch. Nothing says your home note must be the one a piano calls C. You pick a pitch your voice sits well in, and from that moment on, that pitch is Sa. Every [[swara]], every phrase, every song you ever sing is heard in relation to it."
      },
      {
        "kind": "audio",
        "label": "A drone holding one sruti",
        "demo": {
          "kind": "drone"
        }
      },
      {
        "kind": "p",
        "text": "This is why a drone sounds continuously in Carnatic music. The [[tanpura]], or the electronic box that stands in for it, plays no tune. It sounds your chosen pitch, over and over, for as long as you sing. Without it you can be perfectly consistent and still be singing the entire piece flat, and never once know."
      },
      {
        "kind": "note",
        "text": "The word has a second, quite separate meaning. In classical theory, sruti also names the twenty-two microtonal intervals that older texts use to divide the octave — pitch distances finer than any of the twelve positions a singer actually names. Both senses are correct and both are in use. When a musician asks 'what is your sruti?', they mean the first sense: which pitch is your Sa. That is the sense this app means, everywhere."
      },
      {
        "kind": "try",
        "text": "Play the drone. Hum along with it, quietly, until the sound stops wavering and your voice seems to vanish into it. That moment, when you cannot separate your note from the drone's, is what being in sruti feels like from the inside. Find it before you sing anything else.",
        "demo": {
          "kind": "drone"
        }
      }
    ]
  },
  {
    "id": "sthayi",
    "term": "sthayi",
    "iso": "sthāyi",
    "devanagari": "स्थायी",
    "telugu": "స్థాయి",
    "say": "STHAA-yi",
    "short": "A register — the same seven swaras sung an octave lower or higher; three are named in ordinary practice, and beginners work almost entirely in the middle one.",
    "see": [
      "mandra",
      "madhya",
      "tara",
      "kattai"
    ],
    "body": [
      {
        "kind": "p",
        "text": "The three are [[mandra]] below, [[madhya]] in the middle, and [[tara]] above. Together they span three octaves. In practice a trained voice works across about two and a half of them — the top and bottom of the outer registers are rarely reached. Registers beyond those exist and have names, but they are the territory of instruments and of a few exceptional singers."
      },
      {
        "kind": "audio",
        "label": "The same Sa in three registers",
        "demo": {
          "kind": "swaras",
          "bpm": 50,
          "swaras": [
            {
              "swara": "S",
              "octave": -1,
              "duration": 2
            },
            {
              "swara": "S",
              "octave": 0,
              "duration": 2
            },
            {
              "swara": "S",
              "octave": 1,
              "duration": 2
            }
          ]
        }
      },
      {
        "kind": "p",
        "text": "Choosing your [[sruti]] is really the act of deciding where your comfortable range sits. Set Sa too low and the upper register becomes a struggle; too high and the lower one disappears. Both ends have to work, because compositions use both."
      },
      {
        "kind": "note",
        "text": "In written notation, a dot under a swara letter puts it in mandra and a dot above puts it in tara. A letter with no dot is madhya. Some books use other marks; the dots are the most common convention."
      }
    ]
  },
  {
    "id": "sthayi-varisai",
    "term": "sthayi varisai",
    "say": "STHAA-yi va-ri-sai",
    "short": "The exercises that take you above and below the middle octave — melsthayi upward, keezhsthayi downward — extending the range the earlier varisai built.",
    "see": [
      "varisai",
      "sthayi",
      "mandra",
      "tara"
    ],
    "body": [
      {
        "kind": "p",
        "text": "The [[sarali-varisai|sarali]], [[janta-varisai|janta]] and [[dhatu-varisai|dhatu]] exercises all live in one octave. These take the same habits outward: melsthayi varisai climb into the [[tara]] register, keezhsthayi varisai descend into [[mandra]]."
      },
      {
        "kind": "p",
        "text": "They are placed here for a reason. Reaching high and low notes is not difficult — anyone can produce them once. Producing them in tune, in time, and without the tone thinning or the throat tightening is what takes months, and it depends on everything the earlier exercises built."
      },
      {
        "kind": "watch",
        "text": "Straining upward is the fastest way to acquire a habit that then takes far longer to remove than it took to form. If a note needs force, your [[sruti]] may be set too high, or the note is simply not available yet. Both are fine. Neither is fixed by pushing."
      }
    ]
  },
  {
    "id": "swara",
    "term": "swara",
    "iso": "svara",
    "devanagari": "स्वर",
    "telugu": "స్వరం",
    "say": "SWA-ra",
    "short": "One of the seven named notes — Sa, Ri, Ga, Ma, Pa, Da, Ni — which you sing by its name rather than on a neutral syllable like 'la'.",
    "see": [
      "swarasthana",
      "sruti",
      "sarali-varisai",
      "raga"
    ],
    "body": [
      {
        "kind": "p",
        "text": "The full names are shadja, rishabha, gandhara, madhyama, panchama, dhaivata and nishada. In singing they are shortened to Sa, Ri, Ga, Ma, Pa, Da, Ni. Beginners sing these names aloud for months. Saying the name while you sing the note is not a memory aid. It is how the ear learns to hear a pitch as a position in a scale rather than as an isolated sound."
      },
      {
        "kind": "audio",
        "label": "The seven swaras, up and back down",
        "demo": {
          "kind": "swaras",
          "ragaId": "mayamalavagowla",
          "bpm": 60,
          "swaras": [
            {
              "swara": "S",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "R",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "G",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "M",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "P",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "D",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "N",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "S",
              "octave": 1,
              "duration": 2
            },
            {
              "swara": "N",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "D",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "P",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "M",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "G",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "R",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "S",
              "octave": 0,
              "duration": 2
            }
          ]
        }
      },
      {
        "kind": "p",
        "text": "Sa and Pa never move. Their pitch is fixed relative to whatever Sa you chose. The other five each have more than one possible position, and which position a note takes depends on the [[raga]]. That is covered under [[swarasthana]]."
      },
      {
        "kind": "note",
        "text": "There is no eighth swara. The scale closes by arriving at Sa again, an octave higher. Hindustani music uses the same seven with slightly different short names — 'Re' where Carnatic says 'Ri'."
      },
      {
        "kind": "watch",
        "text": "Sa is not C. Sa is whatever pitch you chose as your [[sruti]]. Two singers can both sing 'Sa Ri Ga Ma' and produce completely different pitches, and both are right."
      }
    ]
  },
  {
    "id": "swarajati",
    "term": "swarajati",
    "iso": "svarajati",
    "devanagari": "स्वरजति",
    "telugu": "స్వరజతి",
    "say": "swa-ra-JA-thi",
    "short": "The teaching piece that follows the geetam: it has sections and a returning line, and is learned first in swara names and then again with its words.",
    "see": [
      "geetam",
      "varnam",
      "pallavi",
      "charanam"
    ],
    "body": [
      {
        "kind": "p",
        "text": "A swarajati has a [[pallavi]], an [[anupallavi]] and one or more [[charanam|charanams]] — the same architecture as the concert repertoire, at a size a student can hold. The \"jati\" in the name is generally taken to refer to jati syllables — spoken rhythmic patterns the form carried over from dance — which the versions sung today no longer use."
      },
      {
        "kind": "p",
        "text": "The syllabus runs geetam, swarajati, [[varnam]], [[keerthana]], and each step adds exactly one new difficulty. The swarajati's contribution is structure: learning to leave a line and come back to it, and to hear the piece as having parts."
      },
      {
        "kind": "try",
        "text": "Whatever piece you are learning, learn it in swaras before you learn it in words. The swara version states the pitch outright, which the words never do — so mistakes that hide behind syllables become obvious."
      },
      {
        "kind": "note",
        "text": "There is a second, unrelated sense worth knowing so you are not confused later. Syama Sastri's swarajatis are full concert compositions of considerable difficulty, not beginner material, despite the shared name. The form also has a history in dance."
      }
    ]
  },
  {
    "id": "swarasthana",
    "term": "swarasthana",
    "iso": "svarasthāna",
    "devanagari": "स्वरस्थान",
    "telugu": "స్వరస్థానం",
    "say": "swa-ra-STHAA-na",
    "short": "The exact pitch a swara is sung at — there are seven swara names but twelve usable positions in an octave, described by sixteen named swarasthanas, because four positions carry two names each.",
    "see": [
      "swara",
      "melakarta",
      "raga",
      "mayamalavagowla"
    ],
    "body": [
      {
        "kind": "p",
        "text": "Count them. Sa has one position and Pa has one. Ma has two. Ri, Ga, Da and Ni have three each. That is sixteen named positions in total. But the octave holds only twelve distinct pitches, so four of those sixteen names must be sharing a pitch with another name."
      },
      {
        "kind": "p",
        "text": "The four shared pitches are these: the second Ri sits on the same pitch as the first Ga, the third Ri on the same pitch as the second Ga, and the same doubling happens between Da and Ni. Which name you use is decided by the raga, not by the pitch. If the melody treats that pitch as its second degree, it is a Ri; if it treats it as the third, it is a Ga. The name follows the note's job in the scale."
      },
      {
        "kind": "audio",
        "label": "Mayamalavagowla, whose Ri and Da sit at their lowest positions",
        "demo": {
          "kind": "swaras",
          "ragaId": "mayamalavagowla",
          "bpm": 56,
          "swaras": [
            {
              "swara": "S",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "R",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "G",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "M",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "P",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "D",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "N",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "S",
              "octave": 1,
              "duration": 2
            }
          ]
        }
      },
      {
        "kind": "note",
        "text": "You will meet the shorthand R1, R2, R3, G1, G2, G3, M1, M2, D1, D2, D3, N1, N2, N3, with the numbers rising in pitch within each name. The older Sanskrit terms — shuddha, chatusruti, shatsruti, sadharana, antara, kaisiki, kakali, prati — say exactly the same thing, and books about [[raga|ragas]] use them constantly."
      },
      {
        "kind": "watch",
        "text": "Do not try to memorise all sixteen before you can sing seven in tune. The list is a map. A map is no use until you can walk."
      }
    ]
  },
  {
    "id": "tala",
    "term": "tala",
    "iso": "tāḷa",
    "devanagari": "ताल",
    "telugu": "తాళం",
    "say": "TAA-lum",
    "short": "The repeating cycle of beats a piece is set in — a fixed number of counts that returns to its first beat every time it ends, and which you keep visibly with your hand.",
    "see": [
      "adi-tala",
      "anga",
      "avartana",
      "akshara",
      "kriya"
    ],
    "body": [
      {
        "kind": "p",
        "text": "A tala is not quite a time signature. It is a counted cycle with named parts, and you are expected to keep it with a physical gesture while you sing, not merely to feel it. In a concert you can see the whole audience counting. That visibility is deliberate: it is how everyone stays in the same place in the cycle."
      },
      {
        "kind": "audio",
        "label": "Adi tala, eight beats, cycling",
        "demo": {
          "kind": "tala",
          "talaId": "adi"
        }
      },
      {
        "kind": "p",
        "text": "Talas are built by stringing together standard parts called [[anga|angas]]: the [[laghu]], whose length varies, and the [[drutam]] and [[anudrutam]], whose lengths do not. Seven basic talas are learned in the syllabus, and because the laghu can take five different lengths, those seven generate thirty-five in the full system."
      },
      {
        "kind": "note",
        "text": "Alongside those sit the chapu talas — misra chapu of seven counts and khanda chapu of five — which are counted with their own clapping pattern rather than the usual angas. The exact pattern of claps varies between teachers, so learn it from the person teaching you rather than from a book."
      },
      {
        "kind": "watch",
        "text": "Counting only when the music is easy. The hand stopping during a hard passage is the single most common fault in a beginner, and it is the one that keeps a student out of ensembles for years."
      }
    ]
  },
  {
    "id": "tanpura",
    "term": "tanpura",
    "iso": "tānpūrā",
    "devanagari": "तानपुरा",
    "telugu": "తంబూరా",
    "say": "TAN-poo-ra",
    "short": "The long-necked instrument that plays no tune, only your chosen sruti, continuously — so every note you sing is measured against something instead of against nothing.",
    "see": [
      "sruti",
      "kattai",
      "sadhana",
      "swara"
    ],
    "body": [
      {
        "kind": "p",
        "text": "Four strings, plucked slowly and endlessly in turn. Two are tuned to your Sa, one to the Sa an octave below, and one to Pa — or to Ma, for ragas that have no Pa. It has no melodic role at all. Its entire job is to be the reference."
      },
      {
        "kind": "audio",
        "label": "A drone on one sruti",
        "demo": {
          "kind": "drone"
        }
      },
      {
        "kind": "p",
        "text": "A thread laid under the strings at the bridge makes each note bloom into its overtones, so what you hear is not a single pitch but a haze containing the notes above it. That is why singing against it is so informative: your note is being compared with a whole spectrum, and small errors beat audibly against it rather than passing unnoticed."
      },
      {
        "kind": "note",
        "text": "It is called tanpura in the north and tambura in the south; both names are current. Nearly all students now practise with an electronic sruti box or a phone app, which is entirely normal. What is not acceptable is practising with no drone at all — without a reference you can rehearse a wrong pitch for an hour and get better at it."
      }
    ]
  },
  {
    "id": "tara",
    "term": "tara",
    "iso": "tāra",
    "devanagari": "तार",
    "telugu": "తార",
    "say": "TAA-ra",
    "short": "The register above your home octave — the high notes, written with a dot above the swara letter.",
    "see": [
      "sthayi",
      "madhya",
      "anupallavi",
      "kattai"
    ],
    "body": [
      {
        "kind": "p",
        "text": "Tara begins at the Sa an octave above yours. Compositions go there deliberately: the [[anupallavi]] of a song very often climbs into this register, which is part of how a piece builds."
      },
      {
        "kind": "audio",
        "label": "Reaching into the upper register",
        "demo": {
          "kind": "swaras",
          "ragaId": "mayamalavagowla",
          "bpm": 54,
          "swaras": [
            {
              "swara": "P",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "D",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "N",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "S",
              "octave": 1,
              "duration": 2
            },
            {
              "swara": "R",
              "octave": 1,
              "duration": 1
            },
            {
              "swara": "G",
              "octave": 1,
              "duration": 2
            }
          ]
        }
      },
      {
        "kind": "p",
        "text": "Height should cost breath, not throat. If the upper register hurts, two things are worth checking before you conclude you cannot sing high: whether your [[sruti]] has been set too high for you, and whether you are reaching with the throat instead of supporting from lower down. A teacher can tell in one minute which of the two it is."
      },
      {
        "kind": "watch",
        "text": "Getting loud as you go up. Volume and pitch are separate, but almost every beginner couples them, and the coupling is hard to undo later."
      }
    ]
  },
  {
    "id": "varisai",
    "term": "varisai",
    "iso": "varisai",
    "say": "va-ri-SAI",
    "short": "A graded exercise sung in swara names — the drill sets every beginner works through for months before touching a song.",
    "see": [
      "sarali-varisai",
      "janta-varisai",
      "dhatu-varisai",
      "alankara",
      "sadhana"
    ],
    "body": [
      {
        "kind": "p",
        "text": "They come in a fixed order: [[sarali-varisai|sarali]] first, then [[janta-varisai|janta]], then sets covering the upper and lower registers, then [[dhatu-varisai|dhatu]], then the [[alankara|alankaras]]. Nearly all of them are in [[mayamalavagowla]], so that only one thing is new at a time."
      },
      {
        "kind": "p",
        "text": "What they train is not finger memory, because there are no fingers. They train three things at once: putting each swara at the right pitch, holding a steady tempo, and keeping the [[tala]] with your hand while your mouth is busy doing something else. The third is the one beginners underestimate."
      },
      {
        "kind": "audio",
        "label": "The first sarali varisai",
        "demo": {
          "kind": "swaras",
          "ragaId": "mayamalavagowla",
          "bpm": 60,
          "swaras": [
            {
              "swara": "S",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "R",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "G",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "M",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "P",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "D",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "N",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "S",
              "octave": 1,
              "duration": 1
            },
            {
              "swara": "S",
              "octave": 1,
              "duration": 1
            },
            {
              "swara": "N",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "D",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "P",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "M",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "G",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "R",
              "octave": 0,
              "duration": 1
            },
            {
              "swara": "S",
              "octave": 0,
              "duration": 1
            }
          ]
        }
      },
      {
        "kind": "note",
        "text": "The word is Tamil. In Telugu-medium teaching the same exercises are called swaralu or swaravali — sarali swaralu, janta swaralu. The exercises are the same ones; only the names differ by region."
      },
      {
        "kind": "watch",
        "text": "Racing through them. A varisai sung fast and slightly out of tune teaches you to sing fast and slightly out of tune, and it teaches it very effectively. Slow enough to be right is the correct speed, whatever that turns out to be."
      }
    ]
  },
  {
    "id": "varnam",
    "term": "varnam",
    "iso": "varṇaṁ",
    "devanagari": "वर्णम्",
    "telugu": "వర్ణం",
    "say": "VAR-nam",
    "short": "A composition that concentrates a raga's characteristic phrases into a few dense minutes — the piece that turns an exercise-singer into a musician, and the one nearly everyone struggles with.",
    "see": [
      "swarajati",
      "keerthana",
      "karvai",
      "kalam",
      "raga"
    ],
    "body": [
      {
        "kind": "p",
        "text": "The structure has two halves. The first is [[pallavi]], [[anupallavi]], and then a swara passage called the muktayi swara. The second half opens with a returning line — the charanam, also called the ettugada pallavi — followed by a series of swara passages that get longer as they go."
      },
      {
        "kind": "p",
        "text": "It is sung in two speeds, and the second speed is why the form is feared. Nothing earlier in the syllabus demands that much pitch accuracy at that density while the hand keeps the [[tala]]. Many varnams are in [[adi-tala|Adi tala]]; the Ata tala varnams are a harder category of their own."
      },
      {
        "kind": "p",
        "text": "What a varnam is actually for is the raga. Its phrases are chosen to be the phrases that define the raga, packed close together with little padding. Learning one properly teaches you more about that raga than a dozen songs in it."
      },
      {
        "kind": "p",
        "text": "Say the honest thing: students commonly spend a year on their first varnam and go on returning to it for decades. That is the normal shape of it, not a sign of being slow."
      },
      {
        "kind": "note",
        "text": "Two broad kinds. Tana varnams are for practice and for opening concerts. Pada varnams, also called chauka varnams, are slower and set words to the swara passages as well; they come from the dance repertoire, though they are sung in concerts too."
      }
    ]
  }
]

export const GLOSSARY_BY_ID: Record<string, GlossaryTerm> = Object.fromEntries(
  GLOSSARY.map((t) => [t.id, t]),
)

export function lookupTerm(id: string): GlossaryTerm | undefined {
  return GLOSSARY_BY_ID[id]
}
