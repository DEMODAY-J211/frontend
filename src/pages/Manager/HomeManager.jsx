import React from 'react'
import NavbarManager from '../../components/Navbar/NavbarManager'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

import showimg from '../../assets/homemanager/show_icon.png'
import linkimg from '../../assets/homemanager/link.png'
import locationimg from '../../assets/homemanager/location_icon.png'
import myteamimg from '../../assets/homemanager/myteam.png'
import myshowimg from '../../assets/homemanager/myshow_icon.png'

const HomeManager = () => {

    const navigate = useNavigate();
  return (
    <Home>
    <NavbarManager/>
    <ButtonGridTop>
        <FarLeft>
        <RegisterShow>
            <BtnName>공연 등록하기</BtnName>
            <BtnIcon src={showimg} alt="공연 등록하기"/>
            <BtnWriting>
            <BtnInfo>설명글입니다. 여기에 뭐 적을지 정해야 하구.. 어쩌구저쩌구.. 어쩌구 저쩌구.. </BtnInfo>
            <Draft>
                <DraftNum>임시저장(1)</DraftNum>
                {/* <DraftExplained>임시저장된 공연이 1개 있어요!</DraftExplained> */}
            </Draft>
            </BtnWriting>
        </RegisterShow>

        <TeamInfo>
            <MyShowContent>
            <MyShowLeft>
            <BtnName>단체 소개</BtnName>
            <BtnInfo>설명글입니다. 여기에 뭐 적을지 정해야 하구.. 어쩌구저쩌구.. 어쩌구 저쩌구..</BtnInfo>
            </MyShowLeft>
            <MyShowRight>
                <BtnIcon src={myteamimg} alt="단체소개"/>
            </MyShowRight>
            </MyShowContent>
        </TeamInfo>
        </FarLeft>

        <TopMid>
        <MyShow onClick={()=>navigate(`/manageshow`)}>
            <MyShowContent>
            <MyShowLeft>
                <BtnName>내 공연 관리</BtnName>
                <BtnInfo>설명글입니다. 여기에 뭐 적을지 정해야 하구.. 어쩌구저쩌구.. 어쩌구 저쩌구..</BtnInfo>
            </MyShowLeft>
            <MyShowRight>
                <BtnIcon src={myshowimg} alt="내 공연 관리"/>
            </MyShowRight>
            </MyShowContent>
        </MyShow>
        
        <TopRight>
        <UserLink>
            <MyShowContent>
                <MyShowLeft>
                    <BtnName>예매자 링크</BtnName>
                    <BtnInfo>클릭하고 복사하기! </BtnInfo>
                </MyShowLeft>
                <MyShowRight>
                    <BtnIcon src={linkimg} alot="예매자 링크"/>
                </MyShowRight>
            </MyShowContent>
        </UserLink>

        <MyLocation>
            <BtnName>내 공연장 관리</BtnName>
            <BtnIcon src={locationimg} alt="내 공연장 관리"/>
            <BtnInfo>설명글입니다. 여기에 뭐 적을지 정해야 하구.. 어쩌구저쩌구.. 어쩌구 저쩌구.</BtnInfo>
        </MyLocation>

        </TopRight>

        
        </TopMid>



    </ButtonGridTop>
    </Home>
  )
}

export default HomeManager

const Home = styled.div`
    width: 100%;
`

const ButtonGridTop = styled.div`
    width: 100%;
    padding: 0 100px;
    
    display: flex;
    gap: 70px;
    
`


const RegisterShow = styled.div`
    display: flex;
    width: 340px;
    height: 545px;
    padding: 40px;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    border-radius: 30px;
    background: var(--color-tertiary);
    box-shadow: 3px 3px 15px 3px rgba(0, 0, 0, 0.15);
    cursor: pointer;

    transition: all 0.2s ease;
    &:hover {
        transform: translateY(-4px);
        background-color: #fbdede;
    }
`

const BtnName = styled.div`
    align-self: stretch;

    color: #333;
    font-size: 30px;
    font-weight: 500;

`

const BtnIcon = styled.img`
    
`

const BtnWriting = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    flex-shrink: 0;
    align-self: stretch;
`

const BtnInfo = styled.p`
    line-height: 25px;
    flex-shrink: 0;
    align-self: stretch;
    font-size: 15px;
    font-weight: 300;
`

const Draft = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
`

const DraftNum = styled.p`
   font-size: 16px;
   text-decoration-line: underline;
   cursor: pointer;
    transition: all 0.2s ease;
   &:hover{
    color: var(--color-primary);

   }
    
`

// const DraftExplained = styled.p`
//     font-size: 16px;
// `

const TopMid = styled.div`
    display: flex;
    flex-direction: column;
    gap: 45px;
    transform: translateX(-60%);
`

const MyShow = styled.div`
    display: flex;
    width: 829px;
    height: 255px;
    padding: 40px;
    flex-direction: column;
    justify-content: space-between;

    border-radius: 30px;
    background: var(--color-tertiary);
    box-shadow: 3px 3px 15px 3px rgba(0, 0, 0, 0.15);
    cursor: pointer;

    transition: all 0.2s ease;
    &:hover {
        transform: translateY(-4px);
        background-color: #fbdede;
    }
`
const MyShowContent = styled.div`
    display: flex;
    flex: 1;
    flex-direction: row;
    justify-content: space-between;
`
const MyShowLeft = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`

const MyShowRight = styled.div`

    
`

const UserLink = styled.div`
    display: flex;
    width: 419px;
    height: 245px;  
    padding: 40px;
    flex-direction: column;
    justify-content: space-between;

    border-radius: 30px;
    background: var(--color-tertiary);
    box-shadow: 3px 3px 15px 3px rgba(0, 0, 0, 0.15);
    cursor: pointer;

    transition: all 0.2s ease;
    &:hover {
        transform: translateY(-4px);
        background-color: #fbdede;
    }
`

const TopRight = styled.div`
    display: flex;
    gap: 70px;
`

const MyLocation = styled.div`
    display: flex;
    width: 340px;
    height: 545px;
    padding: 40px;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    border-radius: 30px;
    background: var(--color-tertiary);
    box-shadow: 3px 3px 15px 3px rgba(0, 0, 0, 0.15);
    cursor: pointer;

    transition: all 0.2s ease;
    &:hover {
        transform: translateY(-4px);
        background-color: #fbdede;
    }
`

const FarLeft = styled.div`
    display: flex;
    flex-direction: column;
    gap: 45px;
`

const TeamInfo = styled.div`
    display: flex;
    width: 829px;
    height: 255px;
    padding: 40px;
    flex-direction: column;
    justify-content: space-between;

    z-index: 1000;

    border-radius: 30px;
    background:var(--color-tertiary);
    box-shadow: 3px 3px 15px 3px rgba(0, 0, 0, 0.15);
    cursor: pointer;

    transition: all 0.2s ease;
    &:hover {
        transform: translateY(-4px);
        background-color: #fbdede;
    }
`