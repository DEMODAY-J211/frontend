import styled from "styled-components";
import { BsInstagram, BsFacebook } from "react-icons/bs";
import { BiLogoYoutube } from "react-icons/bi";
import { useState, useEffect } from "react";

const managerId = 1;
// const serverUrl = import.meta.env.VITE_API_URL;
const serverUrl = "http://15.164.218.55:8080";

// const mockData = {
//   managerId: 1,
//   managerName: "멋쟁이 연극회",
//   managerPicture: "https://example.com/profile.png",
//   managerIntro: "멋쟁이 연극회입니다.",
//   managerText:
//     "이런 멋쟁이연극회 좋아할래 이런 멋쟁이연극회 좋아할래 이런 멋쟁이연극회 좋아할래...",
//   managerUrl: [
//     "https://instagram.com/example",
//     "https://youtube.com/example",
//     "https://facebook.com/example",
//   ],
// };

export default function TeamInfo() {
  const [managerData, setManagerData] = useState([]);

  useEffect(() => {
    fetch(`${serverUrl}/user/${managerId}/organization`, {
      headers: {},
    })
      .then((res) => {
        if (!res.ok) throw new Error("네트워크 응답 실패");
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setManagerData(data.data);
          -console.log(data.data);
        } else {
          console.error("공연 조회 실패:", error);
          alert("해당 공연 단체를 찾을 수 없습니다.");
        }
      })
      .catch((err) => console.error("Fetch 에러", err));
  }, []);

  return (
    <TeamContainer>
      <div className="team">
        <img className="team_img" src={managerData.managerPicture} />
        <h2>{managerData.managerName}</h2>
        <LinkContainer>
          <BsInstagram
            size={24}
            onClick={() => window.open(managerData.managerUrl[0])}
          />
          <BiLogoYoutube
            size={32}
            onClick={() => window.open(managerData.managerUrl[2])}
          />
          <BsFacebook
            size={24}
            onClick={() => window.open(managerData.managerUrl[1])}
          />
        </LinkContainer>
      </div>
      <p>한줄 소개</p>
      {managerData.managerIntro}
      {managerData.managerText && (
        <>
          <p>소개글</p>
          {managerData.managerText}
        </>
      )}
    </TeamContainer>
  );
}

const TeamContainer = styled.div`
  display: flex;
  padding: 20px;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  flex: 1 0 0;
  text-align: justify;
  font-size: 15px;
  font-weight: 300;
  line-height: 1.2;
  min-width: 375px;
  max-width: 430px;
  width: 100vw;

  .team {
    display: flex;
    flex-direction: column;
    align-items: center;
    align-self: stretch;
    gap: 16px;
  }
  .team_img {
    height: 163px;
    aspect-ratio: 1/1;
    border-radius: 1000px;
    border: 1px solid #000;
    background: #000;
  }
  p {
    align-self: stretch;
    font-size: 20px;
    font-weight: 500;
  }
`;

const LinkContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fc2847;
  cursor: pointer;
`;
