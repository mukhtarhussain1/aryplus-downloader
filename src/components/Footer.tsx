import React from 'react';
import { IconPlay, IconShield } from './Icons';

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 text-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-red-600 flex items-center justify-center text-white shadow-sm">
                <IconPlay className="w-4 h-4 fill-white ml-0.5" />
              </div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">
                ARY Plus Downloader
              </span>
            </div>
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed mb-4">
              The premier online solution to save and enjoy ARY Plus dramas, entertainment shows, and news in 1080p Full HD MP4 format for offline viewing.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <IconShield className="w-4 h-4 text-emerald-600" />
              <span>Safe, fast & secure video processing</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-bold text-slate-900 mb-4 text-xs uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#downloader" className="hover:text-rose-600 transition-colors">
                  Video Downloader
                </a>
              </li>
              <li>
                <a href="#guide" className="hover:text-rose-600 transition-colors">
                  Download Guide
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-rose-600 transition-colors">
                  Key Features
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-rose-600 transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </div>

          {/* Supported Formats */}
          <div>
            <h4 className="font-bold text-slate-900 mb-4 text-xs uppercase tracking-wider">
              Supported Formats
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-500">
              <li>• 1080p Full HD MP4</li>
              <li>• 720p HD MP4</li>
              <li>• 480p / 360p Standard MP4</li>
              <li>• AAC Stereo 128kbps+</li>
              <li>• Compatible with iOS, Android, PC</li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 leading-relaxed mb-8">
          <strong className="text-slate-700 font-semibold block mb-1">Legal Disclaimer:</strong>
          ARY Plus Downloader is an independent utility and is not affiliated, associated, authorized, endorsed by, or in any way officially connected with ARY Digital Network, ARY Plus, or any of their subsidiaries or affiliates. All product and company names, trademarks, and logos remain the property of their respective holders. This tool is intended solely for personal, non-commercial offline archiving of publicly accessible broadcasts.
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} ARY Plus Downloader. All rights reserved.</p>
          <p className="flex items-center gap-1.5 font-medium text-slate-500">
            <span>Developed By <strong className="text-slate-800 font-semibold">Mukhtar Hussain</strong></span>
          </p>
        </div>
      </div>
    </footer>
  );
}
