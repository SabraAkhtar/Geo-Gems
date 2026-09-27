import React from 'react';
import { useEcommerce } from '../../context/EcommerceContext';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';

export const AdminView: React.FC = () => {
  const { isAdmin, isVerifyingAdmin } = useEcommerce();

  if (isVerifyingAdmin) {
    return (
      <div className="min-h-screen bg-[#FAF8F3] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-8 h-8 border-2 border-[#B08D57] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-sans uppercase tracking-widest text-[#716B60]">
          Verifying Administrator Session...
        </p>
      </div>
    );
  }

  if (!isAdmin) {
    return <AdminLogin />;
  }

  return <AdminDashboard />;
};
