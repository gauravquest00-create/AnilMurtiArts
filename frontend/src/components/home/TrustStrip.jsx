import React from 'react';
import { FiAward, FiGlobe, FiTruck, FiHeadphones } from 'react-icons/fi';
import './TrustStrip.css';

const TrustStrip = () => {
  const items = [
    {
      icon: FiAward,
      title: 'Generations of Heritage',
      desc: 'Direct sculptors from Jaipur’s revered Moorti Mohalla artistry lineage.'
    },
    {
      icon: FiGlobe,
      title: 'Sacred Temple Consecrations',
      desc: 'Idols installed in 500+ major temples and private sanctums globally.'
    },
    {
      icon: FiTruck,
      title: 'Wooden Crate Transit',
      desc: 'Multi-layer padded export packaging with zero transit damage guarantee.'
    },
    {
      icon: FiHeadphones,
      title: 'Bespoke Consultation',
      desc: 'Direct consultation with master sculptors for custom iconographies.'
    }
  ];

  return (
    <section className="trust-strip-section">
      <div className="container trust-strip-container">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="trust-item">
              <div className="trust-icon-box">
                <Icon className="trust-icon" />
              </div>
              <div className="trust-text">
                <h4 className="trust-title">{item.title}</h4>
                <p className="trust-desc">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TrustStrip;
