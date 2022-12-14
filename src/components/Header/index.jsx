import React, { useState, useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Tooltip,
  MenuItem,
  Stack,
} from "@mui/material/";
import MenuIcon from "@mui/icons-material/Menu";
import UserContext from "../../context/UserContext";

const pages = [
  { page: "Монголоос мөнгө шилжүүлэх", path: "/montokor" },
  { page: "Солонгосоос мөнгө шилжүүлэх", path: "/kortomon" },
];

const linkStyle = {
  color: "white",
  textTransform: "uppercase",
  cursor: "pointer",
};
const linkStyle2 = {
  color: "black",
  textTransform: "uppercase",
  cursor: "pointer",
};

const Header = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const userContext = useContext(UserContext);
  const [currentUser, setCurrentUser] = useState(false);
  const [state, setState] = useState({});
  const history = useHistory();

  useEffect(() => {
    setState(userContext.state);
    setCurrentUser(userContext.state.currentUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userContext.state.currentUser]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const signOut = () => {
    userContext.signOutUser();
    history.push("/");
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {currentUser && (
            <Box sx={{ flexGrow: 15, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page.page}>
                    <Link to={page.path} style={linkStyle2}>
                      {page.page}
                    </Link>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
          {currentUser && (
            <Box sx={{ flexGrow: 20, display: { xs: "none", md: "flex" } }}>
              <Stack direction="row" alignItems="center">
                {pages.map((page) => (
                  <MenuItem key={page.page}>
                    <Link to={page.path} style={linkStyle}>
                      {page.page}
                    </Link>
                  </MenuItem>
                ))}
              </Stack>
            </Box>
          )}
          <Box sx={{ flexGrow: 1 }}>
            {currentUser && (
              <Stack direction="row" spacing={3} alignItems="center">
                <Link to="/profile" style={linkStyle}>
                  <Tooltip title="Зураг">
                    <IconButton sx={{ p: 0 }}>
                      <Avatar alt={state.displayName} src={state.photoURL} />
                    </IconButton>
                  </Tooltip>
                </Link>
                <Link to="/profile" style={linkStyle}>
                  {state.displayName}
                </Link>
                <Typography onClick={() => signOut()} style={linkStyle}>
                  Гарах
                </Typography>
              </Stack>
            )}

            {!currentUser && (
              <Stack direction="row" spacing={2} alignItems="center">
                <Link to="/login" style={linkStyle}>
                  Нэвтрэх
                </Link>
              </Stack>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Header;
