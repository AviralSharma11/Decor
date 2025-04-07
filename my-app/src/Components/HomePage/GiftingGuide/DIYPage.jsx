// import React, { useState } from "react";
// import "../../../Styles/HomePage/DIY.css";
// import Header from "../../Header";
// import Footer from "../../Footer";

// const DIY = () => {
//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState({
//     recipient: "",
//     occasion: "",
//     budget: "",
//     style: "",
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleNext = () => {
//     if (step < 5) setStep(step + 1);
//   };

//   const handleBack = () => {
//     if (step > 1) setStep(step - 1);
//   };

//   const generateSuggestion = () => {
//     const { recipient, occasion, budget, style } = formData;
//     return `🎁 A ${style} gift set for ${recipient} to celebrate ${occasion}, all within ₹${budget}.`;
//   };

//   return (
//     <div >
//         <Header cart={cart} onRemoveFromCart={removeFromCart} updateQuantity={updateQuantity} user={user} products={allProducts}/>
//         <div className="wizard-container">
//             <h2 className="wizard-title">🎁 Custom Gifting Wizard</h2>
//             <div className="wizard-step">
//                 {step === 1 && (
//                 <div className="wizard-input">
//                     <label>Who is it for?</label>
//                     <input
//                     type="text"
//                     name="recipient"
//                     placeholder="e.g. Mom, Friend, Partner"
//                     value={formData.recipient}
//                     onChange={handleChange}
//                     />
//                 </div>
//                 )}
//                 {step === 2 && (
//                 <div className="wizard-input">
//                     <label>Occasion?</label>
//                     <input
//                     type="text"
//                     name="occasion"
//                     placeholder="e.g. Birthday, Anniversary, Graduation"
//                     value={formData.occasion}
//                     onChange={handleChange}
//                     />
//                 </div>
//                 )}
//                 {step === 3 && (
//                 <div className="wizard-input">
//                     <label>Budget?</label>
//                     <input
//                     type="text"
//                     name="budget"
//                     placeholder="e.g. 1000, 2500"
//                     value={formData.budget}
//                     onChange={handleChange}
//                     />
//                 </div>
//                 )}
//                 {step === 4 && (
//                 <div className="wizard-input">
//                     <label>Style Preference?</label>
//                     <input
//                     type="text"
//                     name="style"
//                     placeholder="e.g. Elegant, Minimalist, Traditional"
//                     value={formData.style}
//                     onChange={handleChange}
//                     />
//                 </div>
//                 )}
//                 {step === 5 && (
//                 <div className="wizard-result">
//                     <h3>🎉 Here's your custom gift idea:</h3>
//                     <p>{generateSuggestion()}</p>
//                 </div>
//                 )}
//             </div>

//             <div className="wizard-buttons">
//                 {step > 1 && step < 5 && (
//                 <button className="back-btn" onClick={handleBack}>Back</button>
//                 )}
//                 {step < 5 && (
//                 <button
//                     className="next-btn"
//                     onClick={handleNext}
//                     disabled={!formData[Object.keys(formData)[step - 1]]}
//                 >
//                     Next
//                 </button>
//                 )}
//                 {step === 5 && (
//                 <button className="finish-btn" onClick={() => alert("Gift added to cart!")}>
//                     Add to Cart
//                 </button>
//                 )}
//             </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default DIY;
