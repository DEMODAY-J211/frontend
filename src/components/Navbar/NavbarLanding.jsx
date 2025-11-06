import React from "react";
import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/tikitta_logo.png";


const NavbarLanding = () => {
  const navigate = useNavigate();
  return (
    <Navbar>
      <NavbarLeft>
        <Logo
          onClick={() => navigate("/homemanager")}
          src={logo}
          alt="로고"
        ></Logo>
      </NavbarLeft>
      <NavbarRight>
          <Button onClick={()=>navigate("/login")}>로그인</Button>
      </NavbarRight>
    </Navbar>
  );
};

export default NavbarLanding;

const Navbar = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 0 100px;
  background-color: #fff;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    padding: 0 50px;
  }

  @media (max-width: 768px) {
    gap: 10px;
    padding: 10px 20px;
  }
`;

const NavbarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
    gap: 10px;
  }
`;

const Logo = styled.img`
  width: 80px;
  height: auto;
  cursor: pointer;

  @media (max-width: 768px) {
    width: 60px; /* 비율 유지하며 축소 */
  }
`;


const NavbarRight = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    justify-content: center;
  }
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

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 8px 16px;
  }
`;
