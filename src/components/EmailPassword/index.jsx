import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Button,
  Box,
  Grid,
  TextField,
  Avatar,
  Container,
  Alert,
  Typography,
} from "@mui/material";
import KeyIcon from "@mui/icons-material/Key";
import UserContext from "../../context/UserContext";
import Spinner from "./../General/Spinner";
import SuccessModal from "./../SuccessModal";

const theme = createTheme();

const EmailPassword = (props) => {
  const userContext = useContext(UserContext);
  const history = useHistory();
  const [errors, setErrors] = useState("");
  const [spinner, setSpinner] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  const resetUserState = () => {
    setErrors("");
  };

  useEffect(() => {
    setSpinner(userContext.state.saving);
  }, [userContext.state.saving]);

  useEffect(() => {
    if (userContext.state.resetPasswordSuccess) {
      resetUserState();
      history.push("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userContext.state.resetPasswordSuccess]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setErrors("");
  //   }, 5000);
  // }, [errors]);

  useEffect(() => {
    if (userContext.state.error.length > 0) {
      setErrors(userContext.state.error);
    }
  }, [userContext.state.error]);

  const handleSubmit = (e) => {
    setSpinner(true);
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (data.get("email").slice(-19) !== "@ulaanbaatar.edu.mn") {
      let err =
        "Та зөвхөн сургуулийн албан мэйл хаяг оруулах боломжтой (XXX@ulaanbaatar.edu.mn)";
      setErrors(err);
      setSpinner(false);
    } else {
      console.log(data.get("email"));
      userContext.resetPassword(data.get("email"));
      setSpinner(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setOpenSuccessModal(false);
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
            <KeyIcon />
          </Avatar>
          <Typography align="center" component="h1" variant="h5">
            Нууц үг сэргээх цонх
          </Typography>
          <Box component="form" onSubmit={handleSubmit} Validate sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
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
              </Grid>
              <Grid item xs={12}>
                {errors.length > 0 && <Alert severity="error">{errors}</Alert>}
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Нууц үг сэргээх
                </Button>
              </Grid>
              <SuccessModal
                openSuccessModal={openSuccessModal}
                handleCloseSuccessModal={handleCloseSuccessModal}
                resetMemo="Таны нууц үг сэргээх хүсэлтийг хүлээж авлаа. Та бүртгүүлсэн мэйл хаягаа шалгана уу."
              />
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default EmailPassword;
