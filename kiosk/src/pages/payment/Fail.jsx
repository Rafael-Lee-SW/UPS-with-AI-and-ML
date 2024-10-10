import { useRouter } from "next/router";
import { useEffect } from "react";

export function FailPage() {
  const router = useRouter();
  const { message, code } = router.query;

  useEffect(() => {
    console.log("결제 실패:", { message, code });
  }, [message, code]);

  return (
    <div className="result wrapper">
      <div className="box_section">
        <h2>결제 실패</h2>
        <p>{`에러 코드: ${code || '없음'}`}</p>
        <p>{`실패 사유: ${message || '알 수 없는 오류'}`}</p>
      </div>
    </div>
  );
}

export default FailPage;
