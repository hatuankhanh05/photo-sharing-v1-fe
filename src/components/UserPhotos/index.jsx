import React, { useState, useEffect, useContext } from "react";
import { Typography, Card, CardMedia, CardContent, List, ListItem, ListItemText, Divider, Button, Box, TextField } from "@mui/material"; // Bổ sung: Import Button và Box cho Stepper

import "./styles.css";
import { useParams, Link, useNavigate } from "react-router-dom";
// import models from "../../modelData/models";
import fetchModel from "../../lib/fetchModelData";
import { AdvancedFeaturesContext } from "../../App";

import axiosClient from "../../api/axiosClient";

/**
 * Define UserPhotos, a React component of Project 4.
 */
function UserPhotos () {
    const user = useParams();
    const navigate = useNavigate();
    const { advancedFeatures } = useContext(AdvancedFeaturesContext);

    const [photos, setPhotos] = useState([]);

    const [newComments, setNewComments] = useState({});

    useEffect(() => {
        const loadPhotos = async () => {
            try {
                const response = await fetchModel(`/photo/photosOfUser/${user.userId}`);
                
                setPhotos(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách ảnh:", error);
            }
        };

        loadPhotos();
    }, [user.userId]);

    let currentIndex = 0;
    if (user.photoId && photos.length > 0) {
        const foundIndex = photos.findIndex(p => p._id === user.photoId);
        if (foundIndex !== -1) currentIndex = foundIndex;
    }

    const handleNext = () => {
        if (currentIndex < photos.length - 1) {
            const nextPhotoId = photos[currentIndex + 1]._id;
            navigate(`/photos/${user.userId}/${nextPhotoId}`);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            const prevPhotoId = photos[currentIndex - 1]._id;
            navigate(`/photos/${user.userId}/${prevPhotoId}`);
        }
    };

    const handleCommentChange = (photoId, text) => {
        setNewComments(prev => ({
            ...prev,
            [photoId]: text
        }))
    };

    const handleAddComment = async (photoId) => {
        const commentText = newComments[photoId];

        if (!commentText || commentText.trim() === "") {
            alert("Vui lòng nhập nội dung bình luận");
            return;
        }

        try {
            await axiosClient.post(`/photo/commentsOfPhoto/${photoId}`, {comment: commentText});

            const updatedPhotoResponse = await fetchModel(`/photo/photosOfUser/${user.userId}`);
            setPhotos(updatedPhotoResponse.data);

            setNewComments(prev => ({...prev, [photoId]: ""}));
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Đã xảy ra lỗi khi thêm bình luận");
        }
    };

    const renderPhotoCard = (photo, isStepper = false) => (
        <Card key={photo._id} sx={{ mb: isStepper ? 2 : 4 }}>
            <CardMedia
                component="img"
                image={`http://localhost:8080/images/${photo.file_name}`}
                alt="User upload"
                sx={{ maxHeight: 500, objectFit: "contain", backgroundColor: "#f5f5f5" }}
            />
            <CardContent>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                    Posted on: {new Date(photo.date_time).toLocaleString()}
                </Typography>

                {photo.comments && photo.comments.length > 0 && (
                    <>
                        <Typography variant="h6" sx={{ mt: 2 }}>Comments:</Typography>
                        <List>
                            {photo.comments.map((comment) => (
                                <React.Fragment key={comment._id}>
                                    <ListItem alignItems="flex-start">
                                        <ListItemText
                                            primary={
                                                <Link to={`/users/${comment.user._id}`}>
                                                    {comment.user.first_name} {comment.user.last_name}
                                                </Link>
                                            }
                                            secondary={
                                                <>
                                                    <Typography component="span" variant="body2" color="text.primary">
                                                        {new Date(comment.date_time).toLocaleString()} - 
                                                    </Typography>
                                                    {" " + comment.comment}
                                                </>
                                            }
                                        />
                                    </ListItem>
                                    <Divider component="li" />
                                </React.Fragment>
                            ))}
                        </List>
                    </>
                )}

                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <TextField
                        fullWidth
                        multiline
                        rows={2}
                        placeholder="Add a comment..."
                        variant="outlined"
                        value={newComments[photo._id] || ""}
                        onChange={(e) => handleCommentChange(photo._id, e.target.value)}
                    />
                    <Button 
                        variant="contained" 
                        color="primary" 
                        sx={{ alignSelf: 'flex-end' }}
                        onClick={() => handleAddComment(photo._id)}
                        disabled={!newComments[photo._id] || newComments[photo._id].trim() === ""} // Disable nút nếu chưa gõ gì
                    >
                        Post Comment
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <div>

            {photos.length > 0 ? (
                advancedFeatures ? (
                    <Box>
                        {renderPhotoCard(photos[currentIndex], true)}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                            <Button 
                                variant="contained" 
                                onClick={handlePrev} 
                                disabled={currentIndex === 0}
                            >
                                Previous
                            </Button>
                            <Button 
                                variant="contained" 
                                onClick={handleNext} 
                                disabled={currentIndex === photos.length - 1}
                            >
                                Next
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    <Box>
                        {photos.map((photo) => renderPhotoCard(photo))}
                    </Box>
                )
            ) : (
                <Typography variant="body1">No photos available for this user.</Typography>
            )}
        </div>
    );
}

export default UserPhotos;