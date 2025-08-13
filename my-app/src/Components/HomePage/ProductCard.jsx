import React , {useState , useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../Styles/HomePage/ProductCard.css";

const ProductCard = ({ addToCart,  isAuthenticated, setIsLoginModalOpen}) => {
  const [products, setProducts] = useState([]);
  const [addedToCart, setAddedToCart] = useState({});
  const [showCustomisablePopup, setShowCustomisablePopup] = useState(false);
  const [currentImage, setCurrentImage] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();
  const handleOkClick = () => {
    if (selectedProduct) {
      setShowCustomisablePopup(false);
      navigate(
        `/product/${selectedProduct.name}`.toLowerCase().replace(/\s+/g, "-"),
        { state: { product: selectedProduct } }
      );
    }
  };

   useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products/featured");
        const data = await res.json();

        setProducts(data);

        const imageMap = {};
        data.forEach((product) => {
          imageMap[product.id] = Array.isArray(product.image)
            ? product.image[0]
            : product.image;
        });
        setCurrentImage(imageMap);
      } catch (err) {
        console.error("Failed to fetch featured products:", err);
      }
    };

    fetchFeatured();
  }, []);

 const handleAddToCart = async (product) => {
    // Prevent adding if customisable
    if (product.customisable) {
      setSelectedProduct(product);
      setShowCustomisablePopup(true);
      return;
    }

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
            price: product.discountedPrice || product.price || product.originalPrice || 0,
          },
        }),
      });

      if (!response.ok) throw new Error(`Failed to add to cart: ${response.statusText}`);
    } catch (err) {
      console.error("Failed to save cart:", err);
    }

    setTimeout(() => {
      setAddedToCart((prev) => ({ ...prev, [product.id]: false }));
    }, 3000);
  };

  return (
    <div className="product-container">
      {showCustomisablePopup && (
        <div className="popup-overlay" onClick={() => setShowCustomisablePopup(false)}>
          <div className="popup-box" onClick={(e) => e.stopPropagation()}>
            <p>This is a customisable product. Please go to the product page and customise it before adding to cart.</p>
            <button onClick={handleOkClick}>OK</button>
          </div>
        </div>
      )}

       {products.map((product) => (
        <div key={product.id} className="product-card">
           <Link
            to={`/product/${product.name}`.toLowerCase().replace(/\s+/g, "-")}
            state={{ product }}
            style={{ textDecoration: "none" }}
          >
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
                {"★".repeat(Math.floor(product.rating)) +
                  "☆".repeat(5 - Math.floor(product.rating))}
                <span className="reviews">({product.reviews})</span>
              </div>
              <div className="product-prices">
                <span className="original-price">
                  Rs. {product.originalPrice.toLocaleString()}
                </span>
                <span className="discounted-price">
                  Rs. {product.discountedPrice.toLocaleString()}
                </span>
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

