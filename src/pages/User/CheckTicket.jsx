import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import NavbarUser from "../../components/Navbar/NavbarUser";
import Footerbtn from "../../components/Save/Footerbtn";
import CancelModal from "../../components/Modal/CancelModal";
import { formatKoreanDate } from "../../utils/dateFormat";

// s01201
const serverUrl = import.meta.env.VITE_API_URL;
// const serverUrl = "http://15.164.218.55:8080";
const bankOptions = [
  { id: 1, name: "국민은행", code: "KB" },
  { id: 2, name: "기업은행", code: "IBK" },
  { id: 3, name: "농협은행", code: "NH" },
  { id: 4, name: "신한은행", code: "SHINHAN" },
  { id: 5, name: "하나은행", code: "HANA" },
  { id: 6, name: "우리은행", code: "WOORI" },
  { id: 7, name: "우체국", code: "EPOST" },
  { id: 8, name: "카카오뱅크", code: "KAKAO" },
  { id: 9, name: "토스뱅크", code: "TOSS" },
];
function getBankNameByCode(code) {
  const bank = bankOptions.find((b) => b.code === code);
  return bank ? bank.name : null;
}

export default function CheckTicket() {
  const navigate = useNavigate();
  const [isCancel, setIsCancel] = useState(false);
  const [showData, setShowData] = useState([]);
  const { managerId, reservationId } = useParams();
  const handleSelectSeat = () => {
    navigate(`${managerId}/selectseat/${showid}`);
  };
  const handleCancel = () => {
    setIsCancel(true);
  };

  const fetchShowData = async () => {
    try {
      const response = await fetch(
        `${serverUrl}/user/${managerId}/booking/${reservationId}`,
        {
          credentials: "include",
          header: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) throw new Error("네트워크 응답 실패");
      const res = await response.json();

      if (res.success) {
        setShowData(res.data);
        console.log("mockdata", res);
        console.log("showData입니다", showData);
      }
    } catch (error) {
      console.error("공연 조회 실패:", error);
      alert("해당 공연 단체를 찾을 수 없습니다.");
    }
  };

  const statusText = {
    PENDING_PAYMENT: "승인 대기중",
    CANCEL_REQUESTED: "취소 완료",
    COMPLETED: "예매 완료", // 예매완료 상태가 특정 코드라면 여기에!
  };

  useEffect(() => {
    fetchShowData();
  }, []);

  useEffect(() => {
    console.log("showData 업데이트:", showData);
  }, [showData]);

  return (
    <PageWrapper>
      {isCancel && (
        <CancelModal
          onClose={() => setIsCancel(false)}
          reservationId={reservationId}
        />
      )}
      <HomeUserContainer>
        <NavbarUser Backmode={true} text="예매 상세 내역" />
        <TicketWrapper>
          <ShowContainer>
            <img className="poster" src={showData.showPoster} />
            <div className="showcontent">
              <Title>{showData.showTitle}</Title>
              <Subcontent>
                {formatKoreanDate(showData.showtimeStart)}
              </Subcontent>
              <Subcontent>{showData.showLocation}</Subcontent>
            </div>
          </ShowContainer>
          {/* 예매정보 */}
          <Wrapper>
            <Title>예매정보</Title>
            <Content>
              <p>예매번호</p>
              <p>{showData.reservationNumber}</p>
            </Content>
            <Content>
              <p>좌석번호</p>
              <p>
                {showData.seatList} ({showData.quantity}매)
              </p>
            </Content>
            <Content>
              <p>예매자명</p>
              <p>{showData.userName}</p>
            </Content>
            <Content>
              <p>예매자 연락처</p>
              <p>{showData.userPhone}</p>
            </Content>
            <Content>
              <p>예매일시</p>
              <p>{formatKoreanDate(showData.reservationDate)}</p>
            </Content>
          </Wrapper>
          {/* 결제정보 */}
          <Wrapper>
            <Title>결제정보</Title>
            <Content>
              <p>결제상태</p>
              <p>{statusText[showData?.reservationstatus]}</p>
            </Content>
            <Content>
              <p>결제금액</p>
              <p>{showData?.totalAmount?.toLocaleString()}원</p>
            </Content>
          </Wrapper>
          {/* 환불정보 */}
          <Wrapper>
            <Title>환불정보</Title>
            <Content>
              <p>환불 계좌</p>
              <p>
                {getBankNameByCode(showData?.refundInfo?.refundBank)}{" "}
                {showData?.refundInfo?.refundAccount}
              </p>
            </Content>
            <Content>
              <p>예금주</p>
              <p>{showData?.refundInfo?.refundHolder}</p>
            </Content>
          </Wrapper>
        </TicketWrapper>
        {showData?.reservationstatus !== "CANCEL_REQUESTED" &&
          (showData?.saleMethod === "SELECTBYUSER" ? (
            <Footerbtn
              buttons={[
                { text: "예매 취소", color: "red", onClick: handleCancel },
                { text: "좌석 변경", color: "red", onClick: handleSelectSeat },
              ]}
            />
          ) : (
            <Footerbtn
              buttons={[
                { text: "예매 취소", color: "red", onClick: handleCancel },
              ]}
            />
          ))}
      </HomeUserContainer>
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

const TicketWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  flex: 1 0 0;
  align-self: stretch;
  background: #ebebeb;
`;
const ShowContainer = styled.div`
  display: flex;
  padding: 20px;
  align-items: center;
  gap: 20px;
  align-self: stretch;
  background: #fff;

  .poster {
    width: 66px;
    height: 91px;
    border-radius: 8px;
    background: var(--tertiary, #fff1f0);
  }
  .showcontent {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 5px;
    flex: 1 0 0;
  }
`;

const Wrapper = styled.div`
  display: flex;
  padding: 20px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
  background: #fff;
`;

const Title = styled.div`
  color: #000;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const Subcontent = styled.span`
  color: #626262;
  font-size: 15px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
`;

const Content = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  align-self: stretch;
  color: #000;
  font-size: 15px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
`;
