import { useEffect, useState } from 'react';
import {
    List,
    ListItem,
    ListItemText,
    CardHeader,
    Box,
    Avatar,
    CardMedia,
    CardContent,
    Typography,
    ListItemAvatar,
    Modal,
} from '@mui/material';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { formatMessageTime } from '../../../utils/timeFormatter';

const PostCardAdmin = ({ open, onClose, postItem }) => {
    const [comments, setComments] = useState([]);
    const token = localStorage.getItem('token');
    const [hasMore, setHasMore] = useState(false);

    console.log('Post Item', postItem);
    useEffect(() => {
        if (open && postItem?.postId) {
            fetchComments(postItem.postId);
        }
    }, [open, postItem]);

    const fetchComments = async (postId) => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/post/get-comment-by-post/${postId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setComments(data.result);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const loadMoreComments = () => {
        if (comments.length >= 15) {
            setHasMore(false);
            return;
        }
    };

    if (!postItem) return null;

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 500,
                    borderRadius: '10px',
                    p: 2,
                    outline: 'none',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    bgcolor: 'white',
                    boxShadow: 24,
                }}
            >
                {/* Thông tin bài đăng */}
                <CardHeader
                    avatar={<Avatar src={`${MINIO_BASE_URL}/${postItem.userImage}`} />}
                    title={postItem.username}
                    subheader={formatMessageTime(postItem.updatedAt)}
                />
                <CardMedia
                    component="img"
                    sx={{ width: '100%', height: 'auto', maxHeight: '300px', objectFit: 'cover' }}
                    image={`${MINIO_BASE_URL}/${postItem.postImage}`}
                    alt=""
                />
                <CardContent>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {postItem.postCaption}
                    </Typography>
                </CardContent>

                {/* Danh sách bình luận */}
                <Box sx={{ maxHeight: '300px', overflowY: 'auto' }}>
                    <InfiniteScroll
                        dataLength={comments.length}
                        next={loadMoreComments}
                        hasMore={hasMore}
                        loader={<Typography align="center">Loading...</Typography>}
                        height={300}
                    >
                        <List>
                            {comments.map((comment) => (
                                <ListItem key={comment.commentId} alignItems="flex-start">
                                    <ListItemAvatar>
                                        <Avatar src={`${MINIO_BASE_URL}/${comment.userImage}`} />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={comment.username}
                                        secondary={
                                            <>
                                                <Typography
                                                    sx={{ display: 'inline' }}
                                                    component="span"
                                                    variant="body2"
                                                    color="text.primary"
                                                >
                                                    {comment.content}
                                                </Typography>
                                                <br />
                                                <Typography variant="caption" color="text.secondary">
                                                    {formatMessageTime(comment.updatedAt)}
                                                </Typography>
                                            </>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </InfiniteScroll>
                </Box>
            </Box>
        </Modal>
    );
};

export default PostCardAdmin;
