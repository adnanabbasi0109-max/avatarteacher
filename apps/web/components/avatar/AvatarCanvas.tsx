"use client";

import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from "react";

interface AvatarCanvasProps {
  modelUrl?: string;
  isSpeaking: boolean;
  sentiment: string;
  className?: string;
}

export interface AvatarCanvasHandle {
  setAudioStream: (stream: MediaStream) => void;
  setEmotion: (emotion: string) => void;
  speak: (audioUrl: string) => Promise<void>;
}

export const AvatarCanvas = forwardRef<AvatarCanvasHandle, AvatarCanvasProps>(
  ({ modelUrl, isSpeaking, sentiment, className }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const headRef = useRef<any>(null);
    const animationFrameRef = useRef<number>(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useImperativeHandle(ref, () => ({
      setAudioStream: (stream: MediaStream) => {
        if (headRef.current?.setAudioStream) {
          headRef.current.setAudioStream(stream);
        }
      },
      setEmotion: (emotion: string) => {
        if (headRef.current?.setMood) {
          headRef.current.setMood(emotion);
        }
      },
      speak: async (audioUrl: string) => {
        if (headRef.current?.speakAudio) {
          await headRef.current.speakAudio(audioUrl);
        }
      },
    }));

    useEffect(() => {
      if (!containerRef.current) return;

      let cleanup: (() => void) | undefined;

      const initAvatar = async () => {
        try {
          const THREE = await import("three");

          const container = containerRef.current!;
          const width = container.clientWidth;
          const height = container.clientHeight;

          const scene = new THREE.Scene();
          scene.background = new THREE.Color(0x0a0a1a);

          const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 100);
          camera.position.set(0, 1.5, 1.5);
          camera.lookAt(0, 1.3, 0);

          const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
          renderer.setSize(width, height);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          renderer.toneMapping = THREE.ACESFilmicToneMapping;
          renderer.toneMappingExposure = 1.2;
          container.appendChild(renderer.domElement);

          const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
          scene.add(ambientLight);

          const keyLight = new THREE.DirectionalLight(0xffffff, 1.0);
          keyLight.position.set(0.5, 2, 1);
          scene.add(keyLight);

          const fillLight = new THREE.DirectionalLight(0xb0c4ff, 0.4);
          fillLight.position.set(-1, 1, -0.5);
          scene.add(fillLight);

          const rimLight = new THREE.DirectionalLight(0x4466ff, 0.3);
          rimLight.position.set(0, 1, -2);
          scene.add(rimLight);

          // Placeholder avatar (stylized head + body)
          const headGeometry = new THREE.SphereGeometry(0.15, 32, 32);
          const headMaterial = new THREE.MeshStandardMaterial({
            color: 0x6b8cff,
            roughness: 0.3,
            metalness: 0.1,
          });
          const headMesh = new THREE.Mesh(headGeometry, headMaterial);
          headMesh.position.set(0, 1.5, 0);
          scene.add(headMesh);

          const bodyGeometry = new THREE.CylinderGeometry(0.12, 0.15, 0.4, 16);
          const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x4a6adf,
            roughness: 0.4,
            metalness: 0.1,
          });
          const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
          bodyMesh.position.set(0, 1.2, 0);
          scene.add(bodyMesh);

          const eyeGeometry = new THREE.SphereGeometry(0.02, 16, 16);
          const eyeMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 0.5,
          });
          const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
          leftEye.position.set(-0.05, 1.53, 0.13);
          scene.add(leftEye);

          const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
          rightEye.position.set(0.05, 1.53, 0.13);
          scene.add(rightEye);

          // Ambient particles
          const particleCount = 50;
          const particleGeometry = new THREE.BufferGeometry();
          const positions = new Float32Array(particleCount * 3);
          for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 3;
            positions[i + 1] = Math.random() * 3;
            positions[i + 2] = (Math.random() - 0.5) * 3;
          }
          particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
          const particleMaterial = new THREE.PointsMaterial({
            color: 0x6b8cff,
            size: 0.01,
            transparent: true,
            opacity: 0.4,
          });
          const particles = new THREE.Points(particleGeometry, particleMaterial);
          scene.add(particles);

          headRef.current = {
            headMesh,
            bodyMesh,
            setAudioStream: () => {},
            setMood: () => {},
            speakAudio: async () => {},
          };

          const clock = new THREE.Clock();
          const animate = () => {
            animationFrameRef.current = requestAnimationFrame(animate);
            const elapsed = clock.getElapsedTime();

            headMesh.position.y = 1.5 + Math.sin(elapsed * 1.5) * 0.005;
            bodyMesh.position.y = 1.2 + Math.sin(elapsed * 1.5) * 0.003;
            headMesh.rotation.y = Math.sin(elapsed * 0.5) * 0.05;
            headMesh.rotation.z = Math.sin(elapsed * 0.7) * 0.02;
            particles.rotation.y = elapsed * 0.05;

            renderer.render(scene, camera);
          };
          animate();

          setIsLoaded(true);

          const handleResize = () => {
            if (!containerRef.current) return;
            const w = containerRef.current.clientWidth;
            const h = containerRef.current.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
          };
          window.addEventListener("resize", handleResize);

          cleanup = () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameRef.current);
            renderer.dispose();
            if (container.contains(renderer.domElement)) {
              container.removeChild(renderer.domElement);
            }
          };
        } catch (err) {
          console.error("Avatar init error:", err);
          setError("Failed to initialize 3D avatar");
        }
      };

      initAvatar();

      return () => {
        cleanup?.();
      };
    }, [modelUrl]);

    useEffect(() => {
      if (!headRef.current?.headMesh) return;
      const colorMap: Record<string, number> = {
        neutral: 0x6b8cff,
        confused: 0xffaa44,
        excited: 0x44ff88,
        frustrated: 0xff6644,
        engaged: 0x44ddff,
      };
      headRef.current.headMesh.material.color.setHex(colorMap[sentiment] || 0x6b8cff);
    }, [sentiment]);

    useEffect(() => {
      if (!headRef.current?.headMesh) return;
      if (isSpeaking) {
        headRef.current.headMesh.material.emissiveIntensity = 0.3;
      } else {
        headRef.current.headMesh.material.emissiveIntensity = 0;
      }
    }, [isSpeaking]);

    return (
      <div ref={containerRef} className={`relative ${className || ""}`}>
        {!isLoaded && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-950">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
              <p className="text-sm text-gray-400">Loading avatar...</p>
            </div>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-950">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}
      </div>
    );
  }
);

AvatarCanvas.displayName = "AvatarCanvas";
