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

// Educational Solar System Component
const EducationalElements = ({ isLight }) => {
  const sunRef = useRef();
  const orbitRefs = useRef([...Array(5)].map(() => React.createRef()));

  // Colors based on theme
  const sunColor = isLight ? "#ff9500" : "#ff7b00";
  const sunEmissive = isLight ? "#ff5e00" : "#ff4500";
  const planetColors = [
    {
      main: isLight ? "#4f46e5" : "#818cf8",
      name: "Math",
      texture: "earthlike",
    },
    { main: isLight ? "#059669" : "#10b981", name: "Science", texture: "gas" },
    {
      main: isLight ? "#ec4899" : "#f472b6",
      name: "Language",
      texture: "rocky",
    },
    { main: isLight ? "#eab308" : "#facc15", name: "Art", texture: "cloudy" },
    {
      main: isLight ? "#8b5cf6" : "#a78bfa",
      name: "Social Studies",
      texture: "ringed",
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
          state.clock.getElapsedTime() * (0.09 - i * 0.01);
      }
    });
  });

  // Planet component with education subject icon
  const Planet = ({
    color,
    position,
    size,
    orbitRadius,
    orbitSpeed,
    index,
    textureName,
  }) => {
    const planetRef = useRef();
    const ringRef = useRef();
    const orbitAngle = useRef(Math.random() * Math.PI * 2);

    useFrame((state) => {
      if (planetRef.current) {
        // Update planet's position in its orbit
        orbitAngle.current += orbitSpeed;
        const x = Math.sin(orbitAngle.current) * orbitRadius;
        const z = Math.cos(orbitAngle.current) * orbitRadius;
        planetRef.current.position.x = x;
        planetRef.current.position.z = z;

        // Rotate planet
        planetRef.current.rotation.y += 0.005 + index * 0.001;

        // Add a tilt to planet rotation
        planetRef.current.rotation.x = Math.PI * 0.1 * (index % 3);

        // If this is the ringed planet, update the ring position
        if (ringRef.current) {
          ringRef.current.position.x = x;
          ringRef.current.position.z = z;
        }
      }
    });

    // Generate planet surface based on texture type
    const renderPlanetSurface = () => {
      switch (textureName) {
        case "gas":
          // Gas giant with simple material
          return (
            <mesh ref={planetRef} position={position}>
              <sphereGeometry args={[size, 32, 32]} />
              <meshStandardMaterial
                color={color}
                roughness={0.8}
                metalness={0.1}
                emissive={color}
                emissiveIntensity={0.05}
              />
            </mesh>
          );

        case "rocky":
          // Rocky planet with simple material
          return (
            <mesh ref={planetRef} position={position}>
              <sphereGeometry args={[size, 32, 32]} />
              <meshStandardMaterial
                color={color}
                roughness={1}
                metalness={0.2}
                emissive={color}
                emissiveIntensity={0.03}
              />
            </mesh>
          );

        case "ringed":
          // Planet with rings
          return (
            <>
              <mesh ref={planetRef} position={position}>
                <sphereGeometry args={[size, 32, 32]} />
                <meshStandardMaterial
                  color={color}
                  roughness={0.6}
                  metalness={0.3}
                  emissive={color}
                  emissiveIntensity={0.05}
                />
              </mesh>
              <group
                ref={ringRef}
                position={position}
                rotation={[Math.PI / 3, 0, 0]}
              >
                <Ring args={[size * 1.3, size * 1.8, 64]}>
                  <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={0.7}
                    side={THREE.DoubleSide}
                  />
                </Ring>
              </group>
            </>
          );

        case "cloudy":
          // Planet with simple material
          return (
            <mesh ref={planetRef} position={position}>
              <sphereGeometry args={[size, 32, 32]} />
              <meshStandardMaterial
                color={color}
                roughness={0.6}
                metalness={0.1}
                emissive={color}
                emissiveIntensity={0.1}
              />
            </mesh>
          );

        case "earthlike":
        default:
          // Earth-like planet with simple material
          return (
            <mesh ref={planetRef} position={position}>
              <sphereGeometry args={[size, 32, 32]} />
              <meshStandardMaterial
                color={color}
                roughness={0.7}
                metalness={0.2}
                emissive={color}
                emissiveIntensity={0.05}
              />
            </mesh>
          );
      }
    };

    return <group>{renderPlanetSurface()}</group>;
  };

  return (
    <group>
      {/* Stars background - fewer and smaller */}
      <Stars
        radius={80}
        depth={40}
        count={3000}
        factor={3}
        saturation={0}
        fade
        speed={0.5}
      />

      {/* Sun at the center - smaller */}
      <mesh ref={sunRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial
          color={sunColor}
          emissive={sunEmissive}
          emissiveIntensity={1}
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>

      {/* Orbit paths - smaller radii */}
      {[2.5, 4, 5.5, 7, 9].map((radius, i) => (
        <group ref={orbitRefs.current[i]} key={`orbit-${i}`}>
          <Ring
            args={[radius - 0.03, radius + 0.03, 64]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <meshBasicMaterial
              color={planetColors[i].main}
              transparent
              opacity={0.2}
              side={THREE.DoubleSide}
            />
          </Ring>
        </group>
      ))}

      {/* Planets - smaller sizes */}
      {planetColors.map((planet, i) => (
        <Planet
          key={`planet-${i}`}
          color={planet.main}
          position={[i * 2 + 3, 0, 0]} // Starting positions
          size={i === 2 ? 0.6 : i === 0 ? 0.7 : 0.4 + i * 0.1} // Smaller planet sizes
          orbitRadius={
            i === 0 ? 2.5 : i === 1 ? 4 : i === 2 ? 5.5 : i === 3 ? 7 : 9
          } // Smaller orbit radii
          orbitSpeed={0.007 / (i * 0.5 + 1)} // Slightly faster for smoother animation
          index={i}
          textureName={planet.texture}
        />
      ))}

      {/* Fewer particles for cleaner look */}
      {[...Array(10)].map((_, i) => (
        <Float
          key={`particle-${i}`}
          speed={(1 + Math.random()) * 1.5}
          rotationIntensity={0.8}
          floatIntensity={1.5}
        >
          <mesh
            position={[
              (Math.random() - 0.5) * 15,
              (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 15,
            ]}
          >
            <sphereGeometry args={[0.05 + Math.random() * 0.1, 8, 8]} />
            <meshStandardMaterial
              color={
                planetColors[Math.floor(Math.random() * planetColors.length)]
                  .main
              }
              emissive={
                planetColors[Math.floor(Math.random() * planetColors.length)]
                  .main
              }
              emissiveIntensity={0.5}
            />
          </mesh>
        </Float>
      ))}
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
        intensity={isLight ? 1.5 : 1.2}
        color={isLight ? "#fff9e5" : "#ffe0b3"}
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
      {/* 3D Background element */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: 0.7,
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        <Scene isLight={isLight} />
      </div>

      {/* Background decoration */}
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
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "4rem",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          maxWidth: "1280px",
          margin: "0 auto",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Left: Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            flex: "1 1 500px",
            minWidth: 320,
            maxWidth: 600,
            padding: "0 1rem",
          }}
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
              marginBottom: "2.5rem",
              lineHeight: 1.7,
              maxWidth: 560,
            }}
          >
            Sharpr helps children ages 5-10 master essential subjects with
            clarity, confidence, and personalized attention — conveniently
            located in your neighborhood.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            style={{
              display: "flex",
              gap: "1.25rem",
              flexWrap: "wrap",
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
              marginTop: "3.5rem",
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

        {/* Right: Image */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          style={{
            flex: "1 1 400px",
            minWidth: 320,
            maxWidth: 580,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              top: "10px",
              left: "10px",
              borderRadius: "20px",
              background: isLight
                ? "rgba(79, 70, 229, 0.2)"
                : "rgba(79, 70, 229, 0.4)",
              zIndex: 1,
              transform: "rotate(-3deg)",
            }}
          ></div>

          <motion.div
            whileHover={{ scale: 1.02, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{
              position: "relative",
              zIndex: 2,
              transform: "rotate(2deg)",
              transformOrigin: "center center",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80"
              alt="Students engaged in interactive learning with tablets and educational materials"
              style={{
                width: "100%",
                borderRadius: "20px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                objectFit: "cover",
                aspectRatio: "4/3",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "20px",
                right: "20px",
                background: isLight
                  ? "rgba(255,255,255,0.95)"
                  : "rgba(17, 24, 39, 0.9)",
                borderRadius: "12px",
                padding: "1rem 1.5rem",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                backdropFilter: "blur(10px)",
                maxWidth: "200px",
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "2rem",
                  color: "#4f46e5",
                  lineHeight: 1,
                }}
              >
                5-10
              </div>
              <div
                style={{
                  fontSize: "0.875rem",
                  color: isLight ? "#4b5563" : "#d1d5db",
                }}
              >
                Perfect age range for foundational learning
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
