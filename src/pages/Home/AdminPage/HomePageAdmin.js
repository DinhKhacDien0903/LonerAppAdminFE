import React from "react";
import SidebarAdmin from "~/components/SidebarFake/SidebarAdmin";
import { Grid } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import PostApprove from "./AdminReport";
import PostManage from "./PostManage";
import UserManage from "./UserManage";
import { ToastContainer } from "react-toastify";
import Dashboard from "./DashBoard";
import AdminReport from "./AdminReport";

const HomePageAdmin = () => {
    const routes = (
        <Routes>
            <Route index element={<UserManage />} /> {/* Đây là route mặc định */}
            {/* <Route path="/admin-user" element={<Dashboard />} /> */}
            {/* <Route path="/admin-post" element={<PostManage />} /> */}
            <Route path="/admin-user" element={<UserManage />} />
            <Route path="/admin-report" element={<AdminReport />} />
        </Routes>
    );

    return (
        <div className="px-10">
            <Grid container spacing={0} display="flex" justifyContent="space-between">
                <Grid item xs={0} lg={3}>
                    <div className="sticky top-0">
                        <SidebarAdmin />
                    </div>
                </Grid>
                <Grid lg={9} sx={{ width: "80%", height: "100%" }} item className="px-5">
                    {routes}
                </Grid>
            </Grid>
            <ToastContainer />
        </div>
    )
}

export default HomePageAdmin