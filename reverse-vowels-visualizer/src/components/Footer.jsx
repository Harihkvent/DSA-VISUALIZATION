// src/components/Footer.jsx
import React, { useState } from 'react';

export default function Footer() {
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
    <footer className="mt-8 bg-neutral-900/70 border-t border-white/6 p-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-1 text-white/90">
          <h3 className="text-xl font-semibold mb-1">Built by You</h3>
          <p className="text-sm text-white/70">If you'd like to collaborate, report a bug or request a feature, send me a message — I usually respond within 48 hours.</p>
          <div className="mt-4 text-xs text-white/60">© {new Date().getFullYear()} Your Name — All rights reserved.</div>
        </div>

        <div className="w-full md:w-[420px]">
          <h4 className="text-lg font-medium text-white mb-2">Contact</h4>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              aria-label="Name"
              placeholder="Your name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-3 py-2 rounded-md bg-neutral-800 text-white border border-white/6"
            />
            <input
              type="email"
              aria-label="Email"
              placeholder="Email (required)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-3 py-2 rounded-md bg-neutral-800 text-white border border-white/6"
            />
            <textarea
              aria-label="Message"
              placeholder="Message (required)"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              required
              rows={4}
              className="px-3 py-2 rounded-md bg-neutral-800 text-white border border-white/6"
            />
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={status === 'sending'}
                className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
              >
                {status === 'sending' ? 'Sending…' : 'Send Message'}
              </button>

              {status === 'success' && <div className="text-sm text-green-400">Thanks — message sent.</div>}
              {status === 'error' && <div className="text-sm text-rose-400">Failed to send. Try again.</div>}
            </div>

            <div className="text-xs text-white/60">Powered by Formspree</div>
          </form>
        </div>
      </div>
    </footer>
  );
}
