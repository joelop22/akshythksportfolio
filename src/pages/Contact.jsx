import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import SEO from '../components/SEO';

const WHATSAPP_NUMBER = '919946865923';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    subject: '',
    message: ''
  });
  
  const [status, setStatus] = useState('IDLE');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.mobile || !formData.message) {
      setStatus('ERROR');
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    if (!db) {
      setStatus('ERROR');
      setErrorMessage('Message sending is temporarily unavailable. Please reach out via the socials listed instead.');
      return;
    }

    setStatus('SENDING');
    try {
      await addDoc(collection(db, 'messages'), {
        ...formData,
        createdAt: serverTimestamp()
      });
      setStatus('SUCCESS');

      const whatsappText = [
        `Name: ${formData.name}`,
        formData.subject ? `Subject: ${formData.subject}` : null,
        `Message: ${formData.message}`
      ].filter(Boolean).join('\n');

      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappText)}`;

      setFormData({ name: '', email: '', mobile: '', subject: '', message: '' });

      window.location.href = whatsappUrl;
    } catch (error) {
      console.error("Error sending message to Firestore:", error);
      setStatus('ERROR');
      setErrorMessage('Could not send message. Please try again later or email me directly.');
    }
  };

  return (
    <>
      <SEO title="Contact" description="Get in touch with Akshythks ks for bookings, exhibitions, or licensing inquiries." />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-12 md:gap-20 items-start animate-fade-in">
        <div className="space-y-8 select-none">
          <div className="border-b border-neutral-200 pb-4">
            <h1 className="text-2xl md:text-3xl font-light tracking-tight text-neutral-900 font-display">
              Get in Touch
            </h1>
            <p className="text-xs text-neutral-400 mt-2 font-light tracking-widest uppercase">
              Inquiries & Commissions
            </p>
          </div>
          
          <div className="space-y-4 text-sm text-neutral-500 font-light leading-relaxed">
            <p>
              For bookings, collaborations, or licensing requests, please write a message using the form, or reach out directly through the channels below.
            </p>
          </div>

          <div className="space-y-2 pt-4">
            <span className="font-semibold text-neutral-800 uppercase tracking-widest text-[10px] block mb-2">Socials</span>
            <div className="flex flex-col space-y-2 text-xs font-light text-neutral-500">
              <a href="https://www.behance.net/akshythakshyth" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors w-max">
                Behance
              </a>
              <a href="https://www.instagram.com/akshythks?utm_source=qr&igsh=eWo5dDZpNWNtbXJ2" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors w-max">
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200/60 p-6 sm:p-10">
          <h2 className="text-[10px] font-bold tracking-[0.25em] text-neutral-400 uppercase mb-8 pb-2 border-b border-neutral-100">
            Send a Message
          </h2>

          {status === 'SUCCESS' ? (
            <div className="space-y-4 py-8 text-center animate-fade-in">
              <div className="w-10 h-10 border border-accent rounded-full flex items-center justify-center mx-auto">
                <span className="text-accent text-sm">&#10003;</span>
              </div>
              <h3 className="text-sm font-semibold tracking-wide text-neutral-800 uppercase">
                Message Sent
              </h3>
              <p className="text-xs text-neutral-500 font-light max-w-xs mx-auto leading-relaxed">
                Thank you for your message. Redirecting you to WhatsApp...
              </p>
              <button 
                onClick={() => setStatus('IDLE')}
                className="mt-4 text-[10px] font-bold tracking-widest uppercase text-accent hover:text-neutral-900 transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {status === 'ERROR' && (
                <div className="bg-red-50/50 border border-red-200 text-red-600 text-xs px-4 py-3 rounded-none font-light">
                  {errorMessage}
                </div>
              )}

              <div className="space-y-1">
                <label htmlFor="name" className="text-[9px] font-bold tracking-widest uppercase text-neutral-400">
                  Name <span className="text-accent">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  disabled={status === 'SENDING'}
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-neutral-200 focus:border-accent text-sm font-light text-neutral-800 outline-none py-2.5 transition-colors duration-300"
                  placeholder="Your name"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="email" className="text-[9px] font-bold tracking-widest uppercase text-neutral-400">
                  Email Address <span className="text-accent">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  disabled={status === 'SENDING'}
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-neutral-200 focus:border-accent text-sm font-light text-neutral-800 outline-none py-2.5 transition-colors duration-300"
                  placeholder="your.email@domain.com"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="mobile" className="text-[9px] font-bold tracking-widest uppercase text-neutral-400">
                  Mobile Number <span className="text-accent">*</span>
                </label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  required
                  disabled={status === 'SENDING'}
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-neutral-200 focus:border-accent text-sm font-light text-neutral-800 outline-none py-2.5 transition-colors duration-300"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="subject" className="text-[9px] font-bold tracking-widest uppercase text-neutral-400">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  disabled={status === 'SENDING'}
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-neutral-200 focus:border-accent text-sm font-light text-neutral-800 outline-none py-2.5 transition-colors duration-300"
                  placeholder="Inquiry topic"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="message" className="text-[9px] font-bold tracking-widest uppercase text-neutral-400">
                  Message <span className="text-accent">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  disabled={status === 'SENDING'}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-neutral-200 focus:border-accent text-sm font-light text-neutral-800 outline-none py-2.5 resize-none transition-colors duration-300"
                  placeholder="Write your message here..."
                />
              </div>

              <button
                type="submit"
                disabled={status === 'SENDING'}
                className="w-full text-center text-[10px] font-bold tracking-[0.2em] uppercase text-white bg-neutral-950 hover:bg-accent hover:border-accent transition-colors duration-300 py-4 border border-neutral-950 disabled:bg-neutral-300 disabled:border-neutral-300 cursor-pointer"
              >
                {status === 'SENDING' ? 'Sending Message...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
