import React from "react";
import styled from "styled-components";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RiInformationLine, RiArrowLeftSLine } from "react-icons/ri";
import { IoTicket } from "react-icons/io5";
import tikitta_small from "../../assets/tikitta_small.svg";
import { IoMdLogIn } from "react-icons/io";
import { useAuth } from "../../pages/Auth/AuthContext";

export default function NavbarUser({
  Backmode = false,
  text = "",
  onIconClick,
  nav = "",
}) {
  const { managerId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  // console.log("managerId,", managerId);
  const navi = () => {
    console.log("nav 값:", nav);

    if (!nav) {
      navigate(-1);
      return;
    }

    navigate(nav, { replace: true });
  };

  console.log("nav prop:", nav);
  console.log("managerId:", managerId);
  return Backmode ? (
    // 예매하기(서브 헤더) 헤더 ex. <NavbarUser Backmode={true} text="예매하기" />
    <HeaderContainer>
      <div className="buttoncontainer" onClick={navi}>
        <RiArrowLeftSLine size="32px" />
      </div>
      <MainContainer>{text ? text : "제11회 정기공연"}</MainContainer>
    </HeaderContainer>
  ) : (
    // 메인 헤더 (기본값) ex. <NavbarUser/>, <NavbarUser Backmode={false} />
    <HeaderContainer>
      <img
        src={tikitta_small}
        alt="tikitta logo"
        onClick={() => navigate(`/${managerId}/homeuser`)}
        style={{ cursor: "pointer" }}
      />
      <TextContainer>
        {text ? text : "서강연극회"}
        <div className="button">
          <div className="buttoncontainer">
            <RiInformationLine
              size="24px"
              onClick={() => navigate(`/${managerId}/viewteaminfo`)}
            />
          </div>
          <div className="buttoncontainer">
            <IoMdLogIn size="24px" onClick={isLoggedIn ? logout : () => {}} />
          </div>
        </div>
      </TextContainer>
      <div className="buttoncontainer">
        <IoTicket size="24px" color="#FC2847" onClick={onIconClick} />
      </div>
    </HeaderContainer>
  );
}

const HeaderContainer = styled.div`
  display: flex;
  position: sticky;
  top: 0; /* 화면 상단에 붙도록 */
  z-index: 800; /* 다른 컨텐츠 위로 올라오도록 */
  height: 80px;
  padding: 10px 20px;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  align-self: stretch;
  background-color: #fff;

  color: #000;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  .buttoncontainer {
    display: flex;
    aspect-ratio: 1/1;
    background: none;
    border: none;
    cursor: pointer;
  }
`;

const MainContainer = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  user-select: none;
`;

const TextContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #000;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  .button {
    display: flex;
    gap: 5px;
  }
`;
