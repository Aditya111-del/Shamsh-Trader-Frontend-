import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function ReportDetail() {
  const { type } = useParams();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { data } = await api.get(`/featured-posts/${type}`);
        setReport(data);
      } catch (error) {
        console.error('Failed to fetch report:', error);
      } finally {
        setLoading(false);
      }
    };
    if (type) fetchReport();
  }, [type]);

  if (loading) {
    return <div className="pt-32 pb-24 container mx-auto px-6 max-w-4xl text-white/50 text-center">Loading report...</div>;
  }

  if (!report) {
    return <div className="pt-32 pb-24 container mx-auto px-6 max-w-4xl text-white text-center">Report not found.</div>;
  }

  return (
    <div className="w-full bg-[#0a0a0a] min-h-screen">
      {/* FULL WIDTH BANNER */}
      <div className="relative w-full h-[50vh] md:h-[65vh]">
        <img 
          src={report.image || '/images/research-2.jpg'} 
          alt={report.title} 
          className="w-full h-full object-cover filter brightness-75" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/30" />
        
        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
          <div className="max-w-4xl mx-auto">
            <Link to="/blog" className="inline-flex items-center gap-2 text-zinc-300 hover:text-white transition-colors mb-6 backdrop-blur-md bg-black/20 px-4 py-2 rounded-full border border-white/10 text-sm font-medium">
              <ArrowLeft className="w-4 h-4" /> Back to Journal
            </Link>
            <div className="text-green-500 font-bold uppercase tracking-widest text-sm mb-4">
              {report.type === 'WEEKLY' ? 'Weekly Report' : 'Featured Report'}
              {report.category ? ` · ${report.category}` : ''}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight tracking-tight">
              {report.title}
            </h1>
            <p className="text-xl md:text-2xl text-white/70 font-light max-w-3xl">
              {report.excerpt}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-4xl py-12 md:py-20">
        <div className="flex items-center gap-6 text-zinc-400 border-b border-white/10 pb-8 mb-12">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{report.dateText}</span>
          </div>
          <div className="flex items-center gap-2 text-green-500">
            <span>{report.readTime}</span>
          </div>
        </div>

        <div 
          className="prose prose-invert prose-lg max-w-none prose-p:leading-relaxed prose-headings:text-white prose-a:text-green-400 hover:prose-a:text-green-300 prose-img:rounded-2xl"
          dangerouslySetInnerHTML={{ __html: report.content || '<p>No additional content provided.</p>' }}
        />
      </div>
    </div>
  );
}
