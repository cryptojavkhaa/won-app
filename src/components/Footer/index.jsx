import React, { useState, useEffect, useContext } from "react";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import UserContext from "./../../context/UserContext";

const Footer = (props) => {
  const userContext = useContext(UserContext);
  const [state, setState] = useState(false);

  useEffect(() => {
    setState(userContext.state.saving);
  }, [userContext.state.saving]);

  return state ? (
    <></>
  ) : (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://iuu.edu.mn/">
        Javkhlantugs.G
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};
export default Footer;
