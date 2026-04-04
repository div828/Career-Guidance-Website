import { useEffect, useState } from "react";

interface College {
  college_name: string;
  district: string;
  state: string;
  university_name: string;
  course_category: string;
  college_type: string;
}

interface SearchPageProps {
  query: string;
  onNavigate: (page: string, query?: string) => void;
}

export default function SearchPage({ query, onNavigate }: SearchPageProps) {
  const [results, setResults] = useState<College[]>([]);
  const [searchInput, setSearchInput] = useState(query);
  const [category, setCategory] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const limit = 10;

  /* 🔁 Sync input when query prop changes */
  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  /* 🔍 Fetch results whenever filters change */
  useEffect(() => {
    if (!query) return;
    fetchResults();
  }, [query, category, stateFilter, page]);

  const fetchResults = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/search?query=${query}&category=${category}&state=${stateFilter}&page=${page}&limit=${limit}`
      );

      const data = await res.json();

      setResults(Array.isArray(data.results) ? data.results : []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
      setTotal(0);
    }
  };

  const totalPages = Math.ceil(total / limit);

  /* 🔎 Handle New Search */
  const handleSearch = () => {
    if (!searchInput.trim()) return;

    setPage(1); // Reset pagination
    onNavigate("search", searchInput.trim());
  };

  return (
    <div className="p-8">

      {/* Back */}
      <button
        onClick={() => onNavigate("home")}
        className="mb-4 text-teal-600"
      >
        ← Back to Home
      </button>

      {/* 🔎 Search Bar */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search colleges..."
          className="border p-2 w-80 rounded"
        />

        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-teal-500 text-white rounded"
        >
          Search
        </button>

        {/* Category Filter */}
        <select
          value={category}
          onChange={(e) => {
            setPage(1);
            setCategory(e.target.value);
          }}
          className="border p-2 rounded"
        >
          <option value="">All Categories</option>
          <option value="Engineering">Engineering</option>
          <option value="Medical">Medical</option>
          <option value="Management">Management</option>
        </select>

        {/* State Filter */}
        <select
          value={stateFilter}
          onChange={(e) => {
            setPage(1);
            setStateFilter(e.target.value);
          }}
          className="border p-2 rounded"
        >
          <option value="">All States</option>
          <option value="Maharashtra">Maharashtra</option>
          <option value="Karnataka">Karnataka</option>
        </select>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold mb-4">
        Results for "{query}"
      </h2>

      {/* RESULTS */}
      {results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        results.map((college, index) => (
          <div
            key={`${college.college_name}-${index}`}
            className="border p-4 rounded mb-4 shadow"
          >
            <h3 className="font-semibold text-lg">
              {college.college_name}
            </h3>

            <p>{college.district}, {college.state}</p>

            {college.university_name && (
              <p>{college.university_name}</p>
            )}

            <p>
              {college.course_category} | {college.college_type}
            </p>
          </div>
        ))
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex gap-4 mt-6 items-center">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-teal-500 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
