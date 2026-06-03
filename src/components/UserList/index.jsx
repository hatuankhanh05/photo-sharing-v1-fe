import React, { useState, useEffect } from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Box,
  Chip
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

import "./styles.css";
// import models from "../../modelData/models";
import fetchModel from "../../lib/fetchModelData";

/**
 * Define UserList, a React component of Project 4.
 */
function UserList () {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
      const loadUsers = async () => {
        try {
          const response = await fetchModel("/user/list");
          
          setUsers(response.data);
        } catch (error) {
          console.error("Lỗi khi lấy danh sách user:", error);
        }
      };

      loadUsers();
    }, []);

    const handleCommentBubbleClick = (e, userId) => {
      e.preventDefault();
      e.stopPropagation();
      navigate(`/comments/${userId}`);
    };

    return (
      <div>
        <List component="nav">
          {users.map((user) => (
            <React.Fragment key={user._id}>
              <ListItem button component={Link} to={`/users/${user._id}`}>
                      <ListItemText primary={`${user.first_name} ${user.last_name}`}/>

                      <Box sx={{ display: 'flex', gap: 1 }}>
                                <Chip 
                                    label={user.photoCount || 0} 
                                    size="small" 
                                    sx={{ backgroundColor: '#4caf50', color: 'white', fontWeight: 'bold' }} 
                                />
                                <Chip 
                                    label={user.commentCount || 0} 
                                    size="small" 
                                    sx={{ backgroundColor: '#f44336', color: 'white', fontWeight: 'bold', cursor: 'pointer' }} 
                                    onClick={(e) => handleCommentBubbleClick(e, user._id)}
                                />
                            </Box>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </div>
    );
}

export default UserList;