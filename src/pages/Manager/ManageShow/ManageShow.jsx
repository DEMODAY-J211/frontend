import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import NavbarManager from "../../../components/Navbar/NavbarManager";
import checkqrimg from "../../../assets/manageshow/checkqr.png";
import editshow from "../../../assets/manageshow/editshow.png";
import entrystatus from "../../../assets/manageshow/entrystatus.png";
import manageuser from "../../../assets/manageshow/manageuser.png";

import { useRef } from "react";
import { useState, useEffect } from "react";

import { RiArrowLeftWideFill } from "react-icons/ri";
import { RiArrowRightWideFill } from "react-icons/ri";
import defaultimg from "../../../assets/tikitta_defaultcard.png";

const ManageShow = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      menuname: "예매자 관리",
      desc: "예매자 목록을 확인하고 관리할 수 있습니다.",
      icon: <img src={manageuser} alt="manageuser" />,
      path: "/manageshow/manageuser",
    },
    {
      menuname: "입장 현황",
      desc: "현재 입장 현황을 확인할 수 있습니다.",
      icon: <img src={entrystatus} alt="entrystatus" />,
      path: "/manageshow/entrystatus",
    },
    {
      menuname: "공연 정보 수정",
      desc: "공연 정보를 수정할 수 있습니다.",
      icon: <img src={editshow} alt="editshow" />,
      path: "/manageshow/manageuser",
    },
    {
      menuname: "QR 코드 확인",
      desc: "QR 체크인 화면으로 이동합니다.",
      icon: <img src={checkqrimg} alt="checkqrimg" />,
      path: "/qrmanager",
    },
  ];

  const [posters, setPosters] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0); // 실제 posters index
  const [startIndex, setStartIndex] = useState(0);
  const [selectedShow, setSelectedShow] = useState(null);

  const visibleCount = Math.min(7, posters.length);

  const handleCardClick = (realIndex) => {
    setSelectedIndex(realIndex);
    setSelectedShow(posters[realIndex]);
  };

  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    if (posters.length <= visibleCount) return;

    if (direction === "left") {
      setStartIndex((prev) => (prev - 1 + posters.length) % posters.length);
    } else {
      setStartIndex((prev) => (prev + 1) % posters.length);
    }
  };

  // 🔥 visiblePosters에서 realIndex를 포함시킴
  const visiblePosters =
    posters.length <= visibleCount
      ? posters.map((p, i) => ({ ...p, realIndex: i }))
      : Array.from({ length: visibleCount }, (_, i) => {
          const realIndex = (startIndex + i) % posters.length;
          return { ...posters[realIndex], realIndex };
        });

const handleMenuClick = (item) => {
  // QR 코드 확인은 showId 없이 이동
  if (item.menuname === "QR 코드 확인") {
    if (!selectedShow) {
      alert("먼저 공연을 선택해주세요.");
      return;
    }
    navigate(`${item.path}`);
    return;
  }

  // 그 외 메뉴는 showId 필요
  if (!selectedShow) {
    alert("먼저 공연을 선택해주세요.");
    return;
  }

  navigate(`${item.path}/${selectedShow.showId}`);
};


  // API
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const viewShows = async () => {
    try {
      setError("");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/manager/shows/list`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok || result.success !== true) {
        throw new Error(result.message || "공연 목록 조회 실패");
      }

      setPosters(result.data.published ?? []);
    } catch (error) {
      console.error("Error fetching shows:", error);
      setError(error.message);
    }
  };

  // 첫 로드 시 API 호출
  useEffect(() => {
    viewShows();
  }, []);

  // posters 로딩 후 첫 공연 자동 선택
  useEffect(() => {
    if (posters.length > 0) {
      setSelectedIndex(0);
      setSelectedShow(posters[0]);
    }
  }, [posters]);

  if (loading) return <p style={{ padding: "150px" }}>불러오는 중...</p>;
  if (error) return <p style={{ padding: "150px", color: "red" }}>{error}</p>;

  return (
    <MyShow>
      <NavbarManager />
      <MyShowContent>
        <Title>내 공연 관리</Title>
        <Shows>
          <Arrow onClick={() => handleScroll("left")}>
            <RiArrowLeftWideFill size={28} />
          </Arrow>

          <CardList ref={scrollRef}>
            {visiblePosters.map((poster, index) => (
              <CardContainer
                key={index}
                onClick={() => handleCardClick(poster.realIndex)}
              >
                <Card
                  $selected={selectedIndex === poster.realIndex}
                  style={{ backgroundColor: "var(--color-tertiary)" }}
                >
                  <Poster
                    src={poster.poster ? poster.poster : defaultimg}
                    alt={poster.title}
                  />
                </Card>
                <ShowName>{poster.title}</ShowName>
              </CardContainer>
            ))}
          </CardList>

          <Arrow onClick={() => handleScroll("right")}>
            <RiArrowRightWideFill size={28} />
          </Arrow>
        </Shows>

        <Container>
          {menuItems.map((item, idx) => (
            <Menu key={idx} onClick={() => handleMenuClick(item)}>
              <TextBox>
                <MenuTitle>{item.menuname}</MenuTitle>
                <Desc>{item.desc}</Desc>
              </TextBox>
              <Icon>{item.icon}</Icon>
            </Menu>
          ))}
        </Container>
      </MyShowContent>
    </MyShow>
  );
};

export default ManageShow;

/* ------------------------ styled ------------------------ */

const MyShow = styled.div``;

const MyShowContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 50px 100px;
  justify-content: space-between;
  align-items: center;
  flex: 1 0 0;
  align-self: stretch;
`;

const Title = styled.div`
  align-self: stretch;
  font-size: 30px;
  font-weight: 500;
  padding-left: 5px;
`;

const Shows = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 400px;
  padding: 40px 0;
  justify-content: center;
`;

const Arrow = styled.div`
  padding: 10px;
  cursor: pointer;
  z-index: 10;
  transition: 0.2s ease;
  border-radius: 50%;
  &:hover {
    transform: scale(1.1);
    background-color: #f5f5f5;
  }
`;

const CardList = styled.div`
  display: flex;
  align-items: center;
  overflow-x: auto;
  gap: 50px;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  &::-webkit-scrollbar {
    display: none;
  }
  width: 100%;
  height: 100%;
  padding-left: 20px;
`;

const CardContainer = styled.div`
  flex: 0 0 auto;
  scroll-snap-align: start;
  text-align: center;
`;

const Card = styled.div`
  display: flex;
  width: ${(props) => (props.$selected ? "145px" : "120px")};
  height: ${(props) => (props.$selected ? "221px" : "182px")};
  padding: 5px;
  border-radius: ${(props) => (props.$selected ? "10px" : "20px")};
  justify-content: center;
  align-items: center;
  background: ${(props) =>
    props.$selected ? "#fff" : "var(--color-tertiary)"};
  box-shadow: ${(props) =>
    props.$selected
      ? "0 0 15px 3px rgba(252, 40, 71, 0.5)"
      : "2px 2px 10px rgba(0,0,0,0.15)"};
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    transform: translateY(-4px);
  }
`;

const Poster = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  object-fit: cover;
`;

const ShowName = styled.div`
  margin-top: 10px;
  font-size: 14px;
  font-weight: 300;
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  background-color: #fff;
`;

const Menu = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 586px;
  height: 213px;
  padding: 36px 30px;
  border-radius: 30px;
  background: var(--color-tertiary);
  box-shadow: 3px 3px 15px 3px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
  cursor: pointer;
  &:hover {
    transform: translateY(-4px);
    background-color: #fbdede;
  }
`;

const MenuTitle = styled.div`
  font-size: 30px;
  font-weight: 500;
`;

const Icon = styled.div`
  font-size: 48px;
`;

const TextBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const Desc = styled.p`
  font-size: 14px;
  color: #333;
`;
