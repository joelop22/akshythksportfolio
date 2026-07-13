import React from 'react';
import SEO from '../components/SEO';
import ImageWrapper from '../components/ImageWrapper';

export default function About() {
  const skills = [
    'Fine Art Photography', 
    'Creative Direction', 
    'Visual Communication', 
    'Medium Format Film', 
    'Exhibition Curation', 
    'Archival Printing'
  ];

  return (
    <>
      <SEO title="About" description="Biography and skills of photographer and visual director Akshythks ks." />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-start animate-fade-in">
        {/* Headshot Column */}
        <div className="aspect-[4/5] max-w-xs sm:max-w-none mx-auto md:mx-0 w-full overflow-hidden bg-neutral-100 border border-neutral-200/50">
b583e07 (Update About page and profile image)
  src="/profile.jpg"
  alt="Akshythks ks portrait"
  className="w-full h-full"
  imgClassName="object-cover"
/>
        </div>

        {/* Content Column */}
        <div className="space-y-8 select-none">
          <div className="border-b border-neutral-200 pb-4">
            <h1 className="text-2xl md:text-3xl font-light tracking-tight text-neutral-900">
              Akshyth ks
            </h1>
            <p className="text-xs text-neutral-400 mt-2 font-light tracking-widest uppercase">
              Biography & Practice
            </p>
          </div>

          <div className="space-y-4 text-sm text-neutral-500 leading-relaxed font-light">
            <p>
              I am a professional photographer and visual director based in India. Leveraging the tactile colors of the Fujifilm XT-5 and the surgical precision of Lightroom, my work captures high-fashion editorials, intimate portraiture, and cinematic storytelling.
            </p>
            <p>
              My creative philosophy centers around high-contrast frames, color grading inspired by classic celluloid, and clean compositions that give every subject room to breathe.
            </p>
            <p>
              Through "5cs films" and my photographic practice, I translate fleeting moments into permanent visual narratives.
            </p>
          </div>

          {/* Skills Section */}
          <div className="space-y-4 pt-4">
            <h3 className="text-xs font-bold tracking-[0.2em] text-neutral-400 uppercase">
              Areas of Focus
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span 
                  key={skill}
                  className="text-[10px] tracking-widest uppercase bg-white border border-neutral-200/80 px-3.5 py-2 text-neutral-600 font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* CV Download Link */}
          <div className="pt-6">
            <a
              href="#resume"
              onClick={(e) => { 
                e.preventDefault(); 
                alert("Curriculum Vitae download triggered. (In your actual codebase, link this button directly to your static PDF file URL)."); 
              }}
              className="inline-block text-[10px] font-bold tracking-[0.2em] uppercase text-white bg-neutral-950 hover:bg-accent hover:border-accent transition-colors duration-300 px-6 py-3.5 border border-neutral-950"
            >
              Download CV / Resume
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
