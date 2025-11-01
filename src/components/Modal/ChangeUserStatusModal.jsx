import React, { useState } from "react";
import styled from "styled-components";
import { AiOutlineClose } from "react-icons/ai";

const ChangeUserStatusModal = ({ onClose, changedUsers = [], onConfirm} ) => {


    // ✅ 선택된 사람 이름 문자열로 표시
  const userNames = changedUsers.map((u) => u.name).join(", ");
  const finalStatuses = [...new Set(changedUsers.map(u => u.status))].join(", ");
  return (
    <Overlay>
         <ModalBox>
           {/* 닫기 버튼 */}
           <BtnContainer>
             <CloseButton onClick={onClose}>
               <AiOutlineClose size={22} />
             </CloseButton>
           </BtnContainer>
   
           {/* 본문 내용 */}
           <Content>
               {changedUsers.length > 0 ? (
                   <>
                   <UserNames>{userNames}</UserNames>
                   <br/>
                   <NormalText>의 상태를 </NormalText>
                   <HighlightText>{finalStatuses}</HighlightText>
                   <NormalText>로 저장하시겠어요?</NormalText><br/><br/>
                    <SmallText>입금 확정 시, 예매자에게 확인 문자가 즉시 발송됩니다.</SmallText>
                   </>
               ) : (
                   "상태를 변경하시겠어요?"
               )}
           </Content>
   
   
           {/* 확인 버튼 */}
           <ConfirmButton
             onClick={() => {
               onConfirm(); // ✅ 부모로 상태 전달
             }}
           >
             저장하기
           </ConfirmButton>
         </ModalBox>
       </Overlay>
  )
}

export default ChangeUserStatusModal

/* ---------------- Styled Components ---------------- */

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ModalBox = styled.div`
  width: 80%;
  max-width: 350px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.25);
  padding: 20px 25px 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const BtnContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

const Content = styled.div`
  font-size: 18px;
  font-weight: 400;
  color: #222;
  text-align: center;
  line-height: 1.4;
`;


const UserNames = styled.span`
  font-weight: 400;
  color: #333; /* 필요 시 강조색으로 변경 가능 */
`;

const NormalText = styled.span`
  font-weight: 300;
  color: #333;
`;

const HighlightText = styled.span`
    font-weight: 300;
    color: var(--color-primary);
`
const SmallText = styled.span`
    font-size: 14px;
    font-weight: 300;
    color: #333;
`


const ConfirmButton = styled.button`
  background-color: ${({ disabled }) =>
    disabled ? "#ddd" : "var(--color-primary)"};
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  padding: 10px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;
`;
