import React from 'react';
import { IconCopy, IconLayers, IconDownload, IconSmartphone } from './Icons';

export function GuideSection() {
  const steps = [
    {
      number: '01',
      title: 'Copy the Video URL',
      description:
        'Open aryplus.tv in your web browser or app. Navigate to the episode, drama, or bulletin you want to download, and copy the full URL from the browser address bar.',
      icon: <IconCopy className="w-6 h-6 text-rose-600" />,
      accentColor: 'from-rose-500/10 to-red-500/10',
      borderColor: 'border-rose-200',
      badgeColor: 'bg-rose-100 text-rose-700',
      example: 'https://aryplus.tv/video/...',
    },
    {
      number: '02',
      title: 'Analyze & Choose Quality',
      description:
        'Paste the copied link into the input box at the top and hit "Analyze Video". Within seconds, our engine detects all available resolutions (1080p FHD, 720p HD, 480p SD).',
      icon: <IconLayers className="w-6 h-6 text-amber-600" />,
      accentColor: 'from-amber-500/10 to-orange-500/10',
      borderColor: 'border-amber-200',
      badgeColor: 'bg-amber-100 text-amber-700',
      example: 'Full HD 1080p, 720p, 480p',
    },
    {
      number: '03',
      title: 'Remux & Download MP4',
      description:
        'Select your preferred quality and click "Start MP4 Download". Once our fast engine remuxes the audio and video, hit "Save MP4" to store it directly on your phone, tablet, or PC.',
      icon: <IconDownload className="w-6 h-6 text-emerald-600" />,
      accentColor: 'from-emerald-500/10 to-teal-500/10',
      borderColor: 'border-emerald-200',
      badgeColor: 'bg-emerald-100 text-emerald-700',
      example: 'Ready for offline playback',
    },
  ];

  return (
    <section id="guide" className="py-20 bg-slate-50/70 border-t border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/80 text-slate-700 text-xs font-semibold mb-4 uppercase tracking-wider">
            Step-by-Step Walkthrough
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Complete Guide to Downloading
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Download your beloved ARY Plus episodes in three effortless steps without installing any extensions or software.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between group"
            >
              <div>
                {/* Step Number & Icon Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {step.icon}
                  </div>
                  <span className={`text-xs font-black px-3 py-1 rounded-full ${step.badgeColor}`}>
                    STEP {step.number}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-rose-600 transition-colors">
                  {step.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {step.description}
                </p>
              </div>

              {/* Visual Example Tag */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-mono text-slate-500 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200/60">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                <span className="truncate">{step.example}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tips & Tricks Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0 mt-0.5">
                <IconSmartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base mb-1">
                  Works seamlessly across Mobile & Desktop
                </h4>
                <p className="text-slate-600 text-sm max-w-2xl">
                  Whether you are using an iPhone, Android smartphone, iPad, Mac, or Windows PC, the downloaded MP4 files play natively in any media player (VLC, QuickTime, MX Player, or default gallery).
                </p>
              </div>
            </div>

            <a
              href="#downloader"
              className="inline-flex items-center gap-2 text-sm font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/70 px-4 py-2.5 rounded-xl border border-rose-200/70 transition-colors shrink-0"
            >
              <span>Try it right now</span>
              <span>&rarr;</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
