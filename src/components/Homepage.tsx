import {
  Search,
  Brain,
  Briefcase,
  MapPin,
  Calendar,
  BookOpen,
  TrendingUp,
  Award,
  Users,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface HomepageProps {
  onNavigate: (page: string, query?: string) => void;
}

export function Homepage({ onNavigate }: HomepageProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      onNavigate("search", searchQuery);
    }
  };

  const quickLinks = [
    {
      icon: Brain,
      title: "Aptitude Quiz",
      description: "Discover your strengths and ideal career path",
      page: "quiz",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Briefcase,
      title: "Explore Careers",
      description: "Browse 100+ career options in India",
      page: "careers",
      color: "from-teal-500 to-green-500",
    },
    {
      icon: MapPin,
      title: "Nearby Colleges",
      description: "Find colleges and universities near you",
      page: "colleges",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Calendar,
      title: "Upcoming Exams",
      description: "Stay updated with exam dates and deadlines",
      page: "exams",
      color: "from-yellow-500 to-orange-500",
    },
  ];

  const stats = [
    { icon: BookOpen, label: "Courses", value: "500+" },
    { icon: Users, label: "Colleges", value: "10,000+" },
    { icon: Briefcase, label: "Careers", value: "100+" },
    { icon: Award, label: "Scholarships", value: "200+" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">

            <div className="inline-block px-4 py-2 bg-teal-100 rounded-full">
              <span className="text-teal-700">
                Your Future Starts Here 🎓
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Find Your Career, College, and Future Path{" "}
              <span className="text-teal-500">in One Place</span>
            </h1>

            <p className="text-lg text-gray-600">
              Complete guidance platform for Indian students after Class 10 and
              12. Discover careers, colleges, exams, and scholarships tailored
              for you.
            </p>

            {/* 🔥 FUNCTIONAL SEARCH BAR */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />

              <Input
                type="text"
                placeholder="Search for Colleges, Cities, Exams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                className="pl-12 h-14 bg-white border-2 border-gray-200 focus:border-teal-500 rounded-xl"
              />

              <Button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-teal-500 hover:bg-teal-600"
              >
                Search
              </Button>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1623053434214-99c44432ce1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg"
                alt="Students studying"
                className="w-full h-[500px] object-cover"
              />
            </div>

            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-green-500" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">98%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Quick Links */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Quick Links
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickLinks.map((link) => (
            <Card
              key={link.page}
              className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-teal-500 group"
              onClick={() => onNavigate(link.page)}
            >
              <div
                className={`h-14 w-14 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <link.icon className="h-7 w-7 text-white" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {link.title}
              </h3>

              <p className="text-sm text-gray-600">
                {link.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-teal-500 to-blue-500 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center text-white">
                <stat.icon className="h-10 w-10 mx-auto mb-3 opacity-90" />
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
