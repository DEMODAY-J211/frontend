import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { formatKoreanDate } from "../../utils/dateFormat";

// const managerId = 5; // 손보기
export default function ShowListItem({ reservation, activeTab }) {
  const { managerId } = useParams();
  const navigate = useNavigate();
  const {
    reservationId,
    showtimeId,
    showPosterPicture,
    showTitle,
    showtimeStart,
    ticketOptionName,
    reservationQuantity,
    reservationNumber,
  } = reservation;
  return (
    <ShowListWrapper
      onClick={() => navigate(`/${managerId}/checkticket/${reservationId}`)}
    >
      <img className="poster" src={showPosterPicture} alt={showTitle}></img>
      <ListContent>
        <Toggle>
          {new Date(showtimeStart) > new Date() ? "관람예정" : "관람완료"}
        </Toggle>
        <Title>{showTitle}</Title>
        <Subcontent>
          <p>
            {formatKoreanDate(showtimeStart)}
            <br />
            {ticketOptionName} {reservationQuantity}매 | 예매번호{" "}
            {reservationNumber}
          </p>
          {activeTab !== "지난 공연내역" && (
            <Btn>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/${managerId}/mobileticket/${reservationId}`);
                }}
              >
                모바일티켓
              </span>
            </Btn>
          )}
        </Subcontent>
      </ListContent>
    </ShowListWrapper>
  );
}

const ShowListWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 164px;
  align-items: center;
  align-items: flex-start;
  gap: 16px;
  border-radius: 15px;
  background: #fff;
  box-shadow: 0 0 6.6px 0 rgba(0, 0, 0, 0.15);
  cursor: pointer;

  .poster {
    display: flex;
    width: 108px;
    height: 165px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    aspect-ratio: 36/55;
    border-radius: 15px 0 0 15px;
    background: var(--tertiary, #fff1f0);
  }
`;

const ListContent = styled.div`
  display: flex;
  padding: 10px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  flex: 1 0 0;
  align-self: stretch;
`;

const Toggle = styled.div`
  display: flex;
  padding: 7px 10px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 20px;
  background: var(--tertiary, #fff1f0);
  color: var(--secondary, #d60033);
  font-size: 13px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
`;

const Title = styled.div`
  flex: 1 0 0;
  align-self: stretch;
  color: #000;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const Subcontent = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  align-self: stretch;
  font-size: 12px;
  font-style: normal;
  font-weight: 300;
  p {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
    flex: 1 0 0;
  }
`;

const Btn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;

  span {
    display: flex;
    padding: 5px 7px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    color: #fff;
    border-radius: 10px;
    background: var(--primary, #fc2847);
    font-size: 10px;
    cursor: pointer;
  }
`;
