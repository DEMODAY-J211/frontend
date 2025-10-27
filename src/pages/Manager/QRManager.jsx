import React from 'react'
import styled from 'styled-components'
import NavbarManager from '../../components/Navbar/NavbarManager'
import { MdOutlineUnfoldMore } from 'react-icons/md'
import { IoIosQrScanner } from 'react-icons/io'

const QRManager = () => {
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
                    <IoIosQrScanner size={512} color="var(--color-primary)"/>
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

