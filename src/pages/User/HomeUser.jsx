import styled from "styled-components";
import NavbarUser from "../../components/Navbar/NavbarUser.jsx";
import { RiArrowLeftWideFill } from "react-icons/ri";
import { RiArrowRightWideFill } from "react-icons/ri";
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatKoreanDate } from "../../utils/dateFormat.js";
import { useAuth } from "../Auth/AuthContext.jsx";

// s00104
const managerId = 5;
// const serverUrl = import.meta.env.VITE_API_URL;
// const serverUrl = "http://15.164.218.55:8080";
const serverUrl = "https://back-tikitta.duckdns.org";

export default function HomeUser() {
  const [shows, setShows] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userReservations, setUserReservations] = useState([]);
  const currentShow = useMemo(() => shows[currentIndex], [shows, currentIndex]);
  const navigate = useNavigate();
  // const managerData = JSON.parse(localStorage.getItem("managerData"));
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  useEffect(() => {
    // setmanaer;
  });

  useEffect(() => {
    const jsessionId = getCookie("JSESSIONID");
    if (jsessionId) {
      setIsLoggedIn(true);
    }
  }, [setIsLoggedIn]);

  function getCookie(name) {
    const matches = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return matches ? matches[2] : null;
  }

  // if (managerData) {
  //   console.log("저장된 매니저 데이터:", managerData);
  // }
  function handleNext() {
    setCurrentIndex((prev) => Math.min(prev + 1, shows.length - 1));
  }
  function handlePrev() {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }
  // console.log(isLoggedIn);
  const handleBuyTicket = () => {
    if (!currentShow) return;

    navigate(`/viewshowdetail/${currentShow.showId}`, {
      state: {
        managerId: managerId,
        showId: currentShow.showId,
      },
    });
  };
  // console.log("currentshow manaerId", currentShow.managerId);
  const fetchShows = async () => {
    try {
      // const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/user/${3}/main`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            // Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-type": "application/json",
          },
        }
      );
      const result = await response.json();
      console.log("managerId의 등록된 공연 Data", result);
      if (result.success) {
        // setManagerData(result.data);
        setShows(result.data.showList);
        // 2️⃣ 로컬에 저장 (JSON 형태로)
        localStorage.setItem("managerData", JSON.stringify(result.data));
      }
    } catch (error) {
      console.error("공연 조회 실패:", error);
      alert("해당 공연 단체를 찾을 수 없습니다.");
    }
  };

  const fetchUserRes = async () => {
    // 유저가 예매한 공연
    try {
      // const token = localStorage.getItem("accessToken");
      const userresponse = await fetch(
        `${import.meta.env.VITE_API_URL}/user/${managerId}/myshow`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            // Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            Accept: "application/json",
            "Content-type": "application/json",
          },
        }
      );

      const result2 = await userresponse.json();
      console.log("status", userresponse.status);
      console.log("text", await userresponse.text());

      // Mock 데이터
      // const mockData = {
      //   success: true,
      //   code: 200,
      //   message: "success",
      //   data: {
      //     managerId: 1,
      //     managerName: "멋쟁이연극회",
      //     showList: [
      //       {
      //         showId: 12,
      //         showTitle: "제11회 정기공연",
      //         showTimes: "2025-09-25",
      //         showLocation: "서강대학교 메리홀 소극장",
      //         showPosterPicture:
      //           "data:image/png;base64,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",
      //         isReservable: true,
      //       },
      //       {
      //         showId: 13,
      //         showTitle: "제12회 정기공연",
      //         showTimes: "2025-10-25",
      //         showLocation: "서강대학교 메리홀 대극장",
      //         showPosterPicture:
      //           "data:image/jpeg;base64,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",
      //         isReservable: false,
      //       },
      //     ],
      //   },
      // };
      console.log("로그인한 유저가 예매한 페이지", userresponse);
      if (result2.success) {
        setUserReservations(result2.data);
        console.log("로그인한 유저가 예매한 페이지", result2.success);
      }
    } catch (error) {
      console.error("예매한 공연 조회 실패:", error);
      alert("예매한 공연 조회를 할 수 없습니다.");
    }
  };
  useEffect(() => {
    fetchShows(); // 공연 리스트
    fetchUserRes(); // 유저가 예매한 공연 리스트
  }, []);

  // useEffect(() => {
  //   console.log("userReservation", userReservations);
  //   console.log("managerData", managerData);
  // });
  return (
    <PageWrapper>
      <HomeUserContainer>
        <NavbarUser />
        {!currentShow ? (
          <p>공연 정보를 불러오는 중입니다...</p>
        ) : (
          <ShowList>
            <button
              className="buttoncontainer"
              onClick={handlePrev}
              style={{ visibility: currentIndex === 0 ? "hidden" : "visible" }}
            >
              <RiArrowLeftWideFill size="40px" />
            </button>
            <ShowItemWrapper onClick={handleBuyTicket}>
              <ShowItemSlider index={currentIndex}>
                {shows.map((show) => {
                  return (
                    <ShowItem key={show.showId}>
                      <img
                        className="poster"
                        src={show.showPosterPicture}
                        alt={show.showTitle}
                      />
                      <div className="info">
                        <p>{formatKoreanDate(show.showTimes).split(" ")[0]}</p>
                        <h3>{show.showTitle}</h3>
                        <p>{show.showLocation}</p>
                      </div>
                    </ShowItem>
                  );
                })}
              </ShowItemSlider>
              <Buyticketbtn
                reservable={
                  !isLoggedIn || (isLoggedIn && currentShow.isReservable)
                }
                onClick={handleBuyTicket}
              >
                {userReservations.includes(currentShow.showId)
                  ? "예매 내역 확인하기"
                  : "예매하기"}
              </Buyticketbtn>
            </ShowItemWrapper>

            <button
              className="buttoncontainer"
              onClick={handleNext}
              style={{
                visibility:
                  currentIndex === shows.length - 1 ? "hidden" : "visible",
              }}
            >
              <RiArrowRightWideFill size="40px" />
            </button>
          </ShowList>
        )}
      </HomeUserContainer>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  min-height: 100vh;
  background-color: #fff;

  color: #000;
  font-size: 20px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
`;

const HomeUserContainer = styled.div`
  display: flex;
  // width: 393px;
  min-width: 375px;
  max-width: 430px;
  width: 100vw;
  flex-direction: column;
  align-items: flex-start;
  background: #fff;
  box-shadow: 0 0 30px 5px rgba(0, 0, 0, 0.25);
`;

const ShowList = styled.div`
  display: flex;
  align-items: center;
  flex: 1 0 0;
  align-self: stretch;

  .buttoncontainer {
    display: flex;
    aspect-ratio: 1/1;
    background: none;
    border: none;
    cursor: pointer;
  }
`;

const ShowItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
  gap: 15px;
`;

const ShowItemSlider = styled.div`
  display: flex;
  transition: transform 0.5s ease-in-out;
  transform: translateX(${(props) => -props.index * 100}%);
  width: ${(props) => props.total * 100}%; // 총 아이템 수에 맞춰 width 조정
`;

const ShowItem = styled.div`
  flex: 0 0 100%; // 부모의 100% 너비 차지
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 30px;

  .poster {
    height: 478.115px;
    width: 100%;
    align-self: stretch;
    // aspect-ratio: 313/478.11;
    aspect-ratio: 1/1.414;
    border-radius: 20px;
    background: #fff1f0;
    box-shadow: 3px 3px 15px 3px rgba(0, 0, 0, 0.15);
  }
`;

const Buyticketbtn = styled.div`
  display: flex;
  padding: 10px 20px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  border-radius: 10px;
  background: ${(props) => (props.reservable ? "#fc2847" : "#cccccc")};
  border: none;
  cursor: ${(props) => (props.reservable ? "pointer" : "")};
  color: #fff;
  font-size: 20px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
  width: 100%;
  transition: background 0.3s ease;

  &:hover {
    background: ${(props) => (props.reservable ? "#e0203e" : "#cccccc")};
  }
`;
