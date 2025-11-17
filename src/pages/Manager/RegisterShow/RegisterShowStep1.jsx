import React from 'react'
import NavbarManager from '../../../components/Navbar/NavbarManager'
import RegisterShowNavbar from './RegisterShowNavbar'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../../components/Toast/UseToast'

const RegisterShowStep1 = () => {

    const navigate = useNavigate();
      const { addToast } = useToast();
      const selectedVenues = 0;
    

      // 임시 저장 핸들러
  const handleTempSave = () => {
    const formData = {
    //   venues: selectedVenues,
    //   salesMethod: selectedMethod,
    //   quantity: quantity,
    };
    localStorage.setItem('registerShowStep3', JSON.stringify(formData));
    addToast('임시 저장되었습니다!', 'success');
  };

  // 이전 단계로
  const handlePrevious = () => {
    // TODO: 2단계 페이지로 이동
    navigate('/homemanager');
  };

  // 다음 단계로
  const handleNext = () => {
    if (selectedVenues.length === 0) {
      addToast('공연 장소를 선택해주세요!', 'error');
      return;
    }

    // TODO: 4단계 페이지로 이동
    navigate('/register-show/step2');
  };
  return (
    <>

    <NavbarManager/>
    <Container>
        <MainContent>
          <RegisterShowNavbar currentStep={1}/>

          <FormContent>
            <LeftContent>
                <Name>대표 포스터</Name>
                <Poster></Poster>
            </LeftContent>
            <RightContent>

            </RightContent>
          </FormContent>
        </MainContent>


          {/* 하단 버튼 */}
        <Footer>
          <PrevButton onClick={handlePrevious}>←이전</PrevButton>
          <RightButtonGroup>
            <TempSaveButton onClick={handleTempSave}>임시저장</TempSaveButton>
            <NextButton onClick={handleNext}>다음→</NextButton>
          </RightButtonGroup>
        </Footer>
     </Container>
    


    
    </>
  )
}

export default RegisterShowStep1


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
