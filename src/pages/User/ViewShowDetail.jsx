import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
import NavbarUser from "../../components/Navbar/NavbarUser";
import ShowTab from "../../components/User/ShowTab";
import LoginRequiredModal from "../../components/Modal/LoginRequiredModal";
import Footerbtn from "../../components/Save/Footerbtn";
import BottomSheet from "../../components/User/BottomSheet";
import AlertModal from "../../components/Modal/AlertModal";
import { formatKoreanDate } from "../../utils/dateFormat";
import { useAuth } from "../Auth/AuthContext";
// s01001

const serverUrl = import.meta.env.VITE_API_URL;

export default function ViewShowDetail() {
  const { managerId, showId } = useParams();
  const navigate = useNavigate();
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showData, setShowData] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [bookingStatus, setBookingStatus] = useState("before");

  // "before" | "available" | "closed"
  const { isLoggedIn } = useAuth();
  const handlebtn = () => {
    if (!showBottomSheet) {
      setShowBottomSheet(true); // 로그인 되어 있으면 bottomsheet
    } else if (showBottomSheet) {
      navigate(`../selectseat/${showId}`);
      // navigate(`../payment`);
    } else {
      navigate(`../selectseat/${showId}`);
    }
  };
  const fetchShows = async () => {
    try {
      // const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${serverUrl}/user/${managerId}/detail/${showId}`,
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
        setShowData(result.data);
        console.log(result.data);
      }
    } catch (error) {
      console.error("공연 상세정보 조회 실패:", error);
      alert("해당 공연 상세정보를 찾을 수 없습니다.");
    }
  };

  useEffect(() => {
    fetchShows();
  }, []);

  useEffect(() => {
    if (!showData.bookingStartAt) return;

    const now = new Date();
    const bookingStart = new Date(showData.bookingStartAt);
    const showStart = new Date(showData.showStartDate);
    const showendStart = new Date(showData.showtimeEndDate);
    const bookingEnd = new Date(showStart.getTime() - 60 * 60 * 1000); // 첫 공연 1시간 전

    if (now < bookingStart) {
      setBookingStatus("before"); // 예매 전
      console.log("예매 전");
      // } else if (now >= bookingStart && now <= bookingEnd) {
    } else if (now >= bookingStart && now <= showendStart) {
      setBookingStatus("available"); // 예매 가능
      console.log("예매 가능");
    } else {
      setBookingStatus("closed"); // 예매 종료
      console.log("예매 종료", { now, bookingStart, bookingEnd, showStart });
    }
  }, [showData]);
  return (
    <PageWrapper>
      <HomeUserContainer>
        <NavbarUser Backmode={true} text="" />
        {!showData ? (
          <ShowContainer>
            <p
              style={{
                textAlign: "center",
                padding: "20px",
                fontSize: "16px",
                color: "#666",
              }}
            >
              공연 정보를 불러오는 중입니다...
            </p>
          </ShowContainer>
        ) : (
          <>
            <ShowContainer>
              <ShowInfo>
                <div className="posterwrapper">
                  <img
                    className="poster"
                    src={showData.showPosterPicture}
                    alt={showData.showTitle}
                  />
                  <div className="wrapper">
                    <h2>{showData.showTitle}</h2>
                    <b>
                      {formatKoreanDate(showData.showStartDate)} ~{" "}
                      {formatKoreanDate(showData.showtimeEndDate)}
                      <br />
                      {showData.showLocation}
                    </b>
                  </div>
                </div>

                <div className="wrapper">
                  <a>공연 날짜·회차</a>
                  {showData.showtimeList?.map((show, idx) => (
                    <b key={show.showtimeId}>
                      {idx + 1}회차 {formatKoreanDate(show.showtimeStart)}
                    </b>
                  ))}
                </div>
                <div className="wrapper">
                  <a>예매 기한</a>
                  <b>
                    {formatKoreanDate(showData.bookingStartAt)} ~ 각 공연 시작
                    1시간 전
                  </b>
                </div>
                <div className="wrapper">
                  <a>티켓</a>
                  {showData.ticketOptionList?.map((ticket, idx) => (
                    <b key={idx}>
                      {ticket.ticketoptionName} {ticket.ticketoptionPrice}원
                    </b>
                  ))}
                </div>
                <div className="wrapper">
                  <a>공연 장소</a>
                  <b>{showData.showLocation}</b>
                </div>
                <div className="wrapper">
                  <a>공연 단체</a>
                  <b>
                    <b>{showData.managerInfo?.managerName}</b>
                    <b>{showData.managerInfo?.managerEmail}</b>
                  </b>
                </div>
              </ShowInfo>
              <ShowTab
                hasGroupInfo={true}
                showDetailText={showData.showDetailText}
                showDetailImages={showData.detailImageUrls}
              ></ShowTab>
            </ShowContainer>

            {!showBottomSheet && (
              <Footerbtn
                buttons={[
                  {
                    text:
                      bookingStatus === "before"
                        ? "예매 준비 중"
                        : bookingStatus === "available"
                        ? "예매하기"
                        : "예매 종료",
                    color: bookingStatus === "available" ? "red" : "gray",
                    onClick: handlebtn,
                  },
                ]}
              />
            )}
          </>
        )}
      </HomeUserContainer>

      {/* 로그인 되어 있으면 바텀시트 */}
      {showBottomSheet && (
        <BottomSheet
          onClose={() => setShowBottomSheet(false)}
          onNeedModal={() => setShowAlert(true)}
          tempData={showData}
        />
      )}

      {showAlert && <AlertModal onClose={() => setShowAlert(false)} />}
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  min-height: 100vh;
  // background-color: #fff;
  background-color: ${(props) => (props.$dimmed ? "rgba(0,0,0,0.2)" : "#fff")};
  transition: background-color 0.3s ease;

  color: #000;
  font-size: 20px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
`;

const HomeUserContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  // width: 393px;
  min-width: 375px;
  max-width: 430px;
  width: 100vw;
  align-items: flex-start;
  background: #fff;
  box-shadow: 0 0 30px 5px rgba(0, 0, 0, 0.25);
`;

const ShowContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1 0 0;
  align-self: stretch;
`;

const ShowInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  // padding: 20px;
  gap: 10px;
  align-self: stretch;
  background: #ebebeb;

  .posterwrapper {
    display: flex;
    // padding: 20px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 15px;
    align-self: stretch;
    background: #fff;
  }
  .poster {
    width: 282px;
    height: 430px;
    aspect-ratio: 141/215;
    border-radius: 20px;
    background: #fff1f0;
    box-shadow: 3px 3px 15px 3px rgba(0, 0, 0, 0.15);
  }

  .wrapper {
    display: flex;
    padding: 20px;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    align-self: stretch;
    background: #fff;
    color: #000;
    font-size: 20px;
    font-style: normal;
    line-height: normal;

    h3 {
      align-self: stretch;
    }
    a {
      font-weight: 700;
    }
    b {
      display: flex;
      font-weight: 300;
      justify-content: space-between;
      align-items: flex-start;
      align-self: stretch;
    }
  }
`;
