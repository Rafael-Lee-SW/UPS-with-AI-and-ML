import { useRouter } from "next/router";

export function FailPage() {
  const router = useRouter();
  const { message, code } = router.query;

  return (
    <div className="result wrapper">
      <div className="box_section">
        <h2>결제 실패</h2>
        <p>{`에러 코드: ${code}`}</p>
        <p>{`실패 사유: ${message}`}</p>
      </div>
    </div>
  );
}

export default FailPage;
