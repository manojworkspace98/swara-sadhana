// Generated from the drafted teaching content, then fact-checked and
// corrected. Edit this file directly — the draft is not kept.
//
// The card attached to a lesson, read at the moment the lesson needs it.
import type { TheoryCard } from './types'

export const THEORY_CARDS: TheoryCard[] = [
  {
    "id": "sruti",
    "title": "Sruti: the pitch everything is measured from",
    "summary": "Your sruti is the one pitch you choose to sing from, and every other note is defined by its distance from it.",
    "terms": [
      "sruti",
      "tanpura",
      "swara",
      "raga"
    ],
    "body": [
      {
        "kind": "p",
        "text": "Pick a pitch. Sing it. Hold it. That pitch is your [[sruti]] — the Sanskrit word means roughly 'that which is heard', and in daily use it names the one reference pitch a singer builds everything else on. It is not a note printed on a page. It is a decision about your own voice that you then keep."
      },
      {
        "kind": "audio",
        "label": "Hear a sruti held",
        "demo": {
          "kind": "drone"
        }
      },
      {
        "kind": "p",
        "text": "That continuous sound is a drone. Traditionally it comes from a [[tanpura]] (also called tambura), a long-necked instrument whose strings are plucked in a slow unending cycle so the reference never goes away. Most people now use an electronic sruti box or an app. What matters is that the pitch is present the whole time you sing."
      },
      {
        "kind": "p",
        "text": "Here is why it sits underneath everything else. Carnatic music has no fixed external reference the way Western notation has a fixed A. A [[swara]] is not an absolute frequency. It is a distance from your Sa, and your Sa is wherever you put it. The same piece sung by two people can sit at completely different absolute pitches and be the same music. When an accompanying violin tunes, it tunes to the singer."
      },
      {
        "kind": "note",
        "text": "The word has a second, unrelated meaning you will meet in books. Classical theory divides the octave into twenty-two unequal microtonal intervals, and each of those is also called a sruti. How those twenty-two map onto what singers actually do is still debated. When this app says sruti, it always means the first sense: your chosen tonic."
      },
      {
        "kind": "p",
        "text": "Choosing yours is a teacher's job, and it is not the lowest note you can produce. It is the pitch from which about two octaves are available without strain — some room below, more above. In South India you will hear sruti named by number, as in 'one kattai' or 'five kattai', a shorthand borrowed from harmonium keys where one kattai is C. Treat the number as a label, not as the point."
      },
      {
        "kind": "try",
        "text": "Start the drone. Hum quietly until your hum stops fighting the sound and starts disappearing into it. That disappearing is what being in tune feels like from the inside. It is a physical sensation, not a judgement you make afterwards.",
        "demo": {
          "kind": "drone"
        }
      },
      {
        "kind": "watch",
        "text": "Beginners stop listening to the drone once they start singing, and drift flat over a few minutes without noticing. The drone is not background. If you cannot hear it while you sing, it is too quiet or you are too loud."
      }
    ]
  },
  {
    "id": "sthayi",
    "title": "Sthayi: the three registers",
    "summary": "The same seven swaras repeat in a lower, middle and upper register, and notation marks which one you are in with a dot.",
    "terms": [
      "sthayi",
      "madhya",
      "mandra",
      "tara",
      "swara",
      "sruti"
    ],
    "body": [
      {
        "kind": "p",
        "text": "[[sthayi]] means register — one octave's worth of the seven swaras. You work in three of them. [[madhya|Madhya sthayi]] is the middle register, where your Sa sits and where most singing happens. [[mandra|Mandra sthayi]] is the register below it. [[tara|Tara sthayi]] is the one above."
      },
      {
        "kind": "audio",
        "label": "Sa in all three registers",
        "demo": {
          "kind": "swaras",
          "ragaId": "mayamalavagowla",
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
        "text": "All three are called Sa. They are the same swara at three heights, and in Carnatic thinking they are genuinely the same note, not three different ones. Registers further out exist and have names — anumandra below, atitara above — but singers rarely need them."
      },
      {
        "kind": "p",
        "text": "Notation marks the register with a dot: a dot below the letter for mandra, a dot above for tara, nothing at all for madhya. So plain S is your middle Sa, and S with a dot above is the Sa an octave higher. The dot is not an ornament and not an accent. It is the only thing telling you which octave to sing in."
      },
      {
        "kind": "note",
        "text": "Written conventions vary. Depending on the book, the script and the era you may see dots, apostrophes, capitals against lowercase, or a small number. They all encode the same thing. Check which convention a source uses before you trust its dots."
      },
      {
        "kind": "watch",
        "text": "The most common notation error is reading a dotted S as a different swara instead of the same swara moved an octave. The second is ignoring the dot entirely and singing everything in the middle, which quietly removes the whole difficulty the exercise was written to create."
      }
    ]
  },
  {
    "id": "breath",
    "title": "Breath and posture",
    "summary": "A sung note lasts as long as the air lasts and is as steady as the air is steady, which is why breath is trained before anything musical.",
    "terms": [
      "gamaka",
      "sruti"
    ],
    "body": [
      {
        "kind": "p",
        "text": "Singing is a controlled leak. Air leaves your lungs, passes the vocal folds, and becomes sound. Everything you will be asked to do musically — hold a long note, keep a pitch still, move between notes smoothly — depends on that leak being steady. This comes first because nothing above it can be fixed while it is unsteady."
      },
      {
        "kind": "p",
        "text": "Sit upright. Traditionally cross-legged on the floor; a chair is fine if both feet are flat on the ground. Spine tall, shoulders down and still, chin level. The reasons are mechanical: a collapsed ribcage cannot take a low breath, and a lifted chin tightens the throat exactly where you need it loose."
      },
      {
        "kind": "p",
        "text": "Breathe low. The ribs widen sideways, the belly moves out, the shoulders stay where they are. Put a hand flat on your stomach to check — the hand should move outward as you inhale. If your shoulders rise instead, the breath went high into the chest, and a high breath empties fast and unevenly."
      },
      {
        "kind": "try",
        "text": "Breathe in through the nose for a slow count of four. Let it out on a steady hiss for eight. The hiss must not surge or fade. When eight is easy, go to twelve. You are not building lung capacity so much as learning to release air at a rate you choose."
      },
      {
        "kind": "p",
        "text": "A note without support goes flat at the end, when the air runs low and the pitch sags. Later, when you learn [[gamaka]], the ornaments demand a stream steady enough to move a pitch deliberately on top of it. You cannot shape something that is already wobbling on its own."
      },
      {
        "kind": "watch",
        "text": "Taking an enormous breath and then squeezing it out under pressure. More air is not more support. Support is control of the rate, and a over-full chest usually produces a hard, pushed tone in the first two seconds."
      },
      {
        "kind": "note",
        "text": "Carnatic teaching often trains breath indirectly — through long held notes and long phrases — rather than through a separate breathing syllabus. How explicitly a teacher addresses it varies a good deal from one lineage to another."
      }
    ]
  },
  {
    "id": "akara",
    "title": "Akara: singing on 'aa'",
    "summary": "Akara is singing on the open vowel 'aa' with no words and no swara names, which exposes the voice with nothing to hide behind.",
    "terms": [
      "akara",
      "swara",
      "raga",
      "sruti",
      "gamaka"
    ],
    "body": [
      {
        "kind": "p",
        "text": "[[akara]] means singing on the vowel 'aa' — a-kara is 'the letter a'. No words, no [[swara]] names, no consonants at all. Just the vowel, carried across whatever notes the exercise asks for."
      },
      {
        "kind": "try",
        "text": "With the drone on, sing your middle Sa on 'aa'. Hold it for as long as the tone stays even. Stop when it starts to waver rather than pushing to the end of your air.",
        "demo": {
          "kind": "drone"
        }
      },
      {
        "kind": "p",
        "text": "The vowel is chosen deliberately. 'Aa' is the most open sound available: jaw dropped, tongue low and out of the way, throat unobstructed. Nothing about the shape is helping you and nothing is hiding you. Any unsteadiness in the tone is audible immediately."
      },
      {
        "kind": "p",
        "text": "It also trains continuity. Consonants let you restart a note — a fresh 'ta' or 'ma' resets the tone and covers a rough joint between two pitches. On akara there is no reset. The line has to be genuinely continuous, so the connections between notes become something you must actually do rather than something a consonant conceals."
      },
      {
        "kind": "p",
        "text": "This is preparation for real repertoire. Alapana, the unmetered exploration that opens a [[raga]], is sung largely on open vowels and syllables of this kind. Singers also return to their exercises on akara after learning them with names, which is much harder and much more revealing."
      },
      {
        "kind": "watch",
        "text": "The vowel drifting as you go higher — 'aa' turning into 'aw' or a swallowed 'uh' — because the jaw tightens on the way up. Also singing akara loudly to make it sound strong. Volume is not tone, and a pushed 'aa' teaches the throat a habit you will spend months undoing."
      }
    ]
  },
  {
    "id": "swara",
    "title": "Swaras: seven names, twelve positions, sixteen names",
    "summary": "There are seven swara names but twelve pitch positions in the octave and sixteen named positions, because Sa and Pa never move and four pairs of names share a pitch.",
    "terms": [
      "swara",
      "swarasthana",
      "sruti",
      "raga",
      "melakarta",
      "gamaka"
    ],
    "body": [
      {
        "kind": "p",
        "text": "There are seven [[swara]] names: Sa, Ri, Ga, Ma, Pa, Da, Ni. In full they are Shadja, Rishabha, Gandhara, Madhyama, Panchama, Dhaivata and Nishada. You will see Da written as Dha; both are common and they mean the same thing."
      },
      {
        "kind": "audio",
        "label": "The seven swaras, ascending and back",
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
        "text": "Sa and Pa do not move. Sa is your [[sruti]], and Pa sits a fixed distance above it. They are called prakriti swaras — the unchanging ones. The other five are vikriti swaras, and each has more than one available pitch. This is the fact that makes the counting confusing, so take it slowly."
      },
      {
        "kind": "p",
        "text": "Counting by pitch, there are twelve positions in the octave, which line up closely enough with the twelve semitone positions of a piano octave to use as a map. Counting by name, there are sixteen named positions, called [[swarasthana|swarasthanas]] — one each for Sa and Pa, two for Ma, three each for Ri, Ga, Da and Ni. Sixteen names over twelve pitches means four names are duplicates: four pairs land on exactly the same pitch."
      },
      {
        "kind": "list",
        "items": [
          "Chatusruti Ri and Suddha Ga are the same pitch, two semitones above Sa",
          "Shatsruti Ri and Sadharana Ga are the same pitch, three semitones above Sa",
          "Chatusruti Da and Suddha Ni are the same pitch, nine semitones above Sa",
          "Shatsruti Da and Kaisiki Ni are the same pitch, ten semitones above Sa"
        ]
      },
      {
        "kind": "note",
        "text": "Two names for one pitch is not sloppiness, it is grammar. Each of the seventy-two parent scales takes its swaras one name each, so a parent scale cannot contain two kinds of Ri and no Ga. Some ragas derived from them do borrow a second variety of a swara, but that is a long way off. When a raga needs a note at three semitones and has already used its Ri, that note is called Ga. The pitch is identical; the name records the note's role in the scale."
      },
      {
        "kind": "watch",
        "text": "Treating 'Ri' as a fixed pitch. It is not. Ri without a qualifier is an incomplete instruction, the way 'the third' is incomplete without knowing major or minor. Early exercises hide this because they stay in one raga, and the first time you change raga the assumption breaks."
      }
    ]
  },
  {
    "id": "tala-basics",
    "title": "Tala: the shape of time",
    "summary": "A tala is a repeating cycle of counted units, built from a small set of sections whose lengths are fixed by rule.",
    "terms": [
      "tala",
      "akshara",
      "avartana",
      "anga",
      "laghu",
      "drutam",
      "anudrutam",
      "jati",
      "kriya"
    ],
    "body": [
      {
        "kind": "p",
        "text": "A [[tala]] is a cycle of time. It is not a rhythm the way a drum pattern is a rhythm — it is the frame the rhythm happens inside. It repeats, and every repetition is exactly the same length. Melodies come and go across it; the cycle does not adjust to them."
      },
      {
        "kind": "audio",
        "label": "A four-unit cycle, repeating",
        "demo": {
          "kind": "tala",
          "talaId": "eka"
        }
      },
      {
        "kind": "p",
        "text": "Three words carry most of the system. An [[akshara]] is the smallest counted unit, one step of the cycle. An [[avartana]] is one full turn of the cycle, from the start back round to the start. An [[anga]] is a limb — a section within the cycle, with its own length and its own hand gesture."
      },
      {
        "kind": "p",
        "text": "Three angas build every tala you will meet. A [[drutam]] is always two aksharas. An [[anudrutam]] is always one. A [[laghu]] varies, and its length is set by a property called [[jati|jati]]. This is the one place a beginner has to memorise something, and it is worth doing properly because every tala name depends on it."
      },
      {
        "kind": "list",
        "items": [
          "Tisra jati laghu: 3 aksharas",
          "Chatusra jati laghu: 4 aksharas",
          "Khanda jati laghu: 5 aksharas",
          "Misra jati laghu: 7 aksharas",
          "Sankirna jati laghu: 9 aksharas"
        ]
      },
      {
        "kind": "p",
        "text": "Seven talas, the suladi sapta talas, are each a fixed arrangement of these angas — Dhruva, Matya, Rupaka, Jhampa, Triputa, Ata and Eka. Since each can take any of the five jatis, the seven arrangements produce thirty-five talas. A separate family, the chapu talas, is counted differently: misra chapu has seven aksharas and khanda chapu has five, and both are kept with claps alone rather than the anga gestures."
      },
      {
        "kind": "watch",
        "text": "Counting the music instead of counting the tala. The cycle runs continuously underneath, through long notes, through silences, through passages where nothing lines up with it. If you stop counting whenever the melody gets interesting, you have not learned the tala, you have learned the tune."
      },
      {
        "kind": "note",
        "text": "Practice and theory do not always agree here. Rupaka in the textbook is a drutam followed by a laghu, but many performing musicians count Rupaka in a way that does not match that description. If your teacher's counting differs from a book's, follow the teacher and note the difference rather than assuming one is wrong."
      }
    ]
  },
  {
    "id": "kriya",
    "title": "Kriya: counting the tala with your hand",
    "summary": "The tala is kept visibly with one hand using three gestures — a clap, a silent finger count, and a wave — and the hand leads the voice, never follows it.",
    "terms": [
      "kriya",
      "tala",
      "anga",
      "laghu",
      "drutam",
      "anudrutam",
      "jati",
      "akshara"
    ],
    "body": [
      {
        "kind": "p",
        "text": "[[kriya]] means the physical action that marks the [[tala]]. You do it with one hand, palm down on your thigh, or on your other palm — both are normal. It is not optional and it is not a beginner's aid that you later discard. Singers on stage keep the tala in their hand throughout."
      },
      {
        "kind": "p",
        "text": "There are three gestures. A clap: the palm comes down. A finger count: a fingertip touches down, usually starting from the little finger and working inward. A wave: the palm turns over and faces up. Each gesture accounts for exactly one [[akshara]]."
      },
      {
        "kind": "p",
        "text": "The [[anga|angas]] map onto them directly. A [[laghu]] is a clap followed by finger counts, enough to fill its [[jati]] — so a laghu of four is a clap plus three counts. A [[drutam]] is a clap followed by a wave, which is two. An [[anudrutam]] is a single clap, which is one. Nothing else is needed to count any tala in the system."
      },
      {
        "kind": "try",
        "text": "Put your hand on your thigh and follow this cycle: clap, count, count, count, then clap, wave, then clap, wave. That is eight. Do it ten times without singing anything, until the hand goes on its own.",
        "demo": {
          "kind": "tala",
          "talaId": "adi"
        }
      },
      {
        "kind": "p",
        "text": "Theory splits these into sasabda kriya, the audible actions, and nisabda kriya, the silent ones. Only the clap makes a sound. The finger counts and the wave are silent, and beginners undervalue them for exactly that reason — but they are what hold the internal shape of the cycle, and a cycle counted only on its claps loses its structure."
      },
      {
        "kind": "watch",
        "text": "The hand following the voice. When a passage gets difficult, the hand slows down to wait for it, which makes the mistake inaudible and therefore permanent. The hand leads. If you lose your place, keep the hand moving at its own pace and rejoin the melody when you find it."
      },
      {
        "kind": "note",
        "text": "Details vary between schools: which hand, whether you count on the thigh or the opposite palm, and which finger the count starts from. Little finger first is the most widespread convention, but do not treat a different one as an error."
      }
    ]
  },
  {
    "id": "adi-tala",
    "title": "Adi tala",
    "summary": "Adi tala is eight aksharas arranged as a laghu of four and two drutams, and nearly every beginner exercise is set in it.",
    "terms": [
      "adi-tala",
      "tala",
      "akshara",
      "laghu",
      "drutam",
      "jati",
      "avartana",
      "kriya",
      "sarali-varisai",
      "kalai"
    ],
    "body": [
      {
        "kind": "p",
        "text": "[[adi-tala|Adi tala]] is chatusra jati triputa: a [[laghu]] of four aksharas, then a [[drutam]], then another [[drutam]]. Four plus two plus two is eight. 'Adi' means first or primal, and it is the tala you will spend the most time in by a wide margin."
      },
      {
        "kind": "audio",
        "label": "One avartana of Adi tala",
        "demo": {
          "kind": "tala",
          "talaId": "adi"
        }
      },
      {
        "kind": "p",
        "text": "In the hand: clap, count, count, count — that is the laghu of four. Then clap, wave. Then clap, wave. Three claps in a cycle of eight, with the first one landing on the start of the [[avartana]]."
      },
      {
        "kind": "p",
        "text": "The reason nearly every exercise lives here is arithmetic. Eight divides cleanly by two and by four, so you can put one, two or four swaras on every [[akshara]] and the pattern still lands squarely on the start of each cycle. Nothing has to be rearranged when you speed up. That property is what makes it usable as a teaching frame."
      },
      {
        "kind": "p",
        "text": "In the first speed of the earliest exercises, one swara sits on each akshara. One [[avartana]] is therefore exactly eight swaras: Sa Ri Ga Ma Pa Da Ni Sa, ascending from your Sa to the Sa above. The first [[sarali-varisai|sarali varisai]] is that, then its descent. The exercise and the cycle were built to fit each other."
      },
      {
        "kind": "watch",
        "text": "Shortening the drutams. The laghu has four units and three finger counts to occupy them, so it feels full and takes its time. The drutams have two units each and nothing to fill them, so beginners hurry through and arrive at the next cycle early. Cycles that get shorter over a session almost always lost the time here."
      },
      {
        "kind": "note",
        "text": "Later you will meet Adi tala in two [[kalai|kalai]], where every akshara is stretched to double length and the cycle becomes sixteen units with the hand moving at half speed. It is the same tala counted more slowly, not a different one."
      }
    ]
  },
  {
    "id": "mayamalavagowla",
    "title": "Mayamalavagowla: the first raga",
    "summary": "Mayamalavagowla is the raga beginners start in, chosen for its symmetrical structure, its demanding small intervals, and its relatively plain treatment.",
    "terms": [
      "mayamalavagowla",
      "raga",
      "swara",
      "swarasthana",
      "melakarta",
      "gamaka",
      "varisai"
    ],
    "body": [
      {
        "kind": "p",
        "text": "[[mayamalavagowla|Mayamalavagowla]] is where almost everyone begins. It is the fifteenth [[melakarta|melakarta]] — one of the seventy-two parent scales that use all seven [[swara]] names in order, ascending and descending. Its notes are Sa, Suddha Ri, Antara Ga, Suddha Ma, Pa, Suddha Da, Kakali Ni."
      },
      {
        "kind": "audio",
        "label": "Mayamalavagowla, up and down",
        "demo": {
          "kind": "swaras",
          "ragaId": "mayamalavagowla",
          "bpm": 50,
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
        "text": "Measured in semitones from Sa, the steps are 1, 3, 1, 2, 1, 3, 1. Look at the halves. Sa to Ma is small step, large step, small step. Pa up to the next Sa is small step, large step, small step — the identical shape. This symmetry is the first reason usually given: you learn one interval pattern and it serves you twice, and the upper half of the scale confirms what the lower half taught."
      },
      {
        "kind": "p",
        "text": "The second reason is that the intervals are unforgiving. Ri sits one semitone above Sa and Da one semitone above Pa, which are narrow distances that reward exact placement and expose approximate placement immediately. Between them sit jumps of three semitones. A voice that can move accurately between steps that unequal has been trained rather than merely exercised."
      },
      {
        "kind": "p",
        "text": "The third reason is about [[gamaka]]. In its beginner treatment Mayamalavagowla is sung comparatively plain, with less oscillation than many ragas ask for. That lets a student learn where the notes are before learning how they move. Both things have to be learned, and this order is easier."
      },
      {
        "kind": "note",
        "text": "The beginner curriculum — this raga, the graded [[varisai|varisai]] sets, the alankaras — is traditionally credited to Purandara Dasa, the sixteenth-century composer called Sangita Pitamaha, the grandfather of music. Treat that as tradition rather than as documented history; the attribution is universally repeated and thinly evidenced. The name itself encodes its number: by the katapayadi system, the syllables 'ma' and 'ya' give five and one, read backwards as fifteen."
      },
      {
        "kind": "watch",
        "text": "Singing Ri and Da too high. Ears trained on Western scales expect a whole step above the tonic and reach for it, so Ri creeps up toward the more familiar interval. It is the single most common tuning error in this raga, and the drone will show it to you if you keep listening after you start."
      }
    ]
  },
  {
    "id": "sarali",
    "title": "Sarali varisai",
    "summary": "Sarali varisai are the first exercises: stepwise swara patterns in Mayamalavagowla set in Adi tala, sung with the note names aloud.",
    "terms": [
      "sarali-varisai",
      "varisai",
      "swara",
      "mayamalavagowla",
      "adi-tala",
      "patantara",
      "akara",
      "sruti"
    ],
    "body": [
      {
        "kind": "p",
        "text": "[[varisai|Varisai]] means a series or sequence. [[sarali-varisai|Sarali varisai]] are the first set — stepwise patterns of [[swara|swaras]] in [[mayamalavagowla|Mayamalavagowla]], set in [[adi-tala|Adi tala]], sung with the names of the notes aloud."
      },
      {
        "kind": "audio",
        "label": "The first sarali varisai",
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
        "text": "They do three jobs at once, which is why they look trivial and are not. They put the pitch positions of the raga into your voice. They put the tala into your hand. And they attach a name to each pitch while you are producing it, so that the name and the sound become one thing rather than two."
      },
      {
        "kind": "p",
        "text": "That third job is the reason you sing the names out loud instead of humming. Singing 'Ga' while producing the pitch Ga builds a link you will use for the rest of your musical life — hearing a phrase and knowing what it is made of. Once the pattern is secure you sing the same exercise on [[akara]], which is harder, because the names were also giving you something to hold on to."
      },
      {
        "kind": "p",
        "text": "The common sets run to about fourteen, each pattern rearranging the same seven notes into a new shape. The exact number, their order and their details vary by [[patantara]] — the particular version of a piece or a syllabus handed down within one teaching lineage. Different schools genuinely teach different sets, and neither is a corruption of the other."
      },
      {
        "kind": "try",
        "text": "Sing the first one slowly enough that you can hear each note settle against the drone before you leave it. If you cannot hear whether you are in tune, you are going too fast, whatever it feels like.",
        "demo": {
          "kind": "drone"
        }
      },
      {
        "kind": "watch",
        "text": "Speeding up as you get more comfortable. The exercise is not an obstacle between you and real music, and there is no credit for finishing it. A sarali varisai sung fast and approximately trains approximation, and it trains it very efficiently."
      }
    ]
  },
  {
    "id": "janta",
    "title": "Janta varisai: doubled notes",
    "summary": "Janta varisai sing every swara twice, training the voice to re-attack a note cleanly without a consonant to help it.",
    "terms": [
      "janta-varisai",
      "swara",
      "gamaka",
      "sarali-varisai",
      "patantara"
    ],
    "body": [
      {
        "kind": "p",
        "text": "[[janta-varisai|Janta varisai]] come after the sarali set. Janta means paired, and that is exactly what they are: each [[swara]] sung twice before moving on. Sa Sa, Ri Ri, Ga Ga, Ma Ma, and so on up and back down."
      },
      {
        "kind": "audio",
        "label": "Doubled notes ascending",
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
        "text": "The whole exercise is about the second note of each pair. It has to be a fresh start — the tone stopped and begun again at the same pitch — not a continuation with a bump in it. That re-articulation is a specific muscular action, and this is where it is built."
      },
      {
        "kind": "p",
        "text": "Doing it without a consonant is what makes it difficult. In speech, a new syllable restarts the sound for you. Here the pitch stays put and the vowel stays put, and the only thing that changes is that you begin the note again. There is nothing else to lean on."
      },
      {
        "kind": "p",
        "text": "It matters because a great deal of Carnatic ornamentation is built on notes being struck again rather than merely held. When you come to [[gamaka]] you will need a re-attack that is quick, controlled and does not disturb the pitch. Janta varisai is where that capacity is grown, months before you are asked to use it."
      },
      {
        "kind": "p",
        "text": "Schools differ on how they are sung. Some teach the second note of each pair with an emphasis, or approached with a quick touch of the note below, from very early on. Others keep both notes plain and equal until the voice is even, and add the shaping later. Follow your teacher's [[patantara]] rather than blending two approaches."
      },
      {
        "kind": "watch",
        "text": "Letting the pair collapse into one long note with a swell in the middle. It sounds close enough at speed and it is not the exercise at all. Sing it slowly and listen for a real gap — small, but genuinely there — between the two."
      }
    ]
  },
  {
    "id": "dhatu",
    "title": "Dhatu varisai: leaping patterns",
    "summary": "Dhatu varisai skip between notes instead of stepping, training you to find a pitch directly instead of walking to it.",
    "terms": [
      "dhatu-varisai",
      "sarali-varisai",
      "swara",
      "gamaka",
      "patantara"
    ],
    "body": [
      {
        "kind": "p",
        "text": "[[dhatu-varisai|Dhatu varisai]] — also written datu varisai — leap. Where [[sarali-varisai|sarali varisai]] walk up and down neighbouring notes, these jump over one or more, change direction, and jump back."
      },
      {
        "kind": "audio",
        "label": "A leaping shape of this kind",
        "demo": {
          "kind": "swaras",
          "ragaId": "mayamalavagowla",
          "bpm": 54,
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
              "swara": "S",
              "octave": 1,
              "duration": 2
            }
          ]
        }
      },
      {
        "kind": "p",
        "text": "The demonstration above is a shape of this type rather than any one school's exercise, since the specific patterns and their order vary by [[patantara]]. The principle is what matters and it is constant: the next note is not adjacent, so you cannot arrive by moving gradually."
      },
      {
        "kind": "p",
        "text": "That forces something new. To land on a note you have skipped to, you have to hear it before you sing it. In stepwise singing you can find your way by feel, adjusting as you go, and it mostly works. A leap removes that option — you either had the target in your ear or you did not, and the result is audible instantly."
      },
      {
        "kind": "p",
        "text": "There is a second reason this matters in Carnatic music specifically. If you reach a leapt note by sliding into it, you have not simply been imprecise — you have produced a connecting movement between two pitches, which is a musical event with meaning here. An accidental slide reads as an ornament you did not intend."
      },
      {
        "kind": "watch",
        "text": "Scooping up into the top note of an upward leap. It is the default habit of an untrained voice and it is almost inaudible to the person doing it. Record yourself once and it will be obvious; then it takes weeks of slow work to remove."
      }
    ]
  },
  {
    "id": "sthayi-varisai",
    "title": "Sthayi varisai: reaching above and below",
    "summary": "These exercises extend your range past the middle register in both directions, and they are built by approaching the edges from inside, not by starting there.",
    "terms": [
      "sthayi-varisai",
      "sthayi",
      "madhya",
      "mandra",
      "tara",
      "varisai",
      "akara",
      "sruti"
    ],
    "body": [
      {
        "kind": "p",
        "text": "[[sthayi-varisai|Sthayi varisai]] take you out of the middle register. Some go up past tara Sa, some go down below madhya Sa. Names vary by region and language — you may hear the upper ones called melsthayi varisai and the lower ones keezh sthayi — but the function is the same everywhere."
      },
      {
        "kind": "audio",
        "label": "Crossing above tara Sa",
        "demo": {
          "kind": "swaras",
          "ragaId": "mayamalavagowla",
          "bpm": 50,
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
              "duration": 1
            },
            {
              "swara": "R",
              "octave": 1,
              "duration": 1
            },
            {
              "swara": "G",
              "octave": 1,
              "duration": 1
            },
            {
              "swara": "R",
              "octave": 1,
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
              "duration": 2
            }
          ]
        }
      },
      {
        "kind": "p",
        "text": "They exist as separate exercises for a reason. [[madhya|Madhya sthayi]] is where your speaking voice already lives, so it costs you very little. The edges of your range have to be built, and the way they are built is by approaching them from inside — running up from a comfortable note into the high one, rather than attacking the high note cold."
      },
      {
        "kind": "p",
        "text": "Going up, the thing that has to increase is support, not force. The vowel wants to spread and tighten as you climb, and the jaw wants to close. Both must be resisted. A high note that is louder than the notes below it is almost always being pushed, and pushing at the top of the range is how singers injure themselves."
      },
      {
        "kind": "p",
        "text": "Going down, notes below your Sa lose volume. That is normal and it is not a fault to be corrected. The mistake is to press in order to make them as loud as the middle register. They are meant to be quieter. Let them be quiet and keep them accurate."
      },
      {
        "kind": "watch",
        "text": "Lifting the chin and the head to reach high notes. It feels like reaching upward, and it tightens exactly the muscles that need to stay free. Keep the chin level. If a note is only available with your head tilted back, it is not yet available."
      },
      {
        "kind": "note",
        "text": "You may find Western terms like chest voice and head voice useful for thinking about what changes as you climb. They are not part of traditional Carnatic vocabulary, and your teacher is more likely to say 'do not push' than to name a register mechanism."
      }
    ]
  },
  {
    "id": "alankara",
    "title": "Alankaras and the seven talas",
    "summary": "The sapta tala alankaras are patterned exercises sung one in each of the seven suladi talas, so that the time-frame is the thing being learned.",
    "terms": [
      "alankara",
      "tala",
      "anga",
      "laghu",
      "jati",
      "akshara",
      "mayamalavagowla",
      "kriya",
      "avartana"
    ],
    "body": [
      {
        "kind": "p",
        "text": "[[alankara]] means ornament or embellishment. In the beginner curriculum, the sapta tala alankaras are a set of patterned exercises, one for each of the seven suladi talas, traditionally sung in [[mayamalavagowla|Mayamalavagowla]]. They come after the varisai sets and they are where rhythm becomes the main subject."
      },
      {
        "kind": "list",
        "items": [
          "Dhruva, chatusra jati: 14 aksharas",
          "Matya, chatusra jati: 10 aksharas",
          "Rupaka, chatusra jati: 6 aksharas",
          "Jhampa, misra jati: 10 aksharas",
          "Triputa, tisra jati: 7 aksharas",
          "Ata, khanda jati: 14 aksharas",
          "Eka, chatusra jati: 4 aksharas"
        ]
      },
      {
        "kind": "audio",
        "label": "Rupaka, six aksharas",
        "demo": {
          "kind": "tala",
          "talaId": "rupaka"
        }
      },
      {
        "kind": "p",
        "text": "The melodic material stays deliberately plain. That is the design. Because the notes are undemanding, the only thing left to learn in each alankara is the cycle it sits in — and across the seven you meet every [[anga]] and four different [[laghu]] lengths in your hand. Cycles of 4, 6, 7, 10 and 14 stop you relying on the comfortable eight."
      },
      {
        "kind": "p",
        "text": "This is also the point at which counting stops being automatic. In Adi tala the hand can run on habit. In Jhampa it cannot: a [[laghu]] of seven, then a single clap, then a clap and a wave. You have to know the sequence of angas, not just feel the pulse, and that knowledge is what the seven talas are installing."
      },
      {
        "kind": "watch",
        "text": "Learning the alankara as a tune and letting the hand run on autopilot underneath. It works in the familiar talas and collapses in Jhampa, where the anudrutam is one clap and beginners give it two. If you can sing the pattern but cannot count the cycle silently on its own, you have learned the wrong half."
      },
      {
        "kind": "note",
        "text": "The jatis listed above are the standard set for these exercises and are what you will meet first. Schools often go on to sing the alankaras in other jatis and other ragas once the seven are secure."
      }
    ]
  },
  {
    "id": "kalam",
    "title": "Kalam: the three speeds",
    "summary": "Changing speed doubles how many notes you fit into each beat, and changes nothing at all about the tala or the pace of your hand.",
    "terms": [
      "kalam",
      "kala-pramanam",
      "akshara",
      "tala",
      "avartana",
      "kriya",
      "kalai",
      "laya"
    ],
    "body": [
      {
        "kind": "p",
        "text": "[[kalam|Kala]] is speed, and exercises are sung in three of them. First speed puts one swara on each [[akshara]]. Second speed puts two. Third speed puts four. Each step doubles the density of notes."
      },
      {
        "kind": "audio",
        "label": "The same phrase in first speed, then second",
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
            }
          ]
        }
      },
      {
        "kind": "p",
        "text": "Now the part that beginners get wrong, stated flatly. Changing speed changes how many notes you sing. It does not change the [[tala]]. The hand moves at exactly the same rate. One [[avartana]] takes exactly as long as it did before. The cycle is a fixed container, and second speed means you put twice as much inside it — the container does not shrink."
      },
      {
        "kind": "p",
        "text": "The tempo you choose is called [[kala-pramanam|kala pramanam]], and holding it steady is a discipline in itself. It is set at the beginning and it does not drift. Speed, in this system, is a property of the notes you are singing. It is not a property of the beat."
      },
      {
        "kind": "watch",
        "text": "The hand accelerating when the notes do. This is the most common error in the whole beginner curriculum, and it is invisible from the inside because the voice and the hand agree with each other while both run away. The fix is order of operations: start the hand, let it settle at a pace you can hold, and only then put notes into it."
      },
      {
        "kind": "note",
        "text": "Two vocabularies overlap here and it is worth separating them. The doubling scheme above is one. Separately, the words vilamba, madhyama and druta describe slow, medium and fast tempo bands. And [[kalai]] is a different word again: two-kalai stretches every akshara so the hand moves more slowly, which is close to the opposite of what kala means."
      }
    ]
  },
  {
    "id": "gamaka",
    "title": "Gamaka: ornament as substance",
    "summary": "Gamaka is the movement applied to notes, and in Carnatic music it is part of what a raga is rather than decoration added to one.",
    "terms": [
      "gamaka",
      "raga",
      "swara",
      "kampitam",
      "jaru",
      "sarali-varisai",
      "patantara",
      "mayamalavagowla"
    ],
    "body": [
      {
        "kind": "p",
        "text": "[[gamaka]] is the movement given to a [[swara]]: an oscillation around it, a slide into it from above or below, a shake, a note touched and left. Two of the common names are [[kampitam]], an oscillation, and [[jaru]], a slide between pitches."
      },
      {
        "kind": "p",
        "text": "The word 'ornament' is a poor translation and it misleads almost everyone at the start. It suggests something added on top of a note that would otherwise be complete. In Carnatic music the relationship runs the other way. The movement is not applied to the raga; to a considerable extent it constitutes the raga."
      },
      {
        "kind": "p",
        "text": "Here is the concrete form of that claim. Two ragas can use exactly the same pitch positions and still be different ragas, because what separates them is which notes oscillate, how widely, approached from where, and which notes are held still. Remove the gamaka and you do not get a plainer version of the raga. You get something that is no longer that raga at all."
      },
      {
        "kind": "p",
        "text": "A useful anchor if you know Western music: the raga Sankarabharanam uses the same pitch positions as the major scale. It does not sound like the major scale, and no one would mistake one for the other. The positions were never the thing that made it what it is."
      },
      {
        "kind": "audio",
        "label": "Mayamalavagowla, sung plain on purpose",
        "demo": {
          "kind": "swaras",
          "ragaId": "mayamalavagowla",
          "bpm": 50,
          "swaras": [
            {
              "swara": "S",
              "octave": 0,
              "duration": 2
            },
            {
              "swara": "R",
              "octave": 0,
              "duration": 2
            },
            {
              "swara": "G",
              "octave": 0,
              "duration": 2
            },
            {
              "swara": "M",
              "octave": 0,
              "duration": 2
            },
            {
              "swara": "P",
              "octave": 0,
              "duration": 2
            },
            {
              "swara": "D",
              "octave": 0,
              "duration": 2
            },
            {
              "swara": "N",
              "octave": 0,
              "duration": 2
            },
            {
              "swara": "S",
              "octave": 1,
              "duration": 3
            }
          ]
        }
      },
      {
        "kind": "p",
        "text": "That demonstration is plain by design. Early exercises in [[mayamalavagowla|Mayamalavagowla]] are sung with little ornamentation so you learn where the notes are first. Gamaka is taught afterwards, by imitation, from a teacher or at minimum from recordings — notation writes the swaras and cannot capture the movement, which is a large part of why [[patantara]], the version handed down in a particular lineage, means as much as it does."
      },
      {
        "kind": "watch",
        "text": "Imitating the wobble you hear in recordings before you can hold a note still. An oscillation is a controlled movement around a pitch you are in command of. Without that command it is simply an unsteady note, and the two are easy to confuse from the inside and impossible to confuse from outside. Do not add gamaka to your sarali varisai on your own initiative."
      },
      {
        "kind": "note",
        "text": "The classical treatises catalogue gamakas in lists of ten (dasavidha) and fifteen (panchadasa), and the lists do not agree with each other. Working musicians' vocabulary differs again by school and by language. If two sources define a gamaka name differently, they may both be reporting their own tradition accurately."
      }
    ]
  },
  {
    "id": "practice-how",
    "title": "How to practise so the repetition works",
    "summary": "Repetition is not the mechanism that makes practice work; attention is, and repetition without it entrenches whatever you did the first time.",
    "terms": [
      "sruti",
      "tala",
      "kriya",
      "varisai",
      "akara",
      "kala-pramanam"
    ],
    "body": [
      {
        "kind": "p",
        "text": "Twenty repetitions with nothing being listened for do not make you better at a [[varisai]]. They make you more consistent at whatever you did on the first one, including the parts that were wrong. This is the single most important thing to understand before you begin, because it decides whether your practice hours convert into anything."
      },
      {
        "kind": "p",
        "text": "So practise with one thing to listen for at a time. Today, this run is about whether Ri is in tune. The next is about whether the hand held its pace. The next is about whether the vowel stayed open at the top. One target per set. When you are listening for everything you are listening for nothing."
      },
      {
        "kind": "list",
        "items": [
          "The drone stays on, every time, for everything",
          "The hand keeps the tala, even while you are fixing a pitch problem",
          "The speed is slow enough that you can hear whether each note is in tune"
        ],
        "ordered": false
      },
      {
        "kind": "p",
        "text": "The third of those is the hard one, and it is hard for an unobvious reason. A speed that feels good is usually a speed at which you can no longer hear your own errors, and the feeling of fluency is precisely the feeling of having stopped monitoring. If it feels comfortable and impressive, slow it down until it feels exposed."
      },
      {
        "kind": "try",
        "text": "A twenty-five minute session that works: two minutes of breathing, five on a held note against the drone, ten on one varisai you already know, slowly, with the names, then on [[akara]], and the last eight on the newest one. New material last, when the voice is warm and the ear is awake.",
        "demo": {
          "kind": "drone"
        }
      },
      {
        "kind": "p",
        "text": "Short and daily beats long and occasional, and it is not close. A voice adapts to being asked regularly, not to being asked intensely. A session you can keep on a bad day is worth more than one you can only keep on a good one."
      },
      {
        "kind": "watch",
        "text": "Stopping the moment it goes right. Right once is chance, and chance does not persist to tomorrow. Sing it correctly three times in a row and then stop — and if the third one falls apart, you have learned something true about where you actually are."
      },
      {
        "kind": "note",
        "text": "Record yourself once a week and listen back. Your ear while you are singing is occupied with producing the sound and is not a reliable judge of it. Almost everything a teacher tells you in the first year is audible on your own recordings, if you listen to them."
      }
    ]
  }
]

export const CARDS_BY_ID: Record<string, TheoryCard> = Object.fromEntries(
  THEORY_CARDS.map((c) => [c.id, c]),
)

export function cardsFor(ids: readonly string[]): TheoryCard[] {
  return ids.map((id) => CARDS_BY_ID[id]).filter(Boolean)
}
