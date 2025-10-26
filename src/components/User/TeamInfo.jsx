import styled from "styled-components";
import { BsInstagram, BsFacebook } from "react-icons/bs";
import { BiLogoYoutube } from "react-icons/bi";

export default function TeamInfo() {
  return (
    <TeamContainer>
      <div className="team">
        <img className="team_img" src={""} />
        <h2>서강연극회</h2>
        <LinkContainer>
          <BsInstagram
            size={24}
            onClick={() => window.open("https://www.instagram.com/")}
          />
          <BsFacebook
            size={24}
            onClick={() => window.open("https://www.facebook.com/")}
          />
          <BiLogoYoutube
            size={32}
            onClick={() => window.open("https://www.youtube.com/")}
          />
        </LinkContainer>
      </div>
      <p>한줄 소개</p>
      멋쟁이 연극회입니다.
      <p>소개글</p>
      이런 멋쟁이연극회 좋아할래 이런 멋쟁이연극회 좋아할래이런 멋쟁이연극회
      좋아할래 이런 멋쟁이연극회 좋아할래 이런 멋쟁이연극회 좋아할래 이런
      멋쟁이연극회 좋아할래
    </TeamContainer>
  );
}

const TeamContainer = styled.div`
  display: flex;
  padding: 20px;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  flex: 1 0 0;
  text-align: justify;
  font-size: 15px;
  font-weight: 300;
  line-height: 1.2;

  .team {
    display: flex;
    flex-direction: column;
    align-items: center;
    align-self: stretch;
    gap: 16px;
  }
  .team_img {
    height: 163px;
    aspect-ratio: 1/1;
    border-radius: 1000px;
    border: 1px solid #000;
    background: #000;
  }
  p {
    align-self: stretch;
    font-size: 20px;
    font-weight: 500;
  }
`;

const LinkContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fc2847;
  cursor: pointer;
`;
