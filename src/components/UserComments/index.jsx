import React, { useState, useEffect } from "react";
import { Typography, Card, CardContent, CardMedia, Divider, Paper } from "@mui/material";
import { useParams, Link } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

function UserComments() {
    const { userId } = useParams();
    const [comments, setComments] = useState([]);
    const [userName, setUserName] = useState("");

    useEffect(() => {
        const loadComments = async () => {
            try {
                const userRes = await fetchModel(`/user/${userId}`);
                setUserName(`${userRes.data.first_name} ${userRes.data.last_name}`);

                const commentRes = await fetchModel(`/user/commentsOfUser/${userId}`);
                setComments(commentRes.data);
            } catch (error) {
                console.error("Lỗi lấy bình luận:", error);
            }
        };
        loadComments();
    }, [userId]);

    return (
        <Paper elevation={3} sx={{ padding: 3, margin: 'auto', maxWidth: 800 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                Comments by {userName}
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {comments.length === 0 ? (
                <Typography>Người dùng này chưa viết bình luận nào.</Typography>
            ) : (
                comments.map((item) => {
                    // const ownerId = item.photo.owner._id || item.photo.owner;

                    return (
                    <Card key={item._id} sx={{ display: 'flex', mb: 3, alignItems: 'center', p: 2 }}>
                        <Link to={`/photos/${item.photo.owner._id}/${item.photo._id}`}>
                            <CardMedia
                                component="img"
                                sx={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 1, cursor: 'pointer' }}
                                image={`http://localhost:8080/images/${item.photo.file_name}`}
                                alt="Thumbnail"
                            />
                        </Link>
                        
                        <CardContent sx={{ flex: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                                {new Date(item.date_time).toLocaleString()}
                            </Typography>
                            <Link to={`/photos/${item.photo.owner._id}/${item.photo._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <Typography variant="body1" sx={{ mt: 1, cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>
                                    "{item.comment}"
                                </Typography>
                            </Link>
                        </CardContent>
                    </Card>
                );})
            )}
        </Paper>
    );
}

export default UserComments;