import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export const Hero3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    // Check WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      setHasWebGL(false);
      return;
    }

    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 6;
    camera.position.y = 0.5;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      currentMount.appendChild(renderer.domElement);
    } catch {
      setHasWebGL(false);
      return;
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const pointLightBlue = new THREE.PointLight(0x06b6d4, 4, 20);
    pointLightBlue.position.set(3, 4, 4);
    scene.add(pointLightBlue);

    const pointLightViolet = new THREE.PointLight(0x8b5cf6, 4, 20);
    pointLightViolet.position.set(-3, -2, 3);
    scene.add(pointLightViolet);

    // Main 3D Holographic Artifact (Icosahedron + Outer Wireframe)
    const mainGeometry = new THREE.IcosahedronGeometry(1.5, 1);
    const mainMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0ea5e9,
      emissive: 0x0284c7,
      emissiveIntensity: 0.25,
      metalness: 0.8,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.85,
      wireframe: false,
    });
    const mainMesh = new THREE.Mesh(mainGeometry, mainMaterial);
    scene.add(mainMesh);

    // Floating Wireframe Cage
    const wireframeGeo = new THREE.IcosahedronGeometry(1.85, 1);
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const wireframeMesh = new THREE.Mesh(wireframeGeo, wireframeMat);
    scene.add(wireframeMesh);

    // Orbiting Particles Ring
    const particlesCount = 180;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      const angle = (i / particlesCount) * Math.PI * 2;
      const radius = 2.4 + (Math.random() - 0.5) * 0.6;
      posArray[i * 3] = Math.cos(angle) * radius;
      posArray[i * 3 + 1] = (Math.random() - 0.5) * 0.8;
      posArray[i * 3 + 2] = Math.sin(angle) * radius;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.04,
      color: 0xa5f3fc,
      transparent: true,
      opacity: 0.8,
    });
    const particleMesh = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleMesh);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = currentMount.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 1.2;
      targetY = -y * 1.2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!currentMount) return;
      const newWidth = currentMount.clientWidth;
      const newHeight = currentMount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse follow
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      mainMesh.rotation.y = elapsedTime * 0.3 + mouseX;
      mainMesh.rotation.x = Math.sin(elapsedTime * 0.4) * 0.2 + mouseY;

      wireframeMesh.rotation.y = -elapsedTime * 0.2 + mouseX * 0.5;
      wireframeMesh.rotation.z = Math.cos(elapsedTime * 0.25) * 0.15;

      particleMesh.rotation.y = elapsedTime * 0.15;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      mainGeometry.dispose();
      mainMaterial.dispose();
      wireframeGeo.dispose();
      wireframeMat.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
    };
  }, []);

  if (!hasWebGL) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8">
        <div className="relative w-64 h-64 rounded-3xl bg-gradient-to-tr from-cyan-500/20 via-blue-600/30 to-violet-600/20 border border-cyan-500/30 flex items-center justify-center shadow-2xl shadow-cyan-500/10">
          <div className="w-32 h-32 rounded-2xl bg-cyan-400/20 animate-pulse border border-cyan-400/40" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative" ref={mountRef}>
      {/* Decorative ambient background blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet-500/15 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};
