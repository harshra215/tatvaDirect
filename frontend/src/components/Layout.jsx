import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { FileText, Users, RefreshCw, ShoppingCart, User, LogOut, ChevronDown } from 'lucide-react';
import tatvaLogo from '../images/tatva_d.png';
import './Layout.css';

const Layout = ({ user, onLogout }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const steps = [
    { path: '/boq-normalize', label: 'BOQ Normalize', icon: FileText },
    { path: '/vendor-select', label: 'Vendor Select', icon: Users },
    { path: '/substitution', label: 'Substitution', icon: RefreshCw },
    { path: '/create-po', label: 'Create PO', icon: ShoppingCart }
  ];

  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="logo">
          <img src={tatvaLogo} alt="Tatva Direct" className="logo-image" />
        </div>
        <div className="nav-steps">
          {steps.map(({ path, label, icon: Icon }) => (
            <NavLink key={path} to={path} className="nav-step">
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
        
        {/* User Profile Section */}
        <div className="user-section">
          <div 
            className="user-profile"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="user-avatar">
              <User size={20} />
            </div>
            <div className="user-info">
              <div className="user-name">{user?.name}</div>
              <div className="user-company">{user?.company}</div>
            </div>
            <ChevronDown size={16} className={`chevron ${showUserMenu ? 'rotated' : ''}`} />
          </div>
          
          {showUserMenu && (
            <div className="user-menu">
              <button className="user-menu-item" onClick={onLogout}>
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </nav>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
