// Import necessary React hooks and libraries
import { useState, useRef, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { IconBriefcase2, IconBell, IconSettings, IconMenu2, IconX } from "@tabler/icons-react";
import { Indicator, Avatar } from "@mantine/core";
import NavLinks from "./NavLinks";

const Header = () => {
  // State management for mobile menu toggle
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Router location for active link detection
  const location = useLocation();
  
  // Ref for click-outside detection
  const menuRef = useRef<HTMLDivElement>(null);

  // ========== Click-outside detection logic ==========
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close menu if click occurs outside the menu container
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    // Only add listener when menu is open
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup function to remove listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  // Navigation links configuration
  const links = [
    { name: "Find Jobs", url: "/find-jobs" },
    { name: "Find Talent", url: "/find-talent" },
    { name: "Upload Job", url: "/upload-job" },
    { name: "About Us", url: "/about" },
  ];

  return (
    <header className="w-full bg-mine-shaft-950 text-white h-16 md:h-20 font-['poppins']">
      {/* Main header container */}
      <div className="px-4 md:px-6 h-full flex justify-between items-center">
        
        {/* ========== Left Section (Logo & Mobile Menu Toggle) ========== */}
        <div className="flex items-center gap-4">
          {/* Mobile hamburger menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-mine-shaft-900"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? (
              <IconX className="h-6 w-6" /> // Close icon
            ) : (
              <IconMenu2 className="h-6 w-6" /> // Hamburger icon
            )}
          </button>

          {/* Application logo */}
          <div className="flex gap-2 md:gap-3 items-center">
            <IconBriefcase2 
              className="h-6 w-6 md:h-8 md:w-8" 
              stroke={1.25} 
              aria-hidden="true"
            />
            <div className="text-xl md:text-3xl font-semibold text-bright-sun-300">
              FindMyJob
            </div>
          </div>
        </div>

        {/* ========== Desktop Navigation (Hidden on mobile) ========== */}
        <NavLinks className="hidden md:flex" />

        {/* ========== Right Section (User Controls) ========== */}
        <div className="flex gap-2 md:gap-3 items-center">
          {/* User profile section */}
          <div className="flex gap-1 md:gap-2 items-center">
            <div className="hidden md:block">Rinit</div>
            <Avatar 
              src="/" 
              alt="User Avatar" 
              size="md"
              className="w-8 h-8 md:w-10 md:h-10"
            />
          </div>

          {/* Settings icon */}
          <div className="bg-mine-shaft-900 p-1 md:p-2 rounded-full hover:bg-mine-shaft-800 transition-colors">
            <IconSettings 
              className="w-5 h-5 md:w-6 md:h-6" 
              stroke={1.5} 
              aria-label="Settings"
            />
          </div>

          {/* Notifications with indicator */}
          <div className="bg-mine-shaft-900 p-1 md:p-2 rounded-full hover:bg-mine-shaft-800 transition-colors">
            <Indicator color="yellow" size={9} processing>
              <IconBell 
                className="w-5 h-5 md:w-6 md:h-6" 
                stroke={1.5} 
                aria-label="Notifications"
              />
            </Indicator>
          </div>
        </div>
      </div>

      {/* ========== Mobile Menu Dropdown (Hidden on desktop) ========== */}
      {menuOpen && (
        <div 
          ref={menuRef}
          className="md:hidden absolute w-full bg-mine-shaft-950 shadow-lg z-50"
          role="navigation"
        >
          <div className="px-4 py-3 border-t border-mine-shaft-800">
            {links.map((link, index) => (
              <Link
                key={index}
                to={link.url}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg transition-colors ${
                  // Active link styling
                  location.pathname === link.url
                    ? "bg-bright-sun-400/10 text-bright-sun-400"
                    : "text-mine-shaft-300 hover:bg-mine-shaft-900"
                }`}
                aria-current={location.pathname === link.url ? "page" : undefined}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;