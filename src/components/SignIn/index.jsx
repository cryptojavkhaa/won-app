import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { GoogleLoginButton } from "react-social-login-buttons";
import {
  Alert,
  Avatar,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import UserContext from "../../context/UserContext";
import Spinner from "../General/Spinner";

const theme = createTheme({});

const SignIn = (props) => {
  const userContext = useContext(UserContext);
  const [spinner, setSpinner] = useState(false);
  const [errors, setErrors] = useState("");
  const history = useHistory();

  useEffect(() => {
    if (userContext.state.currentUser) {
      history.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userContext.state.currentUser]);

  useEffect(() => {
    setSpinner(userContext.state.saving);
  }, [userContext.state.saving]);

  useEffect(() => {
    setErrors(userContext.state.error);
  }, [userContext.state.error]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (data.get("email").slice(-19) !== "@ulaanbaatar.edu.mn") {
      let err =
        "Та зөвхөн сургуулийн албан мэйл хаягаар нэвтрэх боломжтой (XXX@ulaanbaatar.edu.mn)";
      setErrors(err);
      setSpinner(false);
    } else {
      userContext.signInUser(data.get("email"), data.get("password"));
    }
  };

  const GoogleHandleSubmit = () => {
    userContext.googleSignIn();
  };

  return spinner ? (
    <Spinner />
  ) : (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            marginBottom: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography align="center" component="h1" variant="h5">
            Нэвтрэх хэсэг
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Мэйл хаяг"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Нууц үг"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            {errors.length > 0 && <Alert severity="error">{errors}</Alert>}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Нэвтрэх
            </Button>
            <GoogleLoginButton onClick={GoogleHandleSubmit} />
            <Grid container>
              <Grid item xs>
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => {
                    history.push("/recovery");
                  }}
                >
                  Нууц үг мартсан?
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default SignIn;
