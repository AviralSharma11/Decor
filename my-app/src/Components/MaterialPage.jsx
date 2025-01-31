import React from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";
import ProductComponent from "./ProductComponent";
import { products as allProducts } from "../List/product";
import Footer from "./Footer";

export default function MaterialPage() {
  const { materialType } = useParams();

  // Filter products based on the material type from the URL
  const filteredProducts = allProducts.filter(
    (product) => product.material.toLowerCase() === materialType.toLowerCase()
  );

  return (
    <div className="MaterialPage">
      <Header />
      <h2>{materialType} Collection</h2>
      <ProductComponent products={filteredProducts} />
      <Footer />
    </div>
  );
}
