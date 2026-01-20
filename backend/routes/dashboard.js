import express from 'express';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Mock data for dashboards
const mockServiceProviderData = {
  stats: {
    totalBOQs: 12,
    activePOs: 8,
    totalSpent: 2450000,
    pendingApprovals: 3
  },
  recentBOQs: [
    {
      id: 1,
      name: 'Office Building Construction',
      itemCount: 45,
      createdAt: '2 days ago',
      status: 'completed'
    },
    {
      id: 2,
      name: 'Residential Complex Phase 1',
      itemCount: 78,
      createdAt: '5 days ago',
      status: 'processing'
    },
    {
      id: 3,
      name: 'Shopping Mall Infrastructure',
      itemCount: 156,
      createdAt: '1 week ago',
      status: 'pending'
    }
  ],
  recentPOs: [
    {
      id: '2024001',
      vendor: 'BuildMart Supply',
      amount: 450000,
      status: 'delivered'
    },
    {
      id: '2024002',
      vendor: 'ProConstruct Ltd',
      amount: 280000,
      status: 'pending'
    },
    {
      id: '2024003',
      vendor: 'MegaSupply Co',
      amount: 125000,
      status: 'processing'
    }
  ]
};

const mockSupplierData = {
  stats: {
    totalProducts: 156,
    activeOrders: 23,
    totalRevenue: 3250000,
    pendingQuotes: 7
  },
  products: [
    {
      id: 1,
      name: 'Steel Reinforcement Bar 12mm TMT',
      category: 'steel',
      price: 45,
      unit: 'kg',
      stock: 5000,
      description: 'High quality TMT bars for construction'
    },
    {
      id: 2,
      name: 'Ordinary Portland Cement Grade 53',
      category: 'cement',
      price: 280,
      unit: 'bag',
      stock: 2000,
      description: 'Premium quality cement for all construction needs'
    },
    {
      id: 3,
      name: 'Fine Aggregate River Sand',
      category: 'aggregates',
      price: 25,
      unit: 'cft',
      stock: 10000,
      description: 'Clean river sand for concrete mixing'
    },
    {
      id: 4,
      name: 'Red Clay Bricks First Class',
      category: 'masonry',
      price: 8,
      unit: 'nos',
      stock: 50000,
      description: 'High quality red clay bricks'
    }
  ],
  orders: [
    {
      id: 'ORD001',
      customer: 'ABC Construction Ltd',
      amount: 450000,
      status: 'delivered'
    },
    {
      id: 'ORD002',
      customer: 'XYZ Builders',
      amount: 280000,
      status: 'pending'
    },
    {
      id: 'ORD003',
      customer: 'Modern Constructions',
      amount: 125000,
      status: 'processing'
    }
  ]
};

// Service Provider Dashboard
router.get('/service-provider', authenticateToken, (req, res) => {
  try {
    res.json(mockServiceProviderData);
  } catch (error) {
    console.error('Service provider dashboard error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Supplier Dashboard
router.get('/supplier', authenticateToken, (req, res) => {
  try {
    res.json(mockSupplierData);
  } catch (error) {
    console.error('Supplier dashboard error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export { router as dashboardRouter };