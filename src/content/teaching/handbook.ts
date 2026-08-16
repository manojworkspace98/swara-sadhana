// Generated from the drafted teaching content, then fact-checked and
// corrected. Edit this file directly — the draft is not kept.
//
// What to read before the first practice, and to come back to.
import type { HandbookChapter } from './types'

export const HANDBOOK: HandbookChapter[] = [
  {
    "id": "what-is-this",
    "title": "What This Music Is",
    "lead": "What Carnatic music is, how it differs from the music you already know, and how long learning to sing it honestly takes.",
    "minutes": 6,
    "terms": [
      "raga",
      "tala",
      "sruti",
      "gamaka",
      "swara",
      "varnam",
      "keerthana"
    ],
    "body": [
      {
        "kind": "p",
        "text": "Carnatic music is the classical music of south India. It is old, it is still being made, and it is taught almost entirely by ear. A teacher sings a phrase, you sing it back, the teacher corrects it, and that is the lesson. Books and notation exist. They are memory aids. The music itself passes from voice to voice."
      },
      {
        "kind": "p",
        "text": "Two ideas hold everything up. A [[raga]] is a set of notes together with the rules for how those notes behave — which ones you can rest on, which must be approached from above, which phrases belong to it and which do not. A [[tala]] is a rhythmic cycle of a fixed number of counts that repeats, unchanged, for the whole piece, and is kept with the hand. Almost everything you will sing is in some raga and some tala. A few forms are sung free of any cycle, but you will not meet them for a long time."
      },
      {
        "kind": "audio",
        "label": "Hear a drone — the sound underneath all of it",
        "demo": {
          "kind": "drone"
        }
      },
      {
        "kind": "heading",
        "text": "Where it differs from the music you already know"
      },
      {
        "kind": "p",
        "text": "There is no fixed reference pitch. In Western music A is a particular frequency, and a piece written in D major is sung in D major. Here the singer chooses one pitch to be home, calls it Sa, and every other note is defined by its distance from that. Your Sa and another singer's Sa can be different pitches and both are correct. The pitch you choose is your [[sruti]]."
      },
      {
        "kind": "p",
        "text": "There is no harmony. Nobody sings a second line beneath you and no chords move underneath the melody. What Western music spends on vertical structure, this music spends on two other things: the inside of a single melodic line, and rhythm. That is not less complexity. It is complexity along different axes."
      },
      {
        "kind": "p",
        "text": "And the notes move. In most Western singing a note is a pitch you arrive at and hold. Here a note very often slides, oscillates, or is approached from a neighbour, and that movement is called [[gamaka]]. The movement is not decoration laid over a plain note. It is closer to being part of what the note is. Two ragas can use the same pitches and remain unmistakably different ragas because their notes behave differently. This is the hardest idea for a newcomer to accept, and it changes what practice means."
      },
      {
        "kind": "note",
        "text": "It is also why a Carnatic melody typed into a keyboard sounds wrong even when every pitch is right. The pitches were never the whole of it."
      },
      {
        "kind": "heading",
        "text": "What learning to sing actually involves"
      },
      {
        "kind": "list",
        "items": [
          "Sitting with a drone every day until one pitch becomes home to your ear.",
          "Singing graded exercises, thousands of repetitions, until finding the note stops needing attention.",
          "Keeping the tala with your hand while you sing — from the first week, not later.",
          "Learning compositions by ear, phrase by phrase, from a teacher or a recording.",
          "Listening. Hours of it. Listening is not preparation for practice. It is practice."
        ]
      },
      {
        "kind": "audio",
        "label": "The seven notes you will start with",
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
        "kind": "heading",
        "text": "How long it takes"
      },
      {
        "kind": "p",
        "text": "Honestly: years, and the early part is slow in a way that has no shortcut. With twenty to thirty minutes a day, most beginners spend the first several months entirely on basic exercises before touching anything with words in it. A first [[varnam]] — the piece that marks the end of being a beginner — commonly arrives somewhere between one and three years in. Ranges like that vary enormously with the student, the teacher, and how often you actually sit down."
      },
      {
        "kind": "p",
        "text": "Written out, that sounds discouraging. In practice it is not, because what you do on day four hundred is recognisably what you did on day four, only better. There is no gate you fail to pass. There is a slow change in what your voice does without being asked."
      },
      {
        "kind": "watch",
        "text": "Starting with a song you love. Nearly everyone tries it, and it is the most reliable way to lose a year. You can imitate a [[keerthana]] well enough to recognise it long before you can sing it, and the approximation hardens into habit. Undoing a habit takes longer than never forming one."
      },
      {
        "kind": "p",
        "text": "This handbook covers what you need before your first practice sitting: the drone, your own sruti, the seven [[swara|swaras]], the tala, the order of learning, and what a day of practice contains. Read it once through. Come back to chapters one at a time as you meet the things they describe."
      }
    ]
  },
  {
    "id": "the-drone",
    "title": "The Drone",
    "lead": "Every note in this music is measured against one continuous pitch. Take it away and there is nothing to be in tune with.",
    "minutes": 4,
    "terms": [
      "sruti",
      "tanpura",
      "raga",
      "swara"
    ],
    "body": [
      {
        "kind": "p",
        "text": "Put the drone on before you sing anything. It is not accompaniment and it is not atmosphere. It is the reference against which every note you sing is defined."
      },
      {
        "kind": "audio",
        "label": "The drone",
        "demo": {
          "kind": "drone"
        }
      },
      {
        "kind": "p",
        "text": "Listen for a moment before reading on. What you hear is one pitch — Sa — sounding together with the note a fifth away from it, Pa, cycling without pause. It does not change for the length of an entire concert. Everything the singer does is heard against it."
      },
      {
        "kind": "p",
        "text": "The instrument that traditionally makes this sound is the [[tanpura]]: a long-necked instrument with four strings, usually tuned Pa, Sa, Sa and a lower Sa, plucked one after another in a slow loop that never stops. It plays no melody. Where the strings cross the bridge a thread is laid under each one. The thread makes the string buzz slightly, and the buzz throws up a cloud of overtones. That is why a tanpura sounds alive rather than like a held organ note, and why singers describe notes as appearing out of it."
      },
      {
        "kind": "note",
        "text": "In [[raga|ragas]] that contain no Pa, the first string is tuned to a different note — commonly Ma, sometimes Ni. Which one depends on the raga and on the school. You will not need this for a long time."
      },
      {
        "kind": "heading",
        "text": "What it means to sing in sruti"
      },
      {
        "kind": "p",
        "text": "[[sruti|Sruti]] here means the base pitch a singer chooses and measures everything else from. To sing in sruti is to be in the correct relationship to your own Sa. It is not about hitting a pitch that is correct in the abstract. Two singers sitting on different srutis can both be perfectly in sruti."
      },
      {
        "kind": "note",
        "text": "The word has a second, quite different meaning that you will meet in books. Classical theory divides the octave into twenty-two small intervals, also called srutis, and uses them to describe fine differences of intonation. Both senses are standard and both are correct. In this app, and in nearly all everyday talk between musicians, sruti means the base pitch — the first sense. When you open a theory text and the number twenty-two appears, that is the second."
      },
      {
        "kind": "p",
        "text": "Being out of sruti is not the same as being out of tune with a piano. A singer who sits consistently a little sharp on Ga, against a drone, sounds wrong to anyone who knows the raga, even though no absolute pitch has been violated. The drone is what makes that audible at all."
      },
      {
        "kind": "try",
        "text": "Turn the drone on and hum — hum, do not sing — until your hum stops fighting it. When you are close but not exact you will hear a slow wobble, a beating in the sound. Slide until the wobble disappears and the two sounds fuse into one. That fusing is what you are after, and it is a physical sensation as much as a sound.",
        "demo": {
          "kind": "drone"
        }
      },
      {
        "kind": "p",
        "text": "Do that daily and something happens that cannot be taught any other way: the pitch stops being information and becomes a place. After some months singers can find their Sa with no reference at all, because the drone has been running in their heads for a year."
      },
      {
        "kind": "watch",
        "text": "Practising with no drone. You will drift, usually flat, usually gradually, and you will not notice — because without a reference there is nothing to notice against. An hour spent that way can leave you worse off than an hour not practising, since what you rehearsed was the drift."
      },
      {
        "kind": "p",
        "text": "An electronic sruti box or a tanpura app is entirely normal now and is used by professionals on stage. An acoustic tanpura sounds richer and needs tuning and care. Neither fact is a reason to practise without a drone."
      },
      {
        "kind": "try",
        "text": "Start the drone now and leave it running while you read the next chapter. Get used to there being sound in the room.",
        "demo": {
          "kind": "drone"
        }
      }
    ]
  },
  {
    "id": "finding-your-sruti",
    "title": "Finding Your Sruti",
    "lead": "Your sruti is the pitch your whole practice is built on. Choosing it badly makes everything harder, and choosing it is something you can do today.",
    "minutes": 5,
    "terms": [
      "sruti",
      "sthayi",
      "tanpura",
      "swara"
    ],
    "body": [
      {
        "kind": "p",
        "text": "Choosing your [[sruti]] means choosing which pitch is your Sa. Everything follows from it: where the top of your range lands, whether the bottom of a phrase has any tone in it, how tired you are after twenty minutes."
      },
      {
        "kind": "p",
        "text": "The criterion is not the single most comfortable note in your voice. It is the pitch that puts your whole working range inside your voice at once. Most of what a beginner sings lives between the Pa below Sa and the Sa above it — about an octave and a half. Both ends have to be singable without force."
      },
      {
        "kind": "audio",
        "label": "The span your sruti has to cover, low end to high",
        "demo": {
          "kind": "swaras",
          "ragaId": "mayamalavagowla",
          "bpm": 72,
          "swaras": [
            {
              "swara": "P",
              "octave": -1,
              "duration": 2
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
              "duration": 2
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
              "duration": 3
            }
          ]
        }
      },
      {
        "kind": "heading",
        "text": "How to find it"
      },
      {
        "kind": "list",
        "ordered": true,
        "items": [
          "Sit upright, feet down, at the time of day you actually intend to practise. Voices differ morning to evening, and you want the one you will be using.",
          "Start the drone somewhere near where you expect to sit. If you have no idea at all: around C or D for many adult men, around G or A for many adult women. These are opening guesses, not rules.",
          "Hum until you match the drone's Sa and the wobble between you disappears.",
          "Open the hum into an 'aa' and hold Sa for eight slow counts. It should need no push. If you are bracing anywhere — jaw, neck, chest — that is a no.",
          "Go down to the Pa below your Sa and hold it. It must have actual tone, not just air. If it is breathy or vanishes, your sruti is too low.",
          "Go up the scale to the Sa above and hold it. It must not pinch, and you must not have to shout to reach it. If you do, your sruti is too high.",
          "Move a half step and repeat the whole test. Do this on three separate days at your usual practice time, and take the pitch that wins twice."
        ]
      },
      {
        "kind": "p",
        "text": "You are looking for the pitch that loses you the least at each end. There is usually no perfect answer, only the least bad compromise. That is normal and it is what everyone else is working with too."
      },
      {
        "kind": "p",
        "text": "Singers name their sruti either by a Western pitch letter or by a number — 'one kattai', 'five kattai'. In that numbering the whole numbers run C, D, E, F, G, A, B, and the half numbers fall between them. Sitting on a half number is completely ordinary and means nothing is wrong."
      },
      {
        "kind": "p",
        "text": "Voices differ because bodies differ: the size of the larynx, the length and mass of the vocal folds, the shape of the space above them. Adult men usually land lower than adult women, but the category is a weak predictor and your own voice is the only real evidence. Low voices and high voices exist inside every group."
      },
      {
        "kind": "watch",
        "text": "Choosing too high because it sounds brighter and more impressive on the day. It will, for about ten minutes. Then the upper octave begins to strain, you start to push, and pushing is the hardest habit in singing to undo."
      },
      {
        "kind": "watch",
        "text": "Choosing too low because low feels safe and effortless. The trouble arrives later. The tara sthayi — the octave above your Sa, where a great deal of Carnatic melody lives — becomes unreachable, and you will quietly start avoiding the phrases that go there."
      },
      {
        "kind": "p",
        "text": "Once you have chosen, hold it. You are building muscle memory against a fixed reference, and moving the reference every week throws that away. Teachers usually fix a beginner's sruti and leave it alone for a long stretch, for exactly this reason."
      },
      {
        "kind": "p",
        "text": "It can still change. Voices open up over months of practice, and a sruti chosen in the first week is sometimes half a step low a year later. Illness, sleep and age move it too. Re-check every few months, not every few days, and never in the middle of a cold."
      },
      {
        "kind": "note",
        "text": "[[sthayi|Sthayi]] means register. Madhya sthayi is the middle octave, where you mostly sing; mandra sthayi is the octave below it and tara sthayi the octave above. You will meet the words constantly, so they are worth having now."
      },
      {
        "kind": "note",
        "text": "If a teacher sets your sruti differently from what you arrive at here, use theirs. They can hear things about your voice that are not audible from inside it."
      },
      {
        "kind": "try",
        "text": "Choose one now and write it down somewhere you will see it — the pitch letter, or the number. From here on, every practice sitting begins by putting the drone on that pitch.",
        "demo": {
          "kind": "drone"
        }
      }
    ]
  },
  {
    "id": "the-swaras",
    "title": "The Swaras",
    "lead": "Seven names, twelve positions, and one idea about movement that matters more than all the counting.",
    "minutes": 5,
    "terms": [
      "swara",
      "swarasthana",
      "mayamalavagowla",
      "gamaka",
      "sthayi",
      "raga",
      "sruti"
    ],
    "body": [
      {
        "kind": "p",
        "text": "The seven [[swara|swaras]] are Sa, Ri, Ga, Ma, Pa, Dha, Ni. Their full names are shadja, rishabha, gandhara, madhyama, panchama, dhaivata and nishada, and you will hear both the short and the long forms. Written down they are usually reduced to single letters: S R G M P D N."
      },
      {
        "kind": "audio",
        "label": "Hear the names spoken",
        "demo": {
          "kind": "say",
          "text": "Sa Ri Ga Ma Pa Dha Ni"
        }
      },
      {
        "kind": "audio",
        "label": "Sing them: up and back down",
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
        "text": "If you know do-re-mi, the closest comparison is movable-do solfège. The names describe positions relative to a home note, not fixed pitches. Sa is wherever you put it. Ri is the next position up from wherever that turned out to be."
      },
      {
        "kind": "p",
        "text": "Sa and Pa are fixed in a second and more important sense: they have no variants. Ri, Ga, Dha and Ni each come in three, and Ma comes in two, sitting at different distances from Sa. Which variant a raga uses is one of the things that makes it that raga."
      },
      {
        "kind": "p",
        "text": "Count those up and you get sixteen named [[swarasthana|swarasthanas]] — swara positions. But there are only twelve distinct pitch positions in an octave. The arithmetic works because four of the names land on pitches that already carry another name: the second Ri and the first Ga are the same pitch, the third Ri and the second Ga are the same pitch, and the same doubling happens twice more between Dha and Ni. Which name applies depends on the raga. The same pitch is called Ga in one raga and Ri in another, because the raga's other notes decide what role it is playing."
      },
      {
        "kind": "note",
        "text": "You do not need to memorise the sixteen now, and nobody learns them by memorising. They arrive one raga at a time over years. What you need this month is to sing seven notes in tune against a drone."
      },
      {
        "kind": "heading",
        "text": "Mayamalavagowla"
      },
      {
        "kind": "p",
        "text": "[[mayamalavagowla|Mayamalavagowla]] is the raga beginners start in, and has been for centuries. It takes the lowest Ri, the highest Ga, the lower Ma, the lowest Dha and the highest Ni. In short form: S R1 G3 M1 P D1 N3."
      },
      {
        "kind": "audio",
        "label": "Mayamalavagowla, slowly",
        "demo": {
          "kind": "swaras",
          "ragaId": "mayamalavagowla",
          "bpm": 48,
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
              "duration": 4
            }
          ]
        }
      },
      {
        "kind": "p",
        "text": "Two reasons are usually given for starting here. The first is symmetry: the pattern of gaps in the lower half of the scale, from Sa up to Ma, is exactly the pattern in the upper half, from Pa up to the Sa above. Learn one half and you have the shape of the other. The second is that the gaps are uneven in a useful way — a very small step from Sa to Ri, then a wide leap from Ri to Ga, then a small step again. Singing those slowly and in tune forces the voice to place notes deliberately instead of sliding through them."
      },
      {
        "kind": "p",
        "text": "The choice of this raga for beginners, along with the whole graded exercise system built on it, is traditionally credited to Purandara Dasa in the sixteenth century. Traditionally credited is the accurate phrase. The attribution is standard within the tradition and difficult to document in detail."
      },
      {
        "kind": "heading",
        "text": "Octaves"
      },
      {
        "kind": "p",
        "text": "The octave you mostly sing in is the madhya [[sthayi]], the middle register. Below it is the mandra sthayi, above it the tara sthayi. In notation the register is marked with a dot: a dot under a letter drops it an octave, a dot above raises it. Some books use lowercase letters for the lower octave instead. Both conventions are in use and you will meet both."
      },
      {
        "kind": "audio",
        "label": "The same three notes in three registers",
        "demo": {
          "kind": "swaras",
          "ragaId": "mayamalavagowla",
          "bpm": 66,
          "swaras": [
            {
              "swara": "S",
              "octave": -1,
              "duration": 1
            },
            {
              "swara": "R",
              "octave": -1,
              "duration": 1
            },
            {
              "swara": "G",
              "octave": -1,
              "duration": 2
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
              "swara": "G",
              "octave": 0,
              "duration": 2
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
              "duration": 2
            }
          ]
        }
      },
      {
        "kind": "heading",
        "text": "Why the notes move"
      },
      {
        "kind": "p",
        "text": "In this music a swara is usually not a fixed point you land on. Most notes in most ragas are shaped: approached from a neighbour, oscillated, slid into or away from. That shaping is [[gamaka]], and it is not ornament applied afterwards to a plain note. It is closer to being the note's identity. A raga is defined as much by how its notes move as by which pitches it contains, which is exactly why two ragas built from identical pitches can be immediately distinguishable."
      },
      {
        "kind": "p",
        "text": "Beginners sing the swaras plain and straight, without gamaka, and that is right at first — you cannot shape a pitch you cannot yet find. But do not mistake the plain version for the thing itself. Gamaka is learned by imitation, from a voice, over a long time. No written description will give it to you, and this one has not."
      },
      {
        "kind": "watch",
        "text": "Deciding, after some months of clean straight swaras, that you can now sing the raga. Straight swaras are scaffolding. Eventually they come down."
      }
    ]
  },
  {
    "id": "the-tala",
    "title": "The Tala",
    "lead": "Time in this music is a cycle you keep returning to, and you count it with your hand where everyone can see it.",
    "minutes": 5,
    "terms": [
      "tala",
      "kriya",
      "akshara",
      "laghu",
      "drutam",
      "anudrutam",
      "adi-tala",
      "jati"
    ],
    "body": [
      {
        "kind": "p",
        "text": "A [[tala]] is a rhythmic cycle with a fixed number of counts. It repeats, unchanged, from the start of a piece to its end. Everything the singer does is placed inside it and resolves back to its first beat. It is not a time signature. A time signature tells you how beats are grouped. A tala is a specific object with named parts, a fixed length and a hand pattern that belongs to it."
      },
      {
        "kind": "p",
        "text": "You keep it with your hand. The gestures are called [[kriya|kriyas]] and they are done visibly, on the thigh or the palm, all the way through. This is not a beginner's crutch that gets discarded later — professionals keep tala on stage. Putting time outside your body makes it shared and checkable. When your hand and your voice disagree, everyone can see it, including you."
      },
      {
        "kind": "p",
        "text": "The smallest unit of a cycle is an [[akshara]], one count. A tala's length is given in aksharas."
      },
      {
        "kind": "heading",
        "text": "The three gestures"
      },
      {
        "kind": "list",
        "items": [
          "[[laghu|Laghu]] — a clap, then counts on the fingers. Its length varies, and that variability is the point of it.",
          "[[drutam|Drutam]] — a clap, then a wave, turning the hand over. Always two counts.",
          "[[anudrutam|Anudrutam]] — a single clap. Always one count."
        ]
      },
      {
        "kind": "note",
        "text": "Most schools count the fingers starting from the little finger. Some do it the other way. Follow whoever teaches you; being consistent matters far more than which direction you picked."
      },
      {
        "kind": "heading",
        "text": "Adi tala"
      },
      {
        "kind": "p",
        "text": "[[adi-tala|Adi tala]] is the one you will meet first and most often. Its full name is chatusra jati triputa tala. Triputa names the shape — laghu, drutam, drutam — and chatusra [[jati]] says the laghu is four counts long. So the cycle runs 4 + 2 + 2, eight aksharas."
      },
      {
        "kind": "try",
        "text": "Count one cycle out loud with the sound. Clap, little finger, ring finger, middle finger — that is the laghu, four counts. Then clap, wave, two counts. Then clap, wave again, two more. Eight. Now do it eight times through without looking at the screen.",
        "demo": {
          "kind": "tala",
          "talaId": "adi"
        }
      },
      {
        "kind": "p",
        "text": "The first beat of the cycle is samam. It is the strongest point in the music: phrases aim for it, and the end of a composition lands on it. Not every piece starts there — many begin a beat or two after it. Where a piece begins inside the cycle is its eduppu, and getting it wrong puts an otherwise correct rendering in the wrong place from the first line to the last."
      },
      {
        "kind": "heading",
        "text": "The other cycles"
      },
      {
        "kind": "p",
        "text": "There are seven tala families, and the laghu inside any of them can take five different lengths: three, four, five, seven or nine counts. Seven families times five laghu lengths gives the thirty-five talas of the classical system. In practice you will use a handful."
      },
      {
        "kind": "list",
        "items": [
          "Rupaka — a drutam then a laghu. With a four-count laghu that is six aksharas. In performance many musicians count rupaka as a short three-beat cycle instead, and both usages are current.",
          "Eka — a single laghu. Four counts, with a four-count laghu.",
          "Misra chapu — seven counts.",
          "Khanda chapu — five counts."
        ]
      },
      {
        "kind": "audio",
        "label": "Rupaka",
        "demo": {
          "kind": "tala",
          "talaId": "rupaka"
        }
      },
      {
        "kind": "audio",
        "label": "Misra chapu — seven",
        "demo": {
          "kind": "tala",
          "talaId": "misraChapu"
        }
      },
      {
        "kind": "note",
        "text": "The chapu talas are counted differently from the rest — claps and waves, without finger counting — and the exact pattern taught varies by school and region. Misra chapu is commonly felt as 3 + 2 + 2 and khanda chapu as 2 + 3, but you will hear both described other ways by people who are not wrong. Learn the version your teacher uses and stay with it."
      },
      {
        "kind": "heading",
        "text": "Speed"
      },
      {
        "kind": "p",
        "text": "The same cycle can be sung at different speeds, and the same melody can be sung at one note per count or two notes per count. Beginners stay in the slowest speed for a long time, then learn the same exercise at double density against the same hand pattern. The hand does not speed up. The voice fits more inside it. A great deal of early rhythm learning happens right there."
      },
      {
        "kind": "watch",
        "text": "Keeping tala with your hand while your voice quietly ignores it. This is very common. The tell is that you speed up in the passages you find easy and slow down in the hard ones, while your hand obediently follows your voice instead of leading it. The fix is to hold the hand steady and let the voice be audibly wrong, rather than the reverse."
      },
      {
        "kind": "p",
        "text": "From your first week, keep tala with your hand every single time you sing an exercise. Adding it afterwards is much harder than starting with it."
      }
    ]
  },
  {
    "id": "the-ladder",
    "title": "The Ladder",
    "lead": "The order of learning is fixed, it is old, and each rung exists to make the next one possible.",
    "minutes": 6,
    "terms": [
      "varisai",
      "alankara",
      "geetam",
      "swarajati",
      "varnam",
      "keerthana",
      "pallavi",
      "sahitya",
      "tala",
      "raga",
      "gamaka",
      "patantara"
    ],
    "body": [
      {
        "kind": "p",
        "text": "There is a standard sequence for learning to sing Carnatic music. It has been broadly the same for centuries. Schools differ on the details — which exercises, in which order, with which repertoire — but no school lets you start at the end."
      },
      {
        "kind": "list",
        "ordered": true,
        "items": [
          "[[varisai|Varisai]] — graded swara exercises.",
          "[[alankara|Alankara]] — swara patterns set in the different talas.",
          "[[geetam|Geetam]] — short compositions with words.",
          "[[swarajati|Swarajati]] — longer, with sections.",
          "[[varnam|Varnam]] — the pivot piece.",
          "[[keerthana|Keerthana]] — the concert form."
        ]
      },
      {
        "kind": "heading",
        "text": "Varisai"
      },
      {
        "kind": "p",
        "text": "Varisai means series. These are exercises made of nothing but swara names, sung in Mayamalavagowla, kept in [[tala]] with the hand. Sarali varisai come first: straight ascending and descending patterns that teach you where the notes are and train you to place them cleanly. Then janta varisai, where each note is doubled — SS RR GG MM — which is harder than it looks and starts the work of putting weight and shape onto individual notes. After those come patterns that leap rather than step, and patterns that go into the octaves above and below. The names and exact ordering of the later sets differ from school to school."
      },
      {
        "kind": "p",
        "text": "This is the stage everyone underestimates and the stage that decides how good you eventually become. You are not learning tunes. You are making pitch automatic, so that later — when your attention is on words, rhythm and expression — none of it has to be spent on finding the note."
      },
      {
        "kind": "heading",
        "text": "Alankara"
      },
      {
        "kind": "p",
        "text": "Alankaras are swara patterns again, still in Mayamalavagowla, but each one is set in a different tala. Traditionally there are seven, one for each of the seven tala families, each in a particular jati. The point is not new melodic material. The point is that your hand must now hold cycles of six, seven, ten and fourteen counts while your voice does something that does not line up with them conveniently."
      },
      {
        "kind": "heading",
        "text": "Geetam"
      },
      {
        "kind": "p",
        "text": "A geetam is a short composition with words — [[sahitya]] — usually in praise of a deity, usually sung in one speed with no melodic elaboration. It is the first time three things happen at once: melody, text and tala. The one most beginners meet first is 'Lambodara lakumikara', in raga Malahari, whose notes are drawn from Mayamalavagowla."
      },
      {
        "kind": "heading",
        "text": "Swarajati"
      },
      {
        "kind": "p",
        "text": "A swarajati has sections — a [[pallavi]], an anupallavi and one or more charanams — and typically exists in two matched layers: the same melody sung as swara names, and sung as words. This is where the sectional structure of real compositions first appears, at a length you can still hold whole in your head."
      },
      {
        "kind": "heading",
        "text": "Varnam"
      },
      {
        "kind": "p",
        "text": "The varnam is the hinge of the entire system, and reaching one is what most teachers mean when they say a student is no longer a beginner. It is a piece in two halves. Some sections have words and some are swaras only, and you learn the whole thing in swaras first. It packs the characteristic phrases of its [[raga]] into a compact form. It is sung in two speeds, the second at double density against the same tala, and it demands at once everything the earlier rungs trained separately: accurate pitch, [[gamaka]], tala, breath, stamina and text. Professionals use varnams as warm-ups for the rest of their lives."
      },
      {
        "kind": "heading",
        "text": "Keerthana"
      },
      {
        "kind": "p",
        "text": "The concert form has a pallavi, an anupallavi and a charanam. Most musicians call it a kriti; many say keerthana for the same thing. Melodic variations called sangatis accumulate through the pallavi, so the same line returns elaborated each time. Nobody learns a keerthana in one piece. It arrives a line at a time, and the sangatis only arrive once the plain line is solid."
      },
      {
        "kind": "note",
        "text": "The words keerthana and kriti are used differently by different people. A common distinction makes the keerthana simpler and text-led, and the kriti more musically elaborate. Plenty of musicians use the two interchangeably. Do not build anything on the distinction."
      },
      {
        "kind": "heading",
        "text": "Why the order holds"
      },
      {
        "kind": "p",
        "text": "Each rung automates something so that the next rung has attention free. Varisai automate pitch. Alankaras automate the cycle. Geetams automate singing words and melody together. Varnams automate gamaka inside real raga phrases. Skip a rung and whatever it was meant to automate stays manual permanently, competing for attention with everything stacked above it. That is the whole mechanism, and it is why the order is not a tradition you can politely decline."
      },
      {
        "kind": "watch",
        "text": "Deciding you have finished the sarali varisai because you can sing them. Singing something once, correctly, while looking at it is not the same as owning it. The real test is whether you can sing it in tune, in tala, at two speeds, after a bad night's sleep, without thinking about it."
      },
      {
        "kind": "note",
        "text": "Repertoire and ordering differ between lineages — the word for a lineage's particular way of doing things is [[patantara]]. Two teachers can disagree about which exercises come fourth, and both be teaching correctly. What does not vary is the shape: exercises before compositions, and varnam before the concert repertoire."
      },
      {
        "kind": "p",
        "text": "How long each rung takes varies so much that quoting numbers misleads. Varisai are usually months rather than weeks. Everything after that depends on a teacher's judgement of what you are ready for, which is one of the main things a teacher is for."
      }
    ]
  },
  {
    "id": "a-days-practice",
    "title": "A Day's Practice",
    "lead": "What to actually do when you sit down today: in what order, for how long, and what to leave out.",
    "minutes": 6,
    "terms": [
      "sruti",
      "tala",
      "varisai",
      "alankara",
      "mayamalavagowla",
      "akara"
    ],
    "body": [
      {
        "kind": "p",
        "text": "Twenty to thirty minutes every day beats two hours on Sunday, and the gap between them is not small. What you are doing is motor learning and ear calibration, and both consolidate between sessions rather than during them. Frequency is the variable that matters most."
      },
      {
        "kind": "p",
        "text": "Practise at roughly the same time each day if you can. Voices differ morning to evening, and practising on the voice you know is worth more than practising on a stranger."
      },
      {
        "kind": "heading",
        "text": "Before you sing"
      },
      {
        "kind": "list",
        "items": [
          "Sit upright, on the floor or on a chair, weight even, ribs not collapsed. Slumping shortens your breath before you have made a sound.",
          "Put the drone on, at your [[sruti]]. Not after the warm-up. Now.",
          "Phone out of reach. Twenty-five uninterrupted minutes are worth more than forty broken ones.",
          "Room-temperature water within reach."
        ]
      },
      {
        "kind": "try",
        "text": "Before making any sound at all, sit with the drone for sixty seconds and do nothing else. It feels like wasted time. It is the part of the sitting beginners skip and teachers insist on: you are letting your ear find the pitch before your voice commits to anything.",
        "demo": {
          "kind": "drone"
        }
      },
      {
        "kind": "heading",
        "text": "A thirty-minute sitting"
      },
      {
        "kind": "list",
        "ordered": true,
        "items": [
          "0–2 min. Drone on. Sit. Listen. No singing.",
          "2–7 min. [[akara|Akaram]] on Sa — the open vowel 'aa', sung on Sa alone, long and steady, one note per breath. Then Sa up to Pa and back, still on 'aa'. This warms the voice and tunes it to the drone at the same time.",
          "7–12 min. The plain scale of [[mayamalavagowla|Mayamalavagowla]], up and down, very slowly — four counts to a note. Hand keeping [[tala]].",
          "12–22 min. The day's exercise. Whatever [[varisai]] or [[alankara]] you are on: slow, with the hand, repeated. This is the real work of the sitting.",
          "22–27 min. One thing from a previous day, revisited. Not new material.",
          "27–30 min. Back to Sa on 'aa' against the drone, a few long notes, and stop."
        ]
      },
      {
        "kind": "p",
        "text": "The middle block is the sitting. Everything else is approach and landing. If you only have fifteen minutes, keep the two-minute listen, cut the day's exercise to eight minutes, and still end on Sa. Do not strip the ends and keep the middle at full length — the ends are what make the middle count."
      },
      {
        "kind": "audio",
        "label": "This is the tempo to aim for. Slower than you expect.",
        "demo": {
          "kind": "swaras",
          "ragaId": "mayamalavagowla",
          "bpm": 40,
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
              "duration": 4
            },
            {
              "swara": "N",
              "octave": 0,
              "duration": 2
            },
            {
              "swara": "D",
              "octave": 0,
              "duration": 2
            },
            {
              "swara": "P",
              "octave": 0,
              "duration": 2
            },
            {
              "swara": "M",
              "octave": 0,
              "duration": 2
            },
            {
              "swara": "G",
              "octave": 0,
              "duration": 2
            },
            {
              "swara": "R",
              "octave": 0,
              "duration": 2
            },
            {
              "swara": "S",
              "octave": 0,
              "duration": 4
            }
          ]
        }
      },
      {
        "kind": "heading",
        "text": "When you have an hour"
      },
      {
        "kind": "list",
        "ordered": true,
        "items": [
          "0–3 min. Drone. Sitting. Listening.",
          "3–10 min. Akaram: long Sa, then slow Sa–Pa–Sa, then the whole scale on 'aa' rather than on swara names.",
          "10–20 min. Sarali varisai from the first one, all the ones you know, slowest speed, hand keeping tala throughout.",
          "20–35 min. The day's new material — and keep it small. One line, or one exercise. Broken into pieces and repeated, not run end to end.",
          "35–45 min. Second speed on something you already own comfortably in the first speed.",
          "45–55 min. Composition work, if you are at that stage. Otherwise more revision.",
          "55–60 min. Long notes on Sa with the drone, then stop."
        ]
      },
      {
        "kind": "p",
        "text": "Notice what is in neither plan: singing through your whole repertoire to see how it goes. That is performing, not practising, and it is the most common way to spend an hour and improve nothing."
      },
      {
        "kind": "heading",
        "text": "How to repeat"
      },
      {
        "kind": "p",
        "text": "Find the exact place that goes wrong and work on that place, not on the whole exercise. If a phrase breaks at the fourth note, sing the third, fourth and fifth notes twenty times, then put them back into the line. Restarting from the top after every mistake mostly rehearses the part that was already fine."
      },
      {
        "kind": "p",
        "text": "Choose the speed at which you do not make the mistake, even if that speed is absurdly slow. Speed up only once the slow version has become dull. Practising fast and inaccurate installs the inaccuracy — there is no later stage at which it comes back out on its own."
      },
      {
        "kind": "watch",
        "text": "Getting faster because it feels like progress. Speed is a by-product of accuracy and never a target by itself. If you cannot sing it slowly and in tune, you cannot sing it."
      },
      {
        "kind": "heading",
        "text": "The voice itself"
      },
      {
        "kind": "p",
        "text": "Stop if your throat hurts, if you go hoarse, or if you have to push for a note that was easy yesterday. None of those are things to sing through. Room-temperature water rather than cold, and most singers find practising straight after a heavy meal uncomfortable."
      },
      {
        "kind": "note",
        "text": "On a bad voice day, do not cancel the sitting. Sit with the drone, keep tala with your hand through the exercises without singing, and listen closely to a recording of something you are learning. You will lose far less than you expect, and you will keep the habit, which is the harder thing to rebuild."
      },
      {
        "kind": "p",
        "text": "Record yourself once a week on your phone, at the same point in the sitting each time. Listening back is unpleasant for about two months and then becomes the most useful five minutes of your week. You cannot hear yourself accurately while singing, because the ear you would use to judge is busy producing."
      }
    ]
  },
  {
    "id": "how-to-improve",
    "title": "How You Actually Improve",
    "lead": "Progress here does not come from learning more pieces. It comes from a few unglamorous habits, and from a teacher — which is the part worth being honest about.",
    "minutes": 6,
    "terms": [
      "sruti",
      "gamaka",
      "tala",
      "varisai",
      "patantara",
      "sahitya",
      "raga"
    ],
    "body": [
      {
        "kind": "p",
        "text": "The beginner's model of progress is a list of pieces learned. That is not how this music improves. What improves is what your voice does without being asked: whether a note arrives in tune without a search, whether your hand holds the cycle when the melody turns awkward, whether a phrase you have sung four hundred times comes out shaped rather than flat."
      },
      {
        "kind": "heading",
        "text": "Slow practice"
      },
      {
        "kind": "p",
        "text": "Slow is not a gentler version of fast. It is a different activity, and it is the one that works. At slow speed you can actually hear whether the note sits in tune against the drone. There is room for movement inside a note instead of it being smeared past. Your body has time to notice what it is doing. At speed, errors go by too quickly to catch and are encoded exactly as they occurred."
      },
      {
        "kind": "p",
        "text": "A usable rule: if you make the mistake at all, you are practising too fast. Drop the speed until the mistake stops happening, stay there until it is boring, and only then move up."
      },
      {
        "kind": "heading",
        "text": "The drone, always"
      },
      {
        "kind": "p",
        "text": "Never practise without it. Every minute of singing against a constant reference calibrates your ear a little further, and every minute without one lets it drift. This is the largest improvement available to you for the smallest cost, and the cost is only remembering."
      },
      {
        "kind": "try",
        "text": "Put the drone on and sing a long Sa, then a long Pa, then Sa again. Nothing else — no exercise, no tala. Two minutes. Do it daily for a month and your Sa will start arriving without a search.",
        "demo": {
          "kind": "drone"
        }
      },
      {
        "kind": "heading",
        "text": "Listening"
      },
      {
        "kind": "p",
        "text": "Listening is practice, not preparation for it. But listen the way a student listens rather than the way an audience does. At your stage there are three things to follow, and following any one of them is enough for a whole recording."
      },
      {
        "kind": "list",
        "items": [
          "Where is the singer's Sa? Find it in the drone, then hear the melody as distances from it. This is the single most valuable listening skill and it takes months to acquire.",
          "Where does the cycle turn over? Keep [[tala]] with your hand while you listen. Find the first beat, then check a minute later whether you are still on it.",
          "Is that note straight, or is it moving? Once you begin hearing which notes are shaped and which are held plain, you have started hearing [[raga]] rather than tune."
        ]
      },
      {
        "kind": "p",
        "text": "Listen to the same recording many times rather than many recordings once. Familiarity is what makes detail audible; the tenth hearing gives you things the first three could not. Where you can, listen to the piece you are currently learning, sung by someone whose version your teacher approves of."
      },
      {
        "kind": "heading",
        "text": "Repetition over novelty"
      },
      {
        "kind": "p",
        "text": "New material feels like progress and usually is not. A piece you half-know is a liability: it occupies memory, it teaches you its own errors, and it postpones the point at which anything becomes automatic. The honest measure of where you stand is not how many things you have touched but how many you can do without thinking."
      },
      {
        "kind": "heading",
        "text": "What a teacher gives that this cannot"
      },
      {
        "kind": "p",
        "text": "This needs saying plainly. An app cannot teach you to sing Carnatic music. It can support daily practice, and daily practice is most of the hours — but the things below are not available from software, and there is no future version of this that changes that."
      },
      {
        "kind": "list",
        "items": [
          "Correction with a diagnosis, in the moment. Software can tell you a note was flat. A teacher hears why — a tight jaw, a collapsed breath, the larynx riding up, an interval you consistently under-shoot — and gives you the specific fix before the wrong version repeats.",
          "[[gamaka|Gamaka]]. It is transmitted by imitation, at your [[sruti]], adjusted to your voice, with immediate response to your attempt. No notation carries it and no recording answers back.",
          "Sequencing. What you should work on next depends on your particular weakness this month. That judgement is the core of teaching and it does not generalise into a fixed curriculum.",
          "Catching habits early. You cannot hear your own habits, because they sound like you. Someone else has to name them, and the earlier they do, the cheaper the correction.",
          "The [[patantara]] — the particular version of a composition as it has come down one lineage, including which sangatis, in which order, with which turns of phrase. It lives in people rather than in books, and versions differ legitimately between schools.",
          "Pronunciation of the [[sahitya]], which is often in Telugu, Sanskrit, Tamil or Kannada. Mispronounced text is a real fault, and it is close to impossible to self-diagnose in a language you do not speak.",
          "A standard. Until you have heard, close up and repeatedly, what correct sounds like, you have no reliable idea how far off you are."
        ]
      },
      {
        "kind": "p",
        "text": "What this app can do is smaller and still worth having. A drone at your sruti the moment you sit down. Patterns played correctly, so there is something true to check yourself against. Tala kept without your having to trust yourself. A map of where you are in the sequence. And a record of whether you actually practised, which is less trivial than it sounds."
      },
      {
        "kind": "p",
        "text": "Until you have a teacher, do this daily regardless: sit with the drone, sing long notes on Sa, work slowly through the sarali [[varisai]] with your hand keeping tala, listen to one recording repeatedly, and record yourself once a week. None of it will be wasted or need undoing, and a student who turns up to a first lesson with a settled sruti and a steady hand starts from a much better place than one who does not."
      },
      {
        "kind": "p",
        "text": "Weekly lessons online with daily solo practice in between is now an ordinary way to learn this music, and it works. It is worth arranging sooner rather than later, because corrections are cheapest before habits set."
      },
      {
        "kind": "watch",
        "text": "Practising a mistake for a month because nobody heard it. This is the specific risk of learning alone and it is not hypothetical. Reduce it by recording yourself and comparing against a reference recording, and by getting a real ear on your singing as early as you can."
      },
      {
        "kind": "p",
        "text": "Plateaus are normal and they are long. Several weeks with no audible change, and then something that was hard is simply not hard any more. The way through a plateau is not new material. It is the same material, slower, with the drone on."
      }
    ]
  }
]

export function chapterById(id: string): HandbookChapter | undefined {
  return HANDBOOK.find((c) => c.id === id)
}
