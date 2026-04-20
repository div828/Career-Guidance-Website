import { useEffect, useState } from "react";

interface Career {
  id: number;
  title: string;
  category: string;
  overview: string;
  courses: string[];
  skills: string[];
  avgSalary: string;
}

export const CareerOptions = () => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [filtered, setFiltered] = useState<Career[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const openCareerDetails = (careerTitle: string) => {
    const careerPageMap: Record<string, string> = {
      engineering: "https://www.careers360.com/careers/engineer",
      doctor: "https://www.careers360.com/careers/doctor",
      "graphic designer": "https://www.careers360.com/careers/graphic-designer",
      lawyer: "https://www.careers360.com/careers/lawyer",
      "data scientist": "https://www.careers360.com/careers/data-scientist",
      "software engineer": "https://www.careers360.com/careers/software-engineer",
      "cyber security expert": "https://www.careers360.com/careers/cyber-security-expert",
      "ai engineer": "https://www.careers360.com/careers/artificial-intelligence-engineer",
      "web developer": "https://www.careers360.com/careers/web-developer",
      dentist: "https://www.careers360.com/careers/dentist",
      pharmacist: "https://www.careers360.com/careers/pharmacist",
      nurse: "https://www.careers360.com/careers/nurse",
      "ui/ux designer": "https://www.careers360.com/careers/ui-ux-designer",
      animator: "https://www.careers360.com/careers/animator",
      "fashion designer": "https://www.careers360.com/careers/fashion-designer",
      "business analyst": "https://www.careers360.com/careers/business-analyst",
      "marketing manager": "https://www.careers360.com/careers/marketing-manager",
      entrepreneur: "https://www.careers360.com/careers/entrepreneur",
      judge: "https://www.careers360.com/careers/judge",
      scientist: "https://www.careers360.com/careers/scientist",
      biotechnologist: "https://www.careers360.com/careers/biotechnologist",
      "ias officer": "https://www.careers360.com/careers/ias-officer",
      "ips officer": "https://www.careers360.com/careers/ips-officer",
      "bank po": "https://www.careers360.com/careers/probationary-officer",
      teacher: "https://www.careers360.com/careers/teacher",
      "social worker": "https://www.careers360.com/careers/social-worker",
    };

    const normalizedTitle = careerTitle.trim().toLowerCase();
    const careerUrl =
      careerPageMap[normalizedTitle] ||
      `https://www.google.com/search?btnI=I&q=${encodeURIComponent(
        `${careerTitle} career path eligibility courses skills salary India`
      )}`;

    window.open(
      careerUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const categories = [
    "All",
    "Technical",
    "Medical",
    "Creative",
    "Business",
    "Legal",
    "Science",
    "Government",
    "Social",
  ];

    /* CATEGORY COLORS + ICONS */
  const categoryStyles: any = {
    Technical: { bg: "bg-blue-100", icon: "IT" },
    Medical: { bg: "bg-pink-100", icon: "MD" },
    Creative: { bg: "bg-purple-100", icon: "CR" },
    Business: { bg: "bg-yellow-100", icon: "BS" },
    Legal: { bg: "bg-gray-200", icon: "LW" },
    Science: { bg: "bg-green-100", icon: "SC" },
    Government: { bg: "bg-indigo-100", icon: "GV" },
    Social: { bg: "bg-orange-100", icon: "SO" },
  };

  /* ================= FETCH ================= */
  useEffect(() => {
    fetch("http://localhost:5000/api/career/all")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Career API error: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setCareers(data);
        setFiltered(data);
      })
      .catch((err) => console.error("Career fetch failed:", err));
  }, []);

  /* ================= FILTER ================= */
  useEffect(() => {
    let temp = careers;

    if (category !== "All") {
      temp = temp.filter((c) => c.category === category);
    }

    if (search) {
      temp = temp.filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(temp);
  }, [search, category, careers]);

  return (
    <div className="bg-gradient-to-b from-teal-50 to-white min-h-screen py-10 px-6">

      {/* ===== HEADER ===== */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">
          Explore Career Options in India
        </h1>
        <p className="text-gray-500 mt-2">
          Discover detailed information about various career paths,
          required courses, skills, and salary expectations
        </p>
      </div>

      {/* ===== SEARCH ===== */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search careers..."
          className="w-[500px] px-5 py-3 rounded-full border bg-white shadow-md text-center focus:outline-none focus:ring-2 focus:ring-teal-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ===== FILTER BUTTONS ===== */}
      <div className="flex justify-center gap-3 flex-wrap mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1 rounded-full text-sm border transition-all ${
              category === cat
                ? "bg-teal-500 text-white shadow"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ===== CARDS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">

        {filtered.length > 0 ? (
          filtered.map((c) => {
            const style = categoryStyles[c.category] || {
              bg: "bg-gray-100",
              icon: "CA",
            };

            return (
              <div
                key={c.id}
                role="button"
                tabIndex={0}
                onClick={() => openCareerDetails(c.title)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openCareerDetails(c.title);
                  }
                }}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-400"
              >
                {/* ICON */}
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-xl ${style.bg} text-xl mb-4 shadow-sm`}
                >
                  {style.icon}
                </div>

                {/* TITLE */}
                <h2 className="text-lg font-semibold text-gray-800 mb-1">
                  {c.title}
                </h2>

                {/* CATEGORY */}
                <span className="text-xs bg-gray-200 px-3 py-1 rounded-full text-gray-700">
                  {c.category}
                </span>

                {/* DESCRIPTION */}
                <p className="text-gray-500 mt-3 text-sm leading-relaxed">
                  {c.overview}
                </p>

                {/* COURSES */}
                <p className="mt-4 text-sm">
                  <span className="font-semibold text-gray-700">
                    Recommended Courses:
                  </span>{" "}
                  <span className="text-gray-600">
                    {c.courses.join(", ")}
                  </span>
                </p>

                {/* SKILLS */}
                <p className="text-sm mt-1">
                  <span className="font-semibold text-gray-700">
                    Required Skills:
                  </span>{" "}
                  <span className="text-gray-600">
                    {c.skills.join(", ")}
                  </span>
                </p>

                {/* SALARY */}
                <p className="text-sm mt-2">
                  <span className="font-semibold text-gray-700">
                    Salary:
                  </span>{" "}
                  <span className="text-teal-600 font-medium">
                    {c.avgSalary}
                  </span>
                </p>

                <p className="text-sm mt-4 text-teal-600 font-semibold">
                  Learn more about this career {"->"}
                </p>
              </div>
            );
          })
        ) : (
          <p className="col-span-3 text-center text-gray-500">
            No careers found
          </p>
        )}

      </div>
    </div>
  );
};

