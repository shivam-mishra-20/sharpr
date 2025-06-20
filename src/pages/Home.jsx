/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaGraduationCap,
  FaLaptopCode,
  FaChartLine,
  FaUserFriends,
} from "react-icons/fa";
import Footer from "../components/Footer";

import HeroSection from "../components/HeroSection";
import Results from "../components/Results";
import Testimonials from "../components/Testimonials";
import Locations from "../components/Locations";

import Programs from "./Programs";
// import { Contact } from "lucide-react";
import Contact from "./Contact"; // Assuming you have a Contact component
import PricingOffer from "../components/PricingOffer";
import NotFound from "./404Notfound";

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <>
      <HeroSection />
      <Programs />

      {/* ...existing or future home page content... */}
      <PricingOffer />

      <Results />
      <Contact />
      <Testimonials />
      <Locations />

      <Footer />
    </>
  );
};

export default Home;
