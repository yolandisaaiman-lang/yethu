export interface JobVacancy {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  country: string;
  countryFlag: string;
  jobType: 'Full-time' | 'Contract' | 'Remote';
  salaryRange: string;
  postedDate: string;
  description: string;
  requiredSkills: string[];
  minimumYearsExperience: number;
  educationRequired: string;
  applyUrl: string;
  matchScore: number; // 0 to 100%
  matchBreakdown: {
    skillsMatch: number; // 0-100%
    experienceMatch: number; // 0-100%
    educationMatch: number; // 0-100%
    rationale: string;
  };
  isStrict100PercentMatch: boolean;
}

export interface ApplicationSession {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  status: 'initializing' | 'launching_browser' | 'navigating' | 'filling_form' | 'uploading_resume' | 'reviewing' | 'submitted' | 'failed';
  currentStep: string;
  logs: string[];
  browserbaseSessionId?: string;
  liveViewUrl?: string;
  submittedAt?: string;
  success: boolean;
}

export const SAMPLE_TECH_JOBS: JobVacancy[] = [
  {
    id: 'job_yethu_01',
    title: 'Senior Next.js & TypeScript Engineer',
    company: 'Paystack Africa',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    location: 'Cape Town / Remote',
    country: 'South Africa',
    countryFlag: '🇿🇦',
    jobType: 'Remote',
    salaryRange: 'R95,000 - R125,000 / mo',
    postedDate: 'Today',
    description: 'We are seeking a senior engineer to lead modern React, Next.js (App Router), and TypeScript frontends with WebRTC live streaming and secure APIs.',
    requiredSkills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'WebRTC'],
    minimumYearsExperience: 3,
    educationRequired: 'Bachelor Degree in Computer Science or Equivalent Experience',
    applyUrl: 'https://careers.paystack.com/senior-frontend',
    matchScore: 100,
    matchBreakdown: {
      skillsMatch: 100,
      experienceMatch: 100,
      educationMatch: 100,
      rationale: 'Perfect alignment: Verified proficiency in Next.js, React, TypeScript, Tailwind, and WebRTC streaming architecture with 3+ years experience.',
    },
    isStrict100PercentMatch: true,
  },
  {
    id: 'job_yethu_02',
    title: 'Full Stack AI Platform Developer',
    company: 'Flutterwave Labs',
    companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&auto=format&fit=crop&q=80',
    location: 'Lagos / Hybrid',
    country: 'Nigeria',
    countryFlag: '🇳🇬',
    jobType: 'Full-time',
    salaryRange: '₦2,500,000 - ₦3,200,000 / mo',
    postedDate: '1 day ago',
    description: 'Build high-scale African AI services utilizing OpenAI APIs, Postgres databases, and real-time distributed WebSockets across West Africa.',
    requiredSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'OpenAI'],
    minimumYearsExperience: 3,
    educationRequired: 'Degree in Computer Science, Software Engineering or Related Field',
    applyUrl: 'https://flutterwave.com/careers/ai-dev',
    matchScore: 100,
    matchBreakdown: {
      skillsMatch: 100,
      experienceMatch: 100,
      educationMatch: 100,
      rationale: '100% verified match: Full compatibility with candidate AI API experience, TypeScript web frameworks, and relational Postgres BaaS integration.',
    },
    isStrict100PercentMatch: true,
  },
  {
    id: 'job_yethu_03',
    title: 'Lead Frontend Architect (Mobile & PWA)',
    company: 'Safaricom Alpha',
    companyLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&auto=format&fit=crop&q=80',
    location: 'Nairobi / Remote',
    country: 'Kenya',
    countryFlag: '🇰🇪',
    jobType: 'Remote',
    salaryRange: '$4,500 - $6,000 / mo',
    postedDate: '2 days ago',
    description: 'Lead the next generation of mobile-first web applications and PWAs for millions of users across East Africa with sub-second latency.',
    requiredSkills: ['React', 'Next.js', 'TypeScript', 'CSS', 'PWA'],
    minimumYearsExperience: 4,
    educationRequired: 'B.Sc / Higher National Diploma in Computing or Proven Track Record',
    applyUrl: 'https://safaricom.co.ke/careers/frontend-lead',
    matchScore: 100,
    matchBreakdown: {
      skillsMatch: 100,
      experienceMatch: 100,
      educationMatch: 100,
      rationale: 'Exact 100% match: Candidate qualifies on PWA architectural skills, modern frontend performance standards, and senior seniority requirements.',
    },
    isStrict100PercentMatch: true,
  },
  {
    id: 'job_yethu_04',
    title: 'Senior Cryptography & Security Engineer',
    company: 'Chipper Cash Security',
    companyLogo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=100&auto=format&fit=crop&q=80',
    location: 'Accra / Remote',
    country: 'Ghana',
    countryFlag: '🇬🇭',
    jobType: 'Remote',
    salaryRange: '$5,000 - $7,000 / mo',
    postedDate: '3 days ago',
    description: 'Architect Web Crypto API encryption, zero-knowledge proofs, AES-GCM-256 E2EE channels, and fraud prevention algorithms.',
    requiredSkills: ['TypeScript', 'Web Crypto', 'Security', 'AES-256', 'Node.js'],
    minimumYearsExperience: 4,
    educationRequired: 'Bachelor Degree in Engineering or Information Security',
    applyUrl: 'https://chippercash.com/careers/crypto-sec',
    matchScore: 100,
    matchBreakdown: {
      skillsMatch: 100,
      experienceMatch: 100,
      educationMatch: 100,
      rationale: '100% security match: Direct mastery of client-side Web Crypto API, AES-GCM key derivation, and enterprise E2EE chat protocol design.',
    },
    isStrict100PercentMatch: true,
  },
  {
    id: 'job_yethu_05',
    title: 'Junior Python Data Analyst',
    company: 'Kobo360 Logistics',
    companyLogo: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=100&auto=format&fit=crop&q=80',
    location: 'Lagos',
    country: 'Nigeria',
    countryFlag: '🇳🇬',
    jobType: 'Full-time',
    salaryRange: '₦900,000 / mo',
    postedDate: '4 days ago',
    description: 'Analyze supply chain telematics using Python, Pandas, and SQL.',
    requiredSkills: ['Python', 'Pandas', 'SQL', 'Tableau'],
    minimumYearsExperience: 1,
    educationRequired: 'Bachelor Degree in Statistics or Math',
    applyUrl: 'https://kobo360.com/careers/data-analyst',
    matchScore: 42,
    matchBreakdown: {
      skillsMatch: 35,
      experienceMatch: 80,
      educationMatch: 70,
      rationale: 'Mismatched core skill profile: Requires specialized Pandas/Tableau stack rather than candidate frontend/full-stack WebRTC focus.',
    },
    isStrict100PercentMatch: false,
  }
];
