import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { RiArrowRightSLine, RiInformationLine } from 'react-icons/ri';
import { GrCheckbox, GrCheckboxSelected } from 'react-icons/gr';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import NavbarManager from '../../../components/Navbar/NavbarManager';
import { useToast } from '../../../components/Toast/UseToast';
import SeatSelectionModal from '../../../components/Modal/SeatSelectionModal';

const RegisterShowStep3 = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  // 상태 관리
  const [selectedVenues, setSelectedVenues] = useState(['000 소극장']); // 다중 선택
  const [selectedMethod, setSelectedMethod] = useState('스탠딩석'); // 단일 선택
  const [quantity, setQuantity] = useState(100);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [excludedSeats, setExcludedSeats] = useState([]); // 제외된 좌석

  // 공연 장소 더미 데이터
  const venues = ['000 소극장', '001 소극장', '002 소극장', '003 소극장'];

  // 좌석 판매 방법 옵션
  const salesMethods = ['스탠딩석', '주최 측 배정', '예매자 선택', '자동 배정'];

  // 공연 장소 선택 핸들러 (다중 선택)
  const handleVenueToggle = (venue) => {
    setSelectedVenues((prev) =>
      prev.includes(venue)
        ? prev.filter((v) => v !== venue)
        : [...prev, venue]
    );
  };

  // 좌석 판매 방법 선택 핸들러 (단일 선택)
  const handleMethodSelect = (method) => {
    setSelectedMethod(method);

    // 예매자 선택 또는 자동 배정인 경우 모달 열기
    if (method === '예매자 선택' || method === '자동 배정') {
      setIsModalOpen(true);
    }
  };

  // 모달에서 좌석 저장
  const handleSaveSeats = (seatData) => {
    setExcludedSeats(seatData.excludedSeats);

    if (selectedMethod === '예매자 선택') {
      addToast(`${seatData.excludedSeats.length}개의 좌석이 제외되었습니다.`, 'success');
    } else if (selectedMethod === '자동 배정') {
      addToast(`${seatData.vipSeats.length}개의 VIP석이 지정되었습니다.`, 'success');
    }
  };

  // 수량 조절 핸들러
  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, Math.min(9999, prev + delta)));
  };

  // 임시 저장 핸들러
  const handleTempSave = () => {
    const formData = {
      venues: selectedVenues,
      salesMethod: selectedMethod,
      quantity: quantity,
    };
    localStorage.setItem('registerShowStep3', JSON.stringify(formData));
    addToast('임시 저장되었습니다!', 'success');
  };

  // 이전 단계로
  const handlePrevious = () => {
    // TODO: 2단계 페이지로 이동
    navigate('/register-show/step2');
  };

  // 다음 단계로
  const handleNext = () => {
    if (selectedVenues.length === 0) {
      addToast('공연 장소를 선택해주세요!', 'error');
      return;
    }

    // TODO: 4단계 페이지로 이동
    navigate('/register-show/step4');
  };

  return (
    <>
      <NavbarManager />
      <Container>
        <MainContent>
          <Title>공연 등록하기</Title>

          {/* 진행 단계 표시 */}
          <ProgressSteps>
            <StepItem active={false}>
              ① 공연 기본정보
            </StepItem>
            <ArrowIcon />
            <StepItem active={false}>
              ② 공연 상세정보
            </StepItem>
            <ArrowIcon />
            <StepItem active={true}>
              ③ 공연 장소·좌석
            </StepItem>
            <ArrowIcon />
            <StepItem active={false}>
              ④ 알림 메시지
            </StepItem>
            <ArrowIcon />
            <StepItem active={false}>
              ⑤ 미리 보기
            </StepItem>
          </ProgressSteps>

          <FormContent>
            {/* 공연 장소 섹션 */}
            <Section>
              <SectionTitle>공연 장소</SectionTitle>
              <ButtonGroup>
                {venues.map((venue) => (
                  <SelectButton
                    key={venue}
                    active={selectedVenues.includes(venue)}
                    onClick={() => handleVenueToggle(venue)}
                  >
                    {selectedVenues.includes(venue) ? (
                      <CheckboxIconSelected />
                    ) : (
                      <CheckboxIcon />
                    )}
                    {venue}
                  </SelectButton>
                ))}
              </ButtonGroup>
            </Section>

            {/* 좌석 판매 방법 섹션 */}
            <Section>
              <SectionTitle>좌석 판매 방법</SectionTitle>
              <ButtonGroup>
                {salesMethods.map((method) => (
                  <SelectButton
                    key={method}
                    active={selectedMethod === method}
                    onClick={() => handleMethodSelect(method)}
                  >
                    {selectedMethod === method ? (
                      <CheckboxIconSelected />
                    ) : (
                      <CheckboxIcon />
                    )}
                    {method}
                  </SelectButton>
                ))}
              </ButtonGroup>
              <InfoMessage>
                <InfoIcon />
                <InfoText>좌석이 없는 공연은 스탠딩석을 골라주세요!</InfoText>
              </InfoMessage>
            </Section>

            {/* 판매 수량 섹션 */}
            <QuantitySection>
              <SectionTitle>판매 수량</SectionTitle>
              <QuantityControl>
                <QuantityButtons>
                  <MinusButton onClick={() => handleQuantityChange(-1)}>
                    <AiOutlineMinus />
                  </MinusButton>
                  <QuantityDisplay>{quantity}</QuantityDisplay>
                  <PlusButton onClick={() => handleQuantityChange(1)}>
                    <AiOutlinePlus />
                  </PlusButton>
                </QuantityButtons>
                <Unit>개</Unit>
              </QuantityControl>
            </QuantitySection>
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

      {/* 좌석 선택 모달 */}
      <SeatSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSeats}
        salesMethod={selectedMethod}
      />
    </>
  );
};

export default RegisterShowStep3;

// Styled Components
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

const Title = styled.h1`
  
  font-weight: 500;
  font-size: 30px;
  color: #000000;
  margin: 0;
`;

const ProgressSteps = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  border-bottom: 1px solid #c5c5c5;
  padding-bottom: 0;
`;

const StepItem = styled.div`
  
  font-weight: 500;
  font-size: 20px;
  padding: 10px;
  color: ${(props) => (props.active ? '#FC2847' : '#737373')};
  border-bottom: ${(props) => (props.active ? '2px solid #FC2847' : 'none')};
  cursor: pointer;
`;

const ArrowIcon = styled(RiArrowRightSLine)`
  width: 32px;
  height: 32px;
  color: #737373;
`;

const FormContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-top: 12px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SectionTitle = styled.h2`
  
  font-weight: 500;
  font-size: 25px;
  color: #000000;
  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
`;

const SelectButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 121px;
  height: 45px;
  padding: 5px 10px;
  border-radius: 10px;
  border: ${(props) => (props.active ? 'none' : '1px solid #C5C5C5')};
  background: ${(props) => (props.active ? '#FC2847' : '#FFFFFE')};
  color: ${(props) => (props.active ? '#FFFFFE' : '#333333')};
  
  font-weight: ${(props) => (props.active ? 'bold' : '300')};
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const CheckboxIcon = styled(GrCheckbox)`
  width: 16px;
  height: 16px;
  color: #333333;
`;

const CheckboxIconSelected = styled(GrCheckboxSelected)`
  width: 16px;
  height: 16px;
  color: #fffffe;
`;

const InfoMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 5px;
`;

const InfoIcon = styled(RiInformationLine)`
  width: 16px;
  height: 16px;
  color: #d72b2b;
`;

const InfoText = styled.span`
  
  font-weight: 300;
  font-size: 15px;
  color: #d72b2b;
`;

const QuantitySection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const QuantityButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fc2847;
  border-radius: 20px;
  padding: 3px 10px;
`;

const MinusButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background: transparent;
  border: none;
  color: #fffffe;
  cursor: pointer;
  padding: 0;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const PlusButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background: transparent;
  border: none;
  color: #fffffe;
  cursor: pointer;
  padding: 0;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const QuantityDisplay = styled.div`
  
  font-weight: 500;
  font-size: 20px;
  color: #fffffe;
  width: 36px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Unit = styled.span`
  
  font-weight: 500;
  font-size: 20px;
  color: #000000;
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
