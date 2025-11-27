// src/components/Footer.jsx
import React, { useState } from 'react';

export default function Footer({ darkMode = false }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const endpoint = 'https://formspree.io/f/mnngvrzk'; // your endpoint

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !msg) {
      setStatus('error');
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name, email, message: msg })
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setName(''); setEmail(''); setMsg('');
      } else {
        console.error('Formspree error', data);
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
    // auto-clear success message after a few seconds (optional)
    if (status === 'success') {
      setTimeout(() => setStatus('idle'), 4000);
    }
  }

  return (
    <footer className={`mt-8 border-t-2 p-8 shadow-lg transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-200'}`}>
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 items-start">
        <div className={`flex-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Built by Harihk</h3>
          <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>If you'd like to collaborate, report a bug or request a feature, send me a message — I usually respond within 48 hours.</p>
          <div className={`mt-4 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>© {new Date().getFullYear()} Hari Kiran — All rights reserved.</div>
        </div>

        <div className="w-full md:w-[420px]">
          <h4 className={`text-lg font-bold mb-3 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Contact</h4>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              aria-label="Name"
              placeholder="Your name (required)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`px-4 py-2.5 rounded-lg border-2 outline-none transition-all ${darkMode ? 'bg-gray-700 text-gray-100 border-gray-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 placeholder-gray-500' : 'bg-blue-50 text-gray-800 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-gray-500'}`}
            />
            <input
              type="email"
              aria-label="Email"
              placeholder="Email (required)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`px-4 py-2.5 rounded-lg border-2 outline-none transition-all ${darkMode ? 'bg-gray-700 text-gray-100 border-gray-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 placeholder-gray-500' : 'bg-blue-50 text-gray-800 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-gray-500'}`}
            />
            <textarea
              aria-label="Message"
              placeholder="Message (required)"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              required
              rows={4}
              className={`px-4 py-2.5 rounded-lg border-2 outline-none transition-all resize-none ${darkMode ? 'bg-gray-700 text-gray-100 border-gray-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 placeholder-gray-500' : 'bg-blue-50 text-gray-800 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-gray-500'}`}
            />
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={status === 'sending'}
                className={`px-5 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg disabled:opacity-60 transition-all ${darkMode ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white' : 'bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white'}`}
              >
                {status === 'sending' ? 'Sending…' : 'Send Message'}
              </button>

              {status === 'success' && <div className={`text-sm font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>Thanks — message sent.</div>}
              {status === 'error' && <div className={`text-sm font-medium ${darkMode ? 'text-red-400' : 'text-red-500'}`}>Failed to send. Try again.</div>}
            </div>

            <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Powered by Formspree</div>
          </form>
        </div>
      </div>
    </footer>
  );
}
