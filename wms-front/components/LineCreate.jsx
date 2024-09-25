// components/KonvaStage.js
import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Circle, Line, Text } from 'react-konva';
import Konva from 'konva';

const KonvaStage = () => {
  const [line, setLine] = useState(null);
  const [startPos, setStartPos] = useState(null);
  const layerRef = useRef();
  const stageRef = useRef();

  // 선을 그리는 함수
  const drawLine = (start, end) => {
    const newLine = new Konva.Line({
      stroke: 'black',
      points: [start.x, start.y, end.x, end.y],
      listening: false,
    });
    layerRef.current.add(newLine);
    layerRef.current.batchDraw();
  };

  useEffect(() => {
    const stage = stageRef.current;
    const layer = layerRef.current;

    // Create the green source circle
    const source = new Konva.Circle({
      x: 20,
      y: 50,
      radius: 10,
      fill: 'green',
    });

    // Add the source circle to the layer
    layer.add(source);

    // Create the first red target circle
    const target1 = new Konva.Circle({
      x: 20,
      y: 220,
      radius: 10,
      fill: 'red',
      name: 'target',
    });

    // Create the second red target circle
    const target2 = new Konva.Circle({
      x: 120,
      y: 220,
      radius: 10,
      fill: 'red',
      name: 'target',
    });

    // Add the target circles to the layer
    layer.add(target1);
    layer.add(target2);

    // Event handler for mousedown on the source circle
    const handleMouseDown = () => {
      const pos = stage.getPointerPosition();
      setStartPos(pos);
      const newLine = new Konva.Line({
        stroke: 'black',
        listening: false,
        points: [pos.x, pos.y, pos.x, pos.y],
      });
      layer.add(newLine);
      setLine(newLine);
    };

    // Event handler for mouseover on the stage
    const handleMouseOver = (e) => {
      if (e.target.hasName('target')) {
        e.target.stroke('black');
        layer.draw();
      }
    };

    // Event handler for mouseout on the stage
    const handleMouseOut = (e) => {
      if (e.target.hasName('target')) {
        e.target.stroke(null);
        layer.draw();
      }
    };

    // Event handler for mousemove on the stage
    const handleMouseMove = () => {
      if (!line) return;
      const pos = stage.getPointerPosition();
      const points = [startPos.x, startPos.y, pos.x, pos.y];
      line.points(points);
      layer.batchDraw();
    };

    // Event handler for mouseup on the stage
    const handleMouseUp = (e) => {
      if (!line) return;
      if (e.target.hasName('target')) {
        const pos = stage.getPointerPosition();
        drawLine(startPos, pos);
        setLine(null);
        setStartPos(null);
        line.destroy();
      } else {
        line.destroy();
        layer.draw();
        setLine(null);
        setStartPos(null);
      }
    };

    // Add event listeners
    source.on('mousedown', handleMouseDown);
    stage.on('mouseover', handleMouseOver);
    stage.on('mouseout', handleMouseOut);
    stage.on('mousemove', handleMouseMove);
    stage.on('mouseup', handleMouseUp);

    // 레이어의 초기 상태 그리기
    layer.draw();

    // Cleanup function to remove event listeners
    return () => {
      source.off('mousedown', handleMouseDown);
      stage.off('mouseover', handleMouseOver);
      stage.off('mouseout', handleMouseOut);
      stage.off('mousemove', handleMouseMove);
      stage.off('mouseup', handleMouseUp);
    };
  }, [line, startPos]);

  return (
    <Stage width={window.innerWidth} height={window.innerHeight} ref={stageRef}>
      <Layer ref={layerRef}>
        <Text text="녹색 소스를 빨간색 타겟 중 하나에 드래그해보세요" padding={10} />
      </Layer>
    </Stage>
  );
};

export default KonvaStage;
