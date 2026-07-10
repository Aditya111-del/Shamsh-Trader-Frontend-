import FeedHero from '../sections/feed/FeedHero';
import PlatformStats from '../sections/feed/PlatformStats';
import LatestPosts from '../sections/feed/LatestPosts';
import TelegramCta from '../sections/feed/TelegramCta';

export default function Social() {
  return (
    <div className="relative w-full overflow-hidden" style={{ background: '#0a0a0a' }}>
      <FeedHero />
      <PlatformStats />
      <LatestPosts />
      <TelegramCta />
    </div>
  );
}
