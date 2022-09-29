import React from "react";
import { Stack, ImageListItem, List, Typography } from "@mui/material";
import Cry from "./../../assets/404pic-low.jpg";

const Page404 = () => {
  return (
    <Stack
      direction="row"
      sx={{ width: "100%", height: "100%" }}
      spacing={2}
      justifyContent="center"
      alignItems="center"
    >
      <ImageListItem key="120">
        <img src={Cry} alt="Cry" />
      </ImageListItem>
      <List>
        <Typography variant="h1">404</Typography>
        <Typography sx={{ fontStyle: "italic", m: 1, fontFamily: "Monospace" }}>
          Уучлаарай та сайтад нэвтрэх эрхгүй байна.
        </Typography>
      </List>
    </Stack>
  );
};

export default Page404;
