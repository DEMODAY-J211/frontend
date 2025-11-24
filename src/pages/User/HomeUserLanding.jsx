import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";

const HomeUserLanding = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  useEffect(() => {
    const redirectUrl = localStorage.getItem("redirectUrl");
    if (!user || user.type !== "user") {
      setUser({ type: "user" }); // 안전하게 user 상태 재설정
    }
    if (redirectUrl) {
      navigate(redirectUrl);
    } else {
      alert("처음 들어갔던 예매 링크로 다시 접속해주세요.");
    }
  }, [navigate]);

  return (
    <div>
      <h1>User Home</h1>
      {/* 여기는 fallback UI */}
    </div>
  );
};
export default HomeUserLanding;
