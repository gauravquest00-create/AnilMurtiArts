import React from 'react';
import './SkeletonLoader.css';

export const CollectionSkeleton = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-media"></div>
      <div className="skeleton-body">
        <div className="skeleton skeleton-tag"></div>
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-spec"></div>
        <div className="skeleton skeleton-btn"></div>
      </div>
    </div>
  );
};

export const CategorySkeleton = () => {
  return (
    <div className="skeleton-cat-card">
      <div className="skeleton skeleton-cat-circle"></div>
      <div className="skeleton skeleton-cat-text"></div>
    </div>
  );
};

export const DetailSkeleton = () => {
  return (
    <div className="container detail-skeleton-layout">
      <div className="skeleton-gallery-col">
        <div className="skeleton skeleton-main-img"></div>
        <div className="skeleton-thumb-row">
          <div className="skeleton skeleton-thumb"></div>
          <div className="skeleton skeleton-thumb"></div>
          <div className="skeleton skeleton-thumb"></div>
        </div>
      </div>
      <div className="skeleton-info-col">
        <div className="skeleton skeleton-badge-sm"></div>
        <div className="skeleton skeleton-title-lg"></div>
        <div className="skeleton skeleton-spec-table"></div>
        <div className="skeleton skeleton-cta-box"></div>
      </div>
    </div>
  );
};
