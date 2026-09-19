'use client';

import React from 'react';
import { IconPlay, IconSparkles } from './Icons';

interface NavbarProps {
  onPasteClick?: () => void;
}

export function Navbar({ onPasteClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 border-b border-slate-200/80 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#downloader" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-red-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform shrink-0">
            <IconPlay className="w-4 h-4 sm:w-5 sm:h-5 fill-white text-white ml-0.5" size={18} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight whitespace-nowrap">
                ARY Plus
              </span>
              <span className="text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200/60 uppercase tracking-wide whitespace-nowrap">
                Downloader
              </span>
            </div>
            <p className="hidden sm:block text-[11px] text-slate-400 font-medium -mt-0.5 whitespace-nowrap">
              High-Definition MP4 Grabber
            </p>
          </div>
        </a>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#downloader" className="hover:text-rose-600 transition-colors">
            Downloader
          </a>
          <a href="#guide" className="hover:text-rose-600 transition-colors">
            How to Download
          </a>
          <a href="#features" className="hover:text-rose-600 transition-colors">
            Features
          </a>
          <a href="#faq" className="hover:text-rose-600 transition-colors">
            FAQs
          </a>
        </nav>

        {/* Action Button & Status */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Engine Online</span>
          </div>

          <a
            href="#downloader"
            onClick={() => {
              if (onPasteClick) {
                onPasteClick();
              }
            }}
            className="inline-flex items-center gap-1.5 sm:gap-2 bg-slate-900 hover:bg-rose-600 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow-md hover:shadow-rose-600/20 whitespace-nowrap shrink-0"
          >
            <IconSparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" size={14} />
            <span>Download Now</span>
          </a>
        </div>
      </div>
    </header>
  );
}
