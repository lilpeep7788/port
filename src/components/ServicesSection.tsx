const services = [
  'Website Design',
  'Brand Systems',
  'Framer Development',
  'Web Applications',
  'Telegram Bots',
  'Mobile Interfaces',
]

function DashboardMockup() {
  return (
    <div className="dashboard" aria-label="Minimal project dashboard preview">
      <div className="dashboard-toolbar">
        <span className="traffic-lights"><i /><i /><i /></span>
        <span>⌘</span><span>⌁</span><span>↗</span>
      </div>
      <div className="dashboard-shell">
        <aside>
          <b>D.</b>
          {['Home', 'Projects', 'Tasks', 'Messages', 'Clients', 'Analytics', 'Settings'].map((item, index) => (
            <span className={index === 0 ? 'active' : ''} key={item}>○&nbsp;&nbsp;{item}</span>
          ))}
        </aside>
        <main>
          <small>Overview</small>
          <h3>87%</h3>
          <div className="chart-line" />
          <small>Recent projects</small>
          <div className="dash-row"><b>Degra Studio</b><span>Website Design</span></div>
          <div className="dash-row"><b>Nova Branding</b><span>Brand System</span></div>
          <div className="dash-row"><b>Orbit Dashboard</b><span>Web Application</span></div>
        </main>
      </div>
    </div>
  )
}

export function ServicesSection() {
  return (
    <section className="services" id="about" data-header-theme="light">
      <div className="services-intro" data-reveal>
        <p>I partner with founders, brands, and agencies<br />to design and build digital experiences<br />that are thoughtful, functional, and built to scale.</p>
      </div>
      <div className="services-list-wrap" data-reveal>
        <span className="services-label">( Services &amp; Capabilities )</span>
        <ul className="services-list">
          {services.map((service) => <li key={service}>{service}</li>)}
        </ul>
      </div>
      <DashboardMockup />
    </section>
  )
}
