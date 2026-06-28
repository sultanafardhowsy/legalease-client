import { requireLawyer } from '@/lib/core/session';
import React from 'react';

const LawyerDashboardLayout = async({children}) => {
    await requireLawyer();
    return children;
};

export default LawyerDashboardLayout;
