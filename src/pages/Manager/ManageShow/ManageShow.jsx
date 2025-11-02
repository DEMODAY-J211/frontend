import React from 'react'
import styled from 'styled-components'
import { Navigate, useNavigate } from 'react-router-dom'
import NavbarManager from '../../../components/Navbar/NavbarManager'
import checkqrimg from '../../../assets/manageshow/checkqr.png'
import editshow from '../../../assets/manageshow/editshow.png'
import entrystatus from '../../../assets/manageshow/entrystatus.png'
import manageuser from '../../../assets/manageshow/manageuser.png'

import { useRef } from 'react'
import { useState } from 'react'

import { RiArrowLeftWideFill } from 'react-icons/ri'
import { RiArrowRightWideFill } from 'react-icons/ri'
import { AiOutlineMore } from 'react-icons/ai'
import defaultimg from '../../../assets/tikitta_defaultcard.png'



const ManageShow = () => {

    const navigate = useNavigate();

    const menuItems = [
    { menuname: "예매자 관리", desc: "입장 현황 대한 설명글", icon: <img src={manageuser} alt="manageuser" />, path: '/manageshow/manageuser' },
    { menuname: "입장 현황", desc: "입장 현황 대한 설명글", icon: <img src={entrystatus} alt="entrystatus"/>, path: '/manageshow/entrystatus' },
    { menuname: "공연 정보 수정", desc: "공연 정보 수정에 대한 설명글", icon:  <img src={editshow} alt="editshow" />, path: '/manageshow/manageuser'  },
    { menuname: "QR 코드 확인", desc: "공연 정보 수정에 대한 설명글", icon:  <img src={checkqrimg} alt="checkqrimg" />, path: '/qrmanager'  },
  ];

  


  const posters = [
    { title: "제11회 정기공연", color: "#fdeeee" },
    { title: "제12회 정기공연", color: "#fff3f3" },
    { title: "제13회 정기공연", color: "#fdeeee" },
    { title: "제14회 정기공연", color: "#dcdcdc" },
    { title: "제15회 정기공연", color: "#f0f0f0" },
    { title: "제16회 정기공연", color: "#e8e8e8" },
    { title: "제16회 정기공연", color: "#e8e8e8" },
  ];

  const [selectedIndex, setSelectedIndex] = useState(0); // ✅ 선택된 카드 인덱스 (기본 0)
  const [startIndex, setStartIndex] = useState(0); // 보여지는 첫 카드 인덱스
const visibleCount = 7; // 한 화면에 보여줄 카드 수

  const handleCardClick = (index) => {
        setSelectedIndex(index); // ✅ 클릭된 카드 인덱스로 업데이트
    };

    const scrollRef = useRef(null);

const handleScroll = (direction) => {
  if (direction === "left") {
    setStartIndex((prev) => (prev - 1 + posters.length) % posters.length);
  } else {
    setStartIndex((prev) => (prev + 1) % posters.length);
  }
};
const visiblePosters = Array.from({ length: visibleCount }, (_, i) => {
  const index = (startIndex + i) % posters.length;
  return posters[index];
});



  return (
    <MyShow>
        <NavbarManager/>
        <MyShowContent>
        <Title>내 공연 관리</Title>
        <Shows>
             <Arrow onClick={() => handleScroll("left")}>
                <RiArrowLeftWideFill size={28} />
            </Arrow>

          <CardList ref={scrollRef}>
            {visiblePosters.map((poster, index) => (
              <CardContainer key={index} onClick={() => handleCardClick(index)}>
                <Card
                  $selected={selectedIndex === index} // ✅ 선택 상태 전달
                  style={{ backgroundColor: "var(--color-tertiary)" }}
                >
                    <More>
                        <AiOutlineMore size={20} />
                        <button>공연 삭제</button> {/* 👈 여기에 버튼을 같이 넣어줘야 hover로 작동 */}
                    </More>
                  <Poster 
                    src={poster.img ? poster.img : defaultimg} 
                    alt={poster.title} 
                    />

                </Card>
                <ShowName>{poster.title}</ShowName>
              </CardContainer>
            ))}
          </CardList>

          <Arrow onClick={() => handleScroll("right")}>
            <RiArrowRightWideFill size={28} />
          </Arrow>
        </Shows>
        <Container>
            {menuItems.map((item, idx) => (
                <Menu key={idx} onClick={()=>navigate(item.path)}>
                <TextBox>
                    <MenuTitle>{item.menuname}</MenuTitle>
                    <Desc>{item.desc}</Desc>
                </TextBox>
                <Icon>{item.icon}</Icon>
                </Menu>
            ))}
        </Container>
    </MyShowContent>
    </MyShow>
  )
}

export default ManageShow

const MyShow = styled.div`

`
const MyShowContent = styled.div`
    display: flex;
    flex-direction: column;
    padding: 50px 100px;
    justify-content: space-between;
    align-items: center;
    flex: 1 0 0;
    align-self: stretch;
`

const Title = styled.div`
    align-self: stretch;
    font-size: 30px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    padding-left: 5px;
`

const Shows = styled.div`
display: flex;
align-items: center;
position: relative;
width: 100%;
height: 400px;
padding: 40px 0;
justify-content: center;

`
const Arrow = styled.div`
  
  padding: 10px;
  cursor: pointer;
  z-index: 10;
  transition: 0.2s ease;
    border-radius: 50%;
  &:hover {
    transform: scale(1.1);

    background-color: #f5f5f5;
  }
`;

const CardList = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-x: auto;
  gap: 50px;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  &::-webkit-scrollbar {
    display: none;
  }
width: 100%;
height: 100%;
`;

const CardContainer = styled.div`
  flex: 0 0 auto;
  scroll-snap-align: start;
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
  display: flex;
  width: ${(props) => (props.$selected ? "145px" : "120px")};
  height: ${(props) => (props.$selected ? "221px" : "182px")};
  padding: 5px;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  aspect-ratio: 60/91;
  border-radius: ${(props) => (props.$selected ? "10px" : "20px")};
  justify-content: center;
  background: ${(props) => (props.$selected ? "#fff" : "var(--color-tertiary)")};
  box-shadow: ${(props) =>
    props.$selected
      ? "0 0 15px 3px rgba(252, 40, 71, 0.50)"
      : "2px 2px 10px rgba(0,0,0,0.15)"};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    transform: translateY(-4px);
  }
`;


const More = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  cursor: pointer;
  color: #555;
  transition: 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  /* 기본: 아이콘 보이고 버튼 숨김 */
  svg {
    opacity: 1;
    visibility: visible;
    transition: all 0.2s ease;
  }

  button {
    position: absolute;
    top: 0;
    right: 0;
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s ease;

    border: none;
    border-radius: 5px;
background: #FFF;
box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.15);
    padding: 5px 10px;
    font-size: 15px;
    font-weight: 500;
    color: #333;

    cursor: pointer;

    display: flex;
height: 32px;
width: 77px;

justify-content: center;
align-items: center;
gap: 10px;
  }

  /* hover 시 아이콘 사라지고 버튼 나타남 */
  &:hover svg {
    opacity: 0;
    visibility: hidden;
  }

  &:hover button {
    opacity: 1;
    visibility: visible;
    
  }


`;

const Poster = styled.img`
  width: 100%;
  height: 150px;
  border-radius: 10px;
  object-fit: cover;
`;


const ShowName = styled.div`
    margin-top: 10px;
    text-align: center;
    font-size: 14px;
    font-weight: 300;
`
const Container = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;

    background-color: #fff;
`

const Menu = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fdeeee;
  width: 586px;
  height: 213px;
  padding: 36px 30px;
  border-radius: 30px;
  background: var(--color-tertiary);
  box-shadow: 3px 3px 15px 3px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    background-color: #fbdede;
  }
`;

const MenuTitle = styled.div`
        align-self: stretch;
    font-size: 30px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    padding-left: 5px;
`

const Icon = styled.div`
  font-size: 48px;
  color: #000;
`;

const TextBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* 위-아래로 끝과 끝 배치 */
  height: 100%; /* 카드 높이에 맞춰 늘어나도록 */
`;


const Desc = styled.p`
  font-size: 14px;
  color: #333;
`;
