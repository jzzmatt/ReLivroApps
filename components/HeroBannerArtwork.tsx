"use client";

import {motion, useReducedMotion} from "motion/react";

const HERO_BANNER_SRC = "/asset/reLivroApps-hero-banner-16x9.png";

export function HeroBannerArtwork() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="hero-banner-layer" aria-hidden="true">
      {reduceMotion ? (
        <img className="hero-banner-image" src={HERO_BANNER_SRC} alt="" decoding="async"/>
      ) : (
        <motion.img
          className="hero-banner-image"
          src={HERO_BANNER_SRC}
          alt=""
          decoding="async"
          initial={{opacity: 0, scale: 1.03}}
          animate={{opacity: 1, scale: 1}}
          transition={{duration: 0.85, ease: [0.22, 1, 0.36, 1]}}
        />
      )}
      <div className="hero-banner-overlay"/>
    </div>
  );
}
