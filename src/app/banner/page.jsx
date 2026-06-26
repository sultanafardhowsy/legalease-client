'use client';

import { useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { motion } from "framer-motion";
import { Button } from '@heroui/react';

const slides = [
  { img: '/images/banner1.png', accent: '#e8a87c' },
  { img: '/images/banner2.png', accent: '#7cb8e8' },
  { img: '/images/banner3.png', accent: '#a87ce8' },
];

export default function HeroPage() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        :root {
          --h: 100dvh;
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

        .hero-content-overlay {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          padding: 1.5rem;
          text-align: center;
        }

        .hero-heading {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: clamp(1.6rem, 5vw, 3.2rem);
          color: #ffffff;
          text-align: center;
          max-width: min(800px, 90vw);
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.55);
          line-height: 1.25;
          margin: 0;
        }

        .hero-cta button {
  padding: 0.75rem 2.25rem !important;
  font-size: clamp(0.875rem, 2vw, 1rem) !important;
  font-weight: 600 !important;
  border-radius: 9999px !important;
  background: linear-gradient(135deg, #e8a87c, #e86c6c) !important; /* ← gradient */
  color: #fff !important;
  border: none !important;
  cursor: pointer !important;
  transition: transform 0.2s ease, background 0.2s ease !important;
  white-space: nowrap;
}

.hero-cta button:hover {
  background: linear-gradient(135deg, #d4925f, #d45050) !important; /* ← darker on hover */
  transform: scale(1.04) !important;
}

.hero-cta button:active {
  transform: scale(0.97) !important;
}

        @media (max-width: 480px) {
          .hero-content-overlay {
            gap: 1.5rem;
            padding: 1rem;
          }
        }
      `}</style>

      <div className="hero-root">

        {/* LAYER 1 – Swiper background */}
        <div className="hero-swiper-bg">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            loop={true}
            speed={900}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
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

        {/* LAYER 2 – Particles */}
        <canvas ref={canvasRef} className="hero-canvas" />

        {/* LAYER 3 – Centered text + button */}
        <div className="hero-content-overlay">

          {/* Static fade-in heading with Framer Motion */}
          <motion.h2
            className="hero-heading"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
          >
            Find & Hire Expert Legal Counsel
          </motion.h2>

          {/* CTA button fades in slightly after heading */}
          <motion.div
            className="hero-cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.7 }}
          >
            <a href="/lawyers" style={{ textDecoration: 'none' }}>
              <Button size="md">Browse Lawyers</Button>
            </a>
          </motion.div>

        </div>

      </div>
    </>
  );
}