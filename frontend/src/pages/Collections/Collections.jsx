import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FiFilter,
  FiSearch,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiCheck,
  FiRotateCcw
} from 'react-icons/fi';
import { getCollections } from '../../api/collectionApi';
import { getCategories } from '../../api/categoryApi';
import CollectionCard from '../../components/common/CollectionCard';
import { CollectionSkeleton } from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import EnquiryModal from '../../components/common/EnquiryModal';
import './Collections.css';

const Collections = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [collections, setCollections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  // Filter states initialized from URL params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('categorySlug') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '');
  const [selectedSort, setSelectedSort] = useState(searchParams.get('sort') || 'newest');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page'), 10) || 1);

  // Mobile Filter Drawer state
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Inquiry Modal state
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Count active filters (excluding default search)
  const activeFiltersCount =
    (selectedCategory ? 1 : 0) +
    (selectedType ? 1 : 0) +
    (selectedSort !== 'newest' ? 1 : 0) +
    (search.trim() ? 1 : 0);

  // Lock body scroll when mobile filter drawer is open
  useEffect(() => {
    if (filterDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [filterDrawerOpen]);

  // Fetch categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data || []);
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    };
    fetchCats();
  }, []);

  // Fetch collections when filters change
  useEffect(() => {
    const fetchFilteredCollections = async () => {
      try {
        setLoading(true);
        const params = {
          page: currentPage,
          limit: 12,
          sort: selectedSort
        };

        if (search.trim()) params.search = search.trim();
        if (selectedCategory) params.categorySlug = selectedCategory;
        if (selectedType) params.type = selectedType;

        const res = await getCollections(params);
        setCollections(res.data || []);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      } catch (err) {
        console.error('Error fetching collections:', err);
        setCollections([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredCollections();

    // Sync URL params
    const newParams = {};
    if (search.trim()) newParams.search = search.trim();
    if (selectedCategory) newParams.categorySlug = selectedCategory;
    if (selectedType) newParams.type = selectedType;
    if (selectedSort !== 'newest') newParams.sort = selectedSort;
    if (currentPage > 1) newParams.page = currentPage.toString();
    setSearchParams(newParams, { replace: true });
  }, [search, selectedCategory, selectedType, selectedSort, currentPage]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedType('');
    setSelectedSort('newest');
    setCurrentPage(1);
    setFilterDrawerOpen(false);
  };

  const handleEnquire = (collection) => {
    setSelectedCollection(collection);
    setIsModalOpen(true);
  };

  return (
    <div className="collections-page">
      {/* Compact Header Banner */}
      <div className="collections-hero-banner">
        <div className="container">
          <span className="collections-hero-sub">MASTER MARBLE CATALOG</span>
          <h1 className="collections-hero-title">Sacred Murti Collections</h1>
          <p className="collections-hero-desc">
            Authentic Makrana white marble sculptures carved by Jaipur master artisans.
          </p>
        </div>
      </div>

      {/* MOBILE STICKY SEARCH & FILTER BAR */}
      <div className="mobile-sticky-filter-bar">
        <div className="container mobile-sticky-inner">
          <div className="mobile-search-box">
            <FiSearch className="mobile-search-icon" />
            <input
              type="text"
              placeholder="Search deity or sculpture..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setCurrentPage(1);
                }}
                className="mobile-search-clear-btn"
                aria-label="Clear search"
              >
                <FiX />
              </button>
            )}
          </div>

          <button
            type="button"
            className={`mobile-filter-trigger-btn ${activeFiltersCount > 0 ? 'active' : ''}`}
            onClick={() => setFilterDrawerOpen(true)}
            aria-label="Open filter options"
          >
            <FiFilter className="filter-icon" />
            <span className="filter-btn-text">Filter</span>
            {activeFiltersCount > 0 && (
              <span className="filter-badge-count">{activeFiltersCount}</span>
            )}
          </button>
        </div>
      </div>

      <div className="container collections-main-layout">
        {/* DESKTOP FILTER CONTROLS BAR */}
        <div className="desktop-filter-controls-bar">
          {/* Search Box */}
          <div className="filter-search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by deity or material..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setCurrentPage(1);
                }}
                className="clear-input-icon"
              >
                <FiX />
              </button>
            )}
          </div>

          {/* Desktop Select Dropdowns */}
          <div className="filter-select-group">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="filter-select"
              aria-label="Filter by Category"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.slug}>
                  {cat.name} ({cat.collectionCount || 0})
                </option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setCurrentPage(1);
              }}
              className="filter-select"
              aria-label="Filter by Type"
            >
              <option value="">All Types (Regular & Premium)</option>
              <option value="premium">Royal Premium Only</option>
              <option value="regular">Regular Collection</option>
            </select>

            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="filter-select"
              aria-label="Sort Collections"
            >
              <option value="newest">Sort: Newest Additions</option>
              <option value="name-asc">Alphabetical: A to Z</option>
              <option value="name-desc">Alphabetical: Z to A</option>
              <option value="popular">Most Inquired / Popular</option>
            </select>
          </div>
        </div>

        {/* Results Metadata Bar */}
        <div className="results-count-bar">
          <span className="count-text">
            Showing <strong>{collections.length}</strong> of <strong>{pagination.total || 0}</strong> artworks
          </span>
          {activeFiltersCount > 0 && (
            <button onClick={handleResetFilters} className="clear-filter-btn">
              <FiRotateCcw />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Grid or Empty / Loading State */}
        {loading ? (
          <div className="collections-grid">
            {Array.from({ length: 8 }).map((_, idx) => (
              <CollectionSkeleton key={idx} />
            ))}
          </div>
        ) : collections.length > 0 ? (
          <>
            <div className="collections-grid">
              {collections.map((col) => (
                <CollectionCard key={col._id} collection={col} onEnquireClick={handleEnquire} />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="pagination-bar">
                <button
                  className="page-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  aria-label="Previous Page"
                >
                  <FiChevronLeft />
                  <span>Previous</span>
                </button>

                <span className="page-indicator">
                  Page {currentPage} of {pagination.totalPages}
                </span>

                <button
                  className="page-btn"
                  disabled={currentPage >= pagination.totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                  aria-label="Next Page"
                >
                  <span>Next</span>
                  <FiChevronRight />
                </button>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            title="No collections available yet."
            description={
              activeFiltersCount > 0
                ? "No artworks found matching your criteria. Try adjusting or resetting your filters."
                : "Our artisans are actively sculpting and updating the digital catalog. Contact our showroom directly for custom orders."
            }
            onAction={activeFiltersCount > 0 ? handleResetFilters : null}
            actionLabel="Reset Search & Filters"
          />
        )}
      </div>

      {/* MOBILE SLIDE-OVER FILTER DRAWER PANEL */}
      <div
        className={`filter-drawer-overlay ${filterDrawerOpen ? 'drawer-active' : ''}`}
        onClick={() => setFilterDrawerOpen(false)}
      >
        <div
          className={`filter-drawer-panel ${filterDrawerOpen ? 'drawer-open' : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="filter-drawer-header">
            <div className="drawer-header-left">
              <FiFilter className="drawer-header-icon" />
              <h3>Filters & Refinements</h3>
            </div>
            <button
              className="drawer-close-btn"
              onClick={() => setFilterDrawerOpen(false)}
              aria-label="Close filters"
            >
              <FiX />
            </button>
          </div>

          <div className="filter-drawer-body">
            {/* Category Filter Section */}
            <div className="drawer-filter-group">
              <span className="drawer-group-title">Art Category</span>
              <div className="drawer-option-chips">
                <button
                  type="button"
                  className={`drawer-chip ${selectedCategory === '' ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedCategory('');
                    setCurrentPage(1);
                  }}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    type="button"
                    className={`drawer-chip ${selectedCategory === cat.slug ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedCategory(cat.slug);
                      setCurrentPage(1);
                    }}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Collection Type Section */}
            <div className="drawer-filter-group">
              <span className="drawer-group-title">Collection Tier</span>
              <div className="drawer-option-chips">
                <button
                  type="button"
                  className={`drawer-chip ${selectedType === '' ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedType('');
                    setCurrentPage(1);
                  }}
                >
                  All Collections
                </button>
                <button
                  type="button"
                  className={`drawer-chip chip-gold ${selectedType === 'premium' ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedType('premium');
                    setCurrentPage(1);
                  }}
                >
                  Royal Premium Tier
                </button>
                <button
                  type="button"
                  className={`drawer-chip ${selectedType === 'regular' ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedType('regular');
                    setCurrentPage(1);
                  }}
                >
                  Regular Collection
                </button>
              </div>
            </div>

            {/* Sort Options Section */}
            <div className="drawer-filter-group">
              <span className="drawer-group-title">Sort Order</span>
              <div className="drawer-option-chips">
                {[
                  { value: 'newest', label: 'Newest First' },
                  { value: 'name-asc', label: 'Alphabetical: A - Z' },
                  { value: 'name-desc', label: 'Alphabetical: Z - A' },
                  { value: 'popular', label: 'Most Inquired' }
                ].map((sortItem) => (
                  <button
                    key={sortItem.value}
                    type="button"
                    className={`drawer-chip ${selectedSort === sortItem.value ? 'selected' : ''}`}
                    onClick={() => setSelectedSort(sortItem.value)}
                  >
                    {sortItem.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="filter-drawer-footer">
            <button
              type="button"
              className="drawer-reset-btn"
              onClick={handleResetFilters}
            >
              Reset All
            </button>
            <button
              type="button"
              className="btn btn-primary drawer-apply-btn"
              onClick={() => setFilterDrawerOpen(false)}
            >
              <FiCheck />
              <span>Apply Filters ({pagination.total || collections.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Inquiry Modal - Always Viewport Centered via Portal */}
      <EnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        collection={selectedCollection}
      />
    </div>
  );
};

export default Collections;
