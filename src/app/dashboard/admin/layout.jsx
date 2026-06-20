
import { requireRole } from '@/lib/core/session';
import React from 'react';

const AdminDashboardLayout = async({children}) => {
    return children;
    await requireRole('admin')
};

export default AdminDashboardLayout;