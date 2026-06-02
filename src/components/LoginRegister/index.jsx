import React, { useState } from "react";
import { Typography, TextField, Button, Box, Alert, Paper, Link } from "@mui/material";
import axiosClient from "../../api/axiosClient";

function LoginRegister({ onLogin }) {
  const [isLoginView, setIsLoginView] = useState(true);

  const [loginName, setLoginName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [regData, setRegData] = useState({
    login_name: "", password: "", first_name: "", last_name: "",
    location: "", description: "", occupation: ""
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setLoginError("");
    setRegError("");
    setRegSuccess("");
    setConfirmPassword("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosClient.post("/auth/admin/login", {
        login_name: loginName,
        password: loginPassword, 
      });
      onLogin(response.data);
    } catch (err) {
      setLoginError(err.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  const handleRegisterChange = (e) => {
    setRegData({ ...regData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (regData.password !== confirmPassword) {
      setRegError("Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại!");
      return;
    }

    try {
      await axiosClient.post("/auth/user", regData);
      setRegSuccess("Đăng ký thành công! Bạn có thể chuyển sang trang Đăng nhập.");
      setRegError("");
      
      setRegData({
        login_name: "", password: "", first_name: "", last_name: "",
        location: "", description: "", occupation: ""
      });
      setConfirmPassword(""); 
    } catch (err) {
      setRegError(err.response?.data?.message || "Đăng ký thất bại");
      setRegSuccess("");
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8, px: 2 }}>
      <Paper elevation={3} sx={{ padding: 4, width: '100%', maxWidth: 500 }}>
        
        {isLoginView ? (
          <Box>
            <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
              Login
            </Typography>
            
            {loginError && <Alert severity="error" sx={{ mb: 2 }}>{loginError}</Alert>}
            
            <form onSubmit={handleLogin}>
              <TextField 
                fullWidth label="Login Name" variant="outlined" margin="normal"
                value={loginName} onChange={(e) => setLoginName(e.target.value)} required 
              />
              <TextField 
                fullWidth label="Password" type="password" variant="outlined" margin="normal"
                value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required 
              />
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3, py: 1.5 }}>
                Login
              </Button>
            </form>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2">
                Don't have an account?{" "}
                <Link component="button" variant="body2" onClick={toggleView} sx={{ fontWeight: 'bold' }}>
                  Join us now!
                </Link>
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box>
            <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
              Register
            </Typography>
            
            {regError && <Alert severity="error" sx={{ mb: 2 }}>{regError}</Alert>}
            {regSuccess && <Alert severity="success" sx={{ mb: 2 }}>{regSuccess}</Alert>}
            
            <form onSubmit={handleRegister}>
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <TextField 
                  fullWidth label="First Name" name="first_name" variant="outlined" margin="dense"
                  value={regData.first_name} onChange={handleRegisterChange} required 
                />
                <TextField 
                  fullWidth label="Last Name" name="last_name" variant="outlined" margin="dense"
                  value={regData.last_name} onChange={handleRegisterChange} required 
                />
              </Box>
              
              <TextField 
                fullWidth label="Login Name" name="login_name" variant="outlined" margin="dense"
                value={regData.login_name} onChange={handleRegisterChange} required 
              />
              
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <TextField 
                  fullWidth label="Password" name="password" type="password" variant="outlined" margin="dense"
                  value={regData.password} onChange={handleRegisterChange} required 
                />

                <TextField 
                  fullWidth label="Confirm Password" type="password" variant="outlined" margin="dense"
                  value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required 
                />
              </Box>

              <TextField 
                fullWidth label="Location" name="location" variant="outlined" margin="dense"
                value={regData.location} onChange={handleRegisterChange} 
              />
              <TextField 
                fullWidth label="Description" name="description" variant="outlined" margin="dense"
                value={regData.description} onChange={handleRegisterChange} 
              />
              <TextField 
                fullWidth label="Occupation" name="occupation" variant="outlined" margin="dense"
                value={regData.occupation} onChange={handleRegisterChange} 
              />
              
              <Button type="submit" variant="contained" color="success" fullWidth sx={{ mt: 3, py: 1.5 }}>
                Create account
              </Button>
            </form>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2">
                Already have an account?{" "}
                <Link component="button" variant="body2" onClick={toggleView} sx={{ fontWeight: 'bold' }}>
                  Return to login
                </Link>
              </Typography>
            </Box>
          </Box>
        )}

      </Paper>
    </Box>
  );
}

export default LoginRegister;