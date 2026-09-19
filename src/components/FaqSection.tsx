'use client';

import React, { useState } from 'react';
import { IconChevronDown, IconHelpCircle } from './Icons';

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'Is this ARY Plus video downloader completely free?',
      answer:
        'Yes, this service is 100% free to use. There are no subscriptions, no daily download limits, and no registration required. You can download as many accessible ARY Plus videos as you need for your personal offline viewing.',
    },
    {
      question: 'What video resolutions and formats are supported?',
      answer:
        'We support all resolutions broadcasted on ARY Plus, typically including 1080p Full HD, 720p HD, and 480p SD. All streams are packaged into universal MP4 containers with AAC stereo audio, ensuring they can be played back on any player or device.',
    },
    {
      question: 'Can I download videos on an iPhone, iPad, or Android phone?',
      answer:
        'Yes! Simply open this website in Safari, Chrome, or Samsung Internet on your mobile device, paste the ARY Plus video link, select your quality, and download. On iOS, videos save to your Files/Downloads folder; on Android, they appear in your Gallery and Downloads folder.',
    },
    {
      question: 'Why does the download process show a progress bar?',
      answer:
        'ARY Plus broadcasts video via HLS (HTTP Live Streaming) composed of hundreds of individual micro-segments. Our engine securely downloads these segments and remuxes them into a single, clean MP4 file. The progress bar displays real-time remux percentage, data size, and processing speed.',
    },
    {
      question: 'Where do the downloaded videos get saved?',
      answer:
        'Downloaded videos are automatically saved to your browser\'s default "Downloads" directory (e.g., Downloads on Windows/macOS or Files/Downloads on mobile). You can also right-click "Save MP4 to Device" and choose "Save Link As..." to pick a specific location.',
    },
    {
      question: 'Is it legal to download ARY Plus videos?',
      answer:
        'This tool is intended solely for personal, non-commercial offline playback and fair-use archiving of accessible public content. We encourage all users to support the creators and ARY Digital Network by watching directly on their official platform when online.',
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-slate-50/60 border-t border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/80 text-slate-700 text-xs font-semibold mb-4 uppercase tracking-wider">
            Got Questions?
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Find answers to common questions about downloading ARY Plus videos, audio formats, device compatibility, and more.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3.5">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-rose-300/80 shadow-md shadow-rose-900/5'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-base sm:text-lg text-slate-900 leading-snug">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? 'border-rose-200 bg-rose-50 text-rose-600 rotate-180'
                        : 'border-slate-200 bg-slate-50 text-slate-500'
                    }`}
                  >
                    <IconChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100 pt-4 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Box */}
        <div className="mt-12 text-center bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-slate-600 text-sm">
            <IconHelpCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>Have an issue with a specific episode link?</span>
            <a
              href="#downloader"
              className="text-rose-600 hover:text-rose-700 font-semibold underline underline-offset-4"
            >
              Paste your link in the downloader above &uarr;
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
