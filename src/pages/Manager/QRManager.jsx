import React from 'react'
import styled from 'styled-components'
import NavbarManager from '../../components/Navbar/NavbarManager'
import { MdOutlineUnfoldMore } from 'react-icons/md'
import { IoIosQrScanner } from 'react-icons/io'
import { useEffect } from 'react'

import { Html5QrcodeScanner } from "html5-qrcode";

const QRManager = () => {

    useEffect(() => {
    // 1️⃣ 스캐너 초기화
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,          // 초당 10프레임
      qrbox: 300,       // 스캔 영역 크기
      rememberLastUsedCamera: true,
    });

    // 2️⃣ QR코드 인식 시 실행되는 콜백
    scanner.render(
      (decodedText) => {
        console.log("✅ QR 코드 인식 성공:", decodedText);
        alert(`인식된 QR: ${decodedText}`);
      },
      (error) => {
        // 인식 실패 시 콘솔 출력만 (매 프레임마다 출력되므로 조심)
        console.warn("❌ 스캔 중 오류:", error);
      }
    );

    // 3️⃣ 컴포넌트 언마운트 시 카메라 정리
    return () => {
      scanner.clear().catch((err) => console.error("Cleanup error:", err));
    };
  }, []);
  return (
    <Content>
        <NavbarManager/>
        <QRManagerContent>

        {/* 제목 + 시간 선택 */}
            <Header>
                <Title>입장 확인</Title>
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
  )
}

export default QRManager

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
    
`
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
  background: #FFF;
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

`

const Prompt = styled.div`
    font-size: 35px;
    font-weight: 500;
`

const TextContainer = styled.div`
    gap: 24px;
    text-align: center;
`

const Info = styled.div`
    color: var(--color-primary);
    font-size: 20px;
    font-weight: 300;
`
const ScannerContainer =styled.div`
    display: flex;
    width: 1162px;
    height: 547px;
    padding: 18px 325px 17px 325px;
    justify-content: center;
    align-items: center;
    background-color: #B5B5B5;;
`

