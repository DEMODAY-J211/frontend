import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../components/Toast/UseToast';
import NavbarManager from '../../../components/Navbar/NavbarManager';
import RegisterShowNavbar from './RegisterShowNavbar';
import { GrCheckbox, GrCheckboxSelected } from 'react-icons/gr';

const checkboxItems = [
  { id: 'deposit', label: '입금 안내' },
  { id: 'reservation', label: '예매 확정' },
  { id: 'performance', label: '공연 안내' },
  { id: 'survey', label: '공연 후 설문 안내' }
];

const RegisterShowStep4 = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [previews, setPreviews] = useState({
    deposit: false,
    reservation: false,
    performance: false,
    survey: false
  });

    const defaultMessages = {
    deposit: "[입금 안내]\n안녕하세요, [단체명]입니다.\n[공연명]의 티켓값은 아래 계좌번호로 입금해주시면 됩니다!\n가격 0,000원\n{예금주명}{계좌번호}",
    reservation: "[예매 확정 안내]\n안녕하세요, [공연명]의 예매가 확정되었습니다!",
    performance: "[극단 몽실_관람일 D-1］\n000님, 관람일이 바로 내일이에요!\n공연명 : {공연명, ex. 뮤지컬 <긴긴밤>}\n일시 : {공연일시, ex. 2025-09-17 (수) 15:00}\n예매 매수: {예매 매수, ex 2장}\n관람장소 : {공연장소, ex. 서강대 메리홀 소극장}",
    survey: "[설문 조사 안내]\n공연이 종료되었습니다. 관람하러 와주신 분들께 감사드리며, 간단한 설문에 응답 부탁드립니다.\n{구글폼 링크}"
    };

  const handleCheckboxToggle = (id) => {
    setPreviews(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleTempSave = () => {
    const formData = { previews };
    localStorage.setItem('registerShowStep4', JSON.stringify(formData));
    addToast('임시 저장되었습니다!', 'success');
  };

  const handlePrevious = () => navigate('/register-show/step3');
  const handleNext = () => navigate('/register-show/step5');

  // 기존 임시 저장 데이터 불러오기
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('registerShowStep4'));
    if (saved?.previews) {
      setPreviews(saved.previews);
    }
  }, []);

  return (
    <>
      <NavbarManager />
      <Container>
        <MainContent>
          <RegisterShowNavbar currentStep={4} />
          <Name>알림 메시지 양식</Name>


        {/* map 안에서 textarea에 적용 */}
        {checkboxItems.map(item => (
        <CheckboxContainer key={item.id}>
<CheckboxButton 
    checked={previews[item.id]} 
    isSurvey={item.id === 'survey'}
    onClick={() => handleCheckboxToggle(item.id)}
>

                {previews[item.id] ? <GrCheckboxSelected /> : <GrCheckbox />}
                {item.label}
            </CheckboxButton>
            {previews[item.id] && (
                <MessageTextarea defaultValue={defaultMessages[item.id]} />
            )}
        </CheckboxContainer>
        ))}

          

        </MainContent>

        <Footer>
          <PrevButton onClick={handlePrevious}>←이전</PrevButton>
          <RightButtonGroup>
            <TempSaveButton onClick={handleTempSave}>임시저장</TempSaveButton>
            <NextButton onClick={handleNext}>다음→</NextButton>
          </RightButtonGroup>
        </Footer>
      </Container>
    </>
  );
};

export default RegisterShowStep4;

const Container = styled.div`
  width: 1440px;
  margin: 0 auto;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.div`
  padding: 50px 100px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  flex: 1;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  width: 100%;
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px 20px;
  border-radius: 20px;
  border: none;
  background: #fc2847;
  color: #fffffe;
  font-weight: 300;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(252, 40, 71, 0.3);
  }
`;

const PrevButton = styled(NavButton)``;
const RightButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
`;
const TempSaveButton = styled(NavButton)``;
const NextButton = styled(NavButton)``;

const Name = styled.div`
  font-size: 25px;
  font-weight: 500;
  display: flex;
  gap: 20px;
`;

const CheckboxContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CheckboxButton = styled.button`
height: 45px;
width: ${({ isSurvey }) => (isSurvey ? '160px' : '120px')};
padding: 5px 10px;
justify-content: center;
gap: 8px;
  display: flex;
  align-items: center;
  gap: 10px;

  border-radius: 10px;
  border: 1px solid #ccc;
  background-color: ${({ checked }) => (checked ? 'var(--color-primary)' : '#fff')};
  color: ${({ checked }) => (checked ? '#FFFFFE' : '#333')};
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
`;

const MessageTextarea = styled.textarea`
  width: 100%;
  min-height: 150px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #ccc;
  resize: vertical;
  font-size: 18px;
`;
