import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { MapPin, Heart } from "lucide-react";

/* ================= TYPES ================= */

interface College {
  id: number;
  name: string;
  location: string;
  distance?: string;
}

interface CollegesProps {
  onCollegeClick: (college: College) => void;
}

/* ================= COMPONENT ================= */

export function Colleges({ onCollegeClick }: CollegesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedColleges, setSavedColleges] = useState<number[]>([]);

  /* ================= PAGE LOAD → NEARBY ================= */

  useEffect(() => {
    fetchNearbyColleges();
  }, []);

  /* ================= MAIN SEARCH BUTTON ================= */

  const handleSearch = async () => {
    setLoading(true);

    // If user typed something → use database search
    if (searchQuery.trim() !== "") {
      await fetchFromDatabase(searchQuery);
      setLoading(false);
      return;
    }

    // If empty → show nearby again
    await fetchNearbyColleges();
    setLoading(false);
  };

  /* ================= DATABASE SEARCH ================= */

  const fetchFromDatabase = async (query: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/search?query=${query}`
      );

      const data = await response.json();

      const formatted = (data.results || []).map(
        (item: any, index: number) => ({
          id: index,
          name: item.college_name,
          location: `${item.district}, ${item.state}`,
        })
      );

      setColleges(formatted);
    } catch (error) {
      console.error("Database search failed:", error);
      setColleges([]);
    }
  };

  /* ================= NEARBY SEARCH ================= */

  const fetchNearbyColleges = async () => {
    if (!navigator.geolocation) {
      setColleges([]);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await fetch(
            "http://localhost:5000/api/search/smart",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                query: "",
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              }),
            }
          );

          const data = await response.json();
          setColleges(data.results || []);
        } catch (error) {
          console.error("Nearby search failed:", error);
          setColleges([]);
        }
      },
      () => {
        setColleges([]);
      }
    );
  };

  /* ================= SAVE BUTTON ================= */

  const toggleSave = (id: number) => {
    setSavedColleges((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container mx-auto px-4">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">
            Find Your Dream College
          </h1>
          <p className="text-gray-600">
            Discover nearby colleges or search by city or name
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex gap-2">
            <Input
              placeholder="Search city or college name (Mumbai, Pune...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              className="h-12 rounded-xl"
            />
            <Button className="h-12 px-6" onClick={handleSearch}>
              Search
            </Button>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-center text-blue-600 mb-6">
            Fetching colleges...
          </div>
        )}

        {/* COUNT */}
        {!loading && (
          <div className="text-sm text-gray-600 mb-6 text-center">
            Showing {colleges.length} colleges
          </div>
        )}

        {/* COLLEGE CARDS */}
        <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {colleges.map((college) => (
            <Card
              key={college.id}
              className="p-6 hover:shadow-xl cursor-pointer"
              onClick={() => onCollegeClick(college)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    {college.name}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    {college.location}
                  </div>

                  {college.distance && (
                    <div className="text-sm text-blue-600 mt-2">
                      {college.distance} km away
                    </div>
                  )}
                </div>

                <Heart
                  className={`h-5 w-5 ${
                    savedColleges.includes(college.id)
                      ? "fill-red-500 text-red-500"
                      : "text-gray-400"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSave(college.id);
                  }}
                />
              </div>
            </Card>
          ))}
        </div>

        {/* NO RESULTS */}
        {!loading && colleges.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No colleges found.
          </div>
        )}
      </div>
    </div>
  );
}