import React, { useState } from "react";
import styled from "styled-components";
import { AiOutlineClose } from "react-icons/ai";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const SelectUserModal = ({ onClose, selectedUsers = [], onConfirm }) => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const options = ["입금대기", "입금확정", "환불대기", "취소완료"];

  const handleSelect = (value) => {
    setSelectedStatus(value);
    setIsOpen(false);
  };

  // ✅ 선택된 사람 이름 문자열로 표시
  const userNames = selectedUsers.map((u) => u.name).join(", ");

  

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
            {selectedUsers.length > 0 ? (
                <>
                <UserNames>{userNames}</UserNames>
                <br/>
                <NormalText>의 상태를 변경하시겠어요?</NormalText>
                </>
            ) : (
                "상태를 변경하시겠어요?"
            )}
        </Content>


        {/* 커스텀 드롭다운 */}
        <DropdownContainer>
          <DropdownHeader onClick={() => setIsOpen((prev) => !prev)}>
            <Placeholder $selected={!!selectedStatus}>
              {selectedStatus || "상태 변경하기"}
            </Placeholder>
            {isOpen ? (
              <IoIosArrowUp size={20} color="#666" />
            ) : (
              <IoIosArrowDown size={20} color="#666" />
            )}
          </DropdownHeader>

          {isOpen && (
            <DropdownList>
              {options.map((option) => (
                <DropdownItem
                  key={option}
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </DropdownItem>
              ))}
            </DropdownList>
          )}
        </DropdownContainer>

        {/* 확인 버튼 */}
        <ConfirmButton
          disabled={!selectedStatus}
          onClick={() => {
            onConfirm(selectedStatus); // ✅ 부모로 상태 전달
          }}
        >
          적용하기
        </ConfirmButton>
      </ModalBox>
    </Overlay>
  );
};

export default SelectUserModal;

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

const DropdownContainer = styled.div`
  position: relative;
  width: 100%;
`;

const DropdownHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 10px 12px;
  cursor: pointer;
  background-color: #fff;
`;

const UserNames = styled.span`
  font-weight: 400;
  color: #333; /* 필요 시 강조색으로 변경 가능 */
`;

const NormalText = styled.span`
  font-weight: 300;
  color: #333;
`;


const Placeholder = styled.span`
  color: ${({ $selected }) => ($selected ? "#333" : "#aaa")};
  font-size: 16px;
  font-weight: 300;
`;

const DropdownList = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 10px;
  margin-top: 5px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;
`;

const DropdownItem = styled.div`
  padding: 10px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 300;
  color: #333;

  &:hover {
    background-color: #f7f7f7;
  }
`;

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
