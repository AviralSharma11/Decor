import React, { useState, useEffect } from 'react';
import '../../Styles/AdminDashboard/Product.css';
import axios from 'axios';
import { API_BASE_URL } from '../../api/config';

const initialProduct = {
  name: '',
  rating: '',
  reviews: '',
  originalPrice: '',
  discountedPrice: '',
  image: [],
  material: '',
  style: '',
  trending: '',
  customisable: false,
  giftingguide: '',
  type: [],
  theme: [],
  gift: false,
  text1: false,
  photo: false,
  size: '',
  luxury: false,
  description: '',
  personalisedJewellary: false,
  comingSoon: false,
  instruction: [],
  wallart: false,
};

export default function Products() {
  const [product, setProduct] = useState(initialProduct);
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get(`${API_BASE_URL}/products`);
    setProducts(res.data);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleArrayChange = (e, field) => {
    setProduct(prev => ({
      ...prev,
      [field]: e.target.value.split(',').map(s => s.trim())
    }));
  };

// Helper to make sure we always get an array
const parseToArray = (value) => {
  if (Array.isArray(value)) return value;
  try {
    return JSON.parse(value || "[]");
  } catch {
    return [];
  }
};

// When clicking "Edit"
const handleEdit = (prod) => {
  setProduct({
    ...prod,
    image: parseToArray(prod.image),
    type: parseToArray(prod.type),
    theme: parseToArray(prod.theme),
    instruction: parseToArray(prod.instruction),
    giftingguide: parseToArray(prod.giftingguide)
  });
  setEditingId(prod.id);
};

// When adding or updating
const handleAddOrUpdateProduct = async () => {
  try {
    const payload = {
      ...product,
      rating: parseFloat(product.rating) || 0,
      reviews: parseInt(product.reviews) || 0,
      originalPrice: parseFloat(product.originalPrice) || 0,
      discountedPrice: parseFloat(product.discountedPrice) || 0,
      image: JSON.stringify(product.image || []),
      type: JSON.stringify(product.type || []),
      theme: JSON.stringify(product.theme || []),
      instruction: JSON.stringify(product.instruction || []),
      giftingguide: JSON.stringify(product.giftingguide || [])
    };

    if (editingId) {
      await axios.put(`${API_BASE_URL}/products/${editingId}`, payload);
    } else {
      await axios.post(`${API_BASE_URL}/products`, payload);
    }

    await fetchProducts();
    setProduct(initialProduct);
    setEditingId(null);

  } catch (err) {
    console.error("Error saving product:", err.response?.data || err.message);
    alert("Failed to save product. Check console for details.");
  }
};


const handleDelete = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/products/${id}`);
    await fetchProducts();
  } catch (err) {
    console.error("Error deleting product:", err.response?.data || err.message);
    alert("Failed to delete product.");
  }
};

  return (
    <div className="admin-container">
      <h2 className="section-title">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
      <div className="form-grid">
        <input className="input" name="name" placeholder="Name" value={product.name} onChange={handleChange} />
        <input className="input" name="rating" placeholder="Rating" value={product.rating} onChange={handleChange} />
        <input className="input" name="reviews" placeholder="Reviews" value={product.reviews} onChange={handleChange} />
        <input className="input" name="originalPrice" placeholder="Original Price" value={product.originalPrice} onChange={handleChange} />
        <input className="input" name="discountedPrice" placeholder="Discounted Price" value={product.discountedPrice} onChange={handleChange} />
        <input className="input" placeholder="Image URLs (comma separated)" value={product.image.join(', ')} onChange={(e) => handleArrayChange(e, 'image')} />
        <input className="input" name="material" placeholder="Material" value={product.material} onChange={handleChange} />
        <input className="input" name="style" placeholder="Style" value={product.style} onChange={handleChange} />
        <input className="input" name="trending" placeholder="Trending" value={product.trending} onChange={handleChange} />
        <input className="input" name="giftingguide" placeholder="Gifting Guide" value={product.giftingguide} onChange={handleChange} />
        <input className="input" placeholder="Type (comma separated)" value={product.type.join(', ')} onChange={(e) => handleArrayChange(e, 'type')} />
        <input className="input" placeholder="Theme (comma separated)" value={product.theme.join(', ')} onChange={(e) => handleArrayChange(e, 'theme')} />
        <input className="input" name="size" placeholder="Size" value={product.size} onChange={handleChange} />
        <textarea className="textarea" name="description" placeholder="Description" value={product.description} onChange={handleChange} />
        <textarea
            className="textarea"
            name="instruction"
            placeholder="Instructions (comma separated)"
            value={product.instruction.join(', ')}
            onChange={(e) => handleArrayChange(e, 'instruction')}
          />
        <div className="checkbox-group">
          <label><input type="checkbox" name="customisable" checked={product.customisable} onChange={handleChange} /> Customisable</label>
          <label><input type="checkbox" name="gift" checked={product.gift} onChange={handleChange} /> Gift</label>
          <label><input type="checkbox" name="text1" checked={product.text1} onChange={handleChange} /> Text1</label>
          <label><input type="checkbox" name="photo" checked={product.photo} onChange={handleChange} /> Photo</label>
          <label><input type="checkbox" name="luxury" checked={product.luxury} onChange={handleChange} /> Luxury</label>
          <label><input type="checkbox" name="personalisedJewellary" checked={product.personalisedJewellary} onChange={handleChange} /> Personalised Jewellery</label>
          <label><input type="checkbox" name="comingSoon" checked={product.comingSoon} onChange={handleChange} /> Coming Soon</label>
          <label><input type="checkbox" name="wallart" checked={product.wallart} onChange={handleChange} /> Wall Art</label>
        </div>

        <button className="btn" onClick={handleAddOrUpdateProduct}>
          {editingId ? 'Update Product' : 'Add Product'}
        </button>
      </div>

      <h2 className="section-title">Product List</h2>
      <ul className="product-list">
        {products.map((p) => (
          <li key={p.id} className="product-item">
            <span>{p.name} - ₹{p.discountedPrice}</span>
            <button className="edit-btn" onClick={() => handleEdit(p)}>Edit</button>
            <button className="delete-btn" onClick={() => handleDelete(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
