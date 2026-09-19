import React from 'react';
import { 
  IconFilm, 
  IconZap, 
  IconShield, 
  IconSmartphone, 
  IconSparkles, 
  IconVideo 
} from './Icons';

export function FeaturesSection() {
  const features = [
    {
      icon: <IconFilm className="w-6 h-6 text-rose-600" />,
      title: 'Full 1080p HD Preservation',
      description:
        'Download at the highest broadcast bitrate available directly from ARY Plus content servers without downscaling or compression artifacts.',
      tag: 'True Quality',
    },
    {
      icon: <IconZap className="w-6 h-6 text-amber-600" />,
      title: 'Lightning Fast Stream Remuxing',
      description:
        'Our server-side FFmpeg pipeline rapidly stitches HLS segments into a pristine MP4 container with zero quality degradation and maximum speed.',
      tag: 'High Speed',
    },
    {
      icon: <IconSmartphone className="w-6 h-6 text-blue-600" />,
      title: 'Universal MP4 Compatibility',
      description:
        'Exported MP4 files play seamlessly across iOS, Android, macOS, Windows, Linux, smart TVs, and popular media players like VLC.',
      tag: 'Any Device',
    },
    {
      icon: <IconShield className="w-6 h-6 text-emerald-600" />,
      title: 'Safe, Clean & Private',
      description:
        'No malicious redirects, zero popups, and no intrusive trackers. Your download requests are processed with strict privacy and speed.',
      tag: '100% Safe',
    },
    {
      icon: <IconSparkles className="w-6 h-6 text-purple-600" />,
      title: 'No Registration Required',
      description:
        'Enjoy instant access without creating an account or providing email addresses. Simply paste your URL and start downloading immediately.',
      tag: 'No Friction',
    },
    {
      icon: <IconVideo className="w-6 h-6 text-indigo-600" />,
      title: 'All Public ARY Plus Shows',
      description:
        'Full support for all publicly accessible ARY Plus video-on-demand content, including popular drama serials, morning shows, and news broadcasts.',
      tag: 'Comprehensive',
    },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold mb-4 uppercase tracking-wider border border-rose-200/60">
            Why Use This Tool
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Engineered for Speed, Quality & Simplicity
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Everything you need to enjoy your favorite ARY Plus programming offline, anytime, anywhere.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-slate-50/70 hover:bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                    {feature.icon}
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 bg-white px-2.5 py-1 rounded-full border border-slate-200 shadow-2xs">
                    {feature.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2.5 group-hover:text-rose-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
