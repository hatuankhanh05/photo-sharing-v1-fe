import './App.css';

import React, { useState, createContext } from "react";
import { Grid, Paper } from "@mui/material";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from './components/LoginRegister';
import UserComments from './components/UserComments';

export const AdvancedFeaturesContext = createContext();

const App = (props) => {
  const [advancedFeatures, setAdvancedFeatures] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  return (
      <AdvancedFeaturesContext.Provider value={{ advancedFeatures, setAdvancedFeatures }}>
        <Router>
          <div>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TopBar currentUser={currentUser} setCurrentUser={setCurrentUser}/>
              </Grid>
              <div className="main-topbar-buffer" />
              <Grid item sm={3}>
                <Paper className="main-grid-item">
                  {currentUser && <UserList />}
                </Paper>
              </Grid>
              <Grid item sm={9}>
                <Paper className="main-grid-item">
                  <Routes>
                  {currentUser ? (
                    <>

                  <Route
                      path="/users/:userId"
                      element = {<UserDetail />}
                  />
                  <Route
                      path="/photos/:userId"
                      element = {<UserPhotos />}
                  />
                  <Route
                      path="/photos/:userId/:photoId"
                      element = {<UserPhotos />}
                  />
                  <Route path="/users" element={<UserList />} />
                  <Route path="/comments/:userId" element={<UserComments />} />
                  <Route path="/login" element={<Navigate to={`/users/${currentUser._id}`} replace/>}/>
                    </>
                  ) :
                  (
                    <>
                      <Route
                        path="/login"
                        element={<LoginRegister onLogin={(user) => setCurrentUser(user)}/>}
                      />
                      <Route path="*" element={<Navigate to="/login" replace/>}/>
                    </>
                  )}
                  </Routes>
                </Paper>
              </Grid>
            </Grid>
          </div>
        </Router>
      </AdvancedFeaturesContext.Provider>
  );
}

export default App;