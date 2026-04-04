import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Award,
  BookOpen,
  Download,
  ExternalLink,
  Heart,
  IndianRupee,
  Users,
  FileText,
  Video,
  GraduationCap,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface Scholarship {
  id: string;
  name: string;
  provider: string;
  amount: string;
  eligibility: string;
  deadline: string;
  category: string;
}

interface Resource {
  id: string;
  title: string;
  type: string;
  description: string;
  provider: string;
  link: string;
}

const scholarships: Scholarship[] = [
  {
    id: "1",
    name: "National Means-cum-Merit Scholarship",
    provider: "Government of India",
    amount: "₹12,000/year",
    eligibility: "Class 10-12, Family income < ₹3.5 LPA",
    deadline: "31st October 2025",
    category: "General",
  },
  {
    id: "2",
    name: "Post Matric Scholarship for SC/ST",
    provider: "Ministry of Social Justice",
    amount: "Up to ₹10,000/year",
    eligibility: "SC/ST students, Post-matric level",
    deadline: "30th November 2025",
    category: "SC/ST",
  },
  {
    id: "3",
    name: "Prime Minister's Scholarship Scheme",
    provider: "Ministry of Defence",
    amount: "₹2,500/month",
    eligibility: "Children of Armed Forces personnel",
    deadline: "15th December 2025",
    category: "Defence",
  },
  {
    id: "4",
    name: "Inspire Scholarship",
    provider: "Department of Science & Technology",
    amount: "₹80,000/year",
    eligibility: "Top 1% in Class 12 Board, pursuing Science",
    deadline: "31st December 2025",
    category: "Science",
  },
  {
    id: "5",
    name: "Central Sector Scheme",
    provider: "Ministry of Education",
    amount: "₹10,000-₹20,000/year",
    eligibility: "Top 20,000 students in Class 12",
    deadline: "31st October 2025",
    category: "Merit",
  },
  {
    id: "6",
    name: "AICTE Pragati Scholarship",
    provider: "AICTE",
    amount: "₹50,000/year",
    eligibility: "Girl students in technical education",
    deadline: "31st January 2026",
    category: "Girls",
  },
];

const ebooks: Resource[] = [
  {
    id: "1",
    title: "Complete Guide to JEE Main & Advanced",
    type: "E-Book",
    description: "Comprehensive preparation guide with solved examples",
    provider: "NCERT",
    link: "#",
  },
  {
    id: "2",
    title: "NEET Biology - Theory & Practice",
    type: "E-Book",
    description: "Complete biology coverage for NEET preparation",
    provider: "NCERT",
    link: "#",
  },
  {
    id: "3",
    title: "Career Options After Class 12",
    type: "Guide",
    description: "Detailed guide on all career paths and options",
    provider: "Ministry of Education",
    link: "#",
  },
  {
    id: "4",
    title: "Scholarship Application Guide",
    type: "Guide",
    description: "Step-by-step guide to apply for scholarships",
    provider: "NSP",
    link: "#",
  },
];

const schemes: Resource[] = [
  {
    id: "1",
    title: "Pradhan Mantri Kaushal Vikas Yojana",
    type: "Skill Development",
    description: "Free skill development training programs",
    provider: "Ministry of Skill Development",
    link: "#",
  },
  {
    id: "2",
    title: "Digital India e-Learning",
    type: "Online Learning",
    description: "Free online courses and certifications",
    provider: "MHRD",
    link: "#",
  },
  {
    id: "3",
    title: "Beti Bachao Beti Padhao",
    type: "Education Support",
    description: "Scheme for girl child education",
    provider: "Government of India",
    link: "#",
  },
  {
    id: "4",
    title: "National Apprenticeship Promotion Scheme",
    type: "Training",
    description: "Apprenticeship opportunities with stipend",
    provider: "Ministry of Labour",
    link: "#",
  },
];

const videos: Resource[] = [
  {
    id: "1",
    title: "How to Choose the Right Career Path",
    type: "Video",
    description: "Expert guidance on career selection",
    provider: "Career Counseling India",
    link: "#",
  },
  {
    id: "2",
    title: "JEE Preparation Strategy",
    type: "Video",
    description: "Tips from JEE toppers and experts",
    provider: "IIT Delhi",
    link: "#",
  },
  {
    id: "3",
    title: "NEET Exam Pattern & Syllabus",
    type: "Video",
    description: "Complete overview of NEET examination",
    provider: "AIIMS",
    link: "#",
  },
  {
    id: "4",
    title: "Scholarship Application Process",
    type: "Video",
    description: "How to apply for government scholarships",
    provider: "NSP",
    link: "#",
  },
];

export function Resources() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Resources & Scholarships
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Access free e-books, government schemes, scholarships, and learning
            materials to support your education journey
          </p>
        </div>

        <Tabs defaultValue="scholarships" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
            <TabsTrigger value="scholarships">
              <Award className="h-4 w-4 mr-2" />
              Scholarships
            </TabsTrigger>
            <TabsTrigger value="ebooks">
              <BookOpen className="h-4 w-4 mr-2" />
              E-Books
            </TabsTrigger>
            <TabsTrigger value="schemes">
              <Heart className="h-4 w-4 mr-2" />
              Schemes
            </TabsTrigger>
            <TabsTrigger value="videos">
              <Video className="h-4 w-4 mr-2" />
              Videos
            </TabsTrigger>
          </TabsList>

          {/* Scholarships Tab */}
          <TabsContent value="scholarships">
            <div className="mb-8">
              <Card className="p-6 bg-gradient-to-r from-teal-500 to-green-500 text-white">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      200+ Scholarships Available
                    </h2>
                    <p className="opacity-90">
                      Financial assistance opportunities worth crores for
                      students across India
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {scholarships.map((scholarship) => (
                <Card
                  key={scholarship.id}
                  className="p-6 hover:shadow-xl transition-all duration-300 border-2 hover:border-teal-500"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {scholarship.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {scholarship.provider}
                        </span>
                      </div>
                    </div>
                    <Badge className="bg-green-500">{scholarship.category}</Badge>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <IndianRupee className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="text-xs text-gray-600">Scholarship Amount</div>
                        <div className="font-semibold text-green-700">
                          {scholarship.amount}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-600 mb-1">Eligibility:</div>
                      <p className="text-sm text-gray-900">{scholarship.eligibility}</p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText className="h-4 w-4" />
                      <span>Deadline: {scholarship.deadline}</span>
                    </div>
                  </div>

                  <Button className="w-full bg-teal-500 hover:bg-teal-600">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Apply Now
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* E-Books Tab */}
          <TabsContent value="ebooks">
            <div className="mb-8">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1542725752-e9f7259b3881?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rcyUyMGVkdWNhdGlvbiUyMGxlYXJuaW5nfGVufDF8fHx8MTc1OTk0NTE1OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="E-books"
                className="w-full h-48 object-cover rounded-xl"
              />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ebooks.map((ebook) => (
                <Card
                  key={ebook.id}
                  className="p-6 hover:shadow-xl transition-all duration-300"
                >
                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <Badge variant="secondary" className="mb-2">
                    {ebook.type}
                  </Badge>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {ebook.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{ebook.description}</p>
                  <div className="text-xs text-gray-500 mb-4">
                    By {ebook.provider}
                  </div>
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Free
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Schemes Tab */}
          <TabsContent value="schemes">
            <div className="grid md:grid-cols-2 gap-6">
              {schemes.map((scheme) => (
                <Card
                  key={scheme.id}
                  className="p-6 hover:shadow-xl transition-all duration-300 border-2 hover:border-green-500"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <Badge variant="secondary" className="mb-2">
                        {scheme.type}
                      </Badge>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {scheme.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {scheme.description}
                      </p>
                      <div className="text-xs text-gray-500 mb-4">
                        <Users className="inline h-3 w-3 mr-1" />
                        {scheme.provider}
                      </div>
                      <Button className="bg-green-500 hover:bg-green-600">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Learn More
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <Card
                  key={video.id}
                  className="p-6 hover:shadow-xl transition-all duration-300"
                >
                  <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center mb-4">
                    <Video className="h-6 w-6 text-red-600" />
                  </div>
                  <Badge variant="secondary" className="mb-2">
                    {video.type}
                  </Badge>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{video.description}</p>
                  <div className="text-xs text-gray-500 mb-4">
                    By {video.provider}
                  </div>
                  <Button variant="outline" className="w-full">
                    <Video className="h-4 w-4 mr-2" />
                    Watch Now
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
