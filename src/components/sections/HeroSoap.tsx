"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, MotionConfig } from "framer-motion";
import assets from "@/assets";
import PopBackground from "@/components/ui/PopBackground";

type Scent = { name: string; bar: string; speck: string; leaf: string };

const SCENTS: Scent[] = [
  { name: "Neem & Tulsi", bar: "#A9CF73", speck: "#2D5A16", leaf: "#1F4A10" },
  { name: "Lavender", bar: "#D6CAF0", speck: "#6B4FA0", leaf: "#3F2C73" },
  { name: "Honey Oat", bar: "#F2D88F", speck: "#B8862B", leaf: "#7A5410" },
];

const STEPS = [
  "Blending the oils",
  "Adding the botanicals",
  "Pouring into the mould",
  "Curing slowly",
  "Stamping the leaf",
  "Ready to lather",
];
const STEP_AT = [0, 1500, 2800, 3900, 5300, 6600];
const CYCLE_MS = 12000;

const TICKER = [
  "Handmade soaps",
  "Neem & Tulsi",
  "Lavender",
  "Gift sets",
  "Plant-based oils",
  "No parabens",
  "Small batches",
];

const SPECKS = [
  { x: 112, y: 262, r: 4 },
  { x: 150, y: 300, r: 3 },
  { x: 134, y: 330, r: 4 },
  { x: 176, y: 242, r: 3 },
  { x: 232, y: 236, r: 4 },
  { x: 262, y: 276, r: 3 },
  { x: 286, y: 318, r: 4 },
  { x: 248, y: 332, r: 3 },
  { x: 100, y: 304, r: 3 },
  { x: 292, y: 250, r: 3 },
];

const BUBBLES = [
  { x: 120, r: 12, d: 0 },
  { x: 160, r: 8, d: 0.8 },
  { x: 200, r: 16, d: 1.6 },
  { x: 245, r: 9, d: 0.4 },
  { x: 280, r: 13, d: 1.2 },
  { x: 220, r: 7, d: 2.2 },
];

const BURST = Array.from({ length: 10 }, (_, k) => {
  const a = (k / 10) * Math.PI * 2;
  const dist = 80 + (k % 3) * 26;
  return {
    dx: Math.cos(a) * dist,
    dy: Math.sin(a) * dist - 40,
    r: 8 + (k % 3) * 4,
  };
});

const fillBox = { transformBox: "fill-box" as const };

function Soap({
  s,
  step,
  pops,
  onTap,
}: {
  s: Scent;
  step: number;
  pops: number;
  onTap: () => void;
}) {
  return (
    <svg
      viewBox="0 0 400 430"
      role="img"
      aria-label={`${s.name} soap being made`}
      className="relative w-full overflow-visible"
    >
      <defs>
        <linearGradient id="cyl" x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.14" />
          <stop offset="0.3" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="1" stopColor="#000" stopOpacity="0.2" />
        </linearGradient>
        <clipPath id="barclip">
          <rect x="80" y="220" width="240" height="130" rx="36" />
        </clipPath>
      </defs>

      {/* dish */}
      <ellipse
        cx="200"
        cy="376"
        rx="176"
        ry="26"
        fill="#0B2005"
        opacity="0.3"
      />
      <ellipse cx="200" cy="368" rx="176" ry="26" fill="#fff" />
      <ellipse cx="200" cy="364" rx="150" ry="17" fill="#E3EDD2" />

      {/* bar: poured in */}
      <motion.g
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 90, damping: 14 }}
        style={{ ...fillBox, transformOrigin: "bottom" }}
      >
        <rect x="80" y="220" width="240" height="130" rx="36" fill={s.bar} />
        <rect
          x="80"
          y="220"
          width="240"
          height="130"
          rx="36"
          fill="url(#cyl)"
        />
        <rect
          x="98"
          y="232"
          width="204"
          height="22"
          rx="11"
          fill="#fff"
          opacity="0.28"
        />
      </motion.g>

      {/* botanicals, leaf stamp, shine (clipped to the bar) */}
      <g clipPath="url(#barclip)">
        {SPECKS.map((p, k) => (
          <motion.circle
            key={k}
            cx={p.x}
            cy={p.y}
            r={p.r}
            fill={s.speck}
            opacity="0.7"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 1.9 + k * 0.08,
              type: "spring",
              stiffness: 260,
            }}
            style={{ ...fillBox, transformOrigin: "center" }}
          />
        ))}

        <motion.g
          initial={{ scale: 0, rotate: -40, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{
            delay: 3.4,
            type: "spring",
            stiffness: 200,
            damping: 12,
          }}
          style={{ ...fillBox, transformOrigin: "center" }}
        >
          <path
            d="M200 326 C166 304 166 262 206 244 C230 272 230 306 200 326 Z"
            fill={s.leaf}
            opacity="0.92"
          />
          <path
            d="M200 320 L207 256"
            stroke={s.bar}
            strokeWidth="3"
            strokeLinecap="round"
          />
        </motion.g>

        <g transform="skewX(-20)">
          <motion.rect
            x="20"
            y="214"
            width="36"
            height="140"
            fill="#fff"
            initial={{ x: 0, opacity: 0 }}
            animate={{ x: 340, opacity: [0, 0.5, 0] }}
            transition={{ delay: 4.6, duration: 1.2 }}
          />
        </g>
      </g>

      {/* bubbles */}
      {step >= 4 &&
        BUBBLES.map((b, k) => (
          <motion.circle
            key={k}
            cx={b.x}
            cy={210}
            r={b.r}
            fill="#fff"
            fillOpacity="0.3"
            stroke="#fff"
            strokeWidth="2"
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: -170, opacity: [0, 0.9, 0] }}
            transition={{
              duration: 4,
              delay: b.d,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ))}

      {/* tap burst */}
      {pops > 0 &&
        BURST.map((b, k) => (
          <motion.circle
            key={`${pops}-${k}`}
            cx={200}
            cy={270}
            r={b.r}
            fill="#fff"
            fillOpacity="0.35"
            stroke="#fff"
            strokeWidth="2"
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{ x: b.dx, y: b.dy, opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        ))}

      {/* tap target */}
      <rect
        x="80"
        y="220"
        width="240"
        height="130"
        rx="36"
        fill="transparent"
        style={{ cursor: "pointer" }}
        onClick={onTap}
      />
    </svg>
  );
}

export default function HeroSoap() {
  const [scent, setScent] = useState(0);
  const [run, setRun] = useState(0);
  const [step, setStep] = useState(0);
  const [pops, setPops] = useState(0);

  useEffect(() => {
    setStep(0);
    setPops(0);
    const timers = STEP_AT.map((ms, k) => setTimeout(() => setStep(k), ms));
    timers.push(
      setTimeout(() => setScent((p) => (p + 1) % SCENTS.length), CYCLE_MS),
    );
    return () => timers.forEach(clearTimeout);
  }, [scent, run]);

  const pick = (k: number) => {
    setScent(k);
    setRun((r) => r + 1);
  };

  const s = SCENTS[scent];

  return (
    <MotionConfig reducedMotion="user">
      <PopBackground variant="red" className="min-h-screen">
        <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-6 pb-40 pt-28 md:grid-cols-[1fr_1fr]">
          {/* TEXT */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block rounded-full bg-white/15 px-5 py-2 text-sm font-semibold text-white ring-1 ring-white/40 backdrop-blur"
            >
              Olivra · Handmade soaps
            </motion.span>

            <h1 className="font-display mt-6 text-5xl font-semibold leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl">
              {["made slowly,", "washed gently."].map((l, k) => (
                <span key={l} className="block overflow-hidden pb-[0.1em]">
                  <motion.span
                    className={`block ${k === 1 ? "italic text-brand-yellow" : ""}`}
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{
                      delay: 0.15 * k + 0.1,
                      duration: 0.7,
                      ease: [0.76, 0, 0.24, 1],
                    }}
                  >
                    {l}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 max-w-md text-lg leading-relaxed text-white/95"
            >
              Plant-based soaps poured by hand in small batches. Real
              botanicals, short ingredient lists, kind to your skin.
            </motion.p>

            {/* scent picker */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-6"
            >
              <p className="mb-2 text-sm font-semibold text-white/85">
                Pick a scent and watch it come together
              </p>
              <div className="flex flex-wrap gap-2">
                {SCENTS.map((sc, k) => (
                  <button
                    key={sc.name}
                    type="button"
                    aria-pressed={k === scent}
                    onClick={() => pick(k)}
                    className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                      k === scent
                        ? "border-white bg-white text-brand-red"
                        : "border-white/50 bg-white/10 text-white hover:bg-white/25"
                    }`}
                  >
                    <span
                      className="h-3 w-3 rounded-full ring-1 ring-black/10"
                      style={{ background: sc.bar }}
                    />
                    {sc.name}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link
                href="/shop"
                className="rounded-full bg-brand-yellow px-8 py-3.5 font-bold text-ink shadow-[0_10px_24px_-8px_rgba(10,30,5,0.6)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                Shop soaps
              </Link>
              <Link
                href="/about"
                className="rounded-full border-2 border-white px-8 py-3 font-bold text-white transition hover:-translate-y-0.5 hover:bg-white hover:text-brand-red"
              >
                Our story
              </Link>
            </motion.div>

            <p className="mt-6 text-sm font-semibold text-white/85">
              Free shipping above ₹499. Cash on delivery available.
            </p>
          </div>

          {/* SOAP */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="relative mx-auto w-full max-w-md"
          >
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 h-[85%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-red-dark/50 blur-2xl"
            />

            <Soap
              key={`${scent}-${run}`}
              s={s}
              step={step}
              pops={pops}
              onTap={() => setPops((p) => p + 1)}
            />

            {/* logo sticker */}
            <motion.div
              className="absolute -right-2 top-0 h-24 w-24 md:h-28 md:w-28"
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            >
              <Image
                src={assets.images.logo}
                alt="Olivra"
                fill
                priority
                sizes="112px"
                className="rounded-full bg-white object-contain p-2 shadow-[0_12px_24px_-8px_rgba(10,30,5,0.6)]"
              />
            </motion.div>

            {/* caption */}
            <div
              aria-live="polite"
              className="mt-2 flex items-center justify-center gap-3 text-sm font-semibold text-white"
            >
              <span className="flex gap-1.5">
                {STEPS.map((_, k) => (
                  <span
                    key={k}
                    className={`h-2 rounded-full transition-all ${
                      k <= step ? "w-5 bg-brand-yellow" : "w-2 bg-white/40"
                    }`}
                  />
                ))}
              </span>
              <span>
                {s.name} · {STEPS[step]}
              </span>
            </div>
            {step >= 4 && (
              <p className="mt-1 text-center text-xs text-white/70">
                Tap the soap for bubbles
              </p>
            )}
          </motion.div>
        </div>

        {/* LIQUID WAVE */}
        <svg
          aria-hidden
          className="absolute bottom-0 left-0 z-10 w-full"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          style={{ height: 110 }}
        >
          <motion.path
            className="fill-cream"
            animate={{
              d: [
                "M0,60 C240,20 480,100 720,60 C960,20 1200,100 1440,60 L1440,120 L0,120 Z",
                "M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z",
                "M0,60 C240,20 480,100 720,60 C960,20 1200,100 1440,60 L1440,120 L0,120 Z",
              ],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </PopBackground>

      {/* TICKER */}
      <div className="relative -mt-2 overflow-hidden bg-cream py-8">
        <div className="-rotate-1 bg-brand-yellow py-3">
          <motion.div
            className="font-display flex w-max whitespace-nowrap text-2xl italic text-ink"
            animate={{ x: ["0%", "-30%"] }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          >
            {Array.from({ length: 6 }).map((_, k) => (
              <span key={k} className="mx-6">
                {TICKER.map((t) => (
                  <span key={t}>
                    {t} <span className="text-brand-red">✦</span>{" "}
                  </span>
                ))}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </MotionConfig>
  );
}
