import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Calendar as CalendarIcon,
  FileText,
  Download,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface ExamEvent {
  id: string;
  exam: string;
  category: string;
  event: string;
  date: string;
  status: "upcoming" | "ongoing" | "completed";
  description: string;
  link?: string;
}

const examEvents: ExamEvent[] = [
  {
    id: "1",
    exam: "JEE Main 2025",
    category: "Engineering",
    event: "Application Start",
    date: "2025-10-15",
    status: "completed",
    description: "Online application form available on official website",
    link: "https://jeemain.nta.nic.in",
  },
  {
    id: "2",
    exam: "JEE Main 2025",
    category: "Engineering",
    event: "Application End",
    date: "2025-11-30",
    status: "upcoming",
    description: "Last date to submit application form",
    link: "https://jeemain.nta.nic.in",
  },
  {
    id: "3",
    exam: "NEET UG 2025",
    category: "Medical",
    event: "Application Start",
    date: "2025-11-01",
    status: "upcoming",
    description: "Registration begins for NEET UG 2025",
    link: "https://neet.nta.nic.in",
  },
  {
    id: "4",
    exam: "CUET 2025",
    category: "General",
    event: "Admit Card Release",
    date: "2025-12-15",
    status: "upcoming",
    description: "Download admit card from official portal",
    link: "https://cuet.samarth.ac.in",
  },
  {
    id: "5",
    exam: "JEE Main 2025 Session 1",
    category: "Engineering",
    event: "Exam Dates",
    date: "2025-01-22",
    status: "upcoming",
    description: "First session of JEE Main examination",
    link: "https://jeemain.nta.nic.in",
  },
  {
    id: "6",
    exam: "NEET UG 2025",
    category: "Medical",
    event: "Exam Date",
    date: "2025-05-05",
    status: "upcoming",
    description: "National Eligibility cum Entrance Test for UG",
    link: "https://neet.nta.nic.in",
  },
  {
    id: "7",
    exam: "CLAT 2025",
    category: "Law",
    event: "Application Start",
    date: "2025-11-15",
    status: "upcoming",
    description: "Common Law Admission Test registration opens",
    link: "https://consortiumofnlus.ac.in",
  },
  {
    id: "8",
    exam: "CAT 2025",
    category: "Management",
    event: "Registration Start",
    date: "2025-08-01",
    status: "upcoming",
    description: "Common Admission Test for MBA programs",
    link: "https://iimcat.ac.in",
  },
  {
    id: "9",
    exam: "UPSC CSE 2025",
    category: "Civil Services",
    event: "Preliminary Exam",
    date: "2025-05-25",
    status: "upcoming",
    description: "Civil Services Preliminary Examination",
    link: "https://upsc.gov.in",
  },
  {
    id: "10",
    exam: "JEE Advanced 2025",
    category: "Engineering",
    event: "Exam Date",
    date: "2025-05-18",
    status: "upcoming",
    description: "For admission to IITs and other premier institutes",
    link: "https://jeeadv.ac.in",
  },
  {
    id: "11",
    exam: "GATE 2025",
    category: "Engineering",
    event: "Exam Dates",
    date: "2025-02-01",
    status: "upcoming",
    description: "Graduate Aptitude Test in Engineering",
    link: "https://gate.iisc.ac.in",
  },
  {
    id: "12",
    exam: "NDA 2025",
    category: "Defence",
    event: "Exam Date I",
    date: "2025-04-13",
    status: "upcoming",
    description: "National Defence Academy Examination",
    link: "https://upsc.gov.in",
  },
];

export function ExamTimeline() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const categories = Array.from(new Set(examEvents.map((e) => e.category)));

  const filteredEvents = examEvents.filter((event) => {
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || event.status === selectedStatus;
    return matchesCategory && matchesStatus;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "ongoing":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "upcoming":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "ongoing":
        return "bg-blue-100 text-blue-800";
      case "upcoming":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Exam Timeline & Calendar
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated with important exam dates, application deadlines, admit
            card releases, and results
          </p>
        </div>

        {/* Filters */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-yellow-500 rounded-xl">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-yellow-500 rounded-xl">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
          <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-yellow-500 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {examEvents.filter((e) => e.status === "upcoming").length}
                </div>
                <div className="text-sm text-gray-600">Upcoming</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-blue-500 flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {examEvents.filter((e) => e.status === "ongoing").length}
                </div>
                <div className="text-sm text-gray-600">Ongoing</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-teal-50">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-green-500 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {examEvents.filter((e) => e.status === "completed").length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 hidden md:block" />

            <div className="space-y-6">
              {filteredEvents.map((event, index) => (
                <div key={event.id} className="relative">
                  {/* Timeline dot */}
                  <div className="absolute left-6 top-6 h-5 w-5 rounded-full bg-white border-4 border-yellow-500 hidden md:block" />

                  <Card className="md:ml-20 p-6 hover:shadow-xl transition-all duration-300 border-2 hover:border-yellow-500">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-3">
                          {getStatusIcon(event.status)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {event.exam}
                              </h3>
                              <Badge className={getStatusColor(event.status)}>
                                {event.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">{event.category}</Badge>
                              <span className="text-sm text-gray-500">•</span>
                              <span className="text-sm font-semibold text-yellow-600">
                                {event.event}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-3">
                          {event.description}
                        </p>

                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-700">
                            <CalendarIcon className="h-4 w-4" />
                            <span className="font-semibold">
                              {formatDate(event.date)}
                            </span>
                          </div>
                          {event.link && (
                            <Button
                              variant="link"
                              size="sm"
                              className="p-0 h-auto text-blue-600"
                              onClick={() => window.open(event.link, "_blank")}
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              Official Link
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="flex md:flex-col gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Remind Me
                        </Button>
                        <Button
                          size="sm"
                          className="bg-yellow-500 hover:bg-yellow-600 text-xs"
                        >
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No exams found matching your criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
