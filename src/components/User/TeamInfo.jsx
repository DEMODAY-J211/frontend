import styled from "styled-components";
import { BsInstagram, BsFacebook } from "react-icons/bs";
import tikitta_logo from "../../assets/tikitta_white_small.svg";
import { BiLogoYoutube } from "react-icons/bi";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const serverUrl = import.meta.env.VITE_API_URL;

export default function TeamInfo() {
  const { managerId } = useParams();
  const [managerData, setManagerData] = useState([]);
  const managerUrls = managerData?.managerUrl || [];

  const platformIcons = [
    { name: "youtube", match: "youtube", icon: BiLogoYoutube, size: 32 },
    { name: "facebook", match: "facebook", icon: BsFacebook, size: 24 },
    { name: "instagram", match: "instagram", icon: BsInstagram, size: 24 },
  ];

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
          {managerUrls.map((url, idx) => {
            const platform = platformIcons.find((p) => url.includes(p.match));

            if (platform) {
              const Icon = platform.icon;
              return (
                <Icon
                  key={idx}
                  size={platform.size}
                  onClick={() => window.open(url)}
                />
              );
            }

            // 매칭 안 되는 경우 = tikittalogo 표시
            return (
              <img
                key={idx}
                src={tikitta_logo}
                alt="tikitta_logo"
                onClick={() => window.open(url)}
                style={{
                  width: 24,
                  height: 24,
                  cursor: "pointer",
                  backgroundColor: "var(--color-primary)",
                  borderRadius: "5px",
                  padding: "3px",
                }}
              />
            );
          })}
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
