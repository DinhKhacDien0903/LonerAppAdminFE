import ReportIcon from '@mui/icons-material/Report';
import ArticleIcon from '@mui/icons-material/Article';
import PersonIcon from '@mui/icons-material/Person';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';

export const sidebarAdminMenu = [
    // {
    //     title: "Thống kê",
    //     icon: <LeaderboardIcon />,
    //     path: "/admin-dashboard"
    // },
    // {
    //     title : "Quản lý bài đăng",
    //     icon : <ArticleIcon/>,
    //     path : "/admin-post"
    // },
    {
        title: "Quản lý người dùng",
        icon: <PersonIcon />,
        path: "/admin/admin-user"
    },
    {
        title: "Báo cáo",
        icon: <ReportIcon />,
        path: "/admin/admin-report"
    },
]