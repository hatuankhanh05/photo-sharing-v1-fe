import React, { useState, useEffect, useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
  Button,
} from "@mui/material";

import "./styles.css";
import { useLocation, useNavigate } from "react-router-dom";
// import models from "../../modelData/models";
import fetchModel from "../../lib/fetchModelData";
import { AdvancedFeaturesContext } from "../../App";

import axiosClient from "../../api/axiosClient";
/**
 * Define TopBar, a React component of Project 4.
 */
function TopBar({ currentUser, setCurrentUser }) {
  const location = useLocation();

  const navigate = useNavigate();

  const [appContext, setAppContext] = useState("");

  const { advancedFeatures, setAdvancedFeatures } = useContext(
    AdvancedFeaturesContext,
  );

  useEffect(() => {
    const path = location.pathname;
    const pathParts = path.split("/");

    if (pathParts.length >= 3) {
      const viewType = pathParts[1];
      const userId = pathParts[2];

      const loadUserContext = async () => {
        try {
          const response = await fetchModel(`/user/${userId}`);
          const user = response.data;

          if (user) {
            if (viewType === "users") {
              setAppContext(`${user.first_name} ${user.last_name}`);
            } else if (viewType === "photos") {
              setAppContext(`Photos of ${user.first_name} ${user.last_name}`);
            }
          }
        } catch (error) {
          console.error("Lỗi khi lấy thông tin user cho TopBar:", error);
        }
      };

      loadUserContext();
    } else {
      setAppContext("");
    }
  }, [location.pathname]);

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    console.log("File chuẩn bị upload:", file);

    const formData = new FormData();
    formData.append("photo", file);

    try {
      await axiosClient.post("/photo/new", formData);

      alert("Upload photo successfully!");

      navigate(`/photos/${currentUser._id}`);

      if (location.pathname === `/photos/${currentUser._id}`) {
        window.location.reload();
      }
    } catch (err) {
      console.error("Lỗi khi upload ảnh:", err);
      alert(err.response?.data?.message || "Failed to upload photo");
    }
  };

  const handleLogout = async () => {
    try {
      await axiosClient.post("/auth/admin/logout");
      setCurrentUser(null);
    } catch (err) {
      console.log("Lỗi khi đăng xuất:", err);
    }
  };

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box>
          <Typography variant="h6" color="inherit" sx={{ fontWeight: "bold" }}>
            {currentUser ? `Hi ${currentUser.first_name}` : "Please login"}
          </Typography>

          <Typography variant="body2" color="inherit">
            This is the TopBar component
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={advancedFeatures}
                onChange={(e) => setAdvancedFeatures(e.target.checked)}
                color="default"
                sx={{ color: "white", "&.Mui-checked": { color: "white" } }}
              />
            }
            label="Enable Advanced Features"
            sx={{ mr: 4 }}
          />

          <Typography variant="h5" color="inherit">
            {appContext}
          </Typography>

          {currentUser && (
            <Box sx={{ display: "flex", gap: 2, ml: 2 }}>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                id="topbar-upload-file-button"
                onChange={handlePhotoUpload}
              />
              <label htmlFor="topbar-upload-file-button">
                <Button variant="contained" color="success" component="span">
                  Add Photo
                </Button>
              </label>

              <Button
                variant="contained"
                color="secondary"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
