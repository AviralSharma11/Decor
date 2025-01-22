import React, { useState } from 'react';
import "../Styles/FilterComponent.css";

const FilterComponent = ({ filters, onFilterChange }) => {
  const [expandedFilters, setExpandedFilters] = useState({}); // To track expanded/collapsed filters

  const toggleFilter = (filterLabel) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filterLabel]: !prev[filterLabel],
    }));
  };

  return (
    <div className="filter-component">
      {filters.map((filter) => (
        <div key={filter.label} className="filter-section">
          {/* Filter Header */}
          <div
            className="filter-header"
            onClick={() => toggleFilter(filter.label)}
            style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
          >
            <span>{filter.label}</span>
            <span>{expandedFilters[filter.label] ? '▲' : '▼'}</span>
          </div>

          {/* Filter Options */}
          {expandedFilters[filter.label] && (
            <div className="filter-options">
              {filter.options.map((option) => (
                <div key={option} className="filter-option">
                  <input
                    type="checkbox"
                    id={`${filter.label}-${option}`}
                    onChange={(e) =>
                      onFilterChange(filter.label, option, e.target.checked)
                    }
                  />
                  <label htmlFor={`${filter.label}-${option}`}>{option}</label>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FilterComponent;
