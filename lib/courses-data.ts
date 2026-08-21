export interface CourseModule {
  week: string
  title: string
  topics: string[]
}

export interface Course {
  id: string
  slug: string
  title: string
  subtitle: string
  category: "Hardware" | "Productivity" | "Software"
  subCategory?: "Frontend" | "Backend" | "Full-Stack" | "Hardware" | "Productivity"
  duration: string
  totalFee: number
  requiredDeposit: number
  badge?: string
  accentColor: string
  glowClass: string
  borderHoverClass: string
  badgeClass: string
  hasAiIncluded: boolean
  highlights: string[]
  syllabus: CourseModule[]
}

export const COURSES_CATALOG: Record<string, Course> = {
  "hardware-engineering": {
    id: "hardware-engineering",
    slug: "hardware-engineering",
    title: "Practical Computer Systems & Engineering",
    subtitle: "Master Hardware Assembly, OS Deployment, Malware Cleaning, LAN Networking & System Repair",
    category: "Hardware",
    subCategory: "Hardware",
    duration: "4 Weeks",
    totalFee: 700,
    requiredDeposit: 300,
    badge: "Flagship Program",
    accentColor: "from-emerald-500 to-teal-600",
    glowClass: "shadow-emerald-500/20",
    borderHoverClass: "hover:border-emerald-500/50",
    badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    hasAiIncluded: false,
    highlights: [
      "PC Disassembly, Diagnostics & Component Assembly",
      "Windows 10/11 Clean OS Deployment & Drivers Setup",
      "Malware Removal, System Tuning & Partitioning",
      "RJ45 Network Cable Crimping & LAN Router Setup",
    ],
    syllabus: [
      { week: "Week 1", title: "Computer Architecture & Disassembly", topics: ["Motherboards, CPUs, RAM, Power Supply Unit (PSU) testing", "Safe computer disassembly & component identification", "Thermal paste application & PC rebuilding"] },
      { week: "Week 2", title: "OS Deployment & Driver Configuration", topics: ["Creating multi-boot installation USB drives", "Clean Windows 10/11 OS installation & partitioning", "Driver installation & BIOS/UEFI configuration"] },
      { week: "Week 3", title: "System Troubleshooting & Maintenance", topics: ["Antivirus installation & deep malware cleaning", "System optimization & registry cleanup", "Hard drive diagnostic & data recovery basics"] },
      { week: "Week 4", title: "Computer Networking & Lab Practicals", topics: ["Ethernet cable crimping (Straight-through & Crossover)", "LAN switch & Wi-Fi router setup", "IP addressing (IPv4), subnetting & ping diagnostics"] },
    ],
  },

  "office-productivity": {
    id: "office-productivity",
    slug: "office-productivity",
    title: "Office Productivity & Digital Literacy",
    subtitle: "Master Microsoft Word, Excel, PowerPoint, Google Workspace & Computer Essentials",
    category: "Productivity",
    subCategory: "Productivity",
    duration: "3 Weeks",
    totalFee: 500,
    requiredDeposit: 200,
    badge: "Essential Skills",
    accentColor: "from-cyan-500 to-blue-600",
    glowClass: "shadow-cyan-500/20",
    borderHoverClass: "hover:border-cyan-500/50",
    badgeClass: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    hasAiIncluded: false,
    highlights: [
      "Professional Document Design & Reports in MS Word",
      "MS Excel Formulas, Data Analysis & Pivot Tables",
      "MS PowerPoint Pitch Decks & Slide Animations",
      "Email Etiquette, Cloud Storage & Online Research",
    ],
    syllabus: [
      { week: "Week 1", title: "Microsoft Word Mastery", topics: ["Document formatting, headers, footers & page layouts", "Tables, graphics, cover pages & official letterheads", "Table of contents generation & printing settings"] },
      { week: "Week 2", title: "Microsoft Excel & Data Analysis", topics: ["Spreadsheet navigation & formatting cells", "Core formulas: SUM, AVERAGE, COUNT, IF, VLOOKUP", "Charts, graphs, data sorting, filtering & Pivot Tables"] },
      { week: "Week 3", title: "PowerPoint & Workplace Tools", topics: ["Professional slide layout & presentation design", "Transitions, animations & media embedding", "Google Workspace (Drive, Docs, Sheets), email & typing speed"] },
    ],
  },

  "web-dev-frontend-beginner": {
    id: "web-dev-frontend-beginner",
    slug: "web-dev-frontend-beginner",
    title: "Frontend Foundations & AI Web Design",
    subtitle: "Build Responsive Websites with HTML5, CSS3, Flexbox/Grid, JavaScript ES6+ & AI Tools",
    category: "Software",
    subCategory: "Frontend",
    duration: "4 Weeks",
    totalFee: 600,
    requiredDeposit: 250,
    badge: "Beginner Friendly",
    accentColor: "from-amber-500 to-orange-600",
    glowClass: "shadow-amber-500/20",
    borderHoverClass: "hover:border-amber-500/50",
    badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    hasAiIncluded: true,
    highlights: [
      "HTML5 Semantic Structure & Modern Web Accessibility",
      "CSS3 Flexbox, Grid Layouts & Tailwind CSS Styling",
      "Core JavaScript ES6+ (DOM Manipulation, Events, Fetch API)",
      "AI Web Design Prompting with ChatGPT, V0 & Bolt.new",
    ],
    syllabus: [
      { week: "Week 1", title: "HTML5 Semantics & Web Foundations", topics: ["HTML document structure, semantic tags, form controls", "SEO metadata & accessibility standards", "AI-assisted HTML markup generation with ChatGPT"] },
      { week: "Week 2", title: "CSS3 Flexbox, Grid & Modern Styling", topics: ["CSS box model, flexbox flex-direction & alignment", "CSS Grid 2D responsive layouts", "Tailwind CSS utility classes & glassmorphism"] },
      { week: "Week 3", title: "Interactive JavaScript ES6+", topics: ["Variables, functions, objects, arrays", "DOM manipulation, event listeners & form validation", "Fetch API & JSON data handling"] },
      { week: "Week 4", title: "AI-Powered Prototyping & Hosting", topics: ["Rapid UI prototyping with V0.dev & Bolt.new", "Git GitHub version control basics", "Live website deployment on Vercel & Netlify"] },
    ],
  },

  "web-dev-frontend-advanced": {
    id: "web-dev-frontend-advanced",
    slug: "web-dev-frontend-advanced",
    title: "Advanced Modern Frontend (React & Next.js + AI)",
    subtitle: "Build High-Performance Single & Multi-Page Web Apps with React 19, Next.js 15 & AI Assistants",
    category: "Software",
    subCategory: "Frontend",
    duration: "4 Weeks",
    totalFee: 750,
    requiredDeposit: 300,
    badge: "High Demand",
    accentColor: "from-blue-500 to-indigo-600",
    glowClass: "shadow-blue-500/20",
    borderHoverClass: "hover:border-blue-500/50",
    badgeClass: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    hasAiIncluded: true,
    highlights: [
      "React 19 Component Architecture, Props & Custom Hooks",
      "Next.js 15 App Router, Server Components & Dynamic Routes",
      "State Management (Context API, Zustand, React Query)",
      "AI Code Generation & Refactoring with GitHub Copilot",
    ],
    syllabus: [
      { week: "Week 1", title: "React 19 Core Architecture", topics: ["JSX syntax, Component breakdown, Props & State", "useState, useEffect, useRef hooks in detail", "AI-driven React component generation"] },
      { week: "Week 2", title: "Next.js 15 App Router & Server Components", topics: ["File-based routing, nested layouts & page components", "Server Side Rendering (SSR) & Static Site Generation (SSG)", "API routes & Server Actions"] },
      { week: "Week 3", title: "Advanced State & UI Design", topics: ["Global state management with Context API & Zustand", "Framer Motion animations & Shadcn UI library", "Optimizing React render performance with AI tools"] },
      { week: "Week 4", title: "Production Build & AI Workflows", topics: ["GitHub Copilot for instant component testing", "Next.js Turbopack build optimization", "Production deployment on Vercel with custom domain & SSL"] },
    ],
  },

  "web-dev-backend-php": {
    id: "web-dev-backend-php",
    slug: "web-dev-backend-php",
    title: "PHP & MySQL Database Engineering + AI",
    subtitle: "Build Robust Server-Side Web Applications, Relational Databases & AI SQL Queries",
    category: "Software",
    subCategory: "Backend",
    duration: "4 Weeks",
    totalFee: 650,
    requiredDeposit: 250,
    badge: "Classic Backend",
    accentColor: "from-violet-500 to-purple-600",
    glowClass: "shadow-violet-500/20",
    borderHoverClass: "hover:border-violet-500/50",
    badgeClass: "bg-violet-500/10 text-violet-400 border-violet-500/30",
    hasAiIncluded: true,
    highlights: [
      "PHP 8+ Fundamentals, Object-Oriented Programming (OOP)",
      "MySQL Database Design, Table Relationships & SQL JOINs",
      "Building Secure RESTful APIs & Session Authentication",
      "AI Query Building & SQL Optimization with AI Tools",
    ],
    syllabus: [
      { week: "Week 1", title: "PHP 8 Syntax & OOP Principles", topics: ["PHP syntax, arrays, superglobals ($_GET, $_POST)", "Object-Oriented Programming: Classes, Objects, Methods", "AI-assisted PHP script writing & error debugging"] },
      { week: "Week 2", title: "MySQL Database Engineering", topics: ["Relational DB concepts, primary & foreign keys", "SQL queries: SELECT, INSERT, UPDATE, DELETE, JOINs", "AI SQL query generators & query plan optimization"] },
      { week: "Week 3", title: "PHP PDO & Secure REST APIs", topics: ["PHP Data Objects (PDO) prepared statements against SQL injection", "Creating JSON REST APIs for mobile & frontend clients", "User authentication, passwords hashing & sessions"] },
      { week: "Week 4", title: "cPanel Deployment & Database Admin", topics: ["phpMyAdmin database export/import & backups", "Deploying PHP applications on live Apache/Nginx web servers", "Securing .htaccess & SSL integration"] },
    ],
  },

  "web-dev-backend-node": {
    id: "web-dev-backend-node",
    slug: "web-dev-backend-node",
    title: "Advanced Node.js, Express & MySQL + AI",
    subtitle: "Architect Scalable Async APIs, Microservices, JWT Auth, MySQL & AI Backend Tools",
    category: "Software",
    subCategory: "Backend",
    duration: "4 Weeks",
    totalFee: 750,
    requiredDeposit: 300,
    badge: "Enterprise Stack",
    accentColor: "from-emerald-500 to-cyan-600",
    glowClass: "shadow-emerald-500/20",
    borderHoverClass: "hover:border-emerald-500/50",
    badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    hasAiIncluded: true,
    highlights: [
      "Node.js Event Loop, Async/Await & Non-Blocking I/O",
      "Express.js Middleware, Routing & Microservice REST APIs",
      "MySQL Connection Pooling, ORMs & Schema Migrations",
      "AI API Scaffolding & Automated Testing with AI",
    ],
    syllabus: [
      { week: "Week 1", title: "Node.js Runtime & Async Mastery", topics: ["Node.js architecture, modules, Event Loop, Promises", "File system (fs), streams & environment variables", "AI prompt engineering for Node.js backend logic"] },
      { week: "Week 2", title: "Express.js Framework & Middleware", topics: ["Express server initialization, routing & custom middleware", "Request body parsing, CORS, error handler middleware", "REST API endpoint design standards"] },
      { week: "Week 3", title: "MySQL Database & JWT Authentication", topics: ["Connecting Node.js to MySQL database with connection pools", "JSON Web Token (JWT) stateless auth & bcrypt password hashing", "AI SQL ORM query generation (Prisma/Kysely)"] },
      { week: "Week 4", title: "Production Deployment & AI Testing", topics: ["Building unit tests with Jest and AI assistance", "PM2 process manager & Node.js environment tuning", "Hosting on Render, Railway & DigitalOcean"] },
    ],
  },

  "web-dev-fullstack-master": {
    id: "web-dev-fullstack-master",
    slug: "web-dev-fullstack-master",
    title: "Full-Stack Web Dev & AI Masterclass Bundle",
    subtitle: "End-to-End Masterclass Covering HTML/CSS/JS, React, Next.js, Node/PHP, MySQL & AI Engineering",
    category: "Software",
    subCategory: "Full-Stack",
    duration: "8 Weeks",
    totalFee: 1200,
    requiredDeposit: 500,
    badge: "Complete Masterclass",
    accentColor: "from-fuchsia-500 to-pink-600",
    glowClass: "shadow-fuchsia-500/20",
    borderHoverClass: "hover:border-fuchsia-500/50",
    badgeClass: "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30",
    hasAiIncluded: true,
    highlights: [
      "Complete Frontend (HTML, CSS, JS, React 19, Next.js 15)",
      "Complete Backend (Node.js/Express OR PHP 8+ REST APIs)",
      "MySQL Database Architecture & SQL Optimization",
      "Comprehensive AI Coding Integration (V0, Copilot, ChatGPT)",
    ],
    syllabus: [
      { week: "Weeks 1-2", title: "Web Foundations & AI Prompting", topics: ["HTML5 semantic structure & CSS3 Flexbox/Grid", "JavaScript ES6+ fundamentals (variables, arrays, functions, DOM)", "AI-assisted coding workflow with ChatGPT, V0, and GitHub Copilot"] },
      { week: "Weeks 3-4", title: "Modern Frontend (React & Next.js)", topics: ["React Component architecture, Props & State hooks", "Next.js App Router, Server/Client components & API routes", "Tailwind CSS UI design & dark mode styling"] },
      { week: "Weeks 5-6", title: "Database Architecture (MySQL)", topics: ["Relational Database design & normalization", "MySQL table creation, indexes, foreign keys", "SQL queries: SELECT, INSERT, UPDATE, DELETE, JOINs"] },
      { week: "Weeks 7-8", title: "Backend API Engineering & Deployment", topics: ["Building REST APIs in Node.js/Express OR PHP", "Connecting Frontend UI with Backend APIs & MySQL", "Domain setup, SSL, Vercel/cPanel deployment"] },
    ],
  },
}

export const ALL_COURSES = Object.values(COURSES_CATALOG)

export function getCourseById(id: string): Course {
  return COURSES_CATALOG[id] || COURSES_CATALOG["hardware-engineering"]
}
