// RectangleTransformer.jsx

import React, { useRef } from "react";
import { Rect, Text, Transformer } from "react-konva";

const RectangleTransformer = ({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
}) => {
  const shapeRef = useRef();
  const trRef = useRef();

  // Font size calculation
  const fontSize = Math.min(shapeProps.width, shapeProps.height) / 4;

  return (
    <React.Fragment>
      <Rect
        ref={shapeRef}
        {...shapeProps}
        id={shapeProps.id}
        name="selectableShape"
        shapeType="location"
        onClick={(e) => onSelect(e, shapeProps.id)}
        onTap={(e) => onSelect(e, shapeProps.id)}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: Math.round(e.target.x()),
            y: Math.round(e.target.y()),
          });
        }}
      />
      <Text
        text={`${shapeProps.z}층`}
        x={shapeProps.x}
        y={shapeProps.y}
        width={shapeProps.width}
        height={shapeProps.height - fontSize * 2}
        fontSize={Math.min(shapeProps.width, shapeProps.height) / 6}
        fontFamily="Arial"
        fill="white"
        align="center"
        verticalAlign="middle"
        listening={false}
      />
      <Text
        text={shapeProps.name}
        x={shapeProps.x}
        y={shapeProps.y}
        width={shapeProps.width}
        height={shapeProps.height}
        fontSize={Math.min(shapeProps.width, shapeProps.height) / 5}
        fontFamily="Arial"
        fill="white"
        align="center"
        verticalAlign="middle"
        listening={false}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          flipEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            if (
              Math.abs(newBox.width) < 5 ||
              Math.abs(newBox.height) < 5
            ) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

export default RectangleTransformer;
