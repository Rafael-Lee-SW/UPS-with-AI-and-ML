// Handsontable 라이브러리를 사용하기 위해 import합니다.
import Handsontable from "handsontable";

const ODD_ROW_CLASS = "odd";
// 컬럼 인덱스에 따른 헤더 정렬 클래스를 저장하는 맵을 생성합니다.
const headerAlignments = new Map([
  ["9", "htCenter"], // 9번 컬럼은 'htCenter' 정렬을 가집니다.
  ["10", "htRight"], // 10번 컬럼은 'htRight' 정렬을 가집니다.
  ["12", "htCenter"] // 12번 컬럼은 'htCenter' 정렬을 가집니다.
]);

// Handsontable 인스턴스에서 행에 클래스를 추가하는 함수를 정의합니다.
export const addClassesToRows = (TD, row, column, prop, value, cellProperties) => {
  // 컬럼이 첫 번째 컬럼이 아니면 함수를 종료합니다.
  if (column !== 0) {
    return;
  }

  // 현재 TD 요소의 부모 요소(TR 요소)를 가져옵니다.
  const parentElement = TD.parentElement;

  // 부모 요소가 없으면 함수를 종료합니다.
  if (parentElement === null) {
    return;
  }

  // 행 인덱스가 짝수인 경우, ODD_ROW_CLASS를 부모 요소에 추가합니다.
  if (row % 2 === 0) {
    
    Handsontable.dom.addClass(parentElement, ODD_ROW_CLASS);
  } else {
    // 행 인덱스가 홀수인 경우, ODD_ROW_CLASS를 부모 요소에서 제거합니다.
    Handsontable.dom.removeClass(parentElement, ODD_ROW_CLASS);
  }
};

// 행 헤더에 체크박스를 그리는 함수를 정의합니다.
export const drawCheckboxInRowHeaders = function drawCheckboxInRowHeaders(row, TH) {
  // 체크박스 input 요소를 생성합니다.
  const input = document.createElement("input");
  input.type = "checkbox";

  // 행 인덱스가 유효하고 첫 번째 컬럼의 데이터가 참인 경우, 체크박스를 체크 상태로 만듭니다.
  if (row >= 0 && this.getDataAtRowProp(row, "0")) {
    input.checked = true;
  }

  // 테이블 헤더 셀의 내용을 비웁니다.
  Handsontable.dom.empty(TH);

  // 체크박스 input 요소를 테이블 헤더 셀에 추가합니다.
  TH.appendChild(input);
};

// 컬럼 인덱스에 따른 헤더 정렬을 정의하는 함수입니다.
export function alignHeaders(column, TH) {
  // 컬럼 인덱스가 음수이면 함수를 종료합니다.
  if (column < 0) {
    return;
  }

  // 테이블 헤더 셀에 첫 번째 자식 요소가 있는 경우
  if (TH.firstChild) {
    // 테이블의 텍스트 방향에 따른 정렬 클래스를 결정합니다.
    const alignmentClass = this.isRtl() ? "htRight" : "htLeft";

    // 해당 컬럼에 대한 정렬 클래스가 미리 정의되어 있는 경우
    if (headerAlignments.has(column.toString())) {
      // 기본 정렬 클래스를 제거합니다.
      Handsontable.dom.removeClass(TH.firstChild, alignmentClass);
      // 해당 컬럼의 특정 정렬 클래스를 추가합니다.
      Handsontable.dom.addClass(TH.firstChild, headerAlignments.get(column.toString()));
    } else {
      // 기본 정렬 클래스를 추가합니다.
      Handsontable.dom.addClass(TH.firstChild, alignmentClass);
    }
  }
}

// // 체크박스 셀의 상태를 변경하는 함수를 정의합니다.
// export const changeCheckboxCell = function changeCheckboxCell(event, coords) {
//   // 이벤트의 타겟 요소를 가져옵니다.
//   const target = event.target;

//   // 컬럼 인덱스가 -1(헤더)이고 타겟 요소가 input 요소인 경우
//   if (coords.col === -1 && event.target && target.nodeName === "INPUT") {
//     // 기본 동작을 막습니다.
//     event.preventDefault();

//     // 체크박스 상태를 토글합니다.
//     this.setDataAtRowProp(coords.row, "0", !target.checked);
//   }
// };

// 새로운 컬럼을 삽입하는 함수를 정의합니다.
export const insertColumn = function insertColumn(hotInstance, columnIndex) {
  hotInstance.alter('insert_col', columnIndex);
};

// 특정 컬럼을 제거하는 함수를 정의합니다.
export const removeColumn = function removeColumn(hotInstance, columnIndex) {
  hotInstance.alter('remove_col', columnIndex);
};
