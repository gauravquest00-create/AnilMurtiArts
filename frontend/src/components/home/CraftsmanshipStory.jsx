import React from 'react';
import { FiCheck } from 'react-icons/fi';
import './CraftsmanshipStory.css';

const CraftsmanshipStory = () => {
  const steps = [
    {
      num: '01',
      title: 'Quarry Selection',
      desc: 'Sourcing single-block flawless Makrana A-Grade white marble with zero internal fault lines.'
    },
    {
      num: '02',
      title: 'Vedic Proportions (Shilpa Shastra)',
      desc: 'Drafting sacred anatomical dimensions strictly conforming to ancient Shilpa Shastra scriptures.'
    },
    {
      num: '03',
      title: 'Hand Chiseled Artistry',
      desc: 'Hundreds of hours of hand carving bringing life-like expressions, delicate ornamentation, and spiritual serenity.'
    },
    {
      num: '04',
      title: '24K Gold & Natural Colors',
      desc: 'Applying authentic 24 Karat gold leaf embossing and everlasting natural mineral stone pigments.'
    }
  ];

  return (
    <section className="craftsmanship-section section-padding">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">THE MAESTRO PROCESS</span>
          <h2 className="section-title">Generational Mastery in Stone</h2>
          <p className="section-desc">
            Every idol is not merely a statue, but a sanctified piece of living devotion sculpted through meticulous traditional discipline.
          </p>
        </div>

        <div className="craftsmanship-steps-grid">
          {steps.map((step) => (
            <div key={step.num} className="step-card">
              <div className="step-number">{step.num}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CraftsmanshipStory;
