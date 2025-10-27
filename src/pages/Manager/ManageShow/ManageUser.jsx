import React from 'react'
import styled from 'styled-components'
import NavbarManager from '../../../components/Navbar/NavbarManager'
import { useNavigate } from 'react-router-dom'
import { MdOutlineUnfoldMore } from "react-icons/md";


const ManageUser = () => {

    const navigate = useNavigate();
  return (
    <Content>
        <NavbarManager/>
        <ManageUserContent>
        <Header>
            <Title>예매자 관리</Title>
            <SelectTime>
                <ShowName>제21회 정기공연</ShowName>
                <Time>
                    <ShowTime>2025.10.14 15:00</ShowTime>
                    <MdOutlineUnfoldMore size={16} color="#FC2847" />
                </Time>
            </SelectTime>
       </Header>
    </ManageUserContent>
    </Content>
  )
}

export default ManageUser

const Content = styled.div`
    
`

const ManageUserContent = styled.div`
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
const Header = styled.div`
    display: flex;
    align-self: stretch;
    gap: 30px;
`

const SelectTime = styled.div`
    display: flex;
    border-radius: 15px;
    border: 1px solid #FC2847;
    background: #FFF;
    padding: 5px 20px;
    gap: 40px;
`

const ShowName = styled.div`
    color: #FC2847;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
`

const ShowTime = styled.div`
    color: #FC2847;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
`

const Time = styled.div`
    display: flex;
    gap: 10px;
`