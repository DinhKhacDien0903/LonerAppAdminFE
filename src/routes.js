import OnlySidebarDefault from '~/layouts/OnlySidebarLayout';
import AdminLayout from '~/layouts/AdminLayout';
import HeaderSidebarLayout from '~/layouts/HeaderSidebarLayout';

import Home from '~/pages/Home';
import Search from '~/pages/Search';
import Login from '~/pages/Login';
import Profile from '~/pages/Profile';
import ManagePost from '~/pages/Admin/ManagePost';
import FriendRequests from '~/pages/Friends/FriendRequests';
import MyFriends from '~/pages/Friends/MyFriends';
import SentFriendRequests from '~/pages/Friends/SentFriendRequests';
import HomePageAdmin from '~/pages/Home/AdminPage/HomePageAdmin';

const routes = [
    { path: '/', component: Home },
    { path: '/search', component: Search, layout: OnlySidebarDefault },
    { path: '/login', component: Login, layout: null },
    { path: '/profile/:userId', component: Profile, layout: OnlySidebarDefault },
    { path: '/friends', component: MyFriends, layout: HeaderSidebarLayout },
    { path: '/friends/requests', component: FriendRequests, layout: HeaderSidebarLayout },
    { path: '/friends/sent-requests', component: SentFriendRequests, layout: HeaderSidebarLayout },
    { path: '/admin-user', component: SentFriendRequests, layout: HeaderSidebarLayout },
    { path: '/admin-report', component: SentFriendRequests, layout: HeaderSidebarLayout },
];

export const protectedRoutes = [
    { path: '/admin/*', component: HomePageAdmin, layout: AdminLayout }
];

export default routes;
