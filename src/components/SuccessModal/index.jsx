import React, { useState, useEffect } from "react";
import { Modal, Box, Alert, Button } from "@mui/material/";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const SuccessModal = (props) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(props.openSuccessModal);
  }, [props.openSuccessModal]);

  const handleSubmit = () => {
    props.handleCloseSuccessModal();
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={props.handleCloseSuccessModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {props.resetMemo === undefined ? (
            <Alert severity="success">Амжилттай</Alert>
          ) : (
            <Alert severity="success">{props.resetMemo}</Alert>
          )}
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmit}
          >
            Ok
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default SuccessModal;
