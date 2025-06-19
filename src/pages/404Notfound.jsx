import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./404Notfound.css";

const NotFound = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x =
          ((e.clientX - rect.left) / containerRef.current.offsetWidth - 0.5) *
          2;
        const y =
          ((e.clientY - rect.top) / containerRef.current.offsetHeight - 0.5) *
          2;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation for stars
    const stars = document.querySelectorAll(".star");
    stars.forEach((star, index) => {
      const delay = Math.random() * 5;
      const duration = 3 + Math.random() * 4;
      star.style.animation = `twinkle ${duration}s infinite ${delay}s`;
    });

    // Text animation
    const errorText = document.querySelector(".error-text");
    errorText.classList.add("animate");

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Generate random stars
  const generateStars = (count) => {
    const stars = [];
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 2;
      stars.push(
        <div
          key={i}
          className="star"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${size}px`,
            height: `${size}px`,
          }}
        />
      );
    }
    return stars;
  };

  return (
    <div className="not-found-container" ref={containerRef}>
      <div className="space-background">{generateStars(150)}</div>

      <div
        className="planet-3d"
        style={{
          transform: `rotateY(${mousePosition.x * 20}deg) rotateX(${
            -mousePosition.y * 20
          }deg)`,
        }}
      >
        <div className="planet-rings"></div>
      </div>

      <div className="asteroid-field">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`asteroid asteroid-${i + 1}`}
            style={{
              transform: `translateX(${
                mousePosition.x * (i + 5) * 10
              }px) translateY(${mousePosition.y * (i + 5) * 10}px)`,
            }}
          />
        ))}
      </div>

      <div
        className="content-container"
        style={{
          transform: `translateZ(50px) rotateY(${
            mousePosition.x * 10
          }deg) rotateX(${-mousePosition.y * 10}deg)`,
        }}
      >
        <h1 className="error-code">404</h1>
        <h2 className="error-text">Lost in Space</h2>
        <p className="error-description">
          The page you're looking for has drifted into a black hole.
        </p>
        <Link to="/" className="home-button">
          <span className="button-text">Return to Earth</span>
          <span className="button-icon">→</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
