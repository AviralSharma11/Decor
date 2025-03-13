import React , {useState} from "react";
import { Link } from "react-router-dom";
import "../../Styles/HomePage/ProductCard.css";
import itemsbs from "../../List/itemsbs";
const ProductCard = ({ addToCart,  isAuthenticated, setIsLoginModalOpen}) => {

  const [addedToCart, setAddedToCart] = useState({});
  const [currentImage, setCurrentImage] = useState(
    itemsbs.reduce((acc, product) => {
      acc[product.id] = product.image[0];
      return acc;
    }, {})
  );

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
        setIsLoginModalOpen(true);
        return;
    }

    addToCart(product);
    setAddedToCart((prev) => ({ ...prev, [product.id]: true }));

    const email = localStorage.getItem("userEmail");

    try {
        const response = await fetch("http://localhost:5000/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email,
                product: {
                    id: product.id,
                    name: product.name,
                    image: product.image,
                    price: product.discountedPrice, // Use discounted price for cart
                },
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to add to cart: ${response.statusText}`);
        }
    } catch (err) {
        console.error("Failed to save cart:", err);
    }

    setTimeout(() => {
        setAddedToCart((prev) => ({ ...prev, [product.id]: false }));
    }, 3000);
};


  return (
    <div className="product-container">
       {itemsbs.map((product) => (
        <div key={product.id} className="product-card">
          <Link to={`/product/${product.name}`.toLowerCase().replace(/\s+/g, "-")} state={{ product }} style={{textDecoration: "none"}}>
          <div
              className="product-image"
              onMouseEnter={() =>
                setCurrentImage((prev) => ({
                  ...prev,
                  [product.id]: product.image[1],
                }))
              }
              onMouseLeave={() =>
                setCurrentImage((prev) => ({
                  ...prev,
                  [product.id]: product.image[0],
                }))
              }
            >
              <img src={currentImage[product.id]} alt={product.name} />
            {product.isOnSale && <span className="sale-label">Sale</span>}
          </div>
          <div className="product-details">
            <h3 className="product-title">{product.name}</h3>
            <div className="product-ratings">
              {"★".repeat(Math.floor(product.rating))}{"☆".repeat(5 - Math.floor(product.rating))}
              <span className="reviews">({product.reviews})</span>
            </div>
            <div className="product-prices">
              <span className="original-price">Rs. {product.originalPrice.toLocaleString()}</span>
              <span className="discounted-price">Rs. {product.discountedPrice.toLocaleString()}</span>
            </div>
          </div>
          </Link>
          <button
            className={`addtocart ${addedToCart[product.id] ? "added" : ""}`}
            onClick={() => handleAddToCart(product)}
            disabled={addedToCart[product.id]} // Disable button when added
          >
            {addedToCart[product.id] ? "Added to Cart " : "Add to Cart"}
          </button>
        </div>
       ))}
    </div>
  );
};

export default ProductCard;
