import styled from "styled-components";
import { useNavigate } from "react-router-dom";

// <Footerbtn buttons={[{ text: "예매하기", color: "red", to: "/buyticket" }]} />
// color : ["red", "white"]
export default function Footerbtn({ buttons = [] }) {
  const navigate = useNavigate();
  console.log("footerbtn");
  return (
    <Footer>
      {buttons.map((btn, idx) => (
        <Button
          key={idx}
          color={btn.color}
          onClick={() => btn.to && navigate(btn.to)}
        >
          {btn.text}
        </Button>
      ))}
    </Footer>
  );
}

const Footer = styled.div`
  display: flex;
  position: sticky;
  bottom: 0; /* 화면 상단에 붙도록 */
  z-index: 1000; /* 다른 컨텐츠 위로 올라오도록 */
  padding: 10px;
  align-self: stretch;
  background-color: #fff;
  // width: 393px;
  align-items: flex-start;
  gap: 10px;
`;

const Button = styled.div`
  display: flex;
  // height: 50px;
  padding: 10px 20px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex: 1 0 0;
  align-self: stretch;
  border-radius: 10px;
  background: ${(props) => {
    switch (props.color) {
      case "red":
        return "#fc2847";
      case "white":
        return "#ffffff";
      case "gray":
        return "#cccccc";
      default:
        return "#fc2847";
    }
  }};
  border: ${(props) => {
    switch (props.color) {
      case "red":
        return "none";
      case "white":
        return "1px solid #D60033";
      case "gray":
        return "none";
      default:
        return "none";
    }
  }};
  cursor: ${(props) => {
    switch (props.color) {
      case "gray":
        return "";
      default:
        return "pointer";
    }
  }};
  color: ${(props) => {
    switch (props.color) {
      case "red":
        return "#fff1f0";
      case "white":
        return "#D60033";
      case "gray":
        return "#ffffff";
      default:
        return "#ffffff";
    }
  }};

  font-size: 20px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
  width: 100%;
  transition: background 0.3s ease;

  &:hover {
    background: ${(props) => {
      switch (props.color) {
        case "red":
          return "#e0203e";
        case "white":
          return "#FFECEC";
        case "gray":
          return "#cccccc";
        default:
          return "#e0203e";
      }
    }};
  }
`;
