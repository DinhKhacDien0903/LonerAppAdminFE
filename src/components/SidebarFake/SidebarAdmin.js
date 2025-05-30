import React, { useState } from 'react';
import { Avatar, Divider, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LogoutIcon from '@mui/icons-material/Logout';
import ConfirmLogoutDialog from '../../utils/ConfirmDialog';
import { sidebarAdminMenu } from './SidebarAdminMenu';
import { userInfoSelector } from '~/redux/selectors';
import { logoutService } from '~/services/authServices';

const SidebarAdmin = () => {
    const userInfo = useSelector(userInfoSelector);
    const navigate = useNavigate();
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const handleNavigate = (item) => {
        navigate(item.path);
    };

    const handleLogout = async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isAuthenticated');
        var refreshToken = localStorage.getItem('refreshToken');
        await logoutService(userInfo?.id, refreshToken ?? "");
        navigate('/login');
    };

    return (
        <div className="card h-screen flex flex-col justify-between py-5 bg-gray-100">
            <div className="space-y-8 pl-5 pr-5">
                <div>
                    <span className="logo font-bold text-xl">LONER DATETING</span>
                </div>
                <div className="space-y-8">
                    {sidebarAdminMenu.map((item) => (
                        <div
                            key={item.id || item.title || index}
                            onClick={() => handleNavigate(item)}
                            className="flex space-x-3 items-centers cursor-pointer"
                        >
                            {item.icon}
                            <p className="text-lg">{item.title}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <Divider />
                <div className="flex flex-col justify-between pt-5 px-5">
                    <div className="flex items-center space-x-3">
                        <Avatar src={userInfo.avatarUrl} />
                        <div>
                            <p className="font-bold">{userInfo?.userName}</p>
                            <p className="opacity-70">{userInfo?.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center pt-3 gap-x-2">
                        <p className="opacity-70">Đăng xuất ở đây</p>
                        <IconButton onClick={() => setOpenConfirmDialog(true)}>
                            <LogoutIcon />
                        </IconButton>
                    </div>
                </div>
            </div>
            <ConfirmLogoutDialog
                open={openConfirmDialog}
                onClose={() => setOpenConfirmDialog(false)}
                onConfirm={handleLogout}
                content={'Bạn có chắc chắn muốn đăng xuất không?'}
            />
        </div>
    );
};

export default SidebarAdmin;
