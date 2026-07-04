'use client';

import { useRef, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@heroui/react';

const slides = [
  { img: '/images/banner1.png', accent: '#e8a87c' },
  { img: '/images/banner2.png', accent: '#7cb8e8' },
  { img: '/images/banner3.png', accent: '#a87ce8' },
];

const legalPhrases = [
  'Justice for All.',
  'Your Rights Matter.',
  'Expert Legal Counsel.',
  'Trusted. Verified. Ready.',
  'Law Made Accessible.',
  'Find Your Lawyer Today.',
];

const stats = [
  { value: '500+', label: 'Verified Lawyers' },
  { value: '12K+', label: 'Cases Handled' },
  { value: '98%', label: 'Satisfaction' },
];

export default function HeroPage() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const [phraseIndex, setPhraseIndex] = useState(0);

  /* ── Cycle legal phrases ── */
  useEffect(() => {
    const id = setInterval(() => {
      setPhraseIndex((i) => (i + 1) % legalPhrases.length);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  /* ── Golden particle canvas ── */
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

    const COUNT = 55;
    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.4,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      opacity: Math.random() * 0.5 + 0.1,
      hue: Math.random() * 30 + 35, // gold range 35–65
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
        ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, ${p.opacity})`;
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(251,191,36,${(1 - dist / 110) * 0.12})`;
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

        :root { --h: 100dvh; }

        .hero-root {
          position: relative;
          width: 100%;
          height: var(--h);
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Swiper background ── */
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
            135deg,
            rgba(0,0,0,0.78) 0%,
            rgba(0,0,0,0.42) 55%,
            rgba(0,0,0,0.60) 100%
          );
        }

        /* ── Particle canvas ── */
        .hero-canvas {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
        }

        /* ── Content overlay ── */
        .hero-content-overlay {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0;
          padding: 1.5rem;
          text-align: center;
        }

        /* ── Eyebrow tag ── */
        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(0,0,0,0.55);
          border: 1.5px solid rgba(251,191,36,0.7);
          border-radius: 999px;
          padding: 7px 20px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #fde68a;
          margin-bottom: 1.6rem;
          backdrop-filter: blur(12px);
          box-shadow: 0 2px 16px rgba(0,0,0,0.4), 0 0 0 1px rgba(251,191,36,0.15);
        }
        .eyebrow-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #fbbf24;
          animation: blink 2s infinite;
          box-shadow: 0 0 6px #fbbf24;
        }
        @keyframes blink {
          0%,100% { opacity: 1; transform: scale(1); box-shadow: 0 0 6px #fbbf24; }
          50%      { opacity: 0.5; transform: scale(1.6); box-shadow: 0 0 14px #fbbf24; }
        }

        /* ── Main heading ── */
        .hero-heading {
          font-family: 'Playfair Display', serif;
          font-weight: 800;
          font-size: clamp(1.8rem, 5.5vw, 3.6rem);
          color: #ffffff;
          max-width: min(820px, 92vw);
          text-shadow: 0 4px 24px rgba(0,0,0,0.6);
          line-height: 1.2;
          margin: 0 0 0.6rem;
        }

        /* ── Animated phrase slot ── */
        .phrase-slot {
          height: clamp(2.4rem, 5vw, 3.8rem);
          overflow: hidden;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.45);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 0 1.5rem;
          border: 1px solid rgba(251,191,36,0.18);
          max-width: min(680px, 92vw);
          box-shadow: 0 2px 20px rgba(0,0,0,0.35);
        }

        /* ── Stats row ── */
        .hero-stats {
          display: flex;
          gap: 2rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          justify-content: center;
        }
        .stat-item { display: flex; flex-direction: column; align-items: center; gap: 1px; }
        .stat-value {
          font-size: clamp(1.2rem, 2.5vw, 1.6rem);
          font-weight: 800;
          background: linear-gradient(135deg, #fbbf24, #f97316);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .stat-label { font-size: 0.68rem; color: rgba(255,255,255,0.5); letter-spacing: 0.06em; font-weight: 500; }
        .stat-divider { width: 1px; background: rgba(255,255,255,0.15); align-self: stretch; }

        /* ── CTAs ── */
        .hero-ctas {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
        }
        .hero-cta-primary {
          padding: 0.8rem 2.2rem;
          border-radius: 999px;
          font-size: clamp(0.875rem, 2vw, 1rem);
          font-weight: 700;
          background: linear-gradient(135deg, #fbbf24 0%, #f97316 100%);
          color: #1a1000;
          border: none;
          cursor: pointer;
          text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 24px rgba(251,191,36,0.4);
          white-space: nowrap;
        }
        .hero-cta-primary:hover {
          transform: scale(1.05) translateY(-2px);
          box-shadow: 0 8px 32px rgba(251,191,36,0.55);
        }
        .hero-cta-secondary {
          padding: 0.8rem 2.2rem;
          border-radius: 999px;
          font-size: clamp(0.875rem, 2vw, 1rem);
          font-weight: 600;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.22);
          color: #fff;
          cursor: pointer;
          text-decoration: none;
          transition: transform 0.2s, background 0.2s;
          backdrop-filter: blur(8px);
          white-space: nowrap;
        }
        .hero-cta-secondary:hover {
          background: rgba(255,255,255,0.16);
          transform: translateY(-2px);
        }

        @media (max-width: 480px) {
          .hero-content-overlay { gap: 0; padding: 1rem; }
          .hero-stats { gap: 1.2rem; }
        }

        /* Swiper nav/pagination tweaks */
        .hero-swiper-bg .swiper-button-next,
        .hero-swiper-bg .swiper-button-prev {
          color: rgba(251,191,36,0.85) !important;
        }
        .hero-swiper-bg .swiper-pagination-bullet-active {
          background: #fbbf24 !important;
        }
      `}</style>

      <div className="hero-root">

        {/* LAYER 1 – Swiper background (unchanged) */}
        <div className="hero-swiper-bg">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            loop={true}
            speed={900}
            autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: false }}
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

        {/* LAYER 2 – Golden particles */}
        <canvas ref={canvasRef} className="hero-canvas" />

        {/* LAYER 3 – Content */}
        <div className="hero-content-overlay">

          {/* Eyebrow tag */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="hero-eyebrow"
          >
            <span className="eyebrow-dot" />
            Bangladesh&apos;s Premier Legal Marketplace
          </motion.div>

          {/* Static heading */}
          <motion.h1
            className="hero-heading"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.25 }}
          >
            Find &amp; Hire Expert Legal Counsel
          </motion.h1>

          {/* Animated rotating legal phrase */}
          <div className="phrase-slot">
            <AnimatePresence mode="wait">
              <motion.span
                key={phraseIndex}
                initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -18, filter: 'blur(6px)' }}
                transition={{ duration: 0.52, ease: 'easeInOut' }}
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(1.1rem, 3.5vw, 2rem)',
                  fontWeight: 700,
                  fontStyle: 'italic',
                  background: 'linear-gradient(135deg, #fbbf24, #f97316)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: 'none',
                  display: 'block',
                }}
              >
                &ldquo;{legalPhrases[phraseIndex]}&rdquo;
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Stats row */}
          <motion.div
            className="hero-stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.55 }}
          >
            {stats.map((s, i) => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div className="stat-item">
                  <span className="stat-value">{s.value}</span>
                  <span className="stat-label">{s.label}</span>
                </div>
                {i < stats.length - 1 && <div className="stat-divider" />}
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            className="hero-ctas"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.7 }}
          >
            <a href="/lawyers" className="hero-cta-primary">
              Browse Lawyers →
            </a>
            <a href="/signup" className="hero-cta-secondary">
              Get Started Free
            </a>
          </motion.div>

        </div>
      </div>
    </>
  );
}