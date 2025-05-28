import React, { useEffect, useState } from 'react';
import {
    Avatar,
    Button,
    Card,
    CardContent,
    CardMedia,
    Typography,
    TextField,
    Pagination,
    IconButton,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
} from '@mui/material';
import axios from 'axios';
import { formatMessageTime } from '../../../utils/timeFormatter';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import ConfirmLogoutDialog from '../../../utils/ConfirmDialog';
import PostCardAdmin from './PostCardAdmin';

const PostManage = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        username: '',
        postCaption: '',
        isActive: true,
    });

    const token = localStorage.getItem('token');
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [deletedPostId, setDeletedPostId] = useState();
    const [selectedPost, setSelectedPost] = useState();
    const [openModal, setOpenModal] = useState(false);

    const fetchPosts = async () => {
        try {
            const res = await axios.post(
                'http://localhost:8081/api/admin/get-all-post',
                {
                    pageNumber: page,
                    pageSize: 9,
                    filter: filters,
                    common: '',
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            setPosts(res.data.content || []);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error('Lỗi khi lấy dữ liệu bài đăng', err);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [page]);

    const handleSearch = () => {
        setPage(0);
        fetchPosts();
    };

    const handleDeletePost = async (postId) => {
        try {
            const { data } = await axios.put(
                `${API_BASE_URL}/admin/delete-post/${postId}`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            toast.success(data.message);
            fetchPosts();
            setOpenConfirmDialog(false);
        } catch (err) {
            toast.error('Lỗi khi xóa bài đăng');
            console.log('Lỗi khi xóa bài đăng', err);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Quản lý bài đăng</h2>

            {/* Bộ lọc */}
            <div className="flex gap-4 mb-6">
                <TextField
                    label="Username"
                    size="small"
                    value={filters.username}
                    onChange={(e) => setFilters({ ...filters, username: e.target.value })}
                />
                <TextField
                    label="Caption"
                    size="small"
                    value={filters.postCaption}
                    onChange={(e) => setFilters({ ...filters, postCaption: e.target.value })}
                />
                <FormControl size="small">
                    <Select
                        value={filters.isActive}
                        onChange={(e) => setFilters({ ...filters, isActive: e.target.value })}
                        style={{
                            minWidth: 150,
                            backgroundColor: filters.isActive === true ? '#d4edda' : '#f8d7da',
                            color: filters.isActive === true ? '#155724' : '#721c24',
                        }}
                    >
                        <MenuItem value={true}>Đang hoạt động</MenuItem>
                        <MenuItem value={false}>Đã xóa</MenuItem>
                    </Select>
                </FormControl>
                <Button variant="contained" onClick={handleSearch}>
                    Tìm kiếm
                </Button>
            </div>

            {/* Danh sách bài đăng */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <Card key={post.postId} className="flex flex-col">
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center p-4">
                                <Avatar src={`${MINIO_BASE_URL}/${post.userImage}`} />
                                <div className="ml-3">
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {post.username}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {formatMessageTime(post.updatedAt)}
                                    </Typography>
                                </div>
                            </div>
                            {post.isActive && (
                                <IconButton
                                    color="error"
                                    size="small"
                                    className="absolute top-2 right-2"
                                    onClick={() => {
                                        setDeletedPostId(post.postId);
                                        setOpenConfirmDialog(true);
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            )}
                        </div>
                        {/* Ảnh hoặc video bài đăng */}
                        {post.postImage && (
                            <CardMedia
                                component="img"
                                image={`${MINIO_BASE_URL}/${post.postImage}`}
                                alt="Post image"
                                className="object-cover h-64"
                                onClick={() => {
                                    setSelectedPost(post);
                                    setOpenModal(true);
                                }}
                            />
                        )}
                        {post.postVideo && (
                            <video controls src={`${MINIO_BASE_URL}/${post.postVideo}`} className="object-cover h-64" />
                        )}

                        {/* Nội dung bài đăng */}
                        <CardContent>
                            <Typography variant="body1" className="mb-2">
                                {post.postCaption}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Phân trang */}
            <div className="mt-6 flex justify-end">
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
                onConfirm={() => handleDeletePost(deletedPostId)}
                content={'Bạn có chắc chắn muốn xóa bài đăng không?'}
            />
            <PostCardAdmin open={openModal} onClose={() => setOpenModal(false)} postItem={selectedPost} />
        </div>
    );
};

export default PostManage;
