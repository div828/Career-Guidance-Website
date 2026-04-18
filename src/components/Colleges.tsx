import React, { useState, useEffect, useRef } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
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
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const hasSkippedFirstSearchEffect = useRef(false);

  /* ================= PAGE LOAD → GET USER LOCATION ================= */

  useEffect(() => {
    // Get user location on mount
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLat(position.coords.latitude);
          setUserLng(position.coords.longitude);
          fetchNearbyColleges(position.coords.latitude, position.coords.longitude);
        },
        () => {
          // If geolocation fails, load all colleges
          fetchNearbyColleges();
        }
      );
    } else {
      fetchNearbyColleges();
    }
  }, []);

  useEffect(() => {
    if (!hasSkippedFirstSearchEffect.current) {
      hasSkippedFirstSearchEffect.current = true;
      return;
    }

    const trimmedQuery = searchQuery.trim();

    const timeoutId = window.setTimeout(async () => {
      setLoading(true);

      if (trimmedQuery) {
        await fetchFromDatabase(trimmedQuery);
      } else {
        await fetchNearbyColleges(userLat ?? undefined, userLng ?? undefined);
      }

      setLoading(false);
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchQuery, userLat, userLng]);

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
    await fetchNearbyColleges(userLat ?? undefined, userLng ?? undefined);
    setLoading(false);
  };

  /* ================= DATABASE SEARCH WITH USER LOCATION ================= */

  const fetchFromDatabase = async (query: string) => {
    try {
      const params = new URLSearchParams();
      params.append('query', query);
      if (userLat !== null && userLng !== null) {
        params.append('latitude', String(userLat));
        params.append('longitude', String(userLng));
      }

      const response = await fetch(
        `http://localhost:5000/api/search/maharashtra/search?${params.toString()}`
      );

      const data = await response.json();

      const formatted = (data.results || []).map(
        (item: any) => ({
          id: item.id || 0,
          name: item.college_name,
          location: `${item.district}, ${item.state}`,
          distance: item.distance ? `${Number(item.distance).toFixed(1)} km away` : undefined,
        })
      );

      setColleges(formatted);
    } catch (error) {
      console.error("Database search failed:", error);
      setColleges([]);
    }
  };

  /* ================= MAHARASHTRA COLLEGES WITH LOCATION SORTING ================= */

  const fetchNearbyColleges = async (lat?: number, lng?: number) => {
    try {
      const params = new URLSearchParams();
      params.append('limit', '100');
      if (lat !== undefined && lng !== undefined) {
        params.append('latitude', String(lat));
        params.append('longitude', String(lng));
      }

      const response = await fetch(
        `http://localhost:5000/api/search/maharashtra/all?${params.toString()}`
      );

      const data = await response.json();
      const formatted = (data.results || []).map((item: any) => ({
        id: item.id || 0,
        name: item.college_name,
        location: `${item.district}, ${item.state}`,
        distance: item.distance ? `${Number(item.distance).toFixed(1)} km away` : undefined,
      }));
      setColleges(formatted);
    } catch (error) {
      console.error("Maharashtra search failed:", error);
      setColleges([]);
    }
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
                      {college.distance}
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
