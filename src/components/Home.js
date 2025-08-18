import React, { useState, useEffect, useRef, Suspense } from 'react';
import * as THREE from 'three';

// Custom hook for typing animation
const useTypingAnimation = (texts, typingSpeed = 100, pauseDuration = 2000) => {
  const [displayText, setDisplayText] = useState('');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timeout;
    const currentText = texts[currentTextIndex];
    
    if (isTyping) {
      if (displayText.length < currentText.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        }, typingSpeed);
      } else {
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, pauseDuration);
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, typingSpeed / 2);
      } else {
        setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, currentTextIndex, isTyping, texts, typingSpeed, pauseDuration]);

  return displayText;
};

// 3D Scene Component
const ThreeScene = () => {
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

    // Create floating geometric shapes
    const shapes = [];
    
    // Torus
    const torusGeometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
    const torusMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x64ffda,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.position.set(-4, 2, -5);
    scene.add(torus);
    shapes.push({ mesh: torus, rotationSpeed: { x: 0.01, y: 0.02, z: 0 } });

    // Dodecahedron
    const dodecaGeometry = new THREE.DodecahedronGeometry(1.2);
    const dodecaMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xff6b9d,
      wireframe: true,
      transparent: true,
      opacity: 0.5
    });
    const dodeca = new THREE.Mesh(dodecaGeometry, dodecaMaterial);
    dodeca.position.set(4, -1, -6);
    scene.add(dodeca);
    shapes.push({ mesh: dodeca, rotationSpeed: { x: 0.015, y: 0.01, z: 0.02 } });

    // Octahedron
    const octaGeometry = new THREE.OctahedronGeometry(1.5);
    const octaMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xffd700,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    const octa = new THREE.Mesh(octaGeometry, octaMaterial);
    octa.position.set(0, 3, -8);
    scene.add(octa);
    shapes.push({ mesh: octa, rotationSpeed: { x: 0.02, y: 0.015, z: 0.01 } });

    // Sphere with particles
    const sphereGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x9c88ff,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(-2, -2, -4);
    scene.add(sphere);
    shapes.push({ mesh: sphere, rotationSpeed: { x: 0.01, y: 0.025, z: 0.015 } });

    camera.position.z = 5;

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      
      shapes.forEach(({ mesh, rotationSpeed }) => {
        mesh.rotation.x += rotationSpeed.x;
        mesh.rotation.y += rotationSpeed.y;
        mesh.rotation.z += rotationSpeed.z;
        
        // Add floating animation
        mesh.position.y += Math.sin(Date.now() * 0.001 + mesh.position.x) * 0.002;
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

// Main Home Component
const Home = () => {
  const typingTexts = [
    "Full Stack Developer",
    "Machine Learning Enthusiast", 
    "Web Developer",
    "Creative Problem Solver",
    "Tech Enthusiast"
  ];
  
  const typedText = useTypingAnimation(typingTexts, 100, 2000);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-100 via-blue-100 to-purple-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 overflow-hidden transition-colors duration-500">
      {/* 3D Background Scene */}
      <Suspense fallback={<div className="absolute inset-0 bg-slate-900" />}>
        <ThreeScene />
      </Suspense>
      
      {/* Animated background particles */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10 animate-pulse transition-colors duration-500"></div>
      
      {/* Content Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-cyan-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent animate-pulse transition-colors duration-500">
                Hello, I'm
              </h1>
              <h2 className="text-6xl lg:text-8xl font-black text-gray-900 dark:text-white drop-shadow-2xl transition-colors duration-500">
                Sreya
              </h2>
            </div>
            
            {/* Typing Animation */}
            <div className="h-16 flex items-center justify-center lg:justify-start">
              <span className="text-2xl lg:text-3xl font-semibold text-blue-600 dark:text-cyan-300 transition-colors duration-500">
                {typedText}
                <span className="animate-pulse text-gray-800 dark:text-white transition-colors duration-500">|</span>
              </span>
            </div>
            
            {/* Description */}
            <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg transition-colors duration-500">
              Crafting digital experiences with creativity and code.
              Welcome to my portfolio!
            </p>
            
            {/* CTA Buttons */}
<div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
  <a
    href="#projects"
    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-cyan-500 dark:to-blue-500 text-white font-semibold rounded-full hover:from-blue-600 hover:to-purple-600 dark:hover:from-cyan-600 dark:hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 dark:hover:shadow-cyan-500/25 text-center"
  >
    View My Work
  </a>

  <a
    href="#contact"
    className="px-8 py-4 border-2 border-purple-500 text-purple-600 dark:text-purple-300 font-semibold rounded-full hover:bg-purple-500 hover:text-white transform hover:scale-105 transition-all duration-300 text-center"
  >
    Get In Touch
  </a>
</div>


          </div>
          
          {/* Right Content - Profile Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Glowing backdrop */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-pink-400/30 dark:from-cyan-400/30 dark:via-purple-400/30 dark:to-pink-400/30 rounded-full blur-2xl animate-pulse transition-colors duration-500"></div>
              
              {/* Profile container */}
              <div className="relative w-80 h-80 lg:w-96 lg:h-96">
                {/* Rotating border */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-cyan-500 dark:via-purple-500 dark:to-pink-500 rounded-full animate-spin transition-colors duration-500" style={{ animationDuration: '8s' }}></div>
                
                {/* Inner border */}
                <div className="absolute inset-2 bg-white dark:bg-slate-900 rounded-full transition-colors duration-500"></div>
                
                {/* Profile image placeholder */}
                <div className="absolute inset-4 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center overflow-hidden transition-colors duration-500">
                  {/* Replace this div with your actual image */}
                  <img 
                    src="images/profileImage.jpg" 
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  {/* Fallback when image fails to load */}
                  <div className="w-full h-full flex items-center justify-center text-6xl text-gray-500 dark:text-gray-400 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800 rounded-full transition-colors duration-500" style={{ display: 'none' }}>
                    👤
                  </div>
                </div>
                
                {/* Floating elements around image */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 dark:bg-cyan-500 rounded-full animate-bounce transition-colors duration-500"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-500 rounded-full animate-bounce transition-colors duration-500" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 -left-8 w-4 h-4 bg-pink-500 rounded-full animate-bounce transition-colors duration-500" style={{ animationDelay: '2s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-700 dark:text-white animate-bounce transition-colors duration-500">
        <div className="flex flex-col items-center space-y-2">
          <span className="text-sm font-medium">Scroll Down</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Home;