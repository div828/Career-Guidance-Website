import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  BookmarkCheck,
  TrendingUp,
  Calendar,
  Award,
  GraduationCap,
  Building2,
  Target,
  Bell,
  Heart,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const personalityData = [
  { name: "Analytical", value: 85 },
  { name: "Creative", value: 65 },
  { name: "Social", value: 70 },
  { name: "Technical", value: 90 },
];

const progressData = [
  { name: "Profile Complete", value: 75, color: "#14b8a6" },
  { name: "Quiz Completed", value: 100, color: "#3b82f6" },
  { name: "Colleges Explored", value: 45, color: "#fbbf24" },
];

const COLORS = ["#14b8a6", "#3b82f6", "#fbbf24", "#8b5cf6"];

const recommendedCourses = [
  {
    id: "1",
    course: "B.Tech Computer Science",
    match: "95%",
    reason: "Matches your technical and analytical skills",
  },
  {
    id: "2",
    course: "B.Tech AI & ML",
    match: "92%",
    reason: "High demand field with strong future prospects",
  },
  {
    id: "3",
    course: "Data Science",
    match: "88%",
    reason: "Combines analytics with technical expertise",
  },
];

const savedColleges = [
  {
    id: "1",
    name: "IIT Delhi",
    location: "New Delhi",
    program: "B.Tech CSE",
    deadline: "Nov 30, 2025",
  },
  {
    id: "2",
    name: "IIT Bombay",
    location: "Mumbai",
    program: "B.Tech AI",
    deadline: "Nov 30, 2025",
  },
  {
    id: "3",
    name: "BITS Pilani",
    location: "Pilani",
    program: "B.Tech CS",
    deadline: "Dec 15, 2025",
  },
];

const upcomingExams = [
  {
    id: "1",
    exam: "JEE Main 2025",
    date: "Jan 22, 2025",
    daysLeft: 75,
  },
  {
    id: "2",
    exam: "JEE Advanced 2025",
    date: "May 18, 2025",
    daysLeft: 191,
  },
];

const scholarships = [
  {
    id: "1",
    name: "INSPIRE Scholarship",
    amount: "₹80,000/year",
    deadline: "Dec 31, 2025",
  },
  {
    id: "2",
    name: "Central Sector Scheme",
    amount: "₹20,000/year",
    deadline: "Oct 31, 2025",
  },
];

const goals = [
  { id: "1", title: "Complete Career Quiz", completed: true },
  { id: "2", title: "Research 5 Colleges", completed: true },
  { id: "3", title: "Shortlist 3 Courses", completed: false },
  { id: "4", title: "Apply for Scholarships", completed: false },
];

export function UserDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, Student! 👋
          </h1>
          <p className="text-lg text-gray-600">
            Here's your personalized dashboard with recommendations and progress
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-teal-500 to-green-500 text-white">
            <div className="flex items-center justify-between mb-2">
              <GraduationCap className="h-8 w-8 opacity-80" />
              <Badge className="bg-white/20 text-white border-0">Active</Badge>
            </div>
            <div className="text-3xl font-bold mb-1">12</div>
            <div className="text-sm opacity-90">Courses Matched</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
            <div className="flex items-center justify-between mb-2">
              <Building2 className="h-8 w-8 opacity-80" />
              <Badge className="bg-white/20 text-white border-0">Saved</Badge>
            </div>
            <div className="text-3xl font-bold mb-1">3</div>
            <div className="text-sm opacity-90">Saved Colleges</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-yellow-500 to-orange-500 text-white">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="h-8 w-8 opacity-80" />
              <Badge className="bg-white/20 text-white border-0">Soon</Badge>
            </div>
            <div className="text-3xl font-bold mb-1">2</div>
            <div className="text-sm opacity-90">Upcoming Exams</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white">
            <div className="flex items-center justify-between mb-2">
              <Award className="h-8 w-8 opacity-80" />
              <Badge className="bg-white/20 text-white border-0">New</Badge>
            </div>
            <div className="text-3xl font-bold mb-1">2</div>
            <div className="text-sm opacity-90">Scholarships</div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personality Analysis */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Your Personality Analysis
                </h2>
                <Button variant="outline" size="sm">
                  Retake Quiz
                </Button>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={personalityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#14b8a6" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Recommended Courses */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Target className="h-5 w-5 text-teal-500" />
                  Recommended Courses
                </h2>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {recommendedCourses.map((course) => (
                  <div
                    key={course.id}
                    className="p-4 rounded-lg border-2 border-gray-200 hover:border-teal-500 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {course.course}
                      </h3>
                      <Badge className="bg-teal-500">{course.match} Match</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{course.reason}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Saved Colleges */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Saved Colleges
                </h2>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
              <div className="space-y-3">
                {savedColleges.map((college) => (
                  <div
                    key={college.id}
                    className="p-4 rounded-lg bg-blue-50 border border-blue-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {college.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Building2 className="h-4 w-4" />
                          <span>{college.location}</span>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <Badge variant="outline">{college.program}</Badge>
                      <span className="text-gray-600">
                        Deadline: {college.deadline}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Progress Overview */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                Your Progress
              </h2>
              <div className="space-y-4">
                {progressData.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-700">{item.name}</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {item.value}%
                      </span>
                    </div>
                    <Progress
                      value={item.value}
                      className="h-2"
                      style={{ "--progress-background": item.color } as any}
                    />
                  </div>
                ))}
              </div>
            </Card>

            {/* Goals Tracker */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <BookmarkCheck className="h-5 w-5 text-green-500" />
                Goals Tracker
              </h2>
              <div className="space-y-3">
                {goals.map((goal) => (
                  <div
                    key={goal.id}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      goal.completed ? "bg-green-50" : "bg-gray-50"
                    }`}
                  >
                    <div
                      className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                        goal.completed
                          ? "bg-green-500 border-green-500"
                          : "border-gray-300"
                      }`}
                    >
                      {goal.completed && (
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <span
                      className={`text-sm ${
                        goal.completed
                          ? "text-gray-900 line-through"
                          : "text-gray-700"
                      }`}
                    >
                      {goal.title}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Upcoming Exams */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-yellow-500" />
                Upcoming Exams
              </h2>
              <div className="space-y-3">
                {upcomingExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="p-3 rounded-lg bg-yellow-50 border border-yellow-200"
                  >
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">
                      {exam.exam}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{exam.date}</span>
                      <Badge variant="outline" className="text-xs">
                        {exam.daysLeft} days left
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Scholarships */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Award className="h-5 w-5 text-orange-500" />
                Scholarships
              </h2>
              <div className="space-y-3">
                {scholarships.map((scholarship) => (
                  <div
                    key={scholarship.id}
                    className="p-3 rounded-lg bg-orange-50 border border-orange-200"
                  >
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">
                      {scholarship.name}
                    </h3>
                    <div className="text-xs text-gray-600 mb-2">
                      {scholarship.amount}
                    </div>
                    <div className="text-xs text-gray-600">
                      Deadline: {scholarship.deadline}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Notifications */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-500" />
                Notifications
              </h2>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-blue-50 text-sm">
                  <div className="font-semibold text-gray-900 mb-1">
                    New scholarship available
                  </div>
                  <div className="text-xs text-gray-600">2 hours ago</div>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 text-sm">
                  <div className="font-semibold text-gray-900 mb-1">
                    JEE Main admit card released
                  </div>
                  <div className="text-xs text-gray-600">1 day ago</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
