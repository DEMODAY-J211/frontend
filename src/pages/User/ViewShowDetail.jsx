import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import NavbarUser from "../../components/Navbar/NavbarUser";
import ShowTab from "../../components/User/ShowTab";
import LoginRequiredModal from "../../components/Modal/LoginRequiredModal";
import Footerbtn from "../../components/Save/Footerbtn";
import BottomSheet from "../../components/User/BottomSheet";
import { formatKoreanDate } from "../../utils/dateFormat";
// s01001

export default function ViewShowDetail({ managerId, showId }) {
  const navigate = useNavigate();
  const [login, setLogin] = useState(true); //true: 로그인 상태 , false: 로그아웃 상태
  const [showModal, setShowModal] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showData, setShowData] = useState({});

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

  const fetchShowDetail = async () => {
    try {
      // const token = localStorage.getItem('accessToken');
      // const response = await fetch(`/user/${managerId}/detail/${showId}`, {
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   }
      // });
      // const result = await response.json();

      // Mock 데이터
      const mockData = {
        success: true,
        code: 200,
        message: "success",
        data: {
          showId: 12,
          showTitle: "제11회 정기공연",
          showStartDate: "2025-09-25",
          showtimeEndDate: "2025-09-26",
          showLocation: "서강대학교 메리홀 소극장",
          showPosterPicture: "https://example.com/poster.png",
          showtimeList: [
            {
              showtimeId: 1,
              showtimeStart: "2025-09-25 15:00",
            },
            {
              showtimeId: 2,
              showtimeStart: "2025-09-25 18:00",
            },
          ],
          ticketOptionList: [
            {
              ticketoptionName: "학생할인",
              ticketoptionPrice: 8000,
            },
            {
              ticketoptionName: "학생할인",
              ticketoptionPrice: 8000,
            },
          ],
          managerInfo: {
            managerName: "멋쟁이연극회",
            managerEmail: "1004@gmail.com",
          },
          showDetailText: "공연상세 정보입니다.",
        },
      };

      if (mockData.success) {
        setShowData(mockData.data);
      }
    } catch (error) {
      console.error("공연 조회 실패:", error);
      alert("해당 공연을 찾을 수 없습니다.");
    }
  };

  // useEffect(() => {
  //   console.log("showData 업데이트:", showData);
  // }, [showData]);

  useEffect(() => {
    fetchShowDetail();
  }, []);

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
                    src="data:image/png;base64,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"
                    alt={showData.showTitle}
                  />
                  <div className="wrapper">
                    <h2>{showData.showTitle}</h2>
                    <b>
                      {showData.showStartDate} ~ {showData.showtimeEndDate}
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
                  <b>{showData.showStartDate} ~ 각 공연 시작 1시간 전</b>
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
                  { text: "예매하기", color: "red", onClick: handlebtn },
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
          showData={showData}
        />
      )}
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
