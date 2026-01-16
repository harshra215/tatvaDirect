import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { FileText, Users, RefreshCw, ShoppingCart } from 'lucide-react';
import './Layout.css';

const Layout = () => {
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
          <h2>AI Procurement</h2>
        </div>
        <div className="nav-steps">
          {steps.map(({ path, label, icon: Icon }) => (
            <NavLink key={path} to={path} className="nav-step">
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
