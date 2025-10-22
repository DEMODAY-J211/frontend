import React from "react";
import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiInformationLine, RiArrowLeftSLine } from "react-icons/ri";
import { IoTicket } from "react-icons/io5";
import tikitta from "../../assets/tikitta.svg";

export default function NavbarUser({ Backmode = false, text = "" }) {
  const navigate = useNavigate();
  const [login, setLogin] = useState(true); //true: 로그인 상태 , false: 로그아웃 상태

  return Backmode ? (
    // 예매하기(서브 헤더) 헤더 ex. <NavbarUser Backmode={true} text="예매하기" />
    <HeaderContainer>
      <div className="buttoncontainer" onClick={() => navigate(-1)}>
        <RiArrowLeftSLine size="32px" />
      </div>
      <MainContainer>{text ? text : "제11회 정기공연"}</MainContainer>
      <div className="buttoncontainer">
        <IoTicket
          size="24px"
          color="#FC2847"
          onClick={() => navigate("/myticketlist")}
        />
      </div>
    </HeaderContainer>
  ) : (
    // 메인 헤더 (기본값) ex. <NavbarUser/>, <NavbarUser Backmode={false} />
    <HeaderContainer>
      <img
        src={tikitta}
        alt="tikitta logo"
        onClick={() => navigate("/homeuser")}
        style={{ cursor: "pointer" }}
      />
      <MainContainer>
        서강연극회
        <div className="buttoncontainer">
          <RiInformationLine
            size="24px"
            onClick={() => navigate("/viewteaminfo")}
          />
        </div>
      </MainContainer>
      <div className="buttoncontainer">
        <IoTicket
          size="24px"
          color="#FC2847"
          onClick={() => navigate("/myticketlist")}
        />
      </div>
    </HeaderContainer>
  );
}

const HeaderContainer = styled.div`
  display: flex;
  height: 80px;
  padding: 10px 20px;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  align-self: stretch;

  color: #000;
  font-family: GyeonggiTitle;
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
  display: flex;
  align-items: center;
  gap: 5px;
  user-select: none;
`;
