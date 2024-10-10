//MyContainerMap.jsx
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Library of konva and color Checker
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
// @material-ui/icons
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import SaveIcon from "@mui/icons-material/Save";
import MenuIcon from "@mui/icons-material/Menu";
import CircularProgress from "@mui/material/CircularProgress";
// core components
import Button from "/components/CustomButtons/Button.js";
// CSS스타일
import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/MyContainerMapStyle";
//Material UI 창고 생성 테스트를 위한
import { Typography, Slider, Box, Modal, Fade, TextField } from "@mui/material";
import Konva from "konva";

//import Components
import LeftSidebar from "../../components/Map/LeftSidebar";
import RightSidebar from "../../components/Map/RightSidebar";
import ContextMenu from "../../components/Map/ContextMenu";
import ContainerCreationModal from "../../components/Map/ContainerCreationModal";
import RectangleTransformer from "../../components/Map/RectangleTransformer";

// 상수 설정(그리드, 컨버스 등)
const GRID_SIZE = 100;
const GRID_SIZE_SUB_50 = 50;
const GRID_SIZE_SUB_10 = 10;
const CANVAS_SIZE = 1000;

const useStyles = makeStyles(styles);

/**
 * 창고 관리 Component
 */

const MyContainerMap = ({ storeId, businessId }) => {
  const router = useRouter();
  const classes = useStyles();
  const stageRef = useRef(null);
  const layerRef = useRef(null);
  const trRef = useRef(); // Ref for 변형기(Transformer)

  // 다중 선택으로 드래그 했을 때의 영역을 보여주는 Ref
  const selectionRectRef = useRef();
  const selection = useRef({
    visible: false,
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  });

  // 다중 선택을 위한 State(벽과 로케이션 모두 포함)
  const [selectedShapes, setSelectedShapes] = useState([]);

  // 다중 선택을 위한 HandleMouseDown
  const handleMouseDownSelection = (e) => {
    // Ignore if right-clicking on a shape
    if (e.evt.button === 2 && e.target !== e.target.getStage()) return;

    // Check if left-click on empty area
    if (e.evt.button === 0 && e.target === e.target.getStage()) {
      // Left-click on empty area deselects all
      setSelectedShapes([]);
      setSelectedLocation(null);
      return;
    }

    if (e.evt.button === 2) {
      // Right-click drag for selection
      // Shape 위에서 발생했을 시에 반환
      if (e.target !== e.target.getStage()) return;

      // 위치를 얻어온다.
      const pos = getPrecisePosition(e.target.getStage());
      selection.current = {
        visible: true,
        x1: pos.x,
        y1: pos.y,
        x2: pos.x,
        y2: pos.y,
      };
      updateSelectionRect();

      // Default context Menu가 켜지는 것을 방지
      e.evt.preventDefault();
    }
  };

  // 드래그를 통해 선택 영역을 조정한다.
  const handleMouseMoveSelection = (e) => {
    if (!selection.current.visible) return;

    // 오른쪽 버튼이 계속 눌려있는지 확인
    if (e.evt.buttons !== 2) {
      selection.current.visible = false;
      updateSelectionRect();
      return;
    }

    const pos = getPrecisePosition(e.target.getStage());
    selection.current.x2 = pos.x;
    selection.current.y2 = pos.y;
    updateSelectionRect();
  };

  //최종 선택(해당 영역에 대해서 선택함)
  const handleMouseUpSelection = (e) => {
    if (!selection.current.visible) return;

    selection.current.visible = false;
    updateSelectionRect();

    const precisePos = getPrecisePosition(e.target.getStage());
    const selBox = selectionRectRef.current.getClientRect();

    // Your selection logic remains the same
    const shapes = layerRef.current.find(".selectableShape");
    const selected = shapes.filter((shape) =>
      Konva.Util.haveIntersection(selBox, shape.getClientRect())
    );

    // id와 타입을 동시에 저장한다.
    setSelectedShapes(
      selected.map((shape) => ({
        id: shape.id(),
        type: shape.getAttr("shapeType"),
      }))
    );

    e.evt.preventDefault();
  };

  //선택된 사각형들을 업데이트한다.
  const updateSelectionRect = () => {
    const node = selectionRectRef.current;
    node.visible(selection.current.visible);
    node.width(Math.abs(selection.current.x2 - selection.current.x1));
    node.height(Math.abs(selection.current.y2 - selection.current.y1));
    node.x(Math.min(selection.current.x1, selection.current.x2));
    node.y(Math.min(selection.current.y1, selection.current.y2));
    node.getLayer().batchDraw();
  };

  // onSelect 함수를 변경한다.
  const onSelect = (e, id) => {
    if (e.evt.button === 2) return;

    const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
    const shapeType = e.target.getAttr("shapeType");

    if (metaPressed) {
      const alreadySelected = selectedShapes.find(
        (shape) => shape.id === id && shape.type === shapeType
      );
      if (alreadySelected) {
        setSelectedShapes(
          selectedShapes.filter(
            (shape) => !(shape.id === id && shape.type === shapeType)
          )
        );
      } else {
        setSelectedShapes([...selectedShapes, { id, type: shapeType }]);
      }
    } else {
      setSelectedShapes([{ id, type: shapeType }]);
      if (["location", "entrance", "exit"].includes(shapeType)) {
        const location = locations.find((loc) => loc.id === id);
        setSelectedLocation(location || null);
      } else {
        setSelectedLocation(null);
      }
    }
  };

  // 모바일 화면에서 우측 사이드바를 토글 방식으로 크고/끄는 방식
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  // 모바일 화면에서 우측 사이드바 토글 함수
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  /**
   * 로딩 파트
   */
  const [loading, setLoading] = useState(false); // 수정필수 : 여기를 true 바꿔야 한다.

  const notify = (message) =>
    toast(message, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  // 창고 배열을 저장하기 위한 초기 세팅
  const initialContainer = Array.from({ length: CANVAS_SIZE }, () =>
    Array.from({ length: CANVAS_SIZE }, () => ({
      type: "empty",
      code: "air",
    }))
  );

  // 창고 전체 배열을 저장하기 위한 Container State
  const [container, setContainer] = useState(initialContainer);

  // 줌 인, 줌 아웃을 위한 Scale
  const [scale, setScale] = useState(0.8); // 초기 줌 값
  // 처음 시작 위치를 지정하기 위함
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });
  const VIEWPORT_WIDTH = window.innerWidth; // 현재 창의 가로세로 길이를 받아서 창을 구한다.
  const VIEWPORT_HEIGHT = window.innerHeight;

  // 사각형을 추가하고 관리하는 State 추가
  const [locations, setLocations] = useState([]);
  // Check if position is within bounds / 캔버스 바운드 안에 들어가는지를 확인
  const isPositionWithinBounds = (x, y, width, height) => {
    return (
      x >= 0 && y >= 0 && x + width <= CANVAS_SIZE && y + height <= CANVAS_SIZE
    );
  };

  // 마지막으로 클릭한 상자를 추적하는 상태 추가
  const [selectedLocation, setSelectedLocation] = useState(null);
  // 마지막으로 클릭한 상자를 수정하는 폼을 띄우기 위한 상태 추가
  const [selectedLocationTransform, setSelectedLocationTransform] =
    useState(null);

  // 현재 벽 생성 / 일반 커서 를 선택하기 위한 State
  const [currentSetting, setCurrentSetting] = useState("location");

  // 새롭게 생성되는 적재함(location)의 속성 설정을 위한 State
  const [newLocationColor, setNewLocationColor] = useState("blue");
  const [newLocationWidth, setNewLocationWidth] = useState(50);
  const [newLocationHeight, setNewLocationHeight] = useState(50);
  const [newLocationZIndex, setNewLocationZIndex] = useState(2);
  const [newLocationName, setNewLocationName] = useState("");
  // 상온, 냉장, 보관, 위험 등의 옵션 추가
  const [newLocationType, setNewLocationType] = useState("상온");

  // 상태 추가: nameMode가 'text'이면 텍스트 입력, 'rowColumn'이면 행/열 입력
  const [nameMode, setNameMode] = useState("text");
  const [rowNumber, setRowNumber] = useState("");
  const [columnNumber, setColumnNumber] = useState("");

  // New State for wall settings(벽 관련 설정)
  const [newWallColor, setNewWallColor] = useState("brown");
  const [newWallWidth, setNewWallWidth] = useState(10);

  // 마우스 포인터에 닿은 앙커를 기록하는 것
  const [hoveredAnchor, setHoveredAnchor] = useState(null);

  // 정확한 위치를 찾는 함수(드래그해서 옮겨가도)
  const getPrecisePosition = (stage) => {
    let pos = stage.getPointerPosition(); // Get the pointer position
    const stageAttrs = stage.attrs;

    if (!stageAttrs.x) {
      // If the stage is not dragged
      pos.x = pos.x / stageAttrs.scaleX;
      pos.y = pos.y / stageAttrs.scaleY;
    } else {
      // If the stage is dragged, adjust the position
      pos.x = (pos.x - stageAttrs.x) / stageAttrs.scaleX;
      pos.y = (pos.y - stageAttrs.y) / stageAttrs.scaleY;
    }

    // Return the exact coordinates
    return pos;
  };

  // 앙커를 추가하고 관리하는 State 추가
  const [anchors, setAnchors] = useState([
    {
      id: "0",
      x: 0,
      y: 0,
      radius: 0,
      stroke: "#666",
      fill: "#ddd",
      opacity: 1,
      strokeWidth: 2,
      draggable: false,
    },
  ]);

  // 우클릭 시 나오는 메뉴를 위한 Ref
  const menuRef = useRef(null);
  const currentShapeRef = useRef(null);

  // 로케이션을 추가하는 메서드
  const handleAddLocation = async (type) => {
    let newName;

    let locationType = "LOCATION"; // Default for regular locations
    let zSize = newLocationZIndex; // Default zSize

    if (type === "entrance") {
      locationType = "ENTRANCE";
      newName = newLocationName || "입구-1"; // Use provided name or default
      zSize = 1; // For entrance, zSize is 1
    } else if (type === "exit") {
      locationType = "EXIT";
      newName = newLocationName || "출구-1"; // Use provided name or default
      zSize = 1; // For exit, zSize is 1
    } else {
      // For regular locations
      if (nameMode === "text") {
        const latestId =
          locations.length > 0
            ? parseInt(locations[locations.length - 1].id)
            : 0;
        newName = newLocationName || `매대-${latestId + 1}`;
      } else if (nameMode === "rowColumn") {
        const formattedRow = rowNumber.padStart(2, "0");
        const formattedColumn = columnNumber.padStart(2, "0");
        newName = `${formattedRow}-${formattedColumn}`;
      }
    }

    // 중복된 이름이 있는지 확인
    const isDuplicateName = locations.some(
      (location) => location.name === newName
    );

    if (isDuplicateName) {
      notify(
        `이름이 "${newName}"인 로케이션이 이미 존재합니다. 다른 이름을 사용하세요.`
      );
      return; // 중복된 이름이 있으면 생성 중단
    } else {
      notify(`로케이션 "${newName}"이 생성되었습니다.`);
    }

    const newLocation = {
      //Id를 넣어서는 안된다. DB에서 자동으로 처리되도록 해야한다.
      id: (locations.length + 1).toString(), // API 연결 후 삭제
      x: 50,
      y: 50,
      z: newLocationZIndex,
      width: newLocationWidth,
      height: newLocationHeight,
      fill: "blue",
      draggable: true,
      order: locations.length + 1,
      name: newName, // 생성된 name 사용
      locationType: locationType,
      type: type,
      rotation: 0,
    };

    setLocations([...locations, newLocation]);
    updateContainer(newLocation, "location", `location${newLocation.id}`);

    // API 요청을 위한 location 데이터를 작성
    const locationData = {
      name: newLocation.name,
      xPosition: newLocation.x,
      yPosition: newLocation.y,
      xSize: newLocation.width, // 가로
      ySize: newLocation.height, // 세로
      zSize: newLocation.z, // 높이
      rotation: newLocation.rotation,
      locationType: newLocation.locationType,
    };

    // API 호출 - 생성된 로케이션을 서버에 POST
    try {
      await postLocationAPI([locationData], storeId);
    } catch (error) {
      notify("로케이션 추가 중 오류가 발생했습니다.");
    }

    // 적재함 추가 후 값 초기화
    setNewLocationColor("blue");
    setNewLocationWidth(50);
    setNewLocationHeight(50);
    setNewLocationZIndex(2);
    setNewLocationName("");
    setRowNumber(""); // 행/열 선택 모드 초기화
    setColumnNumber(""); // 행/열 선택 모드 초기화
  };

  // 로케이션 추가 API
  const postLocationAPI = async (requests, storeId) => {
    const locationListCreateRequest = { requests, storeId };

    // 토큰에서 유저정보를 가져온다.
    const token = localStorage.getItem("token");

    if (!token) {
      // 토큰 유무로 로그인 여부를 판단하여 로그인 상태가 아닐 경우 로그인 창으로
      router.push("/signIn");
      return;
    }

    try {
      const response = await fetch(
        `https://j11a302.p.ssafy.io/api/stores/${storeId}/structures/locations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(locationListCreateRequest),
        }
      );

      if (response.ok) {
      } else {
        router.push("/404");
      }
    } catch (error) {
      router.push("/404");
    }
  };

  //벽 추가 API
  const postWallsAPI = async (wallData, storeId) => {
    // Prepare the wall list create request
    const wallListCreateRequest = {
      storeId: storeId,
      wallCreateDtos: wallData,
    };

    // Get the token from local storage
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/signIn");
      return;
    }

    try {
      const response = await fetch(
        `https://j11a302.p.ssafy.io/api/stores/${storeId}/structures/walls`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(wallListCreateRequest),
        }
      );

      if (response.ok) {
      } else {
      }
    } catch (error) {
    }
  };

  // 창고 배열 저장(아주 옛날용 체크함수)
  const updateContainer = (location, type, code) => {
    const newContainer = container.map((row, x) =>
      row.map((cell, y) => {
        if (
          x >= location.x &&
          x < location.x + location.width &&
          y >= location.y &&
          y < location.y + location.height
        ) {
          return { type, code };
        }
        return cell;
      })
    );
    setContainer(newContainer);
  };

  // 현재 상태(로케이션, 벽)를 저장하는 API
  const editStoreAPI = async () => {
    // 토큰에서 유저정보를 가져온다.(로그인 확인)
    const token = localStorage.getItem("token");

    if (!token) {
      // Handle the case where the token is missing (e.g., redirect to signIn)
      router.push("/signIn");
      return;
    }

    const locationUpdateRequestList = locations.map((location) => ({
      id: parseInt(location.id), // id
      name: location.name,
      xPosition: location.x,
      yPosition: location.y,
      xSize: location.width,
      ySize: location.height,
      zSize: location.z,
      rotation: location.rotation,
      locationType: location.locationType,
    }));

    // 벽 데이터를 기록합니다.
    const wallUpdateRequestList = anchorsRef.current.map(
      ({ start, end, line }) => ({
        id: parseInt(line.attrs.id),
        startX: start.x(),
        startY: start.y(),
        endX: end.x(),
        endY: end.y(),
      })
    );

    //모든 데이터를 structureUpdateRequest로 담아서 수정된 내역을 전송한다.
    const structureUpdateRequest = {
      locationUpdateRequestList,
      wallUpdateRequestList,
    };

    try {
      const response = await fetch(
        `https://j11a302.p.ssafy.io/api/stores/${storeId}/structures`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // Include the token in the Authorization header
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(structureUpdateRequest),
        }
      );

      if (response.ok) {
        // 성공
        notify(`현재 상태가 저장되었습니다.`);
        // await getStoreStructureAPI(); // But in UX, it have to be removed
      } else {
        //에러
      }
    } catch (error) {
      //에러
    }
  };

  // 캔버스 내의 모든 벽의 속성(앙커와 선)을 모두 제거하는 메서드
  const clearAnchorsAndLines = () => {
    anchorsRef.current.forEach(({ start, end, line }) => {
      start.destroy();
      end.destroy();
      line.destroy();
    });
    anchorsRef.current = [];
  };

  // 로케이션 혹은 벽을 삭제하는 API
  const deleteStructuresAPI = async (locationDeleteList, wallDeleteList) => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/signIn");
      return;
    }

    // API 형식에 맞게 재정의
    const structureDeleteRequest = {
      locationDeleteList,
      wallDeleteList,
    };

    try {
      const response = await fetch(
        `https://j11a302.p.ssafy.io/api/stores/${storeId}/structures/batch-delete`,
        {
          method: "POST", // Assuming POST is used for deletion
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(structureDeleteRequest),
        }
      );

      if (response.ok) {
        await getStoreStructureAPI(); // Refresh data
      } else {
      }
    } catch (error) {
    }
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
        const storeData = apiConnection.result; // 데이터 추출

        // 받아온 데이터 중 로케이션 데이터 처리
        const locations = storeData.locations;
        if (!locations) {
          //로케이션 없음
          return;
        }

        const newLocations = locations.map((location, index) => {
          let type = "location";
          if (location.locationType === "ENTRANCE") {
            type = "entrance";
          } else if (location.locationType === "EXIT") {
            type = "exit";
          }

          return {
            id: location.id.toString(),
            x: location.xposition,
            y: location.yposition,
            width: location.xsize || 50,
            height: location.ysize || 50,
            z: location.zsize,
            locationType: location.locationType,
            fill:
              type === "entrance" ? "green" : type === "exit" ? "red" : "blue",
            draggable: true,
            order: index,
            name: location.name || `적재함 ${index}`,
            type: type,
            rotation: 0,
          };
        });

        // 벽 데이터 처리
        const walls = storeData.walls;
        if (!walls) {
          //벽 없음
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
        //실패
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

  // 그리드 라인 생성하는 함수
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
    }
    for (let i = 0; i <= CANVAS_SIZE / GRID_SIZE_SUB_10; i++) {
      const pos = i * GRID_SIZE_SUB_10;
      lines.push(
        <Line
          key={`sub10h${i}`}
          points={[0, pos, CANVAS_SIZE, pos]}
          stroke="whitesmoke"
          strokeWidth={0.5}
          dash={[5, 5]}
        />
      );
      lines.push(
        <Line
          key={`sub10v${i}`}
          points={[pos, 0, pos, CANVAS_SIZE]}
          stroke="whitesmoke"
          strokeWidth={0.5}
          dash={[5, 5]}
        />
      );
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

  // 빈 공간을 클릭했을 때 사각형 선택 해제하는 함수
  const checkDeselect = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedLocationTransform(null);
    }
  };

  // 커서(cursor)를 정의하기 위한 변수
  let customCursor;
  if (currentSetting === "wall") {
    customCursor = "crosshair";
  } else if (currentSetting === "grab") {
    customCursor = "grab";
  } else {
    customCursor = "default";
  }

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

  //실시간 반응을 위해서 currentSetting에 대한 함수 작동을 메서드로 넘기기
  const changeCurrentSetting = (value) => {
    setCurrentSetting(value);

    const newDraggable = value !== "wall";
    anchorsRef.current.forEach(({ start, end }) => {
      start.draggable(newDraggable);
      end.draggable(newDraggable);
    });

    layerRef.current.batchDraw();
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

  // 로케이션과 벽을 삭제를 하기 위한 메서드
  const handleDelete = () => {
    if (selectedShapes.length > 0) {
      const locationDeleteList = [];
      const wallDeleteList = [];

      selectedShapes.forEach(({ id, type }) => {
        if (type === "location") {
          // Remove the location from state
          setLocations((prevLocations) =>
            prevLocations.filter((loc) => loc.id !== id)
          );
          locationDeleteList.push(parseInt(id));
        } else if (type === "wall") {
          // Remove the wall from state
          anchorsRef.current = anchorsRef.current.filter(
            ({ start, end, line }) => {
              if (line.id() === id) {
                // Destroy the line and anchors
                line.destroy();
                // Optionally, check and remove unused anchors here
                return false;
              }
              return true;
            }
          );
          wallDeleteList.push(parseInt(id));
        }

        // Remove the shape from Konva stage
        const shape = layerRef.current.findOne(`#${id}`);
        if (shape) {
          shape.destroy();
        }
      });

      // Call the API to delete the locations and walls
      deleteStructuresAPI(locationDeleteList, wallDeleteList);

      // Clear the selection
      setSelectedShapes([]);
      layerRef.current.batchDraw();
    }
  };

  // 우클릭 이후에 버튼에서 바뀌는 스타일
  const handleMouseEnter = (e) => {
    e.target.style.backgroundColor = "lightgray";
  };
  const handleMouseLeave = (e) => {
    e.target.style.backgroundColor = "white";
  };

  /**
   *  동적 작용 파트(유즈 이팩트)
   */

  useEffect(() => {
    const stage = stageRef.current;
    const layer = layerRef.current;

    //Event Handler for 'mousedown' Stage 위에 올렸을 때,
    const handleMouseDown = () => {
      if (currentSetting === "wall") {
        // 정확한 위치를 얻어온다.
        const pos = getPrecisePosition(stageRef.current);

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
      if (currentSetting === "wall" && line) {
        // 정확한 위치를 얻어온다.
        const pos = getPrecisePosition(stageRef.current);

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
          const pos = getPrecisePosition(stageRef.current);

          drawLine(startPos, pos);
          setLine(null);
          setStartPos(null);
          line.remove();
        } else {
          line.remove();
          layer.draw();
          //벽을 추가하기 위한 메서드

          // 정확한 위치를 얻어온다.
          const pos = getPrecisePosition(stageRef.current);

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

        // After adding the wall to the state, make the API call
        const wallData = [
          {
            startX: start.x,
            startY: start.y,
            endX: end.x,
            endY: end.y,
          },
        ];

        // Call the API function to save the wall
        postWallsAPI(wallData, storeId);
      }
    };

    //스테이지에 우클릭 메뉴 적용
    stage.on("contextmenu", function (e) {
      e.evt.preventDefault();
      if (e.target === stage) {
        // Hide the menu if it's open
        menuRef.current.style.display = "none";
        return;
      }

      // Set the current shape reference
      currentShapeRef.current = e.target;
      // Get the shape ID and type
      const clickedId = e.target.id();
      const shapeType = e.target.getAttr("shapeType");

      if (clickedId && shapeType) {
        setSelectedShapes([{ id: clickedId, type: shapeType }]);
        if (shapeType === "location") {
          setSelectedLocation(locations.find((loc) => loc.id === clickedId));
        } else {
          setSelectedLocation(null);
        }
      }
      // 메뉴의 정확한 위치 조정
      const precisePos = getPrecisePosition(stage);
      const menuNode = menuRef.current;
      const containerRect = stage.container().getBoundingClientRect();

      menuNode.style.display = "block"; // Make sure to display the menu
      menuNode.style.top = `${containerRect.top + precisePos.y}px`;
      menuNode.style.left = `${containerRect.left + precisePos.x}px`;
    });

    window.addEventListener("click", () => {
      if (menuRef.current) {
        menuRef.current.style.display = "none";
      }
    });

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

    // 레이어를 다시 그린다.(세팅이 바뀔 때)
    if (layerRef.current) {
      layerRef.current.batchDraw();
    }

    // Event-Lister들을 정리한다.
    return () => {
      stage.off("mousedown", handleMouseDown);
      stage.off("mousemove", handleMouseMove);
      stage.off("mouseup", handleMouseUp);
      // 메뉴 관련
      stage.off("contextmenu");
      window.removeEventListener("click", () => {
        menuRef.current.style.display = "none";
      });
    };
  }, [line, startPos, currentSetting, hoveredAnchor, locations]);

  // 최초 한번 실행된다.
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Start loading
        await getStoreStructureAPI();
      } catch (error) {
        //에러
      } finally {
        setLoading(false); // End loading
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

  //selectedIds를 최신화하기 위함
  useEffect(() => {
    // 로케이션 다중 선택
    if (trRef.current && layerRef.current) {
      const nodes = selectedShapes
        .filter((shape) => shape.type === "location") // Only locations can be transformed
        .map((shape) => layerRef.current.findOne(`#${shape.id}`))
        .filter(Boolean);
      trRef.current.nodes(nodes);
      trRef.current.getLayer().batchDraw();
    }

    // 벽 다중 선택
    anchorsRef.current.forEach(({ line }) => {
      const isSelected = selectedShapes.some(
        (shape) => shape.id === line.id() && shape.type === "wall"
      );
      line.stroke(isSelected ? "red" : "brown"); // Change color when selected
    });

    layerRef.current.batchDraw();
  }, [selectedShapes, locations]);

  /**
   * 창고 자동 생성 로직을 위한 부분
   */

  const [openContainerCreation, setOpenContainerCreation] = useState(false);
  const [formData, setFormData] = useState({
    containerName: "",
    containerXSize: "",
    containerYSize: "",
    locationX: "",
    locationY: "",
    locationZ: "",
    row: "",
    column: "",
  });

  const handleOpen = () => {
    setOpenContainerCreation(true);
  };

  const handleClose = () => {
    setOpenContainerCreation(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Extract values from formData
    const { locationX, locationY, locationZ, row, column } = formData;

    // Calculate fixed spacing between columns and rows
    const columnSpacing = 10; // Fixed spacing of 10px between columns
    const rowSpacing = parseInt(locationY); // Distance between rows equal to the height of each location

    // 위치 자동 생성을 위한 부분
    const newLocations = [];
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < column; j++) {
        // Format row and column numbers as two-digit strings
        const rowNumber = (i + 1).toString().padStart(2, "0"); // Convert to string and pad with zeros
        const columnNumber = (j + 1).toString().padStart(2, "0"); // Convert to string and pad with zeros

        // Calculate x and y positions with new spacing logic
        const xPosition = j * (parseInt(locationX) + columnSpacing);
        const yPosition = i * (parseInt(locationY) + rowSpacing);

        newLocations.push({
          id: null,
          x: xPosition,
          y: yPosition,
          z: parseInt(locationZ),
          width: Math.round(parseInt(locationX)),
          height: Math.round(parseInt(locationY)),
          draggable: true,
          order: newLocations.length + 1,
          name: `${rowNumber}-${columnNumber}`,
          productStorageType: "상온",
          fill: "0",
          rotation: 0,
          touchableFloor: 2, // 닿을 수 있는 층수
        });
      }
    }

    // Update locations state
    setLocations((prevLocations) => [...prevLocations, ...newLocations]);

    // Automatically create walls around the generated locations
    generateWalls(newLocations);

    handleClose();
  };

  // 벽 자동생성을 위한 것
  const generateWalls = (generatedLocations) => {
    if (generatedLocations.length === 0) return;

    // Calculate the bounding box for the new locations
    let minX = Number.MAX_VALUE,
      minY = Number.MAX_VALUE,
      maxX = 0,
      maxY = 0;

    generatedLocations.forEach((location) => {
      minX = Math.min(minX, location.x);
      minY = Math.min(minY, location.y);
      maxX = Math.max(maxX, location.x + location.width);
      maxY = Math.max(maxY, location.y + location.height);
    });

    // Create four corner anchors for the perimeter
    const topLeft = buildAnchor(null, minX, minY);
    const topRight = buildAnchor(null, maxX, minY);
    const bottomLeft = buildAnchor(null, minX, maxY);
    const bottomRight = buildAnchor(null, maxX, maxY);

    // Create walls (lines) between the corner anchors
    const newLines = [
      { start: topLeft, end: topRight },
      { start: topRight, end: bottomRight },
      { start: bottomRight, end: bottomLeft },
      { start: bottomLeft, end: topLeft },
    ];

    // Add the lines to the layer
    newLines.forEach(({ start, end }) => {
      const line = new Konva.Line({
        points: [start.x(), start.y(), end.x(), end.y()],
        stroke: newWallColor,
        strokeWidth: newWallWidth,
      });
      layerRef.current.add(line);

      anchorsRef.current.push({ start, end, line });
    });

    layerRef.current.batchDraw();
  };

  // RGB 색깔로 재고율 퍼센트(%)를 추출하는 함수
  const extractFillPercentage = (rgbaString) => {
    // Return 0% if the string is undefined or null
    if (!rgbaString) return "0.0";

    const matches = rgbaString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);

    if (matches) {
      const red = parseInt(matches[1], 10);
      const green = parseInt(matches[2], 10);

      // Calculate the percentage using both red and green components
      // Both red and green start at a higher value and decrease to 0 as the fill increases
      const redPercentage = (27 - red) / 27;
      const greenPercentage = (177 - green) / 177;

      // The fill percentage is determined by averaging the percentage contribution from red and green
      const fillPercentage = ((redPercentage + greenPercentage) / 2) * 100;

      return fillPercentage.toFixed(1);
    }

    return "0.0"; // Default to 0% if unable to parse
  };

  //--- 리턴 Part ---

  return (
    <div className={classes.canvasContainer}>
      {/* Left Sidebar */}
      <LeftSidebar
        currentSetting={currentSetting}
        changeCurrentSetting={changeCurrentSetting}
        newLocationZIndex={newLocationZIndex}
        setNewLocationZIndex={setNewLocationZIndex}
        newLocationWidth={newLocationWidth}
        setNewLocationWidth={setNewLocationWidth}
        newLocationHeight={newLocationHeight}
        setNewLocationHeight={setNewLocationHeight}
        newLocationName={newLocationName}
        setNewLocationName={setNewLocationName}
        nameMode={nameMode}
        setNameMode={setNameMode}
        rowNumber={rowNumber}
        setRowNumber={setRowNumber}
        columnNumber={columnNumber}
        setColumnNumber={setColumnNumber}
        newLocationType={newLocationType}
        setNewLocationType={setNewLocationType}
        handleAddLocation={handleAddLocation}
        newWallWidth={newWallWidth}
        setNewWallWidth={setNewWallWidth}
        // handleOpen={handleOpen} // If you need to open the modal from here
      />

      {/* Canvas 영역  */}
      <div className={classes.outOfCanvas}>
        <div className={classes.inOfCanvas} style={{ cursor: customCursor }}>
          <Stage
            ref={stageRef}
            width={window.innerWidth}
            height={window.innerHeight}
            scaleX={scale}
            scaleY={scale}
            x={stagePosition.x}
            y={stagePosition.y}
            draggable={currentSetting === "wall" ? false : true}
            onPointerMove={Pointer}
            onMouseDown={(e) => {
              handleMouseDownSelection(e);
              checkDeselect(e);
            }}
            onContextMenu={(e) => {
              e.evt.preventDefault();
            }}
            onMouseMove={handleMouseMoveSelection}
            onMouseUp={handleMouseUpSelection}
            // onTouchStart={checkDeselect}
            dragBoundFunc={(pos) => {
              // Restrict dragging to within 150% of the CANVAS_SIZE
              const minX = -(CANVAS_SIZE * 0.25);
              const minY = -(CANVAS_SIZE * 0.25);
              const maxX = CANVAS_SIZE * 0.75;
              const maxY = CANVAS_SIZE * 0.75;
              return {
                x: Math.max(minX, Math.min(maxX, pos.x)),
                y: Math.max(minY, Math.min(maxY, pos.y)),
              };
            }}
          >
            <Layer ref={layerRef}>
              {generateGridLines()}
              {locations.map((rect, i) => (
                <RectangleTransformer
                  key={rect.id}
                  shapeProps={rect}
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
                  isSelected={selectedShapes.includes(rect.id)}
                  onSelect={onSelect}
                  onChange={(newAttrs) => {
                    const rects = locations.slice();
                    rects[i] = newAttrs;
                    setLocations(rects);
                  }}
                />
              ))}
              {/* for Dragging */}
              <Rect
                fill="rgba(0, 161, 255, 0.3)"
                ref={selectionRectRef}
                visible={false}
              />
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
                onTransformEnd={(e) => {
                  // 선택된 모든 사각형이 업데이트 되는 거시기
                  const transformerNodes = trRef.current.nodes();
                  const updatedLocations = locations.slice();

                  transformerNodes.forEach((node) => {
                    const id = node.id();
                    const rectIndex = locations.findIndex(
                      (rect) => rect.id === id
                    );
                    if (rectIndex >= 0) {
                      const shapeProps = locations[rectIndex];
                      const scaleX = node.scaleX();
                      const scaleY = node.scaleY();

                      node.scaleX(1);
                      node.scaleY(1);

                      const newAttrs = {
                        ...shapeProps,
                        x: Math.round(node.x()),
                        y: Math.round(node.y()),
                        rotation: Math.round(node.rotation()),
                        width: Math.round(Math.max(5, node.width() * scaleX)),
                        height: Math.round(Math.max(5, node.height() * scaleY)),
                      };
                      // 복사된 array에 카피한다.
                      updatedLocations[rectIndex] = newAttrs;
                    }
                  });
                  // 위치를 업데이트한다.
                  setLocations(updatedLocations);
                }}
              />
            </Layer>
          </Stage>
        </div>
        {/* 줌 버튼 */}
        <div className={classes.zoomControler}>
          <Button
            justIcon
            round
            style={{ backgroundColor: "#31a5c8" }}
            onClick={handleZoomIn}
          >
            <ZoomInIcon className={classes.zoomicons} />
          </Button>
          <Button
            justIcon
            round
            style={{ backgroundColor: "#ADAAA5" }}
            onClick={handleZoomOut}
          >
            <ZoomOutIcon className={classes.zoomicons} />
          </Button>
          <Button
            justIcon
            round
            style={{ backgroundColor: "#b2ddef" }}
            onClick={editStoreAPI}
          >
            <SaveIcon className={classes.zoomicons} />
          </Button>
          {/* This button will be appear at Mobile Screen to control the showing RightSidebar */}
          <Button
            justIcon
            round
            className={classes.toggleSidebarButton}
            style={{ backgroundColor: "#999999", marginRight: "40px" }}
            onClick={toggleSidebar}
          >
            <MenuIcon className={classes.zoomicons} />
          </Button>
        </div>
      </div>

      {/* Right Sidebar */}
      {/* In Mobile Screen, its style change to toggle */}
      <RightSidebar
        classes={classes}
        isSidebarVisible={isSidebarVisible}
        locations={locations}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        selectedShapes={selectedShapes}
        setSelectedShapes={setSelectedShapes}
        layerRef={layerRef}
        trRef={trRef}
        extractFillPercentage={extractFillPercentage}
      />
      {/* Context Menu */}
      <ContextMenu
        menuRef={menuRef}
        handleDelete={handleDelete}
        handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave}
      />
      {/* 창고 자동 생성을 위한 모달 파트 */}
      <ContainerCreationModal
        open={openContainerCreation}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        formData={formData}
        handleChange={handleChange}
      />
      {loading && (
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      )}
    </div>
  );
};
export default MyContainerMap;
