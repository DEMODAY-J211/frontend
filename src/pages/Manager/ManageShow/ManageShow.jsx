import React from 'react'
import styled from 'styled-components'
import { Navigate, useNavigate } from 'react-router-dom'
import NavbarManager from '../../../components/Navbar/NavbarManager'
import checkqrimg from '../../../assets/manageshow/checkqr.png'
import editshow from '../../../assets/manageshow/editshow.png'
import entrystatus from '../../../assets/manageshow/entrystatus.png'
import manageuser from '../../../assets/manageshow/manageuser.png'



const ManageShow = () => {

    const navigate = useNavigate();

    const menuItems = [
    { title: "예매자 관리", desc: "입장 현황 대한 설명글", icon: <img src={manageuser} alt="manageuser" />, path: '/manageshow/manageuser' },
    { title: "입장 현황", desc: "입장 현황 대한 설명글", icon: <img src={entrystatus} alt="entrystatus"/>, path: '/manageshow/entrystatus' },
    { title: "공연 정보 수정", desc: "공연 정보 수정에 대한 설명글", icon:  <img src={editshow} alt="editshow" />, path: '/manageshow/manageuser'  },
    { title: "QR 코드 확인", desc: "공연 정보 수정에 대한 설명글", icon:  <img src={checkqrimg} alt="checkqrimg" />, path: '/manageshow/manageuser'  },
  ];

  return (
    <MyShow>
        <NavbarManager/>
        <MyShowContent>
        <Title>내 공연 관리</Title>
        <Shows>Shows</Shows>
        <Container>
            {menuItems.map((item, idx) => (
                <Card key={idx} onClick={()=>navigate(item.path)}>
                <TextBox>
                    <Title>{item.title}</Title>
                    <Desc>{item.desc}</Desc>
                </TextBox>
                <Icon>{item.icon}</Icon>
                </Card>
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
    
`

const Container = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    padding: 40px;
    background-color: #fff;
`

const Card = styled.div`
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
