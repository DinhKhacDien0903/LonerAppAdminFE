import React, { useEffect, useState } from 'react';
import {
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableContainer,
    Paper,
    Pagination,
    Avatar,
} from '@mui/material';
import { formatMessageTime } from '../../../utils/timeFormatter';
import { toast } from 'react-toastify';
import ConfirmLogoutDialog from '../../../utils/ConfirmDialog';
import { getAllUserForAdmin, setAccountLockStateAsync } from '../../../services/userServices';

const UserManage = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [actionUserId, setActionUserId] = useState();
    const [isActionDetete, setIsActionDelete] = useState(true);

    const [filters, setFilters] = useState({
        username: '',
        fullName: '',
        userEmail: '',
    });
    const token = localStorage.getItem('token');
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const fetchData = async () => {
        try {
            const res = await getAllUserForAdmin(filters.username, filters.fullName, filters.userEmail, page, 30);
            setUsers(res.data.items || []);
            console.log('Dữ liệu người dùng:', res.data.items);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error('Lỗi khi lấy dữ liệu người dùng', err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page]);

    const handleSearch = () => {
        setPage(0);
        fetchData();
    };

    const handleDeleteUser = async (userId) => {
        try {
            var result = await setAccountLockStateAsync({ userId, isDeleted: isActionDetete });
            if (result.isSuccess)
                toast.success(result.message);
            else
                toast.error(result.message);
            fetchData();
            setOpenConfirmDialog(false);
        } catch (err) {
            toast.error('Lỗi khi xóa người dùng');
            console.log('Lỗi khi xóa người dùng', err);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Quản lý người dùng</h2>
            <div className="flex gap-4 mb-4">
                <TextField
                    label="Username"
                    size="small"
                    value={filters.username}
                    onChange={(e) => setFilters({ ...filters, username: e.target.value })}
                />
                <TextField
                    label="Số điện thoại"
                    size="small"
                    value={filters.fullName}
                    onChange={(e) => setFilters({ ...filters, fullName: e.target.value })}
                />
                <TextField
                    label="Email"
                    size="small"
                    value={filters.userEmail}
                    onChange={(e) => setFilters({ ...filters, userEmail: e.target.value })}
                />
                <Button variant="contained" onClick={handleSearch}>
                    Tìm kiếm
                </Button>
            </div>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead className="bg-gray-100">
                        <TableRow>
                            <TableCell>STT</TableCell>
                            <TableCell>User Name</TableCell>
                            <TableCell>Ảnh</TableCell>
                            <TableCell>Họ tên</TableCell>
                            <TableCell>Ngày sinh</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Số điện thoại</TableCell>
                            <TableCell>Ngày tạo</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user, index) => (
                            <TableRow key={user.id}>
                                <TableCell>{page * 30 + index + 1}</TableCell>
                                <TableCell>{user.userName}</TableCell>
                                <TableCell>
                                    {user.avatarUrl ? (
                                        <Avatar
                                            src={user.avatarUrl}
                                            className="w-10 h-10 object-cover rounded-full"
                                        />
                                    ) : (
                                        'No image'
                                    )}
                                </TableCell>
                                <TableCell>{user.fullName}</TableCell>
                                <TableCell>{formatMessageTime(user.dateOfBirth)}</TableCell>
                                <TableCell>{user.email ?? "Chưa thiết lập"}</TableCell>
                                <TableCell>{user.phoneNumber ?? "Chưa thiết lập"}</TableCell>
                                <TableCell>{formatMessageTime(user.createdAt)}</TableCell>
                                <TableCell>
                                    <div
                                        className={`w-8 h-4 rounded-full mx-auto ${user.isActive ? 'bg-green-500' : 'bg-red-500'
                                            }`}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color={user.isDeleted ? "info" : "error"}
                                        size="small"
                                        onClick={() => {
                                            setActionUserId(user.id);
                                            setIsActionDelete(!user.isDeleted);
                                            setOpenConfirmDialog(true);
                                        }}
                                    >
                                        {user.isDeleted == true ? "Mở khóa" : "Khóa"}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <div className="mt-4 flex justify-end">
                <Pagination
                    count={totalPages}
                    page={page + 1}
                    onChange={(e, value) => setPage(value - 1)}
                    color="primary"
                />
            </div>
            <ConfirmLogoutDialog
                open={openConfirmDialog}
                onClose={() => setOpenConfirmDialog(false)}
                onConfirm={() => handleDeleteUser(actionUserId)}
                content={isActionDetete ? 'Bạn có chắc chắn muốn khóa người dùng không?' : "Bạn có chắc chắn muốn mở khóa người dùng này không?"}
            />
        </div>
    );
};

export default UserManage;
