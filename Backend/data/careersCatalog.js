const categoryDefaults = {
  Technical: {
    overview:
      "A technology-focused career that combines problem solving, digital tools, and continuous learning to build, manage, or improve modern systems.",
    courses: ["B.Tech", "BCA", "MCA", "Certification Programs"],
    skills: ["Problem Solving", "Technical Knowledge", "Communication", "Analytical Thinking"],
    avgSalary: "INR 4-18 LPA",
  },
  Medical: {
    overview:
      "A healthcare career dedicated to patient care, diagnosis, treatment, wellness, and improving quality of life through medical knowledge and practice.",
    courses: ["MBBS", "BDS", "B.Sc", "Allied Health Programs"],
    skills: ["Empathy", "Attention to Detail", "Scientific Knowledge", "Decision Making"],
    avgSalary: "INR 3-20 LPA",
  },
  Creative: {
    overview:
      "A creative career centered on design, storytelling, visual thinking, and innovation across digital, media, fashion, or communication industries.",
    courses: ["B.Des", "BJMC", "Fine Arts", "Diploma Programs"],
    skills: ["Creativity", "Visual Communication", "Collaboration", "Adaptability"],
    avgSalary: "INR 3-15 LPA",
  },
  Business: {
    overview:
      "A business-oriented career focused on strategy, operations, finance, growth, customer value, and leadership in organizations or startups.",
    courses: ["BBA", "B.Com", "MBA", "Professional Certifications"],
    skills: ["Leadership", "Communication", "Planning", "Data Interpretation"],
    avgSalary: "INR 4-20 LPA",
  },
  Legal: {
    overview:
      "A law-related career involving legal reasoning, advocacy, compliance, justice, and interpretation of rules, rights, and responsibilities.",
    courses: ["LLB", "BA LLB", "LLM", "Judicial Service Preparation"],
    skills: ["Reasoning", "Research", "Communication", "Ethics"],
    avgSalary: "INR 4-18 LPA",
  },
  Science: {
    overview:
      "A science-based career built around experimentation, research, evidence, analysis, and discovery in natural, life, or applied sciences.",
    courses: ["B.Sc", "M.Sc", "PhD", "Research Fellowships"],
    skills: ["Research Skills", "Observation", "Data Analysis", "Critical Thinking"],
    avgSalary: "INR 4-16 LPA",
  },
  Government: {
    overview:
      "A public-service career involving administration, governance, security, regulation, or national development through state and public institutions.",
    courses: ["Graduation", "Competitive Exam Preparation", "Professional Training"],
    skills: ["Discipline", "Decision Making", "Leadership", "Public Service Orientation"],
    avgSalary: "INR 4-15 LPA",
  },
  Social: {
    overview:
      "A people-centered career focused on education, guidance, community development, support services, and positive social impact.",
    courses: ["BA", "B.Ed", "MSW", "Specialized Diplomas"],
    skills: ["Empathy", "Communication", "Patience", "Interpersonal Skills"],
    avgSalary: "INR 3-12 LPA",
  },
};

const createCareer = (title, category, overrides = {}) => {
  const defaults = categoryDefaults[category];

  return {
    title,
    category,
    overview: overrides.overview || `${title} is ${defaults.overview.charAt(0).toLowerCase()}${defaults.overview.slice(1)}`,
    courses: overrides.courses || defaults.courses,
    skills: overrides.skills || defaults.skills,
    avgSalary: overrides.avgSalary || defaults.avgSalary,
  };
};

const careersCatalog = [
  createCareer("Accountant", "Business", {
    courses: ["B.Com", "M.Com", "CA Foundation", "Accounting Certifications"],
    skills: ["Accounting", "Numerical Ability", "Attention to Detail", "Excel"],
    avgSalary: "INR 3-10 LPA",
  }),
  createCareer("Actuary", "Business", {
    courses: ["B.Sc Mathematics", "Statistics", "Actuarial Science", "IFoA Exams"],
    skills: ["Statistics", "Risk Analysis", "Mathematics", "Problem Solving"],
    avgSalary: "INR 8-25 LPA",
  }),
  createCareer("Advocate", "Legal", {
    courses: ["BA LLB", "LLB", "AIBE"],
    skills: ["Advocacy", "Drafting", "Legal Research", "Argumentation"],
  }),
  createCareer("Agricultural Scientist", "Science", {
    courses: ["B.Sc Agriculture", "M.Sc Agriculture", "PhD"],
    skills: ["Research", "Field Analysis", "Problem Solving", "Scientific Writing"],
  }),
  createCareer("AI Engineer", "Technical", {
    courses: ["B.Tech CSE", "AI/ML Certifications", "M.Tech AI"],
    skills: ["Machine Learning", "Python", "Data Structures", "Mathematics"],
    avgSalary: "INR 8-25 LPA",
  }),
  createCareer("Air Hostess", "Social", {
    courses: ["Aviation Hospitality Diploma", "Graduation", "Cabin Crew Training"],
    skills: ["Customer Service", "Communication", "Confidence", "Crisis Handling"],
  }),
  createCareer("Animator", "Creative", {
    courses: ["Animation Diploma", "B.Des", "B.Sc Animation"],
    skills: ["Animation Tools", "Creativity", "Storytelling", "Visual Design"],
  }),
  createCareer("App Developer", "Technical", {
    courses: ["BCA", "B.Tech", "Mobile App Certifications"],
    skills: ["Java/Kotlin/Swift", "UI Design", "Problem Solving", "Testing"],
  }),
  createCareer("Architect", "Creative", {
    courses: ["B.Arch", "M.Arch", "NATA"],
    skills: ["Design Thinking", "Drawing", "Spatial Planning", "CAD Software"],
    avgSalary: "INR 4-14 LPA",
  }),
  createCareer("Army Officer", "Government", {
    courses: ["Graduation", "NDA", "CDS", "SSB Preparation"],
    skills: ["Leadership", "Discipline", "Fitness", "Decision Making"],
  }),
  createCareer("Astronomer", "Science", {
    courses: ["B.Sc Physics", "M.Sc Astronomy", "PhD"],
    skills: ["Physics", "Data Analysis", "Research", "Mathematics"],
  }),
  createCareer("Audiologist", "Medical", {
    courses: ["BASLP", "M.Sc Audiology"],
    skills: ["Patient Care", "Assessment", "Listening Skills", "Clinical Practice"],
  }),
  createCareer("Automobile Engineer", "Technical", {
    courses: ["B.Tech Mechanical", "Automobile Engineering"],
    skills: ["Mechanical Systems", "Design", "Testing", "Problem Solving"],
  }),
  createCareer("Ayurveda Doctor", "Medical", {
    courses: ["BAMS", "MD Ayurveda"],
    skills: ["Patient Care", "Diagnosis", "Holistic Treatment", "Communication"],
  }),
  createCareer("Bank PO", "Government", {
    courses: ["Graduation", "IBPS PO Preparation", "Banking Exams"],
    skills: ["Quantitative Aptitude", "Reasoning", "Communication", "Banking Awareness"],
  }),
  createCareer("Banker", "Business", {
    courses: ["B.Com", "BBA", "MBA Finance"],
    skills: ["Customer Handling", "Finance Basics", "Sales", "Numerical Ability"],
  }),
  createCareer("Biochemist", "Science", {
    courses: ["B.Sc Biochemistry", "M.Sc Biochemistry", "PhD"],
    skills: ["Lab Skills", "Research", "Chemical Analysis", "Documentation"],
  }),
  createCareer("Biotechnologist", "Science", {
    courses: ["B.Tech Biotechnology", "B.Sc Biotechnology", "M.Sc Biotechnology"],
    skills: ["Biology", "Laboratory Work", "Research", "Data Analysis"],
  }),
  createCareer("Blockchain Developer", "Technical", {
    courses: ["B.Tech", "Blockchain Certifications", "Computer Science"],
    skills: ["Blockchain", "Smart Contracts", "Programming", "Security"],
    avgSalary: "INR 8-22 LPA",
  }),
  createCareer("Brand Manager", "Business", {
    courses: ["BBA", "MBA Marketing", "Digital Marketing Certifications"],
    skills: ["Brand Strategy", "Communication", "Campaign Planning", "Market Research"],
  }),
  createCareer("Business Analyst", "Business", {
    courses: ["BBA", "B.Tech", "MBA", "Analytics Certifications"],
    skills: ["Business Analysis", "Excel", "SQL", "Stakeholder Communication"],
  }),
  createCareer("Career Counselor", "Social", {
    courses: ["BA Psychology", "MA Psychology", "Counseling Certifications"],
    skills: ["Counseling", "Listening", "Guidance", "Interpersonal Skills"],
  }),
  createCareer("Cardiologist", "Medical", {
    courses: ["MBBS", "MD Medicine", "DM Cardiology"],
    skills: ["Diagnosis", "Patient Care", "Critical Thinking", "Clinical Decision Making"],
    avgSalary: "INR 12-35 LPA",
  }),
  createCareer("Chartered Accountant", "Business", {
    courses: ["CA Foundation", "CA Intermediate", "CA Final"],
    skills: ["Accounting", "Auditing", "Taxation", "Attention to Detail"],
    avgSalary: "INR 7-25 LPA",
  }),
  createCareer("Chemist", "Science", {
    courses: ["B.Sc Chemistry", "M.Sc Chemistry"],
    skills: ["Chemical Analysis", "Lab Safety", "Observation", "Research"],
  }),
  createCareer("Civil Engineer", "Technical", {
    courses: ["B.Tech Civil Engineering", "M.Tech Civil Engineering"],
    skills: ["Structural Design", "Site Planning", "CAD", "Project Management"],
  }),
  createCareer("Cloud Architect", "Technical", {
    courses: ["B.Tech", "Cloud Certifications", "Computer Science"],
    skills: ["Cloud Platforms", "Networking", "Security", "System Design"],
    avgSalary: "INR 10-28 LPA",
  }),
  createCareer("Company Secretary", "Business", {
    courses: ["CS Foundation", "CS Executive", "CS Professional"],
    skills: ["Corporate Law", "Compliance", "Documentation", "Governance"],
  }),
  createCareer("Content Writer", "Creative", {
    courses: ["BA English", "Journalism", "Content Writing Courses"],
    skills: ["Writing", "Research", "SEO", "Editing"],
  }),
  createCareer("Corporate Lawyer", "Legal", {
    courses: ["BA LLB", "LLM Corporate Law"],
    skills: ["Contract Drafting", "Negotiation", "Legal Research", "Communication"],
  }),
  createCareer("Counselor", "Social", {
    courses: ["BA Psychology", "MA Psychology", "Counseling Certifications"],
    skills: ["Empathy", "Listening", "Guidance", "Confidentiality"],
  }),
  createCareer("Criminal Lawyer", "Legal", {
    courses: ["LLB", "Criminal Law Specialization"],
    skills: ["Court Practice", "Argumentation", "Legal Research", "Case Analysis"],
  }),
  createCareer("Cyber Security Expert", "Technical", {
    courses: ["B.Tech CSE", "Cyber Security Certifications", "MCA"],
    skills: ["Network Security", "Ethical Hacking", "Risk Assessment", "Problem Solving"],
    avgSalary: "INR 6-20 LPA",
  }),
  createCareer("Data Analyst", "Technical", {
    courses: ["B.Sc Statistics", "B.Tech", "Analytics Certifications"],
    skills: ["Excel", "SQL", "Visualization", "Analytical Thinking"],
  }),
  createCareer("Data Scientist", "Technical", {
    courses: ["B.Tech", "B.Sc Statistics", "Data Science Certifications"],
    skills: ["Python", "Machine Learning", "Statistics", "Data Visualization"],
    avgSalary: "INR 8-24 LPA",
  }),
  createCareer("Dentist", "Medical", {
    courses: ["BDS", "MDS"],
    skills: ["Patient Care", "Precision", "Diagnosis", "Clinical Practice"],
    avgSalary: "INR 5-18 LPA",
  }),
  createCareer("Dermatologist", "Medical", {
    courses: ["MBBS", "MD Dermatology"],
    skills: ["Diagnosis", "Patient Care", "Clinical Skills", "Attention to Detail"],
  }),
  createCareer("DevOps Engineer", "Technical", {
    courses: ["B.Tech", "DevOps Certifications", "Cloud Certifications"],
    skills: ["CI/CD", "Linux", "Automation", "Cloud Tools"],
    avgSalary: "INR 7-22 LPA",
  }),
  createCareer("Dietitian", "Medical", {
    courses: ["B.Sc Nutrition", "M.Sc Dietetics"],
    skills: ["Nutrition Planning", "Patient Counseling", "Assessment", "Communication"],
  }),
  createCareer("Digital Marketing Specialist", "Business", {
    courses: ["BBA", "Digital Marketing Certifications", "MBA Marketing"],
    skills: ["SEO", "Social Media", "Content Strategy", "Analytics"],
  }),
  createCareer("Doctor", "Medical", {
    courses: ["MBBS", "MD/MS", "NEET"],
    skills: ["Diagnosis", "Empathy", "Clinical Knowledge", "Decision Making"],
    avgSalary: "INR 6-25 LPA",
  }),
  createCareer("Electrical Engineer", "Technical", {
    courses: ["B.Tech Electrical Engineering", "M.Tech EE"],
    skills: ["Circuit Design", "Problem Solving", "Testing", "Technical Analysis"],
  }),
  createCareer("Electronics Engineer", "Technical", {
    courses: ["B.Tech ECE", "M.Tech ECE"],
    skills: ["Embedded Systems", "Circuit Analysis", "Design", "Testing"],
  }),
  createCareer("Emergency Medical Technician", "Medical", {
    courses: ["Paramedical Diploma", "EMT Certification"],
    skills: ["First Aid", "Emergency Response", "Calmness", "Patient Handling"],
  }),
  createCareer("Entrepreneur", "Business", {
    courses: ["BBA", "MBA", "Startup Courses"],
    skills: ["Leadership", "Risk Taking", "Business Planning", "Networking"],
    avgSalary: "Varies widely",
  }),
  createCareer("Environmental Scientist", "Science", {
    courses: ["B.Sc Environmental Science", "M.Sc Environmental Science"],
    skills: ["Research", "Field Work", "Analysis", "Reporting"],
  }),
  createCareer("Event Manager", "Business", {
    courses: ["BBA", "Event Management Diploma", "Hospitality Courses"],
    skills: ["Planning", "Vendor Management", "Communication", "Execution"],
  }),
  createCareer("Fashion Designer", "Creative", {
    courses: ["B.Des Fashion Design", "Fashion Design Diploma"],
    skills: ["Creativity", "Sketching", "Trend Awareness", "Textile Knowledge"],
  }),
  createCareer("Film Director", "Creative", {
    courses: ["Film Making Courses", "Mass Communication", "Media Studies"],
    skills: ["Storytelling", "Leadership", "Visual Direction", "Collaboration"],
  }),
  createCareer("Financial Analyst", "Business", {
    courses: ["B.Com", "BBA Finance", "MBA Finance", "CFA"],
    skills: ["Financial Modelling", "Excel", "Research", "Analytical Thinking"],
  }),
  createCareer("Food Technologist", "Science", {
    courses: ["B.Tech Food Technology", "B.Sc Food Science"],
    skills: ["Quality Control", "Food Safety", "Research", "Analysis"],
  }),
  createCareer("Forensic Scientist", "Science", {
    courses: ["B.Sc Forensic Science", "M.Sc Forensic Science"],
    skills: ["Observation", "Analysis", "Evidence Handling", "Scientific Methods"],
  }),
  createCareer("Forest Officer", "Government", {
    courses: ["Graduation", "UPSC Forest Services Preparation"],
    skills: ["Leadership", "Environment Knowledge", "Administration", "Field Work"],
  }),
  createCareer("Full Stack Developer", "Technical", {
    courses: ["BCA", "B.Tech", "Full Stack Certifications"],
    skills: ["Frontend", "Backend", "Databases", "Problem Solving"],
    avgSalary: "INR 5-18 LPA",
  }),
  createCareer("Game Developer", "Technical", {
    courses: ["B.Tech", "Game Design Courses", "BCA"],
    skills: ["Programming", "Game Engines", "Logic", "Creativity"],
  }),
  createCareer("Geologist", "Science", {
    courses: ["B.Sc Geology", "M.Sc Geology"],
    skills: ["Field Research", "Analysis", "Observation", "Scientific Reporting"],
  }),
  createCareer("Graphic Designer", "Creative", {
    courses: ["B.Des", "Graphic Design Diploma", "Visual Communication"],
    skills: ["Adobe Tools", "Typography", "Creativity", "Layout Design"],
  }),
  createCareer("HR Manager", "Business", {
    courses: ["BBA", "MBA HR", "HR Certifications"],
    skills: ["People Management", "Communication", "Conflict Resolution", "Recruitment"],
  }),
  createCareer("IAS Officer", "Government", {
    courses: ["Graduation", "UPSC Civil Services Preparation"],
    skills: ["Leadership", "Administration", "Public Policy", "Decision Making"],
    avgSalary: "INR 8-18 LPA",
  }),
  createCareer("IFS Officer", "Government", {
    courses: ["Graduation", "UPSC Civil Services Preparation"],
    skills: ["Diplomacy", "Communication", "Leadership", "Policy Understanding"],
  }),
  createCareer("Illustrator", "Creative", {
    courses: ["Fine Arts", "Illustration Courses", "Design Programs"],
    skills: ["Drawing", "Creativity", "Digital Illustration", "Storytelling"],
  }),
  createCareer("Indian Navy Officer", "Government", {
    courses: ["NDA", "CDS", "Engineering Entry", "Graduation"],
    skills: ["Discipline", "Leadership", "Technical Aptitude", "Fitness"],
  }),
  createCareer("Interior Designer", "Creative", {
    courses: ["B.Des Interior Design", "Interior Design Diploma"],
    skills: ["Space Planning", "Creativity", "CAD", "Client Communication"],
  }),
  createCareer("Investment Banker", "Business", {
    courses: ["B.Com", "BBA Finance", "MBA Finance"],
    skills: ["Finance", "Valuation", "Presentation", "Analytical Thinking"],
    avgSalary: "INR 10-30 LPA",
  }),
  createCareer("IPS Officer", "Government", {
    courses: ["Graduation", "UPSC Civil Services Preparation"],
    skills: ["Leadership", "Law and Order Management", "Decision Making", "Physical Fitness"],
    avgSalary: "INR 8-18 LPA",
  }),
  createCareer("Journalist", "Creative", {
    courses: ["BJMC", "Mass Communication", "Journalism Diploma"],
    skills: ["Writing", "Research", "Interviewing", "Communication"],
  }),
  createCareer("Judge", "Legal", {
    courses: ["LLB", "Judicial Service Exam Preparation"],
    skills: ["Legal Reasoning", "Ethics", "Decision Making", "Analysis"],
  }),
  createCareer("Legal Advisor", "Legal", {
    courses: ["LLB", "Corporate Law Courses"],
    skills: ["Legal Drafting", "Compliance", "Research", "Communication"],
  }),
  createCareer("Legal Researcher", "Legal", {
    courses: ["LLB", "LLM", "Research Methodology"],
    skills: ["Research", "Writing", "Case Analysis", "Interpretation"],
  }),
  createCareer("Logistics Manager", "Business", {
    courses: ["BBA", "MBA Operations", "Supply Chain Courses"],
    skills: ["Planning", "Coordination", "Vendor Management", "Operations"],
  }),
  createCareer("Management Consultant", "Business", {
    courses: ["BBA", "MBA", "Consulting Certifications"],
    skills: ["Problem Solving", "Presentation", "Business Strategy", "Analysis"],
  }),
  createCareer("Marine Biologist", "Science", {
    courses: ["B.Sc Marine Biology", "M.Sc Marine Science"],
    skills: ["Research", "Observation", "Biology", "Field Work"],
  }),
  createCareer("Marketing Manager", "Business", {
    courses: ["BBA", "MBA Marketing", "Digital Marketing Courses"],
    skills: ["Campaign Planning", "Leadership", "Communication", "Analytics"],
  }),
  createCareer("Mechanical Engineer", "Technical", {
    courses: ["B.Tech Mechanical Engineering", "Diploma Mechanical"],
    skills: ["Design", "Mechanics", "Problem Solving", "CAD"],
  }),
  createCareer("Medical Lab Technologist", "Medical", {
    courses: ["BMLT", "DMLT", "Allied Health Courses"],
    skills: ["Laboratory Skills", "Accuracy", "Testing", "Record Keeping"],
  }),
  createCareer("Microbiologist", "Science", {
    courses: ["B.Sc Microbiology", "M.Sc Microbiology"],
    skills: ["Lab Work", "Research", "Observation", "Scientific Methods"],
  }),
  createCareer("Multimedia Artist", "Creative", {
    courses: ["Animation Courses", "Multimedia Design", "B.Des"],
    skills: ["Visual Design", "Editing Tools", "Creativity", "Storytelling"],
  }),
  createCareer("Network Engineer", "Technical", {
    courses: ["B.Tech", "CCNA", "Networking Certifications"],
    skills: ["Networking", "Troubleshooting", "Security", "System Administration"],
  }),
  createCareer("NGO Manager", "Social", {
    courses: ["BA", "MSW", "NGO Management Courses"],
    skills: ["Leadership", "Community Outreach", "Project Management", "Communication"],
  }),
  createCareer("Notary", "Legal", {
    courses: ["LLB", "Legal Practice Experience"],
    skills: ["Documentation", "Verification", "Legal Knowledge", "Integrity"],
  }),
  createCareer("Nurse", "Medical", {
    courses: ["B.Sc Nursing", "GNM", "M.Sc Nursing"],
    skills: ["Patient Care", "Empathy", "Clinical Skills", "Teamwork"],
  }),
  createCareer("Occupational Therapist", "Medical", {
    courses: ["BOT", "MOT"],
    skills: ["Therapy Planning", "Empathy", "Assessment", "Patient Support"],
  }),
  createCareer("Pharmacist", "Medical", {
    courses: ["B.Pharm", "D.Pharm", "M.Pharm"],
    skills: ["Medication Knowledge", "Accuracy", "Counseling", "Attention to Detail"],
  }),
  createCareer("Photographer", "Creative", {
    courses: ["Photography Courses", "Visual Arts", "Media Studies"],
    skills: ["Composition", "Editing", "Creativity", "Lighting"],
  }),
  createCareer("Physiotherapist", "Medical", {
    courses: ["BPT", "MPT"],
    skills: ["Patient Care", "Assessment", "Rehabilitation", "Communication"],
  }),
  createCareer("Police Officer", "Government", {
    courses: ["Graduation", "State PSC/Police Exams", "Physical Training"],
    skills: ["Discipline", "Leadership", "Law Awareness", "Fitness"],
  }),
  createCareer("Professor", "Social", {
    courses: ["Graduation", "Postgraduation", "NET/SET", "PhD"],
    skills: ["Teaching", "Research", "Communication", "Subject Expertise"],
  }),
  createCareer("Product Designer", "Creative", {
    courses: ["B.Des", "Industrial Design", "Product Design Courses"],
    skills: ["Design Thinking", "Prototyping", "User Research", "Creativity"],
  }),
  createCareer("Product Manager", "Business", {
    courses: ["BBA", "B.Tech", "MBA", "Product Management Courses"],
    skills: ["Strategy", "Communication", "Roadmapping", "Analysis"],
    avgSalary: "INR 10-28 LPA",
  }),
  createCareer("Professor of Law", "Legal", {
    courses: ["LLB", "LLM", "NET", "PhD"],
    skills: ["Teaching", "Research", "Legal Writing", "Public Speaking"],
  }),
  createCareer("PSU Officer", "Government", {
    courses: ["Engineering Degree", "GATE", "Graduation"],
    skills: ["Technical Knowledge", "Administration", "Leadership", "Discipline"],
  }),
  createCareer("Psychologist", "Medical", {
    courses: ["BA Psychology", "MA Psychology", "M.Phil Clinical Psychology"],
    skills: ["Assessment", "Empathy", "Counseling", "Observation"],
  }),
  createCareer("Public Prosecutor", "Legal", {
    courses: ["LLB", "Court Practice", "Judicial/Prosecution Exams"],
    skills: ["Courtroom Advocacy", "Case Preparation", "Reasoning", "Communication"],
  }),
  createCareer("Quality Analyst", "Technical", {
    courses: ["B.Tech", "BCA", "QA Certifications"],
    skills: ["Testing", "Attention to Detail", "Bug Tracking", "Analytical Thinking"],
  }),
  createCareer("Quantitative Analyst", "Business", {
    courses: ["B.Sc Mathematics", "Statistics", "MBA Finance"],
    skills: ["Mathematics", "Statistics", "Financial Modelling", "Programming"],
    avgSalary: "INR 12-30 LPA",
  }),
  createCareer("Radiologist", "Medical", {
    courses: ["MBBS", "MD Radiology"],
    skills: ["Imaging Analysis", "Diagnosis", "Attention to Detail", "Clinical Expertise"],
  }),
  createCareer("Railway Officer", "Government", {
    courses: ["Graduation", "Railway Exam Preparation", "Engineering Degrees"],
    skills: ["Administration", "Operational Planning", "Discipline", "Leadership"],
  }),
  createCareer("Robotics Engineer", "Technical", {
    courses: ["B.Tech Robotics", "Mechanical/Electronics Engineering"],
    skills: ["Automation", "Programming", "Control Systems", "Problem Solving"],
    avgSalary: "INR 6-20 LPA",
  }),
  createCareer("Sales Manager", "Business", {
    courses: ["BBA", "MBA Sales", "Marketing Courses"],
    skills: ["Negotiation", "Leadership", "Target Management", "Communication"],
  }),
  createCareer("School Teacher", "Social", {
    courses: ["BA/B.Sc", "B.Ed", "TET/CTET"],
    skills: ["Teaching", "Patience", "Communication", "Classroom Management"],
  }),
  createCareer("Scientist", "Science", {
    courses: ["B.Sc", "M.Sc", "PhD", "Research Programs"],
    skills: ["Research", "Data Analysis", "Observation", "Scientific Writing"],
  }),
  createCareer("Social Worker", "Social", {
    courses: ["BSW", "MSW", "Community Development Courses"],
    skills: ["Empathy", "Community Engagement", "Communication", "Problem Solving"],
  }),
  createCareer("Software Engineer", "Technical", {
    courses: ["B.Tech CSE", "BCA", "MCA", "Software Certifications"],
    skills: ["Programming", "Data Structures", "Debugging", "Problem Solving"],
    avgSalary: "INR 5-22 LPA",
  }),
  createCareer("Special Educator", "Social", {
    courses: ["B.Ed Special Education", "Rehabilitation Courses"],
    skills: ["Patience", "Assessment", "Communication", "Inclusive Teaching"],
  }),
  createCareer("Sports Coach", "Social", {
    courses: ["B.P.Ed", "M.P.Ed", "Coaching Certifications"],
    skills: ["Leadership", "Motivation", "Training Planning", "Communication"],
  }),
  createCareer("Statistician", "Science", {
    courses: ["B.Sc Statistics", "M.Sc Statistics"],
    skills: ["Statistics", "Data Interpretation", "Mathematics", "Research"],
  }),
  createCareer("Surgeon", "Medical", {
    courses: ["MBBS", "MS Surgery", "Specialty Training"],
    skills: ["Precision", "Decision Making", "Clinical Expertise", "Calmness"],
    avgSalary: "INR 12-35 LPA",
  }),
  createCareer("Supply Chain Analyst", "Business", {
    courses: ["BBA", "MBA Operations", "Supply Chain Certifications"],
    skills: ["Data Analysis", "Planning", "Operations", "Coordination"],
  }),
  createCareer("Teacher", "Social", {
    courses: ["Graduation", "B.Ed", "TET/CTET"],
    skills: ["Teaching", "Patience", "Communication", "Subject Knowledge"],
  }),
  createCareer("Translator", "Social", {
    courses: ["BA Languages", "Translation Courses", "Linguistics"],
    skills: ["Language Proficiency", "Writing", "Cultural Awareness", "Attention to Detail"],
  }),
  createCareer("UI/UX Designer", "Creative", {
    courses: ["Design Courses", "B.Des", "UI/UX Certifications"],
    skills: ["User Research", "Wireframing", "Prototyping", "Visual Design"],
  }),
  createCareer("Urban Planner", "Social", {
    courses: ["B.Plan", "M.Plan", "Urban Planning Courses"],
    skills: ["Planning", "Spatial Analysis", "Research", "Policy Understanding"],
  }),
  createCareer("Veterinary Doctor", "Medical", {
    courses: ["BVSc", "MVSc"],
    skills: ["Animal Care", "Diagnosis", "Empathy", "Clinical Practice"],
  }),
  createCareer("Web Developer", "Technical", {
    courses: ["BCA", "B.Tech", "Web Development Certifications"],
    skills: ["HTML", "CSS", "JavaScript", "Problem Solving"],
  }),
  createCareer("X-Ray Technician", "Medical", {
    courses: ["Radiology Diploma", "B.Sc Radiology"],
    skills: ["Imaging Equipment", "Patient Handling", "Accuracy", "Clinical Support"],
  }),
  createCareer("Yoga Instructor", "Social", {
    courses: ["Yoga Certification", "Diploma in Yoga", "B.Sc Yoga"],
    skills: ["Instruction", "Wellness Knowledge", "Communication", "Discipline"],
  }),
  createCareer("Zoologist", "Science", {
    courses: ["B.Sc Zoology", "M.Sc Zoology", "PhD"],
    skills: ["Research", "Observation", "Biology", "Field Work"],
  }),
];

module.exports = { careersCatalog };
