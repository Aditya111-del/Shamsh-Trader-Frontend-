import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Clock } from 'lucide-react';

export default function EventDetail() {
  const { id: _id } = useParams();

  // In a real app, fetch event data using `id`
  const event = {
    title: 'Advanced Trading Masterclass',
    date: 'August 15, 2026',
    time: '18:00 UTC',
    location: 'Online Event',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2000',
    description: 'Join us for an exclusive masterclass on advanced trading strategies, market psychology, and portfolio risk management.',
  };

  return (
    <div className="pt-32 pb-24 container mx-auto px-6 max-w-5xl">
      <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="relative w-full h-[400px] rounded-3xl overflow-hidden mb-8 border border-white/10">
            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-6 leading-tight">{event.title}</h1>
          <p className="text-zinc-300 text-lg leading-relaxed">{event.description}</p>
        </div>

        <div>
          <div className="premium-glass p-8 rounded-3xl border border-white/5 sticky top-32">
            <h3 className="text-xl font-bold text-white mb-6">Event Details</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Date</div>
                  <div className="text-zinc-400">{event.date}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Time</div>
                  <div className="text-zinc-400">{event.time}</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Location</div>
                  <div className="text-zinc-400">{event.location}</div>
                </div>
              </div>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl mt-8 transition-colors">
              Register for Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
