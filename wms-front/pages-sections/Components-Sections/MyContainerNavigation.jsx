//MyContainerNavigation.jsx
"use client";
/**
 * 창고 엑셀화 Import
 */
// fundamental importing about React
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
// Import MUI components
import Fab from "@mui/material/Fab";
// core components
import Button from "/components/CustomButtons/Button.js";
// 모달 페이지를 위한 Import
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import CircularProgress from "@mui/material/CircularProgress";
//프린트 import
import PrintIcon from "@mui/icons-material/Print";
import { Tooltip, InputLabel, FormControl } from "@mui/material";
import IconButton from "@mui/material/IconButton";

//줌인 줌아웃
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
//모바일 메뉴 아이콘
import MenuIcon from "@mui/icons-material/Menu";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
// Import SheetJS xlsx for Excel operations
import * as XLSX from "xlsx";
// Import Handsontable plugins and cell types
import {
  AutoColumnSize,
  Autofill,
  ContextMenu,
  CopyPaste,
  DropdownMenu,
  Filters,
  HiddenRows,
  registerPlugin,
} from "handsontable/plugins";
import {
  CheckboxCellType,
  NumericCellType,
  registerCellType,
} from "handsontable/cellTypes";

// Import Handsontable and its styles
import "@handsontable/react";
import { HotTable, HotColumn } from "@handsontable/react";
import "pikaday/css/pikaday.css";
import "handsontable/dist/handsontable.full.css";

// Import custom hooks and callbacks
import {
  addClassesToRows,
  alignHeaders,
} from "/components/Test/hooksCallbacks.jsx";

// Register cell types and plugins
registerCellType(CheckboxCellType);
registerCellType(NumericCellType);

registerPlugin(AutoColumnSize);
registerPlugin(Autofill);
registerPlugin(ContextMenu);
registerPlugin(CopyPaste);
registerPlugin(DropdownMenu);
registerPlugin(Filters);
registerPlugin(HiddenRows);

//MUIDataTable
import MUIDataTable, { TableFilterList } from "mui-datatables";

/**
 * 창고 시각화 Import
 */
// Library of konva and color
import {
  Stage,
  Layer,
  Rect,
  Text,
  Line,
  Circle,
  Transformer,
} from "react-konva";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/MyContainerNavStyle.jsx";

// 창고 상수 설정
const GRID_SIZE = 100;
const GRID_SIZE_SUB_50 = 50;
const GRID_SIZE_SUB_10 = 10;
const CANVAS_SIZE = 1000;

const useStyles = makeStyles(styles);

// --- 창고 관련 끝

// 복합체 시작
const MyContainerNavigation = ({ storeId, stores }) => {
  const router = useRouter();
  const classes = useStyles();
  // 로딩 Loading
  const [loading, setLoading] = useState(false); // 수정필수 : true로 바꿀 것
  /**
   * 창고 관련 const 들 모음
   */
  const stageRef = useRef(null);
  const layerRef = useRef(null);

  // 줌 인, 줌 아웃을 위한 Scale
  const [scale, setScale] = useState(1); // 초기 줌 값
  // 처음 시작 위치를 지정하기 위함
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });
  const VIEWPORT_WIDTH = window.innerWidth; // 현재 창의 가로세로 길이를 받아서 창을 구한다.
  const VIEWPORT_HEIGHT = window.innerHeight;

  // 사각형을 추가하고 관리하는 State 추가
  // 사각형을 추가하고 관리하는 State 추가
  const [locations, setLocations] = useState([]);
  // 마지막으로 클릭한 상자를 추적하는 상태 추가
  const [selectedLocation, setSelectedLocation] = useState(null);
  // 마지막으로 클릭한 상자를 수정하는 폼을 띄우기 위한 상태 추가
  const [selectedLocationTransform, setSelectedLocationTransform] =
    useState(null);
  // 현재 벽 생성 / 일반 커서 를 선택하기 위한 State
  const [currentSetting, setCurrentSetting] = useState("location");

  const [locationProducts, setLocationProducts] = useState([]);

  // 앙커를 추가하고 관리하는 State 추가
  const [anchors, setAnchors] = useState([]);

  // 마우스 포인터에 닿은 앙커를 기록하는 것
  const [hoveredAnchor, setHoveredAnchor] = useState(null);
  // 선택된 층을 알려주는 Method
  const [selectedFloor, setSelectedFloor] = useState(1);

  // 모바일 화면에서 우측 사이드바 토글 방식으로 크고/끄는 방식
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  // 모바일 화면에서 우측 사이드바 토글 함수
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const [pendingContentUpdate, setPendingContentUpdate] = useState(false);
  const [newContentToShow, setNewContentToShow] = useState("inventory");

  // 모바일 화면에서 우측 사이드바의 컨텐츠를 알림 목록, 토글 방식으로 크고/끄는 방식
  const [contentVisible, setContentVisible] = useState(true);

  /**
   * 창고 관련 Const 끝
   */

  //모달을 위한 데이터 셋
  const [ModalTableData, setModalTableData] = useState([]);
  const [columns, setColumns] = useState([]); // 각 상자 속 데이터를 위한 칼럼
  const hotTableRef = useRef(null);

  // State to open the modal when a date is clicked
  const [openDetailModal, setOpenDetailModal] = useState(false);

  // Define state to hold detailed data for the selected notification
  const [detailedNotificationData, setDetailedNotificationData] = useState([]);

  // State to hold hovered location IDs
  const [hoveredLocations, setHoveredLocations] = useState([]);

  // state for 현재 선택된 알림의 상태
  const [selectedType, setSelectedType] = useState();

  // 그룹된 알림을 클릭했을 때에 알림 상세 내역과 해당하는 로케이션이 나온다.
  const handleCellClick = (date, type) => {
    const title = `${date} | ${mapTypeToKorean(type)} 내역`;
    setSelectedType(type); // 현재 선택된 타입을 저장한다.
    setSelectedNotificationTitle(title);
    // Filter the detailedData based on the selected date and type
    const filteredData = detailedData.filter(
      (item) =>
        new Date(item.date).toLocaleDateString() === date &&
        item.productFlowType === type
    );

    // Prepare the detailed data based on the notification type
    const detailedDataForDisplay = filteredData.map((item) => {
      const store = stores.find((st) => st.id === item.storeId);
      const storeName = store ? store.storeName : "Unknown Warehouse"; // Fallback to 'Unknown Warehouse' if not found

      const commonData = {
        date: new Date(item.date).toLocaleDateString(),
        name: item.name,
        barcode: item.barcode,
        quantity: item.quantity,
        currentLocationName: item.currentLocationName,
        currentFloorLevel: item.currentFloorLevel,
        warehouseId: item.warehouseId,
        warehouseTitle: warehouseTitle, // Replace warehouseId with title
      };

      if (type === "IMPORT") {
        return commonData;
      } else if (type === "EXPORT") {
        return {
          ...commonData,
          trackingNumber: item.trackingNumber,
        };
      } else if (type === "FLOW") {
        return {
          ...commonData,
          previousLocationName: item.previousLocationName,
          previousFloorLevel: item.previousFloorLevel,
        };
      }

      return commonData; // Fallback if type doesn't match
    });

    // Extract the location names and warehouse IDs from the filtered data
    const locationNames = filteredData
      .filter((item) => item.warehouseId === parseInt(storeId))
      .map((item) => item.currentLocationName);
    // Find the IDs of the locations that match both the location name and warehouse ID
    const matchedLocationIds = locations
      .filter((location) => locationNames.includes(location.name))
      .map((location) => location.id);

    // Store the filtered data and matched location IDs in state
    setDetailedNotificationData(detailedDataForDisplay);
    setHoveredLocations(matchedLocationIds);
    setOpenDetailModal(true); // Open the modal to display details
  };

  /**
   * Location 함수 영역
   */

  // Add this helper function to clear existing anchors and lines
  const clearAnchorsAndLines = () => {
    anchorsRef.current.forEach(({ start, end, line }) => {
      start.destroy();
      end.destroy();
      line.destroy();
    });
    anchorsRef.current = [];
  };

  // API를 통해 해당하는 창고(번호)의 모든 location(적재함)과 wall(벽)을 가져오는 메서드
  const getStoreStructureAPI = async () => {
    // 토큰에서 유저정보를 가져온다.(로그인 확인)
    const token = localStorage.getItem("token");

    if (!token) {
      // Handle the case where the token is missing (e.g., redirect to signIn)
      router.push("/signIn");
      return;
    }

    try {
      const response = await fetch(
        `https://j11a302.p.ssafy.io/api/stores/${storeId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Include the token in the Authorization header
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const apiConnection = await response.json();
        const warehouseData = apiConnection.result; // 데이터 추출

        // 받아온 데이터 중 로케이션 데이터 처리
        const locations = warehouseData.locations;
        if (!locations) {
          //에러
          return;
        }

        const newLocations = locations.map((location, index) => {
          let type = "location";
          if (location.locationTypeEnum === "ENTRANCE") {
            type = "entrance";
          } else if (location.locationTypeEnum === "EXIT") {
            type = "exit";
          }

          return {
            id: location.id.toString(),
            x: location.xposition,
            y: location.yposition,
            width: location.xsize || 50,
            height: location.ysize || 50,
            z: location.zsize,
            locationType: location.locationTypeEnum,
            fill: type === "entrance" ? "green" : type === "exit" ? "red" : "blue",
            draggable: true,
            order: index,
            name: location.name || `적재함 ${index}`,
            type: type,
            rotation: 0,
          };
        });

        // 벽 데이터 처리
        const walls = warehouseData.walls;
        if (!walls) {
          //에러
          return;
        }
        clearAnchorsAndLines();
        const existingAnchors = [];
        const newAnchors = [];

        // 이미 존재하는 앙커를 가져오거나 생성하는 메서드 정의
        const getOrCreateAnchor = (id, x, y) => {
          let existingAnchor = findExistingAnchor(existingAnchors, x, y);
          if (!existingAnchor) {
            existingAnchor = buildAnchor(id, x, y);
            existingAnchors.push(existingAnchor);
          }
          return existingAnchor;
        };

        walls.forEach(({ id, startX, startY, endX, endY }) => {
          const startAnchor = getOrCreateAnchor(id, startX, startY);
          const endAnchor = getOrCreateAnchor(id, endX, endY);

          const newLine = new Konva.Line({
            points: [startX, startY, endX, endY],
            stroke: "brown",
            strokeWidth: 10,
            lineCap: "round",
            id: id.toString(), // Preserve the original ID
            name: "selectableShape", // 선택 가능 객체 표시
            shapeType: "wall", // 구분을 위한 표시
          });

          newAnchors.push({
            start: startAnchor,
            end: endAnchor,
            line: newLine,
          });
        });

        anchorsRef.current = newAnchors;
        newAnchors.forEach(({ line }) => layerRef.current.add(line));
        layerRef.current.batchDraw();

        setLocations(newLocations);
      } else {
        //에러
      }
    } catch (error) {
      //에러
    }
  };

  // 줌-인 / 줌-아웃 함수
  const handleZoomIn = () => {
    setScale((prevScale) => prevScale * 1.2);
  };
  const handleZoomOut = () => {
    setScale((prevScale) => prevScale / 1.2);
  };

  // 그리드 라인 생성하는 부분
  const generateGridLines = () => {
    const lines = [];
    // 100cm 그리드
    for (let i = 0; i <= CANVAS_SIZE / GRID_SIZE; i++) {
      const pos = i * GRID_SIZE;
      // Horizontal Lines
      lines.push(
        <Line
          key={`h${i}`}
          points={[0, pos, CANVAS_SIZE, pos]}
          stroke="gray"
          strokeWidth={0.5}
          dash={[15, 15]}
        />
      );
      //Vertical Lines
      lines.push(
        <Line
          key={`v${i}`}
          points={[pos, 0, pos, CANVAS_SIZE]}
          stroke="gray"
          strokeWidth={0.5}
          dash={[15, 15]}
        />
      );
    }
    for (let i = 0; i <= CANVAS_SIZE / GRID_SIZE_SUB_50; i++) {
      const pos = i * GRID_SIZE_SUB_50;
      lines.push(
        <Line
          key={`sub50h${i}`}
          points={[0, pos, CANVAS_SIZE, pos]}
          stroke="lightgray"
          strokeWidth={0.5}
          dash={[10, 10]}
        />
      );
      lines.push(
        <Line
          key={`sub50v${i}`}
          points={[pos, 0, pos, CANVAS_SIZE]}
          stroke="lightgray"
          strokeWidth={0.5}
          dash={[10, 10]}
        />
      );
      // Handle more grid lines for finer detail
    }
    return lines;
  };

  // 상대적 위치를 보여주는 Pointer에 대한 수정
  const Pointer = (event) => {
    let { x, y } = event.target.getStage().getPointerPosition();
    var stageAttrs = event.target.getStage().attrs;

    if (!stageAttrs.x) {
      // 드래그 하지 않음
      x = x / stageAttrs.scaleX;
      y = y / stageAttrs.scaleY;
    } else {
      // 드래그해서 새로운 stageAttrs의 x,y가 생김
      x = (x - stageAttrs.x) / stageAttrs.scaleX;
      y = (y - stageAttrs.y) / stageAttrs.scaleY;
    }
    return { x, y };
  };

  // Deselect rectangle when clicking on empty space
  const checkDeselect = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedLocationTransform(null);
      setSelectedLocation(null);
      setHoveredLocations([]);
    }
  };

  /**
   * 벽 생성 파트
   */

  // 선을 잇는 기능을 넣기 위한 State
  const [line, setLine] = useState(null);
  const [startPos, setStartPos] = useState(null);

  // 선을 그리는 함수
  const drawLine = (start, end) => {
    const newLine = new Konva.Line({
      stroke: "black",
      points: [start.x, start.y, end.x, end.y],
      listening: false,
    });
    layerRef.current.add(newLine);
    layerRef.current.batchDraw();
  };

  // --- 벽의 기준점을 생성하는 메서드 ---
  const buildAnchor = (id, x, y) => {
    const layer = layerRef.current;
    const newAnchor = new Konva.Circle({
      id: id,
      x: Math.round(x),
      y: Math.round(y),
      radius: 10,
      stroke: "#666",
      fill: "#ddd",
      opacity: 0,
      strokeWidth: 2,
      draggable: currentSetting !== "wall",
    });
    layer.add(newAnchor);
    setAnchors((prevAnchors) => [...prevAnchors, newAnchor]);

    newAnchor.on("mouseover", function () {
      document.body.style.cursor = "pointer";
      this.strokeWidth(4);
      this.opacity(1);
      this.moveToTop();
      setHoveredAnchor(this);
    });
    newAnchor.on("mouseout", function () {
      document.body.style.cursor = "default";
      this.strokeWidth(2);
      this.opacity(0);
      this.moveToTop();
      setHoveredAnchor(null);
    });

    newAnchor.on("dragmove", function () {
      updateLinesBetweenAnchors();
      highlightOverlappingAnchors(this);
      this.moveToTop();
    });

    newAnchor.on("dragend", function () {
      mergeAnchors(this);
      this.moveToTop();
    });

    return newAnchor;
  };
  // 벽의 기준점과 다른 기준점 사이의 선을 만드는 함수
  const updateLinesBetweenAnchors = () => {
    anchorsRef.current.forEach(({ line, start, end }) => {
      line.points([start.x(), start.y(), end.x(), end.y()]);
    });
    layerRef.current.batchDraw();
  };

  // 마우스 액션과 무관하게 마우스가 위로 올라가면 Anchor를 강조하는 함수
  const highlightOverlappingAnchors = (draggedAnchor) => {
    const stage = stageRef.current;
    stage.find("Circle").forEach((anchor) => {
      if (anchor === draggedAnchor) return;
      if (isOverlapping(draggedAnchor, anchor)) {
        anchor.stroke("#ff0000");
        anchor.opacity(1);
        anchor.moveToTop();
      } else {
        anchor.stroke("#666");
        anchor.opacity(0);
        anchor.moveToTop();
      }
    });
  };

  // 두개의 anchor가 겹쳤는지를 확인하는 매서드
  const isOverlapping = (anchor1, anchor2) => {
    const a1 = anchor1.getClientRect();
    const a2 = anchor2.getClientRect();
    return !(
      a1.x > a2.x + a2.width ||
      a1.x + a1.width < a2.x ||
      a1.y > a2.y + a2.height ||
      a1.y + a1.height < a2.y
    );
  };

  // 두 개의 anchor를 규합하고 선의 관계를 정립하는 메서드
  const mergeAnchors = (draggedAnchor) => {
    const stage = stageRef.current;
    const layer = layerRef.current;
    let merged = false;

    stage.find("Circle").forEach((anchor) => {
      if (anchor === draggedAnchor) return;
      if (isOverlapping(draggedAnchor, anchor)) {
        updateAnchorReferences(draggedAnchor, anchor);
        draggedAnchor.destroy(); // Remove the dragged anchor
        layer.batchDraw();
        merged = true;
      }
    });
    if (!merged) {
      draggedAnchor.stroke("#666");
      layer.batchDraw();
    }
  };

  const updateAnchorReferences = (draggedAnchor, anchor) => {
    let count = 0;
    anchorsRef.current.forEach((anchorObj) => {
      if (anchorObj.start === draggedAnchor) anchorObj.start = anchor;
      if (anchorObj.end === draggedAnchor) anchorObj.end = anchor;
      count++;
    });
    updateLinesBetweenAnchors();
  };

  const [lineData, setLineData] = useState({
    startX: "",
    startY: "",
    endX: "",
    endY: "",
  });
  const anchorsRef = useRef([]);

  //같은 위치를 찾기위함
  const isSamePosition = (x1, y1, x2, y2) => {
    return (
      Math.round(x1) === Math.round(x2) && Math.round(y1) === Math.round(y2)
    );
  };

  //같은 위치에 존재하는 Anchor를 찾기 위함
  const findExistingAnchor = (anchors, x, y) => {
    return anchors.find((anchor) =>
      isSamePosition(anchor.x(), anchor.y(), x, y)
    );
  };


  // 엑셀기록과 함께 해당하는 상자를 누르면 데이터를 보여주는 함수
  const [rectangleData, setRectangleData] = useState([]);

  /**
   *  useEffect Part for Reactive action
   */

  // 선을 적용하기 위한 UseEffect
  useEffect(() => {
    const stage = stageRef.current;
    const layer = layerRef.current;

    //Event Handler for 'mousedown' Stage 위에 올렸을 때,
    const handleMouseDown = () => {
      if (currentSetting === "wall") {
        // 정확한 위치를 얻어온다.
        const pos = stage.getPointerPosition();
        var stageAttrs = stage.attrs;
        //드래그 없음
        if (!stageAttrs.x) {
          pos.x = pos.x / stageAttrs.scaleX;
          pos.y = pos.y / stageAttrs.scaleY;
        } // 드래그 있음
        else {
          pos.x = (pos.x - stageAttrs.x) / stageAttrs.scaleX;
          pos.y = (pos.y - stageAttrs.y) / stageAttrs.scaleY;
        }

        if (hoveredAnchor !== null) {
          pos.x = hoveredAnchor.attrs.x;
          pos.y = hoveredAnchor.attrs.y;
        } else {
          // 10단위로 변경
          pos.x = Math.round(pos.x / 10) * 10;
          pos.y = Math.round(pos.y / 10) * 10;
        }
        setStartPos(pos);
        const newLine = new Konva.Line({
          stroke: "black",
          strokeWidth: 5,
          listening: false,
          points: [pos.x, pos.y, pos.x, pos.y],
        });
        layer.add(newLine);
        setLine(newLine);
      }
    };

    //Event Handler for 'mousemove' stage 위에서 움직일 때,
    const handleMouseMove = () => {
      if (currentSetting === "wall") {
        if (!line) return;
        // 정확한 위치를 얻어온다.
        const pos = stage.getPointerPosition();
        var stageAttrs = stage.attrs;
        if (!stageAttrs.x) {
          // 드래그 하지 않음
          pos.x = pos.x / stageAttrs.scaleX;
          pos.y = pos.y / stageAttrs.scaleY;
        } else {
          // 드래그해서 새로운 stageAttrs의 x,y가 생김
          pos.x = (pos.x - stageAttrs.x) / stageAttrs.scaleX;
          pos.y = (pos.y - stageAttrs.y) / stageAttrs.scaleY;
        }

        const points = [startPos.x, startPos.y, pos.x, pos.y];

        line.points(points);
        layer.batchDraw();
      }
    };

    //Event Handler for 'mouseup' stage 위에서 마우스를 뗄 때,
    const handleMouseUp = (e) => {
      if (currentSetting === "wall") {
        //라인이 없으면 작동 X
        if (!line) return;
        //타겟을 찾으면 라인 생성
        if (e.target.hasName("target")) {
          // 정확한 위치를 얻어온다.
          const pos = stage.getPointerPosition();
          var stageAttrs = stage.attrs;
          if (!stageAttrs.x) {
            // 드래그 하지 않음
            pos.x = pos.x / stageAttrs.scaleX;
            pos.y = pos.y / stageAttrs.scaleY;
          } else {
            // 드래그해서 새로운 stageAttrs의 x,y가 생김
            pos.x = (pos.x - stageAttrs.x) / stageAttrs.scaleX;
            pos.y = (pos.y - stageAttrs.y) / stageAttrs.scaleY;
          }
          drawLine(startPos, pos);
          setLine(null);
          setStartPos(null);
          line.remove();
        } else {
          line.remove();
          layer.draw();
          //벽을 추가하기 위한 메서드
          // 정확한 위치를 얻어온다.
          const pos = stage.getPointerPosition();
          var stageAttrs = stage.attrs;
          if (!stageAttrs.x) {
            // 드래그 하지 않음
            pos.x = pos.x / stageAttrs.scaleX;
            pos.y = pos.y / stageAttrs.scaleY;
          } else {
            // 드래그해서 새로운 stageAttrs의 x,y가 생김
            pos.x = (pos.x - stageAttrs.x) / stageAttrs.scaleX;
            pos.y = (pos.y - stageAttrs.y) / stageAttrs.scaleY;
          }

          // 앙커 위에서 벽을 생성하면 그 앙커를 기준으로 생성하게끔 하는 역할
          if (hoveredAnchor !== null) {
            pos.x = hoveredAnchor.attrs.x;
            pos.y = hoveredAnchor.attrs.y;
          }

          handleAddWall(startPos, pos);

          setLine(null);
          setStartPos(null);
        }
      }
    };

    // 벽을 추가한다.
    const handleAddWall = (start, end) => {
      if (currentSetting === "wall") {
        // 새로운 앙커를 생성하는 메서드
        const getOrCreateAnchor = (x, y) => {
          let existingAnchor = anchorsRef.current.find(
            (anchor) =>
              isSamePosition(anchor.start.x(), anchor.start.y(), x, y) ||
              isSamePosition(anchor.end.x(), anchor.end.y(), x, y)
          );
          if (!existingAnchor) {
            const newId = anchorsRef.current.length
              ? Math.max(
                ...anchorsRef.current.flatMap(({ start, end }) => [
                  parseInt(start.id(), 10),
                  parseInt(end.id(), 10),
                ])
              ) + 1
              : 1;
            existingAnchor = buildAnchor(newId, x, y);
          } else {
            existingAnchor = isSamePosition(
              existingAnchor.start.x(),
              existingAnchor.start.y(),
              x,
              y
            )
              ? existingAnchor.start
              : existingAnchor.end;
          }
          return existingAnchor;
        };

        const newAnchorTop = getOrCreateAnchor(start.x, start.y);
        const newAnchorBottom = getOrCreateAnchor(end.x, end.y);

        const newLine = new Konva.Line({
          points: [start.x, start.y, end.x, end.y],
          stroke: "brown",
          strokeWidth: 10,
          lineCap: "round",
        });
        const layer = layerRef.current;
        layer.add(newLine);

        anchorsRef.current.push({
          start: newAnchorTop,
          end: newAnchorBottom,
          line: newLine,
        });

        layer.batchDraw();
      }
    };
    /**
     * 벽 생성 관련 마우스 컨트롤 Mouse
     */
    if (currentSetting === "wall") {
      // Event Listeners 추가하기
      stage.on("mousedown", handleMouseDown);
      stage.on("mousemove", handleMouseMove);
      stage.on("mouseup", handleMouseUp);
    }
    //레이어의 초기 상태 그리기
    layer.draw();


    // Clean-up the Function to remove event Listeners
    return () => {
      stage.off("mousedown", handleMouseDown);
      stage.off("mousemove", handleMouseMove);
      stage.off("mouseup", handleMouseUp);
    };
  }, [line, startPos, currentSetting, selectedLocation]);

  const [showDetails, setShowDetails] = useState(true); // Default to showing details
  //처음에 창고 정보를 불러온다.

  /**
   * 재고 목록과 알림 내역을 불러오는 메서드(Method) 정의
   */

  // 제품 목록 / 입고 / 출고 / 수정하기 / 이동하기에 쓰이는 data Table state
  const [tableData, setTableData] = useState([]);
  const [productColumns, setProductColumns] = useState([]);



  // 변동 내역 / 알림함에서 쓰이는 data Table state
  const [notificationsFetched, setNotificationsFetched] = useState(false); // New one
  const [notificationTableData, setNotificationTableData] = useState([]);
  const [detailedData, setDetailedData] = useState([]); // 모든 변동 사항을 기록한다.
  const [notificationColumn, setNotificationColumn] = useState([]); // 알림 단위로 변동사항에 대한 칼럼

  // 모든 알림(변동내역)을 가져오는 메서드
  const getNotificationsAPI = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signIn");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `https://j11a302.p.ssafy.io/api/notifications?storeId=${storeId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );


      if (response.ok) {
        const apiConnection = await response.json();
        const notifications = apiConnection.result;

        console.log(notifications)
        const formattedNotifications = notifications.map((notification) => ({
          id: notification.id,
          date: notification.createdDate
            ? new Date(notification.createdDate).toLocaleDateString()
            : "N/A",
          type: mapEnumToKorean(notification.notificationTypeEnum),
          message: notification.message,
          isRead: notification.isRead ? "읽음" : "안읽음",
          isImportant: notification.isImportant ? "중요" : "",
        }));

        setNotificationTableData(formattedNotifications);

      } else {

      }
    } catch (error) {
      setLoading(false);
    }
  };

  // Map notification types to Korean
  const mapEnumToKorean = (enumValue) => {
    switch (enumValue) {
      case "FLOW":
        return "이동";
      case "IMPORT":
        return "입고";
      case "MODIFY":
        return "수정";
      case "CRIME_PREVENTION":
        return "방범";
      case "PAYMENT":
        return "결제";
      case "EXPORT":
        return "출고";
      default:
        return enumValue;
    }
  };

  const handleNotificationsClick = () => {
    if (isSidebarVisible && !showDetails) {
      setIsSidebarVisible(false);
    } else if (isSidebarVisible && showDetails) {
      setIsSidebarVisible(false);
      setTimeout(() => {
        setShowDetails(false);
        setIsSidebarVisible(true);
      }, 300);
    } else {
      setShowDetails(false);
      setIsSidebarVisible(true);
    }
  };


  const [dateColumns, setDateColumns] = useState([]); // 일자별로


  /**
   * 로케이션을 클릭했을 때 해당 로케이션에 있는 물품(상품) 목록을 불러오는 API 호출 메서드
   */
  const handleSelectedData = async (locationId) => {

    setLoading(true); // Start loading products
    setSelectedFloor(1);
    setModalTableData([]); // Clear any existing data
    setLocationProducts([]); // Clear previous products

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        // If no token, redirect to signIn
        router.push("/signIn");
        return;
      }

      const response = await fetch(
        `https://j11a302.p.ssafy.io/api/products?locationId=${locationId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const apiConnection = await response.json();
        const products = apiConnection.result;

        // Store all products in state
        setLocationProducts(products);

        // Filter products by selectedFloor
        const filteredProducts = products.filter(
          (product) => product.floorLevel === 1
        );

        // Map products to the required format
        const selectedData = filteredProducts.map((product) => ({
          hiddenId: product.productId,
          name: product.productName,
          barcode: product.barcode,
          quantity: product.quantity,
          expirationDate: product.expirationDate || "없음",
        }));

        setModalTableData(selectedData);
      } else {
        // Handle error
      }
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  /**
   *  층을 선택했을 때에 해당 로케이션 데이터 중에서 선택된 층의 물품 목록을 보여주는 메서드
   */
  const handleFloorSelection = (floorLevel) => {
    setSelectedFloor(floorLevel);

    // Filter products by selectedFloor
    const filteredProducts = locationProducts.filter(
      (product) => product.floorLevel === floorLevel
    );

    // Map products to the required format
    const selectedData = filteredProducts.map((product) => ({
      hiddenId: product.productId,
      name: product.productName,
      barcode: product.barcode,
      quantity: product.quantity,
      expirationDate: product.expirationDate || "없음",
    }));

    setModalTableData(selectedData);
  };

  /**
   * UseEffect를 통해 새로고침 때마다 api로 사장님의 재고를 불러옴
   * + 유저정보
   */

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await getStoreStructureAPI();
        await getNotificationsAPI();
      } catch (error) {
        // Handle error
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 중앙에서 시작하기 위함
  useEffect(() => {
    const centerCanvas = () => {
      const centerX = (VIEWPORT_WIDTH - CANVAS_SIZE) / 2;
      const centerY = (VIEWPORT_HEIGHT - CANVAS_SIZE) / 1.5;

      setStagePosition({ x: centerX, y: centerY });
    };

    centerCanvas();
  }, [CANVAS_SIZE, VIEWPORT_WIDTH, VIEWPORT_HEIGHT]);

  // 영문을 한글로 바꿔주는 작업
  const mapTypeToKorean = (type) => {
    switch (type) {
      case "IMPORT":
        return "입고";
      case "EXPORT":
        return "출고";
      case "FLOW":
        return "이동";
      default:
        return type; // Fallback to original if no match
    }
  };

  /**
   * 프린트 옵션
   */

  // 프린트 로직
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [selectedNotificationTitle, setSelectedNotificationTitle] =
    useState("");

  const PrintableTable = ({ title, columns, data }) => (
    <div className={`printable-content ${classes.printTableContent}`}>
      <h1 className={classes.printTableTitle}>{title}</h1>
      <table className={classes.printTableTitle}>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} className={classes.thPrintTable}>
                {typeof column === "string" ? column : column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className={classes.thPrintTable}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <style jsx>{`
        @media print {
          .printable-content {
            background-color: white !important;
            width: 100%;
            height: 100%;
            min-height: 100vh;
            margin: 0;
            padding: 0;
          }
          /* Ensure the printed page is filled with white background */
          html,
          body {
            background-color: white !important;
            height: 100%;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* Hide any non-printable elements */
          .non-printable {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );

  // Effect to trigger print on modal open
  useEffect(() => {
    if (printModalOpen) {
      const timer = setTimeout(() => {
        window.print();
        setPrintModalOpen(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [printModalOpen]);

  // options for printing but fail
  const listOptions = {
    fixedHeader: true,
    filterType: "multiselect",
    responsive: "scroll",
    download: true,
    print: false, // Disable default print
    viewColumns: true,
    filter: true,
    selectableRows: "none",
    elevation: 0,
    rowsPerPage: 10,
    pagination: true,
    rowsPerPageOptions: [10, 30, 60, 100, 10000],
    textLabels: { body: { noMatch: "데이터를 불러오는 중입니다." } },

    // Custom toolbar with custom print button
    customToolbar: () => {
      return (
        <Tooltip title="Print">
          <IconButton onClick={() => setPrintModalOpen(true)}>
            <PrintIcon />
          </IconButton>
        </Tooltip>
      );
    },
  };

  // Button click handler for Inventory (재고목록)
  const handleInventoryClick = () => {
    if (isSidebarVisible && showDetails) {
      // If inventory is already showing, close the sidebar
      setIsSidebarVisible(false);
    } else if (isSidebarVisible && !showDetails) {
      // If sidebar is open but showing a different content, close it and update content
      setIsSidebarVisible(false); // Close sidebar
      setTimeout(() => {
        setShowDetails(true);
        setNewContentToShow("inventory"); // Update content to Inventory
        setIsSidebarVisible(true); // Reopen sidebar
      }, 300); // Add slight delay to ensure smooth closing before reopening
    } else {
      // If sidebar is closed, update content and open it
      setNewContentToShow("inventory"); // Set content to Inventory
      setShowDetails(true);
      setIsSidebarVisible(true); // Open sidebar
    }
  };

  // Handle notification click
  const handleNotificationClick = async (notificationId, notificationType) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signIn");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `https://j11a302.p.ssafy.io/api/product-flows/batch?notificationId=${notificationId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const apiConnection = await response.json();
        const productFlows = apiConnection.result;

        // Highlight related locations
        const locationIds = productFlows.map(
          (flow) => flow.presentLocationId.toString()
        );
        setHoveredLocations(locationIds);

        // Prepare detailed notification data
        const detailedData = productFlows.map((flow) => ({
          productName: flow.productName,
          barcode: flow.barcode,
          quantity: flow.quantity,
          previousLocationName:
            flow.previousLocationName === "00-00"
              ? "임시"
              : flow.previousLocationName,
          previousFloorLevel:
            flow.previousFloorLevel === -1 ? "임시" : flow.previousFloorLevel,
          presentLocationName:
            flow.presentLocationName === "00-00"
              ? "임시"
              : flow.presentLocationName,
          presentFloorLevel:
            flow.presentFloorLevel === -1 ? "임시" : flow.presentFloorLevel,
          productFlowType: mapEnumToKorean(flow.productFlowTypeEnum),
          storeName: flow.storeName,
        }));

        setDetailedNotificationData(detailedData);
        setSelectedNotificationTitle(
          `${mapEnumToKorean(notificationType)} 상세 내역`
        );

        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  // Effect to handle sidebar content switching when sidebar is closed
  useEffect(() => {
    if (!isSidebarVisible && pendingContentUpdate) {
      // Once sidebar is closed, update content and reopen it
      setTimeout(() => {
        setContentVisible(newContentToShow === "inventory");
        setPendingContentUpdate(false);
        setIsSidebarVisible(true); // Reopen sidebar
      }, 300); // Delay for smooth transition
    }
  }, [isSidebarVisible, pendingContentUpdate, newContentToShow, showDetails]);

  return (
    <div className={classes.navigationContainer}>
      <Stage
        className={classes.basicCanvas}
        width={window.innerWidth}
        height={window.innerHeight}
        scaleX={scale}
        scaleY={scale}
        x={stagePosition.x}
        y={stagePosition.y}
        draggable={true}
        ref={stageRef}
        onPointerMove={Pointer}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
      >
        <Layer ref={layerRef}>
          {generateGridLines()}
          {locations.map((rect, i) => (
            <RectangleTransformer
              key={rect.id}
              x={rect.x}
              y={rect.y}
              width={rect.width}
              height={rect.height}
              fill={
                rect.type === "entrance"
                  ? "green"
                  : rect.type === "exit"
                    ? "red"
                    : rect.fill
              }
              shapeProps={rect}
              isHovered={hoveredLocations.includes(rect.id)} // Pass hover state
              isSelected={rect.id === selectedLocationTransform}
              onSelect={() => {
                setSelectedLocationTransform(rect.id);
                setSelectedLocation(rect);
                setSelectedFloor(1);
                handleSelectedData(rect.id);
              }}
              onChange={(newAttrs) => {
                const rects = locations.slice();
                rects[i] = newAttrs;
                setLocations(rects);
              }}
            />
          ))}
        </Layer>
      </Stage>
      <div className={classes.buttonContainer}>
        <Button
          justIcon
          round
          onClick={handleZoomIn}
          style={{ backgroundColor: "#31a5c8" }}
        >
          <ZoomInIcon className={classes.icons} />
        </Button>
        <Button
          justIcon
          round
          onClick={handleZoomOut}
          style={{ backgroundColor: "#ADAAA5" }}
        >
          <ZoomOutIcon className={classes.icons} />
        </Button>
        {/* This button will be appear at Mobile Screen to control the showing RightSidebar */}
        <Button
          justIcon
          round
          className={classes.toggleSidebarButton}
          style={{ backgroundColor: "#b2ddef" }}
          onClick={handleInventoryClick}
        >
          <MenuIcon className={classes.zoomicons} />
        </Button>
        {/* This button will be appear at Mobile Screen to control the showing RightSidebar */}
        <Button
          justIcon
          round
          className={classes.toggleSidebarButton}
          style={{ backgroundColor: "#999999" }}
          onClick={handleNotificationClick}
        >
          <LightbulbIcon className={classes.zoomicons} />
        </Button>
      </div>
      {/* left Sidebar */}
      <div
        className={`${classes.leftSidebar} ${isSidebarVisible ? classes.sidebarVisible : classes.sidebarHidden
          }`}
      >
        <div className={classes.leftSidebarContent}>
          <Button
            className={classes.sidebarButton}
            onClick={() => setShowDetails(true)}
          >
            재고함 상세보기
          </Button>
          <Button
            className={classes.sidebarButton}
            onClick={() => {
              setShowDetails(false);
            }}
          >
            알림함
          </Button>
        </div>
        {showDetails ? (
          <div className={classes.locations}>
            <h3 className={classes.listTitle}>재고함 목록</h3>
            {locations.length !== 0 ? (
              <div className={classes.locationList}>
                <ul className={classes.ulLocationList}>
                  {locations
                    .filter((locations) => locations.type === "location")
                    .map((locations, index) => (
                      <li
                        className={classes.liLocationsList}
                        key={index}
                        onClick={() => {
                          setSelectedLocation(locations);
                          setSelectedLocationTransform(locations.id);
                          setSelectedFloor(1);
                          handleSelectedData(locations.id);
                        }}
                        style={{
                          backgroundColor:
                            selectedLocation &&
                              selectedLocation.id === locations.id
                              ? "#f0f0f0" // Highlight color for selected item
                              : "transparent", // Default color for unselected items
                          transition: "background-color 0.3s", // Smooth transition effect
                        }}
                      >
                        {locations.name}
                      </li>
                    ))}
                </ul>
              </div>
            ) : (
              <p>현재 재고함이 없습니다.</p>
            )}
          </div>
        ) : (
          <div className={classes.notification}>
            <h3 className={classes.listTitle}>알림함</h3>
            {notificationTableData.length > 0 ? (
              <ul className={classes.ulNotificationsList}>
                {notificationTableData.map((notification, index) => (
                  <li
                    className={classes.liNotificationsList}
                    key={index}
                    onClick={() =>
                      handleNotificationClick(notification.id, notification.type)
                    }
                  >
                    {notification.date} / {notification.type}
                  </li>
                ))}
              </ul>
            ) : (
              <p>알림이 없습니다.</p>
            )}
          </div>
        )}
      </div>
      {/* Right Sidebar */}
      {(selectedLocation || detailedNotificationData.length > 0) && (
        <div className={classes.rightSidebar}>
          <div className={classes.closeButtonPart}>
            <Button
              className={classes.closeButton}
              onClick={() => {
                setSelectedLocation(null);
                setDetailedNotificationData([]);
                setHoveredLocations([]);
              }}
              style={{
                backgroundColor: "#e6f4fa",
                color: "black",
                border: "1px solid #ccc",
              }}
            >
              닫기
            </Button>
          </div>
          {showDetails && selectedLocation ? (
            <div>
              <div>
                <div id="상자 정보" className={classes.infoBox}>
                  <div id="상자 숫자 정보" className={classes.infoBoxNum}>
                    <h3 className={classes.infoBoxTitle}>
                      위치: {selectedLocation.name}
                    </h3>
                    <b>가로 : {selectedLocation.width}cm</b>
                    <b>세로 : {selectedLocation.height}cm</b>
                    <b>단수(층) : {selectedLocation.z}단/층</b>
                    <b>
                      재고율 : { }%{" "}
                    </b>
                  </div>
                  <div
                    id="상자의 z Index를 시각화"
                    className={classes.infoZindexBox}
                  >
                    {Array.from({ length: selectedLocation.z }).map(
                      (_, index) => (
                        <Button
                          className={classes.floorBox}
                          key={index + 1}
                          style={{
                            backgroundColor: "#e6f4fa",
                            color: "black",
                            border: "1px solid #ccc",
                            "&:hover": {
                              transform: 'scale(1.05)',
                              color: 'black',
                              border: "1px solid #9baab1"
                            }
                          }}
                          onClick={() => {
                            handleFloorSelection(index + 1);
                          }}
                        // onMouseEnter={(e) => {
                        //   e.target.style.border = "1px solid #9baab1";
                        // }}
                        // onMouseLeave={(e) => {
                        //   e.target.style.backgroundColor =
                        //     selectedFloor === index + 1
                        //       ? "#7D4A1A"
                        //       : "transparent";
                        //   e.target.style.border = "1px solid black";
                        // }}
                        >
                          {index + 1} 단
                        </Button>
                      )
                    )}
                  </div>
                </div>
                <hr />
                {ModalTableData.length > 0 && (
                  <div className={classes.productList}>
                    <h3>재고 목록</h3>
                    <table className={classes.productListTable}>
                      <tbody>
                        {ModalTableData.map((item, index) => (
                          <tr
                            key={index}
                            className={classes.trProductListTable}
                          >
                            <td className={classes.tdMainProductListTable}>
                              <strong>{item.name}</strong>
                              <div className={classes.productBarcode}>
                                바코드 : {item.barcode}
                              </div>
                            </td>
                            <td className={classes.tdSubProductListTable}>
                              {item.quantity} 개
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <div className={classes.detailedNotifications}>
                {/* Title showing the selected date and type */}
                <h3 className={classes.notificationTitle}>
                  {selectedNotificationTitle}
                </h3>
                {/* Print button */}
                <Button
                  className={classes.printButton}
                  onClick={() => setPrintModalOpen(true)}
                >
                  <PrintIcon /> 프린트
                </Button>
              </div>
              {/* Detailed Notification Data Rendering */}
              {detailedNotificationData.length > 0 ? (
                <div>
                  {/* Render Table Based on Notification Type */}
                  <table className={classes.notificationTable}>
                    <thead>
                      {/* Conditional column headers based on the type */}
                      <tr>
                        <th className={classes.thNameNotificationTable}>
                          상품
                        </th>
                        <th className={classes.thQuantityNotificationTable}>
                          수량
                        </th>
                        <th className={classes.thTypeNotificationTable}>
                          {/* Different headers based on type */}
                          {selectedType === "IMPORT"
                            ? "입고된 매장"
                            : selectedType === "EXPORT"
                              ? "출고 위치"
                              : "이동한 위치"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailedNotificationData.map((item, index) => (
                        <tr key={index}>
                          {/* 상품명과 바코드를 하나의 셀에 표현한다. */}
                          <td className={classes.tdProductNotificationTable}>
                            <strong className={classes.tdNameNotificationTable}>
                              {item.name}
                            </strong>
                            <span
                              className={classes.tdBarcodeNotificationTable}
                            >
                              {item.barcode}
                            </span>
                          </td>
                          {/* Quantity */}
                          <td className={classes.tdQuantityNotificationTable}>
                            {item.quantity} 개
                          </td>
                          {/* Location based on type */}
                          <td className={classes.tdLocationNotificationTable}>
                            {/* Show different content based on type */}
                            {selectedType === "IMPORT" && (
                              <span>{item.warehouseTitle}</span>
                            )}
                            {selectedType === "EXPORT" && (
                              <div>
                                <span>
                                  {item.currentLocationName}{" "}
                                  {item.currentFloorLevel}층
                                </span>
                                <span className={classes.exportStoreTitle}>
                                  매장 : {item.warehouseTitle}
                                </span>
                              </div>
                            )}
                            {selectedType === "FLOW" && (
                              <div>
                                <span>
                                  {item.currentLocationName}
                                  {" - "}
                                  {item.currentFloorLevel}층
                                </span>
                                <span className={classes.exportStoreTitle}>
                                  매장 : {item.warehouseTitle}
                                </span>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>알림이 선택되지 않았습니다.</p>
              )}
            </div>
          )}
        </div>
      )}
      {/* 로딩 Part */}
      {loading && (
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      )}
      {/* Print Modal */}
      <Dialog
        open={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        fullScreen
      >
        <DialogContent>
          {detailedNotificationData.length > 0 ? (
            <PrintableTable
              title={selectedNotificationTitle}
              columns={
                detailedNotificationData[0].trackingNumber
                  ? [
                    "날짜",
                    "상품명",
                    "바코드",
                    "수량",
                    "적재함",
                    "층수",
                    "매장",
                    "송장번호",
                  ]
                  : detailedNotificationData[0].previousLocationName &&
                    detailedNotificationData[0].previousFloorLevel
                    ? [
                      "날짜",
                      "상품명",
                      "바코드",
                      "수량",
                      "적재함",
                      "층수",
                      "매장",
                      "이전 적재함",
                      "이전 층수",
                    ]
                    : [
                      "날짜",
                      "상품명",
                      "바코드",
                      "수량",
                      "적재함",
                      "층수",
                      "매장",
                    ]
              }
              data={detailedNotificationData.map((item) => {
                const commonData = [
                  item.date,
                  item.name,
                  item.barcode,
                  item.quantity,
                  item.currentLocationName,
                  item.currentFloorLevel,
                  item.warehouseId,
                ];
                if (item.trackingNumber) {
                  return [...commonData, item.trackingNumber];
                } else if (
                  item.previousLocationName &&
                  item.previousFloorLevel
                ) {
                  return [
                    ...commonData,
                    item.previousLocationName,
                    item.previousFloorLevel,
                  ];
                }

                return commonData;
              })}
            />
          ) : (
            <p>프린트할 내용이 없습니다.</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPrintModalOpen(false)} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default MyContainerNavigation;

// -----   상자 설정 변경기 영역   ------
const RectangleTransformer = ({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
  isHovered,
}) => {
  const shapeRef = useRef();

  // Local state for hover effect
  const [isHoveredLocal, setIsHoveredLocal] = useState(false);

  // Calculate font size for the text inside the rectangle
  const fontSize = Math.min(shapeProps.width, shapeProps.height) / 4;

  // 재고함의 행렬과 높이를 나타내도록 설정한 MainText
  const floorName = `${shapeProps.z}층`;


  return (
    <React.Fragment>
      {/* Rectangle shape */}
      <Rect
        onClick={onSelect} // Handle click to select rectangle
        onTap={onSelect} // Handle tap for touch devices
        ref={shapeRef}
        {...shapeProps}
        draggable={false} // Disable dragging
        stroke={isSelected || isHoveredLocal ? "red" : "transparent"} // Border color when selected or hovered
        strokeWidth={isSelected || isHoveredLocal ? 2 : 0} // Border width when selected or hovered
        F
        onMouseEnter={() => setIsHoveredLocal(true)} // Set hover state
        onMouseLeave={() => setIsHoveredLocal(false)} // Reset hover state
        fill={isHovered ? "gray" : shapeProps.fill} // Change fill if hovered
        shadowColor={isHovered || isHoveredLocal ? "black" : "transparent"} // Add shadow when hovered
        shadowBlur={isHovered || isHoveredLocal ? 10 : 0} // Increase shadow blur when hovered
        shadowOffset={{ x: 2, y: 2 }} // Offset shadow slightly
        shadowOpacity={isHovered || isHoveredLocal ? 0.5 : 0} // Shadow opacity when hovered
      />
      <Text
        text={floorName}
        x={shapeProps.x}
        y={shapeProps.y}
        z={shapeProps.z}
        width={shapeProps.width}
        height={shapeProps.height - fontSize * 2}
        fontSize={Math.min(shapeProps.width, shapeProps.height) / 6}
        fontFamily="Arial"
        fill="white"
        align="center"
        verticalAlign="middle"
        listening={false} // Disable interactions with the text
      />
      <Text
        text={shapeProps.name}
        x={shapeProps.x}
        y={shapeProps.y}
        z={shapeProps.z}
        width={shapeProps.width}
        height={shapeProps.height}
        fontSize={Math.min(shapeProps.width, shapeProps.height) / 5}
        fontFamily="Arial"
        fill="white"
        align="center"
        verticalAlign="middle"
        listening={false} // Disable interactions with the text
      />
      <Text
        // text={`${extractFillPercentage(shapeProps.fill)}%`}
        x={shapeProps.x}
        y={shapeProps.y}
        z={shapeProps.z}
        width={shapeProps.width}
        height={shapeProps.height + fontSize * 2}
        fontSize={Math.min(shapeProps.width, shapeProps.height) / 6}
        fontFamily="Arial"
        fill="white"
        align="center"
        verticalAlign="middle"
        listening={false} // Disable interactions with the text
      />
    </React.Fragment>
  );
};
