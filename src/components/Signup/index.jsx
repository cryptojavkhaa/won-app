import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import {
  Alert,
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
  MenuItem,
} from "@mui/material";
import LinkMUI from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import UserContext from "../../context/UserContext";
import Spinner from "../General/Spinner";
import { readPost } from "./../../firebase/utils.js";

const theme = createTheme();

const Degree = ["Магистр", "Доктор"];
const AcademicDegree = ["Дэд профессор", "Профессор", "Академич"];

const SignUp = (props) => {
  const userContext = useContext(UserContext);
  const history = useHistory();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [spinner, setSpinner] = useState(false);

  const [errors, setErrors] = useState("");

  useEffect(() => {
    setSpinner(userContext.state.saving);
  }, [userContext.state.saving]);

  useEffect(() => {
    if (userContext.state.error.length > 0) {
      setErrors(userContext.state.error);
    }
  }, [userContext.state.error]);

  useEffect(() => {
    return () => {
      resetAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetAll = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setSpinner(false);
    setErrors("");
  };

  const handleSubmit = () => {
    setErrors("");
    setSpinner(true);
    if (password !== confirmPassword) {
      let err = "Баталгаажуулах нууц үг ижил биш байна";
      setErrors(err);
      setSpinner(false);
    } else {
      userContext.signUpUser(fullName, email, password).then(() => {
        props.handleClose();
        props.handleOpenSuccessModal();
        setSpinner(false);
        resetAll();
        setErrors("");
      });
    }
  };

  return spinner ? (
    <Spinner />
  ) : (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 3,
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
            Бүртгүүлэх цонх
          </Typography>
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="full-name"
                  name="fullName"
                  required
                  fullWidth
                  id="fullName"
                  label="Овог, Нэр"
                  autoFocus
                  onChange={(e) => setFullName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Мэйл хаяг"
                  name="email"
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Нууц үг"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Нууц үг дахиж оруулах "
                  type="password"
                  id="confirmPassword"
                  autoComplete="confirm-password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Grid>
            </Grid>
            {errors.length > 0 && <Alert severity="error">{errors}</Alert>}
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
            >
              Бүртгүүлэх
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <LinkMUI
                  variant="body2"
                  onClick={() => {
                    history.push("/login");
                  }}
                >
                  Нэвтрэх хэсэг рүү буцах.
                </LinkMUI>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};
export default SignUp;
