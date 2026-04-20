import React, { useState } from "react";
import { Button } from "./ui/button";
import { MapPin, Star, ArrowLeft, Globe, Info, Loader2 } from "lucide-react";

interface College {
  id: number;
  name: string;
  location: string;
  address?: string;
  phone?: string;
  website?: string;
  rating?: number;
  distance?: string;
  initialView?: "details" | "website";
}

interface CollegeDetailsProps {
  college: College | null;
  onBack: () => void;
}

export const CollegeDetails: React.FC<CollegeDetailsProps> = ({ college, onBack }) => {
  const [websiteLoading, setWebsiteLoading] = useState(false);
  const [websiteMessage, setWebsiteMessage] = useState("");

  const goToOfficialWebsite = async () => {
    if (!college) return;

    setWebsiteLoading(true);
    setWebsiteMessage("Finding official college website...");

    try {
      const response = await fetch(
        `http://localhost:5000/api/search/official-website?name=${encodeURIComponent(
          college.name
        )}&location=${encodeURIComponent(college.location)}`
      );
      const data = await response.json();

      if (data.url) {
        window.location.href = data.url.startsWith("http") ? data.url : `https://${data.url}`;
        return;
      }

      setWebsiteMessage(data.message || "Official website could not be found right now.");
    } catch (error) {
      console.error("Official website redirect failed:", error);
      setWebsiteMessage("Failed to find official website. Please try again.");
    } finally {
      setWebsiteLoading(false);
    }
  };

  if (!college) {
    return (
      <div className="p-10 text-center">
        <p>No college selected.</p>
        <Button onClick={onBack}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.14),_transparent_24%),linear-gradient(to_bottom,_#ecfeff,_#ffffff,_#f0fdfa)] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <Button variant="outline" className="mb-6" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Colleges
        </Button>

        <div className="overflow-hidden rounded-[30px] border border-white/70 bg-white/95 p-6 shadow-[0_28px_70px_-34px_rgba(15,118,110,0.35)] backdrop-blur lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{college.name}</h1>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{college.rating ?? 4.2}</span>
                </div>

                {college.distance ? (
                  <span className="rounded-full bg-teal-50 px-3 py-1.5 text-teal-700">
                    {college.distance} km away
                  </span>
                ) : null}
              </div>

              <div className="mt-5 flex items-start gap-3 text-slate-700">
                <MapPin className="mt-1 h-5 w-5 text-teal-600" />
                <div>
                  <p>{college.location}</p>
                  {college.address ? <p className="text-sm text-slate-500">{college.address}</p> : null}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600">
                <Info className="h-4 w-4" />
                Details
              </Button>

              <Button
                variant="outline"
                className="border-teal-200 text-teal-700 hover:bg-teal-50"
                onClick={() => void goToOfficialWebsite()}
                disabled={websiteLoading}
              >
                {websiteLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Globe className="h-4 w-4" />}
                Official Website
              </Button>
            </div>
          </div>

          <div className="mt-8 rounded-[24px] border border-slate-100 bg-gradient-to-br from-slate-50 to-cyan-50/50 p-6">
            <h2 className="text-xl font-semibold text-slate-900">College Information</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-500">Location</p>
                <p className="mt-2 text-slate-800">{college.location}</p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-500">Official Website</p>
                <p className="mt-2 text-slate-800">
                  Click Official Website to leave this page and open the college site in this same tab. Browser Back will return here.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-500">Address</p>
                <p className="mt-2 text-slate-800">{college.address || college.location}</p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-500">Contact</p>
                <p className="mt-2 text-slate-800">
                  Use the official college website for latest phone, admissions, courses, and notices.
                </p>
              </div>
            </div>

            {websiteMessage ? (
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                {websiteMessage}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
