import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Search,
  Stethoscope,
  Code,
  Palette,
  Briefcase,
  Scale,
  Plane,
  Sprout,
  Shield,
  Building,
  Microscope,
  GraduationCap,
  TrendingUp,
} from "lucide-react";

interface Career {
  id: string;
  title: string;
  icon: any;
  category: string;
  overview: string;
  courses: string[];
  skills: string[];
  jobRoles: string[];
  avgSalary: string;
  color: string;
}

const careers: Career[] = [
  {
    id: "engineering",
    title: "Engineering",
    icon: Code,
    category: "Technical",
    overview: "Design, build, and maintain various systems, structures, and technologies.",
    courses: ["B.Tech/B.E.", "M.Tech", "Diploma in Engineering"],
    skills: ["Problem Solving", "Mathematics", "Technical Design", "Innovation"],
    jobRoles: ["Software Engineer", "Civil Engineer", "Mechanical Engineer", "Electrical Engineer"],
    avgSalary: "₹3.5 - 15 LPA",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "medicine",
    title: "Medicine & Healthcare",
    icon: Stethoscope,
    category: "Medical",
    overview: "Diagnose, treat, and prevent diseases to improve human health and well-being.",
    courses: ["MBBS", "BDS", "BAMS", "BHMS", "B.Pharm", "Nursing"],
    skills: ["Empathy", "Attention to Detail", "Scientific Knowledge", "Communication"],
    jobRoles: ["Doctor", "Surgeon", "Dentist", "Pharmacist", "Nurse"],
    avgSalary: "₹4 - 25 LPA",
    color: "from-red-500 to-pink-500",
  },
  {
    id: "design",
    title: "Design & Arts",
    icon: Palette,
    category: "Creative",
    overview: "Create visual, functional, and aesthetic solutions across various mediums.",
    courses: ["B.Des", "BFA", "Fashion Design", "Animation", "Interior Design"],
    skills: ["Creativity", "Visual Thinking", "Software Proficiency", "Aesthetics"],
    jobRoles: ["Graphic Designer", "UI/UX Designer", "Fashion Designer", "Animator", "Interior Designer"],
    avgSalary: "₹2.5 - 12 LPA",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "commerce",
    title: "Commerce & Management",
    icon: Briefcase,
    category: "Business",
    overview: "Manage businesses, finances, and commercial operations effectively.",
    courses: ["B.Com", "BBA", "MBA", "CA", "CS", "CMA"],
    skills: ["Leadership", "Financial Analysis", "Strategic Thinking", "Communication"],
    jobRoles: ["Accountant", "Business Analyst", "Manager", "Consultant", "Entrepreneur"],
    avgSalary: "₹3 - 20 LPA",
    color: "from-green-500 to-teal-500",
  },
  {
    id: "law",
    title: "Law & Legal Services",
    icon: Scale,
    category: "Legal",
    overview: "Uphold justice, represent clients, and navigate the legal system.",
    courses: ["LLB", "BA LLB", "BBA LLB", "LLM"],
    skills: ["Analytical Thinking", "Research", "Communication", "Ethics"],
    jobRoles: ["Lawyer", "Corporate Lawyer", "Judge", "Legal Advisor", "Public Prosecutor"],
    avgSalary: "₹3 - 18 LPA",
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "aviation",
    title: "Aviation & Aerospace",
    icon: Plane,
    category: "Technical",
    overview: "Operate and manage aircraft, airports, and aerospace technologies.",
    courses: ["Commercial Pilot License", "B.Tech Aerospace", "Aviation Management"],
    skills: ["Technical Knowledge", "Decision Making", "Alertness", "Communication"],
    jobRoles: ["Pilot", "Air Traffic Controller", "Aircraft Engineer", "Flight Attendant"],
    avgSalary: "₹4 - 30 LPA",
    color: "from-sky-500 to-blue-500",
  },
  {
    id: "agriculture",
    title: "Agriculture & Food Science",
    icon: Sprout,
    category: "Science",
    overview: "Develop sustainable farming practices and food production systems.",
    courses: ["B.Sc Agriculture", "B.Tech Food Technology", "Horticulture"],
    skills: ["Scientific Knowledge", "Sustainability", "Research", "Management"],
    jobRoles: ["Agricultural Officer", "Food Technologist", "Research Scientist", "Farm Manager"],
    avgSalary: "₹2.5 - 10 LPA",
    color: "from-lime-500 to-green-500",
  },
  {
    id: "defence",
    title: "Defence & Armed Forces",
    icon: Shield,
    category: "Government",
    overview: "Serve the nation through military, navy, air force, or paramilitary services.",
    courses: ["NDA", "CDS", "AFCAT", "Technical Entry Scheme"],
    skills: ["Physical Fitness", "Leadership", "Discipline", "Strategic Thinking"],
    jobRoles: ["Army Officer", "Navy Officer", "Air Force Officer", "Paramilitary Personnel"],
    avgSalary: "₹5 - 15 LPA",
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "architecture",
    title: "Architecture",
    icon: Building,
    category: "Creative",
    overview: "Design and plan buildings, structures, and urban spaces.",
    courses: ["B.Arch", "M.Arch", "Urban Planning"],
    skills: ["Design Thinking", "Technical Drawing", "Creativity", "Project Management"],
    jobRoles: ["Architect", "Urban Planner", "Landscape Architect", "Interior Architect"],
    avgSalary: "₹3 - 15 LPA",
    color: "from-indigo-500 to-purple-500",
  },
  {
    id: "science",
    title: "Pure Sciences & Research",
    icon: Microscope,
    category: "Science",
    overview: "Conduct research and advance knowledge in physics, chemistry, biology, and mathematics.",
    courses: ["B.Sc", "M.Sc", "PhD", "Research Programs"],
    skills: ["Analytical Thinking", "Research", "Scientific Method", "Data Analysis"],
    jobRoles: ["Research Scientist", "Lab Technician", "Data Analyst", "Professor"],
    avgSalary: "₹3 - 12 LPA",
    color: "from-violet-500 to-purple-500",
  },
  {
    id: "education",
    title: "Education & Teaching",
    icon: GraduationCap,
    category: "Social",
    overview: "Educate and mentor students across various subjects and age groups.",
    courses: ["B.Ed", "M.Ed", "D.El.Ed", "Subject-specific degrees"],
    skills: ["Communication", "Patience", "Subject Knowledge", "Mentoring"],
    jobRoles: ["Teacher", "Professor", "Education Counselor", "Principal", "Tutor"],
    avgSalary: "₹2.5 - 10 LPA",
    color: "from-cyan-500 to-blue-500",
  },
  {
    id: "civilservices",
    title: "Civil Services",
    icon: TrendingUp,
    category: "Government",
    overview: "Serve in administrative roles and implement government policies.",
    courses: ["Any Bachelor's Degree + UPSC Preparation"],
    skills: ["Leadership", "Decision Making", "Public Administration", "Ethics"],
    jobRoles: ["IAS Officer", "IPS Officer", "IFS Officer", "IRS Officer"],
    avgSalary: "₹5 - 20 LPA",
    color: "from-rose-500 to-red-500",
  },
];

export function CareerOptions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(careers.map((c) => c.category)));

  const filteredCareers = careers.filter((career) => {
    const matchesSearch =
      career.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      career.overview.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || career.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Explore Career Options in India
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover detailed information about various career paths, required
            courses, skills, and salary expectations
          </p>
        </div>

        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search careers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-white border-2 border-gray-200 focus:border-teal-500 rounded-xl"
            />
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            <Badge
              variant={selectedCategory === null ? "default" : "outline"}
              className={`cursor-pointer px-4 py-2 ${
                selectedCategory === null
                  ? "bg-teal-500 hover:bg-teal-600"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setSelectedCategory(null)}
            >
              All Categories
            </Badge>
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`cursor-pointer px-4 py-2 ${
                  selectedCategory === category
                    ? "bg-teal-500 hover:bg-teal-600"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Career Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCareers.map((career) => (
            <Card
              key={career.id}
              className="p-6 hover:shadow-xl transition-all duration-300 border-2 hover:border-teal-500"
            >
              <div
                className={`h-14 w-14 rounded-xl bg-gradient-to-br ${career.color} flex items-center justify-center mb-4`}
              >
                <career.icon className="h-7 w-7 text-white" />
              </div>

              <div className="mb-3">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {career.title}
                </h3>
                <Badge variant="secondary">{career.category}</Badge>
              </div>

              <p className="text-sm text-gray-600 mb-4">{career.overview}</p>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">
                    Recommended Courses:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {career.courses.slice(0, 3).map((course, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {course}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">
                    Required Skills:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {career.skills.slice(0, 3).map((skill, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">
                    Job Roles:
                  </h4>
                  <ul className="space-y-1">
                    {career.jobRoles.slice(0, 3).map((role, idx) => (
                      <li key={idx} className="text-xs text-gray-600 flex items-center gap-2">
                        <div className="h-1 w-1 rounded-full bg-teal-500" />
                        {role}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Avg. Salary</span>
                    <span className="text-sm font-semibold text-teal-600">
                      {career.avgSalary}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredCareers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No careers found matching your search criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
