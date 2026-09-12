export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  region: string;
  sampleGreeting: string;
  samplePhrases: {
    original: string;
    english: string;
    pronunciation: string;
  }[];
}

export const AFRICAN_LANGUAGES: LanguageOption[] = [
  {
    code: 'xh',
    name: 'isiXhosa',
    nativeName: 'isiXhosa',
    flag: '🇿🇦',
    region: 'South Africa',
    sampleGreeting: 'Molo mntakwethu! Kunjani namhlanje?',
    samplePhrases: [
      {
        original: 'Molo mntakwethu! Kunjani namhlanje?',
        english: 'Hello my brother! How is today going?',
        pronunciation: 'Moh-loh mn-tah-kweh-too',
      },
      {
        original: 'Yiza silalele le ngoma imnandi kunene.',
        english: 'Come listen to this truly beautiful song.',
        pronunciation: 'Yee-zah see-lah-leh-leh leh n-goh-mah',
      },
      {
        original: 'Sisonke apha, masithethe.',
        english: 'We are together here, let us speak.',
        pronunciation: 'See-sohn-keh ah-pah, mah-see-theh-theh',
      },
    ],
  },
  {
    code: 'zu',
    name: 'isiZulu',
    nativeName: 'isiZulu',
    flag: '🇿🇦',
    region: 'South Africa',
    sampleGreeting: 'Sawubona mngani wami! Siyaphila.',
    samplePhrases: [
      {
        original: 'Sawubona mngani wami! Siyaphila.',
        english: 'Greetings my friend! We are doing well.',
        pronunciation: 'Sah-woo-boh-nah mn-gah-nee',
      },
      {
        original: 'Uthini umoya waseGoli namhlanje?',
        english: 'What is the vibe in Johannesburg today?',
        pronunciation: 'Oo-thee-nee oo-moh-yah wah-seh-Goh-lee',
      },
      {
        original: 'Hlanganyela nathi kulo msakazo obukhoma!',
        english: 'Join us on this live broadcast!',
        pronunciation: 'Hlah-ngahn-yeh-lah nah-thee',
      },
    ],
  },
  {
    code: 'sw',
    name: 'Kiswahili',
    nativeName: 'Kiswahili',
    flag: '🇰🇪',
    region: 'East Africa (Kenya, Tanzania)',
    sampleGreeting: 'Hujambo ndugu yangu! Karibu sana.',
    samplePhrases: [
      {
        original: 'Hujambo ndugu yangu! Karibu sana.',
        english: 'Hello my brother! You are very welcome.',
        pronunciation: 'Hoo-jahm-boh n-doo-goo yahn-goo',
      },
      {
        original: 'Nairobi inawaka moto leo kwa muziki safi.',
        english: 'Nairobi is on fire today with fresh music.',
        pronunciation: 'Nah-ee-roh-bee ee-nah-wah-kah moh-toh',
      },
      {
        original: 'Tuko pamoja, sauti moja ya Afrika.',
        english: 'We are together, one African voice.',
        pronunciation: 'Too-koh pah-moh-jah sah-oo-tee moh-jah',
      },
    ],
  },
  {
    code: 'yo',
    name: 'Yorùbá',
    nativeName: 'Èdè Yorùbá',
    flag: '🇳🇬',
    region: 'West Africa (Nigeria)',
    sampleGreeting: 'Ẹ n lẹ́ o! Ṣé àlàáfíà ni gbogbo yín wà?',
    samplePhrases: [
      {
        original: 'Ẹ n lẹ́ o! Ṣé àlàáfíà ni gbogbo yín wà?',
        english: 'Greetings! Hope everyone is in peace and joy?',
        pronunciation: 'Eh n leh oh! Sheh ah-lah-fee-ah',
      },
      {
        original: 'Lagos l’aye wa, e gbo ohun orin tuntun yi.',
        english: 'Lagos is our world, listen to this new song sound.',
        pronunciation: 'Lah-gohs lah-yeh wah',
      },
      {
        original: 'Àṣẹ! A jọ ń gbé orin yìí ga.',
        english: 'Power! We are lifting this melody high together.',
        pronunciation: 'Ah-sheh! Ah jaw n gbeh oh-reen',
      },
    ],
  },
  {
    code: 'ig',
    name: 'Igbo',
    nativeName: 'Asụsụ Igbo',
    flag: '🇳🇬',
    region: 'West Africa (Nigeria)',
    sampleGreeting: 'Kedu kwanu ndị nkem! Kedụ ka ihe si aga?',
    samplePhrases: [
      {
        original: 'Kedu kwanu ndị nkem! Kedụ ka ihe si aga?',
        english: 'How are you my people! How are things moving?',
        pronunciation: 'Keh-doo kwah-noo n-dee n-kem',
      },
      {
        original: 'Nnoo na Yethu, ebe anyi na-ekwukorita okwu.',
        english: 'Welcome to Yethu, where we converse as one.',
        pronunciation: 'N-noh nah Yeh-thoo',
      },
    ],
  },
  {
    code: 'am',
    name: 'Amharic',
    nativeName: 'አማርኛ',
    flag: '🇪🇹',
    region: 'Horn of Africa (Ethiopia)',
    sampleGreeting: 'ሰላም እንዴት ናችሁ! እንኳን ደህና መጣችሁ።',
    samplePhrases: [
      {
        original: 'ሰላም እንዴት ናችሁ! እንኳን ደህና መጣችሁ።',
        english: 'Peace, how are you all! Welcome warmly.',
        pronunciation: 'Selam endet nachihu! Enkwan dehna metachihu.',
      },
      {
        original: 'አዲስ አበባ ዛሬ በደስታ ተሞልታለች።',
        english: 'Addis Ababa is filled with joy today.',
        pronunciation: 'Addis Abeba zare bedesta temoltalech.',
      },
    ],
  },
  {
    code: 'af',
    name: 'Afrikaans',
    nativeName: 'Afrikaans',
    flag: '🇿🇦',
    region: 'South Africa & Namibia',
    sampleGreeting: 'Goeiedag almal! Hoe gaan dit vandag met julle?',
    samplePhrases: [
      {
        original: 'Goeiedag almal! Hoe gaan dit vandag met julle?',
        english: 'Good day everyone! How is it going with you all today?',
        pronunciation: 'Khoo-yeh-dahkh ahl-mahl',
      },
      {
        original: 'Die energie hier is fantasties, kom ons praat.',
        english: 'The energy here is fantastic, let us talk.',
        pronunciation: 'Dee eh-ner-khee heer is fahn-tahs-tees',
      },
    ],
  },
  {
    code: 'fr',
    name: 'Français (Africain)',
    nativeName: 'Français',
    flag: '🇨🇮',
    region: 'Francophone Africa (Côte d’Ivoire, Senegal, DRC)',
    sampleGreeting: 'Salut la famille! Comment allez-vous aujourd’hui?',
    samplePhrases: [
      {
        original: 'Salut la famille! Tout le monde est branché sur Yethu.',
        english: 'Hello family! Everyone is plugged into Yethu.',
        pronunciation: 'Sah-loo lah fah-mee',
      },
      {
        original: 'L’ambiance d’Abidjan est incroyable en direct!',
        english: 'The vibe in Abidjan is unbelievable live!',
        pronunciation: 'Lahm-byahns dah-bee-jahn',
      },
    ],
  },
  {
    code: 'en',
    name: 'English (Pan-African)',
    nativeName: 'English',
    flag: '🌍',
    region: 'Global & Pan-African',
    sampleGreeting: 'What’s good Africa! Welcome to the immediate future.',
    samplePhrases: [
      {
        original: 'Two minutes live, forty-eight hours to catch it.',
        english: 'Two minutes live, forty-eight hours to catch it.',
        pronunciation: 'Two minutes live...',
      },
    ],
  },
];
