import React from "react";
import { Button } from "./ui/button";
import { MapPin, Phone, Star, ArrowLeft } from "lucide-react";

/* ================= TYPES ================= */

interface College {
  id: number;
  name: string;
  location: string;
  address?: string;
  phone: string;
  website: string;
  rating: number;
  distance?: string;
}

interface CollegeDetailsProps {
  college: College | null;
  onBack: () => void;
}

/* ================= COMPONENT ================= */

export const CollegeDetails: React.FC<CollegeDetailsProps> = ({
  college,
  onBack,
}) => {
  if (!college) {
    return (
      <div className="p-10 text-center">
        <p>No college selected.</p>
        <Button onClick={onBack}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-10 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Back Button */}
        <Button
          variant="outline"
          className="mb-6"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Colleges
        </Button>

        {/* Name */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {college.name}
        </h1>

        {/* Rating + Distance */}
        <div className="flex items-center gap-3 mb-4">
          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold">{college.rating}</span>
          {college.distance && (
            <span className="text-blue-600">
              • {college.distance} km away
            </span>
          )}
        </div>

        {/* Location */}
        <div className="flex items-start gap-2 text-gray-700 mb-4">
          <MapPin className="h-5 w-5 mt-1" />
          <div>
            <p>{college.location}</p>
            {college.address && (
              <p className="text-sm text-gray-500">
                {college.address}
              </p>
            )}
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-2 mb-4 text-gray-700">
          <Phone className="h-5 w-5" />
          <span>{college.phone}</span>
        </div>

        {/* Website */}
        {college.website && (
          <Button
            onClick={() =>
              window.open(
                college.website.startsWith("http")
                  ? college.website
                  : `https://${college.website}`,
                "_blank"
              )
            }
          >
            Visit Official Website
          </Button>
        )}
      </div>
    </div>
  );
};