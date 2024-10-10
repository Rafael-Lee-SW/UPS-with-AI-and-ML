// LeftSidebar.jsx

import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Slider, Box, TextField } from "@mui/material";
// core components
import Button from "/components/CustomButtons/Button.js";

// Import styles
import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/MyContainerMapStyle";
const useStyles = makeStyles(styles);

const LeftSidebar = ({
  currentSetting,
  changeCurrentSetting,
  newLocationZIndex,
  setNewLocationZIndex,
  newLocationWidth,
  setNewLocationWidth,
  newLocationHeight,
  setNewLocationHeight,
  newLocationName,
  setNewLocationName,
  nameMode,
  setNameMode,
  rowNumber,
  setRowNumber,
  columnNumber,
  setColumnNumber,
  newLocationType,
  setNewLocationType,
  handleAddLocation,
  newWallWidth,
  setNewWallWidth,
  handleOpen, // If you need to open the modal from here
}) => {
  const classes = useStyles();

  return (
    <div className={classes.leftSidebar}>
      <div>
        <Button
          className={classes.buttonStyle}
          onClick={() => changeCurrentSetting("location")}
          variant="contained"
        >
          재고함
        </Button>
        <Button
          className={classes.buttonStyle}
          onClick={() => changeCurrentSetting("wall")}
          variant="contained"
        >
          벽 생성
        </Button>
        <Button
          className={classes.buttonStyle}
          onClick={() => changeCurrentSetting("entrance")}
          variant="contained"
        >
          입구
        </Button>
        <Button
          className={classes.buttonStyle}
          onClick={() => changeCurrentSetting("exit")}
          variant="contained"
        >
          출구
        </Button>
      </div>
      <br />
      {currentSetting && currentSetting !== "wall" && (
        <div>
          {currentSetting === "location" && (
            <>
              <Typography
                variant="h6"
                gutterBottom
                className={classes.settingObject}
              >
                로케이션 설정
              </Typography>
              {/* Size and Floor Settings */}
              <Typography
                className={classes.settingSizeAndFloor}
                variant="body2"
                color="textSecondary"
                gutterBottom
              >
                단수와 크기를 정하세요
              </Typography>

              <Box mb={2} className={classes.showTheFloorLevel}>
                <Typography gutterBottom>
                  단수(층): {newLocationZIndex}단/층
                </Typography>
                <Slider
                  className={classes.settingSlider}
                  value={newLocationZIndex}
                  onChange={(e, newValue) => setNewLocationZIndex(newValue)}
                  aria-labelledby="z-index-slider"
                  color="#4E4544"
                  valueLabelDisplay="auto"
                  marks
                  step={1}
                  min={1}
                  max={10}
                />
              </Box>
              <Box mb={2} className={classes.showTheWidthAndHeight}>
                <Typography gutterBottom>가로: {newLocationWidth}cm</Typography>
                <Slider
                  className={classes.settingSlider}
                  value={newLocationWidth}
                  onChange={(e, newValue) => setNewLocationWidth(newValue)}
                  aria-labelledby="width-slider"
                  valueLabelDisplay="auto"
                  marks
                  step={10}
                  min={10}
                  max={500}
                />
              </Box>
              <Box mb={2} className={classes.showTheWidthAndHeight}>
                <Typography gutterBottom>
                  세로: {newLocationHeight}cm
                </Typography>
                <Slider
                  className={classes.settingSlider}
                  value={newLocationHeight}
                  onChange={(e, newValue) => setNewLocationHeight(newValue)}
                  aria-labelledby="height-slider"
                  valueLabelDisplay="auto"
                  marks
                  step={10}
                  min={10}
                  max={500}
                />
              </Box>
              <hr />
              <Typography variant="body2" color="textSecondary" gutterBottom>
                이름과 속성을 지정해주세요
              </Typography>
              <Button
                className={classes.buttonStyle}
                variant="contained"
                onClick={() => setNameMode("text")}
              >
                직접 입력
              </Button>
              <Button
                className={classes.buttonStyle}
                variant="contained"
                onClick={() => setNameMode("rowColumn")}
              >
                행/열 선택
              </Button>
              {/* Name input based on mode */}
              {nameMode === "text" ? (
                <TextField
                  className={classes.nameTextField}
                  label="이름"
                  value={newLocationName}
                  onChange={(e) => setNewLocationName(e.target.value)}
                  variant="outlined"
                  fullWidth
                  size="small"
                  margin="dense"
                />
              ) : (
                <Box display="flex" justifyContent="space-between">
                  <TextField
                    label="행"
                    value={rowNumber}
                    onChange={(e) => setRowNumber(e.target.value)}
                    variant="outlined"
                    size="small"
                    margin="dense"
                    type="number"
                  />
                  <TextField
                    label="열"
                    value={columnNumber}
                    onChange={(e) => setColumnNumber(e.target.value)}
                    variant="outlined"
                    size="small"
                    margin="dense"
                    type="number"
                  />
                </Box>
              )}
              <Box mb={2}>
                <TextField
                  select
                  label="Type"
                  value={newLocationType}
                  onChange={(e) => setNewLocationType(e.target.value)}
                  variant="outlined"
                  fullWidth
                  size="small"
                  margin="dense"
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="상온">상온</option>
                  <option value="냉장">냉장</option>
                  <option value="보관">보관</option>
                  <option value="위험">위험</option>
                </TextField>
              </Box>

              <Button
                className={classes.generateButton}
                onClick={() => handleAddLocation(currentSetting)}
                variant="contained"
                fullWidth
              >
                생성하기
              </Button>
            </>
          )}
          {(currentSetting === "entrance" || currentSetting === "exit") && (
            <>
              <Typography
                variant="h6"
                gutterBottom
                className={classes.settingObject}
              >
                {currentSetting === "entrance" ? "입구 설정" : "출구 설정"}
              </Typography>
              {/* Size Settings */}
              <Typography
                className={classes.settingSizeAndFloor}
                variant="body2"
                color="textSecondary"
                gutterBottom
              >
                크기를 정하세요
              </Typography>

              <Box mb={2} className={classes.showTheWidthAndHeight}>
                <Typography gutterBottom>가로: {newLocationWidth}cm</Typography>
                <Slider
                  className={classes.settingSlider}
                  value={newLocationWidth}
                  onChange={(e, newValue) => setNewLocationWidth(newValue)}
                  aria-labelledby="width-slider"
                  valueLabelDisplay="auto"
                  marks
                  step={10}
                  min={10}
                  max={500}
                />
              </Box>
              <Box mb={2} className={classes.showTheWidthAndHeight}>
                <Typography gutterBottom>
                  세로: {newLocationHeight}cm
                </Typography>
                <Slider
                  className={classes.settingSlider}
                  value={newLocationHeight}
                  onChange={(e, newValue) => setNewLocationHeight(newValue)}
                  aria-labelledby="height-slider"
                  valueLabelDisplay="auto"
                  marks
                  step={10}
                  min={10}
                  max={500}
                />
              </Box>
              <hr />
              <Typography variant="body2" color="textSecondary" gutterBottom>
                이름을 지정해주세요
              </Typography>
              <TextField
                className={classes.nameTextField}
                label="이름"
                value={newLocationName}
                onChange={(e) => setNewLocationName(e.target.value)}
                variant="outlined"
                fullWidth
                size="small"
                margin="dense"
              />
              <Button
                className={classes.generateButton}
                onClick={() => handleAddLocation(currentSetting)}
                variant="contained"
                fullWidth
              >
                생성하기
              </Button>
            </>
          )}
        </div>
      )}
      {currentSetting === "wall" && (
        <>
          <h3>Set Properties for Wall</h3>
          <div>
            <label>
              Width:
              <input
                type="range"
                min="5"
                max="50"
                value={newWallWidth}
                onChange={(e) => setNewWallWidth(Number(e.target.value))}
              />
              {newWallWidth}
            </label>
          </div>
        </>
      )}
    </div>
  );
};

export default LeftSidebar;
