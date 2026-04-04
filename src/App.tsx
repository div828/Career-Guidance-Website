import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Homepage } from "./components/Homepage";
import { AptitudeQuiz } from "./components/AptitudeQuiz";
import { CareerOptions } from "./components/CareerOptions";
import { Colleges } from "./components/Colleges";
import { ExamTimeline } from "./components/ExamTimeline";
import { Resources } from "./components/Resources";
import { UserDashboard } from "./components/UserDashboard";
import Login from "./components/Login";
import Onboarding from "./components/Onboarding";
import Profile from "./components/Profile";
import SearchPage from "./components/SearchPage";
import { CollegeDetails } from "./components/CollegeDetails";

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>("home");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 🔥 NEW STATE (for selected college)
  const [selectedCollege, setSelectedCollege] = useState<any>(null);

  /* ================= FETCH USER ================= */

  const fetchUser = async () => {
    try {
      const res = await fetch("http://localhost:5000/auth/user", {
        credentials: "include",
      });

      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = await res.json();
      setUser(data);
    } catch (error) {
      console.error("User fetch failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  /* ================= LOADING ================= */

  if (loading) {
    return <div className="p-8 text-center text-lg">Loading...</div>;
  }

  /* ================= FIRST TIME LOGIN ================= */

  if (user && !user.profile_completed) {
    return <Onboarding onComplete={fetchUser} />;
  }

  /* ================= NAVIGATION HANDLER ================= */

  const handleNavigation = (page: string, query?: string) => {
    if (query !== undefined) {
      setSearchQuery(query);
    }
    setCurrentPage(page);
  };

  /* ================= NEW FUNCTION FOR COLLEGE CLICK ================= */

  const handleCollegeClick = (college: any) => {
    setSelectedCollege(college);
    setCurrentPage("collegeDetails");
  };

  /* ================= PAGE RENDERING ================= */

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <Homepage
            onNavigate={(page: string, query?: string) =>
              handleNavigation(page, query)
            }
          />
        );

      case "search":
        return (
          <SearchPage
            query={searchQuery}
            onNavigate={(page: string, query?: string) =>
              handleNavigation(page, query)
            }
          />
        );

      case "quiz":
        return user ? <AptitudeQuiz /> : <Login />;

      case "careers":
        return <CareerOptions />;

      case "colleges":
        return (
          <Colleges
            onCollegeClick={handleCollegeClick} // 🔥 NEW PROP
          />
        );

      case "collegeDetails":
        return (
          <CollegeDetails
            college={selectedCollege}
            onBack={() => setCurrentPage("colleges")}
          />
        );

      case "exams":
        return <ExamTimeline />;

      case "resources":
        return <Resources />;

      case "dashboard":
        return user ? <UserDashboard /> : <Login />;

      case "profile":
        return user ? <Profile user={user} /> : <Login />;

      case "login":
        return <Login />;

      default:
        return (
          <Homepage
            onNavigate={(page: string, query?: string) =>
              handleNavigation(page, query)
            }
          />
        );
    }
  };

  /* ================= APP UI ================= */

  return (
    <div className="min-h-screen bg-white">
      <Header
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        user={user}
      />
      {renderPage()}
    </div>
  );
}