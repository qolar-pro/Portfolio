/* Design-system entry for claude.ai/design.
   Re-exports only the components that render outside Next and outside the
   site's content tree. The other 23 in components/ are page sections bound to
   SiteContent and next/navigation; they would ship as cards nobody can place
   in a mockup. Not used by the app — see .design-sync/NOTES.md. */
export { HeroTitle } from '../components/HeroTitle';
export { Logo } from '../components/Logo';
export { Marquee } from '../components/Marquee';
export { ThemeToggle } from '../components/ThemeToggle';
export { Accordion } from '../components/Accordion';
