import React from "react";
import styled from "styled-components";
import NavbarManager from "../../components/Navbar/NavbarManager";
import { MdOutlineUnfoldMore } from "react-icons/md";
import { IoIosQrScanner } from "react-icons/io";
import { useEffect, useState } from "react";

import { Html5QrcodeScanner } from "html5-qrcode";

const QRManager = () => {
  // TODO: 실제 값은 props나 context에서 가져와야 함
  const [showId, setShowId] = useState(1); // 공연 ID
  const [showtimeId, setShowtimeId] = useState(15); // 회차 ID
  const [lastScannedCode, setLastScannedCode] = useState(null);
  const [error, setError] = useState(null);
  const [selectedShowTimeId, setSelectedShowTimeId] = useState(null);

  useEffect(() => {
    // QR 검증 함수
    const validateQRCode = async (qrCode) => {
      console.log("=== QR 코드 검증 시작 ===", qrCode);

      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/manager/shows/${showId}/QR?showtimeId=${showtimeId}&reservationId=${qrCode}`,
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
          alert(
            `✅ ${result.message}\n이름: ${result.data.name}\n좌석: ${result.data.seat}\n입장 시간: ${result.data.checkinTime}`
          );
        } else {
          alert(`❌ ${result.message}`);
        }
      } catch (err) {
        alert("❌ 서버 연결 실패");
        console.error(err);
      }
    };

    // === 스캐너는 딱 한 번만 초기화 ===
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: 300,
      rememberLastUsedCamera: true,
    });

    scanner.render(
      (decodedText) => {
        console.log("QR 감지:", decodedText);

        if (decodedText !== lastScannedCode) {
          setLastScannedCode(decodedText);
          validateQRCode(decodedText);
        }
      },
      (err) => {
        // 스캔 실패 시 로그만 찍음
        // console.warn("스캔 실패:", err);
      }
    );

    // 언마운트 시 카메라 정리
    return () => {
      scanner.clear().catch(console.error);
    };
  }, []);

  const [showList, setShowList] = useState(null);
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
  // 회차 선택 핸들러
  const handleShowtimeChange = (showId, showtimeId) => {
    setSelectedShowTimeId(showtimeId);
    setCurrentShowtimeId(showtimeId);
    setSelectedUsers([]); // 회차 변경 시 선택 초기화
    setShowtimeId(showtimeId);
    setShowId(showId);
  };
  useEffect(() => {
    console.log(showList);
  }, [showList]);
  // 첫 로드 시 API 호출
  useEffect(() => {
    viewShows();
  }, []);
  return (
    <Content>
      <NavbarManager />
      <QRManagerContent>
        {/* 제목 + 시간 선택 */}
        <Header>
          <Title>입장 확인</Title>
          {/* {showList?.showTimeList && showList?.showTimeList.length > 0 && (
            <ShowtimeSelectWrapper>
              {showTimeList.map((showtime) => (
                <ShowtimeButton
                  key={showtime.showTimeId}
                  $active={selectedShowTimeId === showtime.showTimeId}
                  onClick={() => handleShowtimeChange(showtime.showTimeId)}
                >
                  {new Date(showtime.showTime).toLocaleString("ko-KR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </ShowtimeButton>
              ))}
            </ShowtimeSelectWrapper>
          )} */}
          {showList?.map((show, idx) => (
            <div key={show.showId ?? idx}>
              <h3>{show.title}</h3>

              <ShowtimeSelectWrapper>
                {show.showTimeList.map((time) => (
                  <ShowtimeButton
                    key={time.showTimeId}
                    $active={selectedShowTimeId === time.showTimeId}
                    onClick={() =>
                      handleShowtimeChange(time.showId, time.showTimeId)
                    }
                  >
                    {new Date(time.showTime).toLocaleString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </ShowtimeButton>
                ))}
              </ShowtimeSelectWrapper>
            </div>
          ))}

          <SelectTime>
            <ShowName>제21회 정기공연</ShowName>
            <Time>
              <ShowTime>2025.10.14 15:00</ShowTime>
              <MdOutlineUnfoldMore size={16} color="var(--color-primary)" />
            </Time>
          </SelectTime>
        </Header>

        <QRContainer>
          <Prompt>QR을 스캔해주세요.</Prompt>
          <TextContainer>
            <Info>모바일에서도 이용할 수 있어요!</Info>
            <Info>링크를 복사해 휴대폰에서 열어주세요.</Info>
          </TextContainer>

          <ScannerContainer>
            {/* <IoIosQrScanner size={512} color="var(--color-primary)"/> */}
            <div id="reader"></div>
          </ScannerContainer>
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
  padding: 50px 100px;
  justify-content: space-between;
  align-items: center;
  flex: 1 0 0;
  align-self: stretch;
  gap: 45px;
`;
/* ---------------- 제목 + 시간 ---------------- */

const Header = styled.div`
  display: flex;
  align-self: stretch;
  gap: 30px;
`;

const Title = styled.div`
  align-self: stretch;
  font-size: 30px;
  font-weight: 500;
  padding-left: 5px;
`;

const SelectTime = styled.div`
  display: flex;
  border-radius: 15px;
  border: 1px solid var(--color-primary);
  background: #fff;
  padding: 5px 20px;
  gap: 40px;
`;

const ShowName = styled.div`
  color: var(--color-primary);
  font-size: 20px;
  font-weight: 500;
`;

const ShowTime = styled.div`
  color: var(--color-primary);
  font-size: 20px;
  font-weight: 500;
`;

const Time = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

const QRContainer = styled.div`
  display: flex;
  padding: 25px 41px;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  flex: 1 0 0;
  align-self: stretch;
  background-color: var(--color-tertiary);
  border-radius: 20px;

  /* QR 스캐너 영역 추가 */
  #reader {
    width: 500px;
    max-width: 90%;
    aspect-ratio: 1;
    background: #fff;
    border-radius: 15px;
    overflow: hidden;
  }
`;

const Prompt = styled.div`
  font-size: 35px;
  font-weight: 500;
`;

const TextContainer = styled.div`
  gap: 24px;
  text-align: center;
`;

const Info = styled.div`
  color: var(--color-primary);
  font-size: 20px;
  font-weight: 300;
`;
const ScannerContainer = styled.div`
  display: flex;
  width: 1162px;
  height: 547px;
  padding: 18px 325px 17px 325px;
  justify-content: center;
  align-items: center;
  background-color: #b5b5b5;
`;

const ShowtimeSelectWrapper = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
`;

const ShowtimeButton = styled.button`
  padding: 8px 16px;
  border-radius: 15px;
  border: 1px solid var(--color-primary);
  background: ${({ $active }) => ($active ? "var(--color-primary)" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "var(--color-primary)")};
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $active }) =>
      $active ? "var(--color-primary)" : "var(--color-tertiary)"};
    transform: translateY(-2px);
  }
`;
