import express from 'express';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Mock products database
let products = [
  {
    id: 1,
    name: 'Steel Reinforcement Bar 12mm TMT',
    category: 'steel',
    price: 45,
    unit: 'kg',
    stock: 5000,
    description: 'High quality TMT bars for construction',
    supplierId: 1
  },
  {
    id: 2,
    name: 'Ordinary Portland Cement Grade 53',
    category: 'cement',
    price: 280,
    unit: 'bag',
    stock: 2000,
    description: 'Premium quality cement for all construction needs',
    supplierId: 1
  }
];

// Get all products for a supplier
router.get('/products', authenticateToken, (req, res) => {
  try {
    const supplierProducts = products.filter(p => p.supplierId === req.userId);
    res.json({ products: supplierProducts });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add new product
router.post('/products', authenticateToken, (req, res) => {
  try {
    const productData = req.body;
    const newProduct = {
      id: products.length + 1,
      ...productData,
      supplierId: req.userId,
      createdAt: new Date().toISOString()
    };
    
    products.push(newProduct);
    res.status(201).json({ 
      message: 'Product added successfully',
      product: newProduct 
    });
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update product
router.put('/products/:id', authenticateToken, (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const productData = req.body;
    
    const productIndex = products.findIndex(p => p.id === productId && p.supplierId === req.userId);
    
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    products[productIndex] = {
      ...products[productIndex],
      ...productData,
      updatedAt: new Date().toISOString()
    };
    
    res.json({ 
      message: 'Product updated successfully',
      product: products[productIndex] 
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete product
router.delete('/products/:id', authenticateToken, (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p.id === productId && p.supplierId === req.userId);
    
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    products.splice(productIndex, 1);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export { router as supplierRouter };