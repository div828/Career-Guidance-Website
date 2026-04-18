import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Career {
  id: number | null;
  title: string;
  category: string;
  overview: string;
  courses: string[];
  skills: string[];
  avgSalary: string;
}

export const CareerOptionsFinal = () => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [filtered, setFiltered] = useState<Career[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [alphabet, setAlphabet] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const openCareerDetails = (careerTitle: string) => {
    const careerPageMap: Record<string, string> = {
      accountant: "https://www.careers360.com/careers/accountant",
      actuary: "https://www.careers360.com/careers/actuary",
      advocate: "https://www.careers360.com/careers/advocate",
      "agricultural scientist":
        "https://www.careers360.com/careers/agricultural-scientist",
      engineering: "https://www.careers360.com/careers/engineer",
      "air hostess": "https://www.careers360.com/careers/air-hostess",
      architect: "https://www.careers360.com/careers/architect",
      "army officer":
        "https://www.careers360.com/careers/indian-army-officer",
      banker: "https://www.careers360.com/careers/banker",
      biochemist: "https://www.careers360.com/careers/biochemist",
      "brand manager": "https://www.careers360.com/careers/brand-manager",
      "career counselor":
        "https://www.careers360.com/careers/career-counsellor",
      "chartered accountant":
        "https://www.careers360.com/careers/chartered-accountant",
      chemist: "https://www.careers360.com/careers/chemist",
      "civil engineer": "https://www.careers360.com/careers/civil-engineer",
      doctor: "https://www.careers360.com/careers/doctor",
      "electrical engineer":
        "https://www.careers360.com/careers/electrical-engineer",
      "electronics engineer":
        "https://www.careers360.com/careers/electronics-engineer",
      "graphic designer": "https://www.careers360.com/careers/graphic-designer",
      "full stack developer":
        "https://www.careers360.com/careers/full-stack-developer",
      "game developer": "https://www.careers360.com/careers/game-developer",
      journalist: "https://www.careers360.com/careers/journalist",
      lawyer: "https://www.careers360.com/careers/lawyer",
      "mechanical engineer":
        "https://www.careers360.com/careers/mechanical-engineer",
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
      zoologist: "https://www.careers360.com/careers/zoologist",
    };

    const normalizedTitle = careerTitle.trim().toLowerCase();
    const careerUrl =
      careerPageMap[normalizedTitle] ||
      `https://www.google.com/search?btnI=I&q=${encodeURIComponent(
        `${careerTitle} site:careers360.com/careers OR site:shiksha.com/careers OR site:leverageedu.com/blog career path eligibility subjects colleges salary`
      )}`;

    window.open(careerUrl, "_blank", "noopener,noreferrer");
  };

  const confirmAndOpenCareer = (career: Career) => {
    const shouldOpen = window.confirm(
      `You will be redirected to an external site in a new tab for more details about ${career.title}, including what to study, eligibility, entrance exams, colleges, subjects, and the full step-by-step path.\n\nDo you want to continue?`
    );

    if (shouldOpen) {
      openCareerDetails(career.title);
    }
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

  const alphabetFilters = ["All", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];

  const categoryStyles: Record<string, { bg: string; badge: string }> = {
    Technical: { bg: "bg-blue-100 text-blue-700", badge: "bg-blue-100 text-blue-700" },
    Medical: { bg: "bg-pink-100 text-pink-700", badge: "bg-pink-100 text-pink-700" },
    Creative: { bg: "bg-purple-100 text-purple-700", badge: "bg-purple-100 text-purple-700" },
    Business: { bg: "bg-yellow-100 text-yellow-700", badge: "bg-yellow-100 text-yellow-700" },
    Legal: { bg: "bg-slate-200 text-slate-700", badge: "bg-slate-200 text-slate-700" },
    Science: { bg: "bg-green-100 text-green-700", badge: "bg-green-100 text-green-700" },
    Government: { bg: "bg-indigo-100 text-indigo-700", badge: "bg-indigo-100 text-indigo-700" },
    Social: { bg: "bg-orange-100 text-orange-700", badge: "bg-orange-100 text-orange-700" },
  };

  const summarizeOverview = (overview: string) =>
    overview.length > 140 ? `${overview.slice(0, 140).trim()}...` : overview;

  useEffect(() => {
    fetch("http://localhost:5000/api/career/all")
      .then((res) => res.json())
      .then((data) => {
        setCareers(data);
        setFiltered(data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    let temp = careers;

    if (category !== "All") {
      temp = temp.filter((career) => career.category === category);
    }

    if (search) {
      temp = temp.filter((career) =>
        career.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (alphabet !== "All") {
      temp = temp.filter((career) =>
        career.title.toUpperCase().startsWith(alphabet)
      );
    }

    setFiltered(temp);
  }, [search, category, alphabet, careers]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, alphabet]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginatedCareers = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const startItem = filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, filtered.length);

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-cyan-50 to-white px-4 py-12 sm:px-6 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center pt-4">
          <h1 className="text-4xl font-bold leading-tight text-gray-800 md:text-5xl lg:text-6xl">
            Explore Career Options in India
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-gray-600 md:text-lg">
            Discover detailed information about various career paths,
            required courses, skills, and salary expectations
          </p>
        </div>

        <div className="mb-12 rounded-[28px] border border-teal-100 bg-white/90 px-5 py-6 shadow-lg shadow-teal-100/60 sm:px-7 sm:py-7">
          <div className="mb-6 flex justify-center">
            <input
              type="text"
              placeholder="Search careers..."
              className="w-full max-w-2xl rounded-full border border-teal-100 bg-white px-5 py-3.5 text-center shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <div className="rounded-full bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700">
              {filtered.length} careers
            </div>

            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                  category === cat
                    ? "border-teal-500 bg-teal-500 text-white shadow"
                    : "border-gray-200 bg-white text-gray-700 hover:border-teal-200 hover:bg-teal-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mt-5 flex justify-center">
            <div className="flex max-w-5xl flex-wrap items-center justify-center gap-2 rounded-3xl bg-teal-50/80 px-4 py-3">
              {alphabetFilters.map((letter) => (
                <button
                  key={letter}
                  onClick={() => setAlphabet(letter)}
                  className={`h-9 min-w-9 rounded-full px-3 text-xs font-semibold transition-all ${
                    alphabet === letter
                      ? "bg-teal-500 text-white shadow"
                      : "bg-white text-gray-600 hover:bg-teal-100 hover:text-teal-700"
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {paginatedCareers.length > 0 ? (
            paginatedCareers.map((career) => {
              const style = categoryStyles[career.category] || {
                bg: "bg-gray-100 text-gray-700",
                badge: "bg-gray-100 text-gray-700",
              };

              return (
                <motion.div
                  key={career.id ?? career.title}
                  role="button"
                  tabIndex={0}
                  onClick={() => confirmAndOpenCareer(career)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      confirmAndOpenCareer(career);
                    }
                  }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 360, damping: 22 }}
                  className={`flex h-full cursor-pointer flex-col rounded-[26px] border border-teal-100 bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                    paginatedCareers.length === 1
                      ? "md:col-span-2 xl:col-span-3 xl:mx-auto xl:max-w-2xl"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm ${style.bg}`}
                    >
                      <div className="h-4 w-4 rounded-full bg-current opacity-80" />
                    </div>
                    <span
                      className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium ${style.badge}`}
                    >
                      {career.category}
                    </span>
                  </div>

                  <div className="mt-5 flex-1">
                    <h3 className="text-2xl font-semibold leading-tight text-gray-800">
                      {career.title}
                    </h3>
                    <p className="mt-4 min-h-[96px] text-sm leading-7 text-gray-500">
                      {summarizeOverview(career.overview)}
                    </p>
                  </div>

                  <div className="mt-5 space-y-3 rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-gray-700">Courses</span>
                      <span className="text-sm text-gray-600">{career.courses.length} options</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-gray-700">Skills</span>
                      <span className="text-sm text-gray-600">{career.skills.length} key skills</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-gray-700">Salary</span>
                      <span className="text-sm font-medium text-teal-600">{career.avgSalary}</span>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-teal-600">
                      Click to view full guide
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmAndOpenCareer(career);
                      }}
                      className="rounded-full bg-teal-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-teal-600"
                    >
                      Explore in detail
                    </button>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <p className="col-span-3 py-10 text-center text-gray-500">No careers found</p>
          )}
        </div>

        {filtered.length > 0 ? (
          <div className="mt-10 flex flex-col items-center gap-4">
            <p className="text-sm text-gray-600">
              Showing {startItem}-{endItem} of {filtered.length} careers
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="rounded-full border border-teal-200 bg-white px-4 py-2 text-sm font-semibold text-teal-700 transition hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`h-10 min-w-10 rounded-full px-3 text-sm font-semibold transition ${
                      currentPage === page
                        ? "bg-teal-500 text-white shadow"
                        : "border border-gray-200 bg-white text-gray-700 hover:bg-teal-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages}
                className="rounded-full border border-teal-200 bg-white px-4 py-2 text-sm font-semibold text-teal-700 transition hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </div>

    </div>
  );
};
