
import { AppShortcut, AppGroup, TimetableEntry, Subject, SubjectMaterials } from './types';

export const DEFAULT_LOGO = "https://res.cloudinary.com/drvmltyv1/image/upload/v1766702085/thePseudoLineNoBg_a8o42v.png";
export const APP_NAME = "Polytech Portal";
export const APP_SHORT_NAME = "PP";

export const DEPARTMENTS = [
  'Genie Informatique',
  'Genie Civil',
  'Genie Electrique',
  'Genie Mechanique',
  'Genie Chimique et Biologie Appliquee',
  'Gestion'
];

export const LEVELS = [
  'DUT 1',
  'DUT 2',
  'DIC 1',
  'DIC 2',
  'DIC 3'
];

export const DEPARTMENT_THEMES: Record<string, { color: string; bg: string; dark: string; light: string; accent: string }> = {
  'Genie Informatique': { 
    color: '#6366f1', // brand-500
    bg: '#4f46e5',    // brand-600
    dark: '#3730a3',  // indigo-800
    light: '#818cf8', // indigo-400
    accent: 'indigo'
  },
  'Genie Civil': { 
    color: '#f59e0b', // amber-500
    bg: '#d97706',    // amber-600
    dark: '#92400e',  // amber-800
    light: '#fbbf24', // amber-400
    accent: 'amber'
  },
  'Genie Electrique': { 
    color: '#06b6d4', // cyan-500
    bg: '#0891b2',    // cyan-600
    dark: '#155e75',  // cyan-800
    light: '#22d3ee', // cyan-400
    accent: 'cyan'
  },
  'Genie Mechanique': { 
    color: '#64748b', // slate-500
    bg: '#475569',    // slate-600
    dark: '#1e293b',  // slate-800
    light: '#94a3b8', // slate-400
    accent: 'slate'
  },
  'Genie Chimique et Biologie Appliquee': { 
    color: '#10b981', // emerald-500
    bg: '#059669',    // emerald-600
    dark: '#065f46',  // emerald-800
    light: '#34d399', // emerald-400
    accent: 'emerald'
  },
  'Gestion': { 
    color: '#f43f5e', // rose-500
    bg: '#e11d48',    // rose-600
    dark: '#9f1239',  // rose-800
    light: '#fb7185', // rose-400
    accent: 'rose'
  }
};

// --- SUBJECTS LIST ---
export const DEFAULT_SUBJECTS: Subject[] = [
  { 
    id: 's1', 
    name: 'Concepts généraux des réseaux', 
    code: 'RES1', 
    color: 'indigo',
    image_url: 'https://cdn8.futura-sciences.com/a1920/images/Reseau-informatique-connexion.jpeg'
  },
  { 
    id: 's2', 
    name: 'Algorithmique', 
    code: 'ALGO1', 
    color: 'fuchsia',
    image_url: 'https://img.freepik.com/free-vector/hand-drawn-flat-design-npl-illustration_23-2149277640.jpg?t=st=1769723645~exp=1769727245~hmac=c757e437043da01dacf20589b5d8895c01f6124392442273fd7e2218e49130ab'
  },
  { 
    id: 's3', 
    name: "Outils d'analyse des circuits", 
    code: 'OAC', 
    color: 'emerald',
    image_url: 'https://img.freepik.com/free-vector/abstract-blue-lights-background_1182-609.jpg?t=st=1769724013~exp=1769727613~hmac=6c02a22741a5f63174280c5707fb892c9bcbfad975b66f5c320e93b04113397b&w=1480'
  },
  { 
    id: 's4', 
    name: 'Outils mathématiques pour le signal', 
    code: 'MATH-SIG', 
    color: 'amber',
    image_url: 'https://img.freepik.com/free-vector/maths-realistic-chalkboard-background_23-2148163442.jpg?t=st=1769724684~exp=1769728284~hmac=27cce23644e1f777b23a54cc26edcb6046fb25df4a7c2ef2a9d73cbaf028b532&w=1480'
  },
  { 
    id: 's5', 
    name: 'Introduction aux SGBD', 
    code: 'SGBD1', 
    color: 'rose',
    image_url: 'https://img.freepik.com/free-vector/gradient-sql-illustration_23-2149247491.jpg?t=st=1769727784~exp=1769731384~hmac=0a30027e5b4b32ec21785f5773df3b696a428baa65fbf814a5bb0672888578c5&w=1480'
  },
  { 
    id: 's6', 
    name: 'Signaux et Systèmes', 
    code: 'SIG-SYS', 
    color: 'sky',
    image_url: 'https://img.freepik.com/free-vector/neon-laser-wave-music-equalizer-concept_107791-26137.jpg?t=st=1769724396~exp=1769727996~hmac=ac3b6145d808b4d73c04a141f30f2f6c181b8a15163e2c6491c0dd32a6000820&w=1480'
  },
  { 
    id: 's7', 
    name: 'Techniques de recherche documentaire', 
    code: 'TRD', 
    color: 'teal',
    image_url: 'https://img.freepik.com/free-vector/hand-drawn-credit-assessment-concept-with-documents_23-2149154259.jpg?t=st=1769728006~exp=1769731606~hmac=d2eb255426f0325b3b8939da00538987813f71b81a9d1bd618a4a91e5a3ce2d5&w=1480'
  },
  { 
    id: 's8', 
    name: 'Fondamentaux de Physique', 
    code: 'PHYS', 
    color: 'orange',
    image_url: 'https://img.freepik.com/free-vector/female-scientist-with-atom_23-2148403445.jpg?ga=GA1.1.1341116750.1769719917&semt=ais_hybrid&w=740&q=80'
  },
  { 
    id: 's9', 
    name: 'Anglais Technique', 
    code: 'ENG', 
    color: 'blue',
    image_url: 'https://img.freepik.com/free-vector/hand-drawn-english-book-illustration_23-2149517759.jpg?ga=GA1.1.1341116750.1769719917&semt=ais_hybrid&w=740&q=80'
  },
  { 
    id: 's10', 
    name: "Fondamentaux d'Analyse", 
    code: 'MATH-ANA', 
    color: 'violet',
    image_url: 'https://img.freepik.com/free-photo/whiteboard-with-math_1160-868.jpg?ga=GA1.1.1341116750.1769719917&semt=ais_hybrid&w=740&q=80'
  },
  { 
    id: 's11', 
    name: "Fondamentaux d'Algèbre", 
    code: 'MATH-ALG', 
    color: 'purple',
    image_url: 'https://img.freepik.com/free-photo/colleagues-making-business-plan-meeting-close-up_176420-5105.jpg?ga=GA1.1.1341116750.1769719917&semt=ais_hybrid&w=740&q=80'
  },
  { 
    id: 's12', 
    name: 'Architecture des ordinateurs', 
    code: 'ARCHI', 
    color: 'slate',
    image_url: 'https://img.freepik.com/free-photo/binary-code-digits-technology-software-concept_53876-128099.jpg?ga=GA1.1.1341116750.1769719917&semt=ais_hybrid&w=740&q=80'
  },
  { 
    id: 's13', 
    name: 'Web Development', 
    code: 'WEB1', 
    color: 'cyan',
    image_url: 'https://img.freepik.com/free-photo/ui-ux-representations-with-laptop_23-2150201871.jpg?ga=GA1.1.1341116750.1769719917&semt=ais_hybrid&w=740&q=80'
  },
];

// --- MATERIALS STRUCTURE ---
export const DEFAULT_MATERIALS: Record<string, SubjectMaterials> = {
  's1': { 
    cm: [
      { id: 'res-cm1', name: 'Cours 1: Modèle OSI', type: 'pdf', path: '/materials/RES1/CM/osi_model.pdf' }
    ],
    td: [],
    tp: []
  },
  's13': { 
    cm: [
      { id: 'm1', name: 'Introduction to HTML5', type: 'pdf', path: 'https://www.w3.org/html/logo/downloads/HTML5_Logo_512.png' },
      { id: 'm2', name: 'CSS3 Selectors & Flexbox', type: 'link', path: 'https://web.dev/learn/css/' },
      { id: 'm3', name: 'Dashboard Timetable Page Design', type: 'png', path: '/materials/WEB1/CM/pseudoline-daily.png' }
    ],
    td: [
      { id: 'm3', name: 'Exercice 1: Semantic Structure', type: 'pdf', path: '#' }
    ],
    tp: [
      { id: 'm4', name: 'TP1: Building a Portfolio', type: 'code', path: 'https://github.com/' },
      { id: 'm5', name: 'Solution TP1 (Fictive)', type: 'code', content: '<html>\n  <head><title>Portfolio</title></head>\n  <body>\n    <h1>Welcome to my Portfolio</h1>\n  </body>\n</html>' }
    ]
  },
  's2': { 
    cm: [{ id: 'm6', name: 'Introduction à la récursivité', type: 'pdf', path: '/materials/ALGO1/CM/recursivite.pdf' }],
    td: [{ id: 'm7', name: 'Série 1: Tris et Complexité', type: 'pdf', path: '/materials/ALGO1/TD/serie1.pdf' }],
    tp: [{ id: 'm8', name: 'TP1: Tris en C', type: 'code', path: '/materials/ALGO1/TP/tp1.c' }]
  }
};

export const DEFAULT_MAIN_APPS: AppShortcut[] = [
  { id: 'm1', name: 'Huawei Talent', url: 'https://e.huawei.com/en/talent/usercenter/#/home/mycourse', icon: 'https://upload.wikimedia.org/wikipedia/en/0/04/Huawei_Standard_logo.svg' },
  { id: 'm2', name: 'Open Classrooms', url: 'https://openclassrooms.com/', icon: 'https://upload.wikimedia.org/wikipedia/fr/0/0d/Logo_OpenClassrooms.png' },
  { id: 'm3', name: 'Bro Code', url: 'https://www.youtube.com/@BroCodez', icon: 'https://yt3.googleusercontent.com/ytc/AIdro_mPFVsxROj1dOtTWc9iNBwDYV4z42Q8LPokBSewiW9pCSg=s160-c-k-c0x00ffffff-no-rj' },
  { id: 'm4', name: 'Neso Academy', url: 'https://www.youtube.com/@nesoacademy', icon: 'https://yt3.googleusercontent.com/1iRrlRhV7RMLlyeLSeYaHjtvql01jATABgZtWeX3GyFcJJNNYp3ICYPgdyUOE6U4Y4PLXee594Q=s160-c-k-c0x00ffffff-no-rj' },
  { id: 'm5', name: 'CS50', url: 'https://www.youtube.com/cs50', icon: 'https://yt3.googleusercontent.com/ytc/AIdro_m7MWMBm4PynPndRMCxUEfNcU9Eufkk5ZkYI5RNjPchQ_c=s160-c-k-c0x00ffffff-no-rj' },
  { id: 'm6', name: 'Google Classroom', url: 'https://classroom.google.com/', icon: 'https://www.gstatic.com/classroom/logo_square_rounded.svg' },
  { id: 'm7', name: 'Mouhamed Chiny', url: 'https://www.youtube.com/mohamedchiny', icon: 'https://yt3.googleusercontent.com/ytc/AIdro_ldFQ8bZ7ym_5lDZRk1S0GuRwUq6LNIK4g082s0671JKUE=s160-c-k-c0x00ffffff-no-rj' },
  { id: 'm8', name: 'Drive DUT 1 TR', url: 'https://drive.google.com/drive/folders/1iHlwzAx0HlvWlXfS3OarBZUI1WTXr3b4', icon: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg' },
];

export const DEFAULT_COMM_APPS: AppShortcut[] = [
  { id: 'c1', name: 'WhatsApp', url: 'https://web.whatsapp.com/', icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/2062095_application_chat_communication_logo_whatsapp_icon.svg' },
  { id: 'c2', name: 'Telegram', url: 'https://web.telegram.org/', icon: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Telegram_2019_Logo.svg' },
  { id: 'c3', name: 'Discord', url: 'https://discord.com/app', icon: 'https://upload.wikimedia.org/wikipedia/fr/4/4f/Discord_Logo_sans_texte.svg' },
  { id: 'c4', name: 'Twitch', url: 'https://www.twitch.tv/', icon: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Twitch_Glitch_Logo_Purple.svg' },
  { id: 'c5', name: 'Reddit', url: 'https://www.reddit.com/', icon: 'https://upload.wikimedia.org/wikipedia/en/b/bd/Reddit_Logo_Icon.svg' },
  { id: 'c6', name: 'Google Chat', url: 'https://chat.google.com/app/home', icon: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Google_Chat_icon_%282023%29.svg' },
  { id: 'c7', name: 'Teams', url: 'https://teams.live.com/free/', icon: 'https://upload.wikimedia.org/wikipedia/commons/9/94/Microsoft_Office_Teams_%282019%E2%80%932025%29.svg' },
  { id: 'c8', name: 'Outlook', url: 'https://outlook.live.com/mail/0/', icon: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Microsoft_Office_Outlook_%282018%E2%80%932024%29.svg' },
  { id: 'c9', name: 'Gmail', url: 'https://mail.google.com/', icon: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg' },
];

export const DEFAULT_MEETING_APPS: AppShortcut[] = [
  { id: 'mt1', name: 'DUT1-TR', url: 'https://meet.google.com/gtm-xqae-gcc', icon: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Google_Meet_icon_%282020%29.svg' },
  { id: 'mt2', name: 'Tronc Commun', url: 'http://meet.google.com/gqv-bbxz-fth', icon: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Google_Meet_icon_%282020%29.svg' },
  { id: 'mt3', name: 'Dame Diene', url: 'https://meet.google.com/saw-hbyx-nbb?pli=1&authuser=1', icon: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Google_Meet_icon_%282020%29.svg' },
  { id: 'mt4', name: 'Com TK', url: 'https://meet.google.com/suh-brhk-ykc', icon: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Google_Meet_icon_%282020%29.svg' },
];

export const DEFAULT_GENERAL_APPS: AppShortcut[] = [
  { id: 'g1', name: 'GeeksForGeeks', url: 'https://www.geeksforgeeks.org/', icon: 'https://upload.wikimedia.org/wikipedia/commons/4/43/GeeksforGeeks.svg' },
  { id: 'g2', name: 'W3Schools', url: 'https://www.w3schools.com/', icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/W3Schools_logo.svg' },
  { id: 'g3', name: 'Stack Overflow', url: 'https://stackoverflow.com/questions', icon: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Stack_Overflow_icon.svg' },
  { id: 'g4', name: 'Wikipedia', url: 'https://www.wikipedia.org/', icon: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Wikipedia_logo_v2_%28white%29.svg' },
  { id: 'g5', name: 'ZTM', url: 'https://www.youtube.com/c/ZeroToMastery', icon: 'https://yt3.googleusercontent.com/ZmhWf1RNwIItXpRwgxl69BTbD0Rd12RaUdJCRCwqFHsoozStfHunMgUcy3afuxLbCG2-J8nRsis=s160-c-k-c0x00ffffff-no-rj' },
  { id: 'g6', name: 'freeCodeCamp', url: 'https://www.youtube.com/freecodecamp', icon: 'https://yt3.googleusercontent.com/ytc/AIdro_lGRc-05M2OoE1ejQdxeFhyP7OkJg9h4Y-7CK_5je3QqFI=s160-c-k-c0x00ffffff-no-rj' },
  { id: 'g7', name: 'OpenStax', url: 'https://openstax.org/', icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRk7ir8F47vrCLknEEMy0T3jbMrD7R8hTJCoQ&s' },
  { id: 'g8', name: 'Arts & Culture', url: 'https://artsandculture.google.com/', icon: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Arts_%26_Culture_Logo.svg' },
  { id: 'g9', name: 'NotebookLM', url: 'https://notebooklm.google.com/', icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaVvniNQVjy5U5CJHTxzn4RDwerecFEnTnTA&s' },
  { id: 'g10', name: 'Gemini', url: 'https://gemini.google.com/app', icon: 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Google-gemini-icon.svg' },
];

export const DEFAULT_FREEDOM_APPS: AppShortcut[] = [
  { id: 'f1', name: 'Chess.com', url: 'https://www.chess.com/', icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2gt3_fMyMnXS8Xptsfc98S_E6MVniEDg8AA&s' },
  { id: 'f2', name: 'Morse Learn', url: 'https://morse.withgoogle.com/learn/', icon: 'circle' },
  { id: 'f3', name: 'In Rhythm', url: 'https://artsandculture.google.com/experiment/in-rhythm-with-nature/1AHie_rumRxQOA', icon: 'https://lh3.googleusercontent.com/ci/AL18g_THrApQJnRV_yE_ymqrwlWrBy7p_F1g2Tjk1q1Haw1oGqhLuze7oJp-BcoGJwjsboEShpFIQg=w549-h491-n-rw-v1' },
  { id: 'f4', name: 'Blob Opera', url: 'https://artsandculture.google.com/experiment/blob-opera/AAHWrq360NcGbw?hl=en', icon: 'https://lh3.googleusercontent.com/ci/AL18g_RipmWmBtbzdQN9nTVCEKWrGkvWBTJ2vE3ibf_dmmPltDjMB90OxL104eBXFGWoTt0_PhcxGlA=w549-h415-n-rw-v1' },
  { id: 'f5', name: 'Shared Piano', url: 'https://musiclab.chromeexperiments.com/Shared-Piano/', icon: 'piano' },
  { id: 'f6', name: 'Magic Cat', url: 'https://doodles.google/doodle/halloween-2016/', icon: 'https://www.google.com/logos/doodles/2016/halloween-2016-5643419163557888-hp2x.gif' },
  { id: 'f7', name: 'Coding for Carrots', url: 'https://doodles.google/doodle/celebrating-50-years-of-kids-coding/', icon: 'https://www.google.com/logos/doodles/2017/celebrating-50-years-of-kids-coding-5745168905928704-2xa.gif' },
  { id: 'f8', name: 'Pony Express', url: 'https://doodles.google/doodle/155th-anniversary-of-the-pony-express/', icon: 'https://www.google.com/logos/doodles/2015/155th-anniversary-of-the-pony-express-5959391580782592-hp2x.jpg' },
  { id: 'f9', name: 'Quick Draw', url: 'https://quickdraw.withgoogle.com/', icon: 'draw' },
  { id: 'f10', name: 'AutoDraw', url: 'https://www.autodraw.com/', icon: 'https://www.autodraw.com/assets/images/logo.gif' },
  { id: 'f11', name: 'Google Earth', url: 'https://earth.google.com/web/', icon: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Google_Earth_Icon.png' },
];

export const DEFAULT_OS_APPS: AppShortcut[] = [
  { id: 'os1', name: 'Windows', url: 'https://learn.microsoft.com/en-us/windows/', icon: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Windows_logo_-_2021.svg' },
  { id: 'os2', name: 'Ubuntu', url: 'https://help.ubuntu.com/', icon: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/UbuntuCoF.svg' },
  { id: 'os3', name: 'Kali', url: 'https://www.kali.org/docs/', icon: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Kali-dragon-icon.svg' },
  { id: 'os4', name: 'Parrot OS', url: 'https://parrotsec.org/docs/', icon: 'https://parrotsec.org/docs/img/parrot-logo.svg' },
  { id: 'os5', name: 'Fedora', url: 'https://docs.fedoraproject.org/en-US/docs/', icon: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Fedora_icon_%282021%29.svg' },
  { id: 'os6', name: 'Athena OS', url: 'https://athenaos.org/en/getting-started/manifesto/', icon: 'https://athenaos.org/_astro/athena-dark.zw0VuR1C.svg' },
];

export const DEFAULT_CYBER_APPS: AppShortcut[] = [
  { id: 'cy1', name: 'TryHackMe', url: 'https://tryhackme.com/', icon: 'https://repository-images.githubusercontent.com/518509014/f7450454-158c-45e0-8b38-0c0ae4d7394c' },
  { id: 'cy2', name: 'HackTheBox', url: 'https://www.hackthebox.com/', icon: 'https://yt3.googleusercontent.com/2Tq9apgiHSV7NrCKzgRMbm-AABWJJXuyWMY_7MpQlVdvemqJRWcGegVq0G4e9xHCl8HcbQs_Ag=s160-c-k-c0x00ffffff-no-rj' },
];

export const DEFAULT_NET_APPS: AppShortcut[] = [
  { id: 'n1', name: 'Netacad', url: 'https://www.netacad.com/dashboard', icon: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Cisco_academy_logo.svg' },
  { id: 'n2', name: 'NetworkChuck', url: 'https://www.youtube.com/@networkchuck', icon: 'https://yt3.googleusercontent.com/ytc/AIdro_k01-_GpvVZW8w4ULtaQaa55ls8aMf2a5dXhIe56pjMvG0=s160-c-k-c0x00ffffff-no-rj' },
];

export const DEFAULT_DEV_APPS: AppShortcut[] = [
  { id: 'd1', name: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn', icon: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Cib-freecodecamp_%28CoreUI_Icons_v1.0.0%29.svg' },
  { id: 'd2', name: 'Odin Project', url: 'https://www.theodinproject.com/', icon: 'https://curricular.dev/assets/images/platforms/odin_project.png' },
  { id: 'd3', name: 'MDN', url: 'https://developer.mozilla.org/en-US/', icon: 'https://upload.wikimedia.org/wikipedia/commons/d/d2/MDN_Web_Docs_logo.svg' },
  { id: 'd4', name: 'React', url: 'https://react.dev/reference/react', icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg' },
  { id: 'd5', name: 'Flutter', url: 'https://docs.flutter.dev/', icon: 'https://docs.flutter.dev/assets/images/branding/flutter/logo/default.svg' },
  { id: 'd6', name: 'Dart', url: 'https://dart.dev/docs', icon: 'https://dart.dev/assets/img/logo/dart-192.svg' },
];

export const DEFAULT_AI_APPS: AppShortcut[] = [
  { id: 'ai1', name: 'Kaggle', url: 'https://www.kaggle.com/', icon: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Kaggle_logo.png' },
  { id: 'ai2', name: 'ML Course', url: 'https://developers.google.com/machine-learning/crash-course', icon: 'https://developers.google.com/static/machine-learning/crash-course/images/MLCC_Large_Lanuage_Model_no_text_480.png' },
  { id: 'ai3', name: 'TensorFlow', url: 'https://www.tensorflow.org/', icon: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Tensorflow_logo.svg' },
];

export const DEFAULT_LINUX_APPS: AppShortcut[] = [
  { id: 'l1', name: 'Linux Journey', url: 'https://labex.io/linuxjourney', icon: 'https://cdn-1.webcatalog.io/catalog/linux-journey/linux-journey-icon-filled-256.png?v=1714774980249' },
  { id: 'l2', name: 'Linux Command', url: 'https://linuxcommand.org/', icon: 'terminal' },
  { id: 'l3', name: 'Bandit', url: 'https://overthewire.org/wargames/bandit/', icon: 'https://overthewire.org/img/domokitten.png' },
];

export const DEFAULT_TYPING_APPS: AppShortcut[] = [
  { id: 't1', name: 'MonkeyType', url: 'https://monkeytype.com/', icon: 'https://logowik.com/content/uploads/images/monkeytype1477.logowik.com.webp' },
  { id: 't2', name: 'edClub', url: 'https://www.edclub.com/', icon: 'keyboard' },
  { id: 't3', name: 'TypingClub', url: 'https://www.typingclub.com/', icon: 'https://static.typingclub.com/m/corp2/img/typingclub_logo.png' },
  { id: 't4', name: 'Z-Type', url: 'https://zty.pe/', icon: 'videogame_asset' },
  { id: 't5', name: 'keybr', url: 'https://www.keybr.com', icon: 'text_fields' },
];

export const DEFAULT_TYPING_APPS_FOOTER: AppShortcut[] = [
  { id: 't1', name: 'MonkeyType', url: 'https://monkeytype.com/', icon: 'https://logowik.com/content/uploads/images/monkeytype1477.logowik.com.webp' },
  { id: 't2', name: 'edClub', url: 'https://www.edclub.com/', icon: 'keyboard' },
  { id: 't3', name: 'TypingClub', url: 'https://www.typingclub.com/', icon: 'https://static.typingclub.com/m/corp2/img/typingclub_logo.png' },
];

export const DEFAULT_DESIGN_APPS: AppShortcut[] = [
  { id: 'ds1', name: 'Figma', url: 'https://www.figma.com', icon: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg' },
  { id: 'ds2', name: 'Excalidraw', url: 'https://excalidraw.com/', icon: 'https://avatars.githubusercontent.com/u/59452120?s=280&v=4' },
  { id: 'ds3', name: 'Draw.io', url: 'https://www.drawio.com/', icon: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Diagrams.net_Logo.svg' },
];

export const DEFAULT_CLOUD_APPS: AppShortcut[] = [
  { id: 'cl1', name: 'AWS', url: 'https://aws.amazon.com/', icon: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg' },
  { id: 'cl2', name: 'GCP', url: 'https://cloud.google.com/', icon: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Google_cloud.png' },
  { id: 'cl3', name: 'Azure', url: 'https://portal.azure.com/', icon: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg' },
];

export const DEFAULT_DEPLOY_APPS: AppShortcut[] = [
  { id: 'dp1', name: 'GitHub', url: 'https://github.com/', icon: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg' },
  { id: 'dp2', name: 'Netlify', url: 'https://www.netlify.com/', icon: 'https://upload.wikimedia.org/wikipedia/commons/9/97/Netlify_logo_%282%29.svg' },
  { id: 'dp3', name: 'Vercel', url: 'https://vercel.com/', icon: 'v' },
  { id: 'dp4', name: 'Firebase', url: 'https://firebase.google.com/', icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBsWMuMzWCJ6vJrKqYjqMTinRWvtS5GsjoSA&s' },
];

export const DEFAULT_DB_APPS: AppShortcut[] = [
  { id: 'db1', name: 'PostgreSQL', url: 'https://www.postgresql.org/', icon: 'https://www.postgresql.org/media/img/about/press/elephant.png' },
  { id: 'db2', name: 'MySQL', url: 'https://www.mysql.com/', icon: 'https://upload.wikimedia.org/wikipedia/fr/6/62/MySQL.svg' },
  { id: 'db3', name: 'Supabase', url: 'https://supabase.com/', icon: 'https://raw.githubusercontent.com/gilbarbara/logos/main/logos/supabase-icon.svg' },
];

export const DEFAULT_TIMETABLE: TimetableEntry[] = [
  { id: 't1', day: 1, start_time: '10:00', duration_minutes: 120, subject_id: 's1', location: 'Saint-Louis', type: 'TD', professor: 'Pr: NGOM', subject_name: 'Concepts généraux des réseaux' },
  { id: 't2', day: 1, start_time: '13:00', duration_minutes: 120, subject_id: 's2', location: 'Saint-Louis', type: 'TD', professor: 'Dr: NDIAYE', subject_name: 'Algorithmique' },
  { id: 't3', day: 1, start_time: '15:00', duration_minutes: 120, subject_id: 's3', location: 'Saint-Louis', type: 'TP', professor: 'Monique Sene', subject_name: "Outils d'analyse des circuits linéaires" },
  { id: 't4', day: 2, start_time: '08:00', duration_minutes: 120, subject_id: 's4', location: 'Saint-Louis', type: 'TD', professor: 'Dr: Diene', subject_name: 'Outils mathématiques pour le signal' },
  { id: 't16', day: 2, start_time: '10:00', duration_minutes: 120, subject_id: 's12', location: 'Saint-Louis', type: 'TD', professor: 'DGI Staff', subject_name: 'Architecture des ordinateurs' },
  { id: 't5', day: 2, start_time: '13:00', duration_minutes: 120, subject_id: 's2', location: 'Saint-Louis', type: 'CM', professor: 'Dr: MENDY', subject_name: 'Algorithmique' },
  { id: 't6', day: 2, start_time: '15:00', duration_minutes: 120, subject_id: 's5', location: 'Saint-Louis', type: 'TP', professor: 'Dr: DIAHAME', subject_name: 'Introduction aux SGBD' },
  { id: 't7', day: 3, start_time: '08:00', duration_minutes: 120, subject_id: 's6', location: 'Saint-Louis', type: 'TD', professor: 'Pr: Dioum', subject_name: 'Signaux et Systèmes' },
  { id: 't8', day: 3, start_time: '10:00', duration_minutes: 120, subject_id: 's3', location: 'Saint-Louis', type: 'CM', professor: 'Dr: Diop', subject_name: "Outils d'analyse des circuits linéaires" },
  { id: 't9', day: 4, start_time: '08:00', duration_minutes: 120, subject_id: 's7', location: 'Saint-Louis', type: 'TP', professor: 'Dr: LY', subject_name: 'Techniques de recherche documentaire' },
  { id: 't10', day: 4, start_time: '10:00', duration_minutes: 120, subject_id: 's8', location: 'Saint-Louis', type: 'CM', professor: 'Dr: GUEYE', subject_name: 'Fondamentaux de Physique' },
  { id: 't11', day: 4, start_time: '13:00', duration_minutes: 120, subject_id: 's9', location: 'Saint-Louis', type: 'TD', professor: 'Dr: Ndour', subject_name: 'Anglais Technique' },
  { id: 't12', day: 4, start_time: '15:00', duration_minutes: 120, subject_id: 's6', location: 'Saint-Louis', type: 'TP', professor: 'Dr: SARR', subject_name: 'Signaux et Systèmes' },
  { id: 't17', day: 5, start_time: '08:00', duration_minutes: 120, subject_id: 's12', location: 'Saint-Louis', type: 'CM', professor: 'DGI Staff', subject_name: 'Architecture des ordinateurs' },
  { id: 't13', day: 5, start_time: '10:00', duration_minutes: 120, subject_id: 's10', location: 'Saint-Louis', type: 'CM', professor: 'Dr: Diene', subject_name: "Fondamentaux d'Analyse" },
  { id: 't14', day: 5, start_time: '15:00', duration_minutes: 120, subject_id: 's11', location: 'Saint-Louis', type: 'TD', professor: 'Dr: FAYE', subject_name: "Fondamentaux d'Algèbre" },
  { id: 't15', day: 6, start_time: '10:00', duration_minutes: 120, subject_id: 's11', location: 'Saint-Louis', type: 'CM', professor: 'Dr: FAYE', subject_name: "Fondamentaux d'Algèbre" },
];

export const ESP_VALEURS = [
  "L'excellence et l'humilité",
  "L'amour et la benevolence",
  "La solidarité et la tolérance",
  "Le respect et la considération",
  "Le courage et la patience",
  "La paix et la tranquillité",
  "La joie et l'espérance",
  "La volonté et la rigueur",
  "La justice et la vérité",
  "L'unité et la communion fraternelle"
];

export const ESP_SERMENT = `Je jure d'obéir à mes anciens
En tout ce qui concerne le travail auquel je suis appelé
Et dans l'exercice de mes devoirs
Je jure aussi de ne faire usage de mes connaissances
Que pour la réussite de tout polytechnicien
Il faut être conscient que dans la compétition
L'ambition personnelle sert le bien commun
Mais le meilleur résultat arrive
Lorsque chacun fait ce qui est bon pour lui et pour le groupe.`;
