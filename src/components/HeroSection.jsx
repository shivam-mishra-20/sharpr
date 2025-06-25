import React, { useRef, Suspense } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCheckCircle, FaMapMarkerAlt } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  Center,
  OrbitControls,
  Sphere,
  Ring,
  Trail,
  Stars,
} from "@react-three/drei";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";

// Educational Solar System Component
const EducationalElements = ({ isLight }) => {
  const sunRef = useRef();
  const orbitRefs = useRef([...Array(8)].map(() => React.createRef())); // 8 orbits

  // Enhanced colors for more realism
  const sunColor = isLight ? "#ff9500" : "#ff7b00";
  const sunEmissive = isLight ? "#ff5e00" : "#ff4500";

  // Reordered planets - Jupiter (now index 4) comes before Saturn/ringed planet (now index 5)
  const planetColors = [
    {
      main: isLight ? "#3b82f6" : "#60a5fa", // Blue (Math)
      emissive: isLight ? "#1d4ed8" : "#3b82f6",
      name: "Math",
      texture: "earthlike",
      roughness: 0.7,
      metalness: 0.2,
    },
    {
      main: isLight ? "#10b981" : "#34d399", // Green (Science)
      emissive: isLight ? "#059669" : "#10b981",
      name: "Science",
      texture: "gas",
      roughness: 0.5,
      metalness: 0.3,
    },
    {
      main: isLight ? "#ec4899" : "#f472b6", // Pink (Language)
      emissive: isLight ? "#be185d" : "#ec4899",
      name: "Language",
      texture: "rocky",
      roughness: 0.9,
      metalness: 0.1,
    },
    {
      main: isLight ? "#f59e0b" : "#fbbf24", // Yellow (Art)
      emissive: isLight ? "#d97706" : "#f59e0b",
      name: "Art",
      texture: "cloudy",
      roughness: 0.6,
      metalness: 0.2,
    },
    // Jupiter moved to position 4 (before Saturn)
    {
      main: isLight ? "#d97706" : "#f59e0b", // Orange/Brown (Jupiter)
      emissive: isLight ? "#b45309" : "#d97706",
      name: "Computer Science",
      texture: "jupiter", // still using jupiter texture but without rings
      roughness: 0.5,
      metalness: 0.2,
    },
    // Saturn with rings moved to position 5
    {
      main: isLight ? "#8b5cf6" : "#a78bfa", // Purple (Social Studies)
      emissive: isLight ? "#6d28d9" : "#8b5cf6",
      name: "Social Studies",
      texture: "ringed",
      roughness: 0.7,
      metalness: 0.4,
    },
    // Ice planet
    {
      main: isLight ? "#0ea5e9" : "#38bdf8", // Light blue (Ice)
      emissive: isLight ? "#0284c7" : "#0ea5e9",
      name: "Technology",
      texture: "ice",
      roughness: 0.8,
      metalness: 0.5,
    },
    // Red planet (Mars-like)
    {
      main: isLight ? "#ef4444" : "#f87171", // Red
      emissive: isLight ? "#dc2626" : "#ef4444",
      name: "Robotics",
      texture: "desert",
      roughness: 0.9,
      metalness: 0.1,
    },
  ];

  // Rotate the sun
  useFrame((state) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.002;
    }

    // Animate orbit paths
    orbitRefs.current.forEach((ref, i) => {
      if (ref.current) {
        ref.current.rotation.y =
          state.clock.getElapsedTime() * (0.09 - i * 0.008); // Adjusted speed change
      }
    });
  });

  // Enhanced Planet component with education subject icon
  const Planet = ({
    color,
    emissive,
    position,
    size,
    orbitRadius,
    orbitSpeed,
    index,
    textureName,
    roughness,
    metalness,
  }) => {
    const planetRef = useRef();
    const ringRef = useRef();
    const orbitAngle = useRef(Math.random() * Math.PI * 2);
    const rotationSpeed = 0.003 + index * 0.0005; // Different speeds for different planets
    const tilt = Math.PI * (0.05 + (index % 8) * 0.04); // Different tilts

    useFrame((state) => {
      if (planetRef.current) {
        // Update planet's position in its orbit
        orbitAngle.current += orbitSpeed;
        const x = Math.sin(orbitAngle.current) * orbitRadius;
        const z = Math.cos(orbitAngle.current) * orbitRadius;
        planetRef.current.position.x = x;
        planetRef.current.position.z = z;

        // Rotate planet with more natural variations
        planetRef.current.rotation.y += rotationSpeed;

        // Add a tilt to planet rotation
        planetRef.current.rotation.x = tilt;

        // If this is the ringed planet, update the ring position
        if (ringRef.current && textureName === "ringed") {
          ringRef.current.position.x = x;
          ringRef.current.position.z = z;
        }
      }
    });

    // Generate planet surface based on texture type
    const renderPlanetSurface = () => {
      switch (textureName) {
        case "gas":
          // Gas giant with atmospheric glow
          return (
            <>
              <mesh ref={planetRef} position={position}>
                <sphereGeometry args={[size, 48, 48]} />
                <meshStandardMaterial
                  color={color}
                  roughness={roughness}
                  metalness={metalness}
                  emissive={emissive}
                  emissiveIntensity={0.15}
                />
              </mesh>
              <mesh position={position}>
                <sphereGeometry args={[size * 1.05, 32, 32]} />
                <meshStandardMaterial
                  color={color}
                  transparent={true}
                  opacity={0.2}
                  roughness={1}
                  metalness={0}
                  emissive={emissive}
                  emissiveIntensity={0.05}
                />
              </mesh>
            </>
          );

        case "rocky":
          // Rocky planet with more detail
          return (
            <mesh ref={planetRef} position={position}>
              <sphereGeometry args={[size, 48, 48]} />
              <meshStandardMaterial
                color={color}
                roughness={roughness}
                metalness={metalness}
                emissive={emissive}
                emissiveIntensity={0.05}
              />
            </mesh>
          );

        case "ringed":
          // Planet with realistic rings (Saturn-like)
          return (
            <>
              <mesh ref={planetRef} position={position}>
                <sphereGeometry args={[size, 48, 48]} />
                <meshStandardMaterial
                  color={color}
                  roughness={roughness}
                  metalness={metalness}
                  emissive={emissive}
                  emissiveIntensity={0.05}
                />
              </mesh>
              <group
                ref={ringRef}
                position={position}
                rotation={[Math.PI / 3, 0, 0]}
              >
                {/* Multiple rings for more detailed appearance */}
                <Ring args={[size * 1.3, size * 1.8, 128]}>
                  <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={0.6}
                    side={THREE.DoubleSide}
                  />
                </Ring>
                <Ring args={[size * 1.4, size * 1.6, 128]}>
                  <meshBasicMaterial
                    color={emissive}
                    transparent
                    opacity={0.3}
                    side={THREE.DoubleSide}
                  />
                </Ring>
              </group>
            </>
          );

        case "jupiter":
          // Jupiter-like planet with bands but NO rings (removed)
          return (
            <>
              <mesh ref={planetRef} position={position}>
                <sphereGeometry args={[size * 1.2, 64, 64]} />
                <meshStandardMaterial
                  color={color}
                  roughness={roughness}
                  metalness={metalness}
                  emissive={emissive}
                  emissiveIntensity={0.05}
                />
              </mesh>

              {/* Jupiter's bands effect */}
              <group ref={ringRef} position={position}>
                {/* Creating bands with thin rings around the planet */}
                {[...Array(6)].map((_, i) => (
                  <mesh
                    key={`band-${i}`}
                    position={[0, -size * 0.55 + i * size * 0.22, 0]}
                    rotation={[Math.PI / 2, 0, 0]}
                  >
                    <ringGeometry args={[size * 1.19, size * 1.21, 64]} />
                    <meshBasicMaterial
                      color={i % 2 === 0 ? color : emissive}
                      transparent={true}
                      opacity={0.4}
                      side={THREE.DoubleSide}
                    />
                  </mesh>
                ))}

                {/* Great Red Spot */}
                <mesh
                  position={[size * 0.7, 0, size * 0.7]}
                  rotation={[0, 0, Math.PI / 4]}
                >
                  <sphereGeometry args={[size * 0.25, 24, 24]} />
                  <meshStandardMaterial
                    color="#d94141"
                    roughness={0.7}
                    transparent={true}
                    opacity={0.8}
                    emissive="#b91c1c"
                    emissiveIntensity={0.2}
                  />
                </mesh>
              </group>

              {/* Subtle atmosphere */}
              <mesh position={position}>
                <sphereGeometry args={[size * 1.25, 32, 32]} />
                <meshStandardMaterial
                  color={emissive}
                  transparent={true}
                  opacity={0.08}
                  roughness={1}
                  metalness={0}
                  emissive={emissive}
                  emissiveIntensity={0.03}
                />
              </mesh>
            </>
          );

        case "ice":
          // Ice planet with crystalline structures
          return (
            <>
              <mesh ref={planetRef} position={position}>
                <sphereGeometry args={[size, 48, 48]} />
                <meshStandardMaterial
                  color={color}
                  roughness={roughness}
                  metalness={metalness}
                  emissive={emissive}
                  emissiveIntensity={0.15}
                />
              </mesh>
              <mesh position={position}>
                <sphereGeometry args={[size * 1.02, 32, 32]} />
                <meshStandardMaterial
                  color="#ffffff"
                  transparent={true}
                  opacity={0.2}
                  roughness={0.2}
                  metalness={0.8}
                  emissive="#a1deff"
                  emissiveIntensity={0.1}
                />
              </mesh>

              {/* Ice crystals on surface */}
              {[...Array(5)].map((_, i) => {
                const angle = (i / 5) * Math.PI * 2;
                const x = Math.sin(angle) * size * 0.8;
                const z = Math.cos(angle) * size * 0.8;
                return (
                  <mesh
                    key={`crystal-${i}`}
                    position={[
                      position[0] + x,
                      position[1] + (Math.random() * 0.1 + 0.2) * size,
                      position[2] + z,
                    ]}
                    rotation={[
                      Math.random() * Math.PI,
                      Math.random() * Math.PI,
                      Math.random() * Math.PI,
                    ]}
                  >
                    <octahedronGeometry args={[size * 0.1, 0]} />
                    <meshStandardMaterial
                      color="#ffffff"
                      roughness={0.1}
                      metalness={0.9}
                      transparent={true}
                      opacity={0.8}
                      emissive="#81d5ff"
                      emissiveIntensity={0.2}
                    />
                  </mesh>
                );
              })}
            </>
          );

        case "desert":
          // Mars-like desert planet with canyons
          return (
            <>
              <mesh ref={planetRef} position={position}>
                <sphereGeometry args={[size, 48, 48]} />
                <meshStandardMaterial
                  color={color}
                  roughness={roughness}
                  metalness={metalness}
                  emissive={emissive}
                  emissiveIntensity={0.03}
                />
              </mesh>

              {/* Dust atmosphere */}
              <mesh position={position}>
                <sphereGeometry args={[size * 1.05, 24, 24]} />
                <meshStandardMaterial
                  color="#f97316"
                  transparent={true}
                  opacity={0.1}
                  roughness={1}
                  metalness={0}
                  emissive="#7c2d12"
                  emissiveIntensity={0.01}
                />
              </mesh>

              {/* Polar cap */}
              <mesh
                position={[position[0], position[1] + size * 0.8, position[2]]}
                rotation={[Math.PI / 2, 0, 0]}
              >
                <circleGeometry args={[size * 0.3, 24]} />
                <meshBasicMaterial
                  color="#ffffff"
                  transparent={true}
                  opacity={0.8}
                />
              </mesh>
            </>
          );

        case "cloudy":
          // Planet with cloud layers
          return (
            <>
              <mesh ref={planetRef} position={position}>
                <sphereGeometry args={[size, 48, 48]} />
                <meshStandardMaterial
                  color={color}
                  roughness={roughness}
                  metalness={metalness}
                  emissive={emissive}
                  emissiveIntensity={0.05}
                />
              </mesh>
              <mesh position={position} rotation={[0, Math.PI / 4, 0]}>
                <sphereGeometry args={[size * 1.02, 32, 32]} />
                <meshStandardMaterial
                  color="#ffffff"
                  transparent={true}
                  opacity={0.3}
                  roughness={1}
                  metalness={0}
                  emissive="#ffffff"
                  emissiveIntensity={0.02}
                />
              </mesh>
            </>
          );

        case "earthlike":
        default:
          // Earth-like planet with atmosphere
          return (
            <>
              <mesh ref={planetRef} position={position}>
                <sphereGeometry args={[size, 48, 48]} />
                <meshStandardMaterial
                  color={color}
                  roughness={roughness}
                  metalness={metalness}
                  emissive={emissive}
                  emissiveIntensity={0.05}
                />
              </mesh>
              <mesh position={position}>
                <sphereGeometry args={[size * 1.03, 32, 32]} />
                <meshStandardMaterial
                  color="#88ccff"
                  transparent={true}
                  opacity={0.15}
                  roughness={1}
                  metalness={0}
                  emissive="#4488ff"
                  emissiveIntensity={0.03}
                />
              </mesh>
            </>
          );
      }
    };

    return <group>{renderPlanetSurface()}</group>;
  };

  return (
    <group>
      {/* Enhanced stars background with more stars */}
      <Stars
        radius={100}
        depth={50}
        count={7500}
        factor={4}
        saturation={0.5}
        fade
        speed={0.3}
      />

      {/* Additional distant stars for depth */}
      <Stars
        radius={150}
        depth={100}
        count={5000}
        factor={6}
        saturation={0.2}
        fade
        speed={0.1}
      />

      {/* Far background stars for a more immersive feel */}
      <Stars
        radius={200}
        depth={150}
        count={3000}
        factor={7}
        saturation={0.1}
        fade
        speed={0.05}
      />

      {/* Sun at the center with improved glow */}
      <mesh ref={sunRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1.2, 48, 48]} />
        <meshStandardMaterial
          color={sunColor}
          emissive={sunEmissive}
          emissiveIntensity={2}
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>

      {/* Sun glow effect */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial
          color={sunEmissive}
          transparent={true}
          opacity={0.2}
        />
      </mesh>

      {/* Additional outer sun glow */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.9, 32, 32]} />
        <meshBasicMaterial
          color={sunEmissive}
          transparent={true}
          opacity={0.1}
        />
      </mesh>

      {/* Improved orbit paths for 8 planets */}
      {[2.5, 4, 5.5, 7, 9, 11, 13, 15].map((radius, i) => (
        <group ref={orbitRefs.current[i]} key={`orbit-${i}`}>
          <Ring
            args={[radius - 0.02, radius + 0.02, 128]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <meshBasicMaterial
              color={planetColors[i]?.main || "#ffffff"}
              transparent
              opacity={0.15}
              side={THREE.DoubleSide}
            />
          </Ring>
        </group>
      ))}

      {/* Enhanced planets with more details - now with 8 planets */}
      {planetColors.map((planet, i) => (
        <Planet
          key={`planet-${i}`}
          color={planet.main}
          emissive={planet.emissive}
          position={[i * 2 + 3, 0, 0]} // Starting positions
          // Varied planet sizes - Jupiter at index 4 is large
          size={
            i === 4 // Jupiter is now at index 4
              ? 1.0 // Jupiter is large
              : i === 0
              ? 0.7 // Earth-like
              : i === 2
              ? 0.6 // Language planet
              : i === 7
              ? 0.55 // Mars-like
              : 0.4 + i * 0.1
          } // Others with gradual size increase
          orbitRadius={
            i === 0
              ? 2.5
              : i === 1
              ? 4
              : i === 2
              ? 5.5
              : i === 3
              ? 7
              : i === 4
              ? 9
              : i === 5
              ? 11
              : i === 6
              ? 13
              : 15
          } // Varied orbit radii
          orbitSpeed={0.005 / (i * 0.5 + 1)} // Varied speeds
          index={i}
          textureName={planet.texture}
          roughness={planet.roughness}
          metalness={planet.metalness}
        />
      ))}

      {/* More particles for richer visual effect */}
      {[...Array(30)].map((_, i) => (
        <Float
          key={`particle-${i}`}
          speed={(0.5 + Math.random()) * 1.5}
          rotationIntensity={0.6}
          floatIntensity={1.2}
        >
          <mesh
            position={[
              (Math.random() - 0.5) * 25,
              (Math.random() - 0.5) * 20,
              (Math.random() - 0.5) * 25,
            ]}
          >
            <sphereGeometry args={[0.03 + Math.random() * 0.08, 8, 8]} />
            <meshStandardMaterial
              color={
                planetColors[Math.floor(Math.random() * planetColors.length)]
                  .main
              }
              emissive={
                planetColors[Math.floor(Math.random() * planetColors.length)]
                  .emissive
              }
              emissiveIntensity={0.8}
            />
          </mesh>
        </Float>
      ))}

      {/* Occasional small asteroid-like elements */}
      {[...Array(12)].map((_, i) => (
        <Float
          key={`asteroid-${i}`}
          speed={(1 + Math.random()) * 2}
          rotationIntensity={2}
          floatIntensity={0.8}
        >
          <mesh
            position={[
              (Math.random() - 0.5) * 15,
              (Math.random() - 0.5) * 12,
              (Math.random() - 0.5) * 15,
            ]}
            rotation={[
              Math.random() * Math.PI,
              Math.random() * Math.PI,
              Math.random() * Math.PI,
            ]}
          >
            <dodecahedronGeometry args={[0.05 + Math.random() * 0.1, 0]} />
            <meshStandardMaterial
              color={isLight ? "#9ca3af" : "#6b7280"}
              roughness={0.9}
              metalness={0.2}
            />
          </mesh>
        </Float>
      ))}

      {/* Add asteroid belt between planets 4 and 5 */}
      {[...Array(35)].map((_, i) => {
        const angle = (i / 35) * Math.PI * 2;
        const radius = 8 + Math.random() * 1.5;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;

        return (
          <Float
            key={`belt-asteroid-${i}`}
            speed={0.2 + Math.random() * 0.3}
            rotationIntensity={4}
            floatIntensity={0.2}
          >
            <mesh
              position={[
                x + (Math.random() - 0.5) * 0.5,
                (Math.random() - 0.5) * 0.3,
                z + (Math.random() - 0.5) * 0.5,
              ]}
              rotation={[
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI,
              ]}
            >
              <dodecahedronGeometry args={[0.04 + Math.random() * 0.06, 0]} />
              <meshStandardMaterial
                color={isLight ? "#a3a3a3" : "#525252"}
                roughness={0.8}
                metalness={0.3}
              />
            </mesh>
          </Float>
        );
      })}
    </group>
  );
};

// 3D Scene Component
const Scene = ({ isLight }) => {
  return (
    <Canvas camera={{ position: [0, 8, 18], fov: 45 }}>
      <ambientLight intensity={isLight ? 0.3 : 0.2} />
      <pointLight
        position={[0, 0, 0]}
        intensity={isLight ? 2 : 1.5}
        color={isLight ? "#fff9e5" : "#ffe0b3"}
        distance={50}
      />
      <Suspense fallback={null}>
        <EducationalElements isLight={isLight} />
      </Suspense>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.15}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 4}
      />
    </Canvas>
  );
};

const HeroSection = () => {
  const { theme } = useTheme();
  const isLight = theme !== "dark";

  return (
    <section
      style={{
        background: isLight
          ? "linear-gradient(170deg, #f8f9fb 70%, #f0f2f7 100%)"
          : "linear-gradient(170deg, #111827 70%, #0f172a 100%)",
        color: isLight ? "#111" : "#f9fafb",
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "8rem 2rem 6rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 3D Background element - keep more planets moving by commenting out fewer */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: 0.8, // Increased opacity from 0.7 to 0.8 for more visibility
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        <Scene isLight={isLight} />
      </div>

      {/* Background decoration - keeping these for visual interest */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          right: "5%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: isLight
            ? "radial-gradient(circle, rgba(79,70,229,0.05) 0%, rgba(79,70,229,0) 70%)"
            : "radial-gradient(circle, rgba(79,70,229,0.1) 0%, rgba(79,70,229,0) 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "5%",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: isLight
            ? "radial-gradient(circle, rgba(236,72,153,0.05) 0%, rgba(236,72,153,0) 70%)"
            : "radial-gradient(circle, rgba(236,72,153,0.1) 0%, rgba(236,72,153,0) 70%)",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          maxWidth: "900px",
          margin: "0 auto",
          padding: "0 2rem",
          position: "relative",
          zIndex: 10,
          textAlign: "center",
        }}
      >
        {/* Centered Text Content */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.75rem",
              background: isLight
                ? "rgba(79, 70, 229, 0.08)"
                : "rgba(79, 70, 229, 0.15)",
              padding: "0.5rem 1rem",
              borderRadius: "20px",
              marginBottom: "1.5rem",
            }}
          >
            <span role="img" aria-label="rocket" style={{ fontSize: "1.2rem" }}>
              🚀
            </span>
            <span
              style={{
                fontWeight: 600,
                fontSize: "1rem",
                color: isLight ? "#4f46e5" : "#818cf8",
              }}
            >
              Accelerating learning for young minds
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              marginBottom: "1.5rem",
              ...(isLight
                ? {
                    background: "linear-gradient(90deg, #111827 30%, #4f46e5)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }
                : {
                    color: "#f9fafb",
                  }),
            }}
          >
            Empowering Young Minds Through Innovative Education
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            style={{
              color: isLight ? "#4b5563" : "#d1d5db",
              fontSize: "1.25rem",
              marginBottom: "1.5rem",
              lineHeight: 1.7,
              maxWidth: "800px",
              margin: "0 auto 1.5rem",
            }}
          >
            Sharpr helps children ages 10-16 master essential subjects with
            clarity, confidence, and personalized attention — conveniently
            located in your neighborhood.
          </motion.p>

          {/* Special Mention Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            style={{
              background: isLight
                ? "linear-gradient(135deg, rgba(79,70,229,0.1), rgba(236,72,153,0.1))"
                : "linear-gradient(135deg, rgba(79,70,229,0.2), rgba(236,72,153,0.2))",
              borderRadius: "16px",
              padding: "1rem 2rem",
              marginBottom: "2.5rem",
              display: "inline-block",
              boxShadow: isLight
                ? "0 4px 12px rgba(0,0,0,0.05)"
                : "0 4px 12px rgba(0,0,0,0.2)",
              border: isLight
                ? "1px solid rgba(79,70,229,0.1)"
                : "1px solid rgba(79,70,229,0.2)",
            }}
          >
            <span
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                color: isLight ? "#4f46e5" : "#818cf8",
                display: "block",
              }}
            >
              Age 10-16 and Class 5-10
            </span>
            <span
              style={{
                fontSize: "0.95rem",
                color: isLight ? "#4b5563" : "#d1d5db",
              }}
            >
              Perfect range for building strong academic foundations
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            style={{
              display: "flex",
              gap: "1.25rem",
              flexWrap: "wrap",
              justifyContent: "center",
              marginBottom: "2.5rem",
            }}
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/contact"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  background: "linear-gradient(135deg, #4f46e5, #6366f1)",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "1.125rem",
                  borderRadius: "12px",
                  padding: "1rem 2rem",
                  textDecoration: "none",
                  boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.4)",
                  transition: "all 0.3s ease",
                }}
              >
                <FaCheckCircle style={{ fontSize: "1.2rem" }} />
                Book Your Free Demo
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/locations"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  background: isLight
                    ? "rgba(255, 255, 255, 0.8)"
                    : "rgba(30, 41, 59, 0.8)",
                  backdropFilter: "blur(8px)",
                  color: isLight ? "#111827" : "#f9fafb",
                  fontWeight: 600,
                  fontSize: "1.125rem",
                  borderRadius: "12px",
                  padding: "1rem 2rem",
                  border: isLight
                    ? "1px solid rgba(0,0,0,0.08)"
                    : "1px solid rgba(255,255,255,0.1)",
                  textDecoration: "none",
                  boxShadow: isLight
                    ? "0 8px 20px rgba(0,0,0,0.06)"
                    : "0 8px 20px rgba(0,0,0,0.2)",
                  transition: "all 0.3s ease",
                }}
              >
                <FaMapMarkerAlt
                  style={{ color: "#ec4899", fontSize: "1.2rem" }}
                />
                Find a Center Near You
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            style={{
              display: "flex",
              gap: "2rem",
              justifyContent: "center",
              fontSize: "0.875rem",
              color: isLight ? "#6b7280" : "#9ca3af",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <div
                style={{
                  width: "1.5rem",
                  height: "1.5rem",
                  borderRadius: "50%",
                  background: isLight ? "#dcfce7" : "#065f46",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ color: isLight ? "#059669" : "#10b981" }}>
                  ✓
                </span>
              </div>
              <span>Certified Teachers</span>
            </div>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <div
                style={{
                  width: "1.5rem",
                  height: "1.5rem",
                  borderRadius: "50%",
                  background: isLight ? "#dcfce7" : "#065f46",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ color: isLight ? "#059669" : "#10b981" }}>
                  ✓
                </span>
              </div>
              <span>30+ Locations</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
