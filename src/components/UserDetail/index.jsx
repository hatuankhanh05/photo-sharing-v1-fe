import React, { useState, useEffect } from "react";
import { Typography, Button, Card, CardContent } from "@mui/material";

import "./styles.css";
import { useParams, Link } from "react-router-dom";
import models from "../../modelData/models";
import fetchModel from "../../lib/fetchModelData";

/**
 * Define UserDetail, a React component of Project 4.
 */
function UserDetail() {
    const user = useParams();
    
    const [userDetail, setUserDetail] = useState(null);

    useEffect(() => {
        const loadUserDetail = async () => {
            try {
                const response = await fetchModel(`/user/${user.userId}`);
                
                setUserDetail(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy chi tiết người dùng:", error);
            }
        };

        loadUserDetail();
    }, [user.userId]);

    return (
        <>
          <Typography variant="body1">
            This should be the UserDetail view of the PhotoShare app. Since it is
            invoked from React Router the params from the route will be in property match.
            So this should show details of user: {user.userId}.
            You can fetch the model for the user from models.userModel.
          </Typography>

          {userDetail && (
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  {userDetail.first_name} {userDetail.last_name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  <strong>Location:</strong> {userDetail.location}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  <strong>Occupation:</strong> {userDetail.occupation}
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Description:</strong> {userDetail.description}
                </Typography>

                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to={`/photos/${user.userId}`}
                >
                  View Photos
                </Button>
              </CardContent>
            </Card>
          )}
        </>
    );
}

export default UserDetail;