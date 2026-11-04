/* =========================================================
   ExamFlow — dashboard.js
   4 role-based dashboards with demo role switcher
   ========================================================= */
(() => {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const esc = (s) => String(s).replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));

  /* ---------- SVG icon library ---------- */
  const ICONS = {
    overview:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
    institutions:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-6 9 6"/><path d="M4 9v11h16V9"/><path d="M9 22V12h6v10"/></svg>',
    users:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    system:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h4l3-8 4 16 3-8h4"/></svg>',
    billing:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>',
    audit:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 15h6M9 11h2"/></svg>',
    exams:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v13.5"/><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M9 8h6M9 12h6"/></svg>',
    registrations:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/></svg>',
    results:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-6"/></svg>',
    cert:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="6"/><path d="m8.2 13.9-1.5 7.3 5.3-2.8 5.3 2.8-1.5-7.3"/></svg>',
    staff:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a6.5 6.5 0 0 1 13 0"/></svg>',
    settings:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>',
    scripts:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 13h6M9 17h4"/></svg>',
    marks:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
    schedule:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
    students:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    profile:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>',
    exam:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v13.5"/><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/></svg>',
    download:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
    check:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    alert:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
    clock:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    server:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="8" rx="2"/><rect x="2" y="13" width="20" height="8" rx="2"/><line x1="6" y1="7" x2="6.01" y2="7"/><line x1="6" y1="17" x2="6.01" y2="17"/></svg>',
    bell:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
  };

  /* ---------- Local-only demo records ---------- */
  const DEMO_KEY = 'ef-workflow-demo-v1';
  const DEMO_EXAMS = [
    { id: 'be-level-2', title: 'BE Level 2 — Sem 4', date: '2026-10-12', time: '09:30', venue: 'Mumbai-04', seats: 1204, fee: 450, status: 'completed', description: 'Semester 4 assessment covering core engineering topics.' },
    { id: 'cloud-foundations', title: 'Cloud Foundations', date: '2026-11-18', time: '10:00', venue: 'Mumbai-04', seats: 940, fee: 350, status: 'open', description: 'Foundational cloud concepts, networking and practical applications.' },
    { id: 'data-science-l1', title: 'Data Science L1', date: '2026-10-22', time: '09:00', venue: 'Mumbai-02', seats: 620, fee: 400, status: 'completed', description: 'A practical assessment of data analysis and foundational modelling.' },
    { id: 'advanced-ml', title: 'Advanced ML', date: '2026-12-04', time: '14:00', venue: 'Mumbai-02', seats: 410, fee: 600, status: 'open', description: 'Advanced machine learning concepts and applied problem solving.' },
    { id: 'cybersecurity-l2', title: 'Cybersecurity L2', date: '2026-12-15', time: '10:00', venue: 'Delhi-01', seats: 284, fee: 500, status: 'draft', description: 'Security operations, risk assessment and incident response.' },
  ];
  const DEMO_REGISTRATIONS = [
    { id: 'reg-aarav-be', name: 'Aarav Sharma', email: 'aarav.sharma@example.com', examId: 'be-level-2', centre: 'Mumbai-04', feeStatus: 'Paid', status: 'approved', parts: [18, 16, 20, 14, 20], score: 88, marksStatus: 'published', resultPublished: true, qualification: 'BE Engineering', eligible: true, documents: ['Aarav-ID-demo.pdf'], reviewerFeedback: 'Strong application and clear communication.', recommendation: 'shortlist', selectionStatus: 'selected' },
    { id: 'reg-aarav-ds', name: 'Aarav Sharma', email: 'aarav.sharma@example.com', examId: 'data-science-l1', centre: 'Mumbai-02', feeStatus: 'Paid', status: 'approved', parts: [16, 15, 14, 15, 16], score: 76, marksStatus: 'published', resultPublished: true, qualification: 'BE Engineering', eligible: true, documents: ['Aarav-ID-demo.pdf'], reviewerFeedback: '', recommendation: 'review', selectionStatus: 'pending' },
    { id: 'reg-aarav-cloud', name: 'Aarav Sharma', email: 'aarav.sharma@example.com', examId: 'cloud-foundations', centre: 'Mumbai-04', feeStatus: 'Paid', status: 'approved', parts: [], score: null, resultPublished: false, qualification: 'BE Engineering', eligible: true, documents: ['Aarav-ID-demo.pdf'], selectionStatus: 'pending' },
    { id: 'reg-menon', name: 'P. Menon', email: 'p.menon@example.com', examId: 'be-level-2', centre: 'Mumbai-04', feeStatus: 'Paid', status: 'submitted', parts: [], score: null, resultPublished: false, qualification: 'BE Engineering', eligible: true, documents: ['P-Menon-ID-demo.pdf'], selectionStatus: 'pending' },
    { id: 'reg-reddy', name: 'K. Reddy', email: 'k.reddy@example.com', examId: 'cloud-foundations', centre: 'Hyderabad-01', feeStatus: 'Paid', status: 'approved', parts: [], score: null, resultPublished: false, qualification: 'BSc Computer Science', eligible: true, documents: ['K-Reddy-ID-demo.pdf'], selectionStatus: 'pending' },
    { id: 'reg-dutta', name: 'J. Dutta', email: 'j.dutta@example.com', examId: 'be-level-2', centre: 'Kolkata-02', feeStatus: 'Paid', status: 'approved', parts: [15, 14, 16, 14, 15], score: 74, marksStatus: 'submitted', resultPublished: false, qualification: 'BE Engineering', eligible: true, documents: ['J-Dutta-ID-demo.pdf'], reviewerFeedback: 'Meets the assessment criteria.', recommendation: 'shortlist', selectionStatus: 'shortlisted' },
    { id: 'reg-bose', name: 'A. Bose', email: 'a.bose@example.com', examId: 'data-science-l1', centre: 'Bengaluru-03', feeStatus: 'Pending', status: 'submitted', parts: [], score: null, resultPublished: false, qualification: 'BSc Mathematics', eligible: true, documents: ['A-Bose-ID-demo.pdf'], selectionStatus: 'pending' },
    { id: 'reg-nair', name: 'S. Nair', email: 's.nair@example.com', examId: 'be-level-2', centre: 'Chennai-02', feeStatus: 'Paid', status: 'rejected', parts: [], score: null, resultPublished: false, qualification: 'BE Engineering', eligible: false, documents: ['S-Nair-ID-demo.pdf'], selectionStatus: 'not-selected' },
  ];
  const savedDemo = localStorage.getItem(DEMO_KEY);
  const demo = savedDemo
    ? JSON.parse(savedDemo)
    : { exams: DEMO_EXAMS, registrations: DEMO_REGISTRATIONS, announcements: [], supportRequests: [], scheduleEvents: [] };
  if (!demo || !Array.isArray(demo.exams) || !Array.isArray(demo.registrations)) {
    throw new Error('ExamFlow demo data is invalid. Clear the ef-workflow-demo-v1 browser storage key to reset it.');
  }
  if (!Array.isArray(demo.announcements)) demo.announcements = [];
  if (!Array.isArray(demo.supportRequests)) demo.supportRequests = [];
  if (!Array.isArray(demo.scheduleEvents)) demo.scheduleEvents = [];
  demo.registrations.forEach((registration) => {
    if (!Array.isArray(registration.documents)) registration.documents = [`${registration.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-demo-document.pdf`];
    if (typeof registration.eligible !== 'boolean') registration.eligible = true;
    if (!registration.selectionStatus) registration.selectionStatus = registration.resultPublished ? (registration.score >= 40 ? 'selected' : 'not-selected') : 'pending';
    if (!registration.recommendation) registration.recommendation = registration.resultPublished ? (registration.score >= 40 ? 'shortlist' : 'not-selected') : 'review';
    if (typeof registration.reviewerFeedback !== 'string') registration.reviewerFeedback = '';
    if (!registration.marksStatus) registration.marksStatus = registration.resultPublished ? 'published' : registration.score !== null ? 'draft' : '';
    if (typeof registration.eligibilityVerified !== 'boolean') registration.eligibilityVerified = registration.status !== 'submitted';
    if (typeof registration.documentsVerified !== 'boolean') registration.documentsVerified = registration.status !== 'submitted';
  });
  demo.supportRequests.forEach((request, index) => {
    if (!request.id) request.id = `support-legacy-${index}`;
    if (!request.status) request.status = 'open';
    if (typeof request.reply !== 'string') request.reply = '';
  });
  const saveDemo = () => localStorage.setItem(DEMO_KEY, JSON.stringify(demo));
  if (!savedDemo) saveDemo();
  const getExam = (id) => demo.exams.find((exam) => exam.id === id);
  const getRegistration = (id) => demo.registrations.find((registration) => registration.id === id);
  const examRegistrations = (examId) => demo.registrations.filter((registration) => registration.examId === examId);
  const studentName = () => localStorage.getItem('ef-student-name') || 'Aarav Sharma';
  const studentRegistrations = () => demo.registrations.filter((registration) => registration.name === studentName());
  const examDateLabel = (date) => new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  const shareUrl = (examId) => {
    const url = new URL(window.location.href);
    url.search = '';
    url.hash = '';
    url.searchParams.set('role', 'student');
    url.searchParams.set('exam', examId);
    return url.href;
  };
  const safeId = (prefix) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

  /* ---------- Data per role ---------- */
  const ROLES = {
    'super-admin': {
      user: { name: 'Anika Rao', role: 'Platform Owner', initials: 'AR' },
      label: 'Super Admin',
      nav: [
        { id: 'overview',    label: 'Overview',      icon: 'overview' },
        { id: 'institutions',label: 'Institutions',  icon: 'institutions' },
        { id: 'users',       label: 'All Users',     icon: 'users' },
        { id: 'system',      label: 'System health', icon: 'system' },
        { div: true },
        { id: 'billing',     label: 'Billing',       icon: 'billing' },
        { id: 'audit',       label: 'Audit logs',    icon: 'audit', count: 3 },
      ],
    },
    admin: {
      user: { name: 'Priya Menon', role: 'Exam Controller · Northfield', initials: 'PM' },
      label: 'Admin',
      nav: [
        { id: 'overview',     label: 'Overview',      icon: 'overview' },
        { id: 'exams',        label: 'Exams',         icon: 'exams' },
        { id: 'create-exam',  label: 'Create exam',   icon: 'exam' },
        { id: 'registrations',label: 'Registrations', icon: 'registrations', count: 14 },
        { id: 'results',      label: 'Results',       icon: 'results' },
        { id: 'certificates', label: 'Certificates',  icon: 'cert' },
        { id: 'reports',      label: 'Reports',       icon: 'results' },
        { div: true },
        { id: 'staff',        label: 'Staff',         icon: 'staff' },
        { id: 'schedule',     label: 'Schedule',      icon: 'schedule' },
        { id: 'communications', label: 'Communications', icon: 'bell' },
        { id: 'support-requests', label: 'Support inbox', icon: 'bell' },
        { id: 'settings',     label: 'Settings',      icon: 'settings' },
      ],
    },
    teacher: {
      user: { name: 'Rajan Krishnan', role: 'Senior Evaluator', initials: 'RK' },
      label: 'Teacher',
      nav: [
        { id: 'overview', label: 'Overview',      icon: 'overview' },
        { id: 'scripts',  label: 'My scripts',    icon: 'scripts', count: 12 },
        { id: 'marks',    label: 'Marks entry',   icon: 'marks' },
        { id: 'schedule', label: 'Schedule',      icon: 'schedule' },
        { id: 'insights', label: 'Class insights', icon: 'results' },
        { div: true },
        { id: 'students', label: 'Students',      icon: 'students' },
      ],
    },
    student: {
      user: { name: 'Aarav Sharma', role: 'BE Level 2 · Candidate', initials: 'AS' },
      label: 'Student',
      nav: [
        { id: 'overview',     label: 'Overview',      icon: 'overview' },
        { id: 'myexams',      label: 'My exams',      icon: 'exam' },
        { id: 'catalog',      label: 'Find exams',    icon: 'exams' },
        { id: 'results',      label: 'Results',       icon: 'results' },
        { id: 'certificates', label: 'Certificates',  icon: 'cert' },
        { div: true },
        { id: 'schedule',     label: 'Schedule',      icon: 'schedule' },
        { id: 'preparation',  label: 'Preparation',   icon: 'check' },
        { id: 'support',      label: 'Help & support', icon: 'bell' },
        { id: 'profile',      label: 'Profile',       icon: 'profile' },
      ],
    },
  };

  /* ---------- Shared UI helpers ---------- */
  const stat = ({ label, value, sub, delta, deltaType = 'up', icon = 'overview', iconClass = '' }) => `
    <div class="stat-card">
      <div class="stat-head">
        <span class="stat-label">${esc(label)}</span>
        <span class="stat-ico ${iconClass}">${ICONS[icon] || ICONS.overview}</span>
      </div>
      <div class="stat-value">${value}${sub ? `<small>${esc(sub)}</small>` : ''}</div>
      ${delta ? `<span class="stat-delta ${deltaType}">${deltaType === 'up' ? '▲' : deltaType === 'down' ? '▼' : '•'} ${esc(delta)}</span>` : ''}
    </div>`;

  const chartRow = (label, pct, variant = '') =>
    `<div class="chart-row"><span>${esc(label)}</span><div class="chart-track"><i class="${variant}" style="width:${pct}%"></i></div><b>${pct}%</b></div>`;

  const activity = (icon, iconClass, text, time) => `
    <div class="activity-item">
      <span class="activity-ico ${iconClass}">${ICONS[icon] || '•'}</span>
      <div class="activity-body"><p>${text}</p><small>${esc(time)}</small></div>
    </div>`;

  const chip = (label, kind = 'neutral') =>
    `<span class="chip ${kind}">${esc(label)}</span>`;

  const pageHeader = (title, sub, actions = '') => `
    <div class="page-header">
      <div><h1>${esc(title)}</h1>${sub ? `<p>${esc(sub)}</p>` : ''}</div>
      ${actions ? `<div class="page-actions">${actions}</div>` : ''}
    </div>`;

  /* =========================================================
     SECTION RENDERERS
     ========================================================= */
  const SECTIONS = {

    /* ================= SUPER ADMIN ================= */
    'super-admin': {
      overview: () => `
        ${pageHeader(
          'Platform overview',
          'Everything happening across all institutions right now.',
          `<button class="btn btn-ghost btn-sm" data-action="export">${ICONS.download} Export</button>
           <button class="btn btn-primary btn-sm" data-action="add-institution">+ Add institution</button>`
        )}

        <div class="stats-grid">
          ${stat({ label: 'Institutions', value: '128', delta: '+6 this month', icon: 'institutions' })}
          ${stat({ label: 'Total users', value: '48,320', delta: '+1,204 this week', icon: 'users' })}
          ${stat({ label: 'Exams live', value: '38', delta: '4 starting today', icon: 'exams', iconClass: 'info' })}
          ${stat({ label: 'Monthly revenue', value: '₹42.8L', delta: '+18.2%', icon: 'billing' })}
        </div>

        <div class="content-grid grid-3-1">
          <div class="panel">
            <div class="panel-head">
              <div><h3>Institution activity</h3><p>Top institutions by exam volume this quarter</p></div>
              <button class="btn btn-ghost btn-sm" data-action="view-all">View all</button>
            </div>
            <table class="data-table">
              <thead><tr><th>Institution</th><th>Plan</th><th>Exams</th><th>Users</th><th>Status</th></tr></thead>
              <tbody>
                <tr><td><div class="cell-primary">Northfield University</div><div class="cell-muted">Univ · Delhi</div></td><td>Enterprise</td><td>14</td><td>4,820</td><td>${chip('Active', 'ok')}</td></tr>
                <tr><td><div class="cell-primary">Meridian Institute</div><div class="cell-muted">College · Mumbai</div></td><td>Growth</td><td>9</td><td>2,140</td><td>${chip('Active', 'ok')}</td></tr>
                <tr><td><div class="cell-primary">SkillCert India</div><div class="cell-muted">Certification · Bengaluru</div></td><td>Growth</td><td>22</td><td>6,240</td><td>${chip('Active', 'ok')}</td></tr>
                <tr><td><div class="cell-primary">TechGrad Academy</div><div class="cell-muted">Training · Pune</div></td><td>Starter</td><td>4</td><td>820</td><td>${chip('Trial', 'warn')}</td></tr>
                <tr><td><div class="cell-primary">Govt. Poly Board</div><div class="cell-muted">Govt · Chennai</div></td><td>Enterprise</td><td>18</td><td>12,400</td><td>${chip('Active', 'ok')}</td></tr>
              </tbody>
            </table>
          </div>

          <div class="panel">
            <div class="panel-head"><h3>System health</h3></div>
            <div class="chart-bars">
              ${chartRow('Service uptime', 99)}
              ${chartRow('Database', 94)}
              ${chartRow('Queue lag', 12, 'amber')}
              ${chartRow('Error rate', 2, 'red')}
            </div>
            <div class="activity-feed" style="margin-top:18px">
              ${activity('server', '', '<b>All regions healthy.</b> No incidents reported.', '2 min ago')}
              ${activity('clock', 'warn', 'Scheduled maintenance <b>May 12, 02:00 IST</b>', '1 hr ago')}
            </div>
          </div>
        </div>
      `,

      institutions: () => `
        ${pageHeader(
          'Institutions',
          'All schools, colleges and certification bodies on the platform.',
          `<button class="btn btn-ghost btn-sm">${ICONS.download} Export CSV</button>
           <button class="btn btn-primary btn-sm" data-action="add-institution">+ New institution</button>`
        )}
        <div class="stats-grid">
          ${stat({ label: 'Active', value: '124', delta: '97% of total', icon: 'check' })}
          ${stat({ label: 'Trial', value: '4', delta: '2 converting', icon: 'clock', iconClass: 'warn' })}
          ${stat({ label: 'Churned', value: '0', delta: 'this quarter', iconClass: 'bad', icon: 'alert' })}
        </div>
        <div class="panel">
          <table class="data-table">
            <thead><tr><th>Institution</th><th>Type</th><th>Plan</th><th>Candidates</th><th>Renewal</th><th>Status</th><th></th></tr></thead>
            <tbody>
              ${[
                ['Northfield University','University','Enterprise','4,820','Jan 2027','ok','Active'],
                ['Meridian Institute','College','Growth','2,140','Aug 2026','ok','Active'],
                ['SkillCert India','Cert body','Growth','6,240','Mar 2027','ok','Active'],
                ['TechGrad Academy','Training','Starter','820','Jun 2026','warn','Trial'],
                ['Govt. Poly Board','Govt board','Enterprise','12,400','Dec 2026','ok','Active'],
                ['Sunrise Academy','School','Starter','340','Jul 2026','ok','Active'],
              ].map(([name, type, plan, users, renewal, kind, label]) => `
                <tr>
                  <td><div class="cell-primary">${esc(name)}</div></td>
                  <td>${esc(type)}</td>
                  <td>${esc(plan)}</td>
                  <td class="cell-mono">${esc(users)}</td>
                  <td class="cell-muted">${esc(renewal)}</td>
                  <td>${chip(label, kind)}</td>
                  <td><div class="row-actions"><button class="btn btn-ghost btn-sm" data-action="manage">Manage</button></div></td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      `,

      system: () => `
        ${pageHeader('System health', 'Real-time infrastructure status across all regions.')}
        <div class="content-grid grid-1-1">
          <div class="panel">
            <div class="panel-head"><h3>Service status</h3></div>
            <table class="data-table">
              <thead><tr><th>Service</th><th>Latency</th><th>Uptime</th><th></th></tr></thead>
              <tbody>
                ${[
                  ['Assessment services','42 ms','99.99%'],
                  ['Result engine','68 ms','99.98%'],
                  ['Certificate service','91 ms','99.95%'],
                  ['Email dispatch','12 ms','99.99%'],
                  ['Database cluster','8 ms','99.99%'],
                ].map(([s,l,u]) => `
                  <tr>
                    <td class="cell-primary">${esc(s)}</td>
                    <td class="cell-mono">${esc(l)}</td>
                    <td class="cell-mono">${esc(u)}</td>
                    <td>${chip('Healthy','ok')}</td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>
          <div class="panel">
            <div class="panel-head"><h3>Concurrent users (24h)</h3></div>
            <svg class="spark" viewBox="0 0 400 70" preserveAspectRatio="none">
              <defs><linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="var(--accent)" stop-opacity=".35"/>
                <stop offset="100%" stop-color="var(--accent)" stop-opacity="0"/>
              </linearGradient></defs>
              <path d="M0 55 L40 48 L80 52 L120 35 L160 40 L200 22 L240 28 L280 18 L320 24 L360 12 L400 15 L400 70 L0 70 Z" fill="url(#sparkGrad)"/>
              <path d="M0 55 L40 48 L80 52 L120 35 L160 40 L200 22 L240 28 L280 18 L320 24 L360 12 L400 15" fill="none" stroke="var(--accent)" stroke-width="2"/>
            </svg>
            <div class="activity-feed" style="margin-top:16px">
              ${activity('server','','Peak concurrent: <b>38,420 users</b>','14:32 IST')}
              ${activity('check','','Zero 5xx errors in the last 24h','—')}
            </div>
          </div>
        </div>
      `,

      users: () => `
        ${pageHeader('All users', 'Manage every account across the platform.')}
        <div class="stats-grid">
          ${stat({ label: 'Admins', value: '482', delta: '+12 this week', icon: 'users' })}
          ${stat({ label: 'Teachers', value: '3,840', delta: '+204 this week', icon: 'staff' })}
          ${stat({ label: 'Students', value: '43,998', delta: '+1,120 this week', icon: 'students' })}
        </div>
        <div class="panel">
          <table class="data-table">
            <thead><tr><th>User</th><th>Role</th><th>Institution</th><th>Last active</th><th>Status</th></tr></thead>
            <tbody>
              ${[
                ['Priya Menon','PM','Exam Controller','Northfield','2 min ago','ok','Active'],
                ['Rajan Krishnan','RK','Senior Evaluator','Meridian','1 hr ago','ok','Active'],
                ['Sana Fatima','SF','Director','SkillCert','Yesterday','ok','Active'],
                ['Vivek Joshi','VJ','Coordinator','TechGrad','3 days ago','warn','Inactive'],
              ].map(([n,i,r,inst,t,k,l]) => `
                <tr>
                  <td><div class="avatar-cell"><span class="avatar-sm">${i}</span><div><div class="cell-primary">${esc(n)}</div><div class="cell-muted">${esc(r)}</div></div></div></td>
                  <td>${esc(r)}</td>
                  <td>${esc(inst)}</td>
                  <td class="cell-muted">${esc(t)}</td>
                  <td>${chip(l,k)}</td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      `,

      billing: () => `
        ${pageHeader('Billing', 'Revenue, invoices and plan distribution.')}
        <div class="stats-grid">
          ${stat({ label: 'MRR', value: '₹42.8L', delta: '+18.2% vs last month', icon: 'billing' })}
          ${stat({ label: 'Active subscriptions', value: '124', delta: '+6', icon: 'check' })}
          ${stat({ label: 'Failed payments', value: '3', delta: 'needs follow-up', deltaType: 'down', iconClass: 'warn', icon: 'alert' })}
        </div>
        <div class="panel">
          <div class="panel-head"><h3>Recent invoices</h3><button class="btn btn-ghost btn-sm">View all</button></div>
          <table class="data-table">
            <thead><tr><th>Invoice</th><th>Institution</th><th>Amount</th><th>Due</th><th>Status</th></tr></thead>
            <tbody>
              ${[
                ['INV-2026-0412','Northfield University','₹24,900','Mar 30','ok','Paid'],
                ['INV-2026-0411','SkillCert India','₹24,900','Mar 28','ok','Paid'],
                ['INV-2026-0410','Meridian Institute','₹9,900','Mar 25','ok','Paid'],
                ['INV-2026-0409','TechGrad Academy','₹9,900','Mar 22','warn','Pending'],
              ].map(([id,inst,amt,due,k,l]) => `
                <tr><td class="cell-mono">${esc(id)}</td><td class="cell-primary">${esc(inst)}</td><td>${esc(amt)}</td><td class="cell-muted">${esc(due)}</td><td>${chip(l,k)}</td></tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `,

      audit: () => `
        ${pageHeader('Audit logs', 'Every administrative action across the platform.')}
        <div class="panel">
          <div class="activity-feed">
            ${activity('settings','','<b>Priya Menon</b> updated pass mark for <b>BE Level 2</b> from 38 → 40','2 min ago')}
            ${activity('results','','<b>Sana Fatima</b> published 1,204 results for <b>Cloud Foundations</b>','12 min ago')}
            ${activity('users','warn','<b>Vivek Joshi</b> failed to log in 3× — account locked','1 hr ago')}
            ${activity('cert','','<b>Rajan Krishnan</b> issued 42 certificates for <b>Data Science</b>','2 hrs ago')}
            ${activity('settings','','<b>Anika Rao</b> changed billing plan for <b>TechGrad Academy</b> to Starter','Yesterday')}
            ${activity('alert','bad','<b>System</b> auto-scaled workers by 40% during load test','Yesterday')}
          </div>
        </div>
      `,
    },

    /* ================= ADMIN ================= */
    admin: {
      overview: () => {
        const pending = demo.registrations.filter((registration) => registration.status === 'submitted');
        const readyResults = demo.registrations.filter((registration) => registration.score !== null && registration.marksStatus === 'submitted' && !registration.resultPublished);
        const upcoming = demo.exams.filter((exam) => exam.status === 'open' && exam.date >= new Date().toISOString().slice(0, 10)).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3);
        return `
        ${pageHeader(
          'Good morning, Priya',
          'Here’s your institution at a glance. A few important items are ready for your attention.',
          `<button class="btn btn-ghost btn-sm" data-action="export">${ICONS.download} Export</button>
           <button class="btn btn-primary btn-sm" data-action="new-exam">+ Create program</button>`
        )}

        <div class="highlight-banner">
          <div class="hb-ico">${ICONS.alert}</div>
          <div class="hb-text">
            <b>${pending.length} registration${pending.length === 1 ? '' : 's'} need your review</b>
            <small>Approve complete applications to unlock exam-day details.</small>
          </div>
          <button class="btn btn-primary btn-sm" data-action="review">Review now</button>
        </div>

        <div class="stats-grid">
          ${stat({ label: 'Registered candidates', value: demo.registrations.length, delta: `${pending.length} awaiting review`, icon: 'registrations' })}
          ${stat({ label: 'Open assessments', value: demo.exams.filter((exam) => exam.status === 'open').length, delta: `${upcoming.length} upcoming`, icon: 'exams', iconClass: 'info' })}
          ${stat({ label: 'Pass rate', value: '87.4', sub: '%', delta: '+2.1 pts', icon: 'results' })}
          ${stat({ label: 'Results published', value: demo.registrations.filter((registration) => registration.resultPublished).length, delta: `${readyResults.length} ready to publish`, icon: 'cert' })}
        </div>

        <div class="content-grid grid-3-1">
          <div class="panel">
            <div class="panel-head">
              <div><h3>Program progress</h3><p>Completion across your active assessments</p></div>
              <button class="btn btn-ghost btn-sm" data-action="view-all">View programs</button>
            </div>
            <div class="chart-bars">
              ${chartRow('Cloud Foundations', 94)}
              ${chartRow('BE Level 2', 87)}
              ${chartRow('Data Science L1', 78, 'amber')}
              ${chartRow('Advanced ML', 62, 'amber')}
              ${chartRow('Cybersecurity L2', 45, 'red')}
            </div>
            <table class="data-table compact-table" style="margin-top:16px">
              <thead><tr><th>Program</th><th>Applications</th><th>Completion</th><th>Pass rate</th></tr></thead>
              <tbody>
                <tr><td class="cell-primary">Cloud Foundations</td><td>940</td><td>94%</td><td>94%</td></tr>
                <tr><td class="cell-primary">BE Level 2</td><td>1,204</td><td>87%</td><td>87%</td></tr>
                <tr><td class="cell-primary">Data Science L1</td><td>620</td><td>78%</td><td>82%</td></tr>
                <tr><td class="cell-primary">Advanced ML</td><td>410</td><td>62%</td><td>—</td></tr>
                <tr><td class="cell-primary">Cybersecurity L2</td><td>284</td><td>45%</td><td>—</td></tr>
              </tbody>
            </table>
          </div>

          <div class="panel">
            <div class="panel-head"><h3>Recent activity</h3></div>
            <div class="activity-feed">
              ${activity('results','',`<b>${demo.registrations.filter((registration) => registration.resultPublished).length}</b> results published`,'In this demo')}
              ${activity('cert','',`<b>${readyResults.length}</b> results ready to publish`,'Action needed')}
              ${activity('registrations','warn',`<b>${pending.length}</b> applications need review`,'Action needed')}
              ${activity('check','',`<b>${upcoming.length}</b> upcoming open assessments`,'On schedule')}
            </div>
          </div>
        </div>

        <div class="content-grid grid-1-1">
          <div class="panel trend-panel">
            <div class="panel-head">
              <div><h3>Application activity</h3><p>Submissions across your programs</p></div>
              <div class="range-switch" role="group" aria-label="Application chart time range">
                <button class="active" type="button" data-range="week" aria-pressed="true">Week</button>
                <button type="button" data-range="month" aria-pressed="false">Month</button>
              </div>
            </div>
            <div class="trend-summary">
              <div><b data-trend-total>1,284</b><span>applications received</span></div>
              <span class="trend-change">${ICONS.results} 12.8% <small>vs. previous period</small></span>
            </div>
            <div class="trend-chart" role="img" aria-label="Applications received through the week">
              <div class="trend-gridline"><span>300</span><i></i></div>
              <div class="trend-gridline"><span>200</span><i></i></div>
              <div class="trend-gridline"><span>100</span><i></i></div>
              <div class="trend-columns">
                ${[
                  ['Mon', 62, 84, 145, 820], ['Tue', 73, 89, 172, 870], ['Wed', 68, 93, 160, 910],
                  ['Thu', 80, 96, 188, 940], ['Fri', 75, 94, 176, 920], ['Sat', 100, 100, 235, 980],
                  ['Sun', 89, 100, 208, 980],
                ].map(([label, week, month, weekCount, monthCount], index) => `
                  <div class="trend-column" data-week="${week}" data-month="${month}" data-week-count="${weekCount}" data-month-count="${monthCount}" title="${label}: ${weekCount} applications">
                    <i style="--bar-height:${week}%"></i><span data-week-label="${label}" data-month-label="W${index + 1}">${label}</span>
                  </div>`).join('')}
              </div>
            </div>
          </div>

          <div class="panel attention-panel">
            <div class="panel-head">
              <div><h3>What needs attention</h3><p>Your next best actions</p></div>
              ${chip('Today', 'neutral')}
            </div>
            <button class="attention-item" type="button" data-action="review">
              <span class="attention-icon amber">${ICONS.registrations}</span>
              <span class="attention-copy"><b>Review applications</b><small>Check submitted details and documents</small></span>
              <span class="attention-count">${pending.length} <small>waiting</small></span>
              <span class="attention-arrow" aria-hidden="true">↗</span>
            </button>
            <button class="attention-item" type="button" data-action="publish">
              <span class="attention-icon green">${ICONS.results}</span>
              <span class="attention-copy"><b>Publish results</b><small>Evaluations are ready to share</small></span>
              <span class="attention-count">${readyResults.length} <small>results</small></span>
              <span class="attention-arrow" aria-hidden="true">↗</span>
            </button>
            <button class="attention-item" type="button" data-action="issue">
              <span class="attention-icon violet">${ICONS.cert}</span>
              <span class="attention-copy"><b>Prepare certificates</b><small>Ready for participant issuance</small></span>
              <span class="attention-count">42 <small>to issue</small></span>
              <span class="attention-arrow" aria-hidden="true">↗</span>
            </button>
            <div class="attention-foot"><span class="attention-pulse"></span> Your team is making great progress</div>
          </div>
        </div>

        <div class="content-grid grid-1-1">
          <div class="panel">
            <div class="panel-head">
              <div><h3>Upcoming assessments</h3><p>Plan ahead for the next few weeks</p></div>
              <button class="btn btn-ghost btn-sm" data-action="schedule">View schedule</button>
            </div>
            <div class="exam-list">
              ${upcoming.map((exam) => `<div class="exam-item"><div class="exam-icon">${esc(exam.title.split(' ').map((word) => word[0]).join('').slice(0, 2))}</div><div class="exam-body"><b>${esc(exam.title)}</b><small>${examDateLabel(exam.date)} · ${examRegistrations(exam.id).length} registered · ${esc(exam.venue)}</small></div>${chip('Registration open','ok')}</div>`).join('') || '<p class="cell-muted">No upcoming open assessments. Create one to get started.</p>'}
            </div>
          </div>

          <div class="panel">
            <div class="panel-head">
              <div><h3>Applications to review</h3><p>Start with the newest submissions</p></div>
              ${chip(`${pending.length} pending`, 'warn')}
            </div>
            <table class="data-table">
              <thead><tr><th>Applicant</th><th>Program</th><th></th></tr></thead>
              <tbody>
                ${pending.slice(0, 4).map((registration) => `<tr><td class="cell-primary">${esc(registration.name)}</td><td class="cell-muted">${esc(getExam(registration.examId)?.title || 'Assessment')}</td><td><div class="row-actions"><button class="btn btn-primary btn-sm" data-action="review">Review</button></div></td></tr>`).join('') || '<tr><td colspan="3">No applications need review.</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      `;
      },

      exams: () => `
        ${pageHeader(
          'Exams',
          'Create, schedule and publish exams for your institution.',
          `<button class="btn btn-ghost btn-sm" data-action="print-report">Print / Save PDF</button>
           <button class="btn btn-primary btn-sm" data-go="create-exam">+ Create exam</button>`
        )}
        <div class="stats-grid">
          ${stat({ label: 'Programs', value: demo.exams.length, delta: 'In your workspace', icon: 'exams' })}
          ${stat({ label: 'Accepting entries', value: demo.exams.filter((exam) => exam.status === 'open').length, delta: 'Shareable registration links', icon: 'schedule', iconClass: 'info' })}
          ${stat({ label: 'Registrations', value: demo.registrations.length, delta: `${demo.registrations.filter((registration) => registration.status === 'submitted').length} to review`, icon: 'registrations' })}
        </div>
        <div class="panel">
          <div class="panel-head"><div><h3>All exams</h3><p>Create a program, open registration and share its demo link.</p></div>
            <label class="inline-filter">Status
              <select data-row-filter="exam-status" aria-label="Filter exams by status">
                <option value="all">All statuses</option><option value="open">Open</option><option value="draft">Draft</option><option value="completed">Completed</option>
              </select>
            </label>
            <label class="inline-filter">From
                <input type="date" data-date-filter="after" aria-label="Show exams from date">
            </label>
            <label class="inline-filter">To
                <input type="date" data-date-filter="before" aria-label="Show exams through date">
            </label>
          </div>
          <table class="data-table">
            <thead><tr><th>Exam</th><th>Entries / seats</th><th>Date & time</th><th>Venue</th><th>Status</th><th>Registration link / actions</th></tr></thead>
            <tbody>
              ${demo.exams.map((exam) => {
                const count = examRegistrations(exam.id).filter((registration) => registration.status !== 'rejected').length;
                const status = exam.status === 'open' ? ['Registration open', 'ok'] : exam.status === 'completed' ? ['Completed', 'neutral'] : ['Draft', 'warn'];
                const link = shareUrl(exam.id);
                return `<tr data-status="${exam.status}" data-date="${exam.date}">
                  <td><div class="cell-primary">${esc(exam.title)}</div><div class="cell-muted">${esc(exam.description)}</div><div class="cell-muted">${exam.questions?.length || 0} reviewer prompt(s)</div></td>
                  <td class="cell-mono">${count} / ${esc(exam.seats)}</td>
                  <td class="cell-muted">${examDateLabel(exam.date)} · ${esc(exam.time)}</td>
                  <td>${esc(exam.venue)}</td>
                  <td>${chip(status[0], status[1])}</td>
                  <td><div class="exam-share">
                    ${exam.status === 'open' ? `<label class="sr-only" for="share-${esc(exam.id)}">Registration link for ${esc(exam.title)}</label><input id="share-${esc(exam.id)}" class="share-link-input" data-share-link value="${esc(link)}" readonly><button class="btn btn-ghost btn-sm" type="button" data-action="copy-link">Copy</button>` : ''}
                    <button class="btn ${exam.status === 'draft' ? 'btn-primary' : 'btn-ghost'} btn-sm" type="button" data-exam-action="${exam.status === 'draft' ? 'publish' : 'share'}" data-exam-id="${esc(exam.id)}">${exam.status === 'draft' ? 'Open registration' : 'Preview link'}</button>
                  </div></td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      `,

      'create-exam': () => `
        ${pageHeader('Create an assessment', 'Set up the details, save it as a draft, then open registration and share its link.',
          `<button class="btn btn-ghost btn-sm" data-go="exams">Back to exams</button>`)}
        <div class="content-grid grid-1-1">
          <div class="panel">
            <div class="panel-head"><div><h3>Assessment setup</h3><p>All details stay in this browser in demo mode.</p></div></div>
            <form class="workflow-form" data-form="create-exam">
              <label class="field field-wide">Assessment name
                <input name="title" maxlength="80" placeholder="e.g. Business Analytics — Level 1" required>
              </label>
              <label class="field">Date
                <input type="date" name="date" min="${new Date().toISOString().slice(0, 10)}" required>
              </label>
              <label class="field">Start time
                <input type="time" name="time" value="10:00" required>
              </label>
              <label class="field">Assessment centre
                <input name="venue" maxlength="60" placeholder="e.g. Mumbai-04" required>
              </label>
              <label class="field">Available seats
                <input type="number" name="seats" min="1" max="50000" value="100" required>
              </label>
              <label class="field">Registration fee (₹)
                <input type="number" name="fee" min="0" max="100000" value="0" required>
              </label>
              <label class="field field-wide">What will candidates assess?
                <textarea name="description" rows="3" maxlength="240" placeholder="Add a short, clear overview of topics and format." required></textarea>
              </label>
              <label class="field field-wide">Candidate preparation materials / instructions
                <textarea name="materials" rows="3" maxlength="600" placeholder="Share allowed materials, session instructions or what candidates should bring."></textarea>
              </label>
              <label class="field field-wide">Reviewer question bank
                <textarea name="questionBank" rows="5" maxlength="2400" placeholder="Add one prompt per line. These prompts are visible to reviewers, not applicants."></textarea>
                <small class="cell-muted">Demo text only. Questions are stored in this browser and shown in the reviewer workspace.</small>
              </label>
              <div class="form-actions"><span class="cell-muted">Create as draft. You can open registration and copy a share link next.</span><button class="btn btn-primary btn-sm" type="submit">Save assessment</button></div>
            </form>
          </div>
          <div class="panel">
            <div class="panel-head"><div><h3>After creating</h3><p>Simple steps to launch your program</p></div></div>
            <div class="task-list">
              <div class="task-row"><span class="task-check">${ICONS.check}</span><span><b>Review the details</b><small>Check date, centre, seats and fee.</small></span></div>
              <div class="task-row"><span class="task-check">${ICONS.exams}</span><span><b>Open registration</b><small>Make the assessment visible to students.</small></span></div>
              <div class="task-row"><span class="task-check">${ICONS.users}</span><span><b>Share the registration link</b><small>Students in this browser can register in demo mode.</small></span></div>
            </div>
            <div class="notice-card"><b>Demo link note</b><p>Links use this browser's saved demo data. They are for preview only and aren't publicly hosted.</p></div>
          </div>
        </div>
      `,

      registrations: () => `
        ${pageHeader(
          'Registrations',
          'Check applicant details, eligibility and demo document names before recording a decision.',
          `<button class="btn btn-ghost btn-sm" data-action="export">${ICONS.download} Export CSV</button>
           <button class="btn btn-ghost btn-sm" data-action="print-report">Print / Save PDF</button>`
        )}
        ${state.reviewRegistrationId && getRegistration(state.reviewRegistrationId) ? (() => {
          const registration = getRegistration(state.reviewRegistrationId);
          const exam = getExam(registration.examId);
          return `<div class="panel review-panel">
            <div class="panel-head"><div><h3>Application review · ${esc(registration.name)}</h3><p>${esc(exam?.title || 'Assessment')} · ${esc(registration.email)}</p></div><button class="btn btn-ghost btn-sm" data-action="close-review">Close review</button></div>
            <div class="review-facts"><div><small>Qualification</small><b>${esc(registration.qualification || 'Not provided')}</b></div><div><small>Eligibility</small><b>${registration.eligible ? (registration.eligibilityVerified ? 'Verified' : 'Declared · review needed') : 'Not eligible'}</b></div><div><small>Documents</small><b>${registration.documentsVerified ? 'Reviewed' : 'Review needed'}</b></div><div><small>Fee status</small><b>${esc(registration.feeStatus)}</b></div></div>
            <div class="notice-card"><b>Demo documents</b><p>${registration.documents?.length ? registration.documents.map(esc).join(' · ') : 'No document name supplied'}. This demo stores filenames only, not uploaded files.</p></div>
            <div class="row-actions review-actions">
              <button class="btn btn-ghost btn-sm" data-registration-action="request-info" data-registration-id="${esc(registration.id)}">Request more information</button>
              ${!registration.eligibilityVerified && registration.eligible ? `<button class="btn btn-ghost btn-sm" data-registration-action="verify-eligibility" data-registration-id="${esc(registration.id)}">Verify eligibility</button>` : ''}
              ${!registration.documentsVerified && registration.documents?.length ? `<button class="btn btn-ghost btn-sm" data-registration-action="verify-documents" data-registration-id="${esc(registration.id)}">Mark documents reviewed</button>` : ''}
              <button class="btn btn-ghost btn-sm" data-registration-action="shortlist" data-registration-id="${esc(registration.id)}">Shortlist</button>
              <button class="btn btn-danger btn-sm" data-registration-action="reject" data-registration-id="${esc(registration.id)}">Decline</button>
              ${registration.feeStatus === 'Pending' ? `<button class="btn btn-ghost btn-sm" data-registration-action="mark-paid" data-registration-id="${esc(registration.id)}">Mark demo fee paid</button>` : ''}
              <button class="btn btn-primary btn-sm" data-registration-action="approve" data-registration-id="${esc(registration.id)}">Approve application</button>
            </div>
          </div>`;
        })() : ''}
        <div class="stats-grid">
          ${stat({ label: 'Pending review', value: demo.registrations.filter((registration) => registration.status === 'submitted' || registration.status === 'needs-info').length, delta: 'Review these applications', iconClass: 'warn', icon: 'clock' })}
          ${stat({ label: 'Approved', value: demo.registrations.filter((registration) => registration.status === 'approved').length, delta: 'Ready for next steps', icon: 'check' })}
          ${stat({ label: 'Rejected', value: demo.registrations.filter((registration) => registration.status === 'rejected').length, delta: 'Decision recorded', iconClass: 'bad', icon: 'alert' })}
        </div>
        <div class="panel">
          <div class="panel-head"><div><h3>Applicant queue</h3><p>Approve applications to unlock exam-day details.</p></div>
            <label class="inline-filter">Status
              <select data-row-filter="registration-status" aria-label="Filter registrations by status">
                <option value="all">All statuses</option><option value="submitted">Pending</option><option value="needs-info">More info needed</option><option value="approved">Approved</option><option value="rejected">Rejected</option>
              </select>
            </label>
            <label class="inline-filter">From
              <input type="date" data-date-filter="after" aria-label="Show applications from assessment date">
            </label>
            <label class="inline-filter">To
              <input type="date" data-date-filter="before" aria-label="Show applications through assessment date">
            </label>
          </div>
          <table class="data-table">
            <thead><tr><th>Candidate</th><th>Assessment</th><th>Eligibility / documents</th><th>Centre</th><th>Fee</th><th>Applied</th><th>Status</th><th>Decision</th></tr></thead>
            <tbody>
              ${demo.registrations.map((registration) => {
                const exam = getExam(registration.examId);
                const kind = registration.status === 'approved' ? 'ok' : registration.status === 'rejected' ? 'bad' : 'warn';
                const label = registration.status === 'submitted' ? (registration.feeStatus === 'Pending' ? 'Fee pending' : 'Pending review') : registration.status === 'needs-info' ? 'More info needed' : registration.status[0].toUpperCase() + registration.status.slice(1);
                return `<tr data-status="${registration.status}" data-date="${exam?.date || ''}">
                  <td><div class="cell-primary">${esc(registration.name)}</div><div class="cell-muted">${esc(registration.email)}</div></td>
                  <td>${esc(exam?.title || 'Assessment removed')}</td>                  <td>${chip(registration.eligibilityVerified ? 'Eligibility verified' : 'Eligibility review', registration.eligibilityVerified ? 'ok' : 'warn')}<div class="cell-muted">${registration.documentsVerified ? 'Documents reviewed' : `${registration.documents?.length || 0} demo file(s) to review`}</div></td><td>${esc(registration.centre)}</td><td>${esc(registration.feeStatus)}</td>
                  <td class="cell-muted">${registration.appliedAt ? new Date(registration.appliedAt).toLocaleDateString() : '—'}</td><td>${chip(label, kind)}</td>
                  <td><div class="row-actions">${registration.status === 'submitted'
                    ? `<button class="btn btn-primary btn-sm" data-review-registration="${esc(registration.id)}">Review</button>` : `<button class="btn btn-ghost btn-sm" data-review-registration="${esc(registration.id)}">View</button>`}
                  </div></td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      `,

      results: () => `
        ${pageHeader('Results', 'Review, moderate and publish exam results.',
          `<button class="btn btn-ghost btn-sm" data-action="export">${ICONS.download} Export CSV</button>
           <button class="btn btn-ghost btn-sm" data-action="print-report">Print / Save PDF</button>
           <button class="btn btn-primary btn-sm" data-action="publish-results">Publish ready results</button>`)}
        <div class="stats-grid">
          ${stat({ label: 'Awaiting marks', value: demo.registrations.filter((registration) => registration.status === 'approved' && registration.score === null).length, delta: 'Teacher evaluation needed', icon: 'scripts' })}
          ${stat({ label: 'Ready to publish', value: demo.registrations.filter((registration) => registration.marksStatus === 'submitted' && !registration.resultPublished).length, delta: 'Submitted for moderation', icon: 'clock', iconClass: 'warn' })}
          ${stat({ label: 'Published', value: demo.registrations.filter((registration) => registration.resultPublished).length, delta: 'Visible to students', icon: 'check' })}
        </div>
        <div class="content-grid grid-3-1">
          <div class="panel">
            <div class="panel-head"><div><h3>Result pipeline</h3><p>Scores move from evaluation to student view.</p></div></div>
            <div class="chart-bars">
              ${chartRow('Marks entered', Math.round(demo.registrations.filter((registration) => registration.score !== null).length / Math.max(1, demo.registrations.filter((registration) => registration.status === 'approved').length) * 100))}
              ${chartRow('Awaiting publication', Math.round(demo.registrations.filter((registration) => registration.marksStatus === 'submitted' && !registration.resultPublished).length / Math.max(1, demo.registrations.filter((registration) => registration.score !== null).length) * 100), 'amber')}
              ${chartRow('Published', Math.round(demo.registrations.filter((registration) => registration.resultPublished).length / Math.max(1, demo.registrations.filter((registration) => registration.score !== null).length) * 100))}
            </div>
            <table class="data-table" style="margin-top:16px">
              <thead><tr><th>Candidate</th><th>Assessment</th><th>Score</th><th>Reviewer recommendation &amp; feedback</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                ${demo.registrations.filter((registration) => registration.score !== null).map((registration) => {
                  const exam = getExam(registration.examId);
                  return `<tr data-status="${registration.resultPublished ? 'published' : 'ready'}">
                    <td class="cell-primary">${esc(registration.name)}</td><td>${esc(exam?.title || 'Assessment removed')}</td>
                    <td class="cell-mono">${registration.score} / 100</td>
                    <td>${esc((registration.recommendation || 'pending').replace('-', ' '))}<div class="cell-muted">${esc(registration.reviewerFeedback || 'No feedback provided')}</div></td>
                    <td>${chip(registration.resultPublished ? 'Published' : registration.marksStatus === 'submitted' ? 'Ready to publish' : 'Draft', registration.resultPublished ? 'ok' : registration.marksStatus === 'submitted' ? 'warn' : 'neutral')}</td>
                    <td>${registration.resultPublished ? '—' : registration.marksStatus === 'submitted' ? `<button class="btn btn-primary btn-sm" data-registration-action="publish-result" data-registration-id="${esc(registration.id)}">Publish</button>` : 'Awaiting teacher'}</td>
                  </tr>`;
                }).join('') || '<tr><td colspan="6">Teacher-submitted marks will appear here for moderation.</td></tr>'}
              </tbody>
            </table>
          </div>
          <div class="panel">
            <div class="panel-head"><h3>Pass / fail — BE Level 2</h3></div>
            <div class="donut-wrap">
              <div class="donut" style="background:conic-gradient(var(--accent) 0 ${Math.round(demo.registrations.filter((registration) => registration.score !== null && registration.score >= 40).length / Math.max(1, demo.registrations.filter((registration) => registration.score !== null).length) * 100)}%, #f59e0b ${Math.round(demo.registrations.filter((registration) => registration.score !== null && registration.score >= 40).length / Math.max(1, demo.registrations.filter((registration) => registration.score !== null).length) * 100)}% 100%)">
                <div class="donut-center"><b>${demo.registrations.filter((registration) => registration.score !== null && registration.score >= 40).length}</b><small>Pass</small></div>
              </div>
              <div class="donut-legend">
                <div class="donut-legend-item"><i style="background:var(--accent)"></i><span>Passed</span><b>${demo.registrations.filter((registration) => registration.score !== null && registration.score >= 40).length}</b></div>
                <div class="donut-legend-item"><i style="background:#f59e0b"></i><span>Needs review</span><b>${demo.registrations.filter((registration) => registration.score !== null && registration.score < 40).length}</b></div>
              </div>
            </div>
            <div class="activity-feed" style="margin-top:18px">
              ${activity('check','','<b>12</b> re-evaluation requests approved','10 min ago')}
              ${activity('alert','warn','<b>3</b> scripts flagged for anomalies','1 hr ago')}
            </div>
          </div>
        </div>
      `,

      certificates: () => `
        ${pageHeader('Certificates', 'Issue and verify candidate certificates.',
          `<button class="btn btn-primary btn-sm" data-action="issue">Issue certificates</button>`)}
        <div class="stats-grid">
          ${stat({ label: 'Issued', value: '1,847', delta: '92% of eligible', icon: 'cert' })}
          ${stat({ label: 'Queued', value: '142', delta: 'auto-issue at 6 PM', icon: 'clock', iconClass: 'warn' })}
          ${stat({ label: 'Verified by third parties', value: '3,204', delta: 'QR scans', icon: 'check' })}
        </div>
        <div class="panel">
          <table class="data-table">
            <thead><tr><th>Candidate</th><th>Exam</th><th>Issued</th><th>Status</th></tr></thead>
            <tbody>
              ${[
                ['A. Sharma','BE Level 2','Mar 12','ok','Verified'],
                ['M. Khan','Data Science L1','Mar 12','ok','Verified'],
                ['S. Nair','BE Level 2','—','warn','Queued'],
                ['R. Iyer','Cloud Foundations','—','neutral','Not eligible'],
              ].map(([n,e,d,k,l]) => `
                <tr>
                  <td class="cell-primary">${esc(n)}</td>
                  <td>${esc(e)}</td>
                  <td class="cell-muted">${esc(d)}</td>
                  <td>${chip(l,k)}</td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      `,

      staff: () => `
        ${pageHeader('Staff', 'Manage evaluators, invigilators and coordinators.',
          `<button class="btn btn-primary btn-sm" data-action="invite">+ Invite staff</button>`)}
        <div class="panel">
          <table class="data-table">
            <thead><tr><th>Name</th><th>Role</th><th>Assigned exams</th><th>Scripts</th><th>Status</th></tr></thead>
            <tbody>
              ${[
                ['Rajan Krishnan','RK','Senior Evaluator','4','142','ok','Active'],
                ['Neha Bansal','NB','Evaluator','2','84','ok','Active'],
                ['Vikram Sethi','VS','Invigilator','6','—','ok','Active'],
                ['Anjali Rao','AR','Coordinator','8','—','warn','On leave'],
              ].map(([n,i,r,e,s,k,l]) => `
                <tr>
                  <td><div class="avatar-cell"><span class="avatar-sm">${i}</span><div><div class="cell-primary">${esc(n)}</div></div></div></td>
                  <td>${esc(r)}</td>
                  <td class="cell-mono">${esc(e)}</td>
                  <td class="cell-mono">${esc(s)}</td>
                  <td>${chip(l,k)}</td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      `,

      settings: () => `
        ${pageHeader('Settings', 'Configure your institution preferences.')}
        <div class="content-grid grid-1-1">
          <div class="panel">
            <div class="panel-head"><h3>Grading rules</h3></div>
            <div class="chart-bars">
              ${chartRow('Pass mark', 40)}
              ${chartRow('Distinction threshold', 75)}
              ${chartRow('Grace marks cap', 5, 'amber')}
            </div>
            <p class="cell-muted" style="margin-top:14px">These rules apply to new exams by default.</p>
            <button class="btn btn-ghost btn-sm" style="margin-top:14px" data-action="edit">Edit rules</button>
          </div>
          <div class="panel">
            <div class="panel-head"><h3>Notifications</h3></div>
            <div class="activity-feed">
              ${activity('bell','','Email on new registration','Enabled')}
              ${activity('bell','','SMS on result publish','Enabled')}
              ${activity('bell','warn','Weekly digest to admins','Disabled')}
            </div>
          </div>
        </div>
      `,

      reports: () => `
        ${pageHeader('Reports & analytics', 'Track participation, completion and outcomes across your programs.',
          `<button class="btn btn-ghost btn-sm" data-action="export">${ICONS.download} Export CSV</button>
           <button class="btn btn-ghost btn-sm" data-action="print-report">Print / Save PDF</button>`)}
        <div class="stats-grid">
          ${stat({ label: 'Applications this cycle', value: demo.registrations.length, delta: `${demo.registrations.filter((registration) => registration.status === 'submitted').length} to review`, icon: 'registrations' })}
          ${stat({ label: 'Assessment completion', value: `${Math.round(demo.registrations.filter((registration) => registration.score !== null).length / Math.max(1, demo.registrations.filter((registration) => registration.status === 'approved').length) * 100)}`, sub: '%', delta: `${demo.registrations.filter((registration) => registration.score === null && registration.status === 'approved').length} marks pending`, icon: 'check' })}
          ${stat({ label: 'Average published score', value: demo.registrations.filter((registration) => registration.resultPublished).length ? Math.round(demo.registrations.filter((registration) => registration.resultPublished).reduce((sum, registration) => sum + registration.score, 0) / demo.registrations.filter((registration) => registration.resultPublished).length) : '—', sub: demo.registrations.some((registration) => registration.resultPublished) ? '%' : '', delta: 'Based on released results', icon: 'results' })}
          ${stat({ label: 'Results published', value: demo.registrations.filter((registration) => registration.resultPublished).length, delta: `${demo.registrations.filter((registration) => registration.marksStatus === 'submitted' && !registration.resultPublished).length} ready to release`, icon: 'cert' })}
        </div>
        <div class="content-grid grid-1-1">
          <div class="panel">
            <div class="panel-head"><div><h3>Program performance</h3><p>Completion and outcomes at a glance</p></div></div>
            <div class="chart-bars">
              ${demo.exams.slice(0, 5).map((exam) => {
                const entries = examRegistrations(exam.id).filter((registration) => registration.status === 'approved');
                const pct = Math.round(entries.filter((registration) => registration.score !== null).length / Math.max(1, entries.length) * 100);
                return chartRow(exam.title, pct, pct < 50 ? 'red' : pct < 75 ? 'amber' : '');
              }).join('')}
            </div>
            <table class="data-table compact-table" style="margin-top:16px">
              <thead><tr><th>Program</th><th>Applications</th><th>Completion</th><th>Pass rate</th></tr></thead>
              <tbody>
                ${demo.exams.map((exam) => {
                  const entries = examRegistrations(exam.id).filter((registration) => registration.status === 'approved');
                  const scored = entries.filter((registration) => registration.score !== null);
                  const passed = scored.filter((registration) => registration.score >= 40);
                  return `<tr><td class="cell-primary">${esc(exam.title)}</td><td>${examRegistrations(exam.id).length}</td><td>${Math.round(scored.length / Math.max(1, entries.length) * 100)}%</td><td>${scored.length ? Math.round(passed.length / scored.length * 100) : '—'}</td></tr>`;
                }).join('')}
              </tbody>
            </table>
          </div>
          <div class="panel">
            <div class="panel-head"><div><h3>Recommended follow-ups</h3><p>Keep this cycle moving</p></div></div>
            <div class="task-list">
              <button class="task-row" type="button" data-go="registrations"><span class="task-check">${ICONS.registrations}</span><span><b>Review pending applications</b><small>${demo.registrations.filter((registration) => registration.status === 'submitted').length} applications need a decision</small></span><span class="task-arrow">Open</span></button>
              <button class="task-row" type="button" data-go="results"><span class="task-check">${ICONS.results}</span><span><b>Complete result review</b><small>${demo.registrations.filter((registration) => registration.marksStatus === 'submitted' && !registration.resultPublished).length} results are ready to publish</small></span><span class="task-arrow">Open</span></button>
              <button class="task-row" type="button" data-go="staff"><span class="task-check">${ICONS.staff}</span><span><b>Check evaluator coverage</b><small>Review assignments and availability</small></span><span class="task-arrow">Open</span></button>
            </div>
          </div>
        </div>
      `,

      communications: () => `
        ${pageHeader('Communications', 'Send clear updates to candidates and staff from one workspace.')}
        <div class="content-grid grid-1-1">
          <div class="panel">
            <div class="panel-head"><div><h3>Compose an update</h3><p>Preview and send a demo announcement to a selected group.</p></div></div>
            <form class="workflow-form" data-form="announcement">
              <label class="field">Audience
                <select name="audience" required>
                  <option value="all candidates">All candidates</option>
                  <option value="BE Level 2 candidates">BE Level 2 candidates</option>
                  <option value="teaching staff">Teaching staff</option>
                  <option value="program coordinators">Program coordinators</option>
                </select>
              </label>
              <label class="field">Channel
                <select name="channel" required>
                  <option value="Email">Email</option>
                  <option value="Dashboard notification">Dashboard notification</option>
                  <option value="Email and dashboard">Email and dashboard</option>
                </select>
              </label>
              <label class="field field-wide">Announcement
                <textarea name="message" rows="4" maxlength="400" placeholder="Share a schedule update, reminder or important next step…" required></textarea>
              </label>
              <div class="form-actions"><span class="cell-muted">Saved locally for this browser; nothing is sent.</span><button class="btn btn-primary btn-sm" type="submit">Save announcement</button></div>
            </form>
          </div>
          <div class="panel">
            <div class="panel-head"><div><h3>Recent updates</h3><p>Latest communication activity</p></div></div>
            <div class="activity-feed">
              ${demo.announcements.slice().reverse().slice(0, 3).map((announcement) => activity('bell','',`<b>${esc(announcement.audience)}</b> · ${esc(announcement.message)}`,new Date(announcement.createdAt).toLocaleString())).join('')}
              ${activity('bell','','<b>Cloud Foundations</b> · admit cards are ready','Today · 9:15 AM')}
              ${activity('schedule','','<b>BE Level 2</b> · centre schedule confirmed','Yesterday · 4:30 PM')}
              ${activity('results','','<b>Data Science L1</b> · results published','Recently')}
              ${activity('staff','','<b>Evaluator team</b> · moderation reminder','Recently')}
            </div>
          </div>
        </div>
      `,

      schedule: () => {
        const events = demo.scheduleEvents.slice().sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
        return `
        ${pageHeader('Schedule & reminders', 'Plan interviews, evaluations and deadlines; linked participants see the same local demo schedule.',
          `<button class="btn btn-ghost btn-sm" data-action="export">${ICONS.download} Export schedule</button>`)}
        <div class="content-grid grid-1-1">
          <div class="panel">
            <div class="panel-head"><div><h3>Add a schedule item</h3><p>Choose an assessment or participant to share a reminder in this browser.</p></div></div>
            <form class="workflow-form" data-form="schedule-event">
              <label class="field">Event type
                <select name="type" required><option>Assessment</option><option>Interview</option><option>Evaluation deadline</option><option>Document follow-up</option><option>Review meeting</option></select>
              </label>
              <label class="field">Title<input name="title" maxlength="90" placeholder="e.g. Candidate interview" required></label>
              <label class="field">Date<input type="date" name="date" min="${new Date().toISOString().slice(0, 10)}" required></label>
              <label class="field">Time<input type="time" name="time" required></label>
              <label class="field">Location / meeting details<input name="location" maxlength="100" placeholder="Centre or room" required></label>
              <label class="field">Assessment
                <select name="examId"><option value="">All / not linked</option>${demo.exams.map((exam) => `<option value="${esc(exam.id)}">${esc(exam.title)}</option>`).join('')}</select>
              </label>
              <label class="field">Participant (optional)
                <select name="registrationId"><option value="">All applicants</option>${demo.registrations.map((registration) => `<option value="${esc(registration.id)}">${esc(registration.name)} · ${esc(getExam(registration.examId)?.title || '')}</option>`).join('')}</select>
              </label>
              <label class="checklist-item field-wide"><input type="checkbox" name="reminder" checked><span><b>Show as a reminder</b><small>Display this item in the linked student and teacher schedule.</small></span></label>
              <div class="form-actions"><span class="cell-muted">Demo only: no email, calendar invite or push notification is sent.</span><button class="btn btn-primary btn-sm" type="submit">Save schedule item</button></div>
            </form>
          </div>
          <div class="panel">
            <div class="panel-head"><div><h3>Upcoming items</h3><p>${events.length} locally saved schedule item(s)</p></div></div>
            <table class="data-table"><thead><tr><th>When</th><th>Event</th><th>For</th><th>Reminder</th><th></th></tr></thead><tbody>
              ${events.map((event) => {
                const registration = demo.registrations.find((item) => item.id === event.registrationId);
                return `<tr><td class="cell-mono">${examDateLabel(event.date)}<div class="cell-muted">${esc(event.time)}</div></td><td><b>${esc(event.title)}</b><div class="cell-muted">${esc(event.location)}</div></td><td>${esc(registration?.name || getExam(event.examId)?.title || 'All participants')}</td><td>${chip(event.reminder ? 'On' : 'Off', event.reminder ? 'ok' : 'neutral')}</td><td><button class="btn btn-danger btn-sm" data-delete-schedule="${esc(event.id)}">Remove</button></td></tr>`;
              }).join('') || '<tr><td colspan="5">No extra schedule items yet. Assessment dates still appear in participant schedules.</td></tr>'}
            </tbody></table>
          </div>
        </div>`;
      },

      'support-requests': () => `
        ${pageHeader('Support inbox', 'Review participant requests and record a demo response or resolution.')}
        <div class="stats-grid">
          ${stat({ label: 'Open requests', value: demo.supportRequests.filter((request) => request.status !== 'resolved').length, delta: 'Needs coordinator attention', icon: 'bell', iconClass: 'warn' })}
          ${stat({ label: 'Resolved', value: demo.supportRequests.filter((request) => request.status === 'resolved').length, delta: 'Recorded in this browser', icon: 'check' })}
        </div>
        <div class="panel"><div class="panel-head"><div><h3>Participant requests</h3><p>Responses are visible in the participant's support area on this device.</p></div></div>
          <div class="support-queue">${demo.supportRequests.slice().reverse().map((request) => `
            <article class="support-item">
              <div class="panel-head"><div><h3>${esc(request.topic)}</h3><p>${esc(request.email)} · ${new Date(request.createdAt).toLocaleString()}</p></div>${chip(request.status === 'resolved' ? 'Resolved' : 'Open', request.status === 'resolved' ? 'ok' : 'warn')}</div>
              <p>${esc(request.details)}</p>
              ${request.reply ? `<div class="notice-card"><b>Coordinator response</b><p>${esc(request.reply)}</p></div>` : ''}
              <form class="workflow-form" data-form="support-response" data-request-id="${esc(request.id)}">
                <label class="field field-wide">Reply / next step<textarea name="reply" rows="2" maxlength="400" required>${esc(request.reply || '')}</textarea></label>
                <div class="form-actions"><button class="btn btn-primary btn-sm" type="submit">${request.status === 'resolved' ? 'Update response' : 'Save response & resolve'}</button></div>
              </form>
            </article>
          `).join('') || '<div class="empty-state"><b>No support requests yet</b><p>Requests submitted from the participant support panel appear here.</p></div>'}</div>
        </div>
      `,
    },

    /* ================= TEACHER ================= */
    teacher: {
      overview: () => {
        const scripts = demo.registrations.filter((registration) => registration.status === 'approved');
        const pendingScripts = scripts.filter((registration) => registration.score === null);
        const completedScripts = scripts.length - pendingScripts.length;
        const dueDate = new Date(Date.now() + 3 * 86400000).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
        return `
        ${pageHeader(
          'Evaluator workspace',
          'Your assigned scripts, schedule and marks entry — all in one place.',
          `<button class="btn btn-ghost btn-sm" data-go="schedule">${ICONS.schedule} Schedule</button>
           <button class="btn btn-primary btn-sm" data-action="enter-marks">Enter marks</button>`
        )}

        <div class="highlight-banner">
          <div class="hb-ico">${ICONS.clock}</div>
          <div class="hb-text">
            <b>${pendingScripts.length} candidate script${pendingScripts.length === 1 ? '' : 's'} are waiting for evaluation</b>
            <small>Complete marks entry by ${dueDate} · Save drafts as you go.</small>
          </div>
          <button class="btn btn-primary btn-sm" data-action="start-eval">Start evaluating</button>
        </div>

        <div class="stats-grid">
          ${stat({ label: 'Assigned scripts', value: scripts.length, delta: 'Approved applications', icon: 'scripts' })}
          ${stat({ label: 'Marks entered', value: completedScripts, sub: `/${scripts.length}`, delta: 'Saved in this browser', icon: 'check' })}
          ${stat({ label: 'Pending', value: pendingScripts.length, delta: `Suggested by ${dueDate}`, iconClass: 'warn', icon: 'clock' })}
          ${stat({ label: 'Ready to moderate', value: scripts.filter((registration) => registration.marksStatus === 'submitted').length, delta: 'Submitted marks', icon: 'marks' })}
        </div>

        <div class="content-grid grid-3-1">
          <div class="panel">
            <div class="panel-head"><h3>Pending scripts</h3><button class="btn btn-ghost btn-sm" data-go="scripts">View all</button></div>
            <table class="data-table">
              <thead><tr><th>Candidate</th><th>Assessment</th><th>Status</th><th>Score</th><th></th></tr></thead>
              <tbody>
                ${scripts.slice(0, 5).map((registration) => `<tr>
                  <td class="cell-primary">${esc(registration.name)}</td><td>${esc(getExam(registration.examId)?.title || 'Assessment')}</td>
                  <td>${chip(registration.marksStatus === 'published' ? 'Published' : registration.marksStatus === 'submitted' ? 'Submitted' : registration.score === null ? 'Pending' : 'Draft saved', registration.marksStatus === 'published' || registration.marksStatus === 'submitted' ? 'ok' : registration.score === null ? 'warn' : 'neutral')}</td>
                  <td class="cell-mono">${registration.score === null ? '—' : `${registration.score} / 100`}</td>
                  <td><div class="row-actions"><button class="btn btn-primary btn-sm" data-select-candidate="${esc(registration.id)}">Evaluate</button></div></td>
                </tr>`).join('') || '<tr><td colspan="5">Approve applications to add candidates to your evaluation queue.</td></tr>'}
              </tbody>
            </table>
          </div>

          <div class="panel">
            <div class="panel-head"><h3>Today's schedule</h3></div>
            <div class="activity-feed">
              ${activity('schedule','','<b>09:00–11:00</b> · BE L2 · Section A evaluation','In 2 hrs')}
              ${activity('schedule','warn','<b>14:00–16:00</b> · Moderation meeting','Today')}
              ${activity('schedule','','<b>16:30–18:00</b> · Data Sci L1 · Section B','Today')}
              ${activity('schedule','','<b>10:00–12:00</b> · BE L2 · Section A continuation','Tomorrow')}
            </div>
          </div>
        </div>
      `;
      },

      scripts: () => {
        const scripts = demo.registrations.filter((registration) => registration.status === 'approved');
        const completed = scripts.filter((registration) => registration.score !== null).length;
        return `
        ${pageHeader('My scripts', 'Evaluate approved candidate work and submit marks for moderation.',
          `<button class="btn btn-ghost btn-sm" data-action="focus-search">Search scripts</button>
           <button class="btn btn-primary btn-sm" data-go="marks">Open marks entry</button>`)}
        <div class="stats-grid">
          ${stat({ label: 'Assigned scripts', value: scripts.length, delta: 'Approved registrations', icon: 'scripts' })}
          ${stat({ label: 'Marks entered', value: completed, sub: `/${scripts.length}`, delta: 'Saved in this demo', icon: 'check' })}
          ${stat({ label: 'Pending evaluation', value: scripts.length - completed, delta: 'Open a script to continue', iconClass: 'warn', icon: 'clock' })}
        </div>
        <div class="panel">
          <table class="data-table">
            <thead><tr><th>Candidate</th><th>Assessment</th><th>Centre</th><th>Status</th><th>Score</th><th></th></tr></thead>
            <tbody>
              ${scripts.map((registration) => `<tr data-status="${registration.score === null ? 'pending' : registration.marksStatus || 'saved'}" data-searchable="${esc(`${registration.name} ${getExam(registration.examId)?.title || ''}`.toLowerCase())}">
                <td class="cell-primary">${esc(registration.name)}</td><td>${esc(getExam(registration.examId)?.title || 'Assessment')}</td><td>${esc(registration.centre)}</td>
                <td>${chip(registration.marksStatus === 'published' ? 'Published' : registration.marksStatus === 'submitted' ? 'Submitted for moderation' : registration.score === null ? 'Pending evaluation' : 'Draft saved', registration.marksStatus === 'published' || registration.marksStatus === 'submitted' ? 'ok' : registration.score === null ? 'warn' : 'neutral')}</td>
                <td class="cell-mono">${registration.score === null ? '—' : `${registration.score} / 100`}</td>
                <td><button class="btn btn-primary btn-sm" data-select-candidate="${esc(registration.id)}">Evaluate</button></td>
              </tr>`).join('') || '<tr><td colspan="6">No approved registrations are ready for evaluation.</td></tr>'}
            </tbody>
          </table>
        </div>
      `;
      },

      marks: () => {
        const candidates = demo.registrations.filter((registration) => registration.status === 'approved');
        const selected = candidates.find((registration) => registration.id === state.selectedRegistrationId) || candidates[0];
        if (selected) state.selectedRegistrationId = selected.id;
        const parts = selected?.parts?.length === 5 ? selected.parts : [0, 0, 0, 0, 0];
        const status = !selected ? 'No approved candidates' : selected.marksStatus === 'published' ? 'Published' : selected.score === null ? 'Not started' : selected.marksStatus === 'submitted' ? 'Submitted for moderation' : 'Draft saved';
        const kind = status === 'Submitted for moderation' || status === 'Published' ? 'ok' : 'warn';
        return `
        ${pageHeader('Marks entry', 'Select an approved candidate, enter marks and submit them for moderation.',
          `<button class="btn btn-ghost btn-sm" type="button" data-action="save-marks" ${selected ? '' : 'disabled'}>Save draft</button>
           <button class="btn btn-primary btn-sm" type="submit" form="marksEntryForm" ${selected ? '' : 'disabled'}>Submit for moderation</button>`)}
        <div class="content-grid grid-1-1">
          <div class="panel">
            <div class="panel-head">
              <div><h3>${esc(selected?.name || 'No candidate available')}</h3><p>${esc(getExam(selected?.examId)?.title || 'Approve a registration to begin evaluation.')}</p></div>
              <span data-mark-status>${chip(status, kind)}</span>
            </div>
            ${getExam(selected?.examId)?.questions?.length ? `<div class="notice-card"><b>Reviewer question bank</b><ol>${getExam(selected.examId).questions.map((question) => `<li>${esc(question)}</li>`).join('')}</ol></div>` : ''}
            ${selected?.answers?.length ? `<div class="notice-card"><b>Participant responses</b><ol>${selected.answers.map((answer) => `<li>${esc(answer)}</li>`).join('')}</ol></div>` : ''}
            <label class="field marks-candidate">Candidate
              <select data-candidate-select aria-label="Select candidate" ${selected ? '' : 'disabled'}>
                ${candidates.map((registration) => `<option value="${esc(registration.id)}" ${registration.id === selected?.id ? 'selected' : ''}>${esc(registration.name)} · ${esc(getExam(registration.examId)?.title || '')}${registration.score !== null ? ' · marks entered' : ''}</option>`).join('')}
              </select>
            </label>
            <form id="marksEntryForm" class="workflow-form marks-form" data-form="marks" ${selected ? '' : 'hidden'}>
              ${[['Q1 · Core concepts'],['Q2 · Application'],['Q3 · Problem solving'],['Q4 · Analysis'],['Q5 · Communication']].map(([label],index) => `
                <label class="mark-row"><span><b>${label}</b><small>Maximum 20 marks</small></span><input type="number" name="q${index + 1}" min="0" max="20" value="${parts[index]}" required aria-label="${label} marks"></label>
              `).join('')}
              <label class="field">Reviewer recommendation
                <select name="recommendation">
                  <option value="review" ${selected?.recommendation === 'review' ? 'selected' : ''}>Further review</option>
                  <option value="shortlist" ${selected?.recommendation === 'shortlist' ? 'selected' : ''}>Recommend shortlist</option>
                  <option value="not-selected" ${selected?.recommendation === 'not-selected' ? 'selected' : ''}>Do not shortlist</option>
                </select>
              </label>
              <label class="field">Feedback for applicant
                <textarea name="reviewerFeedback" rows="3" maxlength="400" placeholder="Share helpful, respectful feedback…">${esc(selected?.reviewerFeedback || '')}</textarea>
              </label>
              <div class="mark-total"><span>Total score</span><strong><span data-score-total>${selected?.score ?? 0}</span><small> / 100</small></strong></div>
              <p class="cell-muted field-wide">Apply the same five 20-point criteria to every candidate. Marks, recommendation and feedback stay in this browser.</p>
            </form>
          </div>
          <div class="panel">
            <div class="panel-head"><div><h3>Evaluation queue</h3><p>Approved applications ready for marking</p></div></div>
            <div class="task-list">${candidates.map((registration) => `
              <button class="task-row" type="button" data-select-candidate="${esc(registration.id)}">
                <span class="task-check">${registration.score !== null ? ICONS.check : ICONS.clock}</span>
                <span><b>${esc(registration.name)}</b><small>${esc(getExam(registration.examId)?.title || '')}</small></span>
                <span class="task-arrow">${registration.score === null ? 'Start' : `${registration.score}/100`}</span>
              </button>`).join('') || '<p class="cell-muted">No approved applications yet. Approve an application first.</p>'}
            </div>
          </div>
        </div>
      `;
      },

      schedule: () => `
        ${pageHeader('Schedule', 'Upcoming exam sessions, interviews, evaluation deadlines and coordinator reminders.')}
        <div class="panel">
          <div class="panel-head"><h3>Shared schedule</h3><p>Items saved by the coordinator in this browser</p></div>
          <table class="data-table">
            <thead><tr><th>When</th><th>Event</th><th>Assessment / location</th><th>Status</th></tr></thead>
            <tbody>
              ${demo.scheduleEvents.slice().sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)).map((event) => `<tr data-date="${esc(event.date)}"><td class="cell-mono">${examDateLabel(event.date)} · ${esc(event.time)}</td><td class="cell-primary">${esc(event.type)} · ${esc(event.title)}</td><td class="cell-muted">${esc(getExam(event.examId)?.title || 'All programs')} · ${esc(event.location)}</td><td>${chip(event.reminder ? 'Reminder set' : 'Scheduled', event.reminder ? 'warn' : 'neutral')}</td></tr>`).join('')}
              ${!demo.scheduleEvents.length ? '<tr><td colspan="4">No shared items yet. The coordinator can add events in the Admin → Schedule panel.</td></tr>' : ''}
            </tbody>
          </table>
        </div>
      `,

      students: () => `
        ${pageHeader('Students', 'Candidates with approved applications, current evaluations and selection recommendations.')}
        <div class="panel">
          <table class="data-table">
            <thead><tr><th>Candidate</th><th>Assessment</th><th>Evaluation</th><th>Recommendation</th><th>Feedback</th></tr></thead>
            <tbody>
              ${demo.registrations.filter((registration) => registration.status === 'approved').map((registration) => `
                <tr><td class="cell-primary">${esc(registration.name)}</td><td class="cell-muted">${esc(getExam(registration.examId)?.title || 'Assessment')}</td>
                <td>${chip(registration.marksStatus === 'published' ? 'Published' : registration.marksStatus === 'submitted' ? 'Submitted' : registration.score === null ? 'Awaiting evaluation' : 'Draft', registration.marksStatus === 'published' || registration.marksStatus === 'submitted' ? 'ok' : registration.score === null ? 'warn' : 'neutral')}</td>
                <td>${esc((registration.recommendation || 'pending').replace('-', ' '))}</td><td>${esc(registration.reviewerFeedback || '—')}</td></tr>
              `).join('') || '<tr><td colspan="5">Approved applications will appear here for evaluation.</td></tr>'}
            </tbody>
          </table>
        </div>
      `,

      insights: () => `
        ${pageHeader('Class insights', 'Understand progress and workload across your assigned groups.',
          `<button class="btn btn-ghost btn-sm" data-action="export">${ICONS.download} Export roster</button>`)}
        <div class="stats-grid">
          ${stat({ label: 'Students assigned', value: demo.registrations.filter((registration) => registration.status === 'approved').length, delta: `Across ${new Set(demo.registrations.filter((registration) => registration.status === 'approved').map((registration) => registration.examId)).size} assessments`, icon: 'students' })}
          ${stat({ label: 'Evaluation complete', value: Math.round(demo.registrations.filter((registration) => registration.status === 'approved' && registration.score !== null).length / Math.max(1, demo.registrations.filter((registration) => registration.status === 'approved').length) * 100), sub: '%', delta: `${demo.registrations.filter((registration) => registration.status === 'approved' && registration.score === null).length} scripts pending`, icon: 'check' })}
          ${stat({ label: 'Average submitted score', value: demo.registrations.filter((registration) => registration.score !== null).length ? Math.round(demo.registrations.filter((registration) => registration.score !== null).reduce((sum, registration) => sum + registration.score, 0) / demo.registrations.filter((registration) => registration.score !== null).length) : '—', sub: '/100', delta: 'Across entered marks', icon: 'results' })}
          ${stat({ label: 'Need follow-up', value: demo.registrations.filter((registration) => registration.status === 'submitted').length, delta: 'Applications awaiting review', icon: 'alert', iconClass: 'warn' })}
        </div>
        <div class="content-grid grid-1-1">
          <div class="panel">
            <div class="panel-head"><div><h3>Evaluation progress</h3><p>Assigned work by group</p></div></div>
            <div class="chart-bars">
              ${demo.exams.slice(0, 4).map((exam) => {
                const entries = examRegistrations(exam.id).filter((registration) => registration.status === 'approved');
                return chartRow(exam.title, Math.round(entries.filter((registration) => registration.score !== null).length / Math.max(1, entries.length) * 100));
              }).join('')}
            </div>
          </div>
          <div class="panel">
            <div class="panel-head"><div><h3>Next actions</h3><p>Small steps to keep learners on track</p></div></div>
            <div class="task-list">
              <button class="task-row" type="button" data-go="scripts"><span class="task-check">${ICONS.scripts}</span><span><b>Finish pending evaluations</b><small>${demo.registrations.filter((registration) => registration.status === 'approved' && registration.score === null).length} scripts need marks</small></span><span class="task-arrow">Open</span></button>
              <button class="task-row" type="button" data-go="students"><span class="task-check">${ICONS.students}</span><span><b>Check in with learners</b><small>7 students need a follow-up</small></span><span class="task-arrow">Open</span></button>
              <button class="task-row" type="button" data-go="schedule"><span class="task-check">${ICONS.schedule}</span><span><b>Prepare for moderation</b><small>Next session · Today at 2:00 PM</small></span><span class="task-arrow">Open</span></button>
            </div>
          </div>
        </div>
        <div class="panel">
          <div class="panel-head"><div><h3>Group workload</h3><p>Use this snapshot to plan evaluation time</p></div></div>
          <table class="data-table compact-table">
            <thead><tr><th>Group</th><th>Assigned</th><th>Pending</th><th>Average score</th><th>Next deadline</th></tr></thead>
            <tbody>
              ${demo.exams.slice(0, 4).map((exam) => {
                const entries = examRegistrations(exam.id).filter((registration) => registration.status === 'approved');
                const scored = entries.filter((registration) => registration.score !== null);
                const average = scored.length ? Math.round(scored.reduce((sum, registration) => sum + registration.score, 0) / scored.length) : '—';
                return `<tr><td class="cell-primary">${esc(exam.title)}</td><td>${entries.length}</td><td>${entries.length - scored.length}</td><td>${average} / 100</td><td>${examDateLabel(exam.date)}</td></tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      `,
    },

    /* ================= STUDENT ================= */
    student: {
      overview: () => {
        const registrations = studentRegistrations();
        const published = registrations.filter((registration) => registration.resultPublished && registration.score !== null);
        const average = published.length ? (published.reduce((sum, registration) => sum + registration.score, 0) / published.length).toFixed(1) : '—';
        const upcoming = registrations
          .filter((registration) => registration.status === 'approved' && getExam(registration.examId)?.date >= new Date().toISOString().slice(0, 10))
          .sort((a, b) => getExam(a.examId).date.localeCompare(getExam(b.examId).date))[0];
        const upcomingExam = upcoming && getExam(upcoming.examId);
        return `
        ${pageHeader(
          `Hi ${studentName().split(' ')[0]} 👋`,
          'Here is where you stand today.',
          `<button class="btn btn-ghost btn-sm" data-action="download-admit">${ICONS.download} Admit card</button>
           <button class="btn btn-primary btn-sm" data-go="catalog">Find an assessment</button>`
        )}

        <div class="stats-grid">
          ${stat({ label: 'My registrations', value: registrations.length, delta: `${registrations.filter((registration) => registration.status === 'submitted').length} awaiting review`, icon: 'exam' })}
          ${stat({ label: 'Upcoming assessments', value: registrations.filter((registration) => registration.status === 'approved' && getExam(registration.examId)?.date >= new Date().toISOString().slice(0, 10)).length, icon: 'check' })}
          ${stat({ label: 'Average published score', value: average, sub: average === '—' ? '' : '%', icon: 'results' })}
          ${stat({ label: 'Certificates ready', value: registrations.filter((registration) => registration.resultPublished && registration.score >= 40).length, delta: 'From passing results', icon: 'cert' })}
        </div>

        <div class="highlight-banner">
          <div class="hb-ico">${upcomingExam ? ICONS.clock : ICONS.exams}</div>
          <div class="hb-text">
            <b>${upcomingExam ? `${esc(upcomingExam.title)} is coming up` : 'Explore open assessments'}</b>
            <small>${upcomingExam ? `${examDateLabel(upcomingExam.date)} · ${esc(upcomingExam.time)} · ${esc(upcoming.centre)} · Admit card ready` : 'Find a program and submit a demo registration.'}</small>
          </div>
          <button class="btn btn-primary btn-sm" ${upcoming ? `data-admit-registration="${esc(upcoming.id)}"` : 'data-go="catalog"'}>${upcoming ? 'Download admit card' : 'Browse assessments'}</button>
        </div>

        <div class="content-grid grid-1-1">
          <div class="panel">
            <div class="panel-head"><div><h3>Your next steps</h3><p>${upcomingExam ? `Get ready for ${esc(upcomingExam.title)}` : 'Keep track of your applications'}</p></div><button class="btn btn-ghost btn-sm" data-go="preparation">Open checklist</button></div>
            <div class="task-list">
              ${upcoming ? `<button class="task-row" type="button" data-admit-registration="${esc(upcoming.id)}"><span class="task-check">${ICONS.download}</span><span><b>Keep your admit card handy</b><small>${examDateLabel(upcomingExam.date)} · ${esc(upcoming.centre)}</small></span><span class="task-arrow">Ready</span></button>` : ''}
              <button class="task-row" type="button" data-go="myexams"><span class="task-check">${ICONS.schedule}</span><span><b>Check application progress</b><small>${registrations.filter((registration) => registration.status === 'submitted').length} applications awaiting a decision</small></span><span class="task-arrow">View</span></button>
              <button class="task-row" type="button" data-go="preparation"><span class="task-check">${ICONS.exams}</span><span><b>Continue your preparation plan</b><small>Keep important steps and reminders in one place</small></span><span class="task-arrow">Open</span></button>
              <button class="task-row" type="button" data-go="support"><span class="task-check">${ICONS.bell}</span><span><b>Need help?</b><small>Ask about registration, schedule or results</small></span><span class="task-arrow">Help</span></button>
            </div>
          </div>
          <div class="panel">
            <div class="panel-head"><div><h3>Recent updates</h3><p>Important information for you</p></div></div>
            <div class="activity-feed">
              ${upcomingExam ? activity('schedule','',`<b>${esc(upcomingExam.title)}</b> · ${examDateLabel(upcomingExam.date)} · ${esc(upcoming.centre)}`,'Upcoming') : ''}
              ${demo.announcements.filter((announcement) => announcement.audience.toLowerCase().includes('candidate') || announcement.audience === 'all candidates').slice(-3).reverse().map((announcement) => activity('bell','',`<b>Coordinator update</b> · ${esc(announcement.message)}`,new Date(announcement.createdAt).toLocaleString())).join('')}
              ${published.slice(0, 3).map((registration) => activity('results','',`<b>${esc(getExam(registration.examId)?.title || 'Assessment')}</b> · result available`,`${registration.score} / 100`)).join('')}
              ${registrations.filter((registration) => registration.status === 'submitted').slice(0, 2).map((registration) => activity('clock','warn',`<b>${esc(getExam(registration.examId)?.title || 'Assessment')}</b> · approval pending`,'In review')).join('')}
              ${!registrations.length ? activity('exams','', '<b>Welcome to your dashboard</b> · browse assessments to get started','Ready when you are') : ''}
            </div>
            <button class="btn btn-ghost btn-sm" style="margin-top:12px" data-go="support">Need help? Contact support</button>
          </div>
        </div>

        <div class="content-grid grid-1-1">
          <div class="panel">
            <div class="panel-head"><h3>Recent results</h3><button class="btn btn-ghost btn-sm" data-action="view-results">View all</button></div>
            <table class="data-table">
              <thead><tr><th>Exam</th><th>Score</th><th>Result</th></tr></thead>
              <tbody>
                ${published.map((registration) => `<tr><td class="cell-primary">${esc(getExam(registration.examId)?.title || 'Assessment')}</td><td class="cell-mono">${registration.score} / 100</td><td>${chip(registration.score >= 40 ? 'Pass' : 'Needs support', registration.score >= 40 ? 'ok' : 'warn')}</td></tr>`).join('') || '<tr><td colspan="3">No results have been published yet.</td></tr>'}
              </tbody>
            </table>
          </div>

          <div class="panel">
            <div class="panel-head"><h3>My certificates</h3><button class="btn btn-ghost btn-sm" data-go="certificates">View all</button></div>
            <div class="cert-grid">
              ${registrations.filter((registration) => registration.resultPublished && registration.score >= 40).slice(0, 2).map((registration) => `<div class="cert-card"><div class="cert-head"><div><b>${esc(getExam(registration.examId)?.title || 'Assessment')}</b><small>Score ${registration.score} / 100</small></div>${chip('Ready','ok')}</div><button class="btn btn-ghost btn-sm" style="margin-top:14px;width:100%" data-certificate-registration="${esc(registration.id)}">Download certificate</button></div>`).join('') || '<p class="cell-muted">Certificates appear after a passing result is published.</p>'}
            </div>
          </div>
        </div>
      `;
      },

      myexams: () => {
        const registrations = studentRegistrations();
        const attemptRegistration = getRegistration(state.attemptRegistrationId);
        const attemptExam = attemptRegistration && getExam(attemptRegistration.examId);
        if (attemptRegistration && attemptExam && studentRegistrations().some((registration) => registration.id === attemptRegistration.id) && attemptRegistration.status === 'approved') {
          const submitted = attemptRegistration.attemptStatus === 'submitted';
          return `
            ${pageHeader(submitted ? 'Submitted responses' : `Assessment · ${attemptExam.title}`, submitted ? 'Your demo answers have been saved for evaluator review.' : 'Answer each prompt and submit once. This demo is not timed and does not auto-grade.',
              `<button class="btn btn-ghost btn-sm" data-action="close-attempt">Back to My exams</button>`)}
            <div class="panel">
              <div class="panel-head"><div><h3>${esc(attemptExam.title)}</h3><p>${examDateLabel(attemptExam.date)} · ${esc(attemptExam.time)} · ${esc(attemptRegistration.centre)}</p></div>${chip(submitted ? 'Submitted' : 'In progress', submitted ? 'ok' : 'warn')}</div>
              <form class="workflow-form" data-form="assessment-attempt" data-registration-id="${esc(attemptRegistration.id)}">
                ${(attemptExam.questions || []).map((question, index) => `
                  <label class="field field-wide">${index + 1}. ${esc(question)}
                    <textarea name="answer-${index}" rows="3" maxlength="1200" ${submitted ? 'readonly' : 'required'}>${esc(attemptRegistration.answers?.[index] || '')}</textarea>
                  </label>
                `).join('')}
                ${submitted
                  ? `<p class="cell-muted field-wide">Submitted ${attemptRegistration.attemptSubmittedAt ? new Date(attemptRegistration.attemptSubmittedAt).toLocaleString() : ''}. Your evaluator can now review your responses.</p>`
                  : `<p class="cell-muted field-wide">Answers remain in this browser only. Submission is final in this demo.</p><div class="form-actions"><span class="cell-muted">${attemptExam.questions?.length || 0} question(s)</span><button class="btn btn-primary btn-sm" type="submit">Submit answers</button></div>`}
              </form>
            </div>`;
        }
        return `
        ${pageHeader('My exams', 'Track registrations, approval, exam-day details and published results.',
          `<button class="btn btn-primary btn-sm" data-go="catalog">+ Find an assessment</button>`)}
        <div class="stats-grid">
          ${stat({ label: 'My registrations', value: registrations.length, icon: 'exam' })}
          ${stat({ label: 'Awaiting approval', value: registrations.filter((registration) => registration.status === 'submitted').length, icon: 'clock', iconClass: 'warn' })}
          ${stat({ label: 'Results available', value: registrations.filter((registration) => registration.resultPublished).length, icon: 'results' })}
        </div>
        <div class="panel">
          <table class="data-table">
            <thead><tr><th>Assessment</th><th>Date</th><th>Centre</th><th>Fee</th><th>Progress</th><th>Next step</th></tr></thead>
            <tbody>
              ${registrations.map((registration) => {
                const exam = getExam(registration.examId);
                const status = registration.status === 'submitted' ? ['Awaiting approval', 'warn'] : registration.status === 'needs-info' ? ['More information needed', 'warn'] : registration.status === 'rejected' ? ['Not approved', 'bad'] : registration.resultPublished ? ['Result available', 'ok'] : ['Approved', 'ok'];
                const action = registration.status === 'approved' ? registration.resultPublished
                  ? `<button class="btn btn-ghost btn-sm" data-go="results">View result</button>`
                  : `<button class="btn btn-ghost btn-sm" data-admit-registration="${esc(registration.id)}">Admit card</button>${exam?.questions?.length ? registration.attemptStatus === 'submitted' ? `<button class="btn btn-primary btn-sm" data-view-attempt="${esc(registration.id)}">View responses</button>` : `<button class="btn btn-primary btn-sm" data-start-attempt="${esc(registration.id)}">Start assessment</button>` : ''}`
                  : registration.status === 'submitted' ? 'Decision pending' : registration.status === 'needs-info' ? `<button class="btn btn-ghost btn-sm" data-go="support">View request</button>` : 'Contact support';
                return `<tr data-status="${registration.status}" data-date="${exam?.date || ''}">
                  <td class="cell-primary">${esc(exam?.title || 'Assessment removed')}</td>
                  <td>${exam ? examDateLabel(exam.date) : '—'}</td><td>${esc(registration.centre)}</td><td>${esc(registration.feeStatus)}</td>
                  <td>${chip(status[0], status[1])}${registration.reviewerMessage ? `<div class="cell-muted">${esc(registration.reviewerMessage)}</div>` : ''}</td><td><div class="row-actions">${action}</div></td>
                </tr>`;
              }).join('') || '<tr><td colspan="6">You have no registrations yet. Browse open assessments to get started.</td></tr>'}
            </tbody>
          </table>
        </div>
      `;
      },

      catalog: () => {
        const exam = getExam(state.selectedExamId);
        const alreadyRegistered = exam && studentRegistrations().some((registration) => registration.examId === exam.id && registration.status !== 'rejected');
        const openExams = demo.exams.filter((item) => item.status === 'open' && !studentRegistrations().some((registration) => registration.examId === item.id && registration.status !== 'rejected'));
        return `
          ${pageHeader('Find an assessment', 'Explore open programs and register in a few simple steps.',
            `<button class="btn btn-ghost btn-sm" data-go="myexams">My registrations</button>`)}
          ${exam ? `<div class="panel selected-exam-panel">
            <div class="panel-head"><div><h3>${esc(exam.title)}</h3><p>${examDateLabel(exam.date)} · ${esc(exam.time)} · ${esc(exam.venue)}</p></div>${chip(exam.status === 'open' ? 'Registration open' : 'Registration closed', exam.status === 'open' ? 'ok' : 'neutral')}</div>
            <p class="exam-description">${esc(exam.description)}</p>
            ${exam.materials ? `<div class="notice-card"><b>Preparation notes</b><p>${esc(exam.materials)}</p></div>` : ''}
            <div class="exam-facts"><span>${esc(exam.seats)} seats</span><span>${exam.fee ? `₹${esc(exam.fee)} demo fee` : 'No fee'}</span><span>${examRegistrations(exam.id).length} registered</span></div>
            ${alreadyRegistered ? `<div class="notice-card"><b>You're already registered</b><p>Open My exams to follow your application status.</p><button class="btn btn-ghost btn-sm" data-go="myexams">View my exams</button></div>` : exam.status !== 'open' ? '<div class="notice-card"><b>Registration is closed</b><p>This assessment is not currently accepting entries.</p></div>' : `
              <form class="workflow-form registration-form" data-form="student-registration" data-exam-id="${esc(exam.id)}">
                <label class="field">Full name<input name="name" maxlength="80" value="${esc(studentName())}" required></label>
                <label class="field">Email address<input type="email" name="email" maxlength="120" value="${esc(localStorage.getItem('ef-student-email') || 'aarav.sharma@example.com')}" required></label>
                <label class="field">Current qualification
                  <select name="qualification" required><option value="">Choose one</option><option>High school</option><option>Diploma</option><option>BSc Computer Science</option><option>BSc Mathematics</option><option>BE Engineering</option><option>Other</option></select>
                </label>
                <label class="field">Preferred centre
                  <select name="centre" required><option value="${esc(exam.venue)}">${esc(exam.venue)}</option><option value="Mumbai-02">Mumbai-02</option><option value="Delhi-01">Delhi-01</option><option value="Bengaluru-03">Bengaluru-03</option></select>
                </label>
                <label class="field">Demo fee choice
                  <select name="feeStatus" required><option value="Pending">Pay later — pending</option><option value="Paid">Mark as paid — demo only</option></select>
                </label>
                <label class="field field-wide">Eligibility document (filename preview)
                  <input type="file" name="documents" accept=".pdf,.png,.jpg,.jpeg" multiple required>
                  <small class="cell-muted">Demo only: selected filenames are saved; file contents are not uploaded or stored.</small>
                </label>
                <label class="checklist-item field-wide"><input type="checkbox" name="eligible" required><span><b>I meet the published eligibility requirements.</b><small>Your declaration will be visible to the coordinator for review.</small></span></label>
                <p class="cell-muted field-wide">Submitting records a local demo application; no payment is processed and no file leaves this browser.</p>
                <div class="form-actions"><span class="cell-muted">You'll see approval and exam-day details in My exams.</span><button class="btn btn-primary btn-sm" type="submit">Submit registration</button></div>
              </form>`}
          </div>` : ''}
          <div class="panel">
            <div class="panel-head"><div><h3>Open for registration</h3><p>Select an assessment to see details and apply.</p></div>
              <label class="inline-filter">Find
                <input type="search" data-local-filter placeholder="Search assessments" aria-label="Search open assessments">
              </label>
            </div>
            <div class="catalog-grid">
              ${openExams.map((item) => `<article class="catalog-card" data-searchable="${esc(`${item.title} ${item.venue} ${item.description}`.toLowerCase())}">
                <div class="catalog-card-head"><span class="exam-icon">${esc(item.title.split(' ').map((word) => word[0]).join('').slice(0, 2))}</span>${chip('Open', 'ok')}</div>
                <h3>${esc(item.title)}</h3><p>${esc(item.description)}</p>
                <div class="exam-facts"><span>${examDateLabel(item.date)} · ${esc(item.time)}</span><span>${esc(item.venue)}</span><span>${examRegistrations(item.id).length} / ${esc(item.seats)} registered</span></div>
                <button class="btn btn-primary btn-sm" data-select-exam="${esc(item.id)}">View & register</button>
              </article>`).join('') || '<div class="empty-state"><b>No open assessments right now</b><p>Check back later or ask your coordinator for a registration link.</p></div>'}
            </div>
          </div>
        `;
      },

      results: () => {
        const published = studentRegistrations().filter((registration) => registration.resultPublished && registration.score !== null);
        const average = published.length ? Math.round(published.reduce((sum, registration) => sum + registration.score, 0) / published.length) : 0;
        const best = published.length ? Math.max(...published.map((registration) => registration.score)) : 0;
        return `
        ${pageHeader('My results', 'Only results released by your institution appear here.',
          `<button class="btn btn-ghost btn-sm" data-action="print-report">Print / Save PDF</button>`)}
        <div class="content-grid grid-1-2">
          <div class="panel">
            <div class="panel-head"><h3>Overall performance</h3></div>
            <div class="donut-wrap">
              <div class="donut" style="background:conic-gradient(var(--accent) 0 ${average}%, var(--border) ${average}% 100%)">
                <div class="donut-center"><b>${average}%</b><small>Average</small></div>
              </div>
              <div class="donut-legend">
                <div class="donut-legend-item"><i style="background:var(--accent)"></i><span>Best score</span><b>${best}%</b></div>
                <div class="donut-legend-item"><i style="background:#f59e0b"></i><span>Published results</span><b>${published.length}</b></div>
              </div>
            </div>
            <p class="cell-muted" style="margin-top:16px">${published.length ? 'Keep your marksheet for your records.' : 'Your institution has not published a result yet.'}</p>
          </div>
          <div class="panel">
            <div class="panel-head"><h3>Result details</h3></div>
            <table class="data-table">
              <thead><tr><th>Exam</th><th>Marks</th><th>Grade</th><th>Outcome</th><th>Selection</th><th></th></tr></thead>
              <tbody>
                ${published.map((registration) => {
                  const exam = getExam(registration.examId);
                  return `<tr><td class="cell-primary">${esc(exam?.title || 'Assessment')}</td><td class="cell-mono">${registration.score} / 100</td>
                    <td><b>${registration.score >= 85 ? 'A' : registration.score >= 70 ? 'B' : registration.score >= 55 ? 'C' : 'D'}</b></td>
                    <td>${chip(registration.score >= 40 ? 'Pass' : 'Needs support', registration.score >= 40 ? 'ok' : 'warn')}</td>
                    <td>${chip((registration.selectionStatus || 'pending').replace('-', ' '), registration.selectionStatus === 'selected' || registration.selectionStatus === 'shortlisted' ? 'ok' : 'neutral')}</td>
                    <td><div class="row-actions"><button class="btn btn-ghost btn-sm" data-result-registration="${esc(registration.id)}">Download marksheet</button></div>${registration.reviewerFeedback ? `<div class="cell-muted">${esc(registration.reviewerFeedback)}</div>` : ''}</td></tr>`;
                }).join('') || '<tr><td colspan="6">No published results yet.</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      `;
      },

      certificates: () => {
        const awards = studentRegistrations().filter((registration) => registration.resultPublished && registration.score >= 40);
        return `
        ${pageHeader('My certificates', 'Certificates become available after a passing result is published.')}
        <div class="cert-grid">
          ${awards.map((registration) => {
            const exam = getExam(registration.examId);
            return `
            <div class="cert-card">
              <div class="cert-head"><div><b>${esc(exam?.title || 'Assessment')}</b><small>Score ${registration.score} / 100 · ${esc(studentName())}</small></div>${chip('Ready','ok')}</div>
              <div class="cert-meta">
                <div>Recognition<b>${registration.score >= 85 ? 'Excellent' : 'Completed'}</b></div>
                <div>Result<b>Published</b></div>
              </div>
              <button class="btn btn-ghost btn-sm" style="margin-top:14px;width:100%" data-certificate-registration="${esc(registration.id)}">${ICONS.download} Download certificate</button>
            </div>`;
          }).join('') || '<div class="empty-state"><b>No certificates available yet</b><p>Once a passing result is published, your certificate will appear here.</p></div>'}
        </div>
      `;
      },

      schedule: () => {
        const registrations = studentRegistrations().filter((registration) => registration.status === 'approved');
        const upcoming = registrations.sort((a, b) => getExam(a.examId).date.localeCompare(getExam(b.examId).date));
        const events = demo.scheduleEvents.filter((event) => {
          const ownRegistration = event.registrationId && studentRegistrations().some((registration) => registration.id === event.registrationId);
          const linkedExam = event.examId && registrations.some((registration) => registration.examId === event.examId);
          return ownRegistration || linkedExam || (!event.registrationId && !event.examId);
        });
        return `
        ${pageHeader('My schedule', 'Assessment dates, interview slots and reminders shared by your coordinator.')}
        <div class="panel">
          <div class="panel-head"><h3>Upcoming</h3></div>
          <table class="data-table">
            <thead><tr><th>Date</th><th>Event</th><th>Centre / details</th><th>Status</th></tr></thead>
            <tbody>
              ${upcoming.map((registration) => {
                const exam = getExam(registration.examId);
                return `<tr data-date="${exam.date}" data-status="${exam.status}"><td class="cell-mono">${examDateLabel(exam.date)} · ${esc(exam.time)}</td><td class="cell-primary">${esc(exam.title)}</td><td class="cell-muted">${esc(registration.centre)}</td><td>${chip(registration.resultPublished ? 'Result available' : exam.date < new Date().toISOString().slice(0, 10) ? 'Completed' : 'Confirmed', registration.resultPublished ? 'ok' : 'neutral')}</td></tr>`;
              }).join('')}
              ${events.map((event) => `<tr data-date="${esc(event.date)}"><td class="cell-mono">${examDateLabel(event.date)} · ${esc(event.time)}</td><td class="cell-primary">${esc(event.type)} · ${esc(event.title)}</td><td class="cell-muted">${esc(event.location)}</td><td>${chip(event.reminder ? 'Reminder set' : 'Scheduled', event.reminder ? 'warn' : 'neutral')}</td></tr>`).join('')}
              ${!upcoming.length && !events.length ? '<tr><td colspan="4">No upcoming assessments or reminders on your schedule.</td></tr>' : ''}
            </tbody>
          </table>
        </div>
      `;
      },

      preparation: () => {
        const nextRegistration = studentRegistrations()
          .filter((registration) => registration.status === 'approved' && getExam(registration.examId)?.date >= new Date().toISOString().slice(0, 10))
          .sort((a, b) => getExam(a.examId).date.localeCompare(getExam(b.examId).date))[0];
        const nextExam = nextRegistration && getExam(nextRegistration.examId);
        const daysUntil = nextExam ? Math.max(0, Math.ceil((new Date(`${nextExam.date}T00:00:00`) - new Date(new Date().toDateString())) / 86400000)) : null;
        const tasks = [
          ['materials', `Review the ${nextExam?.title || 'assessment'} learning guide`, '30 min · Learning materials'],
          ['practice', 'Complete the networking practice set', '20 questions · Practice'],
          ['admit', 'Check your admit card and photo ID', 'Bring both on assessment day'],
          ['travel', `Plan your route${nextRegistration ? ` to ${nextRegistration.centre}` : ''}`, 'Arrive at least 30 minutes early'],
        ];
        const done = tasks.filter(([id]) => localStorage.getItem(`ef-student-prep-${id}`) === 'true').length;
        return `
          ${pageHeader('Preparation plan', 'A simple checklist to help you feel ready for your next assessment.',
            `<button class="btn btn-ghost btn-sm" data-go="schedule">${ICONS.schedule} View schedule</button>`)}
          <div class="stats-grid">
            ${stat({ label: 'Next assessment', value: daysUntil === null ? '—' : `${daysUntil} days`, delta: nextExam ? `${nextExam.title} · ${examDateLabel(nextExam.date)}` : 'No approved assessment yet', icon: 'clock', iconClass: 'warn' })}
            ${stat({ label: 'Checklist progress', value: `${done}`, sub: '/4', delta: `${Math.round(done / tasks.length * 100)}% complete`, icon: 'check' })}
            ${stat({ label: 'Study sessions', value: '3', delta: 'Suggested this week', icon: 'schedule' })}
          </div>
          <div class="content-grid grid-1-1">
            <div class="panel">
              <div class="panel-head"><div><h3>Ready-at-your-pace checklist</h3><p>Your progress is saved on this device.</p></div><span class="chip info"><span data-prep-progress>${done}</span> / 4 complete</span></div>
              <div class="prep-progress"><i data-prep-bar style="width:${done / tasks.length * 100}%"></i></div>
              <div class="checklist">
                ${tasks.map(([id, title, detail]) => `
                  <label class="checklist-item">
                    <input type="checkbox" data-prep-task="${id}" ${localStorage.getItem(`ef-student-prep-${id}`) === 'true' ? 'checked' : ''}>
                    <span><b>${title}</b><small>${detail}</small></span>
                  </label>
                `).join('')}
              </div>
            </div>
            <div class="panel">
              <div class="panel-head"><div><h3>Helpful resources</h3><p>Quick links for your next steps</p></div></div>
              ${nextExam?.materials ? `<div class="notice-card"><b>${esc(nextExam.title)} · preparation notes</b><p>${esc(nextExam.materials)}</p></div>` : ''}
              <div class="task-list">
                <button class="task-row" type="button" data-action="open-guide"><span class="task-check">${ICONS.exams}</span><span><b>Learning guide</b><small>Topics, format and what to expect</small></span><span class="task-arrow">Open</span></button>
                <button class="task-row" type="button" data-action="practice"><span class="task-check">${ICONS.marks}</span><span><b>Practice questions</b><small>Try a short set at your own pace</small></span><span class="task-arrow">Start</span></button>
                <button class="task-row" type="button" data-go="support"><span class="task-check">${ICONS.bell}</span><span><b>Ask for help</b><small>Contact your program support team</small></span><span class="task-arrow">Help</span></button>
              </div>
              <div class="notice-card"><b>Remember</b><p>Your admit card and a valid photo ID are needed at the centre.</p><button class="btn btn-ghost btn-sm" data-action="download-admit">View admit card</button></div>
            </div>
          </div>
        `;
      },

      support: () => `
        ${pageHeader('Help & support', 'Get help with your registration, schedule, results or account.')}
        <div class="content-grid grid-1-1">
          <div class="panel">
            <div class="panel-head"><div><h3>Send a support request</h3><p>Your request is saved in this browser only; it is not sent to a support team.</p></div></div>
            <form class="workflow-form" data-form="support">
              <label class="field">What do you need help with?
                <select name="topic" required>
                  <option value="Assessment schedule">Assessment schedule</option>
                  <option value="Registration or documents">Registration or documents</option>
                  <option value="Results or certificate">Results or certificate</option>
                  <option value="Request a second review">Request a second review</option>
                  <option value="Account access">Account access</option>
                </select>
              </label>
              <label class="field">Your email
                <input type="email" name="email" placeholder="you@example.com" required>
              </label>
              <label class="field field-wide">How can we help?
                <textarea name="details" rows="4" maxlength="500" placeholder="Describe the issue or question…" required></textarea>
              </label>
              <div class="form-actions"><span class="cell-muted">Saved locally. Switch to Admin → Support inbox to demo a reply.</span><button class="btn btn-primary btn-sm" type="submit">Save support request</button></div>
            </form>
          </div>
          <div class="panel">
            <div class="panel-head"><div><h3>Common questions</h3><p>Quick answers for your account</p></div></div>
            <div class="task-list">
              <div class="task-row"><span class="task-check">${ICONS.download}</span><span><b>Where can I find my admit card?</b><small>Open My exams and select your upcoming assessment.</small></span></div>
              <div class="task-row"><span class="task-check">${ICONS.results}</span><span><b>When will my results be available?</b><small>Published results appear in your Results page.</small></span></div>
              <div class="task-row"><span class="task-check">${ICONS.cert}</span><span><b>How do I share a certificate?</b><small>Open Certificates to view and download verified records.</small></span></div>
            </div>
            <div class="notice-card"><b>Need urgent help?</b><p>Contact your institution coordinator during working hours.</p></div>
            ${demo.supportRequests.length ? `<div class="activity-feed" style="margin-top:16px"><b class="cell-muted">Saved demo requests</b>            ${demo.supportRequests.filter((request) => request.email === localStorage.getItem('ef-student-email')).slice().reverse().slice(0, 3).map((request) => activity('bell',request.status === 'resolved' ? '' : 'warn',`<b>${esc(request.topic)} · ${esc(request.status || 'open')}</b> · ${esc(request.reply || request.details)}`,request.reply ? 'Coordinator response' : new Date(request.createdAt).toLocaleString())).join('')}</div>` : ''}
          </div>
        </div>
      `,

      profile: () => `
        ${pageHeader('My profile', 'Your personal details on ExamFlow.')}
        <div class="content-grid grid-1-1">
          <div class="panel">
            <div class="panel-head"><h3>Personal info</h3><button class="btn btn-ghost btn-sm" data-action="edit">Edit</button></div>
            <div class="activity-feed">
              ${activity('profile','','<b>Name</b> · Aarav Sharma','—')}
              ${activity('profile','','<b>Program</b> · BE Level 2','—')}
              ${activity('profile','','<b>Email</b> · aarav.sharma@example.com','—')}
              ${activity('profile','','<b>Phone</b> · +91 98XXX XXXXX','—')}
              ${activity('profile','','<b>Exam centre</b> · Mumbai-04','—')}
            </div>
          </div>
          <div class="panel">
            <div class="panel-head"><h3>Account</h3></div>
            <div class="activity-feed">
              ${activity('check','','Two-factor authentication <b>enabled</b>','—')}
              ${activity('bell','','Email notifications <b>enabled</b>','—')}
              ${activity('bell','warn','SMS notifications <b>disabled</b>','—')}
            </div>
            <button class="btn btn-ghost btn-sm" style="margin-top:16px" data-action="edit">Manage account</button>
          </div>
        </div>
      `,
    },
  };

  /* =========================================================
     STATE
     ========================================================= */
  const state = {
    role: ROLES[new URLSearchParams(window.location.search).get('role')] ? new URLSearchParams(window.location.search).get('role') : 'admin',
    section: new URLSearchParams(window.location.search).has('exam') ? 'catalog' : 'overview',
    selectedExamId: new URLSearchParams(window.location.search).get('exam') || '',
    selectedRegistrationId: demo.registrations.find((registration) => registration.status === 'approved')?.id || '',
    reviewRegistrationId: '',
    attemptRegistrationId: '',
  };

  const downloadHtml = (filename, title, content) => {
    const documentHtml = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${esc(title)}</title>
      <style>body{font:16px/1.6 Arial,sans-serif;max-width:760px;margin:40px auto;padding:24px;color:#183126}header{border-bottom:3px solid #176447;padding-bottom:16px;margin-bottom:24px}h1{margin:0;color:#176447}small{color:#58685e}.card{border:1px solid #ccd7ce;border-radius:12px;padding:20px;margin:18px 0}.label{color:#58685e;font-size:12px;text-transform:uppercase;letter-spacing:.08em}.value{font-weight:bold;margin:0 0 12px}@media print{body{margin:0}}</style>
      <body><header><h1>ExamFlow</h1><small>Demo document · Not an official record</small></header><main><h2>${esc(title)}</h2>${content}</main><p><small>Generated by the ExamFlow browser demo. This document is for preview only.</small></p><script>window.print()</script></body></html>`;
    const url = URL.createObjectURL(new Blob([documentHtml], { type: 'text/html;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const downloadAdmitCard = (registration) => {
    const exam = getExam(registration.examId);
    if (!exam || registration.status !== 'approved') {
      showToast('Admit cards are available after application approval.');
      return;
    }
    downloadHtml(`admit-card-${exam.id}.html`, 'Assessment admit card',
      `<div class="card"><p class="label">Candidate</p><p class="value">${esc(registration.name)}</p><p class="label">Assessment</p><p class="value">${esc(exam.title)}</p><p class="label">Date and time</p><p class="value">${examDateLabel(exam.date)} · ${esc(exam.time)}</p><p class="label">Centre</p><p class="value">${esc(registration.centre)}</p><p>Please arrive at least 30 minutes early and bring a valid photo ID.</p></div>`);
    showToast('Printable demo admit card downloaded.');
  };
  const downloadMarksheet = (registration) => {
    const exam = getExam(registration.examId);
    if (!registration.resultPublished || registration.score === null) {
      showToast('This result has not been published yet.');
      return;
    }
    downloadHtml(`marksheet-${exam?.id || 'assessment'}.html`, 'Assessment marksheet',
      `<div class="card"><p class="label">Candidate</p><p class="value">${esc(registration.name)}</p><p class="label">Assessment</p><p class="value">${esc(exam?.title || 'Assessment')}</p><p class="label">Score</p><p class="value">${registration.score} / 100 · ${registration.score >= 40 ? 'Pass' : 'Needs support'}</p></div>`);
    showToast('Printable demo marksheet downloaded.');
  };
  const downloadCertificate = (registration) => {
    const exam = getExam(registration.examId);
    if (!registration.resultPublished || registration.score < 40) {
      showToast('A certificate is available after a passing result is published.');
      return;
    }
    downloadHtml(`certificate-${exam?.id || 'assessment'}.html`, 'Certificate of completion',
      `<div class="card" style="text-align:center;padding:56px 24px"><p>This certificate recognizes</p><h2>${esc(registration.name)}</h2><p>for successful completion of</p><h2>${esc(exam?.title || 'the assessment')}</h2><p>Score: ${registration.score} / 100</p></div>`);
    showToast('Printable demo certificate downloaded.');
  };

  /* ---------- DOM refs ---------- */
  const root = document.documentElement;
  const sidebar = $('#sidebar');
  const sidebarNav = $('#sidebarNav');
  const sidebarOverlay = $('#sidebarOverlay');
  const dashContent = $('#dashContent');
  const roleSwitcher = $('#roleSwitcher');
  const roleBadgeLabel = $('#roleBadgeLabel');
  const sidebarName = $('#sidebarName');
  const sidebarRole = $('#sidebarRole');
  const sidebarAvatar = $('#sidebarAvatar');
  const topAvatar = $('#topAvatar');
  const toast = $('#dashToast');

  /* ---------- Theme ---------- */
  const storedTheme = localStorage.getItem('ef-theme');
  if (storedTheme === 'light' || storedTheme === 'dark') root.dataset.theme = storedTheme;

  $('#themeToggle')?.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem('ef-theme', next);
  });

  $('#bellBtn')?.addEventListener('click', () => {
    const destination = state.role === 'student' ? 'schedule' : state.role === 'teacher' ? 'schedule' : state.role === 'admin'
      ? demo.supportRequests.some((request) => request.status !== 'resolved') ? 'support-requests' : 'schedule'
      : 'audit';
    if (SECTIONS[state.role]?.[destination]) {
      state.section = destination;
      renderNav();
      renderContent();
      showToast('Opened your latest updates.');
    } else {
      showToast('No new platform alerts.');
    }
  });

  /* ---------- Toast ---------- */
  let toastTimer;
  const showToast = (msg) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  };

  /* ---------- Mobile sidebar ---------- */
  const closeSidebar = () => {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('show');
    $('#menuToggle').setAttribute('aria-expanded', 'false');
  };
  $('#menuToggle')?.addEventListener('click', () => {
    const open = !sidebar.classList.contains('open');
    sidebar.classList.toggle('open', open);
    sidebarOverlay.classList.toggle('show', open);
    $('#menuToggle').setAttribute('aria-expanded', String(open));
  });
  sidebarOverlay?.addEventListener('click', closeSidebar);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSidebar(); });

  /* ---------- Render nav ---------- */
  const renderNav = () => {
    const role = ROLES[state.role];
    if (!role || !sidebarNav) return;

    sidebarNav.innerHTML = role.nav.map((item) => {
      if (item.div) return `<div class="dash-nav-divider"></div>`;
      const active = state.section === item.id ? 'active' : '';
      const countValue = item.id === 'registrations'
        ? demo.registrations.filter((registration) => registration.status === 'submitted').length
        : item.id === 'scripts'
          ? demo.registrations.filter((registration) => registration.status === 'approved' && registration.score === null).length
          : item.count;
      const count = countValue ? `<span class="nav-count">${countValue}</span>` : '';
      return `
        <button class="dash-nav-item ${active}" data-nav="${esc(item.id)}" ${active ? 'aria-current="page"' : ''}>
          ${ICONS[item.icon] || ''}
          <span>${esc(item.label)}</span>
          ${count}
        </button>`;
    }).join('');

    $$('.dash-nav-item', sidebarNav).forEach((btn) => {
      btn.addEventListener('click', () => {
        state.section = btn.dataset.nav;
        renderNav();
        renderContent();
        closeSidebar();
      });
    });
  };

  /* ---------- Render content ---------- */
  const renderContent = () => {
    const searchInput = $('#dashSearch');
    if (searchInput) searchInput.value = '';
    const role = ROLES[state.role];
    const sectionFn = SECTIONS[state.role]?.[state.section];
    if (!role || !sectionFn) {
      dashContent.innerHTML = `<div class="empty-state">${ICONS.alert}<b>Section not found</b><p>This section is not available for this role.</p></div>`;
      return;
    }
    dashContent.innerHTML = sectionFn();
    dashContent.classList.remove('fade-in');
    // force reflow to restart animation
    void dashContent.offsetWidth;
    dashContent.classList.add('fade-in');

    $$('[data-exam-action]', dashContent).forEach((btn) => {
      btn.addEventListener('click', () => {
        const exam = getExam(btn.dataset.examId);
        if (!exam) {
          showToast('That assessment could not be found in this demo.');
          return;
        }
        if (btn.dataset.examAction === 'publish') {
          exam.status = 'open';
          saveDemo();
          renderContent();
          showToast('Registration is open. Copy the student link to share it.');
          return;
        }
        const field = btn.closest('td')?.querySelector('[data-share-link]');
        field?.focus();
        field?.select();
        showToast('Registration link selected. Copy it to preview as a student.');
      });
    });

    $$('[data-registration-action]', dashContent).forEach((btn) => {
      btn.addEventListener('click', () => {
        const registration = getRegistration(btn.dataset.registrationId);
        if (!registration) {
          showToast('That application is no longer available.');
          return;
        }
        if (btn.dataset.registrationAction === 'approve') {
          if (!registration.eligible || !registration.eligibilityVerified || !registration.documents?.length || !registration.documentsVerified || registration.feeStatus !== 'Paid') {
            showToast('Verify eligibility and documents, then confirm the demo fee before approval.');
            return;
          }
          registration.status = 'approved';
          registration.reviewerMessage = '';
        }
        if (btn.dataset.registrationAction === 'reject') {
          registration.status = 'rejected';
          registration.selectionStatus = 'not-selected';
        }
        if (btn.dataset.registrationAction === 'mark-paid') registration.feeStatus = 'Paid';
        if (btn.dataset.registrationAction === 'verify-eligibility') registration.eligibilityVerified = registration.eligible;
        if (btn.dataset.registrationAction === 'verify-documents') registration.documentsVerified = Boolean(registration.documents?.length);
        if (btn.dataset.registrationAction === 'request-info') {
          registration.status = 'needs-info';
          registration.reviewerMessage = 'Please contact your coordinator with the requested application details.';
        }
        if (btn.dataset.registrationAction === 'shortlist') {
          if (!registration.eligible || !registration.eligibilityVerified || !registration.documentsVerified || registration.feeStatus !== 'Paid') {
            showToast('Verify eligibility and documents, then confirm the demo fee before shortlisting.');
            return;
          }
          registration.status = 'approved';
          registration.selectionStatus = 'shortlisted';
          registration.reviewerMessage = '';
        }
        if (btn.dataset.registrationAction === 'publish-result' && registration.score !== null) {
          registration.resultPublished = true;
          registration.marksStatus = 'published';
          registration.selectionStatus = registration.recommendation === 'shortlist' && registration.score >= 40
            ? 'selected'
            : registration.recommendation === 'not-selected' || registration.score < 40 ? 'not-selected' : 'further-review';
        }
        saveDemo();
        renderContent();
        const messages = {
          approve: 'Application approved. Exam-day details are now available.',
          reject: 'Application declined in this demo.',
          'mark-paid': 'Demo fee marked paid. Review the application to approve it.',
          'verify-eligibility': 'Eligibility marked as reviewed in this demo.',
          'verify-documents': 'Demo document filenames marked as reviewed.',
          'request-info': 'More information requested. The participant can see the note in My exams.',
          shortlist: 'Candidate added to the demo shortlist.',
          'publish-result': 'Result published to the student dashboard.',
        };
        showToast(messages[btn.dataset.registrationAction] || 'Application updated in the demo.');
      });
    });

    $$('[data-review-registration]', dashContent).forEach((btn) => {
      btn.addEventListener('click', () => {
        state.reviewRegistrationId = btn.dataset.reviewRegistration;
        renderContent();
        dashContent.querySelector('.review-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
    $$('[data-delete-schedule]', dashContent).forEach((btn) => {
      btn.addEventListener('click', () => {
        demo.scheduleEvents = demo.scheduleEvents.filter((event) => event.id !== btn.dataset.deleteSchedule);
        saveDemo();
        renderContent();
        showToast('Schedule item removed from this demo.');
      });
    });

    $$('[data-select-candidate]', dashContent).forEach((btn) => {
      btn.addEventListener('click', () => {
        state.selectedRegistrationId = btn.dataset.selectCandidate;
        state.section = 'marks';
        renderNav();
        renderContent();
      });
    });
    $$('[data-start-attempt], [data-view-attempt]', dashContent).forEach((btn) => {
      btn.addEventListener('click', () => {
        state.attemptRegistrationId = btn.dataset.startAttempt || btn.dataset.viewAttempt;
        renderContent();
      });
    });
    $('[data-candidate-select]', dashContent)?.addEventListener('change', (event) => {
      state.selectedRegistrationId = event.target.value;
      renderContent();
    });

    $$('[data-select-exam]', dashContent).forEach((btn) => {
      btn.addEventListener('click', () => {
        state.selectedExamId = btn.dataset.selectExam;
        renderContent();
        dashContent.querySelector('.selected-exam-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    $$('[data-admit-registration]', dashContent).forEach((btn) => {
      btn.addEventListener('click', () => downloadAdmitCard(getRegistration(btn.dataset.admitRegistration)));
    });
    $$('[data-result-registration]', dashContent).forEach((btn) => {
      btn.addEventListener('click', () => downloadMarksheet(getRegistration(btn.dataset.resultRegistration)));
    });
    $$('[data-certificate-registration]', dashContent).forEach((btn) => {
      btn.addEventListener('click', () => downloadCertificate(getRegistration(btn.dataset.certificateRegistration)));
    });
    $$('[data-action="copy-link"]', dashContent).forEach((btn) => {
      btn.addEventListener('click', () => {
        const field = btn.closest('td')?.querySelector('[data-share-link]');
        if (!field) return;
        field.select();
        if (navigator.clipboard?.writeText) {
          navigator.clipboard.writeText(field.value).then(
            () => showToast('Registration link copied. Open it in student view.'),
            () => showToast('Link selected. Press Ctrl+C to copy it.')
          );
        } else {
          showToast('Link selected. Press Ctrl+C to copy it.');
        }
      });
    });

    // Wire action buttons inside content
    $$('[data-action]', dashContent).forEach((btn) => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        if (action === 'copy-link') return;
        if (action === 'close-review') {
          state.reviewRegistrationId = '';
          renderContent();
          return;
        }
        if (action === 'close-attempt') {
          state.attemptRegistrationId = '';
          renderContent();
          return;
        }
        const destinations = {
          'new-exam': 'create-exam',
          'enter-marks': 'marks',
          'start-eval': 'marks',
          evaluate: 'marks',
          review: 'registrations',
          publish: 'results',
          issue: 'certificates',
          'view-results': 'results',
        };
        if (destinations[action] && state.section !== destinations[action] && SECTIONS[state.role]?.[destinations[action]]) {
          state.section = destinations[action];
          renderNav();
          renderContent();
          return;
        }
        const messages = {
          'export': 'Export queued — you will get an email shortly.',
          'add-institution': 'Institution form opened (demo).',
          'view-all': 'Showing all records (demo).',
          'manage': 'Opening management panel (demo).',
          'new-exam': 'Opening the assessment setup form.',
          'approve': 'Registration approved (demo).',
          'approve-all': 'All pending registrations approved (demo).',
          'review': 'Opening pending reviews (demo).',
          'schedule': 'Opening your upcoming program schedule (demo).',
          'publish': 'Results queued for publishing (demo).',
          'issue': 'Certificate issuance started (demo).',
          'invite': 'Staff invitation sent (demo).',
          'edit': 'Edit mode enabled (demo).',
          'evaluate': 'Opening script evaluation (demo).',
          'start-eval': 'Evaluation session started (demo).',
          'enter-marks': 'Marks entry opened (demo).',
          'submit-marks': 'Marks submitted for moderation (demo).',
          'view-results': 'Opening your results (demo).',
          'download-admit': 'Admit card downloaded (demo).',
          'download': 'Download started (demo).',
          'save-marks': 'Marks draft saved on this device.',
          'open-guide': 'Learning guide opened (demo).',
          'practice': 'Practice set started (demo).',
        };
        if (action === 'focus-search') {
          $('#dashSearch')?.focus();
          return;
        }
        if (action === 'close-review') return;
        if (action === 'export') {
          const table = $('table', dashContent);
          if (table) {
            const rows = $$('tr', table).filter((row) => !row.hidden).map((row) =>
              $$('th, td', row).map((cell) => `"${cell.textContent.trim().replace(/"/g, '""')}"`).join(',')
            );
            const blob = new Blob([rows.join('\r\n')], { type: 'text/csv;charset=utf-8' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${state.section}-report.csv`;
            link.click();
            setTimeout(() => URL.revokeObjectURL(link.href), 1000);
            showToast('Report downloaded as a CSV file.');
            return;
          }
        }
        if (action === 'print-report') {
          window.print();
          return;
        }
        if (action === 'publish-results') {
          const ready = demo.registrations.filter((registration) => registration.score !== null && registration.marksStatus === 'submitted' && !registration.resultPublished);
          ready.forEach((registration) => {
            registration.resultPublished = true;
            registration.marksStatus = 'published';
            registration.selectionStatus = registration.recommendation === 'shortlist' && registration.score >= 40
              ? 'selected'
              : registration.recommendation === 'not-selected' || registration.score < 40 ? 'not-selected' : 'further-review';
          });
          saveDemo();
          renderContent();
          showToast(ready.length ? `${ready.length} result${ready.length === 1 ? '' : 's'} published in the demo.` : 'No results are waiting to be published.');
          return;
        }
        if (action === 'download-admit') {
          const registration = studentRegistrations().find((item) => item.status === 'approved' && !item.resultPublished);
          if (registration) downloadAdmitCard(registration);
          else showToast('No approved assessment is ready for an admit card.');
          return;
        }
        if (action === 'view-registration') {
          const registration = getRegistration(btn.dataset.registrationId);
          const exam = registration && getExam(registration.examId);
          showToast(registration && exam ? `${registration.name} · ${exam.title} · ${registration.status}` : 'Application details are unavailable.');
          return;
        }
        if (action === 'save-marks') {
          const registration = getRegistration(state.selectedRegistrationId);
          const inputs = $$('input[type="number"]', dashContent);
          if (!registration || inputs.length !== 5) {
            showToast('Choose a candidate before saving marks.');
            return;
          }
          registration.parts = inputs.map((input) => Number(input.value));
          registration.score = registration.parts.reduce((sum, score) => sum + score, 0);
          registration.marksStatus = 'draft';
          registration.recommendation = String(new FormData(dashContent.querySelector('[data-form="marks"]')).get('recommendation') || 'review');
          registration.reviewerFeedback = String(new FormData(dashContent.querySelector('[data-form="marks"]')).get('reviewerFeedback') || '').trim();
          registration.selectionStatus = registration.recommendation === 'shortlist' ? 'shortlisted' : registration.recommendation === 'not-selected' ? 'not-selected' : 'pending';
          saveDemo();
          renderNav();
          renderContent();
        }
        showToast(messages[action] || 'Action performed (demo).');
      });
    });

    $$('[data-row-filter], [data-date-filter], [data-local-filter]', dashContent).forEach((filter) => {
      filter.addEventListener('input', filterCurrentView);
      filter.addEventListener('change', filterCurrentView);
    });

    $$('[data-go]', dashContent).forEach((btn) => {
      btn.addEventListener('click', () => {
        const section = btn.dataset.go;
        if (!SECTIONS[state.role]?.[section]) return;
        state.section = section;
        renderNav();
        renderContent();
      });
    });

    filterCurrentView();

    $$('[data-prep-task]', dashContent).forEach((checkbox) => {
      checkbox.addEventListener('change', () => {
        localStorage.setItem(`ef-student-prep-${checkbox.dataset.prepTask}`, String(checkbox.checked));
        const completed = $$('[data-prep-task]:checked', dashContent).length;
        const progress = dashContent.querySelector('[data-prep-progress]');
        const bar = dashContent.querySelector('[data-prep-bar]');
        if (progress) progress.textContent = String(completed);
        if (bar) bar.style.width = `${completed / 4 * 100}%`;
      });
    });

    const marksForm = $('[data-form="marks"]', dashContent);
    if (marksForm) {
      const registration = getRegistration(state.selectedRegistrationId);
      const updateTotal = () => {
        const inputs = $$('input[type="number"]', marksForm);
        const total = inputs.reduce((sum, input) => sum + (Number(input.value) || 0), 0);
        const output = marksForm.querySelector('[data-score-total]');
        if (output) output.textContent = String(total);
      };
      $$('input[type="number"]', marksForm).forEach((input) => {
        input.addEventListener('input', () => {
          if (registration) {
            const index = Number(input.name.slice(1)) - 1;
            registration.parts[index] = Number(input.value) || 0;
            registration.score = registration.parts.reduce((sum, part) => sum + part, 0);
            registration.marksStatus = 'draft';
            saveDemo();
            const markStatus = dashContent.querySelector('[data-mark-status]');
            if (markStatus) markStatus.innerHTML = chip('Draft changes', 'warn');
          }
          updateTotal();
        });
      });
      $$('[name="reviewerFeedback"], [name="recommendation"]', marksForm).forEach((field) => {
        field.addEventListener('change', () => {
          if (!registration) return;
          registration.reviewerFeedback = marksForm.elements.reviewerFeedback.value.trim();
          registration.recommendation = marksForm.elements.recommendation.value;
          saveDemo();
        });
      });
      updateTotal();
    }

    $$('form[data-form]', dashContent).forEach((form) => {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!form.reportValidity()) return;
        if (form.dataset.form === 'create-exam') {
          const values = new FormData(form);
          const exam = {
            id: safeId('assessment'),
            title: String(values.get('title')).trim(),
            date: String(values.get('date')),
            time: String(values.get('time')),
            venue: String(values.get('venue')).trim(),
            seats: Number(values.get('seats')),
            fee: Number(values.get('fee')),
            description: String(values.get('description')).trim(),
            materials: String(values.get('materials') || '').trim(),
            questions: String(values.get('questionBank') || '').split(/\r?\n/).map((question) => question.trim()).filter(Boolean).slice(0, 30),
            status: 'draft',
          };
          if (new Date(`${exam.date}T${exam.time}`) <= new Date()) {
            showToast('Choose a future date and time for this assessment.');
            form.querySelector('[name="date"]').focus();
            return;
          }
          demo.exams.unshift(exam);
          saveDemo();
          state.section = 'exams';
          renderNav();
          renderContent();
          showToast('Assessment saved as a draft. Open registration when you are ready.');
          return;
        }
        if (form.dataset.form === 'student-registration') {
          const exam = getExam(form.dataset.examId);
          const values = new FormData(form);
          if (!exam || exam.status !== 'open') {
            showToast('Registration has closed for this assessment.');
            return;
          }
          const entries = examRegistrations(exam.id);
          if (entries.some((registration) => registration.name === String(values.get('name')).trim() && registration.status !== 'rejected')) {
            showToast('This student already has an application for this assessment.');
            return;
          }
          if (entries.filter((registration) => registration.status !== 'rejected').length >= exam.seats) {
            showToast('This assessment has reached its demo seat limit.');
            return;
          }
          const name = String(values.get('name')).trim();
          const email = String(values.get('email')).trim();
          const documents = values.getAll('documents').filter((file) => file instanceof File && file.name).map((file) => file.name);
          demo.registrations.unshift({
            id: safeId('registration'),
            name,
            email,
            examId: exam.id,
            centre: String(values.get('centre')),
            feeStatus: String(values.get('feeStatus')),
            qualification: String(values.get('qualification')),
            eligible: values.get('eligible') === 'on',
            eligibilityVerified: false,
            documents,
            documentsVerified: false,
            status: 'submitted',
            appliedAt: new Date().toISOString(),
            parts: [],
            score: null,
            resultPublished: false,
          });
          localStorage.setItem('ef-student-name', name);
          localStorage.setItem('ef-student-email', email);
          saveDemo();
          state.selectedExamId = '';
          state.section = 'myexams';
          updateRoleUI();
          renderNav();
          renderContent();
          showToast('Registration submitted. Track the decision in My exams.');
          return;
        }
        if (form.dataset.form === 'schedule-event') {
          const values = new FormData(form);
          const date = String(values.get('date'));
          const time = String(values.get('time'));
          if (new Date(`${date}T${time}`) <= new Date()) {
            showToast('Choose a future date and time for this schedule item.');
            form.querySelector('[name="date"]').focus();
            return;
          }
          demo.scheduleEvents.push({
            id: safeId('schedule'),
            type: String(values.get('type')),
            title: String(values.get('title')).trim(),
            date,
            time,
            location: String(values.get('location')).trim(),
            examId: String(values.get('examId')),
            registrationId: String(values.get('registrationId')),
            reminder: values.get('reminder') === 'on',
            createdAt: new Date().toISOString(),
          });
          saveDemo();
          renderContent();
          showToast('Schedule item and demo reminder saved in this browser.');
          return;
        }
        if (form.dataset.form === 'assessment-attempt') {
          const registration = getRegistration(form.dataset.registrationId);
          const exam = registration && getExam(registration.examId);
          if (!registration || registration.status !== 'approved' || !exam?.questions?.length || registration.attemptStatus === 'submitted') {
            showToast('This demo assessment is not available for submission.');
            return;
          }
          const values = new FormData(form);
          const answers = exam.questions.map((_, index) => String(values.get(`answer-${index}`) || '').trim());
          if (answers.length !== exam.questions.length || answers.some((answer) => !answer)) {
            showToast('Answer every prompt before submitting.');
            return;
          }
          registration.answers = answers;
          registration.attemptStatus = 'submitted';
          registration.attemptSubmittedAt = new Date().toISOString();
          saveDemo();
          state.attemptRegistrationId = '';
          renderContent();
          showToast('Demo answers submitted. Your evaluator can review them in Marks entry.');
          return;
        }
        if (form.dataset.form === 'marks') {
          const inputs = $$('input[type="number"]', form);
          const total = inputs.reduce((sum, input) => sum + Number(input.value), 0);
          const registration = getRegistration(state.selectedRegistrationId);
          if (!registration || registration.status !== 'approved') {
            showToast('Approve the application before entering marks.');
            return;
          }
          registration.parts = inputs.map((input) => Number(input.value));
          registration.score = total;
          registration.recommendation = String(new FormData(form).get('recommendation') || 'review');
          registration.reviewerFeedback = String(new FormData(form).get('reviewerFeedback') || '').trim();
          registration.selectionStatus = registration.recommendation === 'shortlist' ? 'shortlisted' : registration.recommendation === 'not-selected' ? 'not-selected' : 'pending';
          registration.marksStatus = 'submitted';
          saveDemo();
          renderNav();
          renderContent();
          showToast(`Marks submitted for moderation — total ${total}/100 (demo).`);
          return;
        }
        if (form.dataset.form === 'announcement') {
          const values = new FormData(form);
          demo.announcements.push({
            audience: String(values.get('audience')),
            channel: String(values.get('channel')),
            message: String(values.get('message')).trim(),
            createdAt: new Date().toISOString(),
          });
          saveDemo();
          renderContent();
          showToast('Announcement saved in this browser. Nothing was sent.');
          form.reset();
          return;
        }
        if (form.dataset.form === 'support') {
          const values = new FormData(form);
          demo.supportRequests.push({
            id: safeId('support'),
            topic: String(values.get('topic')),
            email: String(values.get('email')).trim(),
            details: String(values.get('details')).trim(),
            createdAt: new Date().toISOString(),
            status: 'open',
            reply: '',
          });
          saveDemo();
          renderContent();
          showToast('Support request saved in this browser. Nothing was sent.');
          form.reset();
          return;
        }
        if (form.dataset.form === 'support-response') {
          const request = demo.supportRequests.find((item) => item.id === form.dataset.requestId);
          if (!request) {
            showToast('That support request could not be found.');
            return;
          }
          request.reply = String(new FormData(form).get('reply')).trim();
          request.status = 'resolved';
          request.resolvedAt = new Date().toISOString();
          saveDemo();
          renderContent();
          showToast('Response saved and request marked resolved in this demo.');
        }
      });
    });

    $$('[data-range]', dashContent).forEach((btn) => {
      btn.addEventListener('click', () => {
        const range = btn.dataset.range;
        const chart = btn.closest('.trend-panel');
        if (!chart || (range !== 'week' && range !== 'month')) return;

        $$('[data-range]', chart).forEach((rangeBtn) => {
          const active = rangeBtn === btn;
          rangeBtn.classList.toggle('active', active);
          rangeBtn.setAttribute('aria-pressed', String(active));
        });

        $$('.trend-column', chart).forEach((column) => {
          const height = column.dataset[range];
          const count = column.dataset[`${range}Count`];
          const label = column.querySelector('span')?.dataset[`${range}Label`];
          if (!height || !count || !label) return;
          column.style.setProperty('--bar-height', `${height}%`);
          column.title = `${label}: ${count} applications`;
          column.querySelector('span').textContent = label;
        });

        const total = chart.querySelector('[data-trend-total]');
        if (total) total.textContent = range === 'week' ? '1,284' : '6,420';
        const trend = chart.querySelector('.trend-chart');
        if (trend) trend.setAttribute('aria-label', `Applications received by ${range === 'week' ? 'day through the week' : 'week through the month'}`);
      });
    });
  };

  /* ---------- Update role UI ---------- */
  const updateRoleUI = () => {
    const role = ROLES[state.role];
    if (!role) return;
    const user = state.role === 'student'
      ? { ...role.user, name: studentName(), initials: studentName().split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase() }
      : role.user;
    if (roleBadgeLabel) roleBadgeLabel.textContent = role.label;
    if (sidebarName) sidebarName.textContent = user.name;
    if (sidebarRole) sidebarRole.textContent = user.role;
    if (sidebarAvatar) sidebarAvatar.textContent = user.initials;
    if (topAvatar) topAvatar.textContent = user.initials;
    if (roleSwitcher) roleSwitcher.value = state.role;
  };

  /* ---------- Switch role ---------- */
  roleSwitcher?.addEventListener('change', (e) => {
    const next = e.target.value;
    if (!ROLES[next]) return;
    state.role = next;
    state.section = 'overview';
    updateRoleUI();
    renderNav();
    renderContent();
    showToast(`Switched to ${ROLES[next].label} view`);
  });

  /* ---------- Keyboard shortcut: "/" to focus search ---------- */
  const search = $('#dashSearch');
  const searchStatus = $('#dashSearchStatus');
  const filterCurrentView = () => {
    const query = search.value.trim().toLocaleLowerCase();
    const entries = [
      ...$$('table tbody tr', dashContent),
      ...$$('.task-row, .activity-item, .checklist-item', dashContent),
      ...$$('[data-searchable]', dashContent),
    ];
    const status = $('[data-row-filter]', dashContent)?.value || 'all';
    const after = $('[data-date-filter="after"]', dashContent)?.value || '';
    const before = $('[data-date-filter="before"]', dashContent)?.value || '';
    const localQuery = $('[data-local-filter]', dashContent)?.value.trim().toLocaleLowerCase() || '';
    let matches = 0;
    entries.forEach((entry) => {
      const date = entry.dataset.date || '';
      const rowStatus = entry.dataset.status || '';
      const searchableText = `${entry.textContent} ${entry.dataset.searchable || ''}`.toLocaleLowerCase();
      const visible = (!query || searchableText.includes(query))
        && (!localQuery || searchableText.includes(localQuery))
        && (!rowStatus || status === 'all' || rowStatus === status)
        && (!after || !date || date >= after)
        && (!before || !date || date <= before);
      entry.hidden = !visible;
      if (visible) matches += 1;
    });
    if (searchStatus) {
      searchStatus.textContent = query ? `${matches} matching ${matches === 1 ? 'item' : 'items'} in this view.` : 'Search cleared.';
    }
  };
  search?.addEventListener('input', filterCurrentView);
  /* ---------- Init ---------- */
  updateRoleUI();
  renderNav();
  renderContent();
  filterCurrentView();
  window.addEventListener('storage', (event) => {
    if (event.key !== DEMO_KEY) return;
    if (!event.newValue) {
      demo.exams = DEMO_EXAMS;
      demo.registrations = DEMO_REGISTRATIONS;
      demo.announcements = [];
      demo.supportRequests = [];
      demo.scheduleEvents = [];
    } else {
      const updated = JSON.parse(event.newValue);
      if (!updated || !Array.isArray(updated.exams) || !Array.isArray(updated.registrations)) {
        throw new Error('ExamFlow demo data changed to an invalid format in another tab.');
      }
      demo.exams = updated.exams;
      demo.registrations = updated.registrations;
      demo.announcements = Array.isArray(updated.announcements) ? updated.announcements : [];
      demo.supportRequests = Array.isArray(updated.supportRequests) ? updated.supportRequests : [];
      demo.scheduleEvents = Array.isArray(updated.scheduleEvents) ? updated.scheduleEvents : [];
      demo.supportRequests.forEach((request, index) => {
        if (!request.id) request.id = `support-remote-${index}`;
        if (!request.status) request.status = 'open';
        if (typeof request.reply !== 'string') request.reply = '';
      });
    }
    if (state.role === 'student') updateRoleUI();
    renderNav();
    renderContent();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== search) {
      e.preventDefault();
      search?.focus();
    }
  });
})();