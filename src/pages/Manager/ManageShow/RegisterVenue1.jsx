import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { RiArrowRightSLine } from 'react-icons/ri';
import { GrCheckbox, GrCheckboxSelected } from 'react-icons/gr';
import { BsUpload } from 'react-icons/bs';
import { BiSolidMap } from 'react-icons/bi';
import DaumPostcode from 'react-daum-postcode';
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
  const [standingCapacity, setStandingCapacity] = useState('');
  const [isSeat, setIsSeat] = useState(false);
  const [floorCount, setFloorCount] = useState('');
  const [seatCount, setSeatCount] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

  // 파일 업로드 핸들러
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setUploadedImage(file);

        // 이미지 미리보기 생성
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);

        addToast('좌석표가 업로드되었습니다.', 'success');
      } else {
        addToast('이미지 파일만 업로드 가능합니다.', 'error');
      }
    }
  };

  // 주소 검색 핸들러
  const handleAddressSearch = () => {
    setIsPostcodeOpen(true);
  };

  // 주소 선택 완료 핸들러
  const handleComplete = (data) => {
    setAddress(data.address);
    setIsPostcodeOpen(false);
    addToast('주소가 입력되었습니다.', 'success');
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
    if (isSeat && (!floorCount || Number(floorCount) <= 0)) {
      addToast('층 수를 입력해주세요.', 'error');
      return false;
    }
    return true;
  };

  // 다음 단계로
  const handleNext = async () => {
    if (!validateForm()) return;

    // FormData 생성 (multipart/form-data)
    const formData = new FormData();

    // JSON 데이터를 venueRegisterRequest로 Blob 형태로 추가
    const venueRegisterRequest = {
      locationName: venueName,
      locationAddress: address,
      locationAddressDetail: detailAddress || '',
      locationStandingCount: isStanding ? Number(standingCapacity) : 0,
      locationSeatFloor: isSeat ? Number(floorCount) : 1,
      locationSeatCount: 0,
    };

    formData.append('venueRegisterRequest', new Blob([JSON.stringify(venueRegisterRequest)], { type: 'application/json' }));

    // 이미지 파일 추가 (있는 경우)
    if (uploadedImage) {
      formData.append('locationPicture', uploadedImage);
    }

    console.log('=== 백엔드로 보내는 데이터 ===');
    console.log('Request Body (FormData):');
    for (let [key, value] of formData.entries()) {
      if (value instanceof Blob) {
        console.log(`  ${key}:`, value instanceof File ? `File(${value.name}, ${value.size} bytes, ${value.type})` : `Blob(${value.size} bytes)`);
      } else {
        console.log(`  ${key}:`, value);
      }
    }

    // venueRegisterRequest JSON 내용 출력
    console.log('venueRegisterRequest:', JSON.stringify(venueRegisterRequest, null, 2));
    console.log('locationPicture:', uploadedImage ? `File: ${uploadedImage.name}` : 'null');

    try {
      // 세션 기반 로그인: 쿠키로 인증
      const response = await fetch(`${import.meta.env.VITE_API_URL}/manager/venue/register`, {
        method: 'POST',
        credentials: 'include', // 세션 쿠키 자동 전송
        body: formData,
      });

      console.log('Response Status:', response.status);
      console.log('Response Content-Type:', response.headers.get('content-type'));

      // 응답이 JSON인지 확인
      const contentType = response.headers.get('content-type');
      let result;

      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        // JSON이 아닌 경우 텍스트로 읽기
        const text = await response.text();
        console.log('Response Text:', text);
        result = { success: response.ok, message: text };
      }

      console.log('Parsed Result:', result);

      if (response.ok) {
        // 백엔드에서 내려준 location_id 추출
        const locationId = result?.data?.location_id;

        console.log('등록된 공연장 location_id:', locationId);

        if (!locationId) {
          console.warn('location_id가 응답에 없습니다. 이후 단계에서 문제가 될 수 있습니다.');
        }

        // localStorage에 저장 (2,3단계에서 필요할 수 있음)
        const venueData = {
          venueName,
          address,
          detailAddress,
          isStanding,
          standingCapacity,
          isSeat,
          floorCount,
          seatCount,
          locationId,
        };
        localStorage.setItem('registerVenue1', JSON.stringify(venueData));

        // locationId를 따로도 저장 (다른 페이지에서 바로 사용할 수 있도록)
        if (locationId) {
          localStorage.setItem('locationId', String(locationId));
        }

        addToast('공연장이 등록되었습니다!', 'success');

        // 스탠딩석만 선택한 경우 홈으로, 좌석이 있는 경우 2단계로
        if (isStanding && !isSeat) {
          setTimeout(() => navigate('/homemanager'), 1000);
        } else {
          setTimeout(() => navigate('/register-venue/step2'), 1000);
        }
      } else {
        console.error('API 에러 응답:', result);
        addToast(result.message || '공연장 등록에 실패했습니다.', 'error');
      }
    } catch (error) {
      console.error('API 요청 오류:', error);
      addToast('서버와의 통신 중 오류가 발생했습니다.', 'error');
    }
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
          {/* 제목과 진행 단계 */}
          <HeaderRow>
            <Title>내 공연장 등록하기</Title>
            <ProgressSteps>
              <StepItem $active={true}>① 공연장 기본 정보 입력</StepItem>
              <ArrowIcon />
              <StepItem $active={false} disabled>② 좌석배치표 업로드 및 수정</StepItem>
              <ArrowIcon />
              <StepItem $active={false} disabled>③ 좌석 라벨링</StepItem>
            </ProgressSteps>
          </HeaderRow>

          {/* 컨텐츠 영역 */}
          <ContentArea>
            {/* 좌석표 업로드 */}
            <UploadSection>
              <UploadBox onClick={() => document.getElementById('fileInput').click()}>
                {imagePreview ? (
                  <UploadedImage src={imagePreview} alt="업로드된 좌석표" />
                ) : (
                  <>
                    <BsUpload size={32} />
                    <UploadText>공연장 좌석표 사진 업로드하기</UploadText>
                  </>
                )}
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
                <CheckboxContainer onClick={() => {
                  if (!isStanding && isSeat) {
                    setIsSeat(false);
                  }
                  setIsStanding(!isStanding);
                }}>
                  {isStanding ? <CheckboxIconSelected /> : <CheckboxIcon />}
                  <Label>스탠딩석</Label>
                </CheckboxContainer>
                {/* <SubFieldGroup>
                  <SubLabel>허용 인원</SubLabel>
                  <SmallInput
                    type="number"
                    value={standingCapacity}
                    onChange={(e) => setStandingCapacity(e.target.value)}
                    disabled={!isStanding}
                    placeholder="0"
                    min="1"
                  />
                  <Unit>명</Unit>
                </SubFieldGroup> */}
              </FormField>

              {/* 좌석 */}
              <FormField>
                <CheckboxContainer onClick={() => {
                  if (!isSeat && isStanding) {
                    setIsStanding(false);
                  }
                  setIsSeat(!isSeat);
                }}>
                  {isSeat ? <CheckboxIconSelected /> : <CheckboxIcon />}
                  <Label>좌석</Label>
                </CheckboxContainer>
                <SubFieldGroup>
                  <SubLabel>층 수</SubLabel>
                  <SmallInput
                    type="number"
                    value={floorCount}
                    onChange={(e) => setFloorCount(e.target.value)}
                    disabled={!isSeat}
                    placeholder="0"
                    min="1"
                  />
                  <Unit>층</Unit>
                </SubFieldGroup>
                {/* <SubFieldGroup>
                  <SubLabel>좌석 수</SubLabel>
                  <SmallInput
                    type="number"
                    value={seatCount}
                    onChange={(e) => setSeatCount(e.target.value)}
                    disabled={!isSeat}
                    placeholder="0"
                    min="1"
                  />
                  <Unit>석</Unit>
                </SubFieldGroup> */}
              </FormField>
            </FormSection>
          </ContentArea>
        </MainContent>

        {/* 하단 버튼 */}
        <Footer>
          <PrevButton onClick={handlePrevious}>←이전</PrevButton>
          <NextButton onClick={handleNext}>다음→</NextButton>
        </Footer>

        {/* 주소 검색 모달 */}
        {isPostcodeOpen && (
          <PostcodeModal onClick={() => setIsPostcodeOpen(false)}>
            <PostcodeContainer onClick={(e) => e.stopPropagation()}>
              <PostcodeHeader>
                <PostcodeTitle>주소 검색</PostcodeTitle>
                <CloseButton onClick={() => setIsPostcodeOpen(false)}>✕</CloseButton>
              </PostcodeHeader>
              <DaumPostcode onComplete={handleComplete} autoClose={false} />
            </PostcodeContainer>
          </PostcodeModal>
        )}
      </Container>
    </>
  );
};

export default RegisterVenue1;

// Styled Components
const Container = styled.div`
  width: 100%;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 20px 100px 0px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  border-bottom: 1px solid #c5c5c5;
  padding-bottom: 0;

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

const Title = styled.h1`
  font-size: 30px;
  font-weight: 500;
  color: #333;
  margin: 0;
  padding: 10px 0;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const ProgressSteps = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  padding-bottom: 0;
  flex-wrap: nowrap;

  @media (max-width: 768px) {
    gap: 2px;
  }
`;

const StepItem = styled.div`
  font-weight: 500;
  font-size: 20px;
  padding: 10px;
  color: ${(props) => (props.$active ? '#FC2847' : '#737373')};
  border-bottom: ${(props) => (props.$active ? '2px solid #FC2847' : 'none')};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};
`;

const ArrowIcon = styled(RiArrowRightSLine)`
  width: 32px;
  height: 32px;
  color: #737373;
`;

const ContentArea = styled.div`
  padding: 20px 0;
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
  overflow: hidden;
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.2);
  }

  svg {
    color: #000000;
  }
`;

const UploadedImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
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

// 주소 검색 모달
const PostcodeModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const PostcodeContainer = styled.div`
  background: white;
  border-radius: 20px;
  padding: 20px;
  width: 500px;
  max-width: 90vw;
  box-shadow: 0px 0px 20px 2px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const PostcodeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PostcodeTitle = styled.h2`
  font-size: 20px;
  font-weight: 500;
  color: #000000;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #000000;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.7;
  }
`;
