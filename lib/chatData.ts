export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderHandle: string;
  senderAvatar: string;
  countryFlag: string;
  sourceLanguage: string;
  originalText: string;
  translatedText: string;
  targetLanguage: string;
  timestamp: string;
  isMe?: boolean;
  expiresIn: string; // e.g. "Expires in 38h 15m"
  isEncrypted?: boolean;
  encryptedPayload?: string;
  voiceNote?: {
    duration: string;
    waveform: number[];
    transcription: string;
  };
}

export interface Conversation {
  id: string;
  title: string;
  avatar: string;
  isGroup: boolean;
  countryFlag: string;
  countryName: string;
  unreadCount: number;
  lastMessageSnippet: string;
  lastMessageTime: string;
  isLiveNow?: boolean;
  liveViewersCount?: number;
  membersCount?: number;
  primaryLanguage: string;
  isEncrypted?: boolean;
  participantId?: string;
  participantHandle?: string;
  messages: ChatMessage[];
}

export interface StoryItem {
  id: string;
  creatorName: string;
  creatorAvatar: string;
  countryFlag: string;
  timeRemaining: string; // e.g. "14h 22m"
  previewImage: string;
  hasUnseen: boolean;
  title?: string;
  views?: string;
  isReplay?: boolean;
  createdAt?: string;
}

export const INITIAL_STORIES: StoryItem[] = [
  {
    id: 'st_0',
    creatorName: 'My Moment',
    creatorAvatar: '',
    countryFlag: '➕',
    timeRemaining: 'Add 48h Story',
    previewImage: '',
    hasUnseen: false,
  },
  {
    id: 'st_1',
    creatorName: 'Themba',
    creatorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
    countryFlag: '🇿🇦',
    timeRemaining: '14h 22m',
    previewImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80',
    hasUnseen: true,
  },
  {
    id: 'st_2',
    creatorName: 'Zainab',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    countryFlag: '🇸🇳',
    timeRemaining: '6h 40m',
    previewImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&auto=format&fit=crop&q=80',
    hasUnseen: true,
  },
  {
    id: 'st_3',
    creatorName: 'Chidi',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    countryFlag: '🇳🇬',
    timeRemaining: '29h 10m',
    previewImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&auto=format&fit=crop&q=80',
    hasUnseen: false,
  },
  {
    id: 'st_4',
    creatorName: 'Amina',
    creatorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    countryFlag: '🇰🇪',
    timeRemaining: '2h 15m',
    previewImage: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&auto=format&fit=crop&q=80',
    hasUnseen: true,
  },
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_soweto_amapiano',
    title: 'Soweto Amapiano Tribe 🇿🇦',
    avatar: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=150&auto=format&fit=crop&q=80',
    isGroup: true,
    countryFlag: '🇿🇦',
    countryName: 'South Africa',
    unreadCount: 3,
    lastMessageSnippet: 'Uyezwa lo msindo? Le ngoma izophula amarekhodi!',
    lastMessageTime: '17:12',
    isLiveNow: true,
    liveViewersCount: 1420,
    membersCount: 842,
    primaryLanguage: 'isiZulu / isiXhosa',
    messages: [
      {
        id: 'm1',
        senderId: 'u_sipho',
        senderName: 'Sipho Zulu',
        senderHandle: '@sipho_dbn',
        senderAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&auto=format&fit=crop&q=80',
        countryFlag: '🇿🇦',
        sourceLanguage: 'isiZulu',
        originalText: 'Sanibonani nonke! Sibukhoma kule 120s live session eSoweto. Woza ungene!',
        translatedText: 'Greetings all! We are broadcasting live for our 120s session in Soweto. Come join in!',
        targetLanguage: 'English',
        timestamp: '16:58',
        expiresIn: 'Expires in 47h 12m',
      },
      {
        id: 'm2',
        senderId: 'u_lerato',
        senderName: 'Lerato Kgosi',
        senderHandle: '@lerato_k',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80',
        countryFlag: '🇿🇦',
        sourceLanguage: 'Sesotho',
        originalText: 'Modumo ona o monate haholo! Ke rata piano e ncha ena.',
        translatedText: 'This sound is truly wonderful! I love this fresh piano track.',
        targetLanguage: 'English',
        timestamp: '17:04',
        expiresIn: 'Expires in 47h 18m',
      },
      {
        id: 'm3',
        senderId: 'u_thabo',
        senderName: 'Thabo Mdlalose',
        senderHandle: '@thabo_soweto',
        senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80',
        countryFlag: '🇿🇦',
        sourceLanguage: 'isiZulu',
        originalText: 'Uyezwa lo msindo? Le ngoma izophula amarekhodi! Lalela i-voice note le...',
        translatedText: 'Do you hear this bass? This song will break records! Listen to this voice note...',
        targetLanguage: 'English',
        timestamp: '17:12',
        expiresIn: 'Expires in 47h 26m',
        voiceNote: {
          duration: '0:18',
          waveform: [30, 60, 45, 90, 80, 50, 70, 95, 40, 65, 85, 55, 30, 20],
          transcription: 'Lo msindo omusha wase studio ubukhoma!',
        },
      },
    ],
  },
  {
    id: 'conv_lagos_tech',
    title: 'Lagos Creators & Afrobeats 🇳🇬',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
    isGroup: true,
    countryFlag: '🇳🇬',
    countryName: 'Nigeria',
    unreadCount: 1,
    lastMessageSnippet: 'E jọọ, e wo bí iná ṣe ń jó ní Yaba lónìí!',
    lastMessageTime: '16:45',
    isLiveNow: false,
    membersCount: 1205,
    primaryLanguage: 'Yorùbá / Pidgin',
    messages: [
      {
        id: 'm4',
        senderId: 'u_amara',
        senderName: 'Amara Balogun',
        senderHandle: '@amara_lagos',
        senderAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&auto=format&fit=crop&q=80',
        countryFlag: '🇳🇬',
        sourceLanguage: 'Yorùbá',
        originalText: 'Ẹ káàbọ̀ sí Yethu! Iná ń jó níbí lónìí!',
        translatedText: 'Welcome to Yethu! The creative fire is burning hot here today!',
        targetLanguage: 'English',
        timestamp: '16:30',
        expiresIn: 'Expires in 46h 44m',
      },
      {
        id: 'm5',
        senderId: 'u_chidi',
        senderName: 'Chidi Okafor',
        senderHandle: '@chidi_tech',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80',
        countryFlag: '🇳🇬',
        sourceLanguage: 'Nigerian Pidgin',
        originalText: 'Our 2-minute live stream yesterday gather over 4,000 viewers across 12 countries. Zero lag!',
        translatedText: 'Our 2-minute live stream yesterday gathered over 4,000 viewers across 12 countries. Zero lag!',
        targetLanguage: 'English',
        timestamp: '16:45',
        expiresIn: 'Expires in 46h 59m',
      },
    ],
  },
  {
    id: 'conv_nairobi_savannah',
    title: 'Nairobi Silicon Savannah 🇰🇪',
    avatar: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=150&auto=format&fit=crop&q=80',
    isGroup: true,
    countryFlag: '🇰🇪',
    countryName: 'Kenya',
    unreadCount: 0,
    lastMessageSnippet: 'Mkutano wa LiveKit WebRTC utaanza saa kumi kamili.',
    lastMessageTime: '15:20',
    isLiveNow: true,
    liveViewersCount: 680,
    membersCount: 540,
    primaryLanguage: 'Kiswahili',
    messages: [
      {
        id: 'm6',
        senderId: 'u_juma',
        senderName: 'Juma Kimani',
        senderHandle: '@juma_ke',
        senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80',
        countryFlag: '🇰🇪',
        sourceLanguage: 'Kiswahili',
        originalText: 'Mambo vipi wadau! Mkutano wetu wa pili wa LiveKit WebRTC utaanza saa kumi kamili.',
        translatedText: 'What is up innovators! Our second LiveKit WebRTC session will start at four o’clock sharp.',
        targetLanguage: 'English',
        timestamp: '15:20',
        expiresIn: 'Expires in 45h 34m',
      },
    ],
  },
  {
    id: 'conv_diaspora_exchange',
    title: 'Pan-African Language Exchange 🌍',
    avatar: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=150&auto=format&fit=crop&q=80',
    isGroup: true,
    countryFlag: '🌍',
    countryName: 'Pan-African',
    unreadCount: 2,
    lastMessageSnippet: 'How do you say "Immediate & Social" in Wolof?',
    lastMessageTime: '14:02',
    isLiveNow: false,
    membersCount: 2310,
    primaryLanguage: 'Multilingual (AI Translate)',
    messages: [
      {
        id: 'm7',
        senderId: 'u_fatou',
        senderName: 'Fatou Diop',
        senderHandle: '@fatou_dakar',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80',
        countryFlag: '🇸🇳',
        sourceLanguage: 'Français',
        originalText: 'Sur Yethu, nous pouvons converser chacun dans notre langue maternelle sans barrière!',
        translatedText: 'On Yethu, each of us can converse in our mother tongue without any barriers!',
        targetLanguage: 'English',
        timestamp: '13:50',
        expiresIn: 'Expires in 44h 04m',
      },
      {
        id: 'm8',
        senderId: 'u_nandi_m',
        senderName: 'Nandi Mthembu',
        senderHandle: '@nandi_m',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        countryFlag: '🇿🇦',
        sourceLanguage: 'isiZulu',
        originalText: 'Impela dadewethu! Yethu ihlanganisa i-Afrika yonke ngokushesha.',
        translatedText: 'Indeed my sister! Yethu unites all of Africa in an instant.',
        targetLanguage: 'English',
        timestamp: '14:02',
        expiresIn: 'Expires in 44h 16m',
      },
    ],
  },
  {
    id: 'conv_themba_direct',
    title: 'Themba Khumalo',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
    isGroup: false,
    countryFlag: '🇿🇦',
    countryName: 'South Africa',
    unreadCount: 0,
    lastMessageSnippet: 'Mfowethu, asenze i-dual live stream ka 120s namhlanje ngo 19:00!',
    lastMessageTime: '12:30',
    isLiveNow: false,
    primaryLanguage: 'isiZulu',
    isEncrypted: true,
    participantId: 'u_themba',
    participantHandle: '@themba_beats',
    messages: [
      {
        id: 'm9',
        senderId: 'u_themba',
        senderName: 'Themba Khumalo',
        senderHandle: '@themba_beats',
        senderAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
        countryFlag: '🇿🇦',
        sourceLanguage: 'isiZulu',
        originalText: 'Mfowethu, asenze i-dual live stream ka 120s namhlanje ngo 19:00!',
        translatedText: 'My brother, let us do a dual 120s live stream today at 19:00!',
        targetLanguage: 'English',
        timestamp: '12:30',
        expiresIn: 'Expires in 42h 44m',
        isEncrypted: true,
      },
    ],
  },
  {
    id: 'conv_kofi_direct',
    title: 'Kofi Mensah',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    isGroup: false,
    countryFlag: '🇬🇭',
    countryName: 'Ghana',
    unreadCount: 0,
    lastMessageSnippet: 'Akwaaba! Private chats on Yethu are locked with AES-256.',
    lastMessageTime: '11:15',
    isLiveNow: false,
    primaryLanguage: 'Twi / English',
    isEncrypted: true,
    participantId: 'u_kofi',
    participantHandle: '@kofi_accra',
    messages: [
      {
        id: 'm10',
        senderId: 'u_kofi',
        senderName: 'Kofi Mensah',
        senderHandle: '@kofi_accra',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
        countryFlag: '🇬🇭',
        sourceLanguage: 'English (Pan-African)',
        originalText: 'Akwaaba! Private chats on Yethu are locked with AES-256 end-to-end encryption.',
        translatedText: 'Akwaaba! Private chats on Yethu are locked with AES-256 end-to-end encryption.',
        targetLanguage: 'English',
        timestamp: '11:15',
        expiresIn: 'Expires in 45h 10m',
        isEncrypted: true,
      },
    ],
  },
  {
    id: 'conv_amara_direct',
    title: 'Amara Balogun',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&auto=format&fit=crop&q=80',
    isGroup: false,
    countryFlag: '🇳🇬',
    countryName: 'Nigeria',
    unreadCount: 0,
    lastMessageSnippet: 'Báwo ni! Ready to collaborate on our upcoming 120s broadcast?',
    lastMessageTime: '09:40',
    isLiveNow: false,
    primaryLanguage: 'Yorùbá',
    isEncrypted: true,
    participantId: 'u_amara',
    participantHandle: '@amara_lagos',
    messages: [
      {
        id: 'm11',
        senderId: 'u_amara',
        senderName: 'Amara Balogun',
        senderHandle: '@amara_lagos',
        senderAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&auto=format&fit=crop&q=80',
        countryFlag: '🇳🇬',
        sourceLanguage: 'Yorùbá',
        originalText: 'Báwo ni! Ready to collaborate on our upcoming 120s broadcast?',
        translatedText: 'How are you! Ready to collaborate on our upcoming 120s broadcast?',
        targetLanguage: 'English',
        timestamp: '09:40',
        expiresIn: 'Expires in 46h 25m',
        isEncrypted: true,
      },
    ],
  },
];
