// RightSidebar.jsx

import React from "react";
import { makeStyles } from "@material-ui/core/styles";

// Import styles
import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/MyContainerMapStyle";
const useStyles = makeStyles(styles);

const RightSidebar = ({
  classes,
  isSidebarVisible,
  locations,
  selectedLocation,
  setSelectedLocation,
  selectedShapes,
  setSelectedShapes,
  layerRef,
  trRef,
  extractFillPercentage,
}) => {
  return (
    <div
      className={`${classes.rightSidebar} ${
        isSidebarVisible ? classes.sidebarVisible : classes.sidebarHidden
      }`}
    >
      <h3>재고함 목록</h3>
      {locations.length !== 0 ? (
        <div className={classes.listOfLocations}>
          <ul className={classes.ulListStyle}>
            {locations
              .filter(
                (location) =>
                  location.type === "매대" && location.name !== "임시 로케이션"
              )
              .map((location, index) => (
                <li
                  className={classes.liListStyle}
                  key={index}
                  onClick={() => {
                    // Set the selected rectangle
                    setSelectedShapes([
                      { id: location.id, type: "location" },
                    ]);
                    setSelectedLocation(location);

                    // Attach the Transformer to this rectangle
                    const rectNode = layerRef.current.findOne(
                      `#${location.id}`
                    );
                    if (rectNode) {
                      trRef.current.nodes([rectNode]);
                      trRef.current.getLayer().batchDraw();
                    }
                  }}
                  style={{
                    backgroundColor:
                      selectedLocation && selectedLocation.id === location.id
                        ? "#f0f0f0"
                        : "transparent",
                  }}
                >
                  {location.name}
                </li>
              ))}
          </ul>
        </div>
      ) : (
        <p>현재 재고함이 없습니다.</p>
      )}

      <hr />
      {selectedLocation && (selectedLocation.type === "입구" || selectedLocation.type === "출구") ? (
        <>
          <h3>선택된 입출구</h3>
          <div>
            <p>이름: {selectedLocation.name}</p>
            <p>타입: {selectedLocation.type}</p>
          </div>
        </>
      ) : selectedShapes.length > 1 ? (
        <p>다중 선택되었습니다.</p>
      ) : selectedLocation ? (
        <>
          <h3>선택된 재고함</h3>
          <div>
            <p>이름: {selectedLocation.name}</p>
            <p>타입: {selectedLocation.type}</p>
            <p>층수: {selectedLocation.z}</p>
            <p>
              현재 재고율: {extractFillPercentage(selectedLocation.fill)}%
            </p>
            <p>
              가로: {selectedLocation.width}cm | 세로:{" "}
              {selectedLocation.height}cm
            </p>
          </div>
        </>
      ) : (
        <>
          <h3>선택된 재고함</h3>
          <p>재고함이 선택되지 않았습니다.</p>
        </>
      )}
    </div>
  );
};

export default RightSidebar;
