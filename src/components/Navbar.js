import { useState, useEffect } from "react";

function Navbar() {
  const links = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Skills", href: "#skills" },
    { name: "Contact", href: "#contact" },
  ];

  const [darkMode, setDarkMode] = useState(true);

  // Apply dark mode class to <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-200 dark:bg-gray-800 bg-opacity-90 shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        <h1 className="text-2xl font-bold text-blue-500 dark:text-blue-400">
          MyPortfolio
        </h1>
        <ul className="flex space-x-6">
          {links.map((link, index) => (
            <li key={index}>
              <a
                href={link.href}
                className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        {/* Toggle Button */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="ml-6 px-4 py-2 rounded-lg border border-gray-400 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 
                     hover:bg-gray-100 dark:hover:bg-gray-600 transition"
        >
          {darkMode ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
