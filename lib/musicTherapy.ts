import { FeelingType } from '@/types';

export interface Song {
  id: string;
  title: string;
  artist: string;
  youtubeId: string;
  phase: 'meet' | 'transition' | 'uplift';
  feelings: FeelingType[];
}

/**
 * Comprehensive music therapy database
 * Organized by therapeutic phase: meet (validate feelings) → transition (gentle shift) → uplift (hope/energy)
 */
export const MUSIC_LIBRARY: Song[] = [
  // ============================================================================
  // OVERWHELMED - Songs for feeling too much
  // ============================================================================
  // Meet phase - acknowledge the overwhelm
  {
    id: 'breathe-me-sia',
    title: 'Breathe Me',
    artist: 'Sia',
    youtubeId: 'hSH7fblcGWM',
    phase: 'meet',
    feelings: ['overwhelmed', 'anxious', 'sad'],
  },
  {
    id: 'the-middle-jimmy',
    title: 'The Middle',
    artist: 'Jimmy Eat World',
    youtubeId: 'oKsxPW6i3pM',
    phase: 'meet',
    feelings: ['overwhelmed', 'stressed', 'confused'],
  },
  {
    id: 'mad-world',
    title: 'Mad World',
    artist: 'Gary Jules',
    youtubeId: '4N3N1MlvVc4',
    phase: 'meet',
    feelings: ['overwhelmed', 'sad', 'lonely'],
  },
  // Transition - gentle encouragement
  {
    id: 'float-on',
    title: 'Float On',
    artist: 'Modest Mouse',
    youtubeId: 'CTAud5O7Qqk',
    phase: 'transition',
    feelings: ['overwhelmed', 'stressed'],
  },
  {
    id: 'the-scientist',
    title: 'The Scientist',
    artist: 'Coldplay',
    youtubeId: 'RB-RcX5DS5A',
    phase: 'transition',
    feelings: ['overwhelmed', 'sad', 'confused'],
  },
  // Uplift - hope and peace
  {
    id: 'hey-jude',
    title: 'Hey Jude',
    artist: 'The Beatles',
    youtubeId: 'A_MjCqQoLLA',
    phase: 'uplift',
    feelings: ['overwhelmed', 'sad', 'lonely', 'stressed'],
  },
  {
    id: 'here-comes-sun',
    title: 'Here Comes The Sun',
    artist: 'The Beatles',
    youtubeId: 'KQetemT1s7I',
    phase: 'uplift',
    feelings: ['overwhelmed', 'sad', 'tired'],
  },
  {
    id: 'three-little-birds',
    title: 'Three Little Birds',
    artist: 'Bob Marley & The Wailers',
    youtubeId: 'LanCLS_hIo4',
    phase: 'uplift',
    feelings: ['overwhelmed', 'anxious', 'worried', 'stressed'],
  },

  // ============================================================================
  // ANXIOUS - Calming and grounding songs
  // ============================================================================
  {
    id: 'skinny-love',
    title: 'Skinny Love',
    artist: 'Bon Iver',
    youtubeId: 'ssdgFoHLwnk',
    phase: 'meet',
    feelings: ['anxious', 'sad', 'lonely'],
  },
  {
    id: 'holocene',
    title: 'Holocene',
    artist: 'Bon Iver',
    youtubeId: 'TWcyIpul8OE',
    phase: 'transition',
    feelings: ['anxious', 'overwhelmed'],
  },
  {
    id: 'dont-stop-believin',
    title: "Don't Stop Believin'",
    artist: 'Journey',
    youtubeId: '1k8craCGpgs',
    phase: 'uplift',
    feelings: ['anxious', 'worried', 'overwhelmed'],
  },
  {
    id: 'lovely-day',
    title: 'Lovely Day',
    artist: 'Bill Withers',
    youtubeId: 'bEeaS6fuUoA',
    phase: 'uplift',
    feelings: ['anxious', 'stressed', 'tired'],
  },
  {
    id: 'stand-by-me',
    title: 'Stand By Me',
    artist: 'Ben E. King',
    youtubeId: 'z5i9vT8wGY8',
    phase: 'uplift',
    feelings: ['anxious', 'lonely', 'worried'],
  },

  // ============================================================================
  // SAD - Emotional validation and gentle uplift
  // ============================================================================
  {
    id: 'hurt-johnny-cash',
    title: 'Hurt',
    artist: 'Johnny Cash',
    youtubeId: '8AHCfZTRGiI',
    phase: 'meet',
    feelings: ['sad', 'lonely'],
  },
  {
    id: 'someone-like-you',
    title: 'Someone Like You',
    artist: 'Adele',
    youtubeId: 'hLQl3WQQoQ0',
    phase: 'meet',
    feelings: ['sad', 'lonely'],
  },
  {
    id: 'dreams-fleetwood',
    title: 'Dreams',
    artist: 'Fleetwood Mac',
    youtubeId: '5oWyMakvQew',
    phase: 'transition',
    feelings: ['sad', 'lonely', 'confused'],
  },
  {
    id: 'lean-on-me',
    title: 'Lean On Me',
    artist: 'Bill Withers',
    youtubeId: 'KEXQkrllGbA',
    phase: 'uplift',
    feelings: ['sad', 'lonely', 'overwhelmed'],
  },
  {
    id: 'unwritten',
    title: 'Unwritten',
    artist: 'Natasha Bedingfield',
    youtubeId: 'b7k0a5hYnSI',
    phase: 'uplift',
    feelings: ['sad', 'confused', 'lonely'],
  },

  // ============================================================================
  // STRESSED - Energy release and calm
  // ============================================================================
  {
    id: 'heavy-linkin',
    title: 'Heavy',
    artist: 'Linkin Park ft. Kiiara',
    youtubeId: 'zvCBSSwgtg4',
    phase: 'meet',
    feelings: ['stressed', 'overwhelmed', 'tired'],
  },
  {
    id: 'symphony',
    title: 'Symphony',
    artist: 'Clean Bandit ft. Zara Larsson',
    youtubeId: 'aatr_2MstrI',
    phase: 'transition',
    feelings: ['stressed', 'anxious'],
  },
  {
    id: 'eye-tiger',
    title: 'Eye of the Tiger',
    artist: 'Survivor',
    youtubeId: 'btPJPFnesV4',
    phase: 'uplift',
    feelings: ['stressed', 'tired', 'overwhelmed'],
  },
  {
    id: 'stronger-kanye',
    title: 'Stronger',
    artist: 'Kanye West',
    youtubeId: 'PsO6ZnUZI0g',
    phase: 'uplift',
    feelings: ['stressed', 'angry', 'frustrated'],
  },

  // ============================================================================
  // LONELY - Connection and belonging
  // ============================================================================
  {
    id: 'dock-bay',
    title: '(Sittin\' On) The Dock of the Bay',
    artist: 'Otis Redding',
    youtubeId: 'rTVjnBo96Ug',
    phase: 'meet',
    feelings: ['lonely', 'sad', 'tired'],
  },
  {
    id: 'let-it-be',
    title: 'Let It Be',
    artist: 'The Beatles',
    youtubeId: 'QDYfEBY9NM4',
    phase: 'transition',
    feelings: ['lonely', 'sad', 'overwhelmed'],
  },
  {
    id: 'you-say',
    title: 'You Say',
    artist: 'Lauren Daigle',
    youtubeId: 'sIaT8Jl0IUA',
    phase: 'uplift',
    feelings: ['lonely', 'sad', 'anxious'],
  },

  // ============================================================================
  // FRUSTRATED/ANGRY - Release and channel energy
  // ============================================================================
  {
    id: 'feel-it-still',
    title: 'Feel It Still',
    artist: 'Portugal. The Man',
    youtubeId: 'pBkHHoOIIn8',
    phase: 'meet',
    feelings: ['frustrated', 'angry', 'stressed'],
  },
  {
    id: 'cant-stop-rhcp',
    title: "Can't Stop",
    artist: 'Red Hot Chili Peppers',
    youtubeId: 'BfOdWSiyWoc',
    phase: 'transition',
    feelings: ['frustrated', 'angry', 'stressed'],
  },
  {
    id: 'shake-it-off',
    title: 'Shake It Off',
    artist: 'Taylor Swift',
    youtubeId: 'nfWlot6h_JM',
    phase: 'uplift',
    feelings: ['frustrated', 'angry', 'stressed'],
  },

  // ============================================================================
  // TIRED - Gentle energy and motivation
  // ============================================================================
  {
    id: 'keeping-head-up',
    title: 'Keeping Your Head Up',
    artist: 'Birdy',
    youtubeId: 'm8AXUq5uA0Y',
    phase: 'meet',
    feelings: ['tired', 'sad', 'overwhelmed'],
  },
  {
    id: 'good-day',
    title: 'Good Day',
    artist: 'Forrest Frank',
    youtubeId: 'nS-fOh1CfhQ',
    phase: 'transition',
    feelings: ['tired', 'sad'],
  },
  {
    id: 'good-vibrations',
    title: 'Good Vibrations',
    artist: 'The Beach Boys',
    youtubeId: 'Eab_beh07HU',
    phase: 'uplift',
    feelings: ['tired', 'sad'],
  },

  // ============================================================================
  // CONFUSED - Clarity and direction
  // ============================================================================
  {
    id: 'viva-la-vida',
    title: 'Viva La Vida',
    artist: 'Coldplay',
    youtubeId: 'dvgZkm1xWPE',
    phase: 'transition',
    feelings: ['confused', 'overwhelmed'],
  },
  {
    id: 'high-hopes',
    title: 'High Hopes',
    artist: 'Panic! At The Disco',
    youtubeId: 'IPXIgEAGe4U',
    phase: 'uplift',
    feelings: ['confused', 'overwhelmed', 'anxious'],
  },

  // ============================================================================
  // WORRIED - Reassurance and calm
  // ============================================================================
  {
    id: 'dont-worry-be-happy',
    title: "Don't Worry, Be Happy",
    artist: 'Bobby McFerrin',
    youtubeId: 'd-diB65scQU',
    phase: 'uplift',
    feelings: ['worried', 'anxious', 'stressed'],
  },
  {
    id: 'beautiful-day',
    title: 'Beautiful Day',
    artist: 'U2',
    youtubeId: 'co6WMzDOh1o',
    phase: 'uplift',
    feelings: ['worried', 'anxious', 'sad'],
  },

  // ============================================================================
  // UNIVERSAL MOOD BOOSTERS - Work for most feelings
  // ============================================================================
  {
    id: 'happy-pharrell',
    title: 'Happy',
    artist: 'Pharrell Williams',
    youtubeId: 'ZbZSe6N_BXs',
    phase: 'uplift',
    feelings: [
      'sad',
      'tired',
      'lonely',
      'frustrated',
      'stressed',
      'overwhelmed',
      'anxious',
      'worried',
      'confused',
      'angry',
    ],
  },
  {
    id: 'walking-sunshine',
    title: 'Walking On Sunshine',
    artist: 'Katrina & The Waves',
    youtubeId: 'iPUmE-tne5U',
    phase: 'uplift',
    feelings: ['sad', 'tired', 'stressed', 'overwhelmed'],
  },
  {
    id: 'cant-stop-feeling',
    title: "Can't Stop The Feeling",
    artist: 'Justin Timberlake',
    youtubeId: 'ru0K8uYEZWw',
    phase: 'uplift',
    feelings: ['sad', 'tired', 'stressed', 'frustrated'],
  },
  {
    id: 'roar-katy',
    title: 'Roar',
    artist: 'Katy Perry',
    youtubeId: 'CevxZvSJLk8',
    phase: 'uplift',
    feelings: ['frustrated', 'angry', 'overwhelmed', 'anxious'],
  },
  {
    id: 'fight-song',
    title: 'Fight Song',
    artist: 'Rachel Platten',
    youtubeId: 'xo1VInw-SKc',
    phase: 'uplift',
    feelings: ['overwhelmed', 'anxious', 'tired', 'frustrated'],
  },
  {
    id: 'brave-sara',
    title: 'Brave',
    artist: 'Sara Bareilles',
    youtubeId: 'QUQsqBqxoR4',
    phase: 'uplift',
    feelings: ['anxious', 'worried', 'overwhelmed'],
  },
  {
    id: 'on-top-world',
    title: 'On Top Of The World',
    artist: 'Imagine Dragons',
    youtubeId: 'w5tWYmIOWGk',
    phase: 'uplift',
    feelings: ['sad', 'tired', 'overwhelmed'],
  },
  {
    id: 'best-day-life',
    title: 'Best Day Of My Life',
    artist: 'American Authors',
    youtubeId: 'Y66j_BUCBMY',
    phase: 'uplift',
    feelings: ['sad', 'tired', 'stressed'],
  },
  {
    id: 'september-ewf',
    title: 'September',
    artist: 'Earth, Wind & Fire',
    youtubeId: 'Gs069dndIYk',
    phase: 'uplift',
    feelings: ['sad', 'tired', 'stressed'],
  },
  {
    id: 'unstoppable-sia',
    title: 'Unstoppable',
    artist: 'Sia',
    youtubeId: 'YaEG2aWJnZ8',
    phase: 'uplift',
    feelings: ['overwhelmed', 'anxious', 'frustrated', 'tired'],
  },
  {
    id: 'will-survive',
    title: 'I Will Survive',
    artist: 'Gloria Gaynor',
    youtubeId: '6dYWe1c3OyU',
    phase: 'uplift',
    feelings: ['sad', 'lonely', 'frustrated', 'angry'],
  },
  {
    id: 'uptown-funk',
    title: 'Uptown Funk',
    artist: 'Mark Ronson ft. Bruno Mars',
    youtubeId: 'OPf0YbXqDm0',
    phase: 'uplift',
    feelings: ['tired', 'sad', 'stressed'],
  },
  {
    id: 'dancing-queen',
    title: 'Dancing Queen',
    artist: 'ABBA',
    youtubeId: 'xFrGuyw1V8s',
    phase: 'uplift',
    feelings: ['sad', 'tired', 'lonely'],
  },
  {
    id: 'good-life',
    title: 'Good Life',
    artist: 'OneRepublic',
    youtubeId: 'jZhQOvvV45w',
    phase: 'uplift',
    feelings: ['sad', 'tired', 'overwhelmed'],
  },
  {
    id: 'riptide',
    title: 'Riptide',
    artist: 'Vance Joy',
    youtubeId: 'lYoWuaw5nSk',
    phase: 'uplift',
    feelings: ['anxious', 'worried', 'sad'],
  },
  {
    id: 'paradise-coldplay',
    title: 'Paradise',
    artist: 'Coldplay',
    youtubeId: '1G4isv_Fylg',
    phase: 'uplift',
    feelings: ['overwhelmed', 'sad', 'confused'],
  },
  {
    id: 'cant-hold-us',
    title: "Can't Hold Us",
    artist: 'Macklemore & Ryan Lewis',
    youtubeId: '2zNSgSzhBfM',
    phase: 'uplift',
    feelings: ['tired', 'overwhelmed', 'stressed'],
  },
  {
    id: 'born-this-way',
    title: 'Born This Way',
    artist: 'Lady Gaga',
    youtubeId: 'wV1FrqwZyKw',
    phase: 'uplift',
    feelings: ['anxious', 'frustrated', 'lonely'],
  },
  {
    id: 'hall-of-fame',
    title: 'Hall of Fame',
    artist: 'The Script ft. will.i.am',
    youtubeId: 'mk48xRzuNvA',
    phase: 'uplift',
    feelings: ['overwhelmed', 'tired', 'anxious'],
  },
  {
    id: 'livin-prayer',
    title: "Livin' On A Prayer",
    artist: 'Bon Jovi',
    youtubeId: 'lDK9QqIzhwk',
    phase: 'uplift',
    feelings: ['overwhelmed', 'stressed', 'frustrated'],
  },
  {
    id: 'we-are-champions',
    title: 'We Are The Champions',
    artist: 'Queen',
    youtubeId: '04854XqcfCY',
    phase: 'uplift',
    feelings: ['frustrated', 'overwhelmed', 'tired'],
  },
  {
    id: 'put-records-on',
    title: 'Put Your Records On',
    artist: 'Corinne Bailey Rae',
    youtubeId: 'oqk9hT5fcgM',
    phase: 'uplift',
    feelings: ['anxious', 'stressed', 'overwhelmed'],
  },
  {
    id: 'sunflower',
    title: 'Sunflower',
    artist: 'Post Malone & Swae Lee',
    youtubeId: 'ApXoWvfEYVU',
    phase: 'uplift',
    feelings: ['sad', 'tired', 'lonely'],
  },
  {
    id: 'good-as-hell',
    title: 'Good as Hell',
    artist: 'Lizzo',
    youtubeId: 'SmbmeOgWsqE',
    phase: 'uplift',
    feelings: ['frustrated', 'sad', 'overwhelmed'],
  },
  {
    id: 'pocketful-sunshine',
    title: 'Pocketful of Sunshine',
    artist: 'Natasha Bedingfield',
    youtubeId: 'gte3BoXKwP0',
    phase: 'uplift',
    feelings: ['sad', 'anxious', 'worried'],
  },
  {
    id: 'geronimo',
    title: 'Geronimo',
    artist: 'Sheppard',
    youtubeId: 'UL_EXAyGCkw',
    phase: 'uplift',
    feelings: ['anxious', 'worried', 'overwhelmed'],
  },
  {
    id: 'sugar-maroon',
    title: 'Sugar',
    artist: 'Maroon 5',
    youtubeId: '09R8_2nJtjg',
    phase: 'uplift',
    feelings: ['sad', 'tired', 'stressed'],
  },
  {
    id: 'good-time-owl',
    title: 'Good Time',
    artist: 'Owl City & Carly Rae Jepsen',
    youtubeId: 'H7HmzwI67ec',
    phase: 'uplift',
    feelings: ['sad', 'tired', 'stressed'],
  },
  {
    id: 'glorious-mack',
    title: 'Glorious',
    artist: 'Macklemore ft. Skylar Grey',
    youtubeId: '7OrLroFa0AI',
    phase: 'uplift',
    feelings: ['overwhelmed', 'tired', 'frustrated'],
  },
  {
    id: 'just-way-you-are',
    title: 'Just The Way You Are',
    artist: 'Bruno Mars',
    youtubeId: 'LjhCEhWiKXk',
    phase: 'uplift',
    feelings: ['sad', 'lonely', 'anxious'],
  },
  {
    id: 'the-climb',
    title: 'The Climb',
    artist: 'Miley Cyrus',
    youtubeId: 'NG2zyeVRcbs',
    phase: 'uplift',
    feelings: ['overwhelmed', 'frustrated', 'tired'],
  },
  {
    id: 'rewrite-stars',
    title: 'Rewrite The Stars',
    artist: 'James Arthur & Anne-Marie',
    youtubeId: 'BGE63Dz28N8',
    phase: 'uplift',
    feelings: ['sad', 'lonely', 'confused'],
  },
  {
    id: 'cold-heart',
    title: 'Cold Heart',
    artist: 'Elton John & Dua Lipa',
    youtubeId: 'qod03PVTLqk',
    phase: 'uplift',
    feelings: ['sad', 'lonely', 'tired'],
  },
];

/**
 * Get music recommendations for a specific feeling
 * Returns songs in therapeutic order: meet → transition → uplift
 */
export function getMusicForFeeling(feeling: FeelingType): {
  meet: Song[];
  transition: Song[];
  uplift: Song[];
} {
  const relevantSongs = MUSIC_LIBRARY.filter((song) =>
    song.feelings.includes(feeling)
  );

  return {
    meet: relevantSongs.filter((s) => s.phase === 'meet'),
    transition: relevantSongs.filter((s) => s.phase === 'transition'),
    uplift: relevantSongs.filter((s) => s.phase === 'uplift'),
  };
}

/**
 * Get all songs for a feeling in therapeutic progression order
 */
export function getTherapeuticPlaylist(feeling: FeelingType): Song[] {
  const { meet, transition, uplift } = getMusicForFeeling(feeling);
  return [...meet, ...transition, ...uplift];
}

/**
 * Get a random uplifting song (universal mood booster)
 */
export function getRandomUpliftingSong(): Song {
  const upliftSongs = MUSIC_LIBRARY.filter((s) => s.phase === 'uplift');
  return upliftSongs[Math.floor(Math.random() * upliftSongs.length)];
}

/**
 * Get the perfect song for end of session based on feeling and improvement
 * - If improved significantly (>0): uplifting song
 * - If stayed same/got worse: comforting "meet" song
 */
export function getRecommendedSongForSession(
  feeling: FeelingType,
  improvement: number
): Song {
  const { meet, uplift } = getMusicForFeeling(feeling);

  // If they improved, give them an uplifting celebration song
  if (improvement > 0) {
    if (uplift.length > 0) {
      return uplift[Math.floor(Math.random() * uplift.length)];
    }
  }

  // If they didn't improve or got worse, give comfort/validation
  if (meet.length > 0) {
    return meet[Math.floor(Math.random() * meet.length)];
  }

  // Fallback to any uplifting song
  return getRandomUpliftingSong();
}

/**
 * Record music usage (for future analytics)
 */
export function recordMusicUsage(
  sessionId: string,
  songId: string,
  completed: boolean
): void {
  const STORAGE_KEY = 'wellness_music_usage';

  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    const usage = existing ? JSON.parse(existing) : [];

    usage.push({
      sessionId,
      songId,
      completed,
      timestamp: new Date().toISOString(),
    });

    // Keep last 100 entries
    const trimmed = usage.slice(-100);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error('Failed to record music usage:', error);
  }
}

/**
 * Use AI to analyze the full conversation and recommend the perfect song
 * This replaces the simple algorithm-based recommendation for a more context-aware selection
 */
export async function getAIRecommendedSong(
  messages: Array<{ role: string; content: string }>,
  feeling: FeelingType,
  improvement: number
): Promise<Song> {
  try {
    // Build a comprehensive song list for the AI to choose from
    const songList = MUSIC_LIBRARY.map(song =>
      `ID: ${song.id}\nTitle: "${song.title}" by ${song.artist}\nPhase: ${song.phase}\nFeelings: ${song.feelings.join(', ')}`
    ).join('\n\n');

    // Prepare conversation summary for AI
    const conversationSummary = messages
      .map(msg => `${msg.role === 'user' ? 'User' : 'Therapist'}: ${msg.content}`)
      .join('\n');

    const prompt = `You are a music therapist analyzing a therapy session to recommend the perfect song.

CONVERSATION SUMMARY:
${conversationSummary}

CONTEXT:
- User's initial feeling: ${feeling}
- Mood improvement: ${improvement > 0 ? `+${improvement} points (improved)` : improvement < 0 ? `${improvement} points (worsened)` : 'no change'}

SONG LIBRARY:
${songList}

INSTRUCTIONS:
Based on the ENTIRE conversation (not just the initial feeling), choose ONE song that:
1. Matches where they are emotionally RIGHT NOW (after the conversation)
2. If they improved: choose an "uplift" phase song to celebrate progress
3. If they didn't improve or worsened: choose a "meet" phase song that validates their current state
4. Consider specific themes discussed (loss, relationships, stress, hope, etc.)

Respond with ONLY the song ID (e.g., "hey-jude"). Nothing else.`;

    // Call API with the conversation analysis
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
        feeling: 'confused', // Doesn't matter for this analysis
      }),
    });

    if (!response.ok) {
      console.warn('AI song recommendation failed, falling back to algorithm');
      return getRecommendedSongForSession(feeling, improvement);
    }

    const data = await response.json();
    const songId = data.message?.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');

    // Find the song by ID
    const recommendedSong = MUSIC_LIBRARY.find(song => song.id === songId);

    if (recommendedSong) {
      console.log('AI recommended song:', recommendedSong.title);
      return recommendedSong;
    }

    // Fallback if AI returns invalid ID
    console.warn('AI returned invalid song ID, falling back to algorithm');
    return getRecommendedSongForSession(feeling, improvement);

  } catch (error) {
    console.error('Error in AI song recommendation:', error);
    // Fallback to original algorithm
    return getRecommendedSongForSession(feeling, improvement);
  }
}