import React, { useState } from 'react';
import HeroBanner from '../../components/home/HeroBanner';
import FeaturedSection from '../../components/home/FeaturedSection';
import CategoryShowcase from '../../components/home/CategoryShowcase';
import CraftsmanshipStory from '../../components/home/CraftsmanshipStory';
import TrustStrip from '../../components/home/TrustStrip';
import EnquiryModal from '../../components/common/EnquiryModal';
import './Home.css';

const Home = () => {
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEnquireClick = (collection) => {
    setSelectedCollection(collection);
    setIsModalOpen(true);
  };

  return (
    <div className="home-page-wrapper">
      <HeroBanner />
      <FeaturedSection onEnquireClick={handleEnquireClick} />
      <CategoryShowcase />
      <CraftsmanshipStory />
      <TrustStrip />

      <EnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        collection={selectedCollection}
      />
    </div>
  );
};

export default Home;
