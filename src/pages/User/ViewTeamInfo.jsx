import react from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import NavbarUser from "../../components/Navbar/NavbarUser.jsx";
import Footerbtn from "../../components/Save/Footerbtn.jsx";
import TeamInfo from "../../components/User/TeamInfo";

export default function ViewTeamInfo() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <HomeUserContainer>
        <NavbarUser />
        <TeamInfo />
        <Footerbtn
          buttons={[{ text: "확인", color: "red", to: "/homeuser" }]}
        />
      </HomeUserContainer>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  min-height: 100vh;
  background-color: #fff;

  color: #000;
  font-size: 20px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
`;

const HomeUserContainer = styled.div`
  display: flex;
  // width: 393px;
  min-width: 375px;
  max-width: 430px;
  width: 100vw;
  flex-direction: column;
  align-items: flex-start;
  background: #fff;
  box-shadow: 0 0 30px 5px rgba(0, 0, 0, 0.25);
`;
