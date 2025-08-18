import React, { useState, useEffect, useRef, Suspense } from 'react';
import * as THREE from 'three';
import { ExternalLink, Github, Eye, Code } from 'lucide-react';

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
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

 // Determine project category based on tech stack
const getProjectCategory = (tech) => {
  if (!tech) return 'Other';   // 🔥 Prevents crash if undefined/null

  if (tech.includes('Figma')) return 'Design';
  if (tech.includes('Python') || tech.includes('Transformers') || tech.includes('Flask')) return 'AI/ML';
  if (tech.includes('React') || tech.includes('HTML') || tech.includes('Spring Boot')) return 'Web App';
  return 'Other';
};

const category = getProjectCategory(project.tech);


  return (
    <div 
      className={`group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-500 ${
        index % 2 === 0 ? 'animate-fade-in-up' : 'animate-fade-in-down'
      }`}
      style={{ animationDelay: `${index * 0.2}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Project Preview */}
      <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-600 dark:from-blue-600 dark:to-purple-800 overflow-hidden">
        {!imageError ? (
          <img 
            src={project.preview} 
            alt={`${project.name} preview`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-4xl">
            {category === 'Design' ? '🎨' : category === 'AI/ML' ? '🤖' : '💻'}
          </div>
        )}
        
        {/* Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
            {category}
          </span>
        </div>

        {/* Action Buttons on Hover */}
        <div className={`absolute top-4 right-4 flex gap-2 transition-all duration-300 ${
          isHovered ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
        }`}>
          <a
            href={project.view}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors duration-200 group/btn"
            title="View Project"
          >
            <Eye className="w-4 h-4" />
          </a>
          {project.code && (
            <a
              href={project.code}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition-colors duration-200 group/btn"
              title="View Code"
            >
              <Github className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Project Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
            {project.name}
          </h3>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tech.map((tech, techIndex) => (
            <span 
              key={techIndex}
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <a
            href={project.view}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
          >
            <ExternalLink className="w-4 h-4" />
            View
          </a>
          {project.code && (
            <a
              href={project.code}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
            >
              <Code className="w-4 h-4" />
              Code
            </a>
          )}
          {!project.code && (
            <div className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-semibold rounded-lg cursor-not-allowed">
              <Code className="w-4 h-4" />
              Design Only
            </div>
          )}
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
const FilterButton = ({ category, activeFilter, onClick, count }) => (
  <button
    onClick={() => onClick(category)}
    className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 relative ${
      activeFilter === category
        ? 'bg-gradient-to-r from-blue-500 to-purple-500 dark:from-cyan-500 dark:to-blue-500 text-white shadow-lg'
        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
    }`}
  >
    {category}
    {count > 0 && (
      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
        activeFilter === category 
          ? 'bg-white/20' 
          : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
      }`}>
        {count}
      </span>
    )}
  </button>
);

// Main Projects Component
const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [filteredProjects, setFilteredProjects] = useState([]);

  // Your actual projects data
  const projects = [
    {
      name: "Talent Hunt",
      description: "A virtual talent evaluation system where contestants upload performances and judges score them category-wise.",
      tech: ["React", "Spring Boot", "MySQL"],
      preview: "/images/talenthunt.jpg",
      code: "https://github.com/yourusername/farm-direct", 
      view: "https://talent-hunt-demo.vercel.app"
    },
    {
      name: "Mind Mate",
      description: "A mental wellness app that uses AI-driven chat support and resources for stress management.",
      tech: ["Python", "Flask", "AI APIs"],
      preview: "/images/mind-mate.jpg",
      code: "https://github.com/yourusername/mind-mate",
      view: "https://mindmate-demo.vercel.app"
    },
    {
      name: "Sentiment Analyzer",
      description: "NLP-based sentiment analysis system using BERT to classify text emotions.",
      tech: ["Python", "Transformers", "Hugging Face"],
      preview: "/images/sentiment.jpg",
      code: "https://huggingface.co/spaces/SreyaDvn/bert-sentiment-analyzer/tree/main",
      view: "https://huggingface.co/spaces/SreyaDvn/bert-sentiment-analyzer"
    },
    {
      name: "Farm Direct",
      description: "Farmer-to-customer app with emergency alerts, live marketplace, and regional language support.",
      tech: ["Figma"],
      preview: "/images/farmdirect.jpg",
      code: null, // No code available, only Figma design
      view: "https://farm-direct-demo.vercel.app"
    },
    {
      name: "PTM Phosphorylation Predictor",
      description: "Bioinformatics web app for predicting phosphorylation sites in protein sequences.",
      tech: ["Python", "Flask"],
      preview: "/images/ptm.jpg",
      code: "https://github.com/yourusername/ptm-predictor",
      view: "https://ptm-demo.vercel.app"
    },
    {
      name: "Weather App",
      description: "Weather forecasting app with real-time API integration and location-based forecasts.",
      tech: ["HTML", "CSS", "Javascript", "OpenWeather API"],
      preview: "/images/weather.jpg",
      code: "https://github.com/yourusername/weather-app",
      view: "https://weather-demo.vercel.app"
    }
  ];

  // Get categories and their counts
  const getCategories = () => {
    const categoryCount = { 'All': projects.length };
    
    projects.forEach(project => {
      const category = project.tech.includes('Figma') ? 'Design' :
                     project.tech.includes('Python') || project.tech.includes('Transformers') || project.tech.includes('Flask') ? 'AI/ML' :
                     project.tech.includes('React') || project.tech.includes('HTML') || project.tech.includes('Spring Boot') ? 'Web App' :
                     'Other';
      
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });
    
    return Object.keys(categoryCount).map(category => ({
      name: category,
      count: categoryCount[category]
    }));
  };

  const categories = getCategories();

  // Filter projects based on active filter
  useEffect(() => {
    if (activeFilter === 'All') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(project => {
        const category = project.tech.includes('Figma') ? 'Design' :
                        project.tech.includes('Python') || project.tech.includes('Transformers') || project.tech.includes('Flask') ? 'AI/ML' :
                        project.tech.includes('React') || project.tech.includes('HTML') || project.tech.includes('Spring Boot') ? 'Web App' :
                        'Other';
        return category === activeFilter;
      }));
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
            Here's a collection of projects I've worked on, ranging from AI/ML applications to web development 
            and UI/UX design. Each project represents a unique challenge and learning experience.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <FilterButton
              key={category.name}
              category={category.name}
              activeFilter={activeFilter}
              onClick={setActiveFilter}
              count={category.count}
            />
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.name} project={project} index={index} />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Want to see more of my work or discuss a project?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://github.com/Venessadvn"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-cyan-500 dark:to-blue-500 text-white font-semibold rounded-full hover:from-blue-600 hover:to-purple-600 dark:hover:from-cyan-600 dark:hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-xl"
            >
              <Github className="w-5 h-5" />
              View All on GitHub
            </a>
            
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