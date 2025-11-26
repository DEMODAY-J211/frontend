import styled from "styled-components";
import NavbarUser from "../../components/Navbar/NavbarUser.jsx";
import { RiArrowLeftWideFill } from "react-icons/ri";
import { RiArrowRightWideFill } from "react-icons/ri";
import { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { formatKoreanDate } from "../../utils/dateFormat.js";
import { useAuth } from "../Auth/AuthContext.jsx";
import LoginRequiredModal from "../../components/Modal/LoginRequiredModal.jsx";
// s00104

const serverUrl = import.meta.env.VITE_API_URL;

export default function HomeUser() {
  const { managerId } = useParams();
  const [shows, setShows] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userReservations, setUserReservations] = useState([]);
  const currentShow = useMemo(() => shows[currentIndex], [shows, currentIndex]);
  const navigate = useNavigate();
  const [teamTitle, setTeamTitle] = useState(null);
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const requireLogin = (action) => {
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }
    action(); // 로그인된 경우에만 실행
  };

  const handleHeaderIconClick = () => {
    requireLogin(() => {
      navigate(`/${managerId}/myticketlist`);
    });
  };

  useEffect(() => {
    console.log("managerId :", managerId);
  }, [managerId]);

  useEffect(() => {
    console.log("shows :", shows);
  }, [shows]);

  function handleNext() {
    setCurrentIndex((prev) => Math.min(prev + 1, shows.length - 1));
  }
  function handlePrev() {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }
  // console.log(isLoggedIn);
  const handleBuyTicket = () => {
    if (!currentShow) return;
    requireLogin(() => {
      navigate(`/${managerId}/viewshowdetail/${currentShow.showId}`);
    });
  };

  // console.log("currentshow manaerId", currentShow.managerId);
  const fetchShows = async () => {
    try {
      // const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/user/${managerId}/main`,
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
      setTeamTitle(result.data.managerName);
      if (result.success) {
        // setManagerData(result.data);
        setShows(result.data.showList);
      }
    } catch (error) {
      console.error("공연 조회 실패:", error);
      alert("해당 공연 단체를 찾을 수 없습니다.");
    }
  };

  const fetchUserRes = async () => {
    // 유저가 예매한 공연
    console.log("=== 예매 내역 조회 시작 ===");
    console.log("managerId:", managerId);

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

      if (result2.success) {
        setUserReservations(result2.data);
        console.log(
          "로그인한 유저가 예매한 페이지",
          userresponse,
          result2.data
        );
        // setIsLoggedIn(true);
      }
    } catch (error) {
      // setIsLoggedIn(false);
      console.error("예매한 공연 조회 실패:", error);
      // alert("예매한 공연 조회를 할 수 없습니다.");
    }
  };

  useEffect(() => {
    fetchShows(); // 공연 리스트
    fetchUserRes(); // 유저가 예매한 공연 리스트
  }, []);

  return (
    <PageWrapper>
      <HomeUserContainer>
        {isLoginModalOpen && <LoginRequiredModal close={closeLoginModal} />}

        <NavbarUser
          managerId={managerId}
          text={teamTitle}
          onIconClick={handleHeaderIconClick}
        />
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
                  !isLoggedIn || (isLoggedIn && currentShow.reservable)
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
