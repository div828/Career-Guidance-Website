import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Brain, BookOpen, Calculator, Palette, Users, Code, CheckCircle, Award } from "lucide-react";

interface QuizQuestion {
  id: number;
  question: string;
  options: { text: string; category: string }[];
}

// Comprehensive professional career aptitude questions based on RIASEC model and multiple intelligence theory
const questions: QuizQuestion[] = [
  {
    id: 1,
    question: "When faced with a problem, your first instinct is to:",
    options: [
      { text: "Analyze data and facts to find a logical solution", category: "analytical" },
      { text: "Think of creative, out-of-the-box alternatives", category: "creative" },
      { text: "Discuss it with others and seek collaborative input", category: "social" },
      { text: "Look for practical, hands-on solutions", category: "practical" },
    ],
  },
  {
    id: 2,
    question: "Which of these activities would you find most engaging?",
    options: [
      { text: "Conducting experiments or research studies", category: "analytical" },
      { text: "Designing graphics, writing stories, or composing music", category: "creative" },
      { text: "Organizing events or leading community projects", category: "leadership" },
      { text: "Building, repairing, or working with tools and machines", category: "practical" },
    ],
  },
  {
    id: 3,
    question: "In a group project, you naturally tend to:",
    options: [
      { text: "Take charge and delegate tasks to team members", category: "leadership" },
      { text: "Generate innovative ideas and solutions", category: "creative" },
      { text: "Research thoroughly and provide analytical insights", category: "analytical" },
      { text: "Ensure everyone feels included and supported", category: "social" },
    ],
  },
  {
    id: 4,
    question: "Which subject area appeals to you most?",
    options: [
      { text: "Mathematics, Physics, or Statistics", category: "analytical" },
      { text: "Literature, Arts, Music, or Design", category: "creative" },
      { text: "Psychology, Sociology, or Communication", category: "social" },
      { text: "Computer Science, Engineering, or Technology", category: "technical" },
    ],
  },
  {
    id: 5,
    question: "What type of work environment would make you most productive?",
    options: [
      { text: "Fast-paced, competitive, and goal-driven", category: "leadership" },
      { text: "Flexible, autonomous with creative freedom", category: "creative" },
      { text: "Structured, organized with clear procedures", category: "analytical" },
      { text: "Collaborative, team-oriented with social interaction", category: "social" },
    ],
  },
  {
    id: 6,
    question: "When learning something new, you prefer to:",
    options: [
      { text: "Read detailed manuals and theoretical explanations", category: "analytical" },
      { text: "Learn by doing and hands-on practice", category: "practical" },
      { text: "Discuss with others and learn through conversation", category: "social" },
      { text: "Experiment and find your own creative approach", category: "creative" },
    ],
  },
  {
    id: 7,
    question: "Your ideal career would primarily involve:",
    options: [
      { text: "Developing innovative technology or software solutions", category: "technical" },
      { text: "Creating visual, written, or performing art", category: "creative" },
      { text: "Solving complex problems using data and logic", category: "analytical" },
      { text: "Helping, teaching, or counseling people", category: "social" },
    ],
  },
  {
    id: 8,
    question: "Which activity do you find most satisfying?",
    options: [
      { text: "Completing detailed analysis or calculations accurately", category: "analytical" },
      { text: "Making something beautiful or expressing ideas creatively", category: "creative" },
      { text: "Making a positive difference in someone's life", category: "social" },
      { text: "Building or fixing something with your hands", category: "practical" },
    ],
  },
  {
    id: 9,
    question: "How do you prefer to spend your free time?",
    options: [
      { text: "Reading, researching, or learning new concepts", category: "analytical" },
      { text: "Drawing, writing, playing music, or crafting", category: "creative" },
      { text: "Socializing with friends or volunteering", category: "social" },
      { text: "Playing sports, gaming, or working on DIY projects", category: "practical" },
    ],
  },
  {
    id: 10,
    question: "What motivates you most in your work or studies?",
    options: [
      { text: "Achieving goals and gaining recognition", category: "leadership" },
      { text: "Having creative freedom and innovation", category: "creative" },
      { text: "Solving challenging intellectual puzzles", category: "analytical" },
      { text: "Making meaningful connections with others", category: "social" },
    ],
  },
  {
    id: 11,
    question: "Which of these skills comes most naturally to you?",
    options: [
      { text: "Coding, programming, or working with technology", category: "technical" },
      { text: "Public speaking, persuading, or negotiating", category: "leadership" },
      { text: "Understanding and empathizing with others", category: "social" },
      { text: "Thinking critically and analyzing information", category: "analytical" },
    ],
  },
  {
    id: 12,
    question: "In your ideal job, you would spend most of your time:",
    options: [
      { text: "Working independently on focused tasks", category: "analytical" },
      { text: "Collaborating and interacting with diverse people", category: "social" },
      { text: "Leading projects and making strategic decisions", category: "leadership" },
      { text: "Creating and innovating new concepts", category: "creative" },
    ],
  },
  {
    id: 13,
    question: "Which type of challenge excites you most?",
    options: [
      { text: "Designing a complex system or solving a technical problem", category: "technical" },
      { text: "Creating something original that hasn't been done before", category: "creative" },
      { text: "Organizing and executing a large-scale project", category: "leadership" },
      { text: "Understanding human behavior and relationships", category: "social" },
    ],
  },
  {
    id: 14,
    question: "Your friends would describe you as someone who is:",
    options: [
      { text: "Logical, detail-oriented, and precise", category: "analytical" },
      { text: "Imaginative, original, and artistic", category: "creative" },
      { text: "Empathetic, supportive, and understanding", category: "social" },
      { text: "Practical, hands-on, and resourceful", category: "practical" },
    ],
  },
  {
    id: 15,
    question: "When working on a long-term project, you prefer to:",
    options: [
      { text: "Create a detailed plan and follow it systematically", category: "analytical" },
      { text: "Stay flexible and adapt as new ideas emerge", category: "creative" },
      { text: "Coordinate with team members regularly", category: "social" },
      { text: "Focus on tangible results and practical outcomes", category: "practical" },
    ],
  },
  {
    id: 16,
    question: "Which career aspect is most important to you?",
    options: [
      { text: "Opportunities for advancement and leadership", category: "leadership" },
      { text: "Creative expression and innovation", category: "creative" },
      { text: "Job security and structured environment", category: "analytical" },
      { text: "Helping others and social impact", category: "social" },
    ],
  },
  {
    id: 17,
    question: "You're most interested in understanding:",
    options: [
      { text: "How things work mechanically or technically", category: "technical" },
      { text: "Why people behave the way they do", category: "social" },
      { text: "How to optimize processes and solve problems", category: "analytical" },
      { text: "How to express ideas in new and beautiful ways", category: "creative" },
    ],
  },
  {
    id: 18,
    question: "Which school assignment would you enjoy most?",
    options: [
      { text: "Writing a research paper with data analysis", category: "analytical" },
      { text: "Creating a multimedia presentation or art project", category: "creative" },
      { text: "Leading a team debate or group discussion", category: "leadership" },
      { text: "Conducting interviews and understanding perspectives", category: "social" },
    ],
  },
  {
    id: 19,
    question: "When making decisions, you rely most on:",
    options: [
      { text: "Facts, data, and logical reasoning", category: "analytical" },
      { text: "Intuition and creative insight", category: "creative" },
      { text: "Input from others and consensus", category: "social" },
      { text: "Practical considerations and real-world outcomes", category: "practical" },
    ],
  },
  {
    id: 20,
    question: "What type of recognition would mean the most to you?",
    options: [
      { text: "Being acknowledged as an expert in your field", category: "analytical" },
      { text: "Having your creative work appreciated and admired", category: "creative" },
      { text: "Being known as a caring and helpful person", category: "social" },
      { text: "Being respected as a strong leader", category: "leadership" },
    ],
  },
  {
    id: 21,
    question: "In a crisis situation, you tend to:",
    options: [
      { text: "Stay calm and analyze the situation methodically", category: "analytical" },
      { text: "Think creatively to find unconventional solutions", category: "creative" },
      { text: "Take charge and organize people to address the issue", category: "leadership" },
      { text: "Support and reassure those who are affected", category: "social" },
    ],
  },
  {
    id: 22,
    question: "Which type of book or content do you prefer?",
    options: [
      { text: "Non-fiction, biographies, or educational content", category: "analytical" },
      { text: "Fiction, poetry, or artistic content", category: "creative" },
      { text: "Self-help, psychology, or interpersonal topics", category: "social" },
      { text: "Business, leadership, or entrepreneurship", category: "leadership" },
    ],
  },
  {
    id: 23,
    question: "Your approach to technology is:",
    options: [
      { text: "I love learning how it works and building with it", category: "technical" },
      { text: "I use it as a tool for creative expression", category: "creative" },
      { text: "I use it to connect and communicate with others", category: "social" },
      { text: "I appreciate it when it makes tasks more efficient", category: "practical" },
    ],
  },
  {
    id: 24,
    question: "What would be your ideal work schedule?",
    options: [
      { text: "Flexible hours with autonomy over my time", category: "creative" },
      { text: "Regular, predictable hours with clear structure", category: "analytical" },
      { text: "Varied schedule with lots of interaction", category: "social" },
      { text: "Results-focused with freedom to work my way", category: "leadership" },
    ],
  },
  {
    id: 25,
    question: "Which achievement would make you feel most fulfilled?",
    options: [
      { text: "Publishing research or making a scientific discovery", category: "analytical" },
      { text: "Creating an innovative product or technology", category: "technical" },
      { text: "Starting a successful business or organization", category: "leadership" },
      { text: "Creating impactful art or inspiring others creatively", category: "creative" },
    ],
  },
];

export function AptitudeQuiz() {
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (category: string) => {
    const newAnswers = [...answers, category];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateResults = () => {
    const scores: { [key: string]: number } = {
      analytical: 0,
      creative: 0,
      social: 0,
      technical: 0,
      leadership: 0,
      practical: 0,
    };

    answers.forEach((category) => {
      scores[category] = (scores[category] || 0) + 1;
    });

    return scores;
  };

  const getRecommendations = (scores: { [key: string]: number }) => {
    const topCategories = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category);

    const recommendations: { 
      [key: string]: { 
        stream: string; 
        careers: string[];
        description: string;
      } 
    } = {
      analytical: {
        stream: "Science (PCM) / Commerce / Economics",
        description: "You have strong analytical and logical thinking skills. You excel at problem-solving, data analysis, and systematic thinking.",
        careers: [
          "Data Scientist / Analyst",
          "Research Scientist",
          "Financial Analyst / Actuary",
          "Chartered Accountant (CA)",
          "Economist",
          "Statistician",
          "Operations Research Analyst",
          "Investment Banker",
          "Market Research Analyst",
          "Quantitative Analyst"
        ],
      },
      creative: {
        stream: "Arts / Design / Media Studies / Fine Arts",
        description: "You possess exceptional creative thinking and artistic abilities. You thrive in environments that value innovation and original expression.",
        careers: [
          "Graphic Designer / UI-UX Designer",
          "Architect / Interior Designer",
          "Fashion Designer",
          "Content Writer / Copywriter",
          "Film Director / Cinematographer",
          "Advertising Creative Director",
          "Animation Artist",
          "Product Designer",
          "Brand Strategist",
          "Digital Artist / Illustrator"
        ],
      },
      social: {
        stream: "Arts / Humanities / Psychology / Social Work",
        description: "You excel in interpersonal relationships and have strong empathy. You're naturally inclined to help and understand others.",
        careers: [
          "Clinical Psychologist / Counselor",
          "Social Worker / NGO Manager",
          "Teacher / Professor",
          "Human Resources Manager",
          "Journalist / Reporter",
          "Speech Therapist",
          "Life Coach / Career Counselor",
          "Public Relations Specialist",
          "Healthcare Administrator",
          "Occupational Therapist"
        ],
      },
      technical: {
        stream: "Science (PCM) / Computer Science / Information Technology",
        description: "You have strong technical aptitude and enjoy working with technology. You're skilled at understanding complex systems.",
        careers: [
          "Software Developer / Engineer",
          "Cybersecurity Specialist",
          "AI/ML Engineer",
          "Data Engineer",
          "Cloud Architect",
          "Robotics Engineer",
          "Game Developer",
          "DevOps Engineer",
          "Blockchain Developer",
          "Systems Analyst"
        ],
      },
      leadership: {
        stream: "Commerce / Business Management / MBA",
        description: "You possess strong leadership qualities and entrepreneurial spirit. You excel at organizing, motivating, and directing others.",
        careers: [
          "Business Manager / CEO",
          "Entrepreneur / Startup Founder",
          "Marketing Manager",
          "Management Consultant",
          "Project Manager",
          "Business Development Manager",
          "Event Manager",
          "Sales Director",
          "Operations Manager",
          "Strategic Planner"
        ],
      },
      practical: {
        stream: "Engineering / Technical Vocational / Applied Sciences",
        description: "You have strong hands-on skills and prefer practical, tangible work. You excel at building and problem-solving in physical environments.",
        careers: [
          "Mechanical Engineer",
          "Civil Engineer",
          "Electrical Engineer",
          "Agricultural Scientist",
          "Aviation Pilot / Engineer",
          "Automobile Engineer",
          "Industrial Designer",
          "Manufacturing Engineer",
          "Construction Manager",
          "Environmental Engineer"
        ],
      },
    };

    return topCategories.map((cat) => ({
      category: cat,
      ...recommendations[cat]
    }));
  };

  const resetQuiz = () => {
    setStarted(false);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6">
              <Brain className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Professional Career Aptitude Assessment
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover your strengths, interests, and ideal career path through
              our comprehensive, scientifically-designed aptitude assessment developed 
              by professional career counselors. This detailed assessment takes 
              approximately 10-12 minutes to complete.
            </p>

            <Card className="p-8 mb-8">
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div className="flex gap-3">
                  <BookOpen className="h-6 w-6 text-purple-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">25 Comprehensive Questions</h3>
                    <p className="text-sm text-gray-600">
                      Covering multiple dimensions of aptitude
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Award className="h-6 w-6 text-purple-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Professional Assessment</h3>
                    <p className="text-sm text-gray-600">
                      Based on RIASEC & Multiple Intelligence models
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Palette className="h-6 w-6 text-purple-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Detailed Results</h3>
                    <p className="text-sm text-gray-600">
                      Personalized career & stream recommendations
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 mb-8 text-left bg-gradient-to-r from-purple-50 to-pink-50">
              <h3 className="font-semibold mb-3 text-center">This Assessment Evaluates:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Cognitive Abilities</p>
                    <p className="text-sm text-gray-600">Analytical, creative, & practical thinking</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Personality Traits</p>
                    <p className="text-sm text-gray-600">Social, leadership, & independent work styles</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Interest Areas</p>
                    <p className="text-sm text-gray-600">Technical, artistic, & interpersonal preferences</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Work Preferences</p>
                    <p className="text-sm text-gray-600">Environment, learning style, & motivation factors</p>
                  </div>
                </div>
              </div>
            </Card>

            <Button
              onClick={() => setStarted(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-6 text-lg h-auto"
            >
              Start Assessment
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const scores = calculateResults();
    const radarData = Object.entries(scores).map(([category, value]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      score: (value / answers.length) * 100,
    }));

    const barData = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .map(([category, value]) => ({
        category: category.charAt(0).toUpperCase() + category.slice(1),
        score: value,
      }));

    const recommendations = getRecommendations(scores);

    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Your Aptitude Assessment Results
              </h1>
              <p className="text-lg text-gray-600">
                Based on your responses to {questions.length} questions, here's your comprehensive personality profile and career recommendations
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Aptitude Profile Analysis
                </h2>
                <ResponsiveContainer width="100%" height={350}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Your Score"
                      dataKey="score"
                      stroke="#a855f7"
                      fill="#a855f7"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
                <p className="text-sm text-gray-600 mt-4 text-center">
                  This radar chart shows your relative strengths across different aptitude dimensions
                </p>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Detailed Score Breakdown
                </h2>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="score" fill="#a855f7" />
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-sm text-gray-600 mt-4 text-center">
                  Higher scores indicate stronger alignment with that aptitude category
                </p>
              </Card>
            </div>

            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-semibold mb-6">
                Your Top Aptitude Areas & Recommended Career Paths
              </h2>
              <div className="space-y-6">
                {recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="h-8 w-8 rounded-full bg-purple-500 text-white flex items-center justify-center flex-shrink-0 font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-purple-900 mb-2">
                          {rec.category.charAt(0).toUpperCase() + rec.category.slice(1)} Aptitude
                        </h3>
                        <p className="text-sm text-gray-700 mb-3">
                          {rec.description}
                        </p>
                        <div className="mb-3">
                          <p className="text-sm font-semibold text-purple-800 mb-1">
                            Recommended Stream:
                          </p>
                          <p className="text-sm text-gray-700 bg-white px-3 py-2 rounded-lg inline-block">
                            {rec.stream}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-purple-800 mb-2">
                            Top Career Options ({rec.careers.length}):
                          </p>
                          <div className="grid md:grid-cols-2 gap-2">
                            {rec.careers.map((career, idx) => (
                              <div
                                key={idx}
                                className="text-sm text-gray-700 flex items-center gap-2 bg-white px-3 py-2 rounded-lg"
                              >
                                <div className="h-1.5 w-1.5 rounded-full bg-purple-500 flex-shrink-0" />
                                {career}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
              <h3 className="font-semibold mb-3 text-blue-900">Next Steps:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>Research the recommended career paths in detail to understand daily responsibilities and requirements</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>Explore colleges and courses aligned with your recommended streams</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>Consider internships or job shadowing opportunities in your areas of interest</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>Consult with a career counselor to create a personalized educational roadmap</span>
                </li>
              </ul>
            </Card>

            <div className="text-center">
              <Button
                onClick={resetQuiz}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white mr-4"
              >
                Retake Assessment
              </Button>
              <Button variant="outline">
                Explore Recommended Careers
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card className="p-8">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm mb-4">
                Question {currentQuestion + 1}
              </span>
              <h2 className="text-2xl font-semibold text-gray-900">
                {questions[currentQuestion].question}
              </h2>
            </div>
            <div className="space-y-4">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option.category)}
                  className="w-full p-4 text-left rounded-xl border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-700 font-semibold">
                        {String.fromCharCode(65 + index)}
                      </span>
                    </div>
                    <span className="text-gray-900">{option.text}</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Answer honestly based on your genuine preferences and natural inclinations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
