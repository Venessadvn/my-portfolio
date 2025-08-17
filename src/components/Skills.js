import React, { useState, useEffect, useRef, Suspense } from 'react';
import * as THREE from 'three';

// 3D Background Scene Component
const SkillsThreeScene = () => {
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

    // Create tech-themed 3D elements
    const shapes = [];
    
    // Gear wheels (representing tools and technologies)
    const createGear = (radius, teeth, position, color) => {
      const gearShape = new THREE.Shape();
      for (let i = 0; i < teeth; i++) {
        const angle = (i / teeth) * Math.PI * 2;
        const innerRadius = radius * 0.8;
        const outerRadius = radius;
        
        if (i === 0) {
          gearShape.moveTo(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius);
        }
        
        const nextAngle = ((i + 0.5) / teeth) * Math.PI * 2;
        gearShape.lineTo(Math.cos(nextAngle) * outerRadius, Math.sin(nextAngle) * outerRadius);
        
        const innerAngle = ((i + 1) / teeth) * Math.PI * 2;
        gearShape.lineTo(Math.cos(innerAngle) * innerRadius, Math.sin(innerAngle) * innerRadius);
      }
      
      const gearGeometry = new THREE.ExtrudeGeometry(gearShape, { depth: 0.1, bevelEnabled: false });
      const gearMaterial = new THREE.MeshBasicMaterial({ 
        color: color,
        wireframe: true,
        transparent: true,
        opacity: 0.3
      });
      const gear = new THREE.Mesh(gearGeometry, gearMaterial);
      gear.position.set(...position);
      return gear;
    };

    const gear1 = createGear(1, 12, [-5, 2, -6], 0x3b82f6);
    const gear2 = createGear(0.8, 10, [5, -1, -7], 0x8b5cf6);
    const gear3 = createGear(1.2, 14, [0, 0, -5], 0x06b6d4);
    
    scene.add(gear1);
    scene.add(gear2);
    scene.add(gear3);
    
    shapes.push({ mesh: gear1, rotationSpeed: { x: 0, y: 0, z: 0.02 } });
    shapes.push({ mesh: gear2, rotationSpeed: { x: 0, y: 0, z: -0.025 } });
    shapes.push({ mesh: gear3, rotationSpeed: { x: 0, y: 0, z: 0.015 } });

    // Floating code brackets
    const bracketGeometry = new THREE.RingGeometry(0.5, 0.8, 4, 1);
    const bracketMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x10b981,
      transparent: true,
      opacity: 0.4
    });
    
    for (let i = 0; i < 6; i++) {
      const bracket = new THREE.Mesh(bracketGeometry, bracketMaterial.clone());
      bracket.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6,
        -8 + Math.random() * 4
      );
      bracket.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      scene.add(bracket);
      shapes.push({ 
        mesh: bracket, 
        rotationSpeed: { 
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.02
        }
      });
    }

    camera.position.z = 5;

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      
      shapes.forEach(({ mesh, rotationSpeed }) => {
        mesh.rotation.x += rotationSpeed.x;
        mesh.rotation.y += rotationSpeed.y;
        mesh.rotation.z += rotationSpeed.z;
        
        // Add floating animation for brackets
        if (mesh.geometry instanceof THREE.RingGeometry) {
          mesh.position.y += Math.sin(Date.now() * 0.001 + mesh.position.x) * 0.003;
        }
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

// Technology Icon Component with Real Logos
const TechIcon = ({ name, logo, color, proficiency, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [imageError, setImageError] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div 
      ref={ref}
      className={`group relative p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer border border-gray-200 dark:border-gray-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Skill Icon */}
      <div className="flex justify-center mb-4">
        <div className={`w-16 h-16 transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}>
          {!imageError ? (
            <img 
              src={logo} 
              alt={`${name} logo`}
              className="w-full h-full object-contain"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className={`w-full h-full rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-white text-2xl font-bold`}>
              {name.charAt(0)}
            </div>
          )}
        </div>
      </div>
      
      {/* Skill Name */}
      <h3 className="text-center text-lg font-semibold text-gray-800 dark:text-white mb-3">
        {name}
      </h3>
      
      {/* Proficiency Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-300">Proficiency</span>
          <span className="font-medium text-blue-600 dark:text-blue-400">{proficiency}%</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-1000 ease-out"
            style={{ width: isVisible ? `${proficiency}%` : '0%' }}
          />
        </div>
      </div>
      
      {/* Hover Border Effect */}
      <div className={`absolute inset-0 border-2 border-blue-500 dark:border-blue-400 rounded-2xl transition-opacity duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`} />
    </div>
  );
};

// Certificate Card Component
const CertificateCard = ({ certificate, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div 
      className={`group relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 border border-gray-200 dark:border-gray-700 ${
        index % 2 === 0 ? 'animate-fade-in-left' : 'animate-fade-in-right'
      }`}
      style={{ animationDelay: `${index * 0.2}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Certificate Image */}
      <div className="relative h-64 bg-gray-100 dark:bg-gray-700 overflow-hidden">
        <img 
          src={certificate.image} 
          alt={certificate.title}
          className={`w-full h-full object-cover transition-all duration-500 ${
            isHovered ? 'scale-110' : 'scale-100'
          } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        {/* Fallback */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-6xl" style={{ display: 'none' }}>
          🏆
        </div>
        
        {/* Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-70' : 'opacity-40'
        }`} />
        
        {/* Badge */}
        <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-500 text-yellow-900 text-sm font-bold rounded-full">
          {certificate.year}
        </div>
      </div>

      {/* Certificate Content */}
      <div className="p-6 text-gray-800 dark:text-white">
        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {certificate.title}
        </h3>
        <p className="text-blue-600 dark:text-blue-400 font-semibold mb-3">{certificate.issuer}</p>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {certificate.description}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {certificate.tags.map((tag, tagIndex) => (
            <span 
              key={tagIndex}
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        
        {/* Issue Date */}
        <div className="text-gray-500 dark:text-gray-400 text-sm flex items-center">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          Issued: {certificate.issueDate}
        </div>
      </div>
      
      {/* Hover Glow Effect */}
      <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 transition-opacity duration-300 pointer-events-none ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`} />
    </div>
  );
};

// Main Skills Component
const Skills = () => {
  const [activeTab, setActiveTab] = useState('technologies');

  // Technologies with actual logos from CDN
  const technologies = [
    { 
      name: 'React', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', 
      color: 'from-blue-400 to-cyan-400', 
      proficiency: 90 
    },
    { 
      name: 'JavaScript', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', 
      color: 'from-yellow-400 to-yellow-600', 
      proficiency: 85 
    },
    { 
      name: 'Python', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', 
      color: 'from-blue-500 to-yellow-500', 
      proficiency: 80 
    },
    { 
      name: 'Spring Boot', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg', 
      color: 'from-green-400 to-green-600', 
      proficiency: 75 
    },
    { 
      name: 'MySQL', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', 
      color: 'from-blue-500 to-orange-500', 
      proficiency: 80 
    },
    { 
      name: 'Git', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', 
      color: 'from-red-500 to-orange-500', 
      proficiency: 85 
    },
    { 
      name: 'Node.js', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', 
      color: 'from-green-500 to-green-700', 
      proficiency: 78 
    },
    { 
      name: 'MongoDB', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', 
      color: 'from-green-400 to-green-600', 
      proficiency: 75 
    },
    { 
      name: 'HTML5', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', 
      color: 'from-orange-500 to-red-500', 
      proficiency: 95 
    },
    { 
      name: 'CSS3', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', 
      color: 'from-blue-500 to-blue-700', 
      proficiency: 95 
    },
    { 
      name: 'TypeScript', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', 
      color: 'from-blue-600 to-blue-800', 
      proficiency: 70 
    },
    { 
      name: 'AWS', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg', 
      color: 'from-orange-400 to-yellow-500', 
      proficiency: 65 
    }
  ];

  // Sample certificates
  const certificates = [
    {
      id: 1,
      title: 'Euphoria Internship Certificate',
      issuer: 'Euphoria GenX',
      description: 'Successfully Completed The Skill Development And Internship Programme, Working On Scantly | Smart Retail Management Project',
      image: '/api/placeholder/400/300',
      tags: ['Internship', 'Fullstack Development', 'Smart Retail', 'Project Experience'],
      year: '2025',
      issueDate: '2025'
    },
    {
      id: 2,
      title: 'Getting Started With Artificial Intelligence',
      issuer: 'IBM SkillsBuild',
      description: 'Certificate Of Completion For Foundational Concepts In Artificial Intelligence From IBM SkillsBuild',
      image: '/api/placeholder/400/300',
      tags: ['Artificial Intelligence', 'AI Basics', 'IBM SkillsBuild'],
      year: '2025',
      issueDate: '2025'
    },
    {
      id: 3,
      title: 'Front End Development - HTML',
      issuer: 'Great Learning',
      description: 'Successfully Completed A Free Online Course On Front End Development - HTML',
      image: '/api/placeholder/400/300',
      tags: ['Web Development', 'HTML', 'Frontend'],
      year: '2023',
      issueDate: '2023'
    },
    {
      id: 4,
      title: 'JavaScript Fundamentals',
      issuer: 'Great Learning',
      description: 'Certificate Of Completion For JavaScript Programming Fundamentals Course',
      image: '/api/placeholder/400/300',
      tags: ['JavaScript', 'Programming', 'Web Development'],
      year: '2023',
      issueDate: '2023'
    },
    {
      id: 5,
      title: 'React.js Development',
      issuer: 'Certificate Authority',
      description: 'Advanced React.js Development Certificate with modern practices and hooks',
      image: '/api/placeholder/400/300',
      tags: ['React', 'Frontend', 'Modern JavaScript'],
      year: '2024',
      issueDate: '2024'
    }
  ];

  const tabs = [
    { id: 'technologies', label: 'Technologies', icon: '⚡' },
    { id: 'certifications', label: 'Certifications', icon: '🏆' }
  ];

  return (
    <section id="skills" className="relative min-h-screen py-20 bg-gray-50 dark:bg-gray-900 overflow-hidden transition-colors duration-500">
      {/* 3D Background Scene */}
      <Suspense fallback={<div className="absolute inset-0 bg-transparent" />}>
        <SkillsThreeScene />
      </Suspense>

      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10"></div>

      <div className="relative z-10 container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="text-4xl lg:text-5xl mr-4">🚀</div>
            <h2 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-purple-400 dark:to-blue-400">
              Skills & <span className="text-purple-600 dark:text-purple-400">Expertise</span>
            </h2>
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore my technical expertise and professional certifications that showcase 
            my commitment to continuous learning and excellence in software development.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="flex bg-white dark:bg-gray-800 backdrop-blur-sm rounded-2xl p-2 border border-gray-200 dark:border-gray-700 shadow-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Technologies Section */}
        {activeTab === 'technologies' && (
          <div className="mb-20">
            <h3 className="text-2xl lg:text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
              Technologies & Tools I Use
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {technologies.map((tech, index) => (
                <TechIcon
                  key={index}
                  name={tech.name}
                  logo={tech.logo}
                  color={tech.color}
                  proficiency={tech.proficiency}
                  delay={index * 100}
                />
              ))}
            </div>
          </div>
        )}

        {/* Certifications Section */}
        {activeTab === 'certifications' && (
          <div>
            <h3 className="text-2xl lg:text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
              Professional Certifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {certificates.map((certificate, index) => (
                <CertificateCard
                  key={certificate.id}
                  certificate={certificate}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16">
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Want to see more of my certifications or discuss collaboration?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-xl">
              View All Certificates
            </button>
            <button className="px-8 py-4 border-2 border-purple-500 text-purple-600 dark:text-purple-400 font-semibold rounded-full hover:bg-purple-500 hover:text-white transform hover:scale-105 transition-all duration-300">
              Get In Touch
            </button>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fade-in-left {
          animation: fade-in-left 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-fade-in-right {
          animation: fade-in-right 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default Skills;