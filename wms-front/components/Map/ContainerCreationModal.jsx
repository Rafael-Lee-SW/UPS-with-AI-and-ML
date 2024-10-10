// ContainerCreationModal.jsx

import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Modal, Fade, TextField, Button } from "@mui/material";

// Import styles
import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/MyContainerMapStyle";
const useStyles = makeStyles(styles);

const ContainerCreationModal = ({
  open,
  handleClose,
  handleSubmit,
  formData,
  handleChange,
}) => {
  const classes = useStyles();

  return (
    <Modal
      className={classes.modal}
      open={open}
      onClose={handleClose}
      closeAfterTransition
    >
      <Fade
        in={open}
        style={{
          justifyContent: "center",
        }}
      >
        <div className={classes.paper}>
          <h2>새 매장 정보 입력</h2>
          <form onSubmit={handleSubmit}>
            <TextField
              className={classes.formControl}
              name="containerName"
              label="매장 이름"
              fullWidth
              variant="outlined"
              value={formData.containerName}
              onChange={handleChange}
            />
            {/* ... other input fields ... */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Finish
            </Button>
          </form>
        </div>
      </Fade>
    </Modal>
  );
};

export default ContainerCreationModal;
