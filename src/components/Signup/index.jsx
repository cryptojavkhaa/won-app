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
import { readPost } from "../../../firebase/utils.js";

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

  const [selectedDep, setSelectedDep] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [selectedDegree, setSelectedDegree] = useState("");
  const [selectedAcadDegree, setSelectedAcadDegree] = useState("");

  const [department, setDepartment] = useState([]);
  const [teacherLevel, setTeacherLevel] = useState([]);
  const [position, setPosition] = useState([]);

  useEffect(() => {
    setSpinner(userContext.state.saving);
  }, [userContext.state.saving]);

  useEffect(() => {
    if (userContext.state.error.length > 0) {
      setErrors(userContext.state.error);
    }
  }, [userContext.state.error]);

  useEffect(() => {
    getData();
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
    setSelectedDep("");
    setSelectedLevel("");
    setSelectedPosition("");
    setSelectedDegree("");
    setSelectedAcadDegree("");
    setDepartment([]);
    setTeacherLevel([]);
    setPosition([]);
  };

  const getData = async () => {
    try {
      const dep = await readPost("system/schoolAndDep");
      const pos = await readPost("system/position");
      const level = await readPost("system/teacherLevel");
      setDepartment(uniqueDep(dep));
      setTeacherLevel(level);
      setPosition(pos);
    } catch (err) {
      setErrors(err.message);
    }
  };

  const uniqueDep = (arr) => {
    let obj = [];
    arr.forEach((element) => {
      obj.push(element.department);
    });
    const uList = [...new Set(obj)];
    return uList.sort();
  };

  const reset = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setSelectedDep("");
    setSelectedLevel("");
    setErrors("");
  };

  const handleSubmit = () => {
    setErrors("");
    setSpinner(true);
    if (password !== confirmPassword) {
      let err = "Баталгаажуулах нууц үг ижил биш байна";
      setErrors(err);
      setSpinner(false);
    } else if (email.slice(-19) !== "@ulaanbaatar.edu.mn") {
      let err =
        "Та зөвхөн сургуулийн албан мэйл хаяг бүртгүүлэх боломжтой (XXX@ulaanbaatar.edu.mn)";
      setErrors(err);
      setSpinner(false);
    } else {
      userContext
        .signUpUser(
          fullName,
          email,
          password,
          selectedDep,
          selectedLevel,
          selectedPosition,
          selectedDegree,
          selectedAcadDegree
        )
        .then(() => {
          props.handleClose();
          props.handleOpenSuccessModal();
          setSpinner(false);
          reset();
          setErrors("");
          userContext.getData("users/");
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
              <Grid item xs={12}>
                <TextField
                  id="selectedDep"
                  fullWidth
                  required
                  select
                  label="Тэнхим"
                  value={selectedDep}
                  onChange={(e) => setSelectedDep(e.target.value)}
                  variant="outlined"
                >
                  {department.map((dep, key) => (
                    <MenuItem key={key} value={dep}>
                      {dep}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="selectedLevel"
                  fullWidth
                  required
                  select
                  label="Багшийн зэрэглэл"
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  variant="outlined"
                >
                  {teacherLevel.map((lev) => (
                    <MenuItem key={lev.id} value={lev.teacherLevel}>
                      {lev.teacherLevel}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="selectedLevel"
                  fullWidth
                  required
                  select
                  label="Албан тушаал"
                  value={selectedPosition}
                  onChange={(e) => setSelectedPosition(e.target.value)}
                  variant="outlined"
                >
                  {position.map((pos) => (
                    <MenuItem key={pos.id} value={pos.position}>
                      {pos.position}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="degree"
                  fullWidth
                  required
                  select
                  label="Эрдмийн зэрэг"
                  value={selectedDegree}
                  onChange={(e) => setSelectedDegree(e.target.value)}
                  variant="outlined"
                >
                  {Degree.map((el, key) => (
                    <MenuItem key={key} value={el}>
                      {el}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="acadDegree"
                  fullWidth
                  required
                  select
                  label="Цол"
                  value={selectedAcadDegree}
                  onChange={(e) => setSelectedAcadDegree(e.target.value)}
                  variant="outlined"
                >
                  {AcademicDegree.map((el, key) => (
                    <MenuItem key={key} value={el}>
                      {el}
                    </MenuItem>
                  ))}
                </TextField>
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
