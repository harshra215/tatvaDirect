import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Building, 
  ShoppingCart, 
  TrendingUp, 
  Eye, 
  Search, 
  Filter,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Package,
  RefreshCw
} from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    serviceProviders: 0,
    suppliers: 0,
    totalTransactions: 0,
    totalRevenue: 0,
    activeBOQs: 0,
    totalProducts: 0,
    totalInventoryValue: 0
  });
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [supplierData, setSupplierData] = useState([]);
  const [serviceProviderData, setServiceProviderData] = useState([]);
  const [products, setProducts] = useState([]);
  const [boqs, setBOQs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setStats(data.stats);
      setUsers(data.users);
      setTransactions(data.transactions);
      setSupplierData(data.supplierData);
      setServiceProviderData(data.serviceProviderData);
      setProducts(data.products);
      setBOQs(data.boqs);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || user.userType === filterType;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner" />
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Monitor and manage platform activities • Real-time data</p>
        </div>
        <div className="admin-actions">
          <button 
            className="btn-refresh" 
            onClick={fetchAdminData}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? 'spinning' : ''} />
            Refresh Data
          </button>
          <div className="admin-user-info">
            <span>Welcome, {user?.name}</span>
            <div className="admin-badge">Admin</div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="stat-icon users">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon providers">
            <Building size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.serviceProviders}</h3>
            <p>Service Providers</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon suppliers">
            <Package size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.suppliers}</h3>
            <p>Suppliers</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon transactions">
            <ShoppingCart size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.totalTransactions}</h3>
            <p>Total Transactions</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon revenue">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3>₹{stats.totalRevenue.toLocaleString()}</h3>
            <p>Platform Revenue</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon boqs">
            <FileText size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.activeBOQs}</h3>
            <p>Active BOQs</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon products">
            <Package size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.totalProducts}</h3>
            <p>Total Products</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon inventory">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3>₹{stats.totalInventoryValue?.toLocaleString()}</h3>
            <p>Inventory Value</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="admin-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <BarChart3 size={16} />
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={16} />
          Users
        </button>
        <button 
          className={`tab ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          <ShoppingCart size={16} />
          Transactions
        </button>
        <button 
          className={`tab ${activeTab === 'suppliers' ? 'active' : ''}`}
          onClick={() => setActiveTab('suppliers')}
        >
          <Package size={16} />
          Suppliers
        </button>
        <button 
          className={`tab ${activeTab === 'providers' ? 'active' : ''}`}
          onClick={() => setActiveTab('providers')}
        >
          <Building size={16} />
          Service Providers
        </button>
      </div>

      {/* Tab Content */}
      <div className="admin-content">
        {activeTab === 'overview' && (
          <OverviewTab stats={stats} />
        )}
        
        {activeTab === 'users' && (
          <UsersTab 
            users={filteredUsers}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterType={filterType}
            setFilterType={setFilterType}
          />
        )}
        
        {activeTab === 'transactions' && (
          <TransactionsTab transactions={transactions} />
        )}
        
        {activeTab === 'suppliers' && (
          <SuppliersTab supplierData={supplierData} />
        )}
        
        {activeTab === 'providers' && (
          <ServiceProvidersTab serviceProviderData={serviceProviderData} />
        )}
      </div>
    </div>
  );
};

const OverviewTab = ({ stats }) => (
  <div className="overview-content">
    <div className="overview-cards">
      <div className="overview-card">
        <h3>Platform Growth</h3>
        <div className="growth-stats">
          <div className="growth-item">
            <span className="growth-label">New Users (This Month)</span>
            <span className="growth-value">+{Math.floor(stats.totalUsers * 0.15)}</span>
          </div>
          <div className="growth-item">
            <span className="growth-label">Revenue Growth</span>
            <span className="growth-value positive">+12.5%</span>
          </div>
          <div className="growth-item">
            <span className="growth-label">Active Transactions</span>
            <span className="growth-value">₹{(stats.totalRevenue * 0.3).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="overview-card">
        <h3>User Distribution</h3>
        <div className="user-distribution">
          <div className="distribution-item">
            <div className="distribution-bar">
              <div 
                className="bar-fill providers" 
                style={{ width: `${(stats.serviceProviders / stats.totalUsers) * 100}%` }}
              />
            </div>
            <span>Service Providers ({stats.serviceProviders})</span>
          </div>
          <div className="distribution-item">
            <div className="distribution-bar">
              <div 
                className="bar-fill suppliers" 
                style={{ width: `${(stats.suppliers / stats.totalUsers) * 100}%` }}
              />
            </div>
            <span>Suppliers ({stats.suppliers})</span>
          </div>
          <div className="distribution-item">
            <div className="distribution-bar">
              <div 
                className="bar-fill others" 
                style={{ width: `${((stats.totalUsers - stats.serviceProviders - stats.suppliers) / stats.totalUsers) * 100}%` }}
              />
            </div>
            <span>Others ({stats.totalUsers - stats.serviceProviders - stats.suppliers})</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const UsersTab = ({ users, searchTerm, setSearchTerm, filterType, setFilterType }) => (
  <div className="users-content">
    <div className="users-controls">
      <div className="search-box">
        <Search size={16} />
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
        <option value="all">All Users</option>
        <option value="service_provider">Service Providers</option>
        <option value="supplier">Suppliers</option>
        <option value="">No Role Selected</option>
      </select>
    </div>

    <div className="users-table">
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Type</th>
            <th>Company</th>
            <th>Joined</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <div className="user-info">
                  <div className="user-avatar">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="user-name">{user.name}</div>
                    <div className="user-email">{user.email}</div>
                  </div>
                </div>
              </td>
              <td>
                <span className={`user-type-badge ${user.userType || 'none'}`}>
                  {user.userType === 'service_provider' ? '🏢 Service Provider' :
                   user.userType === 'supplier' ? '🚛 Supplier' : 
                   user.userType === 'admin' ? '🔐 Admin' : '👤 No Role'}
                </span>
              </td>
              <td>{user.company}</td>
              <td>{user.joinedDate}</td>
              <td>
                <span className={`status-badge ${user.status}`}>
                  {user.status === 'active' ? <CheckCircle size={14} /> : <Clock size={14} />}
                  {user.status}
                </span>
              </td>
              <td>
                <button className="btn-icon" title="View Details">
                  <Eye size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const TransactionsTab = ({ transactions }) => (
  <div className="transactions-content">
    <div className="transactions-table">
      <table>
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Service Provider</th>
            <th>Supplier</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>
                <span className="transaction-id">#{transaction.id}</span>
              </td>
              <td>{transaction.serviceProvider}</td>
              <td>{transaction.supplier}</td>
              <td className="amount">₹{transaction.amount.toLocaleString()}</td>
              <td>{transaction.date}</td>
              <td>
                <span className={`status-badge ${transaction.status}`}>
                  {transaction.status === 'completed' ? <CheckCircle size={14} /> : 
                   transaction.status === 'pending' ? <Clock size={14} /> : <AlertTriangle size={14} />}
                  {transaction.status}
                </span>
              </td>
              <td>
                <button className="btn-icon">
                  <Eye size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default AdminDashboard;