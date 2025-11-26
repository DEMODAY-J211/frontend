import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";

const HomeUserLanding = () => {
  const navigate = useNavigate();

  // useEffect(() => {
  //   const redirectUrl = localStorage.getItem("redirectUrl");
  //   // if (redirectUrl) {
  //   //   navigate(redirectUrl);
  //   // } else {
  //   //   alert("처음 들어갔던 예매 링크로 다시 접속해주세요.");
  //   // }
  // navigate("/2/homeuser", { replace: true });
  // }, []);

  return (
    <div>
      <h1>Loading.....</h1>
      {/* 여기는 fallback UI */}
    </div>
  );
};
export default HomeUserLanding;
