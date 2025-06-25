import { useState } from "react";
import "../Styles/SearchBar.css"; // Import the new CSS

const SearchBar = ({ products }) => {
  const [query, setQuery] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setFilteredSuggestions([]);
      setFilteredProducts([]);
      return;
    }

    const suggestions = products
      .flatMap((product) => product.tags)
      .filter((tag) => tag.toLowerCase().includes(value.toLowerCase()))
      .slice(0, 5);

    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(value.toLowerCase()) ||
        product.tags.some((tag) => tag.toLowerCase().includes(value.toLowerCase()))
    );

    setFilteredSuggestions(suggestions);
    setFilteredProducts(filtered);
  };

  const clearSearch = () => {
    setQuery("");
    setFilteredSuggestions([]);
    setFilteredProducts([]);
  };

  return (
    <div className="searchbar-container">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search..."
        className="searchbar-input"
      />
      {query && (
        <button onClick={clearSearch} className="searchbar-clear">
          ✕
        </button>
      )}

      {(filteredSuggestions.length > 0 || filteredProducts.length > 0) && (
        <div className="searchbar-dropdown">
          {filteredSuggestions.length > 0 && (
            <div className="dropdown-section">
              <div className="dropdown-title">SUGGESTIONS</div>
              {filteredSuggestions.map((suggestion, index) => (
                <div key={index} className="dropdown-item">
                  {suggestion}
                </div>
              ))}
            </div>
          )}

          {filteredProducts.length > 0 && (
            <div className="dropdown-section">
              <div className="dropdown-title">PRODUCTS</div>
              {filteredProducts.map((product) => (
                <div key={product.id} className="dropdown-item product-item">
                  <img src={product.image} alt={product.name} className="product-image" />
                  <div>
                    <div className="product-name">{product.name}</div>
                    <div className="product-price">₹{product.price}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
