import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { getFeaturedCollections } from '../../api/collectionApi';
import CollectionCard from '../common/CollectionCard';
import { CollectionSkeleton } from '../common/SkeletonLoader';
import EmptyState from '../common/EmptyState';
import './FeaturedSection.css';

const FeaturedSection = ({ onEnquireClick }) => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const res = await getFeaturedCollections(8);
        setCollections(res.data || []);
      } catch (err) {
        console.error('Error fetching featured collections:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section className="featured-section section-padding">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">CURATED MASTERPIECES</span>
          <h2 className="section-title">Featured Sculptures</h2>
          <p className="section-desc">
            Handcrafted with devotion and supreme precision. Explore our highlighted temple and sanctum marble idols.
          </p>
        </div>

        {loading ? (
          <div className="collections-grid">
            <CollectionSkeleton />
            <CollectionSkeleton />
            <CollectionSkeleton />
            <CollectionSkeleton />
          </div>
        ) : collections.length > 0 ? (
          <>
            <div className="collections-grid">
              {collections.map((col) => (
                <CollectionCard key={col._id} collection={col} onEnquireClick={onEnquireClick} />
              ))}
            </div>
            <div className="featured-bottom-action">
              <Link to="/collections" className="btn btn-secondary">
                <span>View Full Collection Catalog</span>
                <FiArrowRight />
              </Link>
            </div>
          </>
        ) : (
          <EmptyState
            title="No featured sculptures currently marked"
            description="Our newest collection idols are being curated. Browse the complete catalog or contact us for custom designs."
          />
        )}
      </div>
    </section>
  );
};

export default FeaturedSection;
