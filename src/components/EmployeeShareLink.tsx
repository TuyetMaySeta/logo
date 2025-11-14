import { useState, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import type { Employee } from "@/types/employee";
import UserAvatar from "./employee/list/Avartar";

interface EmployeeWelcomePageProps {
  employee: Employee;
}

const EmployeeShareLink = ({ employee }: EmployeeWelcomePageProps) => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [activeTab, setActiveTab] = useState("basic information");
  const overlayRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { id: "basic information", label: "📋 Basic Information", icon: "👤" },
    { id: "work experience", label: "💼 Work Experience", icon: "⏰" },
    { id: "other information", label: "❤️ Other information", icon: "🎨" },
  ];

  useEffect(() => {
    const colors = ["#60a5fa", "#3b82f6", "#fbbf24", "#f97316", "#ec4899"];
    const overlay = overlayRef.current;

    if (overlay) {
      for (let i = 0; i < 80; i++) {
        const confetti = document.createElement("div");
        confetti.className = "absolute w-3 h-3 rounded-sm";
        confetti.style.left = Math.random() * 100 + "%";
        confetti.style.top = -20 + "px";
        confetti.style.backgroundColor =
          colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animation = `confettiFall ${Math.random() * 2 + 3
          }s ease-in-out forwards`;
        confetti.style.animationDelay = Math.random() * 0.5 + "s";
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        overlay.appendChild(confetti);
      }
    }

    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>{`
        @keyframes floatingParticles {
          0% {
            transform: translateY(-100vh) translateX(0) rotate(0deg) scale(0.5);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
            transform: translateY(-80vh) translateX(20px) rotate(45deg) scale(1);
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(100vh) translateX(100px) rotate(360deg) scale(0.3);
            opacity: 0;
          }
        }

        .floating-particle {
          position: absolute;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 50%;
          pointer-events: none;
          animation: floatingParticles linear infinite;
          backdrop-filter: blur(2px);
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
        }
        
        @keyframes fadeOut {
          to { opacity: 0; visibility: hidden; }
        }
        
        @keyframes confettiFall {
          to { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        
        @keyframes shine {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.3) translateY(50px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
        
        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-15px) scale(1.05); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6), 0 0 80px rgba(147, 197, 253, 0.4); }
          50% { box-shadow: 0 0 60px rgba(59, 130, 246, 0.8), 0 0 120px rgba(147, 197, 253, 0.6); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Applied animations */
        .welcome-icon {
          animation: scaleIn 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s forwards, floatSlow 3s ease-in-out 1.2s infinite;
          opacity: 0;
        }
        
        .welcome-title {
          animation: slideUp 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s forwards;
          opacity: 0;
        }
        
        .welcome-subtitle {
          animation: slideUp 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) 0.8s forwards;
          opacity: 0;
        }
        
        .welcome-name {
          animation: slideUp 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) 1.1s forwards;
          opacity: 0;
        }
        
        .shimmer-text {
          background: linear-gradient(90deg, #0a2472, #2563eb, #1e40af);
          background-size: 200% auto;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          animation: shimmer 3s infinite linear;
        }
        
        .glow-effect {
          animation: glow 2s ease-in-out infinite;
        }
        
        .avatar-shine {
          animation: shine 3s ease-in-out infinite;
        }
        
        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
        
        .main-content {
          animation: fadeIn 1s ease 3.8s forwards;
        }
        
        .glass-effect {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .gradient-border {
          position: relative;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 197, 253, 0.1));
          border-radius: 24px;
        }
        
        .gradient-border::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 24px;
          padding: 2px;
          background: linear-gradient(135deg, #3b82f6, #93c5fd);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
        }
      `}</style>

      {/* Welcome Overlay */}
      {showWelcome && (
        <div
          ref={overlayRef}
          className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center z-[9999] bg-white"
          style={{ animation: "fadeOut 0.8s ease 5s forwards" }}
        >
          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1000 left-24 w-80 h-80 bg-blue-300/40 rounded-full blur-3xl shadow-[0_0_60px_20px_rgba(147,197,253,0.5)]"></div>
            <div className="absolute bottom-24 right-24 w-[26rem] h-[26rem] bg-purple-300/40 rounded-full blur-3xl shadow-[0_0_70px_30px_rgba(196,181,253,0.4)]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-blue-300/60 rounded-full shadow-[0_0_60px_10px_rgba(147,197,253,0.5)]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-blue-100/40 rounded-full shadow-[0_0_80px_20px_rgba(191,219,254,0.5)]"></div>
          </div>

          {/* Main Content */}
          <div className="relative z-10 flex flex-col items-center max-w-4xl px-6">
            <div className="welcome-icon mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-200/30 rounded-full blur-2xl glow-effect"></div>
                <div className="relative bg-white rounded-full p-2 shadow-2xl overflow-hidden w-36 h-36 flex items-center justify-center">
                  <UserAvatar
                    size={135}
                    name={employee.full_name}
                    avatarUrl={employee.avatar_url}
                  />
                </div>
              </div>
            </div>

            <h1 className="welcome-title text-7xl md:text-8xl font-black text-center mb-6 drop-shadow-2xl">
              <span className="shimmer-text">Welcome Aboard!</span>
            </h1>

            <p className="welcome-subtitle text-3xl md:text-4xl font-bold text-blue-900 text-center mb-4 drop-shadow-lg">
              New Member at
            </p>

            <div className="welcome-name relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-200 to-blue-400 rounded-2xl blur-xl opacity-60"></div>
              <div className="relative bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-2xl px-10 py-5 shadow-2xl flex justify-center">
                <img
                  src="https://ems.seta-international.vn/seta.png"
                  alt="SETA International"
                  className="h-12 md:h-20 object-contain"
                />
              </div>
            </div>

            <div
              className="mt-10 flex items-center gap-4 opacity-0"
              style={{
                animation:
                  "slideUp 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) 1.4s forwards",
              }}
            >
              <div className="w-16 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full"></div>
              <span className="text-blue-400 text-xl">✨</span>
              <div className="w-16 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full"></div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="main-content opacity-0 min-h-screen flex items-center px-4 bg-[#f0f9ff] relative overflow-hidden">
        {/* Floating white particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={`particle-${i}`}
              className="floating-particle"
              style={{
                width: `${Math.random() * 40 + 25}px`,
                height: `${Math.random() * 40 + 25}px`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 12 + 18}s`,
                animationDelay: `${Math.random() * 8}s`,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="glass-effect rounded-[40px] overflow-hidden px-10 lg:px-5">
            <div className="relative">
              {/* Background gradient blobs */}
              <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300 rounded-full filter blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl"></div>
              </div>

              {/* Back Button */}
              <div
                className="absolute -top-7 left-0 z-20 flex items-center gap-2 cursor-pointer group"
                onClick={() => (window.location.href = "/")}
              >
                <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-white text-2xl shadow-md group-hover:bg-blue-700 transition-all duration-300">
                  <ArrowLeft className="w-6 h-6" />
                </div>
                <span className="text-blue-900 font-semibold text-lg group-hover:underline">
                  Go to Homepage
                </span>
              </div>

              <div className="grid lg:grid-cols-[320px_1fr] gap-8 p-4 lg:p-6 relative z-10 mt-10">
                {/* Left - Avatar & Quick Info */}
                <div className="flex flex-col items-center">
                  <div className="relative mb-6 float-animation">
                    <div
                      className="w-52 h-52 rounded-full p-1 relative"
                      style={{
                        background: "linear-gradient(135deg, #3b82f6, #60a5fa)",
                        boxShadow: "0 20px 60px rgba(59, 130, 246, 0.5)",
                      }}
                    >
                      <UserAvatar
                        size={200}
                        name={employee.full_name}
                        avatarUrl={employee.avatar_url}
                      />
                      {/* Shine effect overlay */}
                      <div
                        className="avatar-shine absolute inset-0 w-full h-full rounded-full pointer-events-none z-20"
                        style={{
                          background:
                            "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)",
                        }}
                      />
                    </div>
                  </div>

                  <h1 className="text-3xl font-black mb-2 bg-gradient-to-r from-blue-900 to-blue-300 bg-clip-text text-transparent text-center">
                    {employee.full_name}
                  </h1>

                  <div className="bg-gradient-to-r from-blue-900 to-blue-400 text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg mb-6 text-center max-w-[280px]">
                    {employee.current_position}
                  </div>

                  <div className="w-full max-w-[320px] mt-1 mx-auto">
                    <div className="relative group">
                      {/* Gradient glow effect */}
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>

                      {/* Main card */}
                      <div className="relative bg-white rounded-3xl p-6 shadow-xl">
                        <div className="flex flex-col items-center gap-3">
                          {/* Title */}
                          <h3 className="text-xl font-bold text-blue-900 uppercase tracking-widest -mt-3">
                            SUMMARY
                          </h3>

                          {/* Divider */}
                          <div className="w-25 h-0.5 bg-gradient-to-r from-transparent via-blue-300 to-transparent -mt-3"></div>

                          {/* Content */}
                          <p className="text-sm font-semibold text-gray-700 text-center leading-relaxed -mt-1">
                            {employee.summary || "No summary available"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right - Tabs & Content */}
                <div className="flex flex-col">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-6 mb-10 border-l-4 mt-15 border-blue-500 shadow-sm max-w-3xl">
                    <div className="flex items-start gap-3">
                      <div className="text-4xl">👋</div>
                      <div>
                        <h3 className="text-xl font-bold text-blue-900 mb-2">
                          NEW EMPLOYEE ONBOARDING
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          We're excited to welcome a new employee to SETA! Let's
                          get to know them and make great things happen
                          together.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="relative">
                    {(() => {
                      const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
                      const [indicatorStyle, setIndicatorStyle] = useState({
                        left: 0,
                        width: 0,
                      });

                      useEffect(() => {
                        const activeTabIndex = tabs.findIndex(
                          (tab) => tab.id === activeTab
                        );
                        const activeTabNode = tabRefs.current[activeTabIndex];
                        if (activeTabNode) {
                          setIndicatorStyle({
                            left: activeTabNode.offsetLeft,
                            width: activeTabNode.offsetWidth,
                          });
                        }
                      }, [activeTab, tabs]);

                      return (
                        <>
                          {/* Tab Buttons */}
                          <div className="relative flex justify-start gap-7 mb-1 border-b-2 border-gray-200 w-[91%]">
                            <div
                              className="absolute bottom-[-2px] h-[52px] bg-gradient-to-r from-blue-900 to-blue-400 rounded-t-2xl shadow-lg transition-all duration-500 ease-in-out"
                              style={indicatorStyle}
                            />

                            {tabs.map((tab, index) => (
                              <button
                                key={tab.id}
                                ref={(el) => {
                                  tabRefs.current[index] = el;
                                }}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative z-10 px-5 py-3 rounded-t-2xl font-bold text-sm whitespace-nowrap transition-colors duration-300 ${activeTab === tab.id
                                    ? "text-white"
                                    : "text-gray-500 hover:text-blue-800"
                                  }`}
                              >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.label}
                              </button>
                            ))}
                          </div>

                          {/* Tab Content */}
                          <div className="relative mt-[-2px]">
                            <div
                              className="bg-gradient-to-r from-blue-900 to-blue-400 transition-all duration-500 ease-in-out"
                              style={{
                                ...indicatorStyle,
                                borderBottomLeftRadius: "1rem",
                                borderBottomRightRadius: "1rem",
                              }}
                            />

                            <div className="pt-10 pb-8 px-10 bg-gradient-to-r from-blue-900 to-blue-300 rounded-b-2xl rounded-tr-3xl shadow-lg min-h-[200px] w-[92%]">
                              {activeTab === "basic information" && (
                                <div className="animate-slideIn">
                                  <div className="space-y-5">
                                    <div className="flex flex-col md:flex-row gap-x-8 gap-y-5">
                                      <div className="flex-1 flex items-center gap-4">
                                        <div className="bg-blue-100/70 text-white p-3 rounded-xl text-2xl">
                                          📧
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium text-white">
                                            Email Address
                                          </p>
                                          <p className="text-base text-white">
                                            {employee.email}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex-1 flex items-center gap-4">
                                        <div className="bg-blue-100/70 text-white p-3 rounded-xl text-2xl">
                                          📱
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium text-white">
                                            Phone Number
                                          </p>
                                          <p className="text-base text-white">
                                            {employee.phone}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    <hr className="border-t border-blue-200/60" />
                                    <div className="flex flex-col md:flex-row gap-x-8 gap-y-5">
                                      <div className="flex-1 flex items-center gap-4">
                                        <div className="bg-green-100/70 text-green-800 p-3 rounded-xl text-2xl">
                                          🚀
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium text-white">
                                            Start Date
                                          </p>
                                          <p className="text-base text-white">
                                            {new Date(
                                              employee.join_date
                                            ).toLocaleDateString("en-US", {
                                              year: "numeric",
                                              month: "long",
                                              day: "numeric",
                                            })}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex-1 flex items-center gap-4">
                                        <div className="bg-pink-100/70 text-pink-800 p-3 rounded-xl text-2xl">
                                          🎂
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium text-white">
                                            Date of Birth
                                          </p>
                                          <p className="text-base text-white">
                                            {new Date(
                                              employee.date_of_birth
                                            ).toLocaleDateString("en-US", {
                                              year: "numeric",
                                              month: "long",
                                              day: "numeric",
                                            })}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {activeTab === "work experience" && (
                                <div className="animate-slideIn">
                                  <div className="space-y-6">
                                    <div className="flex flex-col md:flex-row gap-6">
                                      {employee.educations &&
                                        employee.educations.length > 0 && (
                                          <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
                                            <div className="flex items-start gap-4">
                                              <div className="bg-white/90 p-3 rounded-lg text-3xl shadow-md">
                                                🎓
                                              </div>
                                              <div className="flex-1">
                                                <p className="text-lg font-bold text-white">
                                                  {employee.educations[0].major}
                                                </p>
                                                <p className="text-base text-blue-50 mt-1">
                                                  {
                                                    employee.educations[0]
                                                      .school_name
                                                  }
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        )}

                                      {employee.projects &&
                                        employee.projects.length > 0 && (
                                          <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
                                            <div className="flex items-start gap-4">
                                              <div className="bg-white/90 p-3 rounded-lg text-3xl shadow-md">
                                                💼
                                              </div>
                                              <div className="flex-1">
                                                <p className="text-lg font-bold text-white">
                                                  Previous Role
                                                </p>
                                                <p className="text-base text-blue-50 mt-1">
                                                  {
                                                    employee.projects[0]
                                                      .position
                                                  }
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                    </div>

                                    {employee.technical_skills &&
                                      employee.technical_skills.length > 0 && (
                                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
                                          <div className="flex items-start gap-4">
                                            <div className="bg-white/90 p-3 rounded-lg text-3xl shadow-md">
                                              ⚡
                                            </div>
                                            <div className="flex-1">
                                              <div className="flex flex-wrap gap-2">
                                                {employee.technical_skills.map(
                                                  (skill, idx) => (
                                                    <span
                                                      key={idx}
                                                      className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold text-white border border-white/30 hover:bg-white/30 transition-all duration-300"
                                                    >
                                                      {skill.skill_name}
                                                    </span>
                                                  )
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                  </div>
                                </div>
                              )}

                              {activeTab === "other information" && (
                                <div className="animate-slideIn">
                                  <div className="space-y-5">
                                    {employee.languages &&
                                      employee.languages.length > 0 && (
                                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 hover:bg-white/15 transition-all duration-300">
                                          <div className="flex items-start gap-4">
                                            <div className="bg-white/90 p-3 rounded-lg text-3xl shadow-md">
                                              🌍
                                            </div>
                                            <div className="flex-1">
                                              <p className="text-sm font-medium text-blue-100 mb-3">
                                                Languages
                                              </p>
                                              <div className="flex flex-wrap gap-2">
                                                {employee.languages.map(
                                                  (lang, idx) => (
                                                    <span
                                                      key={idx}
                                                      className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold text-white border border-white/30 hover:bg-white/30 transition-all duration-300"
                                                    >
                                                      {lang.language_name} -{" "}
                                                      {lang.proficiency}
                                                    </span>
                                                  )
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                    {employee.profile?.hobbies && (
                                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
                                        <div className="flex items-start gap-4">
                                          <div className="bg-white/90 p-3 rounded-lg text-3xl shadow-md">
                                            🎨
                                          </div>
                                          <div className="flex-1">
                                            <p className="text-sm font-medium text-blue-100 mb-3">
                                              Hobbies
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                              {employee.profile.hobbies
                                                .split(";")
                                                .map((hobby, idx) => (
                                                  <span
                                                    key={idx}
                                                    className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold text-white border border-white/30 hover:bg-white/30 transition-all duration-300"
                                                  >
                                                    {hobby.trim()}
                                                  </span>
                                                ))}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gradient-to-r from-blue-950 to-blue-300 px-24 py-2 relative overflow-hidden -ml-14 -mr-15">
              {/* White glow effect */}
              <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div className="absolute bottom-[-250px] left-[35%] w-64 h-64 bg-white rounded-full filter blur-3xl"></div>
              </div>

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-black text-white mb-1">
                    Connect with me
                  </h3>
                  <p className="text-blue-100 text-sm">
                    Happy to become a member of SETA International Vietnam
                  </p>
                </div>
                <button
                  onClick={() =>
                    window.open(
                      `https://teams.microsoft.com/l/chat/0/0?users=${employee.email}`,
                      "_blank"
                    )
                  }
                  className="bg-white text-blue-900 px-4 py-1.5 rounded-full font-bold text-base shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 flex items-center gap-3"
                >
                  <img
                    src="https://banner2.cleanpng.com/20240402/sek/transparent-teams-logo-microsoft-teams-logo-with-group-of-people660ca6dfd1a983.72035149.webp"
                    alt="Teams Logo"
                    className="w-6 h-6"
                  />
                  <span>Say "Hi" on Teams</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeShareLink;
