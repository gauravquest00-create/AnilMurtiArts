import React from 'react';
import { FiInbox, FiRefreshCw } from 'react-icons/fi';
import './EmptyState.css';

const EmptyState = ({
  icon: Icon = FiInbox,
  title = 'No collections available yet.',
  description = 'Our artisans are actively crafting sacred marble masterpieces. Please check back shortly or place a bespoke custom idol inquiry.',
  onAction,
  actionLabel = 'Reset Filters'
}) => {
  return (
    <div className="empty-state-wrapper">
      <div className="empty-state-icon-box">
        <Icon className="empty-state-icon" />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
      {onAction && (
        <button onClick={onAction} className="btn btn-secondary empty-state-btn">
          <FiRefreshCw />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;
