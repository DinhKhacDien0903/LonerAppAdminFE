import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import NotificationsIcon from '@mui/icons-material/Notifications';
import GroupIcon from '@mui/icons-material/Group';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MessageIcon from '@mui/icons-material/Message';

export const sidebarMenu = [
    {
        title : "Trang chủ",
        icon : <HomeIcon/>,
        path : "/"
    },
    {
        title : "Khoảnh Khắc",
        icon : <ExploreIcon/>,
        path : "/reel"
    },
    {
        title : "Thông báo",
        icon : <NotificationsIcon/>,
        path : "/notification"
    },
    {
        title : "Tin Nhắn",
        icon : <MessageIcon/>,
        path : "/message"
    },
    {
        title : "Đang theo dõi",
        icon : <GroupIcon/>,
        path : "/community"
    },
    {
        title : "Trang cá nhân",
        icon : <AccountCircleIcon/>,
    }
]  