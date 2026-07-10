import JournalHero from '../sections/journal/JournalHero';
import FeaturedReport from '../sections/journal/FeaturedReport';
import PostGrid from '../sections/journal/PostGrid';
import SubscribeBand from '../sections/journal/SubscribeBand';

export default function Blog() {
  return (
    <div className="relative w-full overflow-hidden" style={{ background: '#0a0a0a' }}>
      <JournalHero />
      <FeaturedReport />
      <PostGrid />
      <SubscribeBand />
    </div>
  );
}
