const meta = [
  { icon: '◷', label: 'Availability', value: 'Open for new projects' },
  { icon: '⌘', label: 'Specialties', value: 'Web · App · Bot · Design' },
  { icon: '◎', label: 'Remote / Global', value: 'Working worldwide' },
]

export function HeroSection() {
  return (
    <section className="hero" data-header-theme="light">
      <div className="hero-copy">
        <h1 className="hero-title" aria-label="I design and build digital experiences across web, apps, bots, and brands.">
          {['I design and build digital', 'experiences across web,', 'apps, bots, and brands.'].map((line) => (
            <span className="title-line" key={line}><span>{line}</span></span>
          ))}
        </h1>
        <p className="hero-intro">
          A multidisciplinary creator focused on clarity, performance,<br />
          and thoughtful user experience.
        </p>
        <div className="hero-meta">
          {meta.map((item, index) => (
            <div className="meta-item" key={item.label} style={{ '--delay': `${0.52 + index * 0.09}s` } as React.CSSProperties}>
              <div className="meta-label"><span aria-hidden="true">{item.icon}</span>{item.label}</div>
              <div className="meta-value">{item.value}</div>
            </div>
          ))}
        </div>
        <div className="hero-rule" />
        <div className="hero-wordmark" aria-hidden="true">DEGRA©</div>
      </div>
      <figure className="hero-portrait-wrap">
        <img
          className="hero-portrait"
          src="/assets/hero/portrait-elevator.png"
          alt="DEGRA creator taking a mirror portrait in a red-framed elevator"
          width="1086"
          height="1448"
          fetchPriority="high"
        />
      </figure>
    </section>
  )
}
