import React, { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { MapPin, Heart, LocateFixed, RefreshCcw, Search, Sparkles } from "lucide-react";

interface College {
  id: number;
  name: string;
  location: string;
  distance?: string;
  address?: string;
  phone?: string;
  website?: string;
  rating?: number;
  initialView?: "details" | "website";
}

interface CollegesProps {
  onCollegeClick: (college: College) => void;
}

type ViewMode = "all" | "nearby" | "search";
type LocationStatus = "idle" | "requesting" | "granted" | "denied" | "unsupported" | "error";

const DEFAULT_LIMIT = 24;
const COLLEGES_CACHE_KEY = "dgp-colleges-page-cache";

const normalizeCollege = (item: any, index: number): College => ({
  id: Number(item.id ?? index + 1),
  name: item.college_name || item.name || "Unknown College",
  location:
    [item.city, item.district, item.state].filter(Boolean).join(", ") ||
    item.location ||
    item.address ||
    "India",
  address: item.address || [item.city, item.district, item.state].filter(Boolean).join(", "),
  website: "",
  phone: "",
  rating: item.rating ? Number(item.rating) : 4.2,
  distance: item.distance,
});

export function Colleges({ onCollegeClick }: CollegesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedColleges, setSavedColleges] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");
  const [statusMessage, setStatusMessage] = useState(
    "Browse colleges across India or allow location access to find nearby options."
  );

  useEffect(() => {
    const cached = sessionStorage.getItem(COLLEGES_CACHE_KEY);

    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setSearchQuery(parsed.searchQuery || "");
        setColleges(parsed.colleges || []);
        setSavedColleges(parsed.savedColleges || []);
        setViewMode(parsed.viewMode || "all");
        setLocationStatus(parsed.locationStatus || "idle");
        setStatusMessage(
          parsed.statusMessage ||
            "Browse colleges across India or allow location access to find nearby options."
        );
        return;
      } catch (error) {
        console.error("Failed to restore colleges cache:", error);
      }
    }

    void fetchAllIndiaColleges();
  }, []);

  useEffect(() => {
    sessionStorage.setItem(
      COLLEGES_CACHE_KEY,
      JSON.stringify({
        searchQuery,
        colleges,
        savedColleges,
        viewMode,
        locationStatus,
        statusMessage,
      })
    );
  }, [searchQuery, colleges, savedColleges, viewMode, locationStatus, statusMessage]);

  const fetchAllIndiaColleges = async () => {
    setLoading(true);
    setViewMode("all");
    setStatusMessage("Showing colleges from across India.");

    try {
      const response = await fetch(`http://localhost:5000/api/search?limit=${DEFAULT_LIMIT}`);
      const data = await response.json();
      setColleges((data.results || []).map(normalizeCollege));
    } catch (error) {
      console.error("All India colleges fetch failed:", error);
      setColleges([]);
      setStatusMessage("Unable to load colleges right now.");
    } finally {
      setLoading(false);
    }
  };

  const fetchFromDatabase = async (query: string) => {
    setLoading(true);
    setViewMode("search");
    setStatusMessage(`Showing results for "${query}".`);

    try {
      const response = await fetch(
        `http://localhost:5000/api/search?query=${encodeURIComponent(query)}&limit=${DEFAULT_LIMIT}`
      );
      const data = await response.json();
      setColleges((data.results || []).map(normalizeCollege));
    } catch (error) {
      console.error("Database search failed:", error);
      setColleges([]);
      setStatusMessage("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchNearbyColleges = async (latitude: number, longitude: number) => {
    setLoading(true);
    setViewMode("nearby");
    setStatusMessage("Finding colleges near your current location.");

    try {
      const response = await fetch("http://localhost:5000/api/search/smart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: searchQuery.trim(),
          latitude,
          longitude,
          radiusKm: 80,
          limit: 36,
        }),
      });
      const data = await response.json();
      const formatted = (data.results || []).map(normalizeCollege);
      setColleges(formatted);
      setStatusMessage(
        formatted.length
          ? "Showing colleges near your current location."
          : data.message || "No nearby colleges found. Search by city or college name."
      );
    } catch (error) {
      console.error("Nearby search failed:", error);
      setColleges([]);
      setStatusMessage("Could not fetch nearby colleges right now.");
    } finally {
      setLoading(false);
    }
  };

  const requestLocationAccess = () => {
    if (!navigator.geolocation) {
      setLocationStatus("unsupported");
      setStatusMessage("Location access is not supported in this browser. Search by city instead.");
      return;
    }

    setLocationStatus("requesting");
    setStatusMessage("Please allow location access so we can find nearby colleges.");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setLocationStatus("granted");
        await fetchNearbyColleges(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        setLocationStatus(error.code === 1 ? "denied" : "error");
        setStatusMessage(
          error.code === 1
            ? "Location permission was denied. You can still search colleges anywhere in India."
            : "We could not get your location. Please try again or search by city."
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  const handleSearch = async () => {
    const query = searchQuery.trim();
    if (query) {
      await fetchFromDatabase(query);
      return;
    }
    await fetchAllIndiaColleges();
  };

  const toggleSave = (id: number) => {
    setSavedColleges((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const openOfficialView = (college: College) => {
    onCollegeClick({ ...college, website: "", initialView: "details" });
  };

  const modeBadgeLabel =
    viewMode === "nearby" ? "Nearby colleges" : viewMode === "search" ? "Search results" : "All India colleges";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.15),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(45,212,191,0.16),_transparent_22%),linear-gradient(to_bottom,_#ecfeff,_#ffffff,_#f0fdfa)] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white/80 px-4 py-2 text-sm font-medium text-teal-700 shadow-sm">
            <Sparkles className="h-4 w-4" />
            Discover colleges with location-aware search
          </div>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
            Find Colleges Across India
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
            Allow your location to discover nearby colleges, or search by college name, city, district, or state.
          </p>
        </div>

        <div className="mb-10 rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_30px_80px_-38px_rgba(15,118,110,0.38)] backdrop-blur lg:p-8">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search by college name, city, district, or state"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void handleSearch();
                }}
                className="h-12 rounded-2xl border-slate-200 bg-white pl-11"
              />
            </div>
            <Button className="h-12 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 px-6 text-white shadow-sm hover:from-teal-600 hover:to-cyan-600" onClick={() => void handleSearch()}>
              Search Colleges
            </Button>
            <Button variant="outline" className="h-12 rounded-2xl border-teal-200 bg-white px-6 text-teal-700 hover:bg-teal-50" onClick={requestLocationAccess}>
              <LocateFixed className="h-4 w-4" />
              Use My Location
            </Button>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Badge className="rounded-full border-0 bg-gradient-to-r from-teal-50 to-cyan-50 px-3 py-1 text-teal-700">{modeBadgeLabel}</Badge>
            <Badge className="rounded-full border-0 bg-slate-100 px-3 py-1 text-slate-700">{colleges.length} colleges shown</Badge>
            <Button variant="ghost" className="h-9 rounded-full px-3 text-slate-600 hover:bg-slate-100" onClick={() => void fetchAllIndiaColleges()}>
              <RefreshCcw className="h-4 w-4" />
              Show All India
            </Button>
          </div>

          <div className="mt-5 rounded-[24px] border border-dashed border-teal-200 bg-gradient-to-r from-cyan-50 to-teal-50 p-4">
            <p className="text-sm font-medium text-slate-700">{statusMessage}</p>
            <p className="mt-2 text-sm text-slate-500">
              {locationStatus === "idle" && "We only use your location after you allow it in the browser prompt."}
              {locationStatus === "requesting" && "Waiting for your browser permission so we can detect nearby colleges."}
              {locationStatus === "granted" && "Location access granted. Nearby colleges are sorted by distance when available."}
              {locationStatus === "denied" && "Location was denied, so you can continue using search for any city or place in India."}
              {locationStatus === "unsupported" && "This browser does not support geolocation, so search is the best way to find colleges."}
              {locationStatus === "error" && "Something went wrong while getting your location. You can retry or search manually."}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="rounded-[28px] border border-teal-100 bg-white/80 py-14 text-center text-teal-700 shadow-sm">Fetching colleges for you...</div>
        ) : null}

        {!loading && colleges.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {colleges.map((college) => (
              <Card key={`${college.id}-${college.name}`} className="group relative cursor-pointer overflow-hidden rounded-[28px] border border-teal-100/80 bg-white/95 p-6 shadow-[0_16px_40px_-24px_rgba(13,148,136,0.45)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_28px_60px_-28px_rgba(8,145,178,0.42)]" onClick={() => onCollegeClick(college)}>
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 opacity-90" />
                <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-cyan-100/60 blur-2xl transition duration-300 group-hover:bg-teal-100/80" />
                <div className="relative flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <button type="button" onClick={(e) => { e.stopPropagation(); openOfficialView(college); }} className="line-clamp-2 text-left text-lg font-semibold leading-7 text-slate-900 transition hover:text-teal-600">
                      {college.name}
                    </button>
                    <div className="mt-3 flex items-start gap-2 text-sm leading-6 text-slate-600">
                      <MapPin className="mt-1 h-4 w-4 shrink-0 text-teal-600" />
                      <span>{college.location}</span>
                    </div>
                  </div>
                  <button type="button" className="rounded-full border border-transparent bg-white/80 p-2 shadow-sm transition hover:bg-rose-50" onClick={(e) => { e.stopPropagation(); toggleSave(college.id); }}>
                    <Heart className={`h-5 w-5 ${savedColleges.includes(college.id) ? "fill-rose-500 text-rose-500" : "text-slate-300"}`} />
                  </button>
                </div>
                <div className="relative mt-5 flex flex-wrap items-center gap-2">
                  {college.distance ? <Badge className="rounded-full border-0 bg-gradient-to-r from-teal-50 to-cyan-50 px-3 py-1 text-teal-700">{college.distance} km away</Badge> : null}
                  <Badge className="rounded-full border-0 bg-slate-100 px-3 py-1 text-slate-700">Rating {college.rating ?? 4.2}</Badge>
                  {viewMode === "nearby" ? <Badge className="rounded-full border-0 bg-emerald-50 px-3 py-1 text-emerald-700">Near you</Badge> : null}
                </div>
                <div className="relative mt-5 border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-teal-700">Explore college profile</p>
                      <p className="mt-1 text-sm text-slate-500">View the official site and core details inside your app.</p>
                    </div>
                    <button type="button" onClick={(e) => { e.stopPropagation(); openOfficialView(college); }} className="shrink-0 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:from-teal-600 hover:to-cyan-600">
                      Official site
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : null}

        {!loading && colleges.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-teal-100 bg-white/85 py-16 text-center text-slate-500 shadow-sm">No colleges found. Try another college name, city, district, or use your location.</div>
        ) : null}
      </div>
    </div>
  );
}
