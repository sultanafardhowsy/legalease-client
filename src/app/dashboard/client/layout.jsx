import { requireClient } from '@/lib/core/session';
import React from 'react';

const ClientDashboardLayout = async({children}) => {
    await requireClient();
    return children;
};

export default ClientDashboardLayout;
