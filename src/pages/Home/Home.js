// import { useEffect, useRef, useState } from 'react';
// import Post from '~/components/Post';
// import WritePost from '~/components/WritePost';
// import { getAllPostsService } from '~/services/postServices';
// import signalRClient from '~/components/Post/signalRClient';
// import clsx from 'clsx';
// import styles from './Home.module.scss';

// const Home = () => {
//     const [posts, setPosts] = useState([]);
//     const [hasMore, setHasMore] = useState(true);
//     const [page, setPage] = useState(1);

//     const observer = useRef();

//     useEffect(() => {
//         const fetchAllPosts = async () => {
//             try {
//                 const res = await getAllPostsService(page, 10);

//                 setPosts((prevPosts) => [
//                     ...prevPosts,
//                     ...res.data.map((post) => ({
//                         id: post.postID,
//                         posterId: post.userID,
//                         firstName: post.firstName,
//                         lastName: post.lastName,
//                         avatar: post.avatarUrl,
//                         content: post.content,
//                         createdAt: post.createdAt,
//                         pictures:
//                             post.images?.length > 0
//                                 ? post.images.map((image) => ({
//                                       pictureUrl: image?.imgUrl,
//                                   }))
//                                 : [],
//                         currentEmotionId: post.userReaction?.emotionTypeID || null,
//                         currentEmotionName: post.userReaction?.emotionName || null,
//                         emotions: post?.reactions?.map((emo) => ({
//                             id: emo?.reactionID,
//                             emotion: {
//                                 id: emo?.emotionTypeID,
//                                 name: emo?.emotionName,
//                             },
//                             userInfo: {
//                                 id: emo?.userID,
//                             },
//                         })),
//                     })),
//                 ]);

//                 setHasMore(res.data.length > 0);
//             } catch (error) {
//                 console.error(error);
//             }
//         };

//         fetchAllPosts();
//     }, [page]);

//     useEffect(() => {
//         const startSignalR = () => {
//             signalRClient.on('ReceivePost', (newPost) => {
//                 setPosts((prevPosts) => [
//                     {
//                         id: newPost.postID,
//                         posterId: newPost.userID,
//                         firstName: newPost.firstName,
//                         lastName: newPost.lastName,
//                         avatar: newPost.avatarUser,
//                         content: newPost.content,
//                         createdAt: newPost.createdAt,
//                         pictures:
//                             newPost.images?.length > 0
//                                 ? newPost.images.map((image) => ({ pictureUrl: image.imgUrl }))
//                                 : [],
//                         currentEmotionId: newPost.userReaction?.emotionTypeID || null,
//                         currentEmotionName: newPost.userReaction?.emotionName || null,
//                         emotions: newPost.reactions?.map((emo) => ({
//                             id: emo.reactionID,
//                             emotion: {
//                                 id: emo.emotionTypeID,
//                                 name: emo.emotionName,
//                             },
//                             userInfo: { id: emo.userID },
//                         })),
//                     },
//                     ...prevPosts,
//                 ]);
//             });
//         };

//         startSignalR();

//         return () => {
//             signalRClient.off('ReceivePost');
//         };
//     }, []);

//     const lastPostRef = (node) => {
//         if (observer.current) observer.current.disconnect();

//         observer.current = new IntersectionObserver((entries) => {
//             if (entries[0].isIntersecting && hasMore) {
//                 setPage((prevPage) => prevPage + 1);
//             }
//         });

//         if (node) observer.current.observe(node);
//     };

//     return (
//         <div className={clsx('d-flex mt-5', styles['home-wrapper'])}>
//             <div>
//                 <WritePost />
//                 {posts.length === 0 ? (
//                     <div className="text-center fz-16">
//                         <div>Hãy kết bạn để xem những bài viết thú vị hơn</div>
//                     </div>
//                 ) : (
//                     posts.map((post, index) => (
//                         <div key={`post-${post.id}`} ref={index === posts.length - 1 ? lastPostRef : null}>
//                             <Post postInfo={post} />
//                         </div>
//                     ))
//                 )}
//             </div>
//         </div>
//         // <div style={{ position: 'relative', backgroundColor: 'blue' }}>
//         //     <div style={{ backgroundColor: 'red', width: '300px', height: '300px' }}>
//         //         <div
//         //             style={{
//         //                 position: 'absolute',
//         //                 backgroundColor: 'green',
//         //                 width: '30px',
//         //                 height: '30px',
//         //                 top: '-20px',
//         //                 left: '-20px',
//         //             }}
//         //         ></div>
//         //     </div>
//         // </div>
//     );
// };

// export default Home;
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, TextField, Button, Pagination
} from "@mui/material";
import { formatMessageTime } from "../../utils/timeFormatter";
import ConfirmLogoutDialog from "../../utils/ConfirmDialog";

const AdminReport = () => {
    const [reports, setReports] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        reportedPostCaption: "",
        reportedUsername: "",
        senderUsername: ""
    });
    const token = localStorage.getItem("token");
    const [deletedReportId, setDeletedReportId] = useState();
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const fetchReport = async () => {
        try {
            const res = await axios.post(`${API_BASE_URL}/report/get-all`, {
                pageNumber: page,
                pageSize: 10,
                filter: filters,
                common: ""
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setReports(res.data.content || []);
            setTotalPages(res.data.totalPages);
        } catch(err) {
            toast.error("Có lỗi khi lấy danh sách báo cáo");
        }
    };

    useEffect(() => {
        fetchReport();
    }, [page]);

    const handleSearch = () => {
        setPage(0);
        fetchReport();
    };

    const handleDeleteReport = async(reportId) => {
        try {
            const {data} = await axios.put(`${API_BASE_URL}/report/delete/${reportId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(data.message);
            fetchReport();
            setOpenConfirmDialog(false)
        } catch (err) {
            toast.error("Lỗi khi xóa báo cáo");
        }
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Quản lý báo cáo người dùng</h2>

            <div className="flex gap-4 mb-4">
                <TextField
                    label="Nội dung bài viết"
                    size="small"
                    value={filters.reportedPostCaption}
                    onChange={(e) => setFilters({ ...filters, reportedPostCaption: e.target.value })}
                />
                <TextField
                    label="Người bị báo cáo"
                    size="small"
                    value={filters.reportedUsername}
                    onChange={(e) => setFilters({ ...filters, reportedUsername: e.target.value })}
                />
                <TextField
                    label="Người gửi báo cáo"
                    size="small"
                    value={filters.senderUsername}
                    onChange={(e) => setFilters({ ...filters, senderUsername: e.target.value })}
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
                            <TableCell>Thời gian</TableCell>
                            <TableCell>Lý do</TableCell>
                            <TableCell>Bài viết (ID)</TableCell>
                            <TableCell>Tiêu đề</TableCell>
                            <TableCell>Người bị báo cáo</TableCell>
                            <TableCell>Người gửi</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reports.map((report, index) => (
                            <TableRow key={report.reportId}>
                                <TableCell>{page * 10 + index + 1}</TableCell>
                                <TableCell>{formatMessageTime(report.createdAt)}</TableCell>
                                <TableCell>{report.reason}</TableCell>
                                <TableCell>{report.reportedPostId || "N/A"}</TableCell>
                                <TableCell>{report.reportedPostCaption || "N/A"}</TableCell>
                                <TableCell>{report.reportedUsername}</TableCell>
                                <TableCell>{report.senderUsername}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        onClick={() => {setDeletedReportId(report.reportId); setOpenConfirmDialog(true);}}
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
            <ConfirmLogoutDialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)} onConfirm={() => handleDeleteReport(deletedReportId)} content={"Bạn có chắc chắn muốn báo cáo này không?"}/>
        </div>
    )
}

export default AdminReport