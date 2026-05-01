/* ═══════════════════════════════════════════════════════════
   SCHOLARMATCH — script.js
   Scholarship matching engine, UI logic, data layer
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ─── 1. SCHOLARSHIP DATABASE ────────────────────────────────
   Each scholarship has weighted criteria for the scoring engine.
   Fields: name, host, country (study destination), flag, amount,
   deadline, description, eligibleRegions, fields, degreeLevel,
   minGPA, languageReq, needBased, tags, requirements[], link
   ─────────────────────────────────────────────────────────── */
const SCHOLARSHIPS = [
  {
    id: 1,
    name: "Fulbright Foreign Student Program",
    host: "U.S. Department of State",
    country: "USA",
    flag: "🇺🇸",
    amount: "Full Funding (tuition + stipend)",
    amountValue: 50000,
    deadline: "Varies by country (Feb–Oct)",
    description: "One of the world's most prestigious scholarships, covering graduate study and research in the United States for students from over 160 countries.",
    eligibleRegions: ["all"],
    fields: ["Any"],
    degreeLevel: ["Graduate", "PhD", "Postdoctoral"],
    minGPA: 3.0,
    languageReq: "Proficient",
    needBased: false,
    tags: ["fullride", "merit", "govt"],
    requirements: [
      "Bachelor's degree or equivalent",
      "Strong academic record (typically 3.0+ GPA)",
      "English proficiency (TOEFL/IELTS)",
      "Leadership potential and community impact",
      "Endorsement from home country Fulbright Commission"
    ],
    link: "https://foreign.fulbrightonline.org/",
    accentColor: "#60a5fa"
  },
  {
    id: 2,
    name: "Rhodes Scholarship",
    host: "Rhodes Trust, University of Oxford",
    country: "UK",
    flag: "🇬🇧",
    amount: "Full Funding (fees + £17,310/year)",
    amountValue: 65000,
    deadline: "Varies by country (Jul–Oct)",
    description: "The oldest and most prestigious international graduate fellowship in the world, bringing exceptional all-round students to study at the University of Oxford.",
    eligibleRegions: ["all"],
    fields: ["Any"],
    degreeLevel: ["Graduate", "PhD"],
    minGPA: 3.7,
    languageReq: "Proficient",
    needBased: false,
    tags: ["fullride", "merit"],
    requirements: [
      "Age 18–24 (varies by constituency)",
      "Strong GPA (typically 3.7+ or equivalent)",
      "Literary and scholastic attainments",
      "Physical vigour — energy and fondness for sports",
      "Moral force of character",
      "Sympathy for and protection of the weak"
    ],
    link: "https://www.rhodeshouse.ox.ac.uk/",
    accentColor: "#c084fc"
  },
  {
    id: 3,
    name: "Gates Cambridge Scholarship",
    host: "Gates Cambridge Trust, University of Cambridge",
    country: "UK",
    flag: "🇬🇧",
    amount: "Full Funding (tuition + £18,500/year)",
    amountValue: 60000,
    deadline: "October (US) / December (all others)",
    description: "Fully-funded scholarships for outstanding applicants from outside the UK to pursue a full-time postgraduate degree at the University of Cambridge.",
    eligibleRegions: ["non-UK"],
    fields: ["Any"],
    degreeLevel: ["Graduate", "PhD"],
    minGPA: 3.6,
    languageReq: "Proficient",
    needBased: false,
    tags: ["fullride", "merit", "research"],
    requirements: [
      "Must be from outside the United Kingdom",
      "Apply for a Cambridge graduate course independently",
      "Outstanding intellectual ability",
      "Leadership potential",
      "Commitment to improving lives of others"
    ],
    link: "https://www.gatescambridge.org/",
    accentColor: "#4ade80"
  },
  {
    id: 4,
    name: "Chevening Scholarship",
    host: "UK Government (FCDO)",
    country: "UK",
    flag: "🇬🇧",
    amount: "Full Funding (tuition + living costs)",
    amountValue: 45000,
    deadline: "November 2 (annually)",
    description: "The UK Government's flagship international award scheme, funding exceptional emerging leaders to pursue a one-year master's degree at any UK university.",
    eligibleRegions: ["developing"],
    fields: ["Any"],
    degreeLevel: ["Graduate"],
    minGPA: 2.8,
    languageReq: "Proficient",
    needBased: false,
    tags: ["fullride", "merit", "govt"],
    requirements: [
      "Citizen of a Chevening-eligible country",
      "Bachelor's degree with strong results",
      "2+ years of work experience",
      "Return to home country for 2 years after study",
      "Apply to 3 different UK university courses"
    ],
    link: "https://www.chevening.org/",
    accentColor: "#d4af37"
  },
  {
    id: 5,
    name: "DAAD Scholarships",
    host: "German Academic Exchange Service",
    country: "Germany",
    flag: "🇩🇪",
    amount: "€850–€1,200/month + extras",
    amountValue: 18000,
    deadline: "Varies by program (Oct–Jan)",
    description: "Germany's largest funding organization for international academic exchange. Offers numerous programs for study and research across all disciplines.",
    eligibleRegions: ["all"],
    fields: ["Any"],
    degreeLevel: ["Graduate", "PhD", "Postdoctoral"],
    minGPA: 3.0,
    languageReq: "Intermediate",
    needBased: false,
    tags: ["merit", "research"],
    requirements: [
      "Bachelor's degree with above-average grades",
      "Statement of motivation",
      "Two letters of recommendation",
      "German or English language proficiency (depends on program)",
      "Relevant work or research experience"
    ],
    link: "https://www.daad.de/en/",
    accentColor: "#fbbf24"
  },
  {
    id: 6,
    name: "Commonwealth Scholarship",
    host: "Commonwealth Scholarship Commission (UK)",
    country: "UK",
    flag: "🇬🇧",
    amount: "Full Funding (tuition + stipend + flights)",
    amountValue: 40000,
    deadline: "December (annually)",
    description: "Offered to citizens of Commonwealth countries for postgraduate study in the UK. Designed to support academic development and sustainable development.",
    eligibleRegions: ["commonwealth"],
    fields: ["Any"],
    degreeLevel: ["Graduate", "PhD"],
    minGPA: 3.0,
    languageReq: "Proficient",
    needBased: true,
    tags: ["fullride", "need", "govt"],
    requirements: [
      "Citizen of a Commonwealth country",
      "First-class or upper second-class undergraduate degree",
      "Available to take up scholarship by start date",
      "Commitment to development in home country",
      "Permanent resident in a Commonwealth country"
    ],
    link: "https://cscuk.fcdo.gov.uk/",
    accentColor: "#60a5fa"
  },
  {
    id: 7,
    name: "Australia Awards Scholarships",
    host: "Australian Government (DFAT)",
    country: "Australia",
    flag: "🇦🇺",
    amount: "Full Funding (tuition + living + travel)",
    amountValue: 42000,
    deadline: "Varies by country (Apr–Jun)",
    description: "Long-term development awards supporting students from developing countries in the Indo-Pacific to undertake full-time undergraduate or postgraduate study in Australia.",
    eligibleRegions: ["developing", "pacific", "africa", "asia"],
    fields: ["Any"],
    degreeLevel: ["Undergraduate", "Graduate"],
    minGPA: 2.8,
    languageReq: "Proficient",
    needBased: true,
    tags: ["fullride", "need", "govt"],
    requirements: [
      "Citizen of an eligible developing country",
      "Meet academic requirements of chosen institution",
      "Apply for an eligible Australian tertiary course",
      "Return to home country for 2 years post-study",
      "IELTS 6.0+ or equivalent"
    ],
    link: "https://www.dfat.gov.au/people-to-people/australia-awards",
    accentColor: "#fbbf24"
  },
  {
    id: 8,
    name: "Erasmus+ Scholarship",
    host: "European Commission",
    country: "Europe",
    flag: "🇪🇺",
    amount: "€850–€1,000/month (varies)",
    amountValue: 14000,
    deadline: "Varies by institution (Jan–Feb)",
    description: "The EU's flagship education program enabling students to study, train, volunteer, and gain work experience in European countries. Millions of people have benefited.",
    eligibleRegions: ["all"],
    fields: ["Any"],
    degreeLevel: ["Undergraduate", "Graduate", "PhD"],
    minGPA: 2.5,
    languageReq: "Intermediate",
    needBased: false,
    tags: ["merit"],
    requirements: [
      "Enrolled in a participating institution",
      "Completed at least 1 year of higher education",
      "Accepted for exchange via home university agreement",
      "Language requirements vary by destination"
    ],
    link: "https://erasmus-plus.ec.europa.eu/",
    accentColor: "#60a5fa"
  },
  {
    id: 9,
    name: "Knight-Hennessy Scholars Program",
    host: "Stanford University",
    country: "USA",
    flag: "🇺🇸",
    amount: "Full Funding (tuition + stipend + extras)",
    amountValue: 90000,
    deadline: "October (annually)",
    description: "The world's largest fully endowed scholars program, providing full funding for graduate study at Stanford University to build a community of future global leaders.",
    eligibleRegions: ["all"],
    fields: ["Any"],
    degreeLevel: ["Graduate", "PhD"],
    minGPA: 3.7,
    languageReq: "Proficient",
    needBased: false,
    tags: ["fullride", "merit"],
    requirements: [
      "Completed undergraduate degree by program start",
      "Must be admitted to a Stanford graduate program",
      "Demonstrated independent thinking",
      "Civic mindset and collaborative nature",
      "Exceptional academic achievement"
    ],
    link: "https://knight-hennessy.stanford.edu/",
    accentColor: "#c084fc"
  },
  {
    id: 10,
    name: "Schwarzman Scholars",
    host: "Schwarzman College, Tsinghua University",
    country: "China",
    flag: "🇨🇳",
    amount: "Full Funding (tuition + room + board)",
    amountValue: 55000,
    deadline: "September (annually)",
    description: "A master's program at Tsinghua University designed to prepare future leaders to navigate the geopolitical landscape between China and the rest of the world.",
    eligibleRegions: ["all"],
    fields: ["Any"],
    degreeLevel: ["Graduate"],
    minGPA: 3.5,
    languageReq: "Proficient",
    needBased: false,
    tags: ["fullride", "merit"],
    requirements: [
      "Age 18–28",
      "Strong undergraduate GPA",
      "Leadership experience",
      "No prior Chinese language required",
      "Ambition for significant societal impact"
    ],
    link: "https://www.schwarzmanscholars.org/",
    accentColor: "#f87171"
  },
  {
    id: 11,
    name: "Mastercard Foundation Scholars Program",
    host: "Mastercard Foundation + Partner Universities",
    country: "Multiple",
    flag: "🌍",
    amount: "Full Funding (tuition + living + travel)",
    amountValue: 38000,
    deadline: "Varies by university (Jan–Mar)",
    description: "Provides comprehensive scholarships for academically talented yet economically disadvantaged young Africans to study at leading universities worldwide.",
    eligibleRegions: ["africa"],
    fields: ["Any"],
    degreeLevel: ["Undergraduate", "Graduate"],
    minGPA: 3.0,
    languageReq: "Proficient",
    needBased: true,
    tags: ["fullride", "need", "africa"],
    requirements: [
      "African citizenship",
      "Strong academic record",
      "Financial need demonstrated",
      "Leadership qualities",
      "Commitment to giving back to Africa"
    ],
    link: "https://mastercardfdn.org/all/scholars/",
    accentColor: "#f87171"
  },
  {
    id: 12,
    name: "Japanese MEXT Scholarship",
    host: "Japanese Ministry of Education (MEXT)",
    country: "Japan",
    flag: "🇯🇵",
    amount: "¥117,000–¥148,000/month + tuition waiver",
    amountValue: 22000,
    deadline: "May–June (embassy track)",
    description: "Scholarships for international students to study at Japanese universities at the undergraduate or graduate level, fully funded by the Japanese government.",
    eligibleRegions: ["all"],
    fields: ["Any"],
    degreeLevel: ["Undergraduate", "Graduate", "PhD"],
    minGPA: 2.8,
    languageReq: "Intermediate",
    needBased: false,
    tags: ["fullride", "govt"],
    requirements: [
      "Age limits apply by category",
      "Strong academic record",
      "Commitment to learning Japanese (language classes provided)",
      "Physical and mental health requirements",
      "Recommendation from school principal or embassy"
    ],
    link: "https://www.mext.go.jp/en/policy/education/highered/title02/detail02/sdetail02/1373897.htm",
    accentColor: "#f87171"
  },
  {
    id: 13,
    name: "Chinese Government Scholarship (CSC)",
    host: "China Scholarship Council",
    country: "China",
    flag: "🇨🇳",
    amount: "Full Funding (tuition + room + stipend)",
    amountValue: 16000,
    deadline: "February–March (annually)",
    description: "Enables international students to study in China at the undergraduate, graduate, and doctoral levels, covering all costs at partner Chinese universities.",
    eligibleRegions: ["all"],
    fields: ["Any"],
    degreeLevel: ["Undergraduate", "Graduate", "PhD"],
    minGPA: 2.8,
    languageReq: "Intermediate",
    needBased: false,
    tags: ["fullride", "govt"],
    requirements: [
      "Non-Chinese citizen in good health",
      "Age: ≤25 (UG), ≤35 (Graduate), ≤40 (PhD)",
      "Academic transcripts and diploma",
      "Medical examination certificate",
      "Chinese or English proficiency depending on program"
    ],
    link: "https://www.campuschina.org/",
    accentColor: "#f87171"
  },
  {
    id: 14,
    name: "Korean Government Scholarship (GKS/KGSP)",
    host: "National Institute for International Education (NIIED)",
    country: "South Korea",
    flag: "🇰🇷",
    amount: "Full Funding (tuition + ₩900,000/month + extras)",
    amountValue: 18000,
    deadline: "February–March (Embassy Track)",
    description: "Provides full scholarships for international students to study in South Korea at the undergraduate or graduate level, including a year of Korean language training.",
    eligibleRegions: ["all"],
    fields: ["Any"],
    degreeLevel: ["Undergraduate", "Graduate", "PhD"],
    minGPA: 2.8,
    languageReq: "Intermediate",
    needBased: false,
    tags: ["fullride", "govt"],
    requirements: [
      "Age: ≤25 (UG), ≤40 (Graduate)",
      "GPA above 80% or equivalent",
      "Not Korean citizen or dual national",
      "Health requirements met",
      "TOPIK/IELTS scores may be required"
    ],
    link: "https://www.studyinkorea.go.kr/en/sub/gks/allnew_intro.do",
    accentColor: "#60a5fa"
  },
  {
    id: 15,
    name: "Türkiye Bursları (Turkish Government Scholarship)",
    host: "Turkish Government (YTB)",
    country: "Turkey",
    flag: "🇹🇷",
    amount: "Full Funding (tuition + ₺12,000–26,000/month)",
    amountValue: 12000,
    deadline: "February 20 (annually)",
    description: "Government scholarship for international students to study at Turkish universities, covering all study levels from undergraduate to doctoral and language training.",
    eligibleRegions: ["all"],
    fields: ["Any"],
    degreeLevel: ["Undergraduate", "Graduate", "PhD"],
    minGPA: 2.5,
    languageReq: "Intermediate",
    needBased: false,
    tags: ["fullride", "govt"],
    requirements: [
      "Age: ≤21 (UG), ≤30 (Graduate), ≤35 (PhD)",
      "Min 70% GPA (STEM) or 75% (other fields)",
      "Not studying in Turkey currently",
      "Turkish language course provided first year",
      "Health insurance included"
    ],
    link: "https://turkiyeburslari.gov.tr/",
    accentColor: "#f87171"
  },
  {
    id: 16,
    name: "Swiss Government Excellence Scholarships",
    host: "Swiss Confederation",
    country: "Switzerland",
    flag: "🇨🇭",
    amount: "CHF 1,920/month + tuition waiver",
    amountValue: 30000,
    deadline: "Varies by country (Nov–Dec)",
    description: "Prestigious scholarships offered by the Swiss Confederation to promote international exchange and research cooperation with Switzerland at the postgraduate level.",
    eligibleRegions: ["all"],
    fields: ["Any"],
    degreeLevel: ["Graduate", "PhD", "Postdoctoral"],
    minGPA: 3.3,
    languageReq: "Proficient",
    needBased: false,
    tags: ["merit", "research", "govt"],
    requirements: [
      "Apply for research at a Swiss institution",
      "Master's degree for PhD track",
      "PhD for postdoctoral track",
      "Excellent academic record",
      "Strong research proposal"
    ],
    link: "https://www.sbfi.admin.ch/sbfi/en/home/education/scholarships-and-grants.html",
    accentColor: "#f87171"
  },
  {
    id: 17,
    name: "Swedish Institute Scholarships (SISGP)",
    host: "Swedish Institute",
    country: "Sweden",
    flag: "🇸🇪",
    amount: "SEK 11,000/month + tuition + health",
    amountValue: 26000,
    deadline: "February (annually)",
    description: "Scholarships for future global leaders from eligible countries to pursue master's-level studies in Sweden, with a focus on sustainability and development.",
    eligibleRegions: ["asia", "africa", "developing", "eastern_europe"],
    fields: ["Any"],
    degreeLevel: ["Graduate"],
    minGPA: 3.0,
    languageReq: "Proficient",
    needBased: false,
    tags: ["fullride", "merit"],
    requirements: [
      "Citizen and resident of an eligible country",
      "Bachelor's degree",
      "Minimum 3,000 hours of work experience",
      "Accepted to Swedish master's program via universityadmissions.se",
      "Leadership and sustainability focus"
    ],
    link: "https://si.se/en/apply/scholarships/",
    accentColor: "#4ade80"
  },
  {
    id: 18,
    name: "World Bank Scholarship Program (JJ/WBGSP)",
    host: "World Bank",
    country: "USA / Multiple",
    flag: "🌐",
    amount: "Full Funding (tuition + stipend + travel)",
    amountValue: 40000,
    deadline: "February (annually)",
    description: "Offers full scholarships for mid-career professionals from developing countries to pursue graduate studies related to economic and social development.",
    eligibleRegions: ["developing"],
    fields: ["Business", "Humanities", "Agriculture", "Medicine"],
    degreeLevel: ["Graduate"],
    minGPA: 3.0,
    languageReq: "Proficient",
    needBased: false,
    tags: ["fullride", "merit", "govt"],
    requirements: [
      "Citizen of a World Bank member developing country",
      "NOT a citizen of the study country",
      "At least 3 years relevant development work experience",
      "Admission to an eligible graduate program",
      "Under 45 years of age at application"
    ],
    link: "https://www.worldbank.org/en/programs/scholarships",
    accentColor: "#4ade80"
  },
  {
    id: 19,
    name: "Rotary Peace Fellowship",
    host: "Rotary Foundation",
    country: "Multiple",
    flag: "🕊️",
    amount: "Full Funding (tuition + fees + stipend)",
    amountValue: 35000,
    deadline: "May 15 (annually)",
    description: "Training for peace and conflict prevention/resolution leaders through master's degrees at Rotary Peace Centers or professional certificates at partner universities.",
    eligibleRegions: ["all"],
    fields: ["Humanities", "Law"],
    degreeLevel: ["Graduate"],
    minGPA: 3.0,
    languageReq: "Proficient",
    needBased: false,
    tags: ["fullride", "peace", "merit"],
    requirements: [
      "Undergraduate degree",
      "Strong academic achievement",
      "3+ years of professional work experience",
      "Skills in leadership and conflict resolution",
      "Language proficiency (English + second language preferred)"
    ],
    link: "https://www.rotary.org/en/our-programs/peace-fellowships",
    accentColor: "#4ade80"
  },
  {
    id: 20,
    name: "NSF Graduate Research Fellowship",
    host: "National Science Foundation",
    country: "USA",
    flag: "🇺🇸",
    amount: "$37,000/year + $16,000 tuition",
    amountValue: 53000,
    deadline: "October (annually)",
    description: "Provides three years of support for graduate study leading to research-based master's or doctoral degrees in STEM fields. Open to US citizens only.",
    eligibleRegions: ["usa"],
    fields: ["STEM"],
    degreeLevel: ["Graduate", "PhD"],
    minGPA: 3.3,
    languageReq: "Native",
    needBased: false,
    tags: ["stem", "research", "merit"],
    requirements: [
      "US citizen, national, or permanent resident",
      "Graduate study in STEM fields",
      "Enrolled or planning to enroll in research-based degree",
      "Three reference letters required",
      "Personal and research statements"
    ],
    link: "https://www.nsfgrfp.org/",
    accentColor: "#60a5fa"
  },
  {
    id: 21,
    name: "Open Society Foundations Scholarships",
    host: "Open Society Foundations",
    country: "Multiple",
    flag: "🌐",
    amount: "Varies by program",
    amountValue: 25000,
    deadline: "Varies by program",
    description: "A range of scholarship programs supporting students from marginalized communities, Central Asia, Eastern Europe, and the Global South to pursue higher education.",
    eligibleRegions: ["central_asia", "eastern_europe", "africa", "developing"],
    fields: ["Humanities", "Law", "Business"],
    degreeLevel: ["Graduate", "Undergraduate"],
    minGPA: 2.8,
    languageReq: "Proficient",
    needBased: true,
    tags: ["need", "merit"],
    requirements: [
      "From an eligible country or marginalized community",
      "Demonstrated financial need",
      "Strong academic record",
      "Community involvement and leadership",
      "Commitment to open society values"
    ],
    link: "https://www.opensocietyfoundations.org/grants",
    accentColor: "#c084fc"
  },
  {
    id: 22,
    name: "Aga Khan Foundation International Scholarship",
    host: "Aga Khan Foundation",
    country: "Multiple",
    flag: "🌍",
    amount: "50% grant + 50% loan (need-based)",
    amountValue: 20000,
    deadline: "March 31 (annually)",
    description: "Provides postgraduate scholarships to exceptional students from developing countries who have no other means of financing their studies.",
    eligibleRegions: ["developing", "asia", "africa"],
    fields: ["Any"],
    degreeLevel: ["Graduate"],
    minGPA: 3.0,
    languageReq: "Proficient",
    needBased: true,
    tags: ["need", "merit"],
    requirements: [
      "Citizen of a developing country",
      "Exceptional academic merit",
      "No other means of financing",
      "Admission to a recognized graduate program",
      "Commitment to development goals"
    ],
    link: "https://www.akdn.org/our-agencies/aga-khan-foundation/international-scholarship-programme",
    accentColor: "#d4af37"
  },
  {
    id: 23,
    name: "New Zealand Aid Programme Scholarships",
    host: "New Zealand Government (MFAT)",
    country: "New Zealand",
    flag: "🇳🇿",
    amount: "Full Funding (tuition + NZ$1,800/month + travel)",
    amountValue: 32000,
    deadline: "February (annually)",
    description: "Funded by New Zealand's development cooperation program to enable people from developing countries, particularly the Pacific and Asia, to gain skills for development.",
    eligibleRegions: ["pacific", "asia", "africa", "developing"],
    fields: ["Any"],
    degreeLevel: ["Undergraduate", "Graduate"],
    minGPA: 2.8,
    languageReq: "Proficient",
    needBased: false,
    tags: ["fullride", "govt"],
    requirements: [
      "Citizen of an eligible country",
      "Meet academic entry requirements of NZ institution",
      "Be in good health",
      "English language requirements (IELTS 6.0+)",
      "Return to home country after study"
    ],
    link: "https://www.mfat.govt.nz/en/aid-and-development/new-zealand-aid-programme/scholarships/",
    accentColor: "#4ade80"
  },
  {
    id: 24,
    name: "Vanier Canada Graduate Scholarships",
    host: "Government of Canada",
    country: "Canada",
    flag: "🇨🇦",
    amount: "CAD $50,000/year (3 years)",
    amountValue: 120000,
    deadline: "November (annually)",
    description: "Attracts and retains world-class doctoral students by supporting students who demonstrate leadership skills and a high standard of scholarly achievement.",
    eligibleRegions: ["all"],
    fields: ["STEM", "Humanities", "Medicine"],
    degreeLevel: ["PhD"],
    minGPA: 3.7,
    languageReq: "Proficient",
    needBased: false,
    tags: ["merit", "research"],
    requirements: [
      "Nominated by a Canadian university",
      "Enrolled in a doctoral program at a Canadian institution",
      "GPA of 3.7 or above in last two years of study",
      "Demonstrated leadership ability",
      "Research potential in natural/social sciences, humanities, or health"
    ],
    link: "https://vanier.gc.ca/en/home-accueil.html",
    accentColor: "#f87171"
  },
  {
    id: 25,
    name: "AAUW International Fellowships",
    host: "American Association of University Women",
    country: "USA",
    flag: "🇺🇸",
    amount: "$20,000–$30,000",
    amountValue: 25000,
    deadline: "November 15 (annually)",
    description: "Full-time fellowships for women who are not US citizens or permanent residents to pursue graduate or postdoctoral study in the United States.",
    eligibleRegions: ["non-usa"],
    fields: ["Any"],
    degreeLevel: ["Graduate", "PhD", "Postdoctoral"],
    minGPA: 3.0,
    languageReq: "Proficient",
    needBased: false,
    tags: ["women", "merit"],
    requirements: [
      "Women who are NOT US citizens or permanent residents",
      "Intent to return to home country after studies",
      "Enrolled in accredited US institution",
      "Strong academic record",
      "Commitment to advancing women's issues"
    ],
    link: "https://www.aauw.org/resources/programs/fellowships-grants/current-opportunities/international/",
    accentColor: "#c084fc"
  },
  {
    id: 26,
    name: "Orange Tulip Scholarship (Netherlands)",
    host: "Nuffic / Dutch Government",
    country: "Netherlands",
    flag: "🇳🇱",
    amount: "Varies by institution (partial or full)",
    amountValue: 15000,
    deadline: "Varies by university (Jan–Mar)",
    description: "Scholarship program enabling talented students from select countries to study at Dutch universities with financial support from participating institutions.",
    eligibleRegions: ["asia", "africa", "latin_america"],
    fields: ["Any"],
    degreeLevel: ["Graduate", "Undergraduate"],
    minGPA: 3.0,
    languageReq: "Proficient",
    needBased: false,
    tags: ["merit"],
    requirements: [
      "Citizen of an eligible country",
      "Accepted to a participating Dutch institution",
      "Minimum GPA as specified by institution",
      "IELTS 6.0+ or equivalent",
      "Demonstrated motivation and leadership"
    ],
    link: "https://www.studyinholland.nl/scholarships/orange-tulip-scholarship",
    accentColor: "#fbbf24"
  },
  {
    id: 27,
    name: "Hubert H. Humphrey Fellowship Program",
    host: "U.S. Department of State / IIE",
    country: "USA",
    flag: "🇺🇸",
    amount: "Full Funding (tuition + stipend + health)",
    amountValue: 42000,
    deadline: "Varies by country (Sep–Oct)",
    description: "A non-degree academic and professional program for experienced professionals from developing countries for 10 months of study and development in the USA.",
    eligibleRegions: ["developing"],
    fields: ["Humanities", "Law", "Medicine", "Business", "Agriculture", "Education"],
    degreeLevel: ["Postdoctoral"],
    minGPA: 2.8,
    languageReq: "Proficient",
    needBased: false,
    tags: ["fullride", "govt", "merit"],
    requirements: [
      "Mid-career professional (5+ years experience)",
      "From an eligible developing country",
      "Bachelor's degree or equivalent",
      "Demonstrated leadership",
      "Strong English proficiency"
    ],
    link: "https://www.humphreyfellowship.org/",
    accentColor: "#60a5fa"
  },
  {
    id: 28,
    name: "Boren Scholarships & Fellowships",
    host: "National Security Education Program (USA)",
    country: "USA",
    flag: "🇺🇸",
    amount: "Up to $25,000",
    amountValue: 25000,
    deadline: "January (fellowships) / February (scholarships)",
    description: "Supports US students in studying less commonly taught languages in world regions critical to US interests, including Africa, Asia, Central/Eastern Europe, and the Middle East.",
    eligibleRegions: ["usa"],
    fields: ["Humanities", "Law", "STEM", "Business"],
    degreeLevel: ["Undergraduate", "Graduate"],
    minGPA: 3.0,
    languageReq: "Native",
    needBased: false,
    tags: ["merit", "govt"],
    requirements: [
      "US citizen",
      "Study in a critical language or region",
      "Commitment to federal service after graduation",
      "Strong academic record",
      "Personal statement on national security interest"
    ],
    link: "https://www.borenawards.org/",
    accentColor: "#4ade80"
  },
  {
    id: 29,
    name: "Ford Foundation Fellowship Program",
    host: "Ford Foundation / National Academies",
    country: "USA",
    flag: "🇺🇸",
    amount: "$28,000/year (predoctoral)",
    amountValue: 28000,
    deadline: "December (annually)",
    description: "Seeks to increase diversity in the nation's college and university faculties by supporting outstanding scholars who are committed to a career in teaching and research.",
    eligibleRegions: ["usa"],
    fields: ["Humanities", "STEM", "Business", "Arts"],
    degreeLevel: ["PhD"],
    minGPA: 3.3,
    languageReq: "Native",
    needBased: false,
    tags: ["merit", "research", "diversity"],
    requirements: [
      "US citizen, national, or permanent resident",
      "From a group underrepresented in academia",
      "Commitment to teaching and research career",
      "Enrolled in accredited US institution",
      "Strong academic achievement"
    ],
    link: "https://www.nationalacademies.org/our-work/ford-foundation-fellowships",
    accentColor: "#c084fc"
  },
  {
    id: 30,
    name: "Education Cannot Wait (ECW) Scholarships",
    host: "United Nations (ECW Fund)",
    country: "Multiple",
    flag: "🌐",
    amount: "Varies (full funding for crises-affected)",
    amountValue: 20000,
    deadline: "Varies",
    description: "Supports access to education for crisis-affected children and youth, including refugees and internally displaced persons, at the secondary and tertiary levels.",
    eligibleRegions: ["crisis"],
    fields: ["Any"],
    degreeLevel: ["Undergraduate", "Graduate"],
    minGPA: 2.0,
    languageReq: "Intermediate",
    needBased: true,
    tags: ["need", "merit"],
    requirements: [
      "Crisis-affected, refugee, or displaced student",
      "Demonstrated financial need",
      "Basic academic qualifications",
      "Age and program-specific requirements",
      "Proof of crisis-affected status"
    ],
    link: "https://www.educationcannotwait.org/",
    accentColor: "#4ade80"
  }
];

/* ─── 2. COUNTRY DATA ────────────────────────────────────────── */
const COUNTRIES = [
  { code: "AF", name: "Afghanistan", regions: ["asia", "developing", "crisis"] },
  { code: "AL", name: "Albania", regions: ["eastern_europe", "developing"] },
  { code: "DZ", name: "Algeria", regions: ["africa", "developing"] },
  { code: "AO", name: "Angola", regions: ["africa", "developing"] },
  { code: "AR", name: "Argentina", regions: ["latin_america", "developing"] },
  { code: "AM", name: "Armenia", regions: ["central_asia", "eastern_europe", "developing"] },
  { code: "AU", name: "Australia", regions: ["commonwealth"] },
  { code: "AZ", name: "Azerbaijan", regions: ["central_asia", "developing"] },
  { code: "BD", name: "Bangladesh", regions: ["asia", "commonwealth", "developing"] },
  { code: "BY", name: "Belarus", regions: ["eastern_europe"] },
  { code: "BZ", name: "Belize", regions: ["latin_america", "commonwealth", "developing"] },
  { code: "BJ", name: "Benin", regions: ["africa", "developing"] },
  { code: "BT", name: "Bhutan", regions: ["asia", "developing"] },
  { code: "BO", name: "Bolivia", regions: ["latin_america", "developing"] },
  { code: "BA", name: "Bosnia and Herzegovina", regions: ["eastern_europe", "developing"] },
  { code: "BW", name: "Botswana", regions: ["africa", "commonwealth", "developing"] },
  { code: "BR", name: "Brazil", regions: ["latin_america"] },
  { code: "BF", name: "Burkina Faso", regions: ["africa", "developing"] },
  { code: "BI", name: "Burundi", regions: ["africa", "developing", "crisis"] },
  { code: "KH", name: "Cambodia", regions: ["asia", "developing"] },
  { code: "CM", name: "Cameroon", regions: ["africa", "commonwealth", "developing"] },
  { code: "CA", name: "Canada", regions: ["commonwealth"] },
  { code: "CV", name: "Cape Verde", regions: ["africa", "developing"] },
  { code: "CF", name: "Central African Republic", regions: ["africa", "developing", "crisis"] },
  { code: "TD", name: "Chad", regions: ["africa", "developing", "crisis"] },
  { code: "CL", name: "Chile", regions: ["latin_america"] },
  { code: "CN", name: "China", regions: ["asia"] },
  { code: "CO", name: "Colombia", regions: ["latin_america", "developing"] },
  { code: "CG", name: "Congo", regions: ["africa", "developing"] },
  { code: "CD", name: "DR Congo", regions: ["africa", "developing", "crisis"] },
  { code: "CR", name: "Costa Rica", regions: ["latin_america"] },
  { code: "CI", name: "Côte d'Ivoire", regions: ["africa", "developing"] },
  { code: "HR", name: "Croatia", regions: ["eastern_europe"] },
  { code: "CU", name: "Cuba", regions: ["latin_america"] },
  { code: "CY", name: "Cyprus", regions: ["commonwealth"] },
  { code: "CZ", name: "Czech Republic", regions: ["eastern_europe"] },
  { code: "DK", name: "Denmark", regions: [] },
  { code: "DJ", name: "Djibouti", regions: ["africa", "developing", "crisis"] },
  { code: "DO", name: "Dominican Republic", regions: ["latin_america", "developing"] },
  { code: "EC", name: "Ecuador", regions: ["latin_america", "developing"] },
  { code: "EG", name: "Egypt", regions: ["africa", "developing"] },
  { code: "SV", name: "El Salvador", regions: ["latin_america", "developing"] },
  { code: "ET", name: "Ethiopia", regions: ["africa", "developing", "crisis"] },
  { code: "FJ", name: "Fiji", regions: ["pacific", "commonwealth", "developing"] },
  { code: "FR", name: "France", regions: [] },
  { code: "GA", name: "Gabon", regions: ["africa"] },
  { code: "GM", name: "Gambia", regions: ["africa", "commonwealth", "developing"] },
  { code: "GE", name: "Georgia", regions: ["central_asia", "eastern_europe", "developing"] },
  { code: "DE", name: "Germany", regions: [] },
  { code: "GH", name: "Ghana", regions: ["africa", "commonwealth", "developing"] },
  { code: "GT", name: "Guatemala", regions: ["latin_america", "developing"] },
  { code: "GN", name: "Guinea", regions: ["africa", "developing"] },
  { code: "HT", name: "Haiti", regions: ["latin_america", "developing", "crisis"] },
  { code: "HN", name: "Honduras", regions: ["latin_america", "developing"] },
  { code: "HU", name: "Hungary", regions: ["eastern_europe"] },
  { code: "IN", name: "India", regions: ["asia", "commonwealth", "developing"] },
  { code: "ID", name: "Indonesia", regions: ["asia", "developing"] },
  { code: "IR", name: "Iran", regions: ["asia", "developing"] },
  { code: "IQ", name: "Iraq", regions: ["asia", "developing", "crisis"] },
  { code: "IE", name: "Ireland", regions: ["commonwealth"] },
  { code: "IL", name: "Israel", regions: [] },
  { code: "IT", name: "Italy", regions: [] },
  { code: "JM", name: "Jamaica", regions: ["commonwealth", "developing", "latin_america"] },
  { code: "JP", name: "Japan", regions: [] },
  { code: "JO", name: "Jordan", regions: ["asia", "developing"] },
  { code: "KZ", name: "Kazakhstan", regions: ["central_asia"] },
  { code: "KE", name: "Kenya", regions: ["africa", "commonwealth", "developing"] },
  { code: "KW", name: "Kuwait", regions: ["asia"] },
  { code: "KG", name: "Kyrgyzstan", regions: ["central_asia", "developing"] },
  { code: "LA", name: "Laos", regions: ["asia", "developing"] },
  { code: "LB", name: "Lebanon", regions: ["asia", "developing", "crisis"] },
  { code: "LS", name: "Lesotho", regions: ["africa", "commonwealth", "developing"] },
  { code: "LR", name: "Liberia", regions: ["africa", "developing", "crisis"] },
  { code: "LY", name: "Libya", regions: ["africa", "developing", "crisis"] },
  { code: "MG", name: "Madagascar", regions: ["africa", "developing"] },
  { code: "MW", name: "Malawi", regions: ["africa", "commonwealth", "developing"] },
  { code: "MY", name: "Malaysia", regions: ["asia", "commonwealth"] },
  { code: "MV", name: "Maldives", regions: ["asia", "commonwealth", "developing"] },
  { code: "ML", name: "Mali", regions: ["africa", "developing", "crisis"] },
  { code: "MT", name: "Malta", regions: ["commonwealth"] },
  { code: "MR", name: "Mauritania", regions: ["africa", "developing"] },
  { code: "MU", name: "Mauritius", regions: ["africa", "commonwealth"] },
  { code: "MX", name: "Mexico", regions: ["latin_america"] },
  { code: "MD", name: "Moldova", regions: ["eastern_europe", "developing"] },
  { code: "MN", name: "Mongolia", regions: ["asia", "developing"] },
  { code: "MA", name: "Morocco", regions: ["africa", "developing"] },
  { code: "MZ", name: "Mozambique", regions: ["africa", "commonwealth", "developing"] },
  { code: "MM", name: "Myanmar", regions: ["asia", "developing", "crisis"] },
  { code: "NA", name: "Namibia", regions: ["africa", "commonwealth", "developing"] },
  { code: "NP", name: "Nepal", regions: ["asia", "developing"] },
  { code: "NL", name: "Netherlands", regions: [] },
  { code: "NZ", name: "New Zealand", regions: ["pacific", "commonwealth"] },
  { code: "NI", name: "Nicaragua", regions: ["latin_america", "developing"] },
  { code: "NE", name: "Niger", regions: ["africa", "developing"] },
  { code: "NG", name: "Nigeria", regions: ["africa", "commonwealth", "developing"] },
  { code: "MK", name: "North Macedonia", regions: ["eastern_europe", "developing"] },
  { code: "NO", name: "Norway", regions: [] },
  { code: "PK", name: "Pakistan", regions: ["asia", "commonwealth", "developing"] },
  { code: "PS", name: "Palestine", regions: ["asia", "developing", "crisis"] },
  { code: "PG", name: "Papua New Guinea", regions: ["pacific", "commonwealth", "developing"] },
  { code: "PY", name: "Paraguay", regions: ["latin_america", "developing"] },
  { code: "PE", name: "Peru", regions: ["latin_america", "developing"] },
  { code: "PH", name: "Philippines", regions: ["asia", "developing"] },
  { code: "PL", name: "Poland", regions: ["eastern_europe"] },
  { code: "PT", name: "Portugal", regions: [] },
  { code: "RO", name: "Romania", regions: ["eastern_europe"] },
  { code: "RU", name: "Russia", regions: ["eastern_europe"] },
  { code: "RW", name: "Rwanda", regions: ["africa", "commonwealth", "developing"] },
  { code: "SA", name: "Saudi Arabia", regions: ["asia"] },
  { code: "SN", name: "Senegal", regions: ["africa", "developing"] },
  { code: "RS", name: "Serbia", regions: ["eastern_europe", "developing"] },
  { code: "SL", name: "Sierra Leone", regions: ["africa", "commonwealth", "developing"] },
  { code: "SG", name: "Singapore", regions: ["asia", "commonwealth"] },
  { code: "SK", name: "Slovakia", regions: ["eastern_europe"] },
  { code: "SO", name: "Somalia", regions: ["africa", "developing", "crisis"] },
  { code: "ZA", name: "South Africa", regions: ["africa", "commonwealth"] },
  { code: "SS", name: "South Sudan", regions: ["africa", "developing", "crisis"] },
  { code: "ES", name: "Spain", regions: [] },
  { code: "LK", name: "Sri Lanka", regions: ["asia", "commonwealth", "developing"] },
  { code: "SD", name: "Sudan", regions: ["africa", "developing", "crisis"] },
  { code: "SR", name: "Suriname", regions: ["latin_america", "commonwealth", "developing"] },
  { code: "SZ", name: "Eswatini", regions: ["africa", "commonwealth", "developing"] },
  { code: "SE", name: "Sweden", regions: [] },
  { code: "CH", name: "Switzerland", regions: [] },
  { code: "SY", name: "Syria", regions: ["asia", "developing", "crisis"] },
  { code: "TJ", name: "Tajikistan", regions: ["central_asia", "developing"] },
  { code: "TZ", name: "Tanzania", regions: ["africa", "commonwealth", "developing"] },
  { code: "TH", name: "Thailand", regions: ["asia", "developing"] },
  { code: "TL", name: "Timor-Leste", regions: ["asia", "pacific", "developing"] },
  { code: "TG", name: "Togo", regions: ["africa", "developing"] },
  { code: "TT", name: "Trinidad and Tobago", regions: ["latin_america", "commonwealth"] },
  { code: "TN", name: "Tunisia", regions: ["africa", "developing"] },
  { code: "TR", name: "Turkey", regions: ["asia", "eastern_europe"] },
  { code: "TM", name: "Turkmenistan", regions: ["central_asia", "developing"] },
  { code: "UG", name: "Uganda", regions: ["africa", "commonwealth", "developing"] },
  { code: "UA", name: "Ukraine", regions: ["eastern_europe", "crisis"] },
  { code: "AE", name: "United Arab Emirates", regions: ["asia"] },
  { code: "GB", name: "United Kingdom", regions: ["commonwealth"] },
  { code: "US", name: "United States", regions: ["usa"] },
  { code: "UZ", name: "Uzbekistan", regions: ["central_asia", "developing"] },
  { code: "VE", name: "Venezuela", regions: ["latin_america", "developing", "crisis"] },
  { code: "VN", name: "Vietnam", regions: ["asia", "developing"] },
  { code: "YE", name: "Yemen", regions: ["asia", "developing", "crisis"] },
  { code: "ZM", name: "Zambia", regions: ["africa", "commonwealth", "developing"] },
  { code: "ZW", name: "Zimbabwe", regions: ["africa", "commonwealth", "developing"] }
].sort((a, b) => a.name.localeCompare(b.name));

/* ─── 3. APPLICATION STATE ───────────────────────────────────── */
const state = {
  currentProfile: null,
  matchedScholarships: [],
  allSearches: JSON.parse(localStorage.getItem('sm_searches') || '[]'),
  currentSort: 'match'
};

/* ─── 4. DOM REFERENCES ──────────────────────────────────────── */
const $ = id => document.getElementById(id);
const dom = {
  form:           $('profileForm'),
  gpa:            $('gpa'),
  country:        $('country'),
  field:          $('field'),
  degree:         $('degree'),
  language:       $('language'),
  needBased:      $('needBased'),
  matchBtn:       $('matchBtn'),
  clearBtn:       $('clearBtn'),
  themeToggle:    $('themeToggle'),
  resultsSection: $('resultsSection'),
  resultsGrid:    $('resultsGrid'),
  resultsCount:   $('resultsCount'),
  emptyState:     $('emptyState'),
  filterPills:    $('filterPills'),
  sortBy:         $('sortBy'),
  exportBtn:      $('exportBtn'),
  statsBtn:       $('statsBtn'),
  analyticsPanel: $('analyticsPanel'),
  statsGrid:      $('statsGrid'),
  closeAnalytics: $('closeAnalytics'),
  modalOverlay:   $('modalOverlay'),
  modal:          $('modal'),
  modalClose:     $('modalClose'),
  modalBody:      $('modalBody')
};

/* ─── 5. INITIALISATION ──────────────────────────────────────── */
function init() {
  populateCountries();
  restoreTheme();
  bindEvents();
  restoreForm();
}

function populateCountries() {
  COUNTRIES.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.code;
    opt.textContent = c.name;
    dom.country.appendChild(opt);
  });
}

function restoreTheme() {
  const saved = localStorage.getItem('sm_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
}

function restoreForm() {
  const saved = JSON.parse(localStorage.getItem('sm_profile') || 'null');
  if (!saved) return;
  ['gpa', 'country', 'field', 'degree', 'language', 'needBased'].forEach(key => {
    if (saved[key] && dom[key]) dom[key].value = saved[key];
  });
}

/* ─── 6. EVENT BINDING ───────────────────────────────────────── */
function bindEvents() {
  dom.form.addEventListener('submit', handleSubmit);
  dom.clearBtn.addEventListener('click', clearForm);
  dom.themeToggle.addEventListener('click', toggleTheme);
  dom.sortBy.addEventListener('change', () => renderResults(state.matchedScholarships));
  dom.exportBtn.addEventListener('click', exportCSV);
  dom.statsBtn.addEventListener('click', toggleAnalytics);
  dom.closeAnalytics.addEventListener('click', () => dom.analyticsPanel.classList.add('hidden'));
  dom.modalClose.addEventListener('click', closeModal);
  dom.modalOverlay.addEventListener('click', e => { if (e.target === dom.modalOverlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

/* ─── 7. FORM HANDLING ───────────────────────────────────────── */
function handleSubmit(e) {
  e.preventDefault();
  clearErrors();
  const profile = collectProfile();
  if (!validateProfile(profile)) return;

  state.currentProfile = profile;
  saveProfile(profile);
  trackSearch(profile);

  const matches = matchScholarships(profile);
  state.matchedScholarships = matches;

  renderFilterPills(profile);
  renderResults(matches);
  renderAnalytics();

  dom.resultsSection.classList.remove('hidden');
  setTimeout(() => {
    dom.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);

  // Button feedback
  dom.matchBtn.querySelector('.btn-text').textContent = 'Update Results';
}

function collectProfile() {
  return {
    gpa:       parseFloat(dom.gpa.value) || null,
    country:   dom.country.value,
    field:     dom.field.value,
    degree:    dom.degree.value,
    language:  dom.language.value,
    needBased: dom.needBased.value
  };
}

function validateProfile(profile) {
  let valid = true;

  if (!profile.gpa || profile.gpa < 0 || profile.gpa > 4) {
    showError('gpa', 'Please enter a valid GPA between 0.0 and 4.0');
    valid = false;
  }
  if (!profile.country) {
    showError('country', 'Please select your country of origin');
    valid = false;
  }
  if (!profile.field) {
    showError('field', 'Please select your field of study');
    valid = false;
  }
  if (!profile.degree) {
    showError('degree', 'Please select your target degree level');
    valid = false;
  }
  return valid;
}

function showError(field, msg) {
  const el = $(`${field}-error`);
  const input = dom[field];
  if (el) el.textContent = msg;
  if (input) input.classList.add('error');
}

function clearErrors() {
  ['gpa', 'country', 'field', 'degree'].forEach(f => {
    const el = $(`${f}-error`);
    const input = dom[f];
    if (el) el.textContent = '';
    if (input) input.classList.remove('error');
  });
}

function clearForm() {
  dom.form.reset();
  clearErrors();
  dom.resultsSection.classList.add('hidden');
  dom.analyticsPanel.classList.add('hidden');
  localStorage.removeItem('sm_profile');
  state.currentProfile = null;
  state.matchedScholarships = [];
  dom.matchBtn.querySelector('.btn-text').textContent = 'Find My Scholarships';
}

function saveProfile(profile) {
  localStorage.setItem('sm_profile', JSON.stringify(profile));
}

function trackSearch(profile) {
  state.allSearches.push({
    timestamp: Date.now(),
    gpa: profile.gpa,
    country: profile.country,
    field: profile.field,
    degree: profile.degree
  });
  // Keep last 100
  if (state.allSearches.length > 100) state.allSearches = state.allSearches.slice(-100);
  localStorage.setItem('sm_searches', JSON.stringify(state.allSearches));
}

/* ─── 8. MATCHING ENGINE ─────────────────────────────────────── */
/*
  Scoring weights (total = 100):
    GPA eligibility    → 30 pts (hard cutoff at 0.5 below minimum)
    Region eligibility → 25 pts
    Field match        → 25 pts
    Degree level       → 15 pts
    Language req       → 5 pts (bonus)
*/
function matchScholarships(profile) {
  const userRegions = getUserRegions(profile.country);

  return SCHOLARSHIPS.map(s => {
    const score = computeMatchScore(s, profile, userRegions);
    return { ...s, matchScore: score };
  })
  .filter(s => s.matchScore >= 20) // Minimum threshold to appear
  .sort((a, b) => b.matchScore - a.matchScore);
}

function getUserRegions(countryCode) {
  const found = COUNTRIES.find(c => c.code === countryCode);
  return found ? found.regions : [];
}

function computeMatchScore(scholarship, profile, userRegions) {
  let score = 0;
  let maxScore = 100;

  // ── GPA score (30 pts) ──────────────────────────────────────
  const gpaGap = profile.gpa - scholarship.minGPA;
  if (gpaGap >= 0) {
    // Meets requirement
    score += 30;
  } else if (gpaGap >= -0.3) {
    // Slightly below — partial match (20 pts)
    score += 20;
  } else if (gpaGap >= -0.6) {
    // Moderately below — weak match (10 pts)
    score += 10;
  } else {
    // Too far below — no points
    score += 0;
  }

  // ── Region/eligibility score (25 pts) ────────────────────────
  const eligible = scholarship.eligibleRegions;
  if (eligible.includes('all')) {
    score += 25;
  } else if (eligible.includes('non-UK') && profile.country !== 'GB') {
    score += 25;
  } else if (eligible.includes('non-usa') && profile.country !== 'US') {
    score += 25;
  } else if (eligible.includes('usa') && profile.country === 'US') {
    score += 25;
  } else {
    // Check if any user region matches
    const overlap = eligible.some(r => userRegions.includes(r));
    if (overlap) {
      score += 25;
    } else {
      score += 0;
    }
  }

  // ── Field score (25 pts) ─────────────────────────────────────
  const sFields = scholarship.fields;
  if (sFields.includes('Any')) {
    score += 25;
  } else if (sFields.includes(profile.field)) {
    score += 25;
  } else if (profile.field === 'Any') {
    score += 15; // User is flexible
  } else {
    score += 0;
  }

  // ── Degree level (15 pts) ────────────────────────────────────
  if (scholarship.degreeLevel.includes(profile.degree)) {
    score += 15;
  } else {
    score += 0;
  }

  // ── Language bonus (5 pts) ───────────────────────────────────
  const langOrder = { 'Native': 4, 'Proficient': 3, 'Intermediate': 2, 'Basic': 1, '': 0 };
  const userLang  = langOrder[profile.language] || 0;
  const reqLang   = langOrder[scholarship.languageReq] || 0;
  if (userLang >= reqLang) {
    score += 5;
  }

  // ── Need-based bonus/filter ───────────────────────────────────
  if (scholarship.needBased && profile.needBased === 'high') {
    score = Math.min(100, score + 5); // Small boost
  }

  return Math.min(100, score);
}

/* ─── 9. RENDERING ───────────────────────────────────────────── */

// -- Filter pills showing user's profile summary -----------------
function renderFilterPills(profile) {
  const countryObj = COUNTRIES.find(c => c.code === profile.country);
  const countryName = countryObj ? countryObj.name : profile.country;
  dom.filterPills.innerHTML = `
    <span class="pill pill-gold">GPA ${profile.gpa.toFixed(1)}</span>
    <span class="pill pill-blue">${countryName}</span>
    <span class="pill pill-green">${profile.field}</span>
    <span class="pill pill-purple">${profile.degree}</span>
    ${profile.language ? `<span class="pill pill-gold">${profile.language} English</span>` : ''}
  `;
}

// -- Results list ------------------------------------------------
function renderResults(scholarships) {
  const sorted = sortScholarships([...scholarships], dom.sortBy.value);
  const count = sorted.length;

  dom.resultsCount.textContent = count
    ? `${count} scholarship${count !== 1 ? 's' : ''} matched your profile`
    : 'No scholarships matched — showing closest options';

  dom.emptyState.classList.toggle('hidden', count > 0);

  dom.resultsGrid.innerHTML = '';
  sorted.forEach((s, i) => {
    const card = createScholarshipCard(s, i);
    dom.resultsGrid.appendChild(card);
  });
}

function sortScholarships(list, by) {
  switch (by) {
    case 'match':   return list.sort((a, b) => b.matchScore - a.matchScore);
    case 'amount':  return list.sort((a, b) => b.amountValue - a.amountValue);
    case 'name':    return list.sort((a, b) => a.name.localeCompare(b.name));
    case 'deadline':return list.sort((a, b) => a.deadline.localeCompare(b.deadline));
    default:        return list;
  }
}

// -- Single card -------------------------------------------------
function createScholarshipCard(s, index) {
  const card = document.createElement('div');
  card.className = 'scholarship-card';
  card.style.setProperty('--card-accent', s.accentColor || 'var(--accent)');
  card.style.animationDelay = `${index * 0.06}s`;

  const matchPct = s.matchScore;
  const matchColor = matchPct >= 80 ? 'var(--green)' :
                     matchPct >= 55 ? 'var(--accent)' :
                     matchPct >= 30 ? 'var(--blue)'   : 'var(--text-muted)';

  const tagHTML = s.tags.map(t => `<span class="tag tag-${t}">${formatTag(t)}</span>`).join('');
  const metaHTML = `
    <span class="meta-chip">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      ${s.deadline}
    </span>
    <span class="meta-chip">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
      ${s.amount}
    </span>
    <span class="meta-chip">${s.country}</span>
  `;

  card.innerHTML = `
    <div class="card-top">
      <span class="scholarship-flag">${s.flag}</span>
      <div class="match-badge">
        <span class="match-score" style="color:${matchColor}">${matchPct}%</span>
        <span class="match-label">Match</span>
        <div class="match-bar">
          <div class="match-fill" style="width:${matchPct}%; --match-color:${matchColor}"></div>
        </div>
      </div>
    </div>
    <h3 class="scholarship-name">${s.name}</h3>
    <p class="scholarship-host">${s.host}</p>
    <p class="scholarship-desc">${s.description}</p>
    <div class="scholarship-meta">${metaHTML}</div>
    <div class="scholarship-tags">${tagHTML}</div>
  `;

  card.addEventListener('click', () => openModal(s));
  return card;
}

function formatTag(tag) {
  const map = {
    fullride: '🎯 Full Ride',
    merit:    '⭐ Merit',
    need:     '💙 Need-Based',
    stem:     '🔬 STEM',
    women:    '♀ Women',
    govt:     '🏛 Government',
    research: '🔍 Research',
    peace:    '☮ Peace',
    africa:   '🌍 Africa',
    diversity:'🌈 Diversity'
  };
  return map[tag] || tag;
}

/* ─── 10. MODAL ──────────────────────────────────────────────── */
function openModal(s) {
  const matchColor = s.matchScore >= 80 ? 'var(--green)' :
                     s.matchScore >= 55 ? 'var(--accent)' : 'var(--blue)';
  const matchText  = s.matchScore >= 80 ? 'Excellent fit — you meet all key criteria' :
                     s.matchScore >= 55 ? 'Good fit — you meet most requirements' :
                     s.matchScore >= 30 ? 'Partial fit — some requirements may be challenging' :
                                          'Stretch — significant gaps, but worth knowing';

  const reqHTML = s.requirements.map(r => `
    <div class="req-item">
      <span class="req-icon">◈</span>
      <span>${r}</span>
    </div>
  `).join('');

  const tagHTML = s.tags.map(t => `<span class="tag tag-${t}">${formatTag(t)}</span>`).join('');

  dom.modalBody.innerHTML = `
    <span class="modal-flag">${s.flag}</span>
    <h2 class="modal-title">${s.name}</h2>
    <p class="modal-host">${s.host} · ${s.country}</p>

    <div class="modal-match-row">
      <span class="modal-match-score" style="color:${matchColor}">${s.matchScore}%</span>
      <div class="modal-match-text">
        <strong>Match Score</strong><br/>
        ${matchText}
      </div>
    </div>

    <div class="modal-tags">${tagHTML}</div>

    <div class="modal-section">
      <p class="modal-section-title">About this Scholarship</p>
      <p>${s.description}</p>
    </div>

    <div class="modal-section">
      <p class="modal-section-title">Award Details</p>
      <div class="modal-requirements">
        <div class="req-item"><span class="req-icon">💰</span><span><strong>Amount:</strong> ${s.amount}</span></div>
        <div class="req-item"><span class="req-icon">📅</span><span><strong>Deadline:</strong> ${s.deadline}</span></div>
        <div class="req-item"><span class="req-icon">🎓</span><span><strong>Level:</strong> ${s.degreeLevel.join(', ')}</span></div>
        <div class="req-item"><span class="req-icon">📚</span><span><strong>Fields:</strong> ${s.fields.join(', ')}</span></div>
        <div class="req-item"><span class="req-icon">🌍</span><span><strong>Minimum GPA:</strong> ${s.minGPA.toFixed(1)} / 4.0</span></div>
      </div>
    </div>

    <div class="modal-section">
      <p class="modal-section-title">Key Requirements</p>
      <div class="modal-requirements">${reqHTML}</div>
    </div>

    <div class="modal-footer">
      <a href="${s.link}" target="_blank" rel="noopener noreferrer" class="btn-modal-primary">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        Visit Official Website
      </a>
    </div>
  `;

  dom.modalOverlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  dom.modalOverlay.classList.add('hidden');
  document.body.style.overflow = '';
}

/* ─── 11. ANALYTICS ──────────────────────────────────────────── */
function toggleAnalytics() {
  const hidden = dom.analyticsPanel.classList.toggle('hidden');
  if (!hidden) renderAnalytics();
}

function renderAnalytics() {
  const searches = state.allSearches;
  const matched  = state.matchedScholarships;

  // Count field distribution
  const fieldCounts = {};
  searches.forEach(s => { fieldCounts[s.field] = (fieldCounts[s.field] || 0) + 1; });
  const topField = Object.entries(fieldCounts).sort((a,b) => b[1]-a[1])[0];

  // Count country distribution
  const countryCounts = {};
  searches.forEach(s => { countryCounts[s.country] = (countryCounts[s.country] || 0) + 1; });
  const topCountry = Object.entries(countryCounts).sort((a,b) => b[1]-a[1])[0];

  const avgGpa = searches.length
    ? (searches.reduce((sum, s) => sum + s.gpa, 0) / searches.length).toFixed(2)
    : '—';

  const highMatches = matched.filter(s => s.matchScore >= 80).length;
  const fullRide    = SCHOLARSHIPS.filter(s => s.tags.includes('fullride')).length;

  dom.statsGrid.innerHTML = `
    <div class="stat-card">
      <span class="stat-value">${searches.length}</span>
      <span class="stat-label">Total Searches</span>
    </div>
    <div class="stat-card">
      <span class="stat-value">${matched.length}</span>
      <span class="stat-label">Matches Found</span>
    </div>
    <div class="stat-card">
      <span class="stat-value">${highMatches}</span>
      <span class="stat-label">80%+ Matches</span>
    </div>
    <div class="stat-card">
      <span class="stat-value">${avgGpa}</span>
      <span class="stat-label">Avg GPA Searched</span>
    </div>
    <div class="stat-card">
      <span class="stat-value">${topField ? topField[0].split(' ')[0] : '—'}</span>
      <span class="stat-label">Top Field</span>
    </div>
    <div class="stat-card">
      <span class="stat-value">${SCHOLARSHIPS.length}</span>
      <span class="stat-label">Total Scholarships</span>
    </div>
    <div class="stat-card">
      <span class="stat-value">${fullRide}</span>
      <span class="stat-label">Full-Ride Options</span>
    </div>
    <div class="stat-card">
      <span class="stat-value">${matched.length ? matched[0].matchScore + '%' : '—'}</span>
      <span class="stat-label">Best Match Score</span>
    </div>
  `;
}

/* ─── 12. EXPORT CSV ─────────────────────────────────────────── */
function exportCSV() {
  if (!state.matchedScholarships.length) {
    alert('No results to export. Run a search first.');
    return;
  }

  const headers = ['Rank', 'Match Score', 'Scholarship Name', 'Host', 'Country', 'Amount', 'Deadline', 'Fields', 'Degree Levels', 'Min GPA', 'Tags', 'Link'];
  const rows = state.matchedScholarships.map((s, i) => [
    i + 1,
    `${s.matchScore}%`,
    `"${s.name}"`,
    `"${s.host}"`,
    s.country,
    `"${s.amount}"`,
    `"${s.deadline}"`,
    `"${s.fields.join(', ')}"`,
    `"${s.degreeLevel.join(', ')}"`,
    s.minGPA.toFixed(1),
    `"${s.tags.join(', ')}"`,
    s.link
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `scholarmatch-results-${new Date().toISOString().slice(0,10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

/* ─── 13. THEME TOGGLE ───────────────────────────────────────── */
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('sm_theme', next);
}

/* ─── START ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', init);
