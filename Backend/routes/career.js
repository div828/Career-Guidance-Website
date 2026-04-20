const express = require("express");
const router = express.Router();

const categoryDefaults = {
  Technical: {
    overview: "A technology-focused career involving software, systems, data, digital products, automation, and modern engineering practices.",
    courses: ["B.Tech", "BCA", "MCA", "B.Sc Computer Science", "Relevant certifications"],
    skills: ["Problem Solving", "Technical Knowledge", "Analytical Thinking", "Communication"],
    avgSalary: "INR 4-25 LPA",
  },
  Medical: {
    overview: "A healthcare career focused on patient care, diagnosis, treatment, wellness, medical science, or allied health services.",
    courses: ["MBBS", "BDS", "BAMS", "BHMS", "B.Sc Nursing", "Allied Health Courses"],
    skills: ["Medical Knowledge", "Empathy", "Attention to Detail", "Decision Making"],
    avgSalary: "INR 3-20 LPA",
  },
  Creative: {
    overview: "A creative career involving design, media, writing, visual communication, performance, production, or digital storytelling.",
    courses: ["B.Des", "BFA", "BA", "Diploma Courses", "Portfolio Based Training"],
    skills: ["Creativity", "Design Thinking", "Communication", "Portfolio Building"],
    avgSalary: "INR 2.5-15 LPA",
  },
  Business: {
    overview: "A business career focused on finance, management, operations, marketing, commerce, entrepreneurship, or organizational growth.",
    courses: ["B.Com", "BBA", "MBA", "CA/CS/CMA", "Commerce Certifications"],
    skills: ["Business Acumen", "Communication", "Analysis", "Leadership"],
    avgSalary: "INR 3-18 LPA",
  },
  Legal: {
    overview: "A law-related career involving legal reasoning, advocacy, compliance, justice, governance, contracts, and rights.",
    courses: ["LLB", "BA LLB", "BBA LLB", "LLM", "Legal Certifications"],
    skills: ["Legal Research", "Argumentation", "Drafting", "Critical Thinking"],
    avgSalary: "INR 3-20 LPA",
  },
  Science: {
    overview: "A science career involving research, experimentation, analysis, discovery, environment, life sciences, or applied sciences.",
    courses: ["B.Sc", "M.Sc", "Ph.D.", "Research Internships", "Lab Certifications"],
    skills: ["Research", "Observation", "Data Analysis", "Scientific Thinking"],
    avgSalary: "INR 3-16 LPA",
  },
  Government: {
    overview: "A public-service career involving administration, defence, governance, public policy, security, or national development.",
    courses: ["Any Graduation", "UPSC/SSC/State Exam Preparation", "Public Administration", "Defence Training"],
    skills: ["General Awareness", "Discipline", "Decision Making", "Leadership"],
    avgSalary: "INR 4-18 LPA",
  },
  Social: {
    overview: "A people-focused career involving education, social impact, counselling, hospitality, languages, public service, or community support.",
    courses: ["BA", "B.Ed", "BSW", "MSW", "Diploma or Professional Training"],
    skills: ["Communication", "Empathy", "Organization", "Public Interaction"],
    avgSalary: "INR 2.5-12 LPA",
  },
};

const careerTitles = {
  Technical: [
    "Software Engineer", "Web Developer", "Mobile App Developer", "Full Stack Developer", "Frontend Developer", "Backend Developer", "DevOps Engineer", "Cloud Engineer", "Site Reliability Engineer", "Data Scientist", "Data Analyst", "Machine Learning Engineer", "AI Engineer", "Cyber Security Analyst", "Ethical Hacker", "Network Engineer", "Database Administrator", "Systems Analyst", "IT Support Specialist", "QA Tester", "Automation Test Engineer", "Game Developer", "Blockchain Developer", "Robotics Engineer", "IoT Engineer", "Embedded Systems Engineer", "Electronics Engineer", "Electrical Engineer", "Mechanical Engineer", "Civil Engineer", "Chemical Engineer", "Aerospace Engineer", "Automobile Engineer", "Marine Engineer", "Petroleum Engineer", "Mining Engineer", "Biomedical Engineer", "Environmental Engineer", "Industrial Engineer", "Product Manager", "Technical Writer", "UI UX Designer"
  ],
  Medical: [
    "Doctor", "Surgeon", "Dentist", "Nurse", "Pharmacist", "Physiotherapist", "Occupational Therapist", "Veterinarian", "Psychiatrist", "Psychologist", "Clinical Psychologist", "Radiologist", "Pathologist", "Dermatologist", "Cardiologist", "Neurologist", "Pediatrician", "Gynecologist", "Anesthesiologist", "Ophthalmologist", "Optometrist", "Dietitian", "Nutritionist", "Medical Lab Technologist", "Paramedic", "Public Health Officer", "Hospital Administrator", "Ayurvedic Doctor", "Homeopathic Doctor", "Medical Representative"
  ],
  Creative: [
    "Graphic Designer", "Animator", "Fashion Designer", "Interior Designer", "Product Designer", "Industrial Designer", "Photographer", "Videographer", "Film Director", "Video Editor", "Content Writer", "Copywriter", "Journalist", "Author", "Screenwriter", "Creative Director", "Art Director", "Illustrator", "Fine Artist", "Music Composer", "Singer", "Actor", "Dancer", "Choreographer", "Makeup Artist", "Cinematographer", "Radio Jockey", "Event Planner", "Social Media Manager", "Digital Content Creator"
  ],
  Business: [
    "Accountant", "Chartered Accountant", "Company Secretary", "Cost Accountant", "Actuary", "Investment Banker", "Financial Analyst", "Banker", "Bank PO", "Insurance Advisor", "Stock Broker", "Business Analyst", "Marketing Manager", "Sales Manager", "Brand Manager", "Human Resource Manager", "Operations Manager", "Supply Chain Manager", "Logistics Manager", "Retail Manager", "Hotel Manager", "Entrepreneur", "Startup Founder", "Management Consultant", "Real Estate Consultant", "Tax Consultant", "Auditor", "Economist", "E-commerce Manager", "Export Import Manager"
  ],
  Legal: [
    "Lawyer", "Advocate", "Corporate Lawyer", "Criminal Lawyer", "Civil Lawyer", "Judge", "Legal Advisor", "Legal Analyst", "Compliance Officer", "Company Law Consultant", "Intellectual Property Lawyer", "Cyber Law Expert", "Tax Lawyer", "Human Rights Lawyer", "Public Prosecutor", "Notary", "Legal Journalist", "Arbitrator", "Mediator", "Paralegal"
  ],
  Science: [
    "Scientist", "Research Scientist", "Biotechnologist", "Microbiologist", "Biochemist", "Chemist", "Physicist", "Mathematician", "Statistician", "Zoologist", "Botanist", "Agricultural Scientist", "Food Technologist", "Forensic Scientist", "Geologist", "Meteorologist", "Astronomer", "Environmental Scientist", "Marine Biologist", "Wildlife Biologist", "Geneticist", "Nanotechnologist", "Lab Technician", "Research Assistant", "Data Researcher"
  ],
  Government: [
    "IAS Officer", "IPS Officer", "IFS Officer", "IRS Officer", "State Civil Services Officer", "Defence Officer", "Army Officer", "Navy Officer", "Air Force Officer", "Police Officer", "Sub Inspector", "Government Teacher", "Railway Officer", "SSC Officer", "Forest Officer", "Public Sector Engineer", "Public Policy Analyst", "Diplomat", "Customs Officer", "Income Tax Officer", "Municipal Officer", "Panchayat Development Officer", "Clerk", "Postal Officer", "Intelligence Officer"
  ],
  Social: [
    "Teacher", "Professor", "Lecturer", "School Principal", "Career Counselor", "Counselor", "Social Worker", "NGO Manager", "Translator", "Interpreter", "Librarian", "Tour Guide", "Travel Consultant", "Air Hostess", "Cabin Crew", "Chef", "Baker", "Fitness Trainer", "Yoga Instructor", "Sports Coach", "Athlete", "Beautician", "Child Care Worker", "Special Educator", "Speech Therapist", "Public Relations Officer", "Customer Success Manager", "Community Manager", "Rural Development Officer", "Urban Planner"
  ],
};

const overrides = {
  "Software Engineer": { courses: ["B.Tech CSE", "BCA", "MCA", "Coding Bootcamps"], skills: ["Programming", "DSA", "System Design", "Debugging"], avgSalary: "INR 6-25 LPA" },
  "Doctor": { courses: ["MBBS", "MD/MS", "NEET"], skills: ["Diagnosis", "Medical Knowledge", "Empathy", "Clinical Decision Making"], avgSalary: "INR 8-30 LPA" },
  "Chartered Accountant": { courses: ["CA Foundation", "CA Intermediate", "CA Final", "Articleship"], skills: ["Accounting", "Taxation", "Audit", "Financial Reporting"], avgSalary: "INR 7-25 LPA" },
  "IAS Officer": { courses: ["Any Graduation", "UPSC CSE Preparation"], skills: ["Governance", "Leadership", "Decision Making", "General Studies"], avgSalary: "INR 8-18 LPA" },
  "Data Scientist": { courses: ["B.Tech", "B.Sc Statistics", "M.Sc Data Science", "Python/ML Certifications"], skills: ["Python", "Statistics", "Machine Learning", "Data Visualization"], avgSalary: "INR 8-30 LPA" },
};

const careers = Object.entries(careerTitles).flatMap(([category, titles]) =>
  titles.map((title) => {
    const base = categoryDefaults[category];
    const extra = overrides[title] || {};
    return {
      id: 0,
      title,
      category,
      overview: extra.overview || `${title} is ${base.overview.charAt(0).toLowerCase()}${base.overview.slice(1)}`,
      courses: extra.courses || base.courses,
      skills: extra.skills || base.skills,
      avgSalary: extra.avgSalary || base.avgSalary,
    };
  })
).map((career, index) => ({ ...career, id: index + 1 }));

router.get("/all", (req, res) => {
  res.json(careers);
});

module.exports = router;
