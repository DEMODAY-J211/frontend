import styled from "styled-components";
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function CancelModal({ onClose, reservationId }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState(false);
  const { managerId } = useParams();
  const onClick = () => {
    if (!status) {
      fetchCancel();
    } else {
      onClose();
    }
  };

  const fetchCancel = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/user/${managerId}/booking/${reservationId}/cancel`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": "true",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        console.log("response의 data", data);
        setStatus(true);
        // navigate(-1, { state: { cancelled: true } });
      }
    } catch (error) {
      console.error("예매한 공연 조회 실패:", error);
      alert("예매한 공연을 찾을 수 없습니다.");
    }
  };

  return (
    <Overlay>
      <ModalBox>
        <div className="buttoncontainer" onClick={onClose}>
          <AiOutlineClose size={32} />
        </div>
        <div className="Wrapper">
          <p>
            {status
              ? "공연 예매가 취소되었습니다."
              : "공연 예매를 취소하시겠습니까?"}
          </p>
          <br />
          <p style={{ color: "var(--color-primary)" }}>
            * 취소 약관을 확인해주세요.
          </p>
        </div>

        <div className="btn btn-red" onClick={onClick}>
          {status ? "확인" : "취소하기"}
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
