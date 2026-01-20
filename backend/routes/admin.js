import express from 'express';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Admin credentials (in production, use environment variables)
const ADMIN_CREDENTIALS = {
  email: 'admin@tatvadirect.com',
  password: 'TatvaAdmin@2024'
};

// Import users array from auth module
import { users } from './auth.js';

// Synchronized product data (matches supplier dashboard)
const products = [
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
  },
  {
    id: 3,
    name: 'Fine Aggregate River Sand',
    category: 'aggregates',
    price: 25,
    unit: 'cft',
    stock: 10000,
    description: 'Clean river sand for concrete mixing',
    supplierId: 2
  },
  {
    id: 4,
    name: 'Red Clay Bricks First Class',
    category: 'masonry',
    price: 8,
    unit: 'nos',
    stock: 50000,
    description: 'High quality red clay bricks',
    supplierId: 2
  }
];

// Synchronized BOQ data (matches service provider dashboard)
const mockBOQs = [
  {
    id: 1,
    name: 'Office Building Construction',
    serviceProviderId: 1,
    itemCount: 45,
    totalValue: 2500000,
    status: 'completed',
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    name: 'Residential Complex Phase 1',
    serviceProviderId: 1,
    itemCount: 78,
    totalValue: 4200000,
    status: 'processing',
    createdAt: '2024-02-01'
  },
  {
    id: 3,
    name: 'Shopping Mall Infrastructure',
    serviceProviderId: 2,
    itemCount: 156,
    totalValue: 8900000,
    status: 'pending',
    createdAt: '2024-02-10'
  }
];

// Synchronized supplier orders data
const supplierOrders = [
  {
    id: 'ORD001',
    customer: 'ABC Construction Ltd',
    amount: 450000,
    status: 'delivered',
    supplierId: 1,
    date: '2024-01-20'
  },
  {
    id: 'ORD002',
    customer: 'XYZ Builders',
    amount: 280000,
    status: 'pending',
    supplierId: 1,
    date: '2024-02-05'
  },
  {
    id: 'ORD003',
    customer: 'Modern Constructions',
    amount: 125000,
    status: 'processing',
    supplierId: 2,
    date: '2024-02-12'
  }
];

// Synchronized service provider POs data
const servicePOs = [
  {
    id: '2024001',
    vendor: 'BuildMart Supply',
    amount: 450000,
    status: 'delivered',
    serviceProviderId: 1,
    date: '2024-01-18'
  },
  {
    id: '2024002',
    vendor: 'ProConstruct Ltd',
    amount: 280000,
    status: 'pending',
    serviceProviderId: 1,
    date: '2024-02-03'
  },
  {
    id: '2024003',
    vendor: 'MegaSupply Co',
    amount: 125000,
    status: 'processing',
    serviceProviderId: 2,
    date: '2024-02-10'
  }
];

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  // In a real application, you would check the user's role from the database
  // For now, we'll check if the user email matches admin email
  const user = getUserById(req.userId);
  if (user && user.email === ADMIN_CREDENTIALS.email) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
};

// Generate comprehensive admin data with supplier and service provider details
const generateAdminData = () => {
  const serviceProviders = users.filter(u => u.userType === 'service_provider');
  const suppliers = users.filter(u => u.userType === 'supplier');

  // Generate supplier data with their products and orders
  const supplierData = suppliers.map(supplier => {
    const supplierProducts = products.filter(p => p.supplierId === supplier.id);
    const supplierOrderList = supplierOrders.filter(o => o.supplierId === supplier.id);
    const totalInventoryValue = supplierProducts.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const totalRevenue = supplierOrderList.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.amount, 0);
    
    return {
      ...supplier,
      products: supplierProducts,
      orders: supplierOrderList,
      totalProducts: supplierProducts.length,
      totalInventoryValue: totalInventoryValue,
      totalRevenue: totalRevenue,
      activeOrders: supplierOrderList.filter(o => o.status !== 'delivered').length,
      categories: [...new Set(supplierProducts.map(p => p.category))]
    };
  });

  // Generate service provider data with their BOQs and POs
  const serviceProviderData = serviceProviders.map(sp => {
    const spBOQs = mockBOQs.filter(boq => boq.serviceProviderId === sp.id);
    const spPOs = servicePOs.filter(po => po.serviceProviderId === sp.id);
    const totalBOQValue = spBOQs.reduce((sum, boq) => sum + boq.totalValue, 0);
    const totalSpent = spPOs.filter(po => po.status === 'delivered').reduce((sum, po) => sum + po.amount, 0);
    
    return {
      ...sp,
      boqs: spBOQs,
      pos: spPOs,
      totalBOQs: spBOQs.length,
      totalBOQValue: totalBOQValue,
      totalSpent: totalSpent,
      activePOs: spPOs.filter(po => po.status !== 'delivered').length,
      activeBOQs: spBOQs.filter(boq => boq.status !== 'completed').length
    };
  });

  // Generate transactions from actual orders and POs
  const transactions = [];
  
  // Add supplier orders as transactions
  supplierOrders.forEach(order => {
    const supplier = suppliers.find(s => s.supplierId === order.supplierId);
    transactions.push({
      id: order.id,
      type: 'order',
      serviceProvider: order.customer,
      supplier: supplier ? (supplier.company || supplier.name) : 'Unknown Supplier',
      amount: order.amount,
      date: order.date,
      status: order.status
    });
  });

  // Add service provider POs as transactions
  servicePOs.forEach(po => {
    const serviceProvider = serviceProviders.find(sp => sp.id === po.serviceProviderId);
    transactions.push({
      id: po.id,
      type: 'po',
      serviceProvider: serviceProvider ? (serviceProvider.company || serviceProvider.name) : 'Unknown Service Provider',
      supplier: po.vendor,
      amount: po.amount,
      date: po.date,
      status: po.status
    });
  });

  // Sort transactions by date (newest first)
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Calculate total revenue (sum of completed transactions)
  const totalRevenue = transactions
    .filter(t => t.status === 'delivered')
    .reduce((sum, t) => sum + t.amount, 0);

  // Generate user list with proper formatting
  const userList = users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    company: user.company || 'Individual',
    userType: user.userType || 'general',
    joinedDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown',
    status: 'active'
  }));

  return {
    stats: {
      totalUsers: users.length,
      serviceProviders: serviceProviders.length,
      suppliers: suppliers.length,
      totalTransactions: transactions.length,
      totalRevenue: totalRevenue,
      activeBOQs: mockBOQs.filter(boq => boq.status !== 'completed').length,
      totalProducts: products.length,
      totalInventoryValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
      activeOrders: supplierOrders.filter(o => o.status !== 'delivered').length,
      activePOs: servicePOs.filter(po => po.status !== 'delivered').length
    },
    users: userList,
    transactions: transactions.slice(0, 20),
    supplierData: supplierData,
    serviceProviderData: serviceProviderData,
    products: products,
    boqs: mockBOQs,
    orders: supplierOrders,
    pos: servicePOs
  };
};

// Admin dashboard data
router.get('/dashboard', authenticateToken, isAdmin, (req, res) => {
  try {
    const adminData = generateAdminData();
    res.json(adminData);
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all users (admin only)
router.get('/users', authenticateToken, isAdmin, (req, res) => {
  try {
    const adminData = generateAdminData();
    res.json({ users: adminData.users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user details (admin only)
router.get('/users/:id', authenticateToken, isAdmin, (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all transactions (admin only)
router.get('/transactions', authenticateToken, isAdmin, (req, res) => {
  try {
    const adminData = generateAdminData();
    res.json({ transactions: adminData.transactions });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user status (admin only)
router.put('/users/:id/status', authenticateToken, isAdmin, (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { status } = req.body;
    
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // In a real app, you'd update the status in the database
    // For now, we'll just return success
    
    res.json({ 
      message: 'User status updated successfully',
      user: { ...users[userIndex], status }
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Helper function to get user by ID
function getUserById(userId) {
  // Check if it's admin
  if (userId === 999) {
    return {
      id: 999,
      email: ADMIN_CREDENTIALS.email,
      name: 'Admin User',
      userType: 'admin'
    };
  }
  
  // Find regular user
  return users.find(u => u.id === userId);
}

export { router as adminRouter, ADMIN_CREDENTIALS };