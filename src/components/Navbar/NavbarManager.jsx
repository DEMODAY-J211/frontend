import React from "react";
import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/tikitta_logo.png";


const NavbarManager = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState(true); //true: 로그인 상태 , false: 로그아웃 상태

  return (
    <Navbar>
      <NavbarLeft>
        <Logo
          onClick={() => navigate("/homemanager")}
          src={logo}
          alt="로고"
        ></Logo>
        <NavItem onClick={() => navigate("/homemanager")}>메인 홈</NavItem>
        <NavItem onClick={() => navigate("/manageshow")}>내 공연 관리</NavItem>
        <NavItem onClick={() => navigate("/qrmanager")}>QR 입장 확인</NavItem>
      </NavbarLeft>
      <NavbarRight>
        {login === true ? (
          <Button>로그아웃</Button>
        ) : (
          <Button>로그인</Button>
        )}
      </NavbarRight>
    </Navbar>
  );
};

export default NavbarManager;

const Navbar = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 0 100px;
  background-color: #fff;
`;

const NavbarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Logo = styled.img`
  width: 100px;
  height: auto;
  cursor: pointer;
`;

const NavItem = styled.div`
  margin-left: 20px;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  cursor: pointer;
`;

const NavbarRight = styled.div`
  display: flex;
  align-items: center;
`;

const Button = styled.button`
  cursor: pointer;
  display: flex;
  padding: 10px 20px;
  justify-content: center;
  align-items: center;
  
  border-radius: 20px;
  border: none;
  background-color: var(--color-primary);

  color: #FFFFFE;
  font-size: 20px;
  font-weight: 700;
`;
