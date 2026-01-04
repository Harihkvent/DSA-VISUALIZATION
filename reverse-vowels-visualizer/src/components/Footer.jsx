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
    <footer className={`mt-6 border-t p-6 md:p-8 transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-start">
        <div className={`flex-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Built by Harihk</h3>
          <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>If you'd like to collaborate, report a bug or request a feature, send me a message — I usually respond within 48 hours.</p>
          <div className={`mt-3 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>© {new Date().getFullYear()} Hari Kiran — All rights reserved.</div>
        </div>

        <div className="w-full md:w-[400px]">
          <h4 className={`text-base font-bold mb-3 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Contact</h4>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
            <input
              type="text"
              aria-label="Name"
              placeholder="Your name (required)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`px-3 py-2 rounded-lg border outline-none transition-all text-sm ${darkMode ? 'bg-gray-700 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder-gray-400' : 'bg-gray-50 text-gray-800 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder-gray-400'}`}
            />
            <input
              type="email"
              aria-label="Email"
              placeholder="Email (required)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`px-3 py-2 rounded-lg border outline-none transition-all text-sm ${darkMode ? 'bg-gray-700 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder-gray-400' : 'bg-gray-50 text-gray-800 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder-gray-400'}`}
            />
            <textarea
              aria-label="Message"
              placeholder="Message (required)"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              required
              rows={3}
              className={`px-3 py-2 rounded-lg border outline-none transition-all resize-none text-sm ${darkMode ? 'bg-gray-700 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder-gray-400' : 'bg-gray-50 text-gray-800 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder-gray-400'}`}
            />
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={status === 'sending'}
                className={`px-4 py-2 rounded-lg font-semibold shadow-sm hover:shadow-md disabled:opacity-60 transition-all text-sm text-white ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {status === 'sending' ? 'Sending…' : 'Send Message'}
              </button>

              {status === 'success' && <div className={`text-xs font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>Thanks — message sent.</div>}
              {status === 'error' && <div className={`text-xs font-medium ${darkMode ? 'text-red-400' : 'text-red-500'}`}>Failed to send. Try again.</div>}
            </div>

            <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Powered by Formspree</div>
          </form>
        </div>
      </div>
    </footer>
  );
}
