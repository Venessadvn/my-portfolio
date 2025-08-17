import React, { useState, useEffect, useRef, Suspense } from 'react';
import * as THREE from 'three';

// 3D Background Scene Component
const ProjectsThreeScene = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);
    
    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Create floating geometric shapes for projects theme
    const shapes = [];
    
    // Cube representing code blocks
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x00ff88,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(-5, 1, -6);
    scene.add(cube);
    shapes.push({ mesh: cube, rotationSpeed: { x: 0.015, y: 0.02, z: 0.01 } });

    // Tetrahedron
    const tetraGeometry = new THREE.TetrahedronGeometry(1.2);
    const tetraMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xff4081,
      wireframe: true,
      transparent: true,
      opacity: 0.5
    });
    const tetra = new THREE.Mesh(tetraGeometry, tetraMaterial);
    tetra.position.set(5, -1.5, -7);
    scene.add(tetra);
    shapes.push({ mesh: tetra, rotationSpeed: { x: 0.02, y: 0.015, z: 0.025 } });

    // Icosahedron
    const icoGeometry = new THREE.IcosahedronGeometry(1);
    const icoMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x3f51b5,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);
    icosahedron.position.set(0, 2.5, -5);
    scene.add(icosahedron);
    shapes.push({ mesh: icosahedron, rotationSpeed: { x: 0.01, y: 0.03, z: 0.02 } });

    // Ring (representing connections/networks)
    const ringGeometry = new THREE.RingGeometry(0.8, 1.2, 16);
    const ringMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xffeb3b,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.set(-2, -2, -4);
    scene.add(ring);
    shapes.push({ mesh: ring, rotationSpeed: { x: 0.025, y: 0.01, z: 0.02 } });

    camera.position.z = 5;

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      
      shapes.forEach(({ mesh, rotationSpeed }) => {
        mesh.rotation.x += rotationSpeed.x;
        mesh.rotation.y += rotationSpeed.y;
        mesh.rotation.z += rotationSpeed.z;
        
        // Add floating animation
        mesh.position.y += Math.sin(Date.now() * 0.0008 + mesh.position.x) * 0.003;
      });
      
      renderer.render(scene, camera);
    };
    
    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 -z-10" />;
};

// Project Card Component
const ProjectCard = ({ project, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-500 ${
        index % 2 === 0 ? 'animate-fade-in-up' : 'animate-fade-in-down'
      }`}
      style={{ animationDelay: `${index * 0.2}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Project Image */}
      <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-600 dark:from-blue-600 dark:to-purple-800 overflow-hidden">
        <img 
          src={project.image} 
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        {/* Fallback gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 dark:from-blue-600 dark:to-purple-800 flex items-center justify-center text-white text-6xl" style={{ display: 'none' }}>
          💻
        </div>
        
        {/* Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />
        
        {/* Live Demo Button */}
        <div className={`absolute top-4 right-4 transition-all duration-300 ${
          isHovered ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
        }`}>
          <button className="px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-full hover:bg-green-600 transition-colors duration-200">
            Live Demo
          </button>
        </div>
      </div>

      {/* Project Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
            {project.title}
          </h3>
          <div className="flex space-x-2">
            <a 
              href={project.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
            </a>
            <a 
              href={project.live} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech, techIndex) => (
            <span 
              key={techIndex}
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Project Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>{project.category}</span>
          <span>{project.year}</span>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className={`absolute inset-0 border-2 border-blue-500 dark:border-cyan-400 rounded-2xl transition-opacity duration-300 pointer-events-none ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`} />
    </div>
  );
};

// Filter Button Component
const FilterButton = ({ category, activeFilter, onClick }) => (
  <button
    onClick={() => onClick(category)}
    className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
      activeFilter === category
        ? 'bg-gradient-to-r from-blue-500 to-purple-500 dark:from-cyan-500 dark:to-blue-500 text-white shadow-lg'
        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
    }`}
  >
    {category}
  </button>
);

// Main Projects Component
const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [filteredProjects, setFilteredProjects] = useState([]);

  // Sample projects data
  const projects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "A full-stack e-commerce platform with React, Node.js, and MongoDB. Features include user authentication, payment integration, admin dashboard, and real-time inventory management.",
      image: "/api/placeholder/400/250",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      category: "Web App",
      year: "2024",
      github: "#",
      live: "#"
    },
    {
      id: 2,
      title: "Task Management App",
      description: "A collaborative task management application with real-time updates, drag-and-drop functionality, team collaboration features, and progress tracking.",
      image: "/api/placeholder/400/250",
      technologies: ["Vue.js", "Firebase", "Tailwind"],
      category: "Web App",
      year: "2024",
      github: "#",
      live: "#"
    },
    {
      id: 3,
      title: "Weather Dashboard",
      description: "A responsive weather dashboard that displays current weather, forecasts, and weather maps using real-time API data with beautiful data visualizations.",
      image: "/api/placeholder/400/250",
      technologies: ["React", "Chart.js", "API"],
      category: "Web App",
      year: "2023",
      github: "#",
      live: "#"
    },
    {
      id: 4,
      title: "Mobile Fitness App",
      description: "A React Native fitness tracking app with workout plans, progress tracking, social features, and integration with wearable devices.",
      image: "/api/placeholder/400/250",
      technologies: ["React Native", "Redux", "SQLite"],
      category: "Mobile App",
      year: "2024",
      github: "#",
      live: "#"
    },
    {
      id: 5,
      title: "Brand Identity Design",
      description: "Complete brand identity design for a tech startup including logo design, color palette, typography, business cards, and brand guidelines.",
      image: "/api/placeholder/400/250",
      technologies: ["Figma", "Illustrator", "Photoshop"],
      category: "Design",
      year: "2023",
      github: "#",
      live: "#"
    },
    {
      id: 6,
      title: "3D Portfolio Website",
      description: "An interactive 3D portfolio website built with Three.js featuring smooth animations, particle effects, and immersive user experience.",
      image: "/api/placeholder/400/250",
      technologies: ["Three.js", "React", "GSAP"],
      category: "Web App",
      year: "2024",
      github: "#",
      live: "#"
    }
  ];

  const categories = ["All", "Web App", "Mobile App", "Design"];

  // Filter projects based on active filter
  useEffect(() => {
    if (activeFilter === 'All') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(project => project.category === activeFilter));
    }
  }, [activeFilter]);

  return (
    <section id="projects" className="relative min-h-screen py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 overflow-hidden transition-colors duration-500">
      {/* 3D Background Scene */}
      <Suspense fallback={<div className="absolute inset-0 bg-transparent" />}>
        <ProjectsThreeScene />
      </Suspense>

      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10"></div>

      <div className="relative z-10 container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-cyan-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-4">
            My Projects
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-cyan-500 dark:to-pink-500 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Here's a collection of projects I've worked on, showcasing my skills in web development, 
            mobile apps, and design. Each project represents a unique challenge and learning experience.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <FilterButton
              key={category}
              category={category}
              activeFilter={activeFilter}
              onClick={setActiveFilter}
            />
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Want to see more of my work or discuss a project?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-cyan-500 dark:to-blue-500 text-white font-semibold rounded-full hover:from-blue-600 hover:to-purple-600 dark:hover:from-cyan-600 dark:hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-xl">
              View All Projects
            </button>
            <button className="px-8 py-4 border-2 border-purple-500 text-purple-600 dark:text-purple-300 font-semibold rounded-full hover:bg-purple-500 hover:text-white transform hover:scale-105 transition-all duration-300">
              Let's Collaborate
            </button>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default Projects;