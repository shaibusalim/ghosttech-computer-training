-- 04-create-courses-table.sql
-- Run this in your Supabase SQL editor to enable dynamic course management by admin.

CREATE TABLE IF NOT EXISTS courses (
  id VARCHAR(100) PRIMARY KEY,
  slug VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  category VARCHAR(100) NOT NULL,
  sub_category VARCHAR(100),
  duration VARCHAR(50) NOT NULL DEFAULT '4 Weeks',
  total_fee DECIMAL(10, 2) NOT NULL,
  required_deposit DECIMAL(10, 2) NOT NULL,
  badge VARCHAR(100),
  accent_color VARCHAR(100),
  has_ai_included BOOLEAN DEFAULT false,
  has_backend_option BOOLEAN DEFAULT false,
  highlights JSONB DEFAULT '[]'::jsonb,
  syllabus JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Allow public read of courses (both open and unavailable, so disabled state displays accurately)
DROP POLICY IF EXISTS "Public can view active courses" ON courses;
DROP POLICY IF EXISTS "Public can view courses" ON courses;
CREATE POLICY "Public can view courses" ON courses
  FOR SELECT USING (true);

-- Service role bypasses RLS for admin updates/inserts/deletions.

-- Populate default courses if not present
INSERT INTO courses (
  id, slug, title, subtitle, category, sub_category, duration, total_fee, required_deposit,
  badge, accent_color, has_ai_included, has_backend_option, highlights, syllabus, is_active, order_index
) VALUES
(
  'hardware-engineering',
  'hardware-engineering',
  'Practical Computer Systems & Engineering',
  'Master Hardware Assembly, OS Deployment, Malware Cleaning, LAN Networking & System Repair',
  'Hardware',
  'Hardware',
  '4 Weeks',
  700.00,
  300.00,
  'Flagship Program',
  'from-emerald-500 to-teal-600',
  false,
  false,
  '[
    "PC Disassembly, Diagnostics & Component Assembly",
    "Windows 10/11 Clean OS Deployment & Drivers Setup",
    "Malware Removal, System Tuning & Partitioning",
    "RJ45 Network Cable Crimping & LAN Router Setup"
  ]'::jsonb,
  '[
    {"week": "Week 1", "title": "Computer Architecture & Disassembly", "topics": ["Motherboards, CPUs, RAM, Power Supply Unit (PSU) testing", "Safe computer disassembly & component identification", "Thermal paste application & PC rebuilding"]},
    {"week": "Week 2", "title": "OS Deployment & Driver Configuration", "topics": ["Creating multi-boot installation USB drives", "Clean Windows 10/11 OS installation & partitioning", "Driver installation & BIOS/UEFI configuration"]},
    {"week": "Week 3", "title": "System Troubleshooting & Maintenance", "topics": ["Antivirus installation & deep malware cleaning", "System optimization & registry cleanup", "Hard drive diagnostic & data recovery basics"]},
    {"week": "Week 4", "title": "Computer Networking & Lab Practicals", "topics": ["Ethernet cable crimping (Straight-through & Crossover)", "LAN switch & Wi-Fi router setup", "IP addressing (IPv4), subnetting & ping diagnostics"]}
  ]'::jsonb,
  true,
  1
),
(
  'office-productivity',
  'office-productivity',
  'Office Productivity & Digital Literacy',
  'Master Microsoft Word, Excel, PowerPoint, Google Workspace & Computer Essentials',
  'Productivity',
  'Productivity',
  '3 Weeks',
  500.00,
  200.00,
  'Essential Skills',
  'from-cyan-500 to-blue-600',
  false,
  false,
  '[
    "Professional Document Design & Reports in MS Word",
    "MS Excel Formulas, Data Analysis & Pivot Tables",
    "MS PowerPoint Pitch Decks & Slide Animations",
    "Email Etiquette, Cloud Storage & Online Research"
  ]'::jsonb,
  '[
    {"week": "Week 1", "title": "Microsoft Word Mastery", "topics": ["Document formatting, headers, footers & page layouts", "Tables, graphics, cover pages & official letterheads", "Table of contents generation & printing settings"]},
    {"week": "Week 2", "title": "Microsoft Excel & Data Analysis", "topics": ["Spreadsheet navigation & formatting cells", "Core formulas: SUM, AVERAGE, COUNT, IF, VLOOKUP", "Charts, graphs, data sorting, filtering & Pivot Tables"]},
    {"week": "Week 3", "title": "PowerPoint & Workplace Tools", "topics": ["Professional slide layout & presentation design", "Transitions, animations & media embedding", "Google Workspace (Drive, Docs, Sheets), email & typing speed"]}
  ]'::jsonb,
  true,
  2
),
(
  'web-dev-frontend-beginner',
  'web-dev-frontend-beginner',
  'Frontend Foundations & AI Web Design',
  'Build Responsive Websites with HTML5, CSS3, Flexbox/Grid, JavaScript ES6+ & AI Tools',
  'Software',
  'Frontend',
  '4 Weeks',
  600.00,
  250.00,
  'Beginner Friendly',
  'from-amber-500 to-orange-600',
  true,
  false,
  '[
    "HTML5 Semantic Structure & Modern Web Accessibility",
    "CSS3 Flexbox, Grid Layouts & Tailwind CSS Styling",
    "Core JavaScript ES6+ (DOM Manipulation, Events, Fetch API)",
    "AI Web Design Prompting with ChatGPT, V0 & Bolt.new"
  ]'::jsonb,
  '[
    {"week": "Week 1", "title": "HTML5 Semantics & Web Foundations", "topics": ["HTML document structure, semantic tags, form controls", "SEO metadata & accessibility standards", "AI-assisted HTML markup generation with ChatGPT"]},
    {"week": "Week 2", "title": "CSS3 Flexbox, Grid & Modern Styling", "topics": ["CSS box model, flexbox flex-direction & alignment", "CSS Grid 2D responsive layouts", "Tailwind CSS utility classes & glassmorphism"]},
    {"week": "Week 3", "title": "Interactive JavaScript ES6+", "topics": ["Variables, functions, objects, arrays", "DOM manipulation, event listeners & form validation", "Fetch API & JSON data handling"]},
    {"week": "Week 4", "title": "AI-Powered Prototyping & Hosting", "topics": ["Rapid UI prototyping with V0.dev & Bolt.new", "Git GitHub version control basics", "Live website deployment on Vercel & Netlify"]}
  ]'::jsonb,
  true,
  3
),
(
  'web-dev-frontend-advanced',
  'web-dev-frontend-advanced',
  'Advanced Modern Frontend (React & Next.js + AI)',
  'Build High-Performance Single & Multi-Page Web Apps with React 19, Next.js 15 & AI Assistants',
  'Software',
  'Frontend',
  '4 Weeks',
  750.00,
  300.00,
  'High Demand',
  'from-blue-500 to-indigo-600',
  true,
  false,
  '[
    "React 19 Component Architecture, Props & Custom Hooks",
    "Next.js 15 App Router, Server Components & Dynamic Routes",
    "State Management (Context API, Zustand, React Query)",
    "AI Code Generation & Refactoring with GitHub Copilot"
  ]'::jsonb,
  '[
    {"week": "Week 1", "title": "React 19 Core Architecture", "topics": ["JSX syntax, Component breakdown, Props & State", "useState, useEffect, useRef hooks in detail", "AI-driven React component generation"]},
    {"week": "Week 2", "title": "Next.js 15 App Router & Server Components", "topics": ["File-based routing, nested layouts & page components", "Server Side Rendering (SSR) & Static Site Generation (SSG)", "API routes & Server Actions"]},
    {"week": "Week 3", "title": "Advanced State & UI Design", "topics": ["Global state management with Context API & Zustand", "Framer Motion animations & Shadcn UI library", "Optimizing React render performance with AI tools"]},
    {"week": "Week 4", "title": "Production Build & AI Workflows", "topics": ["GitHub Copilot for instant component testing", "Next.js Turbopack build optimization", "Production deployment on Vercel with custom domain & SSL"]}
  ]'::jsonb,
  true,
  4
),
(
  'web-dev-backend-php',
  'web-dev-backend-php',
  'PHP & MySQL Database Engineering + AI',
  'Build Robust Server-Side Web Applications, Relational Databases & AI SQL Queries',
  'Software',
  'Backend',
  '4 Weeks',
  650.00,
  250.00,
  'Classic Backend',
  'from-violet-500 to-purple-600',
  true,
  false,
  '[
    "PHP 8+ Fundamentals, Object-Oriented Programming (OOP)",
    "MySQL Database Design, Table Relationships & SQL JOINs",
    "Building Secure RESTful APIs & Session Authentication",
    "AI Query Building & SQL Optimization with AI Tools"
  ]'::jsonb,
  '[
    {"week": "Week 1", "title": "PHP 8 Syntax & OOP Principles", "topics": ["PHP syntax, arrays, superglobals ($_GET, $_POST)", "Object-Oriented Programming: Classes, Objects, Methods", "AI-assisted PHP script writing & error debugging"]},
    {"week": "Week 2", "title": "MySQL Database Engineering", "topics": ["Relational DB concepts, primary & foreign keys", "SQL queries: SELECT, INSERT, UPDATE, DELETE, JOINs", "AI SQL query generators & query plan optimization"]},
    {"week": "Week 3", "title": "PHP PDO & Secure REST APIs", "topics": ["PHP Data Objects (PDO) prepared statements against SQL injection", "Creating JSON REST APIs for mobile & frontend clients", "User authentication, passwords hashing & sessions"]},
    {"week": "Week 4", "title": "cPanel Deployment & Database Admin", "topics": ["phpMyAdmin database export/import & backups", "Deploying PHP applications on live Apache/Nginx web servers", "Securing .htaccess & SSL integration"]}
  ]'::jsonb,
  true,
  5
),
(
  'web-dev-backend-node',
  'web-dev-backend-node',
  'Advanced Node.js, Express & MySQL + AI',
  'Architect Scalable Async APIs, Microservices, JWT Auth, MySQL & AI Backend Tools',
  'Software',
  'Backend',
  '4 Weeks',
  750.00,
  300.00,
  'Enterprise Stack',
  'from-emerald-500 to-cyan-600',
  true,
  false,
  '[
    "Node.js Event Loop, Async/Await & Non-Blocking I/O",
    "Express.js Middleware, Routing & Microservice REST APIs",
    "MySQL Connection Pooling, ORMs & Schema Migrations",
    "AI API Scaffolding & Automated Testing with AI"
  ]'::jsonb,
  '[
    {"week": "Week 1", "title": "Node.js Runtime & Async Mastery", "topics": ["Node.js architecture, modules, Event Loop, Promises", "File system (fs), streams & environment variables", "AI prompt engineering for Node.js backend logic"]},
    {"week": "Week 2", "title": "Express.js Framework & Middleware", "topics": ["Express server initialization, routing & custom middleware", "Request body parsing, CORS, error handler middleware", "REST API endpoint design standards"]},
    {"week": "Week 3", "title": "MySQL Database & JWT Authentication", "topics": ["Connecting Node.js to MySQL database with connection pools", "JSON Web Token (JWT) stateless auth & bcrypt password hashing", "AI SQL ORM query generation (Prisma/Kysely)"]},
    {"week": "Week 4", "title": "Production Deployment & AI Testing", "topics": ["Building unit tests with Jest and AI assistance", "PM2 process manager & Node.js environment tuning", "Hosting on Render, Railway & DigitalOcean"]}
  ]'::jsonb,
  true,
  6
),
(
  'web-dev-fullstack-master',
  'web-dev-fullstack-master',
  'Full-Stack Web Dev & AI Masterclass Bundle',
  'End-to-End Masterclass Covering HTML/CSS/JS, React, Next.js, Node/PHP, MySQL & AI Engineering',
  'Software',
  'Full-Stack',
  '8 Weeks',
  1200.00,
  500.00,
  'Complete Masterclass',
  'from-fuchsia-500 to-pink-600',
  true,
  true,
  '[
    "Complete Frontend (HTML, CSS, JS, React 19, Next.js 15)",
    "Complete Backend (Node.js/Express OR PHP 8+ REST APIs)",
    "MySQL Database Architecture & SQL Optimization",
    "Comprehensive AI Coding Integration (V0, Copilot, ChatGPT)"
  ]'::jsonb,
  '[
    {"week": "Weeks 1-2", "title": "Web Foundations & AI Prompting", "topics": ["HTML5 semantic structure & CSS3 Flexbox/Grid", "JavaScript ES6+ fundamentals (variables, arrays, functions, DOM)", "AI-assisted coding workflow with ChatGPT, V0, and GitHub Copilot"]},
    {"week": "Weeks 3-4", "title": "Modern Frontend (React & Next.js)", "topics": ["React Component architecture, Props & State hooks", "Next.js App Router, Server/Client components & API routes", "Tailwind CSS UI design & dark mode styling"]},
    {"week": "Weeks 5-6", "title": "Database Architecture (MySQL)", "topics": ["Relational Database design & normalization", "MySQL table creation, indexes, foreign keys", "SQL queries: SELECT, INSERT, UPDATE, DELETE, JOINs"]},
    {"week": "Weeks 7-8", "title": "Backend API Engineering & Deployment", "topics": ["Building REST APIs in Node.js/Express OR PHP", "Connecting Frontend UI with Backend APIs & MySQL", "Domain setup, SSL, Vercel/cPanel deployment"]}
  ]'::jsonb,
  true,
  7
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  category = EXCLUDED.category,
  duration = EXCLUDED.duration,
  total_fee = EXCLUDED.total_fee,
  required_deposit = EXCLUDED.required_deposit,
  badge = EXCLUDED.badge,
  highlights = EXCLUDED.highlights,
  syllabus = EXCLUDED.syllabus,
  has_ai_included = EXCLUDED.has_ai_included,
  has_backend_option = EXCLUDED.has_backend_option,
  updated_at = CURRENT_TIMESTAMP;
