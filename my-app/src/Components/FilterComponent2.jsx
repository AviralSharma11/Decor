import React, { useRef, useState ,useEffect } from "react";
import "../Styles/FilterComponent.css";

const FilterComponent2 = ({ filters, onFilterChange, isOpen, onClose , selectedFilters}) => {
  const [expandedFilters, setExpandedFilters] = useState({});
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const toggleFilter = (filterLabel) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filterLabel]: !prev[filterLabel],
    }));
  };

  return (
    <div className={`filter-modal ${isOpen ? "open" : ""}`}>
      <div className="filter-modal-content" ref={modalRef}>
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
                <span>{expandedFilters[filter.label] ? 'X' : '☰'}</span>
              </div>

              {expandedFilters[filter.label] && (
                <div className="filter-options">
                  {filter.options.map((option) => (
                    <div key={option} className="filter-option">
                      <input
                        type="checkbox"
                        id={`${filter.label}-${option}`}
                        checked={selectedFilters[filter.label]?.includes(option) || false}
                        onChange={(e) =>
                          onFilterChange(filter.label, option, e.target.checked)
                        }
                      />
                      <label htmlFor={`${filter.label}-${option}`} className="filter-name">{option}</label>
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
