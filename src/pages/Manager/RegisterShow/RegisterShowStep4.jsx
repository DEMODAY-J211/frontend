import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../components/Toast/UseToast';
import NavbarManager from '../../../components/Navbar/NavbarManager';
import RegisterShowNavbar from './RegisterShowNavbar';
import { GrCheckbox, GrCheckboxSelected } from 'react-icons/gr';
import {createGlobalStyle} from 'styled-components';

const GlobalStyle = createGlobalStyle`
  .macro-box {
    background: #f5f5f5;
    padding: 0 6px;
    border-radius: 6px;
    font-size: 18px;
    font-weight: 300;
    color: #999;
    display: inline-block;
   border: 1px solid #C5C5C5;
  }
`;


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
    performance: true,
    survey: false
  });

const defaultMessages = {
  deposit:
    "[입금 안내]\n" +
    "안녕하세요, {단체명}입니다!\n" +
    "예매하신 {공연명}의 티켓 금액을 아래 계좌로 입금해주시면 예매가 완료됩니다.\n\n" +
    "입금 금액: {0,000원}\n" +
    "예금주: {예금주명}\n" +
    "계좌번호: {계좌번호}\n\n" +
    "확인되는 대로 빠르게 안내해 드리겠습니다!",

  reservation:
    "[예매 확정 안내]\n" +
    "안녕하세요! {공연명}의 예매가 정상적으로 완료되었습니다😊\n\n" +
    "소중한 예매 감사드리며, 공연장에서 뵙겠습니다!",

  performance:
    "[관람일 D-1 안내]\n" +
    "{000 님}, 관람일이 바로 내일이에요!\n\n" +
    "공연명: {공연명}\n" +
    "일시: {공연일시}\n" +
    "예매 매수: {예매 매수}\n" +
    "관람 장소: {공연장소}\n\n" +
    "안전하고 즐거운 관람을 위해 입장시간에 맞춰 와주세요!",

  survey:
    "[관람 후기 설문 안내]\n" +
    "공연을 관람해주셔서 진심으로 감사합니다!\n" +
    "더 좋은 공연을 만들기 위해 짧은 설문에 참여 부탁드립니다! \n\n" +
    "설문 링크: (링크를 넣어주세요)"
};

const macroMap = {
  단체명: 'team_name',
  공연명: 'show_name',
  '0,000 원': 'amount',
  예금주명: 'account_holder',
  계좌번호: 'account_number',
  예매_매수: 'ticket_count',
  '000 님': 'username',
  공연일시: 'show_date_time',
  관람장소: 'venue'
};

const renderWithMacroBox = (text) => {
  return text.replace(/\{([^}]+)\}/g, (_, key) => {
    return `<span contenteditable="false" class="macro-box">{${key}}</span>`;
  });
};
const convertMessageForBackend = (text) => {
  return text.replace(/\{([^}]+)\}/g, (_, key) => {
    return `{${macroMap[key] || key}}`;
  });
};



  const handleCheckboxToggle = (id) => {
    if (id === "performance") return; // ❗ 공연 안내는 비활성화
    setPreviews(prev => ({ ...prev, [id]: !prev[id] }));
    };


  const handleTempSave = () => {
    const formData = { previews };
    localStorage.setItem('registerShowStep4', JSON.stringify(formData));
    addToast('임시 저장되었습니다!', 'success');
  };

  const handlePrevious = () => navigate('/register-show/step3');
const handleNext = () => {
  const performanceTextarea = document.getElementById("textarea-performance");
  if (!performanceTextarea) return;

  const userEditedMessage = performanceTextarea.innerText.trim();

  if (!userEditedMessage) {
    addToast('필수 항목을 입력해주세요: 공연 안내', 'error');
    return;
  }

  // 백엔드용 메시지 변환
  const backendMessage = convertMessageForBackend(userEditedMessage);

  console.log('보낼 메시지:', backendMessage); // 여기서 실제 API 호출하면 됨

  navigate('/register-show/step5');
};



  // 기존 임시 저장 데이터 불러오기
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('registerShowStep4'));
    if (saved?.previews) {
      setPreviews(saved.previews);
    }
  }, []);

  return (
    <>
    <GlobalStyle/>
      <NavbarManager />
      <Container>
        <MainContent>
          <RegisterShowNavbar currentStep={4} />
          <Flex>
          <Name>알림 메시지 양식</Name>
          <Desc>* 회색 박스 안의 정보는 티킷타에서 자동으로 넣어주는 내용이니 수정하지 않으셔도 됩니다!</Desc>
          </Flex>



        {/* map 안에서 textarea에 적용 */}
        {checkboxItems.map(item => (
        <CheckboxContainer key={item.id}>
        <Flex>
        <CheckboxButton 
            checked={previews[item.id]} 
            isSurvey={item.id === 'survey'}
            onClick={() => handleCheckboxToggle(item.id)}
        >

                {previews[item.id] ? <GrCheckboxSelected /> : <GrCheckbox />}
                {item.label}
            </CheckboxButton>
             {item.id === "performance" && <RequiredText>(필수)</RequiredText>}
             </Flex>
            {previews[item.id] && (
<MessageTextarea
  id={`textarea-${item.id}`}
  contentEditable
  dangerouslySetInnerHTML={{
    __html: renderWithMacroBox(defaultMessages[item.id])
  }}
/>


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

const Desc = styled.div`
    font-size: 15px;
    font-weight: 400;
    display: flex;
    color: var(--color-primary);
`

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

const MessageTextarea= styled.div`
  width: 100%;
  min-height: 200px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 18px;
  font-weight: 300;
  line-height: 1.8;
  white-space: pre-wrap;
`;



const RequiredText = styled.span`
  color: #fc2847;
  font-size: 14px;
  margin-left: 5px;
  font-weight: 700;
`;

const Flex = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
`