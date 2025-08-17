import React, { useState, useEffect, useRef, Suspense } from 'react';
import * as THREE from 'three';

// 3D Background Scene Component
const AboutThreeScene = () => {
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

    // Create floating geometric shapes for about theme
    const shapes = [];
    
    // DNA-like double helix (representing growth and learning)
    const helixPoints = [];
    for (let i = 0; i < 200; i++) {
      const angle = i * 0.1;
      const y = i * 0.05 - 5;
      helixPoints.push(new THREE.Vector3(Math.cos(angle) * 1, y, Math.sin(angle) * 1));
      helixPoints.push(new THREE.Vector3(Math.cos(angle + Math.PI) * 1, y, Math.sin(angle + Math.PI) * 1));
    }
    
    const helixGeometry = new THREE.BufferGeometry().setFromPoints(helixPoints);
    const helixMaterial = new THREE.LineBasicMaterial({ 
      color: 0x00ffaa,
      transparent: true,
      opacity: 0.6
    });
    const helix = new THREE.Line(helixGeometry, helixMaterial);
    helix.position.set(-6, 0, -8);
    scene.add(helix);
    shapes.push({ mesh: helix, rotationSpeed: { x: 0, y: 0.02, z: 0 } });

    // Brain-like sphere (representing knowledge)
    const sphereGeometry = new THREE.SphereGeometry(1.2, 16, 16);
    const sphereMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xff6b35,
      wireframe: true,
      transparent: true,
      opacity: 0.5
    });
    const brain = new THREE.Mesh(sphereGeometry, sphereMaterial);
    brain.position.set(5, 2, -6);
    scene.add(brain);
    shapes.push({ mesh: brain, rotationSpeed: { x: 0.01, y: 0.015, z: 0.02 } });

    // Interconnected nodes (representing connections)
    const nodeGeometry = new THREE.OctahedronGeometry(0.3);
    const nodeMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.7
    });
    
    for (let i = 0; i < 8; i++) {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial.clone());
      const angle = (i / 8) * Math.PI * 2;
      node.position.set(
        Math.cos(angle) * 3, 
        Math.sin(angle * 0.5) * 2, 
        Math.sin(angle) * 3 - 5
      );
      scene.add(node);
      shapes.push({ 
        mesh: node, 
        rotationSpeed: { x: 0.02, y: 0.01, z: 0.015 },
        originalPosition: node.position.clone()
      });
    }

    // Floating code symbols
    const symbolGeometry = new THREE.PlaneGeometry(0.5, 0.5);
    const symbols = ['<>', '{}', '[]', '()'];
    symbols.forEach((symbol, index) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 64;
      canvas.height = 64;
      context.fillStyle = '#8b5cf6';
      context.font = '24px monospace';
      context.textAlign = 'center';
      context.fillText(symbol, 32, 40);
      
      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.MeshBasicMaterial({ 
        map: texture, 
        transparent: true,
        opacity: 0.6
      });
      
      const symbolMesh = new THREE.Mesh(symbolGeometry, material);
      symbolMesh.position.set(
        (index - 1.5) * 2,
        Math.sin(index) * 3 + 1,
        -4
      );
      scene.add(symbolMesh);
      shapes.push({ 
        mesh: symbolMesh, 
        rotationSpeed: { x: 0, y: 0.03, z: 0.02 } 
      });
    });

    camera.position.z = 5;

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      
      shapes.forEach(({ mesh, rotationSpeed, originalPosition }) => {
        mesh.rotation.x += rotationSpeed.x;
        mesh.rotation.y += rotationSpeed.y;
        mesh.rotation.z += rotationSpeed.z;
        
        // Add floating animation
        if (originalPosition) {
          mesh.position.y = originalPosition.y + Math.sin(Date.now() * 0.001 + mesh.position.x) * 0.5;
        } else {
          mesh.position.y += Math.sin(Date.now() * 0.0008 + mesh.position.x) * 0.002;
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

// Animated Photo Card Component
const AnimatedPhotoCard = ({ image, name }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e) => {
      if (!isHovered) return;
      
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const rotateX = (y / rect.height) * 30;
      const rotateY = (x / rect.width) * -30;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
    };

    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isHovered]);

  return (
    <div className="flex justify-center lg:justify-start mb-8 lg:mb-0">
      <div 
        ref={cardRef}
        className={`relative w-80 h-96 lg:w-96 lg:h-[500px] transition-all duration-700 ease-out transform hover:scale-105 ${
          isHovered ? 'z-20' : 'z-10'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Glowing backdrop */}
        <div className={`absolute inset-0 bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-pink-400/30 dark:from-cyan-400/30 dark:via-purple-400/30 dark:to-pink-400/30 rounded-3xl blur-xl transition-all duration-700 ${
          isHovered ? 'scale-110 opacity-100' : 'scale-100 opacity-60'
        }`}></div>
        
        {/* Card container */}
        <div className="relative h-full bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl">
          {/* Animated border */}
          <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-cyan-500 dark:via-purple-500 dark:to-pink-500 rounded-3xl transition-all duration-700 ${
            isHovered ? 'p-1' : 'p-0.5'
          }`}>
            <div className="w-full h-full bg-white dark:bg-gray-800 rounded-3xl"></div>
          </div>
          
          {/* Photo container */}
          <div className="absolute inset-2 rounded-3xl overflow-hidden">
            {/* Main photo */}
            <img 
              src={image} 
              alt={name}
              className={`w-full h-full object-cover transition-all duration-700 ${
                isHovered 
                  ? 'grayscale-0 saturate-110 brightness-110 scale-110' 
                  : 'grayscale saturate-50 brightness-75'
              }`}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            
            {/* Fallback gradient with avatar */}
            <div className={`absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-600 dark:from-cyan-400 dark:via-purple-500 dark:to-pink-600 flex items-center justify-center text-white text-8xl transition-all duration-700 ${
              isHovered 
                ? 'grayscale-0 saturate-110 brightness-110' 
                : 'grayscale saturate-50 brightness-75'
            }`} style={{ display: 'none' }}>
              👨‍💻
            </div>
            
            {/* Overlay effects */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent transition-all duration-700 ${
              isHovered ? 'opacity-30' : 'opacity-60'
            }`}></div>
            
            {/* Floating particles */}
            {isHovered && (
              <>
                <div className="absolute top-8 right-8 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
                <div className="absolute bottom-12 left-8 w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/3 right-12 w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
              </>
            )}
          </div>
          
          {/* Hover info overlay */}
          <div className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent transition-all duration-500 ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
          }`}>
            <h3 className="text-white text-xl font-bold mb-2">{name}</h3>
            <p className="text-gray-200 text-sm">Hover to see me in color!</p>
          </div>
        </div>
        
        {/* Floating elements around card */}
        {isHovered && (
          <>
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-bounce opacity-80"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-bounce opacity-80" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-1/2 -left-6 w-4 h-4 bg-gradient-to-r from-pink-400 to-red-500 rounded-full animate-bounce opacity-80" style={{ animationDelay: '1s' }}></div>
          </>
        )}
      </div>
    </div>
  );
};

// Stats Counter Component
const StatCounter = ({ value, label, delay = 0 }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          setTimeout(() => {
            const duration = 2000;
            const steps = 60;
            const increment = value / steps;
            let current = 0;
            
            const timer = setInterval(() => {
              current += increment;
              if (current >= value) {
                setCount(value);
                clearInterval(timer);
              } else {
                setCount(Math.floor(current));
              }
            }, duration / steps);
          }, delay);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value, delay, hasAnimated]);

  return (
    <div ref={ref} className="text-center group">
      <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-cyan-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
        {count}+
      </div>
      <div className="text-gray-600 dark:text-gray-300 font-medium">{label}</div>
    </div>
  );
};

// Main About Component
const About = () => {
  const skills = [
    { name: 'Frontend Development', level: 90, color: 'from-blue-500 to-cyan-500' },
    { name: 'Backend Development', level: 85, color: 'from-purple-500 to-pink-500' },
    { name: 'UI/UX Design', level: 80, color: 'from-green-500 to-blue-500' },
    { name: 'Mobile Development', level: 75, color: 'from-orange-500 to-red-500' }
  ];

  const achievements = [
    { value: 50, label: 'Projects Completed' },
    { value: 25, label: 'Happy Clients' },
    { value: 3, label: 'Years Experience' },
    { value: 15, label: 'Technologies' }
  ];

  return (
    <section id="about" className="relative min-h-screen py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 overflow-hidden transition-colors duration-500">
      {/* 3D Background Scene */}
      <Suspense fallback={<div className="absolute inset-0 bg-transparent" />}>
        <AboutThreeScene />
      </Suspense>

      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10"></div>

      <div className="relative z-10 container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="text-4xl lg:text-5xl mr-4">👨‍💻</div>
            <h2 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-cyan-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              About <span className="text-purple-600 dark:text-purple-400">Me</span>
            </h2>
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-cyan-500 dark:to-pink-500 mx-auto"></div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Animated Photo Card */}
          <AnimatedPhotoCard 
            image="/api/placeholder/400/600" 
            name="Sreya"
          />

          {/* Content */}
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                I'm Sreya
              </h3>
              <p className="text-lg text-blue-600 dark:text-cyan-400 font-semibold mb-6">
                Software Engineer
              </p>
              <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>
                  I am a Software Engineer based in West Bengal, India. I am very passionate about 
                  improving my coding skills & developing applications & websites. I build WebApps 
                  and Websites. i have very interest in Machine Learning and AI.  
                </p>
                <p>
                  Working for myself to improve my skills. Love to build Full-Stack clones. 
                  I enjoy creating things that live on the internet, whether that be websites, 
                  applications, or anything in between.
                </p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-blue-600 dark:text-cyan-400 font-semibold">Email:</span>
                <a 
                  href="mailto:sreyadhar8118@gmail.com" 
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors duration-200"
                >
                  sreyadhar8118@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-blue-600 dark:text-cyan-400 font-semibold">Place:</span>
                <span className="text-gray-700 dark:text-gray-300">Kolkata, West Bengal, India - 711206</span>
              </div>
            </div>

            {/* Resume Button */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-cyan-500 dark:to-blue-500 text-white font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 dark:hover:from-cyan-600 dark:hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-xl flex items-center justify-center space-x-2">
                <span>Resume</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button className="px-8 py-4 border-2 border-purple-500 text-purple-600 dark:text-purple-300 font-semibold rounded-full hover:bg-purple-500 hover:text-white transform hover:scale-105 transition-all duration-300">
                Download CV
              </button>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mb-20">
          <h3 className="text-2xl lg:text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            My Skills
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {skills.map((skill, index) => (
              <div key={index} className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{skill.name}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{skill.level}%</span>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-1000 ease-out`}
                    style={{ 
                      width: `${skill.level}%`,
                      animationDelay: `${index * 0.2}s`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements Stats */}
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <StatCounter 
                key={index}
                value={achievement.value}
                label={achievement.label}
                delay={index * 200}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;