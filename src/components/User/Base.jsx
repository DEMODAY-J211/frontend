// BaseBottomSheet.jsx
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import styled from "styled-components";

const mockData = [
  {
    showId: 12,
    showTitle: "제11회 정기공연",
    showStartDate: "2025-09-25",
    showtimeEndDate: "2025-09-26",
    showLocation: "서강대학교 메리홀 소극장",
    showPosterPicture: "https://example.com/poster.png",
    showtimeList: [
      {
        showtimeId: 1,
        showtimeStart: "2025-09-25 15:00",
      },
      {
        showtimeId: 2,
        showtimeStart: "2025-09-25 18:00",
      },
    ],
    ticketOptionList: [
      {
        ticketoptionName: "학생할인",
        ticketoptionPrice: 8000,
      },
      {
        ticketoptionName: "학생할인",
        ticketoptionPrice: 8000,
      },
    ],
    managerInfo: {
      managerName: "멋쟁이연극회",
      managerEmail: "1004@gmail.com",
    },
    showDetailText: "공연상세 정보입니다.",
  },
];

export default function Base({ children, onClose, showData }) {
  const y = useMotionValue(0);

  // 드래그 위치에 따라 반투명도나 그림자 효과 등 줄 수도 있음
  const opacity = useTransform(y, [0, 300], [1, 0.5]);

  const handleDragEnd = (_, info) => {
    // 아래로 충분히 드래그하면 닫기
    if (info.offset.y > 100) {
      animate(y, window.innerHeight, {
        onComplete: onClose, // 드래그로 닫기
      });
    } else {
      // 제자리로 복귀
      animate(y, 0);
    }
  };
  return (
    <Overlay onClick={onClose}>
      <Sheet
        as={motion.div}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        onClick={(e) => e.stopPropagation()}
        style={{ y, opacity }}
        drag="y"
        dragConstraint={{ handleDragEnd }}
        onDragEnd={handleDragEnd}
        transition={{ type: "spring", bounce: 0.25 }}
      >
        <Header>
          <div />
        </Header>
        {children}
      </Sheet>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: flex-end;
`;

const Sheet = styled.div`
  width: 80%;
  min-width: 375px;
  max-width: 430px;
  width: 100vw;
  background: #fff;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.25);
  // padding: 10px 20px;
  display: flex;
  flex-direction: column;
  font-size: 18px;
  display: flex;
  border-radius: 20px 20px 0 0;
  // background: #fff;

  h3 {
    color: #000;
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  padding: 10px;
  div {
    display: flex;
    width: 50%;
    height: 10px;
    border-radius: 8px;
    background: #000;
  }
`;
