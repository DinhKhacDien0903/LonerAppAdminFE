import React, { useEffect, useState } from 'react';
import axios from 'axios';
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

const UserManage = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [deletedUserId, setDeletedUserId] = useState();

    const [filters, setFilters] = useState({
        username: '',
        fullName: '',
        userEmail: '',
    });
    const token = localStorage.getItem('token');
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const fetchData = async () => {
        try {
            const res = await axios.post(
                `${API_BASE_URL}/admin/get-all-user`,
                {
                    pageNumber: page,
                    pageSize: 10,
                    filter: filters,
                    common: '',
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            setUsers(res.data.content || []);
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
            const { data } = await axios.put(
                `${API_BASE_URL}/admin/delete-user/${userId}`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            toast.success(data.message);
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
                    label="Full Name"
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
                            <TableCell>Username</TableCell>
                            <TableCell>Ảnh</TableCell>
                            <TableCell>Họ tên</TableCell>
                            <TableCell>Ngày sinh</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Ngày tạo</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user, index) => (
                            <TableRow key={user.id}>
                                <TableCell>{page * 10 + index + 1}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>
                                    {user.userImage ? (
                                        <Avatar
                                            src={`${MINIO_BASE_URL}/${user.userImage}`}
                                            className="w-10 h-10 object-cover rounded-full"
                                        />
                                    ) : (
                                        'No image'
                                    )}
                                </TableCell>
                                <TableCell>{user.fullName}</TableCell>
                                <TableCell>{user.userDOB}</TableCell>
                                <TableCell>{user.userEmail}</TableCell>
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
                                        color="error"
                                        size="small"
                                        disabled={!user.isActive}
                                        onClick={() => {
                                            setDeletedUserId(user.id);
                                            setOpenConfirmDialog(true);
                                        }}
                                    >
                                        Xóa
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
                onConfirm={() => handleDeleteUser(deletedUserId)}
                content={'Bạn có chắc chắn muốn xóa người dùng không?'}
            />
        </div>
    );
};

export default UserManage;
