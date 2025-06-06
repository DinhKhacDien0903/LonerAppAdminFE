import Header from '~/components/Header';
import SidebarAdmin from "~/components/SidebarFake/SidebarAdmin";

const AdminLayout = ({ children }) => {
    return (
        <div>
            <Header />
            <div className="d-flex">
                <SidebarAdmin />
                {children}
            </div>
        </div>
    );
};

export default AdminLayout;
