import React from "react";
import styled from "styled-components";
import NavbarManager from "../../components/Navbar/NavbarManager";
import { MdOutlineUnfoldMore } from "react-icons/md";
import { IoIosQrScanner } from "react-icons/io";
import { useEffect, useState } from "react";

import { Html5QrcodeScanner } from "html5-qrcode";
import { formatKoreanDate } from "../../utils/dateFormat";
import { useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useToast } from "../../components/Toast/useToast";

const QRManager = () => {
  // TODO: 실제 값은 props나 context에서 가져와야 함
  const [lastScannedCode, setLastScannedCode] = useState(null);
  const [error, setError] = useState(null);
  const [currentShowId, setCurrentShowId] = useState(null);
  const [currentShowtimeId, setCurrentShowtimeId] = useState(null);
  const html5QrCodeRef = useRef(null);
  const [showList, setShowList] = useState(null);
  const qrcodeId = "reader";
  const { addToast } = useToast();

  const viewShows = async () => {
    try {
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
      console.log("result.data", result.data.published);
      setShowList(result.data.published ?? []);
    } catch (error) {
      console.error("Error fetching shows:", error);
      setError(error.message);
    }
  };

  // 첫 로드 시 API 호출
  useEffect(() => {
    viewShows();
  }, []);
  const currentShowIdRef = useRef(null);
  const currentShowtimeIdRef = useRef(null);
  const lastScannedCodeRef = useRef(null);
  // current 값이 변경될 때마다 ref 업데이트
  useEffect(() => {
    currentShowIdRef.current = currentShowId;
    currentShowtimeIdRef.current = currentShowtimeId;
  }, [currentShowId, currentShowtimeId]);

  useEffect(() => {
    if (!showList || showList.length === 0) return;

    // 첫 공연/회차 자동 선택
    if (!currentShowId || !currentShowtimeId) {
      setCurrentShowId(showList[0].showId);
      setCurrentShowtimeId(showList[0].showTimeList[0].showTimeId);
    }
  }, [showList]);

  // QR 스캐너는 한 번만 초기화
  useEffect(() => {
    const init = async () => {
      const container = document.getElementById(qrcodeId);
      if (!container) return;

      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode(qrcodeId);

        const qrCodeSuccessCallback = (decodedText) => {
          console.log("QR detected:", decodedText);

          // 최신 current 값을 ref에서 읽음
          const showId = currentShowIdRef.current;
          const showTimeId = currentShowtimeIdRef.current;

          if (!showId || !showTimeId) {
            console.warn("current 값이 아직 준비되지 않음");
            return;
          }

          if (lastScannedCodeRef.current === decodedText) return;
          lastScannedCodeRef.current = decodedText;

          validateQRCode(decodedText, showId, showTimeId);
        };

        const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.77778,
        };

        try {
          await html5QrCodeRef.current.start(
            { facingMode: "environment" },
            config,
            qrCodeSuccessCallback
          );
        } catch (err) {
          console.error("QR 초기화 실패:", err);
        }
      }
    };

    init();

    return () => {
      if (html5QrCodeRef.current) {
        const state = html5QrCodeRef.current.getState();
        if (state === 2) {
          html5QrCodeRef.current
            .stop()
            .then(() => html5QrCodeRef.current.clear())
            .catch(console.error);
        }
      }
    };
  }, []);

  useEffect(() => {
    console.log("selected", currentShowId, currentShowtimeId);
  }, [currentShowId, currentShowtimeId]);

  // QR 검증 함수
  const validateQRCode = async (qrCode, showId, showTimeId) => {
    console.log("=== QR 코드 검증 시작 ===", qrCode);

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/manager/shows/${showId}/QR?showtimeId=${showTimeId}&reservationItemId=${qrCode}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();
      console.log("응답:", result);

      if (response.ok && result.success) {
        console.log(
          `✅ ${result.message}\n이름: ${result.data.name}\n좌석: ${result.data.seat}\n입장 시간: ${result.data.checkinTime}`
        );
        addToast(
          `${result.message}님 입장이 완료되었습니다. 좌석은 ${result.data.seat}입니다. 즐거운 관람되세요!`,
          "success"
        );
      } else {
        alert(`❌ ${result.message}`);
      }
    } catch (err) {
      alert("❌ 서버 연결 실패");
      console.error(err);
    }
  };
  // 회차 선택 핸들러
  const handleShowtimeChange = (showId, showtimeId) => {
    setCurrentShowId(showId);
    setCurrentShowtimeId(showtimeId);
  };
  return (
    <Content>
      <NavbarManager />
      <QRManagerContent>
        {/* 제목 + 시간 선택 */}
        <Header>
          <Title>입장 확인</Title>
          {showList &&
            showList.length > 0 &&
            showList[0].showTimeList &&
            showList[0].showTimeList.length > 0 && (
              <ShowtimeDropdown
                value={
                  currentShowtimeId && currentShowId
                    ? `${currentShowId}-${currentShowtimeId}`
                    : ``
                }
                onChange={(e) => {
                  const [showId, showTimeId] = e.target.value.split("-");
                  handleShowtimeChange(Number(showId), Number(showTimeId));
                }}
              >
                {showList.map((show) =>
                  show.showTimeList.map((showtime, idx) => (
                    <option
                      key={`${show.showId}-${showtime.showTimeId}`}
                      value={`${show.showId}-${showtime.showTimeId}`}
                    >
                      {`[${idx + 1}회차]${show.title}(${formatKoreanDate(
                        showtime.showTime
                      )})`}
                    </option>
                  ))
                )}
              </ShowtimeDropdown>
            )}
        </Header>

        <QRContainer>
          <Prompt>QR을 스캔해주세요.</Prompt>
          <TextContainer>
            <Info>모바일에서도 이용할 수 있어요!</Info>
            <Info>링크를 복사해 휴대폰에서 열어주세요.</Info>
          </TextContainer>
          {/* <div id="reader" /> */}
          <ScannerContainer id="reader"></ScannerContainer>
        </QRContainer>
      </QRManagerContent>
    </Content>
  );
};

export default QRManager;

/* ---------------- Styled Components ---------------- */

const Content = styled.div``;

const QRManagerContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 50px 20px; // 모바일은 padding 줄여서 꽉 차게
  justify-content: flex-start;
  align-items: center;
  gap: 45px;
  flex: 1 0 auto;
  align-self: stretch;
  min-height: 100vh; // 모바일에서 전체 높이 확보

  @media (min-width: 1024px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
`;

/* ---------------- 제목 + 시간 ---------------- */

const Title = styled.div`
  align-self: stretch;
  font-size: 30px;
  font-weight: 500;
  padding-left: 5px;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column; // 모바일에서는 세로로
  align-self: stretch;
  gap: 15px;

  @media (min-width: 1024px) {
    flex-direction: row; // PC에서는 가로
    gap: 30px;
  }
`;

const QRContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: stretch;
  background-color: var(--color-tertiary);

  @media (min-width: 1024px) {
    max-width: 600px; // 데스크탑에서 최대 크기
  }
`;

const Prompt = styled.div`
  padding: 10px 0px;

  @media (min-width: 1024px) {
    font-size: 35px;
    font-weight: 500;
  }
`;

const TextContainer = styled.div`
  // gap: 24px;
  text-align: center;
  padding: 10px 41px;
`;

const Info = styled.div`
  @media (min-width: 1024px) {
    font-size: 20px;
    font-weight: 300;
  }
  color: var(--color-primary);
`;

const ScannerContainer = styled.div`
  width: 100%; // 부모 폭에 맞춤
  }
`;

const ShowtimeDropdown = styled.select`
  padding: 8px 16px;
  border-radius: 15px;
  height: 100%;
  border: 1px solid var(--color-primary);
  background: ${({ $active }) => ($active ? "var(--color-primary)" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "var(--color-primary)")};
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(252, 40, 71, 0.2);
  }
`;
