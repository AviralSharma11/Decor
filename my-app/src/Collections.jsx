import React from "react";
import Header from "./Components/Header";
import SocialMediaBadges from "./Components/SocialMediaBadges";
import Footer from "./Components/Footer";

export default function Collections(){
    return(
        <div className="Collections">
            <Header/>
            <SocialMediaBadges />
            <Footer />
        </div>
    )
}