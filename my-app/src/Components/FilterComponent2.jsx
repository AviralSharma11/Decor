import React, { useState } from "react";
import "../Styles/FilterComponent.css";

const FilterComponent2 = ({ filters, onFilterChange, isOpen, onClose }) => {
  const [expandedFilters, setExpandedFilters] = useState({});

  const toggleFilter = (filterLabel) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filterLabel]: !prev[filterLabel],
    }));
  };

  return (
    <div className={`filter-modal ${isOpen ? "open" : ""}`}>
      <div className="filter-modal-content">
        <div className="filter-header">
          <h3>Filters</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="filter-body">
          {filters.map((filter) => (
            <div key={filter.label} className="filter-section">
              <div
                className="filter-header"
                onClick={() => toggleFilter(filter.label)}
                style={{ cursor: "pointer", display: "flex", justifyContent: "space-between" }}
              >
                <span>{filter.label}</span>
                <span>{expandedFilters[filter.label] ? "▲" : "▼"}</span>
              </div>

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
      </div>
    </div>
  );
};

export default FilterComponent2;
