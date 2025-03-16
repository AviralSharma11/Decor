import { useState } from "react";

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

    // Filter suggestions based on product tags or names
    const suggestions = products
      .flatMap((product) => product.tags)
      .filter((tag) => tag.toLowerCase().includes(value.toLowerCase()))
      .slice(0, 5);

    // Filter products based on name or tags
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
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search..."
        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none"
      />
      {query && (
        <button onClick={clearSearch} className="absolute right-3 top-2 text-gray-500">
          ✕
        </button>
      )}

      {(filteredSuggestions.length > 0 || filteredProducts.length > 0) && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md border mt-1 max-h-64 overflow-y-auto rounded-md z-10">
          {/* Suggestions */}
          {filteredSuggestions.length > 0 && (
            <div className="p-2 border-b">
              <div className="text-gray-500 font-bold">SUGGESTIONS</div>
              {filteredSuggestions.map((suggestion, index) => (
                <div key={index} className="py-1 cursor-pointer hover:bg-gray-100">
                  {suggestion}
                </div>
              ))}
            </div>
          )}

          {/* Products */}
          {filteredProducts.length > 0 && (
            <div className="p-2">
              <div className="text-gray-500 font-bold">PRODUCTS</div>
              {filteredProducts.map((product) => (
                <div key={product.id} className="flex items-center py-1 cursor-pointer hover:bg-gray-100">
                  <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded mr-2" />
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-gray-500 text-sm">₹{product.price}</div>
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
