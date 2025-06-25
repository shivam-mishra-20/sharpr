import React, { useRef, useEffect, Suspense } from "react";
import { useFrame, Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

// Earth globe component with mouse interaction
function EarthGlobe({ mousePosition }) {
  const earthRef = useRef();
  const textureRef = useRef();

  // Load the Earth texture
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    // Load texture from your public folder
    loader.load("/textures/earth.jpg", (texture) => {
      textureRef.current = texture;
      // If the mesh exists, apply the texture
      if (earthRef.current?.children[0]?.material) {
        earthRef.current.children[0].material.map = texture;
        earthRef.current.children[0].material.needsUpdate = true;
      }
    });
  }, []);

  useFrame(({ clock }) => {
    if (earthRef.current) {
      // Gentle constant rotation
      earthRef.current.rotation.y += 0.001;

      // Mouse-based interaction
      if (mousePosition.current) {
        // Tilt based on mouse position
        earthRef.current.rotation.x = THREE.MathUtils.lerp(
          earthRef.current.rotation.x,
          mousePosition.current.y * 0.3,
          0.05
        );

        earthRef.current.rotation.y = THREE.MathUtils.lerp(
          earthRef.current.rotation.y,
          mousePosition.current.x * 0.5,
          0.03
        );
      }
    }
  });

  return (
    <group ref={earthRef}>
      {/* Earth sphere with texture */}
      <mesh>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial metalness={0.1} roughness={0.8} />
      </mesh>

      {/* Cloud layer */}
      <mesh>
        <sphereGeometry args={[2.05, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent={true}
          opacity={0.3}
          roughness={0.5}
        />
      </mesh>
    </group>
  );
}

const Interactive3D = () => {
  // Store mouse position
  const mousePosition = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const updateMousePosition = (event) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    mousePosition.current = { x, y };
  };

  // Setup event listeners
  useEffect(() => {
    const handleMouseMove = (event) => {
      updateMousePosition(event);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Wrapper styles for floating Earth
  const wrapperStyle = {
    position: "fixed",
    bottom: "80px",
    right: "30px",
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    zIndex: 999,
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    cursor: "pointer",
    transition: "transform 0.3s ease",
  };

  return (
    <motion.div
      ref={containerRef}
      style={wrapperStyle}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.1 }}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 3, 5]} intensity={1} />
        <pointLight
          position={[-10, -10, -10]}
          color="#aaaaff"
          intensity={0.5}
        />

        <Suspense fallback={null}>
          <EarthGlobe mousePosition={mousePosition} />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
        />
      </Canvas>
    </motion.div>
  );
};

export default Interactive3D;
