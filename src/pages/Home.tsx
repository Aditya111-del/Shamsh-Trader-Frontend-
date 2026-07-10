import Hero from '../sections/Hero';
import Partners from '../sections/Partners';
import About from '../sections/About';
import TradingEdge from '../sections/TradingEdge';
import EventGlimpses from '../sections/EventGlimpses';
import TrackRecord from '../sections/TrackRecord';
import CoursesCarousel from '../sections/CoursesCarousel';
import EventsSection from '../sections/EventsSection';
import Testimonials from '../sections/Testimonials';
import GeniePromo from '../sections/GeniePromo';
import SocialMedia from '../sections/SocialMedia';
import NewsletterSub from '../sections/NewsletterSub';

export default function Home() {
  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden">
      <Hero />
      <Partners />
      <About />
      <TradingEdge />
      <EventGlimpses />
      <TrackRecord />
      <CoursesCarousel />
      <EventsSection />
      <Testimonials />
      <GeniePromo />
      <SocialMedia />
      <NewsletterSub />
    </div>
  );
}
