import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import NavbarUser from "../../components/Navbar/NavbarUser";
import ShowTab from "../../components/User/ShowTab";
import LoginRequiredModal from "../../components/Modal/LoginRequiredModal";
import Footerbtn from "../../components/Save/Footerbtn";
import BottomSheet from "../../components/User/BottomSheet";
import AlertModal from "../../components/Modal/AlertModal";
import { formatKoreanDate } from "../../utils/dateFormat";
// s01001
// const managerId = 1;
const serverUrl = import.meta.env.VITE_API_URL;
// const serverUrl = "http://15.164.218.55:8080";
// const showId = 1;

export default function ViewShowDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [login, setLogin] = useState(true); //true: 로그인 상태 , false: 로그아웃 상태
  const [showModal, setShowModal] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showData, setShowData] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [bookingStatus, setBookingStatus] = useState("before");
  // "before" | "available" | "closed"
  const { managerId, showId } = location.state || {};

  const handlebtn = () => {
    if (!login) {
      setShowModal(true); // 로그인 안 되어 있으면 로그인 모달
    } else if (!showBottomSheet) {
      setShowBottomSheet(true); // 로그인 되어 있으면 bottomsheet
    } else if (showBottomSheet) {
      navigate(`../selectseat/${showId}`);
      // navigate(`../payment`);
    } else {
      navigate(`../selectseat/${showId}`);
    }
  };
  // console.log("managerId, showId", managerId, showId);

  // const fetchShowDetail = async () => {
  //   try {
  //     // const token = localStorage.getItem('accessToken');
  //     const response = await fetch(
  //       `${serverUrl}/user/${managerId}/detail/${managerId}`,
  //       {
  //         headers: {
  //           // 'Authorization': `Bearer ${token}`,
  //           //     'Content-Type': 'application/json'
  //         },
  //       }
  //     );
  //     const result = await response.json();

  //     // // Mock 데이터
  //     // const mockData = {
  //     //   success: true,
  //     //   code: 200,
  //     //   message: "success",
  //     //   data: {
  //     //     showId: 12,
  //     //     showTitle: "제11회 정기공연",
  //     //     showStartDate: "2025-09-25",
  //     //     showtimeEndDate: "2025-09-26",
  //     //     showLocation: "서강대학교 메리홀 소극장",
  //     //     showPosterPicture: "https://example.com/poster.png",
  //     //     showtimeList: [
  //     //       {
  //     //         showtimeId: 1,
  //     //         showtimeStart: "2025-09-25 15:00",
  //     //       },
  //     //       {
  //     //         showtimeId: 2,
  //     //         showtimeStart: "2025-09-25 18:00",
  //     //       },
  //     //     ],
  //     //     ticketOptionList: [
  //     //       {
  //     //         ticketoptionName: "학생할인",
  //     //         ticketoptionPrice: 8000,
  //     //       },
  //     //       {
  //     //         ticketoptionName: "학생할인",
  //     //         ticketoptionPrice: 8000,
  //     //       },
  //     //     ],
  //     //     managerInfo: {
  //     //       managerName: "멋쟁이연극회",
  //     //       managerEmail: "1004@gmail.com",
  //     //     },
  //     //     showDetailText: "공연상세 정보입니다.",
  //     //   },
  //     // };
  //     console.log(result.data);

  //     if (result.success) {
  //       setShowData(result.data);
  //     }
  //   } catch (error) {
  //     console.error("공연 조회 실패:", error);
  //     alert("해당 공연을 찾을 수 없습니다.");
  //   }
  // };
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
    if (showData.showStartDate) {
      const now = new Date();
      const startDate = new Date(showData.showStartDate);
      const firstShow = showData.showtimeList?.[0];
      const firstShowStart = firstShow
        ? new Date(firstShow.showtimeDateTime)
        : null;

      // 예매 종료 시점 = 첫 공연 시작 1시간 전
      const endDate = firstShowStart
        ? new Date(firstShowStart.getTime() - 60 * 60 * 1000)
        : null;

      if (now < startDate) {
        // 🎟️ 예매 전
        setBookingStatus("before");
      } else if (startDate <= now && (!endDate || now <= endDate)) {
        // ✅ 예매 가능
        setBookingStatus("available");
      } else {
        // ⛔ 예매 종료
        setBookingStatus("closed");
      }
    }
  }, [showData]);

  // useEffect(() => {
  //   fetchShowDetail();
  // }, []);

  return (
    <PageWrapper $dimmed={showModal}>
      <HomeUserContainer>
        <NavbarUser Backmode={true} text="제12회 정기공연" />
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
                      {idx + 1}회차 {formatKoreanDate(showData.showStartDate)}
                    </b>
                  ))}
                </div>
                <div className="wrapper">
                  <a>예매 기한</a>
                  <b>
                    {formatKoreanDate(showData.showStartDate)} ~ 각 공연 시작
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
              ></ShowTab>
            </ShowContainer>

            {!(login && showBottomSheet) && (
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
      {/* 로그인 안 되어 있으면 모달 */}
      {!login && showModal && (
        <LoginRequiredModal onClose={() => setShowModal(false)} />
      )}

      {/* 로그인 되어 있으면 바텀시트 */}
      {login && showBottomSheet && (
        <BottomSheet
          onClose={() => setShowBottomSheet(false)}
          onNeedModal={() => setShowAlert(true)}
          showData={showData}
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
