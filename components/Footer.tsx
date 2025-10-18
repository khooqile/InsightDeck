'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-black font-mono text-sm text-zinc-400 px-6 py-6">
      <div className="flex flex-col items-center justify-center space-y-1">
        {/* Navigation Links and Copyright */}
        <div className="flex items-center">
          <a 
            href="#" 
            className="transition-colors duration-300 hover:text-white"
          >
            Contact
          </a>
          <span className="mx-2 select-none">·</span>
          <a 
            href="#" 
            className="transition-colors duration-300 hover:text-white"
          >
            Privacy Policy
          </a>
          <span className="mx-2 select-none">·</span>
          <a 
            href="#" 
            className="transition-colors duration-300 hover:text-white"
          >
            Terms & Conditions
          </a>
          <span className="mx-2 select-none">·</span>
          <span>
            © {new Date().getFullYear()} InsightDeck
          </span>
        </div>
      </div>
    </footer>
  );
}
