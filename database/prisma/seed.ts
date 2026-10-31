/**
 * Development / initial seed for The Bridge Institute.
 *
 * Seeds only verified brochure information and system configuration:
 *  - roles and permissions (RBAC)
 *  - the five foundation courses (English + Bangla)
 *  - contact settings using the brochure email, with every unconfirmed link left empty
 *  - FAQs derived from brochure statements
 *
 * It deliberately does NOT create users, passwords, students, alumni, testimonials,
 * partners or statistics. Create the first Super Admin with `npm run admin:create`.
 * The script is idempotent and safe to re-run.
 */
import { PrismaClient } from '../../backend/generated/prisma/index.js';

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// RBAC
// ---------------------------------------------------------------------------
const PERMISSIONS: Record<string, string> = {
  'dashboard.view': 'View the administration dashboard',
  'users.manage': 'Create, update and deactivate user accounts',
  'roles.manage': 'Manage roles and their permissions',
  'courses.manage': 'Manage courses, categories, topics, outcomes and learning materials',
  'applications.manage': 'Review student applications and manage onboarding',
  'students.manage': 'Manage student profiles',
  'training.manage': 'Manage all batches, enrollments, attendance, assessments and results',
  'training.teach': 'Manage attendance, assessments and results for assigned batches only',
  'certificates.manage': 'Manage and approve certificates',
  'companies.manage': 'Manage companies, partnership inquiries and opportunities',
  'contact.manage': 'Read and manage contact messages',
  'cms.edit': 'Edit website content drafts',
  'cms.publish': 'Publish website content',
  'faqs.manage': 'Manage FAQs',
  'settings.manage': 'Manage contact details, links, QR destinations and other settings',
  'audit.read': 'Read audit logs',
  'alumni.manage': 'Verify alumni, approve profiles and stories, manage cohorts and announcements',
  'student.self': 'Access own student records',
  'alumni.self': 'Access own alumni profile and alumni-only content',
};

const ROLES: { key: string; name: string; description: string; permissions: string[] }[] = [
  {
    key: 'SUPER_ADMIN',
    name: 'Super Admin',
    description: 'Full system control',
    permissions: Object.keys(PERMISSIONS).filter((p) => p !== 'student.self' && p !== 'alumni.self'),
  },
  {
    key: 'CONTENT_MANAGER',
    name: 'Content Manager',
    description: 'Website content, FAQs and CMS publishing',
    permissions: ['dashboard.view', 'cms.edit', 'cms.publish', 'faqs.manage'],
  },
  {
    key: 'COURSE_MANAGER',
    name: 'Course Manager',
    description: 'Courses, topics, learning outcomes and learning materials',
    permissions: ['dashboard.view', 'courses.manage'],
  },
  {
    key: 'ADMISSIONS_OFFICER',
    name: 'Admissions Officer',
    description: 'Applications and authorised student onboarding',
    permissions: ['dashboard.view', 'applications.manage', 'students.manage', 'contact.manage'],
  },
  {
    key: 'COMPANY_RELATIONS_MANAGER',
    name: 'Company Relations Manager',
    description: 'Companies, partnership inquiries and opportunities',
    permissions: ['dashboard.view', 'companies.manage', 'contact.manage'],
  },
  {
    key: 'TEACHER',
    name: 'Teacher',
    description: 'Assigned courses, batches, attendance and assessments',
    permissions: ['dashboard.view', 'training.teach'],
  },
  {
    key: 'STUDENT',
    name: 'Student',
    description: 'Own profile, applications, enrolments and permitted learning records',
    permissions: ['student.self'],
  },
  {
    key: 'ALUMNI',
    name: 'Alumni',
    description: 'Own alumni profile, story submissions and alumni content',
    permissions: ['alumni.self'],
  },
];

// ---------------------------------------------------------------------------
// Foundation courses (from the brochure). Durations are intentionally empty
// until the institute confirms them.
// ---------------------------------------------------------------------------
type Bilingual = { en: string; bn: string };
type SeedCourse = {
  slug: string;
  icon: string;
  title: Bilingual;
  summary: Bilingual;
  description: Bilingual;
  topics: Bilingual[];
  outcomes: Bilingual[];
};

const COURSES: SeedCourse[] = [
  {
    slug: 'critical-thinking',
    icon: 'brain',
    title: { en: 'Critical Thinking', bn: 'ক্রিটিক্যাল থিংকিং' },
    summary: {
      en: 'Learn to question, reason logically and identify problems before solving them.',
      bn: 'প্রশ্ন করা, যৌক্তিকভাবে চিন্তা করা এবং সমাধানের আগে সমস্যা চিহ্নিত করা শিখুন।',
    },
    description: {
      en: 'Moving beyond rote memorization, this course builds the habits of critical questioning, logical reasoning and problem identification through practical exercises, discussion and peer collaboration.',
      bn: 'মুখস্থনির্ভর শিক্ষার বাইরে গিয়ে এই কোর্সটি ব্যবহারিক অনুশীলন, আলোচনা ও সহপাঠীদের সঙ্গে সহযোগিতার মাধ্যমে সমালোচনামূলক প্রশ্ন, যৌক্তিক বিশ্লেষণ এবং সমস্যা চিহ্নিতকরণের অভ্যাস গড়ে তোলে।',
    },
    topics: [
      { en: 'Critical questioning', bn: 'সমালোচনামূলক প্রশ্ন করা' },
      { en: 'Logical reasoning', bn: 'যৌক্তিক বিশ্লেষণ' },
      { en: 'Problem identification', bn: 'সমস্যা চিহ্নিতকরণ' },
      { en: 'Analytical thinking', bn: 'বিশ্লেষণধর্মী চিন্তা' },
      { en: 'Evidence-based decision-making', bn: 'প্রমাণভিত্তিক সিদ্ধান্ত গ্রহণ' },
      { en: 'Practical problem-solving', bn: 'ব্যবহারিক সমস্যা সমাধান' },
    ],
    outcomes: [
      { en: 'Ask clear, relevant questions and evaluate information before drawing conclusions.', bn: 'সিদ্ধান্তে পৌঁছানোর আগে স্পষ্ট ও প্রাসঙ্গিক প্রশ্ন করা এবং তথ্য যাচাই করা।' },
      { en: 'Break a problem into parts and reason through possible solutions.', bn: 'একটি সমস্যাকে ভাগ করে সম্ভাব্য সমাধান যুক্তি দিয়ে বিশ্লেষণ করা।' },
      { en: 'Explain and justify decisions using evidence.', bn: 'প্রমাণ ব্যবহার করে সিদ্ধান্ত ব্যাখ্যা ও যুক্তিসংগত করা।' },
    ],
  },
  {
    slug: 'basic-english',
    icon: 'languages',
    title: { en: 'Basic English', bn: 'বেসিক ইংলিশ' },
    summary: {
      en: 'Build practical reading, writing, vocabulary and communication skills in English.',
      bn: 'ইংরেজিতে ব্যবহারিক পড়া, লেখা, শব্দভান্ডার ও যোগাযোগ দক্ষতা গড়ে তুলুন।',
    },
    description: {
      en: 'A practical foundation in English for further education and the modern workplace, emphasising active participation and real communication rather than memorization.',
      bn: 'উচ্চশিক্ষা ও আধুনিক কর্মক্ষেত্রের জন্য ইংরেজির একটি ব্যবহারিক ভিত্তি, যেখানে মুখস্থের বদলে সক্রিয় অংশগ্রহণ ও বাস্তব যোগাযোগে গুরুত্ব দেওয়া হয়।',
    },
    topics: [
      { en: 'Reading comprehension', bn: 'পঠন ও অনুধাবন' },
      { en: 'Writing', bn: 'লিখন' },
      { en: 'Vocabulary development', bn: 'শব্দভান্ডার উন্নয়ন' },
      { en: 'Grammar fundamentals', bn: 'ব্যাকরণের মৌলিক বিষয়' },
      { en: 'Practical communication', bn: 'ব্যবহারিক যোগাযোগ' },
    ],
    outcomes: [
      { en: 'Read and understand everyday and workplace texts.', bn: 'দৈনন্দিন ও কর্মক্ষেত্রের লেখা পড়ে বুঝতে পারা।' },
      { en: 'Write clear, well-structured short texts and messages.', bn: 'স্পষ্ট ও সুগঠিত ছোট লেখা ও বার্তা লিখতে পারা।' },
      { en: 'Communicate confidently in common professional situations.', bn: 'সাধারণ পেশাগত পরিস্থিতিতে আত্মবিশ্বাসের সঙ্গে যোগাযোগ করতে পারা।' },
    ],
  },
  {
    slug: 'basic-mathematics',
    icon: 'calculator',
    title: { en: 'Basic Mathematics', bn: 'বেসিক গণিত' },
    summary: {
      en: 'Strengthen number skills and apply mathematics to practical problems.',
      bn: 'সংখ্যাজ্ঞান মজবুত করুন এবং ব্যবহারিক সমস্যায় গণিত প্রয়োগ করুন।',
    },
    description: {
      en: 'Develops confidence with numbers and everyday quantitative reasoning through worked examples, exercises and practical problem-solving.',
      bn: 'উদাহরণ, অনুশীলন ও ব্যবহারিক সমস্যা সমাধানের মাধ্যমে সংখ্যা ও দৈনন্দিন পরিমাণগত যুক্তিতে আত্মবিশ্বাস তৈরি করে।',
    },
    topics: [
      { en: 'Number fundamentals', bn: 'সংখ্যার মৌলিক ধারণা' },
      { en: 'Arithmetic', bn: 'পাটিগণিত' },
      { en: 'Fractions and percentages', bn: 'ভগ্নাংশ ও শতকরা' },
      { en: 'Ratios and proportions', bn: 'অনুপাত ও সমানুপাত' },
      { en: 'Practical mathematical problem-solving', bn: 'ব্যবহারিক গাণিতিক সমস্যা সমাধান' },
    ],
    outcomes: [
      { en: 'Perform accurate calculations with whole numbers, fractions and percentages.', bn: 'পূর্ণসংখ্যা, ভগ্নাংশ ও শতকরা দিয়ে নির্ভুল হিসাব করতে পারা।' },
      { en: 'Use ratios and proportions in everyday and workplace contexts.', bn: 'দৈনন্দিন ও কর্মক্ষেত্রে অনুপাত ও সমানুপাত ব্যবহার করতে পারা।' },
      { en: 'Approach numerical problems logically and check results.', bn: 'সংখ্যাগত সমস্যা যৌক্তিকভাবে সমাধান ও ফলাফল যাচাই করতে পারা।' },
    ],
  },
  {
    slug: 'basic-ict',
    icon: 'monitor',
    title: { en: 'Basic ICT', bn: 'বেসিক আইসিটি' },
    summary: {
      en: 'Gain essential digital skills for study, communication and work.',
      bn: 'পড়াশোনা, যোগাযোগ ও কাজের জন্য প্রয়োজনীয় ডিজিটাল দক্ষতা অর্জন করুন।',
    },
    description: {
      en: 'A hands-on introduction to computers, the internet and productivity tools, including safe and responsible use of digital technology.',
      bn: 'কম্পিউটার, ইন্টারনেট ও প্রোডাক্টিভিটি টুলের হাতে-কলমে পরিচিতি, যার মধ্যে নিরাপদ ও দায়িত্বশীল ডিজিটাল ব্যবহারও অন্তর্ভুক্ত।',
    },
    topics: [
      { en: 'Computer fundamentals', bn: 'কম্পিউটারের মৌলিক বিষয়' },
      { en: 'Operating systems and file management', bn: 'অপারেটিং সিস্টেম ও ফাইল ব্যবস্থাপনা' },
      { en: 'Internet and digital communication', bn: 'ইন্টারনেট ও ডিজিটাল যোগাযোগ' },
      { en: 'Productivity tools', bn: 'প্রোডাক্টিভিটি টুলস' },
      { en: 'Digital safety', bn: 'ডিজিটাল নিরাপত্তা' },
    ],
    outcomes: [
      { en: 'Use a computer and organise files confidently.', bn: 'আত্মবিশ্বাসের সঙ্গে কম্পিউটার ব্যবহার ও ফাইল গুছিয়ে রাখতে পারা।' },
      { en: 'Communicate and find information effectively online.', bn: 'অনলাইনে কার্যকরভাবে যোগাযোগ ও তথ্য খুঁজে বের করতে পারা।' },
      { en: 'Create documents, spreadsheets and presentations, and stay safe online.', bn: 'ডকুমেন্ট, স্প্রেডশিট ও প্রেজেন্টেশন তৈরি এবং অনলাইনে নিরাপদ থাকতে পারা।' },
    ],
  },
  {
    slug: 'basic-python-programming',
    icon: 'code',
    title: { en: 'Basic Python Programming', bn: 'বেসিক পাইথন প্রোগ্রামিং' },
    summary: {
      en: 'Learn programming fundamentals by writing practical Python programs.',
      bn: 'ব্যবহারিক পাইথন প্রোগ্রাম লিখে প্রোগ্রামিংয়ের মৌলিক বিষয় শিখুন।',
    },
    description: {
      en: 'An introduction to programming with Python that develops computational thinking and problem-solving through practical programming exercises.',
      bn: 'পাইথন দিয়ে প্রোগ্রামিংয়ের সূচনা, যা ব্যবহারিক প্রোগ্রামিং অনুশীলনের মাধ্যমে কম্পিউটেশনাল চিন্তা ও সমস্যা সমাধানের দক্ষতা গড়ে তোলে।',
    },
    topics: [
      { en: 'Programming fundamentals', bn: 'প্রোগ্রামিংয়ের মৌলিক বিষয়' },
      { en: 'Variables and data types', bn: 'ভেরিয়েবল ও ডেটা টাইপ' },
      { en: 'Conditions and loops', bn: 'কন্ডিশন ও লুপ' },
      { en: 'Functions', bn: 'ফাংশন' },
      { en: 'Collections', bn: 'কালেকশন' },
      { en: 'Basic data processing', bn: 'প্রাথমিক ডেটা প্রসেসিং' },
      { en: 'Practical programming exercises', bn: 'ব্যবহারিক প্রোগ্রামিং অনুশীলন' },
    ],
    outcomes: [
      { en: 'Write, run and debug simple Python programs.', bn: 'সাধারণ পাইথন প্রোগ্রাম লেখা, চালানো ও ত্রুটি সংশোধন করতে পারা।' },
      { en: 'Use conditions, loops, functions and collections to solve problems.', bn: 'কন্ডিশন, লুপ, ফাংশন ও কালেকশন ব্যবহার করে সমস্যা সমাধান করতে পারা।' },
      { en: 'Process simple data sets with code.', bn: 'কোড ব্যবহার করে সাধারণ ডেটা প্রসেস করতে পারা।' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Settings. Empty strings mean "not yet confirmed by the institute".
// ---------------------------------------------------------------------------
const SETTINGS: { key: string; group: string; value: unknown; isPublic: boolean; description: string }[] = [
  { key: 'contact.generalEmail', group: 'contact', value: 'thebridgeinstitute2026@gmail.com', isPublic: true, description: 'General inquiry email (printed in the brochure)' },
  { key: 'contact.admissionEmail', group: 'contact', value: '', isPublic: true, description: 'Admission inquiry email' },
  { key: 'contact.partnershipEmail', group: 'contact', value: '', isPublic: true, description: 'Industry partnership inquiry email' },
  { key: 'contact.phone', group: 'contact', value: '', isPublic: true, description: 'Phone number' },
  { key: 'contact.address', group: 'contact', value: '', isPublic: true, description: 'Office address' },
  { key: 'social.facebookUrl', group: 'social', value: '', isPublic: true, description: 'Official Facebook page (shown as a QR code in the brochure - URL not yet confirmed)' },
  { key: 'social.links', group: 'social', value: [], isPublic: true, description: 'Other social links: [{ "label": "...", "url": "https://..." }]' },
  { key: 'qr.employmentSeekers', group: 'qr', value: '', isPublic: true, description: 'Destination of the "Employment Seekers" brochure QR code' },
  { key: 'qr.admissionInformation', group: 'qr', value: '', isPublic: true, description: 'Destination of the "Admission Information" brochure QR code' },
  { key: 'qr.industryQueries', group: 'qr', value: '', isPublic: true, description: 'Destination of the "Industry Queries" brochure QR code' },
  { key: 'qr.universityFoundationCourses', group: 'qr', value: '', isPublic: true, description: 'Destination of the "Foundation Courses Development Support for Universities" brochure QR code' },
  {
    key: 'seo.defaults',
    group: 'seo',
    value: {
      titleEn: 'The Bridge Institute | Building Skills for an Industry-Ready Workforce',
      titleBn: 'দ্য ব্রিজ ইনস্টিটিউট | শিল্পোপযোগী কর্মীবাহিনীর জন্য দক্ষতা গঠন',
      descriptionEn:
        'The Bridge Institute under the University of Integrated Thought offers foundational courses and a four-year professional development roadmap, partnering with industry to develop employable manpower.',
      descriptionBn:
        'ইউনিভার্সিটি অব ইন্টিগ্রেটেড থট-এর অধীন দ্য ব্রিজ ইনস্টিটিউট ফাউন্ডেশন কোর্স ও চার বছরের পেশাগত উন্নয়ন রোডম্যাপ প্রদান করে এবং শিল্পের সঙ্গে অংশীদারিত্বে কর্মক্ষম জনশক্তি গড়ে তোলে।',
    },
    isPublic: true,
    description: 'Default page title and meta description (English and Bangla)',
  },
  {
    key: 'program.sixMonthProgram',
    group: 'program',
    value: { status: 'requires_review', enabled: false, relationship: '' },
    isPublic: false,
    description: 'An earlier requirement mentioned a six-month training programme. Its relationship to the four-year roadmap is unconfirmed and must be reviewed by an administrator before it is shown publicly.',
  },
];

const FAQS = [
  {
    questionEn: 'Who can apply to The Bridge Institute?',
    answerEn: 'The Bridge Institute welcomes graduates seeking employment and HSC-qualified individuals who are eager to develop essential skills, enhance their employability and prepare for successful careers.',
    questionBn: 'দ্য ব্রিজ ইনস্টিটিউটে কারা আবেদন করতে পারবেন?',
    answerBn: 'দ্য ব্রিজ ইনস্টিটিউট কর্মসংস্থানপ্রত্যাশী স্নাতক এবং এইচএসসি পাস ব্যক্তিদের স্বাগত জানায়, যাঁরা প্রয়োজনীয় দক্ষতা অর্জন, কর্মসংস্থানযোগ্যতা বৃদ্ধি এবং সফল ক্যারিয়ারের জন্য প্রস্তুত হতে আগ্রহী।',
  },
  {
    questionEn: 'Which courses are currently offered?',
    answerEn: 'Foundational courses in Critical Thinking, Basic English, Basic Mathematics, Basic ICT and Basic Python Programming.',
    questionBn: 'বর্তমানে কোন কোন কোর্স দেওয়া হয়?',
    answerBn: 'ক্রিটিক্যাল থিংকিং, বেসিক ইংলিশ, বেসিক গণিত, বেসিক আইসিটি এবং বেসিক পাইথন প্রোগ্রামিং বিষয়ে ফাউন্ডেশন কোর্স।',
  },
  {
    questionEn: 'Does completing a course guarantee a job or internship?',
    answerEn: 'No. The Bridge Institute provides a professional development pathway. Certifications, internships and employment depend on available programmes, opportunities, eligibility and employer requirements.',
    questionBn: 'কোর্স শেষ করলে কি চাকরি বা ইন্টার্নশিপ নিশ্চিত?',
    answerBn: 'না। দ্য ব্রিজ ইনস্টিটিউট একটি পেশাগত উন্নয়নের পথ দেখায়। সার্টিফিকেশন, ইন্টার্নশিপ ও চাকরি নির্ভর করে উপলব্ধ প্রোগ্রাম, সুযোগ, যোগ্যতা ও নিয়োগকর্তার চাহিদার ওপর।',
  },
  {
    questionEn: 'How can my organisation partner with the institute?',
    answerEn: 'Submit the partnership inquiry form on the For Companies page and our team will contact you to discuss collaboration.',
    questionBn: 'আমার প্রতিষ্ঠান কীভাবে ইনস্টিটিউটের সঙ্গে অংশীদার হতে পারে?',
    answerBn: '“কোম্পানির জন্য” পাতায় অংশীদারিত্বের অনুসন্ধান ফর্মটি পূরণ করুন, আমাদের টিম সহযোগিতা নিয়ে আলোচনার জন্য আপনার সঙ্গে যোগাযোগ করবে।',
  },
];

async function main() {
  // Permissions
  for (const [key, description] of Object.entries(PERMISSIONS)) {
    await prisma.permission.upsert({ where: { key }, update: { description }, create: { key, description } });
  }
  const permissionRows = await prisma.permission.findMany();
  const permissionId = new Map(permissionRows.map((p) => [p.key, p.id]));

  // Roles (only seed default mappings when a role is first created so admin changes are preserved)
  for (const role of ROLES) {
    const existing = await prisma.role.findUnique({ where: { key: role.key } });
    if (existing) continue;
    await prisma.role.create({
      data: {
        key: role.key,
        name: role.name,
        description: role.description,
        permissions: { create: role.permissions.map((p) => ({ permissionId: permissionId.get(p)! })) },
      },
    });
  }
  // Super Admin always holds every administrative permission
  const superAdmin = await prisma.role.findUniqueOrThrow({ where: { key: 'SUPER_ADMIN' } });
  for (const p of ROLES[0].permissions) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: superAdmin.id, permissionId: permissionId.get(p)! } },
      update: {},
      create: { roleId: superAdmin.id, permissionId: permissionId.get(p)! },
    });
  }

  // Course category
  const category = await prisma.courseCategory.upsert({
    where: { slug: 'foundation' },
    update: {},
    create: { slug: 'foundation', nameEn: 'Foundation Courses', nameBn: 'ফাউন্ডেশন কোর্স', sortOrder: 0 },
  });

  // Courses (created once; later edits made through the admin are not overwritten)
  for (const [index, c] of COURSES.entries()) {
    const existing = await prisma.course.findUnique({ where: { slug: c.slug } });
    if (existing) continue;
    await prisma.course.create({
      data: {
        slug: c.slug,
        icon: c.icon,
        status: 'PUBLISHED',
        publishedAt: new Date(),
        sortOrder: index,
        categoryId: category.id,
        translations: {
          create: [
            { locale: 'en', title: c.title.en, summary: c.summary.en, description: c.description.en },
            { locale: 'bn', title: c.title.bn, summary: c.summary.bn, description: c.description.bn },
          ],
        },
        topics: { create: c.topics.map((t, i) => ({ sortOrder: i, textEn: t.en, textBn: t.bn })) },
        outcomes: { create: c.outcomes.map((o, i) => ({ sortOrder: i, textEn: o.en, textBn: o.bn })) },
      },
    });
  }

  // Settings (create only, never overwrite admin-entered values)
  for (const s of SETTINGS) {
    await prisma.websiteSetting.upsert({
      where: { key: s.key },
      update: { description: s.description, group: s.group },
      create: { key: s.key, group: s.group, value: s.value as object, isPublic: s.isPublic, description: s.description },
    });
  }

  // FAQs (only when none exist)
  if ((await prisma.faq.count()) === 0) {
    await prisma.faq.createMany({
      data: FAQS.map((f, i) => ({ ...f, sortOrder: i, isPublished: true })),
    });
  }

  console.log('Seed complete: roles, permissions, 5 foundation courses, settings and FAQs.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
