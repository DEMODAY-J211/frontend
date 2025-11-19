import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../components/Toast/useToast";
import { useState, useEffect } from "react";
import NavbarManager from "../../../components/Navbar/NavbarManager";
import RegisterShowNavbar from "./RegisterShowNavbar";
import { BsUpload } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";

const RegisterShowStep2 = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  // 미리보기 URL 저장
  const [images, setImages] = useState([]); // 실제 파일 리스트
  const [previews, setPreviews] = useState([]); // 미리보기 URL 리스트

  const handleDelete = (index, e) => {
    e.stopPropagation(); // 클릭 이벤트 전파 방지
    const newImages = [...images];
    const newPreviews = [...previews];

    newImages.splice(index, 1);
    newPreviews.splice(index, 1);

    setImages(newImages);
    setPreviews(newPreviews);

    addToast("이미지가 삭제되었습니다.", "success");
  };

  const uploadBoxCount = images.length < 5 ? Math.max(images.length + 1, 3) : 5;

  const handleTempSave = () => {
    const formData = { previews };
    localStorage.setItem("registerShowStep2", JSON.stringify(formData));
    addToast("임시 저장되었습니다!", "success");
  };

  // 파일 업로드 핸들러
  const handleFileChange = (e, index) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 5) {
      addToast("이미지는 최대 5장까지 업로드 가능합니다.", "error");
      return;
    }

    const newImages = [...images];
    const newPreviews = [...previews];

    files.forEach((file) => {
      newImages.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });

    setImages(newImages);
    setPreviews(newPreviews);
  };

  // 이전 단계로
  const handlePrevious = () => {
    // TODO: 2단계 페이지로 이동
    navigate("/register-show/step1");
  };

  // 다음 단계로
  const handleNext = () => {
    navigate("/register-show/step3");
  };

  // 기존 임시 저장 데이터 불러오기
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("registerShowStep2"));
    if (saved?.previews) {
      setPreviews(saved.previews);
    }
  }, []);

  return (
    <>
      <NavbarManager />
      <Container>
        <MainContent>
          <RegisterShowNavbar currentStep={2} />

          <UpperContent>
            <Name>공연 상세이미지(선택)</Name>
            <UploadBoxWrapper>
              {Array.from({ length: uploadBoxCount }).map((_, idx) => (
                <UploadBox
                  key={idx}
                  onClick={() =>
                    document.getElementById(`upload-${idx}`).click()
                  }
                >
                  {idx < previews.length ? (
                    <UploadBoxContent>
                      <img src={previews[idx]} alt={`preview-${idx}`} />
                      <HoverOverlay onClick={(e) => handleDelete(idx, e)}>
                        삭제
                      </HoverOverlay>
                    </UploadBoxContent>
                  ) : idx === previews.length && images.length < 5 ? (
                    <PlusIcon>+</PlusIcon>
                  ) : (
                    <EmptySlot>이미지 업로드</EmptySlot>
                  )}

                  <HiddenInput
                    id={`upload-${idx}`}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileChange(e, idx)}
                  />
                </UploadBox>
              ))}
            </UploadBoxWrapper>

            <HiddenInput
              id="posterUpload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </UpperContent>

          <DownContent>
            <Name>공연 상세 정보</Name>
            <Input placeholder="제 00회 정기공연입니다! ..." />
          </DownContent>
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
  );
};

export default RegisterShowStep2;

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

const UpperContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const Name = styled.div`
  font-size: 25px;
  font-weight: 500;
  display: flex;
  gap: 20px;
`;

const UploadBoxWrapper = styled.div`
  display: flex;
  gap: 20px;
`;

const UploadBox = styled.div`
  width: 200px;
  height: 200px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 0 5.5px 1px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PlusIcon = styled.div`
  font-size: 70px;
  color: #ccc;
  font-weight: 200;
`;

const EmptySlot = styled.div`
  color: #aaa;
  font-size: 18px;
`;

const HiddenInput = styled.input`
  display: none;
`;

const HoverOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 500;
  cursor: pointer;
  transition: 0.25s ease;
`;

const UploadBoxContent = styled.div`
  width: 100%;
  height: 100%;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  &:hover ${HoverOverlay} {
    opacity: 1;
  }
`;

const DownContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const Input = styled.textarea`
  width: 1240px;
  height: 280px;
  padding: 10px 20px;
  border-radius: 16px;
  border: 1px solid #c5c5c5;
  background: #fff;
  font-size: 16px;
  resize: none; // 사용자가 크기 조절 못하게
`;
