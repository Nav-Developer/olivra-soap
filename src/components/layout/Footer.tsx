import Link from "next/link";
import Image from "next/image";
import assets from "@/assets";
import PopBackground from "@/components/ui/PopBackground";

// FAKE DATA: replace with real details later.
const CONFIG = {
  about:
    "Handmade soaps, rooted in nature. Plant-based oils, real botanicals and small batches, made for everyday skin.",
  address: "Coimbatore, Tamil Nadu", // TODO: real address
  phone: "+91 00000 00000", // TODO: real phone number
  email: "hello@olivra.example", // TODO: real email
  hours: "Mon to Sat, 10am to 6pm",
  mapsUrl: "https://maps.google.com",
  instagram: "https://www.instagram.com/",
  handle: "@olivra.soaps",
  note: "Free shipping above ₹499. Cash on delivery available.",
};

const COLUMNS = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: "/" },
      { label: "Shop", href: "/shop" },
      { label: "About us", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Our soaps",
    links: [
      { label: "Bath bars", href: "/shop" },
      { label: "Gift sets", href: "/shop" },
      { label: "Mini bars", href: "/shop" },
      { label: "Best sellers", href: "/shop" },
    ],
  },
];

const heading = "mb-5 font-display text-2xl font-semibold text-brand-yellow";

const iconProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const PinIcon = ({ className = "" }: { className?: string }) => (
  <svg {...iconProps} className={className} aria-hidden>
    <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

const ClockIcon = ({ className = "" }: { className?: string }) => (
  <svg {...iconProps} className={className} aria-hidden>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

const PhoneIcon = ({ className = "" }: { className?: string }) => (
  <svg {...iconProps} className={className} aria-hidden>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  </svg>
);

export default function Footer() {
  return (
    <footer>
      <PopBackground variant="deep" className="text-white">
        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-6 py-16 md:px-10 lg:grid-cols-[1.6fr_1fr_1fr_1.3fr]">
          {/* BRAND */}
          <div>
            <Link href="/" className="inline-block" aria-label="Olivra home">
              <div className="relative h-24 w-24 overflow-hidden rounded-full bg-white shadow-[0_16px_30px_-12px_rgba(0,0,0,0.6)]">
                <Image
                  src={assets.images.logo}
                  alt="Olivra"
                  fill
                  sizes="96px"
                  className="object-contain p-2"
                />
              </div>
            </Link>

            <p className="mt-6 max-w-md text-base leading-relaxed text-white/90">
              {CONFIG.about}
            </p>

            <a
              href={CONFIG.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-brand-red transition hover:bg-brand-yellow hover:text-ink"
            >
              <Image
                src={assets.images.instagram}
                alt=""
                width={18}
                height={18}
                className="h-[18px] w-[18px] object-contain"
              />
              {CONFIG.handle}
            </a>
          </div>

          {/* LINK COLUMNS */}
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className={heading}>{col.title}</h3>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="font-medium text-white/90 transition hover:text-brand-yellow"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* VISIT */}
          <div>
            <h3 className={heading}>Get in touch</h3>
            <ul className="space-y-4 text-sm font-medium text-white/90">
              <li className="flex items-start gap-3">
                <ClockIcon className="mt-0.5 shrink-0 text-brand-yellow" />
                <span>{CONFIG.hours}</span>
              </li>
              <li className="flex items-start gap-3">
                <PinIcon className="mt-0.5 shrink-0 text-brand-yellow" />
                <span>
                  {CONFIG.address}
                  <br />
                  <a
                    href={CONFIG.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-brand-yellow underline underline-offset-4"
                  >
                    Get directions
                  </a>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <PhoneIcon className="shrink-0 text-brand-yellow" />
                <a
                  href={`tel:${CONFIG.phone.replace(/\s/g, "")}`}
                  className="font-bold transition hover:text-brand-yellow"
                >
                  {CONFIG.phone}
                </a>
              </li>
            </ul>

            <Link
              href="/shop"
              className="mt-6 inline-block rounded-full bg-brand-yellow px-6 py-3 font-bold text-ink transition hover:-translate-y-0.5 hover:bg-white"
            >
              Shop soaps
            </Link>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="relative z-10 bg-black/25">
          <div className="mx-auto max-w-7xl px-6 py-5 md:px-10">
            <div className="flex flex-col justify-between gap-3 text-sm text-white/75 md:flex-row md:items-center">
              <p>© {new Date().getFullYear()} Olivra. All rights reserved.</p>
              <p className="max-w-xl italic md:text-right">{CONFIG.note}</p>
            </div>

            <p className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-white/60">
              <span>Designed by</span>
              <a
                href="https://www.instagram.com/nk_freaky/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-bold text-brand-yellow transition hover:opacity-80"
              >
                <Image
                  src={assets.images.instagram}
                  alt="Instagram"
                  width={16}
                  height={16}
                  className="h-4 w-4 object-contain brightness-0 invert"
                />
                <span>nk_freaky</span>
              </a>
            </p>
          </div>
        </div>
      </PopBackground>
    </footer>
  );
}
