import {
  HiOutlineCube,
  HiOutlineTag,
  HiOutlineTruck,
  HiOutlineChartBar,
} from 'react-icons/hi2';

const WAREHOUSE_IMG =
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80";

const SPIN_SECONDS = 55;

// Fixed points on the orbit ring; the spinning parent carries them around.
const ORBIT_ICONS = [
  { Icon: HiOutlineCube, top: '0%', left: '50%', label: 'Products' },
  { Icon: HiOutlineTag, top: '50%', left: '100%', label: 'Categories' },
  { Icon: HiOutlineTruck, top: '100%', left: '50%', label: 'Receiving' },
  { Icon: HiOutlineChartBar, top: '50%', left: '0%', label: 'Analytics' },
];

/**
 * Circular warehouse hero: the photo spins a full 360° on a loop,
 * a dashed orbit ring counter-rotates, and inventory icons orbit
 * the circle while counter-spinning at the same speed to stay upright.
 */
function HeroOrbit({ className = '' }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none relative aspect-square motion-reduce:[&_*]:!animate-none ${className}`}
    >
      {/* Soft conic glow behind everything */}
      <div
        className="absolute inset-[6%] rounded-full opacity-70 blur-2xl"
        style={{
          background:
            'conic-gradient(from 0deg, rgba(15,118,110,0.35), rgba(194,65,12,0.25), rgba(15,118,110,0.35))',
        }}
      />

      {/* Dashed orbit ring, counter-rotating */}
      <div
        className="absolute inset-0 rounded-full border-2 border-dashed border-accent/30"
        style={{ animation: `spin-reverse ${SPIN_SECONDS * 0.7}s linear infinite` }}
      />

      {/* Thin static accent ring */}
      <div className="absolute inset-[3%] rounded-full border border-accent-2/20" />

      {/* Rotating circular warehouse image (360° loop) */}
      <div className="absolute inset-[12%] overflow-hidden rounded-full shadow-lg ring-4 ring-white/20">
        <img
          src={WAREHOUSE_IMG}
          alt=""
          loading="lazy"
          className="size-full scale-150 object-cover"
          style={{ animation: `spin-slow ${SPIN_SECONDS}s linear infinite` }}
        />
        {/* Static brand tint above the spinning photo */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'linear-gradient(135deg, rgba(15,118,110,0.30), rgba(194,65,12,0.18))',
          }}
        />
      </div>

      {/* Orbiting icons: parent spins, each icon counter-spins to stay upright */}
      <div
        className="absolute inset-0"
        style={{ animation: `spin-slow ${SPIN_SECONDS}s linear infinite` }}
      >
        {ORBIT_ICONS.map(({ Icon, top, left, label }) => (
          <div
            key={label}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ top, left }}
          >
            <div style={{ animation: `spin-reverse ${SPIN_SECONDS}s linear infinite` }}>
              <span className="glass grid size-12 place-items-center rounded-full text-accent shadow-md max-[960px]:size-9">
                <Icon size={22} />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Floating stat chip */}
      <div
        className="absolute bottom-[4%] left-[2%]"
        style={{ animation: 'orbit-float 6s ease-in-out infinite' }}
      >
        <div className="glass flex items-center gap-2 rounded-full px-4 py-2 shadow-md">
          <span className="size-2 rounded-full bg-success" />
          <span className="text-[0.78rem] font-bold whitespace-nowrap">
            Live stock tracking
          </span>
        </div>
      </div>
    </div>
  );
}

export default HeroOrbit;
