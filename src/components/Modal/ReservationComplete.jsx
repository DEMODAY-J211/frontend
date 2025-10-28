import styled from "styled-components";
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

export default function ReservationComplete({ onClose }) {
  const navigate = useNavigate();

  return (
    <Overlay>
      <ModalBox>
        <div className="buttoncontainer" onClick={onClose}>
          <AiOutlineClose size={32} />
        </div>
        <div className="Wrapper">
          <p>🎉 예매가 완료되었어요!</p>
          <br />
          <p>
            예매 확정을 위해 <br />
            입금자명은 ‘강길동’으로 <br />
            17000원을 입금해주세요!{" "}
          </p>
          <br />
          <p>
            입금이 확인되면 예매가 확정됩니다.
            <br />
            (입금이 확인되지 않으면 <br />
            자동으로 취소될 수 있어요.)
          </p>
        </div>
        <InfoSection>
          <TicketInfo>
            <Title>입금 계좌</Title>
            <Toggle>계좌복사</Toggle>
          </TicketInfo>
          <Subtitle>우리 0000-000-000000 (예금주) 홍길동</Subtitle>
        </InfoSection>
        <div className="btn btn-red" onClick={() => navigate("/checkticket")}>
          확인
        </div>
      </ModalBox>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100%;
  background: rgba(0, 0, 0, 0.4); /* 배경 회색 투명도 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const DimmedBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4); /* 회색 톤 오버레이 */
  z-index: 1;
`;

const ModalBox = styled.div`
  width: 80%;
  max-width: 350px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.25);
  padding: 10px 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  font-size: 18px;

  .btn {
    display: flex;
    padding: 10px 20px;
    justify-content: center;
    align-items: center;
    align-self: stretch;
    border-radius: 10px;
    background: #fc2847;
    border: none;
    color: #fff1f0;
    font-size: 18px;
    margin-top: 15px;
    cursor: pointer;
    transition: background 0.3s ease;

    &:hover {
      background: #e0203e;
    }
  }
  .buttoncontainer {
    display: flex;
    aspect-ratio: 1/1;
    cursor: pointer;
  }

  .Wrapper {
    align-self: stretch;
  }
`;

const InfoSection = styled.div`
  display: flex;
  padding: 20px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
`;

const Toggle = styled.span`
  display: flex;
  padding: 7px 10px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 10px;
  background: var(--tertiary, #fff1f0);
  color: var(--secondary, #d60033);
  font-size: 10px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
  cursor: pointer;
`;
const TicketInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`;

const Title = styled.h2`
  color: #000;
  font-size: 15px;
  font-weight: 300;
  line-height: normal;
`;

const Subtitle = styled.span`
  font-size: 15px;
  font-weight: 300;
  color: #000000;
`;
