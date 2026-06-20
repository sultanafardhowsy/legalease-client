'use client';

import { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { motion, AnimatePresence } from "framer-motion";

/* ── Slide data ── */
const slides = [
  {
    img: '/images/banner1.WEBP',
    accent: '#e8a87c',
  },
  {
    img: '/images/banner2.png',
    accent: '#7cb8e8',
  },
  {
    img: '/images/banner3.png',
    accent: '#a87ce8',
  },
];

/* ── Moving legal phrases outside the component ── */
const legalPhrases = [
  "Your legal universe, unified.",
  "Smart tools for sharp minds. This is the future of law.",
  "Where legal expertise meets digital efficiency.",
  "The ultimate basecamp for lawyers and litigants alike."
];

export default function HeroPage() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const [index, setIndex] = useState(0); // State handled inside the single page component

  /* ── Particle canvas ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const COUNT = 45;
    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.3,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      opacity: Math.random() * 0.45 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255,255,255,${(1 - dist / 100) * 0.12})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  /* ── Phrase Text Rotator Effect ── */
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % legalPhrases.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        :root {
          --h: 100dvh;
          --white: #ffffff;
          --off: rgba(255,255,255,0.82);
          --muted: rgba(255,255,255,0.55);
          --accent: #e8a87c;
          --radius: 14px;
        }

        .hero-root {
          position: relative;
          width: 100%;
          height: var(--h);
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }

        .hero-swiper-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .hero-swiper-bg .swiper,
        .hero-swiper-bg .swiper-wrapper,
        .hero-swiper-bg .swiper-slide {
          width: 100%;
          height: 100%;
        }

        .hero-swiper-bg .swiper-slide {
          background-size: cover;
          background-position: center;
          transition: transform 6s ease-out;
          transform: scale(1.06);
        }
        
        .hero-swiper-bg .swiper-slide-active {
          animation: kenburns 7s ease-out forwards;
        }
        
        @keyframes kenburns {
          from { transform: scale(1.06); }
          to   { transform: scale(1); }
        }

        .slide-scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            120deg,
            rgba(0,0,0,0.72) 0%,
            rgba(0,0,0,0.38) 55%,
            rgba(0,0,0,0.55) 100%
          );
        }

        .hero-canvas {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
        }

        /* Centered content block layer for your framer motion text */
        .hero-content-overlay {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: flex;
          justifyContent: center;
          align-items: center;
          padding: 20px;
          pointer-events: none;
        }
      `}</style>

      <div className="hero-root">

        {/* LAYER 1: Swiper background */}
        <div className="hero-swiper-bg">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            loop={true}
            speed={900}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
              stopOnLastSlide: false,
            }}
            pagination={{ clickable: true }}
            navigation={true}
          >
            {slides.map((slide, i) => (
              <SwiperSlide
                key={i}
                style={{ backgroundImage: `url(${slide.img})` }}
              >
                <div className="slide-scrim" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* LAYER 2: Particles */}
        <canvas ref={canvasRef} className="hero-canvas" />

        {/* LAYER 3: Interactive Framer Motion Text */}
        <div className="hero-content-overlay">
          <AnimatePresence mode="wait">
            <motion.h2
              key={index} 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              style={{
                fontWeight: "bold",
                fontSize: "clamp(1.8rem, 4vw, 3rem)",
                color: "#ffffff", 
                textAlign: "center",
                maxWidth: "800px",
                textShadow: "0px 4px 12px rgba(0,0,0,0.5)"
              }}
            >
              {legalPhrases[index]}
            </motion.h2>
          </AnimatePresence>
          
        </div>

      </div>
    </>
  );
}