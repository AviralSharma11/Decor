import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";
import ProductComponent from "./ProductComponent";
import Footer from "./Footer";

export default function MaterialPage() {
  const { materialType } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductsByMaterial = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/material/${materialType}`);
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProductsByMaterial();
  }, [materialType]);

  return (
    <div className="MaterialPage">
      <Header />
      <h2>{materialType} Collection</h2>
      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products found for "{materialType}".</p>
      ) : (
        <ProductComponent products={products} />
      )}
      <Footer />
    </div>
  );
}
