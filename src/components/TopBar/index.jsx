import React, { useState, useEffect, useContext } from "react"; 
import { AppBar, Toolbar, Typography, Box, FormControlLabel, Checkbox } from "@mui/material"; 

import "./styles.css";
import { useLocation } from "react-router-dom"; 
import models from "../../modelData/models";
import fetchModel from "../../lib/fetchModelData";
import { AdvancedFeaturesContext } from "../../App";

/**
 * Define TopBar, a React component of Project 4.
 */
function TopBar () {
    const location = useLocation();
    
    const [appContext, setAppContext] = useState("");

    const { advancedFeatures, setAdvancedFeatures } = useContext(AdvancedFeaturesContext);

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
                        } 
                        else if (viewType === "photos") {
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

    return (
      <AppBar className="topbar-appBar" position="absolute">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          
          <Box>
            <Typography variant="h6" color="inherit" sx={{ fontWeight: 'bold' }}>
              Hà Tuấn Khanh
            </Typography>

            <Typography variant="body2" color="inherit">
              This is the TopBar component
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={advancedFeatures}
                  onChange={(e) => setAdvancedFeatures(e.target.checked)}
                  color="default"
                  sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }}
                />
              }
              label="Enable Advanced Features"
              sx={{ mr: 4 }}
            />

            <Typography variant="h5" color="inherit">
              {appContext}
            </Typography>
          </Box>

        </Toolbar>
      </AppBar>
    );
}

export default TopBar;