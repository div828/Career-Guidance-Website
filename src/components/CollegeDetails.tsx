import React, { useEffect, useMemo, useState } from "react";
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

export const CollegeDetails: React.FC<CollegeDetailsProps> = ({
  college,
  onBack,
}) => {
  const [activeView, setActiveView] = useState<"details" | "website">("details");
  const [resolvedWebsite, setResolvedWebsite] = useState("");
  const [websiteLoading, setWebsiteLoading] = useState(false);
  const [websiteMessage, setWebsiteMessage] = useState("");

  useEffect(() => {
    setActiveView(college?.initialView || "details");
    setResolvedWebsite("");
    setWebsiteMessage("");
  }, [college]);

  useEffect(() => {
    if (!college || activeView !== "website") {
      return;
    }

    let isMounted = true;

    const resolveWebsite = async () => {
      setWebsiteLoading(true);
      setWebsiteMessage("Resolving verified official college website...");

      try {
        const response = await fetch(
          `http://localhost:5000/api/search/official-website?name=${encodeURIComponent(
            college.name
          )}&location=${encodeURIComponent(college.location)}`
        );
        const data = await response.json();

        if (!isMounted) {
          return;
        }

        if (data.url) {
          setResolvedWebsite(data.url);
          setWebsiteMessage("Resolving official website to open in a new tab.");
        } else {
          setResolvedWebsite("");
          setWebsiteMessage(
            data.message || "Official college website could not be resolved right now."
          );
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }
        console.error("Official website fetch failed:", error);
        setResolvedWebsite("");
        setWebsiteMessage("Failed to load official college website.");
      } finally {
        if (isMounted) {
          setWebsiteLoading(false);
        }
      }
    };

    void resolveWebsite();

    return () => {
      isMounted = false;
    };
  }, [college, activeView]);

  const websiteUrl = useMemo(() => {
    if (!resolvedWebsite) {
      return "";
    }

    return resolvedWebsite.startsWith("http")
      ? resolvedWebsite
      : `https://${resolvedWebsite}`;
  }, [resolvedWebsite]);

  const openOfficialWebsite = async () => {
    if (!college) {
      return;
    }

    const newTab = window.open("about:blank", "_blank");
    if (!newTab) {
      setWebsiteMessage("Please allow popups so the college website can open in a new tab.");
      return;
    }
    newTab.opener = null;

    setWebsiteLoading(true);
    setWebsiteMessage("Resolving verified official college website...");

    try {
      const response = await fetch(
        `http://localhost:5000/api/search/official-website?name=${encodeURIComponent(
          college.name
        )}&location=${encodeURIComponent(college.location)}`
      );
      const data = await response.json();

      if (data.url) {
        const finalUrl = data.url.startsWith("http") ? data.url : `https://${data.url}`;
        newTab.location.href = finalUrl;
        setWebsiteMessage("Official college website opened in a new tab.");
      } else {
        newTab.close();
        setWebsiteMessage(
          data.message || "Official college website could not be resolved right now."
        );
      }
    } catch (error) {
      console.error("Official website open failed:", error);
      newTab.close();
      setWebsiteMessage("Failed to resolve official college website.");
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
          <div className="absolute" />
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
                  {college.address ? (
                    <p className="text-sm text-slate-500">{college.address}</p>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                variant={activeView === "details" ? "default" : "outline"}
                className={
                  activeView === "details"
                    ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600"
                    : "border-teal-200 text-teal-700 hover:bg-teal-50"
                }
                onClick={() => setActiveView("details")}
              >
                <Info className="h-4 w-4" />
                Details
              </Button>

              <Button
                variant={activeView === "website" ? "default" : "outline"}
                className={
                  activeView === "website"
                    ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600"
                    : "border-teal-200 text-teal-700 hover:bg-teal-50"
                }
                onClick={() => {
                  setActiveView("details");
                  void openOfficialWebsite();
                }}
              >
                <Globe className="h-4 w-4" />
                Official Website
              </Button>
            </div>
          </div>

          {activeView === "details" ? (
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
                    Official site is resolved live when you open the website tab.
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <p className="text-sm font-semibold text-slate-500">Address</p>
                  <p className="mt-2 text-slate-800">{college.address || college.location}</p>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <p className="text-sm font-semibold text-slate-500">Contact</p>
                  <p className="mt-2 text-slate-800">
                    Contact details may vary. Use the official website tab for the latest phone and admission info.
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {activeView === "website" ? (
            <div className="mt-8">
              {websiteLoading ? (
                <div className="rounded-[24px] border border-slate-200 bg-white p-10 text-center text-slate-600">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-teal-600" />
                  <p className="mt-4">{websiteMessage}</p>
                </div>
              ) : websiteUrl ? (
                <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
                  <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-700">{websiteMessage}</p>
                      <p className="mt-2 text-sm text-slate-500">
                        The college website opens in a new tab only, so you can keep browsing here.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="border-teal-200 text-teal-700 hover:bg-teal-50"
                      onClick={() => window.open(websiteUrl, "_blank", "noreferrer")}
                    >
                      Open in new tab
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-8 text-slate-500">
                  {websiteMessage || "Official college website could not be resolved right now."}
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
