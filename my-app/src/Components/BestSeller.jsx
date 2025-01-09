import React from "react";
import "../Styles/BestSeller.css";
import ProductCard from "./ProductCard";
import itemsbs from "../List/itemsbs";

export default function BestSeller(){
    return(
        <div className="BestSeller">
            <div className="heading">
                <h3>Bestsellers</h3>
            </div>
            <div className="Product">
                {itemsbs.map((product , index)=> (
                    <ProductCard 
                        key={index}
                        image = {product.imageSrc}
                        isOnSale = {product.isOnSale}
                        title = {product.title}
                        rating = {product.rating}
                        reviews = {product.reviews}
                        originalPrice = {product.originalPrice}
                        discountedPrice = {product.discountedPrice}
                    />
                ))} 
            </div>
        </div>
    )
}