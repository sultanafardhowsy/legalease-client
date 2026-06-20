
import DashBoardNavBar from '@/component/dashboard/DashBoardNavBar';
import { DashBordSideBar } from '@/component/dashboard/DashBoardSideBar';
import React from 'react';

const DashBordLayoutPage = ({children}) => {
    return (
        <div className='flex min-h-screen'>
            <DashBordSideBar />
            <div className='flex-1'>
                <DashBoardNavBar/>
            <div className='flex-1'>{children}</div>
            </div>
        </div>
    );
};

export default DashBordLayoutPage;