import React from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../../components/Toast/useToast";
import { useState, useEffect } from "react";

const RegisterShowStep2 = ({ viewer = false, editor = false , initialData,  onUpdateFormData = () => {} }) => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { showId } = useParams();

  // 미리보기 URL 저장
  const [images, setImages] = useState([]); // 실제 파일 리스트
  const [previews, setPreviews] = useState([]); // 미리보기 URL 리스트
  const [uploadedUrls, setUploadedUrls] = useState([]); // S3 URL
  

  

// 초기 데이터 로드 및 localStorage 병합
  useEffect(() => {
    const loadInitialData = () => {
      if (initialData) {
        if (initialData.detailText) setTempText(initialData.detailText);
      } else {
        const savedData = JSON.parse(localStorage.getItem("createShowPayload")) || {};
        if (savedData.detailText) setTempText(savedData.detailText);
      }
    };

    loadInitialData();
  }, [initialData]);

 


  useEffect(() => {
    
    console.log("new", images);
  }, [images]);
  useEffect(() => {
    console.log("preview", previews);
  }, [previews]);
  useEffect(() => {
    console.log("uploadedUrls", uploadedUrls);
  }, [uploadedUrls]);
  const [tempText, setTempText] = useState("");

  // -------------------------
  // 로컬 스토리지 유틸 (step 방식)
  // -------------------------

  // -------------------------
  // handleTempSave (step 기반으로 수정)
  // -------------------------
  const handleTempSave = async () => {
    const payload = JSON.parse(localStorage.getItem("createShowPayload")) || {};

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/manager/shows/${showId}/draft`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          credentials: "include",
        }
      );

      const result = await response.json();
      if (!response.ok) {
        addToast(result.message || "임시저장 실패", "error");
        return;
      }
      console.log(result);
      addToast("변경사항 저장 완료", "success");
    } catch (error) {
      console.error("임시저장 오류:", error);
      addToast("임시저장 중 오류 발생", "error");
    }
  };

  const uploadBoxCount = images.length < 5 ? Math.max(images.length + 1, 3) : 5;

  const getBasePayload = () => ({
    detailImages: [],
    detailText: "",
    status: "DRAFT",
  });

  const [formData, setFormData] = useState(getBasePayload);

  const handleFileChange = async (e, idx) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 5) {
      addToast("이미지는 최대 5장까지 업로드 가능합니다.", "error");
      return;
    }

    setImages((prevImages) => {
      const newImages = [...prevImages, ...files];
      onUpdateFormData({ detailImages: newImages });
      return newImages;
    });

    // 백엔드 업로드 API용 FormData 준비
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    console.log(import.meta.env.VITE_API_URL, showId);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/shows/${showId}/images`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error("업로드 실패:", result);
        addToast("이미지 업로드 실패", "error");
        return;
      }

      console.log("ddd", result);
      // S3 URL 목록
      const uploadedUrls = result.data ?? [];

      // 상태 반영
      setImages((prev) => [...prev, ...uploadedUrls]);
      setPreviews((prev) => [...prev, ...uploadedUrls]);

      // localStorage에도 반영
      const prevPayload =
        JSON.parse(localStorage.getItem("createShowPayload")) || {};

      const updatedPayload = {
        ...prevPayload,
        detailImages: [...(prevPayload.detailImages || []), ...uploadedUrls],
      };

      localStorage.setItem("createShowPayload", JSON.stringify(updatedPayload));
    } catch (err) {
      console.error("이미지 업로드 오류", err);
      addToast("이미지 업로드 중 오류 발생", "error");
    }
  };

  const handleDelete = (index, e) => {
    e.stopPropagation();
    e.preventDefault();
    const removedUrl = images[index];

    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);

    setImages(newImages);
    setPreviews(newPreviews);

    // localStorage 갱신
    const prevPayload =
      JSON.parse(localStorage.getItem("createShowPayload")) || {};

    const updatedPayload = {
      ...prevPayload,
      detailImages: newImages, // 이미지 배열 자체가 S3 URL 배열
    };

    localStorage.setItem("createShowPayload", JSON.stringify(updatedPayload));

    addToast("이미지가 삭제되었습니다.", "success");
  };

  // 이전 단계로
  const handlePrevious = () => {
    // TODO: 2단계 페이지로 이동
    navigate(`/register-show/${showId}/step1`);
  };
  const handleNext = () => {
    // 1) 최신 입력값으로 payload 생성
    const payload = JSON.parse(localStorage.getItem("createShowPayload")) || {};

    console.log("createshowpayload ~", payload);
    navigate(`/register-show/${showId}/step3`);
  };
  const handleSaveAndNext = async () => {
  try {
    // 1️⃣ 임시 저장 먼저
    await handleTempSave(); // handleTempSave가 async라면 await 사용

    // 2️⃣ 임시 저장 완료 후 다음 단계
    handleNext();
  } catch (error) {
    console.error("임시 저장 중 오류:", error);
    // 필요 시 사용자에게 알림
  }
};

  const handleText = (e) => {
    const value = e.target.value;
    setTempText(value); // 화면 상태 업데이트

    // 부모 컴포넌트로 전달
    if (onUpdateFormData) onUpdateFormData({ detailText: value });

    // localStorage 업데이트
    const prevPayload =
      JSON.parse(localStorage.getItem("createShowPayload")) || {};

    const updatedPayload = {
      ...prevPayload,
      detailText: value,
    };

    localStorage.setItem("createShowPayload", JSON.stringify(updatedPayload));
  };

  // 미리보기 업데이트 함수 (editor에서 호출 가능)
const updatePreviews = (newImages) => {
  setPreviews(newImages);
};
useEffect(() => {
  if (initialData && initialData.detailImages) {
    // 초기 데이터에서 detailImages가 있다면 미리보기 리스트에 반영
    updatePreviews(initialData.detailImages);
  } else {
    const savedData = JSON.parse(localStorage.getItem("createShowPayload")) || {};
    if (savedData.detailImages) {
      updatePreviews(savedData.detailImages);
    }
  }
}, [initialData]);

  // 기존 임시 저장 데이터 불러오기
  useEffect(() => {
    // const saved = JSON.parse(localStorage.getItem("registerShowStep2"));
    // if (saved?.poster) {
    //   setPoster(saved.poster);
    // }
    const savedData = JSON.parse(localStorage.getItem("createShowPayload"));
    if (savedData && savedData.detailText) {
      setTempText(savedData.detailText);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("createShowPayload");
    if (!saved) return;

    const parsed = JSON.parse(saved);

    // formData에 저장된 값 병합
    setFormData((prev) => ({
      ...prev,
      ...parsed,
    }));

    // UI용 값도 채우고 싶다면 여기서 setState들 호출
    if (parsed.detailText) setTempText(parsed.detailText);
    if (parsed.detailImages) setPreviews(parsed.detailImages);
  }, []);

  return (
    <>
      {/* <NavbarManager /> */}
      <Container>
        <MainContent>
          {/* <RegisterShowNavbar currentStep={2} /> */}

          
            {/* viewer 모드일 때는 업로드와 삭제 버튼을 아예 보이지 않도록 */}
{!viewer && !editor && (
  <UpperContent>
    <Name>공연 상세이미지</Name>
    <UploadBoxWrapper>
      {Array.from({ length: uploadBoxCount }).map((_, idx) => (
        <UploadBox
          key={idx}
          onClick={() => !editor && document.getElementById(`upload-${idx}`).click()} // editor일 때 클릭 비활성화
          style={{
            cursor: editor ? 'not-allowed' : 'pointer', // editor일 때 마우스 커서 비활성화
          }}
        >
          {idx < previews.length ? (
            <UploadBoxContent>
              <img src={previews[idx]} alt={`preview-${idx}`} />
              {!editor && (
                <HoverOverlay 
                  onClick={(e) => editor ? e.preventDefault() : handleDelete(idx, e)} // editor일 때 삭제 비활성화
                >
                  삭제
                </HoverOverlay>
              )}
            </UploadBoxContent>
          ) : idx === previews.length && images.length < 5 ? (
            <PlusIcon>+</PlusIcon>
          ) : (
            <EmptySlot>이미지 업로드</EmptySlot>
          )}

          {/* Upload box를 클릭할 수 없는 상태로 만들기 */}
          <HiddenInput
            id={`upload-${idx}`}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => !editor && handleFileChange(e, idx)} // editor일 때 파일 업로드 방지
            disabled={editor} // editor일 때 input 비활성화
          />
        </UploadBox>
      ))}
    </UploadBoxWrapper>

    {/* 아래의 HiddenInput은 항상 보이되, editor일 때만 클릭이 가능 */}
    <HiddenInput
      id="posterUpload"
      type="file"
      accept="image/*"
      onChange={handleFileChange}
      disabled={editor} // editor일 때 input 비활성화
    />
  </UpperContent>
)}

{/* viewer 모드일 때는 업로드와 삭제 버튼을 아예 렌더링하지 않음 */}
{viewer || editor && (
  <UpperContent>
    <Name>공연 상세이미지</Name>
    <UploadBoxWrapper>
      {previews.length > 0 ? (
        previews.map((preview, idx) => (
          <UploadBox key={idx}>
            <UploadBoxContent>
              <img src={preview} alt={`preview-${idx}`} />
            </UploadBoxContent>
          </UploadBox>
        ))
      ) : (
        <EmptySlot>이미지가 없습니다</EmptySlot>
      )}
    </UploadBoxWrapper>
  </UpperContent>
)}


            

          <DownContent>
            <Name>공연 상세 정보
              <p>*</p>
            </Name>
            <Input
              placeholder={!viewer ? "제 00회 정기공연입니다! ..." : "입력이 필수인 항목입니다."}
              value={tempText}
              onChange={handleText}
            />
          </DownContent>
        </MainContent>

        {/* 하단 버튼 */}
        {!viewer && !editor && (
          <Footer>
            <PrevButton onClick={handlePrevious}>←이전</PrevButton>
            <RightButtonGroup>
              <TempSaveButton onClick={handleTempSave}>임시저장</TempSaveButton>
              <NextButton onClick={handleSaveAndNext}>다음→</NextButton>
            </RightButtonGroup>
          </Footer>
        )}
    
      </Container>
    </>
  );
};

export default RegisterShowStep2;

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  background: #ffffff;
  display: flex;
  flex-direction: column;
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
  gap: 3px;

    p{
    font-size: 18px;
    font-weight: 300;
    color: var(--color-primary);
  }
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
