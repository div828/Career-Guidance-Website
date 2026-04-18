import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Calendar as CalendarIcon,
  FileText,
  ExternalLink,
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
  registrationStart?: string;
  registrationEnd?: string;
  description: string;
  registrationLink: string;
  officialLink: string;
  manualStatus?: "upcoming" | "ongoing" | "completed";
}

const examEvents: ExamEvent[] = [
  // Engineering
  {
    id: "1",
    exam: "JEE Main 2026",
    category: "Engineering",
    event: "Session 1 Exam",
    date: "2026-01-22",
    registrationStart: "2025-10-28",
    registrationEnd: "2025-11-22",
    description: "Joint Entrance Examination Main 2026 – Session 1. Registration open Oct–Nov 2025. Exam expected Jan 2026.",
    registrationLink: "https://jeemain.nta.nic.in",
    officialLink: "https://jeemain.nta.nic.in",
    manualStatus: "upcoming",
  },
  {
    id: "2",
    exam: "JEE Advanced 2026",
    category: "Engineering",
    event: "Exam Date",
    date: "2026-05-24",
    description: "For admission to IITs. Dates not yet officially announced. Expected May 2026 after JEE Main results.",
    registrationLink: "https://jeeadv.ac.in",
    officialLink: "https://jeeadv.ac.in",
    manualStatus: "upcoming",
  },
  {
    id: "3",
    exam: "GATE 2026",
    category: "Engineering",
    event: "Registration Open",
    date: "2025-09-26",
    registrationStart: "2025-08-28",
    registrationEnd: "2025-09-26",
    description: "Graduate Aptitude Test in Engineering 2026. Registration ongoing Aug–Sep 2025. Exam in Feb 2026.",
    registrationLink: "https://gate2026.iitr.ac.in",
    officialLink: "https://gate2026.iitr.ac.in",
    manualStatus: "ongoing",
  },
  {
    id: "4",
    exam: "BITSAT 2026",
    category: "Engineering",
    event: "Registration Start",
    date: "2026-01-10",
    registrationStart: "2026-01-10",
    registrationEnd: "2026-03-15",
    description: "BITS Pilani Admission Test 2026 for B.E/B.Pharm programs. Registration expected to open Jan 2026.",
    registrationLink: "https://www.bitsadmission.com",
    officialLink: "https://www.bitsadmission.com",
    manualStatus: "upcoming",
  },
  // Medical
  {
    id: "5",
    exam: "NEET UG 2026",
    category: "Medical",
    event: "Exam Date",
    date: "2026-05-03",
    registrationStart: "2026-02-01",
    registrationEnd: "2026-03-07",
    description: "National Eligibility cum Entrance Test 2026 for MBBS/BDS/AYUSH admissions. Dates not yet officially announced; expected May 2026.",
    registrationLink: "https://neet.nta.nic.in",
    officialLink: "https://neet.nta.nic.in",
    manualStatus: "upcoming",
  },
  {
    id: "6",
    exam: "NEET PG 2026",
    category: "Medical",
    event: "Exam Date",
    date: "2026-06-14",
    registrationStart: "2026-04-01",
    registrationEnd: "2026-05-15",
    description: "Entrance test for MD/MS/PG Diploma admissions 2026. Dates not yet officially announced; expected Jun 2026.",
    registrationLink: "https://natboard.edu.in",
    officialLink: "https://natboard.edu.in",
    manualStatus: "upcoming",
  },
  // Management
  {
    id: "7",
    exam: "CAT 2025",
    category: "Management",
    event: "Exam Date",
    date: "2025-11-30",
    registrationStart: "2025-08-01",
    registrationEnd: "2025-09-15",
    description: "Common Admission Test for MBA/PGDM admissions to IIMs and top B-schools. Registration opens Aug 2025; exam expected late Nov 2025.",
    registrationLink: "https://iimcat.ac.in",
    officialLink: "https://iimcat.ac.in",
    manualStatus: "upcoming",
  },
  {
    id: "8",
    exam: "XAT 2026",
    category: "Management",
    event: "Registration Open",
    date: "2026-01-05",
    registrationStart: "2025-07-10",
    registrationEnd: "2025-11-30",
    description: "Xavier Aptitude Test 2026 for admission to XLRI and 150+ B-schools. Registration ongoing Jul–Nov 2025. Exam on 5 Jan 2026.",
    registrationLink: "https://xatonline.in",
    officialLink: "https://xatonline.in",
    manualStatus: "ongoing",
  },
  // Law
  {
    id: "9",
    exam: "CLAT 2026",
    category: "Law",
    event: "Registration Open",
    date: "2025-12-01",
    registrationStart: "2025-07-15",
    registrationEnd: "2025-10-15",
    description: "Common Law Admission Test 2026 for NLUs – UG and PG law programs. Registration open Jul–Oct 2025. Exam Dec 2025.",
    registrationLink: "https://consortiumofnlus.ac.in",
    officialLink: "https://consortiumofnlus.ac.in",
    manualStatus: "ongoing",
  },
  {
    id: "10",
    exam: "AILET 2026",
    category: "Law",
    event: "Registration Open",
    date: "2025-12-07",
    registrationStart: "2025-08-01",
    registrationEnd: "2025-11-01",
    description: "All India Law Entrance Test 2026 for NLU Delhi admissions. Registration open Aug–Nov 2025. Exam Dec 2025.",
    registrationLink: "https://nationallawuniversitydelhi.in",
    officialLink: "https://nationallawuniversitydelhi.in",
    manualStatus: "ongoing",
  },
  // Civil Services
  {
    id: "11",
    exam: "UPSC CSE 2026",
    category: "Civil Services",
    event: "Preliminary Exam",
    date: "2026-05-24",
    registrationStart: "2026-02-01",
    registrationEnd: "2026-02-21",
    description: "Civil Services Preliminary Examination 2026 for IAS/IPS/IFS. Notification expected Feb 2026; exam May 2026.",
    registrationLink: "https://upsconline.nic.in",
    officialLink: "https://upsc.gov.in",
    manualStatus: "upcoming",
  },
  {
    id: "12",
    exam: "UPSC CSE 2025",
    category: "Civil Services",
    event: "Mains Exam",
    date: "2025-09-19",
    description: "Civil Services Mains 2025 – written stage from 19 Sep 2025. Currently ongoing for qualified Prelims candidates.",
    registrationLink: "https://upsconline.nic.in",
    officialLink: "https://upsc.gov.in",
    manualStatus: "ongoing",
  },
  // Defence
  {
    id: "13",
    exam: "NDA 2026 (I)",
    category: "Defence",
    event: "Notification Expected",
    date: "2026-04-19",
    registrationStart: "2025-12-10",
    registrationEnd: "2025-12-30",
    description: "National Defence Academy Exam I 2026 for Army/Navy/Air Force. Notification expected Dec 2025; exam Apr 2026.",
    registrationLink: "https://upsconline.nic.in",
    officialLink: "https://upsc.gov.in",
    manualStatus: "upcoming",
  },
  {
    id: "14",
    exam: "NDA 2025 (II)",
    category: "Defence",
    event: "Exam Date",
    date: "2025-09-14",
    registrationStart: "2025-05-28",
    registrationEnd: "2025-06-17",
    description: "National Defence Academy Exam II 2025. Exam on 14 Sep 2025; results awaited.",
    registrationLink: "https://upsconline.nic.in",
    officialLink: "https://upsc.gov.in",
    manualStatus: "ongoing",
  },
  // General / Central Universities
  {
    id: "15",
    exam: "CUET UG 2026",
    category: "General",
    event: "Registration Start",
    date: "2026-05-01",
    registrationStart: "2026-02-01",
    registrationEnd: "2026-03-20",
    description: "Common University Entrance Test 2026 for central university UG admissions. Dates not yet announced; expected Feb–May 2026.",
    registrationLink: "https://cuet.samarth.ac.in",
    officialLink: "https://cuet.samarth.ac.in",
    manualStatus: "upcoming",
  },
  {
    id: "16",
    exam: "CUET PG 2026",
    category: "General",
    event: "Registration Start",
    date: "2026-03-15",
    registrationStart: "2026-01-01",
    registrationEnd: "2026-02-10",
    description: "Common University Entrance Test 2026 for central university PG admissions. Dates not yet announced; expected Jan–Mar 2026.",
    registrationLink: "https://cuet.nta.nic.in",
    officialLink: "https://cuet.nta.nic.in",
    manualStatus: "upcoming",
  },
  // Design
  {
    id: "17",
    exam: "UCEED 2026",
    category: "Design",
    event: "Registration Open",
    date: "2026-01-18",
    registrationStart: "2025-10-09",
    registrationEnd: "2025-11-14",
    description: "Undergraduate Common Entrance Exam for Design 2026 – IIT admissions. Registration open Oct–Nov 2025. Exam Jan 2026.",
    registrationLink: "https://uceed.iitb.ac.in",
    officialLink: "https://uceed.iitb.ac.in",
    manualStatus: "ongoing",
  },
  {
    id: "18",
    exam: "NID DAT 2026",
    category: "Design",
    event: "Registration Open",
    date: "2026-01-11",
    registrationStart: "2025-10-01",
    registrationEnd: "2025-11-30",
    description: "National Institute of Design Aptitude Test 2026 for B.Des/M.Des. Registration open Oct–Nov 2025. Exam Jan 2026.",
    registrationLink: "https://admissions.nid.edu",
    officialLink: "https://www.nid.edu",
    manualStatus: "ongoing",
  },
];

function computeStatus(event: ExamEvent): "upcoming" | "ongoing" | "completed" {
  if (event.manualStatus) return event.manualStatus;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const examDate = new Date(event.date);

  if (event.registrationStart && event.registrationEnd) {
    const regStart = new Date(event.registrationStart);
    const regEnd = new Date(event.registrationEnd);
    if (today >= regStart && today <= regEnd) return "ongoing";
  }

  if (examDate < today) return "completed";
  return "upcoming";
}

export function ExamTimeline() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const eventsWithStatus = examEvents.map((e) => ({
    ...e,
    status: computeStatus(e),
  }));

  const categories = Array.from(new Set(eventsWithStatus.map((e) => e.category)));

  const filteredEvents = eventsWithStatus
    .filter((event) => {
      const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
      const matchesStatus = selectedStatus === "all" || event.status === selectedStatus;
      return matchesCategory && matchesStatus;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "ongoing":   return <Clock className="h-5 w-5 text-blue-500" />;
      case "upcoming":  return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:          return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "ongoing":   return "bg-blue-100 text-blue-800";
      case "upcoming":  return "bg-yellow-100 text-yellow-800";
      default:          return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

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
                  {eventsWithStatus.filter((e) => e.status === "upcoming").length}
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
                  {eventsWithStatus.filter((e) => e.status === "ongoing").length}
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
                  {eventsWithStatus.filter((e) => e.status === "completed").length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 hidden md:block" />

            <div className="space-y-6">
              {filteredEvents.map((event) => (
                <div key={event.id} className="relative">
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

                        <p className="text-sm text-gray-600 mb-3">{event.description}</p>

                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-700">
                            <CalendarIcon className="h-4 w-4" />
                            <span className="font-semibold">{formatDate(event.date)}</span>
                          </div>

                          {event.registrationStart && event.registrationEnd && (
                            <div className="text-xs text-gray-500">
                              Reg: {formatDate(event.registrationStart)} – {formatDate(event.registrationEnd)}
                            </div>
                          )}

                          <Button
                            variant="link"
                            size="sm"
                            className="p-0 h-auto text-blue-600"
                            onClick={() => window.open(event.officialLink, "_blank")}
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            Official Website
                          </Button>
                        </div>
                      </div>

                      <div className="flex md:flex-col gap-2">
                        {event.status === "completed" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs border-green-400 text-green-700"
                            onClick={() => window.open(event.officialLink, "_blank")}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View Results
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            onClick={() => window.open(event.registrationLink, "_blank")}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Register Now
                          </Button>
                        )}
                        <Button
                          size="sm"
                          className="bg-yellow-500 hover:bg-yellow-600 text-xs"
                          onClick={() => window.open(event.officialLink, "_blank")}
                        >
                          <TrendingUp className="h-3 w-3 mr-1" />
                          More Details
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
              <p className="text-gray-500">No exams found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
