import React from "react";
import "../../Styles/HomePage/BestSeller.css";
import ProductCard from "./ProductCard";

export default function BestSeller({ addToCart, isAuthenticated, setIsLoginModalOpen }){
    return(
        <div className="BestSeller">
            <div className="heading">
                <h3>Bestsellers</h3>
            </div>
            <div className="Product">
                <ProductCard 
                addToCart={addToCart} 
                isAuthenticated={isAuthenticated}
                setIsLoginModalOpen={setIsLoginModalOpen}/>
            </div>
        </div>
    )
}