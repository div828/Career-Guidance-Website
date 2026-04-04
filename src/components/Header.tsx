import { Menu, X, GraduationCap, LogOut, User } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  user: any;
}

export function Header({ currentPage, onNavigate, user }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "quiz", label: "Aptitude Quiz" },
    { id: "careers", label: "Careers" },
    { id: "colleges", label: "Colleges" },
    { id: "exams", label: "Exam Timeline" },
    { id: "resources", label: "Resources" },
    { id: "dashboard", label: "Dashboard" },
    { id: "profile", label: "Profile" },
  ];

  const handleLogout = () => {
    window.location.href = "http://localhost:5000/auth/logout";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-blue-500">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="text-lg font-semibold text-gray-900">
                Digital Guidance
              </div>
              <div className="text-xs text-gray-500 -mt-1">
                Student Platform
              </div>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "default" : "ghost"}
                onClick={() => onNavigate(item.id)}
                className={
                  currentPage === item.id
                    ? "bg-teal-500 text-white hover:bg-teal-600"
                    : ""
                }
              >
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Desktop User Section */}
          <div className="hidden md:flex items-center gap-4">

            {user ? (
              <>
                {/* Profile */}
                <div
                  onClick={() => onNavigate("profile")}
                  className="flex items-center gap-2 cursor-pointer hover:opacity-80"
                >
                  {user?.photo ? (
                    <img
                      src={user.photo}
                      alt="profile"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6 text-gray-500" />
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {user?.name}
                  </span>
                </div>

                {/* Logout */}
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-red-500 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              /* Login Button */
              <Button
                onClick={() => onNavigate("login")}
                className="bg-teal-500 text-white hover:bg-teal-600"
              >
                Login
              </Button>
            )}

          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-2">

              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "default" : "ghost"}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={
                    currentPage === item.id
                      ? "bg-teal-500 text-white hover:bg-teal-600 justify-start"
                      : "justify-start"
                  }
                >
                  {item.label}
                </Button>
              ))}

              {/* Mobile User Section */}
              <div className="mt-4 border-t pt-4 flex flex-col gap-2">

                {user ? (
                  <>
                    <div
                      onClick={() => {
                        onNavigate("profile");
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      {user?.photo ? (
                        <img
                          src={user.photo}
                          alt="profile"
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-6 w-6 text-gray-500" />
                      )}
                      <span className="text-sm font-medium">
                        {user?.name}
                      </span>
                    </div>

                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="text-red-500 justify-start"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => {
                      onNavigate("login");
                      setMobileMenuOpen(false);
                    }}
                    className="bg-teal-500 text-white justify-start"
                  >
                    Login
                  </Button>
                )}

              </div>

            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
