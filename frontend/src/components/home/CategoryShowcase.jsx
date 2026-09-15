import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { getCategories } from '../../api/categoryApi';
import { CategorySkeleton } from '../common/SkeletonLoader';
import './CategoryShowcase.css';

const CategoryShowcase = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        setLoading(true);
        const res = await getCategories();
        setCategories(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  if (!loading && categories.length === 0) {
    return null; // Keep clean if empty
  }

  return (
    <section className="category-showcase-section section-padding">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">SCULPTURE DOMAINS</span>
          <h2 className="section-title">Explore by Category</h2>
          <p className="section-desc">
            Browse through distinct genres of handcrafted marble art, from temple deity idols to bespoke figurative sculptures.
          </p>
        </div>

        {loading ? (
          <div className="categories-grid">
            <CategorySkeleton />
            <CategorySkeleton />
            <CategorySkeleton />
          </div>
        ) : (
          <div className="categories-grid">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/collections?categorySlug=${cat.slug}`}
                className="category-card-item"
              >
                <div className="category-card-media">
                  <img
                    src={cat.image?.url || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600'}
                    alt={cat.name}
                    className="category-card-img"
                  />
                  <div className="category-card-overlay"></div>
                </div>
                <div className="category-card-info">
                  <h3 className="category-name">{cat.name}</h3>
                  <p className="category-count">
                    {cat.collectionCount || 0} Artworks Available
                  </p>
                  <span className="category-link-text">
                    <span>View Artworks</span>
                    <FiArrowRight />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryShowcase;
