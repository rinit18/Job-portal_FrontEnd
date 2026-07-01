/**
 * Centralized Application Configuration
 * All hardcoded environment variables, API endpoints, website name, 
 * social media links, and global paragraphs are defined here.
 */

// Use import.meta.env.VITE_API_URL if deployed, otherwise fallback to local backend.
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const WEBSITE_CONFIG = {
  name: "CareerConnect",
  tagline: "Find your dream job with us",
  aboutParagraph: "Job portal with user profiles, skill updates, certifications, work experience and admin job postings.",
  footerDeveloperText: "Designed & Developed By Rinit Bhowmick and team",
  developerGithub: "https://github.com/rinit18",
  
  socialLinks: {
    instagram: "https://www.instagram.com",
    telegram: "https://",
    youtube: "https://www.youtube.com/",
  },
  
  assets: {
    logoUrl: "", // If empty, IconAnchor will be used
    heroImage: "/Boy.png", // The main landing page illustration
    heroAvatars: ["/avatar.png", "/avatar1.png", "/avatar2.png"],
    heroCompanyLogo: "/Google.png",
    profileBanner: "/Profile/banner.jpg",
    defaultAvatar: "/avatar.png",
    workingGirl: "/Working/Girl.png",
    workingLogos: {
      "Build Your Resume": "/Working/Build Your Resume.png",
      "Apply for Job": "/Working/Apply for Job.png",
      "Get Hired": "/Working/Get Hired.png"
    }
  },
  
  landing: {
    hero: {
      titlePart1: "Find your",
      titleHighlight: "next connection",
      titlePart2: "with us",
      subtitle: "Good life begins with a great network. Connect with thousands of professionals and discover new opportunities in one place.",
      jobTitlePlaceholder: "Software Engineer",
      jobTypePlaceholder: "Fulltime",
      statsText: "10K+ got job",
      statsCount: "+9K",
      cardTitle: "Software Engineer",
      cardLocation: "New York",
      cardTime: "1 day ago",
      cardApplicants: "120 Applicants",
    },
    working: {
      title: "Works",
      subtitle: "Effortlessly navigate through the process and land your dream job.",
      profileCompletionText: "Complete your profile",
      profileCompletionPercent: "70% Completed",
    },
    subscribe: {
      title: "Never Wants to Miss Any Job News?",
      placeholder: "Your@email.com",
      buttonText: "Subscribe",
    }
  },
  
  about: {
    title: "About JobHook",
    paragraph1: "JobHook is a next-generation platform designed to revolutionize the way professionals and companies connect. We believe that finding the right job—or the perfect candidate—should not be a tedious, manual process.",
    missionTitle: "Our Mission",
    missionDesc: "To bridge the gap between world-class talent and industry-leading companies through intelligent, AI-driven matchmaking and a seamless user experience. We aim to empower applicants with automated resume parsing, skill matching, and tailored job recommendations, while providing employers with robust tools to discover and track the best candidates.",
    differentTitle: "What Makes Us Different",
    differentPoints: [
      {
        bold: "AI Match Scoring:",
        text: "Our proprietary language models read and evaluate resumes directly against job descriptions, providing an instant compatibility score and identifying skill gaps."
      },
      {
        bold: "Streamlined Profiles:",
        text: "Just upload your resume. We handle parsing your skills, experience, and education directly into a beautiful profile."
      },
      {
        bold: "Direct Communication:",
        text: "Say goodbye to black-hole applications. Use our built-in messaging system to connect directly with recruiters."
      }
    ],
    footerText: "Join us in reshaping the future of hiring."
  },
  
  contact: {
    title: "Contact Us",
    subtitle: "Have a question? We'd love to hear from you.",
    nameLabel: "Your Name",
    namePlaceholder: "John Doe",
    emailLabel: "Email Address",
    emailPlaceholder: "john@example.com",
    subjectLabel: "Subject",
    subjectPlaceholder: "How can we help?",
    messageLabel: "Message",
    messagePlaceholder: "Tell us more about your inquiry...",
    buttonText: "Send Message",
    successMsg: "Your message has been sent successfully. We will get back to you soon!",
    errorMsg: "Failed to send message. Please try again later."
  },
  
  support: {
    title: "Help & Support",
    subtitle: "How can we help you today?",
    cards: [
      {
        title: "FAQs",
        desc: "Find answers to the most commonly asked questions about profiles, AI scoring, and applications.",
        buttonText: "View FAQs",
        url: "/faqs"
      },
      {
        title: "Contact Us",
        desc: "Need specific help? Reach out to our support team and we'll get back to you within 24 hours.",
        buttonText: "Get in Touch",
        url: "/contact"
      },
      {
        title: "Feedback",
        desc: "Have a suggestion or found a bug? We'd love to hear your thoughts to improve the platform.",
        buttonText: "Share Feedback",
        url: "/feedback"
      }
    ]
  }
};

