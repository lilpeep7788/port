import { useEffect, useState } from 'react'

function useWarsawTime() {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Warsaw',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })
  const [time, setTime] = useState(() => formatter.format(new Date()))

  useEffect(() => {
    const timer = window.setInterval(() => setTime(formatter.format(new Date())), 1000)
    return () => window.clearInterval(timer)
  }, [])

  return time
}

export function ContactFooter() {
  const time = useWarsawTime()
  return (
    <footer className="contact-footer" id="contact" data-header-theme="dark">
      <div className="footer-content">
        <div className="footer-main" data-reveal>
          <span className="footer-label">( Get in touch )</span>
          <h2>Ready to create?<br />Let’s make it distinct.</h2>
          <p>I’m currently available for selected projects and collaborations.</p>
          <a className="contact-card" href="mailto:hello@degra.design">
            <img src="/assets/hero/portrait-elevator.png" alt="DEGRA creator" width="1086" height="1448" loading="lazy" />
            <span><strong>hello@degra.design</strong><small>+48 889 079 071</small></span>
            <i aria-hidden="true">↗</i>
          </a>
        </div>
        <div className="footer-aside">
          <div><span>{time}</span><strong>Remote from Poland</strong></div>
          <div className="socials">
            <span>Social media</span>
            <a href="https://dribbble.com" target="_blank" rel="noreferrer">↳&nbsp;&nbsp;Dribbble</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">↳&nbsp;&nbsp;LinkedIn</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">↳&nbsp;&nbsp;Instagram</a>
          </div>
        </div>
      </div>
      <div className="footer-wordmark" aria-hidden="true">DEGRA©</div>
      <div className="footer-bottom"><span>©2026 DEGRA®. All rights reserved.</span><span>Built with clarity. Designed to perform.</span></div>
    </footer>
  )
}
