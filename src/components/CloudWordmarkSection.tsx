export function CloudWordmarkSection() {
  return (
    <section className="cloud-section" aria-label="DEGRA wordmark" data-header-theme="dark">
      <svg className="cloud-wordmark" viewBox="0 0 1800 420" role="img" aria-label="DEGRA copyright">
        <defs>
          <linearGradient id="cloud-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1c1514" />
            <stop offset="22%" stopColor="#e79568" />
            <stop offset="44%" stopColor="#f4c6a1" />
            <stop offset="64%" stopColor="#db4c53" />
            <stop offset="82%" stopColor="#79434f" />
            <stop offset="100%" stopColor="#1c1a1d" />
            <animate attributeName="x1" values="0;0.45;0" dur="18s" repeatCount="indefinite" />
            <animate attributeName="y2" values="1;0.55;1" dur="22s" repeatCount="indefinite" />
          </linearGradient>
          <filter id="cloud-texture" x="-10%" y="-30%" width="120%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.007 0.026" numOctaves="3" seed="7" result="noise">
              <animate attributeName="baseFrequency" values="0.007 0.026;0.012 0.018;0.007 0.026" dur="19s" repeatCount="indefinite" />
            </feTurbulence>
            <feColorMatrix in="noise" type="saturate" values="0" result="mono" />
            <feComposite in="mono" in2="SourceAlpha" operator="in" result="clippedNoise" />
            <feBlend in="SourceGraphic" in2="clippedNoise" mode="soft-light" />
          </filter>
        </defs>
        <text x="16" y="330" fill="url(#cloud-gradient)" filter="url(#cloud-texture)">DEGRA©</text>
      </svg>
    </section>
  )
}
