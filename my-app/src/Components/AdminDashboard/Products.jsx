import React, { useState, useEffect } from 'react';
import '../../Styles/AdminDashboard/Product.css';
import axios from 'axios';
import AdminSidebar from '../../AdminSidebar';

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
  gift: false,
  tags: [],
  photo: false,
  size: '',
  luxury: false,
  description: '',
};

export default function Products() {
  const [product, setProduct] = useState(initialProduct);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('/api/products').then(res => setProducts(res.data));
  }, []);

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

  const handleAddProduct = async () => {
    await axios.post('/api/products', product);
    const res = await axios.get('/api/products');
    setProducts(res.data);
    setProduct(initialProduct);
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/products/${id}`);
    const res = await axios.get('/api/products');
    setProducts(res.data);
  };

  return (
    <div style={{ display: 'flex' }}>
      <AdminSidebar />
    <div className="admin-container">
      <h2 className="section-title">Add New Product</h2>
      <div className="form-grid">
        <input className="input" name="name" placeholder="Name" value={product.name} onChange={handleChange} />
        <input className="input" name="rating" placeholder="Rating" value={product.rating} onChange={handleChange} />
        <input className="input" name="reviews" placeholder="Reviews" value={product.reviews} onChange={handleChange} />
        <input className="input" name="originalPrice" placeholder="Original Price" value={product.originalPrice} onChange={handleChange} />
        <input className="input" name="discountedPrice" placeholder="Discounted Price" value={product.discountedPrice} onChange={handleChange} />
        <input className="input" placeholder="Image URLs (comma separated)" onChange={(e) => handleArrayChange(e, 'image')} />
        <input className="input" name="material" placeholder="Material" value={product.material} onChange={handleChange} />
        <input className="input" name="style" placeholder="Style" value={product.style} onChange={handleChange} />
        <input className="input" name="trending" placeholder="Trending" value={product.trending} onChange={handleChange} />
        <input className="input" name="giftingguide" placeholder="Gifting Guide" value={product.giftingguide} onChange={handleChange} />
        <input className="input" placeholder="Type (comma separated)" onChange={(e) => handleArrayChange(e, 'type')} />
        <input className="input" placeholder="Tags (comma separated)" onChange={(e) => handleArrayChange(e, 'tags')} />
        <input className="input" name="size" placeholder="Size" value={product.size} onChange={handleChange} />
        <textarea className="textarea" name="description" placeholder="Description" value={product.description} onChange={handleChange} />
        <div className="checkbox-group">
          <label><input type="checkbox" name="customisable" checked={product.customisable} onChange={handleChange} /> Customisable</label>
          <label><input type="checkbox" name="gift" checked={product.gift} onChange={handleChange} /> Gift</label>
          <label><input type="checkbox" name="photo" checked={product.photo} onChange={handleChange} /> Photo</label>
          <label><input type="checkbox" name="luxury" checked={product.luxury} onChange={handleChange} /> Luxury</label>
        </div>
        <button className="btn" onClick={handleAddProduct}>Add Product</button>
      </div>

      <h2 className="section-title">Product List</h2>
      <ul className="product-list">
        {products.map((p) => (
          <li key={p.id} className="product-item">
            <span>{p.name} - ₹{p.discountedPrice}</span>
            <button className="delete-btn" onClick={() => handleDelete(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
}
