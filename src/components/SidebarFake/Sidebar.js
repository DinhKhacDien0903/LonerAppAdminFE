import React, { useState } from "react";
import { Avatar, Divider, IconButton } from "@mui/material";
import { sidebarMenu } from "./SidebarMenu";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { MINIO_BASE_URL } from "../../config/api";
import LogoutIcon from '@mui/icons-material/Logout';
import ConfirmLogoutDialog from "../../utils/ConfirmDialog";

const Sidebar = () => {
    const {auth} = useSelector(store => store);
    const navigate = useNavigate();
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const handleNavigate = (item) => {
        if(item.title === "Trang cá nhân") {
            navigate(`/profile/${auth.user.id}`)
        } else {
            navigate(item.path)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("token")
        window.location.href = "/login";
    }

    return (
        <div className="card h-screen flex flex-col justify-between py-5 bg-gray-100">
            <div className="space-y-8 pl-5">
                <div>
                    <span className="logo font-bold text-xl">FRIEND LINK</span>
                </div>
                <div className="space-y-8">
                    {sidebarMenu.map((item) => <div onClick={() => handleNavigate(item)} className="flex space-x-3 items-center cursor-pointer">
                        {item.icon}
                        <p className="text-lg">{item.title}</p>
                    </div>)}
                </div>
            </div>
            <div>
                <Divider/>
                <div className="flex flex-col justify-between pt-5 px-5">
                    <div className="flex items-center space-x-3">
                        <Avatar src={`${MINIO_BASE_URL}/${auth.user.userImage}`}/>
                        <div>
                            <p className="font-bold">{auth.user.fullName || auth.user.username}</p>
                            <p className="opacity-70">{auth.user.userEmail}</p>
                        </div>
                    </div>
                    <div className="flex items-center pt-3 gap-x-2">
                        <p className="opacity-70">Đăng xuất ở đây</p>
                        <IconButton onClick={() => setOpenConfirmDialog(true)}>
                                <LogoutIcon/>
                        </IconButton>
                    </div>
                </div>
            </div>
            <ConfirmLogoutDialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)} onConfirm={handleLogout} content={"Bạn có chắc chắn muốn đăng xuất không?"}/>
        </div>
    )
}

export default Sidebar