import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { RiArrowRightSLine } from 'react-icons/ri';
import { GrCheckbox, GrCheckboxSelected } from 'react-icons/gr';
import { BsUpload } from 'react-icons/bs';
import { BiSolidMap } from 'react-icons/bi';
import NavbarManager from '../../../components/Navbar/NavbarManager';
import { useToast } from '../../../components/Toast/UseToast';

const RegisterVenue1 = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  // 상태 관리
  const [venueName, setVenueName] = useState('');
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [isStanding, setIsStanding] = useState(false);
  const [standingCapacity, setStandingCapacity] = useState(0);
  const [isSeat, setIsSeat] = useState(false);
  const [floorCount, setFloorCount] = useState(2);
  const [seatCount, setSeatCount] = useState(0);
  const [uploadedImage, setUploadedImage] = useState(null);

  // 파일 업로드 핸들러
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setUploadedImage(file);
        addToast('좌석표가 업로드되었습니다.', 'success');
      } else {
        addToast('이미지 파일만 업로드 가능합니다.', 'error');
      }
    }
  };

  // 주소 검색 핸들러
  const handleAddressSearch = () => {
    // TODO: Daum 주소 검색 API 연동
    addToast('주소 검색 기능은 추후 구현됩니다.', 'info');
  };

  // 유효성 검사
  const validateForm = () => {
    if (!venueName.trim()) {
      addToast('공연장명을 입력해주세요.', 'error');
      return false;
    }
    if (!address.trim()) {
      addToast('주소를 입력해주세요.', 'error');
      return false;
    }
    if (!isStanding && !isSeat) {
      addToast('스탠딩석 또는 좌석 중 하나 이상 선택해주세요.', 'error');
      return false;
    }
    if (isStanding && standingCapacity <= 0) {
      addToast('스탠딩석 허용 인원을 입력해주세요.', 'error');
      return false;
    }
    if (isSeat && seatCount <= 0) {
      addToast('좌석 수를 입력해주세요.', 'error');
      return false;
    }
    return true;
  };

  // 다음 단계로
  const handleNext = () => {
    if (!validateForm()) return;

    const venueData = {
      venueName,
      address,
      detailAddress,
      isStanding,
      standingCapacity,
      isSeat,
      floorCount,
      seatCount,
      uploadedImage,
    };

    localStorage.setItem('registerVenue1', JSON.stringify(venueData));
    // TODO: 2단계 페이지로 이동
    navigate('/register-venue/step2');
  };

  // 이전 단계로
  const handlePrevious = () => {
    navigate('/homemanager');
  };

  return (
    <>
      <NavbarManager />
      <Container>
        <MainContent>
          <Title>내 공연장 등록하기</Title>

          {/* 진행 단계 표시 */}
          <ProgressSteps>
            <StepItem active={true}>① 공연장 기본 정보 입력</StepItem>
            <ArrowIcon />
            <StepItem active={false}>② 좌석배치표 업로드 및 수정</StepItem>
            <ArrowIcon />
            <StepItem active={false}>③ 좌석 라벨링</StepItem>
          </ProgressSteps>

          {/* 컨텐츠 영역 */}
          <ContentArea>
            {/* 좌석표 업로드 */}
            <UploadSection>
              <UploadBox onClick={() => document.getElementById('fileInput').click()}>
                <BsUpload size={32} />
                <UploadText>
                  {uploadedImage ? uploadedImage.name : '공연장 좌석표 사진 업로드하기'}
                </UploadText>
              </UploadBox>
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
            </UploadSection>

            {/* 입력 폼 */}
            <FormSection>
              {/* 공연장명 */}
              <FormField>
                <Label>공연장명</Label>
                <Input
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  placeholder="가나다공연장"
                />
              </FormField>

              {/* 주소 */}
              <FormField>
                <Label>주소</Label>
                <InputWithIcon>
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="주소를 검색해주세요"
                    readOnly
                    style={{ cursor: 'pointer' }}
                    onClick={handleAddressSearch}
                  />
                  <MapIcon onClick={handleAddressSearch}>
                    <BiSolidMap />
                  </MapIcon>
                </InputWithIcon>
              </FormField>

              {/* 상세주소 */}
              <FormField>
                <Label>상세주소</Label>
                <Input
                  value={detailAddress}
                  onChange={(e) => setDetailAddress(e.target.value)}
                  placeholder="상세 주소를 입력해주세요."
                />
              </FormField>

              {/* 스탠딩석 */}
              <FormField>
                <CheckboxContainer onClick={() => setIsStanding(!isStanding)}>
                  {isStanding ? <CheckboxIconSelected /> : <CheckboxIcon />}
                  <Label>스탠딩석</Label>
                </CheckboxContainer>
                <SubFieldGroup>
                  <SubLabel>허용 인원</SubLabel>
                  <SmallInput
                    type="number"
                    value={standingCapacity}
                    onChange={(e) => setStandingCapacity(Number(e.target.value))}
                    disabled={!isStanding}
                    min="0"
                  />
                  <Unit>명</Unit>
                </SubFieldGroup>
              </FormField>

              {/* 좌석 */}
              <FormField>
                <CheckboxContainer onClick={() => setIsSeat(!isSeat)}>
                  {isSeat ? <CheckboxIconSelected /> : <CheckboxIcon />}
                  <Label>좌석</Label>
                </CheckboxContainer>
                <SubFieldGroup>
                  <SubLabel>층 수</SubLabel>
                  <SmallInput
                    type="number"
                    value={floorCount}
                    onChange={(e) => setFloorCount(Number(e.target.value))}
                    disabled={!isSeat}
                    min="1"
                  />
                  <Unit>층</Unit>
                </SubFieldGroup>
                <SubFieldGroup>
                  <SubLabel>좌석 수</SubLabel>
                  <SmallInput
                    type="number"
                    value={seatCount}
                    onChange={(e) => setSeatCount(Number(e.target.value))}
                    disabled={!isSeat}
                    min="0"
                  />
                  <Unit>석</Unit>
                </SubFieldGroup>
              </FormField>
            </FormSection>
          </ContentArea>
        </MainContent>

        {/* 하단 버튼 */}
        <Footer>
          <PrevButton onClick={handlePrevious}>←이전</PrevButton>
          <NextButton onClick={handleNext}>다음→</NextButton>
        </Footer>
      </Container>
    </>
  );
};

export default RegisterVenue1;

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

const ContentArea = styled.div`
  padding: 50px;
  display: flex;
  gap: 18px;
  flex: 1;
`;

const UploadSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const UploadBox = styled.div`
  width: 450px;
  height: 450px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.2);
  }

  svg {
    color: #000000;
  }
`;

const UploadText = styled.p`
  font-weight: 300;
  font-size: 20px;
  color: #000000;
  margin: 0;
  text-align: center;
  max-width: 300px;
  word-break: keep-all;
`;

const FormSection = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  align-items: flex-end;
  flex: 1;
`;

const FormField = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  width: 100%;
`;

const Label = styled.label`
  font-weight: 500;
  font-size: 25px;
  color: #000000;
  min-width: 117px;
`;

const Input = styled.input`
  flex: 1;
  background: #ffffff;
  border: 1px solid #c5c5c5;
  border-radius: 16px;
  padding: 10px 20px;
  font-weight: 300;
  font-size: 20px;
  color: #000000;

  &::placeholder {
    color: #999;
  }

  &:focus {
    outline: none;
    border-color: #fc2847;
  }
`;

const InputWithIcon = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
`;

const MapIcon = styled.div`
  position: absolute;
  right: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 24px;
    height: 24px;
    color: #fc2847;
  }

  &:hover {
    opacity: 0.7;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  flex: 1;
`;

const CheckboxIcon = styled(GrCheckbox)`
  width: 24px;
  height: 24px;
  color: #000000;
`;

const CheckboxIconSelected = styled(GrCheckboxSelected)`
  width: 24px;
  height: 24px;
  color: #fc2847;
`;

const SubFieldGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  border-left: 1px solid #c5c5c5;
  padding-left: 15px;

  &:first-of-type {
    border-left: none;
    padding-left: 0;
  }
`;

const SubLabel = styled.span`
  font-weight: 300;
  font-size: 20px;
  color: #000000;
`;

const SmallInput = styled.input`
  width: 80px;
  background: #ffffff;
  border: 1px solid #c5c5c5;
  border-radius: 10px;
  padding: 5px 20px;
  font-weight: 300;
  font-size: 20px;
  color: #000000;
  text-align: center;

  &:focus {
    outline: none;
    border-color: #fc2847;
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }

  /* 숫자 입력 화살표 제거 */
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const Unit = styled.span`
  font-weight: 300;
  font-size: 20px;
  color: #000000;
  min-width: 44px;
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

const NextButton = styled(NavButton)``;
