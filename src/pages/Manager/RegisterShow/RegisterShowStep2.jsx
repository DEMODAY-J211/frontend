import React from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../../components/Toast/useToast";
import { useState, useEffect } from "react";

const RegisterShowStep2 = ({ viewer = false }) => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { showId } = useParams();

  // 미리보기 URL 저장
  const [images, setImages] = useState([]); // 실제 파일 리스트
  const [previews, setPreviews] = useState([]); // 미리보기 URL 리스트
  const [uploadedUrls, setUploadedUrls] = useState([]); // S3 URL

  useEffect(() => {
    console.log("new", images);
  }, [images]);
  useEffect(() => {
    console.log("previe", previews);
  }, [previews]);
  useEffect(() => {
    console.log("uploadedUrls", uploadedUrls);
  }, [uploadedUrls]);
  const [tempText, setTempText] = useState("");

  // -------------------------
  // 로컬 스토리지 유틸 (step 방식)
  // -------------------------

  const STEPS_KEY = "createShowPayload_steps";

  /**
   * stepName (string) 으로 부분 payload 저장.
   * 예: saveStep("step_images", { detailImages: [...] })
   */
  const saveStep = (stepName, data) => {
    const all = JSON.parse(localStorage.getItem(STEPS_KEY)) || {};
    all[stepName] = {
      ...(all[stepName] || {}),
      ...data,
    };
    localStorage.setItem(STEPS_KEY, JSON.stringify(all));
  };

  /**
   * 모든 step을 병합한 최종 payload 생성
   * step 저장 순서에 의존하지 않게 객체들을 순서대로 병합 (Object.assign)
   */
  const getMergedPayloadFromSteps = () => {
    const all = JSON.parse(localStorage.getItem(STEPS_KEY)) || {};
    const merged = Object.assign(
      {},
      ...Object.keys(all).map((k) => all[k] || {})
    );
    return merged;
  };

  /**
   * 특정 step을 제거하고 싶을 때 사용 (선택적)
   */
  const removeStep = (stepName) => {
    const all = JSON.parse(localStorage.getItem(STEPS_KEY)) || {};
    delete all[stepName];
    localStorage.setItem(STEPS_KEY, JSON.stringify(all));
  };

  // -------------------------
  // fetchImages (수정된 버전) - 업로드 결과를 step_images에 저장
  // -------------------------
  const fetchImages = async () => {
    if (!images || images.length === 0) return [];

    try {
      const formData = new FormData();
      images.forEach((file) => {
        formData.append("images", file);
      });

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
        console.error("이미지 업로드 실패:", result);
        alert(result.message || "이미지 업로드 중 오류");
        return [];
      }

      console.log("이미지 업로드 성공:", result);

      // 업로드된 최신 S3 URL 배열
      const uploaded = result.data ?? [];

      // // 기존 step_images (있으면) 가져오기
      // const currentSteps = JSON.parse(localStorage.getItem(STEPS_KEY)) || {};
      // const prevImagesInStep =
      //   (currentSteps.step_images && currentSteps.step_images.detailImages) ||
      //   [];

      // // 화면(프리뷰)에 보이는 S3 URL (이미 화면에서 유지되는 것) + 상태(uploadedUrls) + 이번 업로드
      // const existingVisibleS3 = previews.filter((p) =>
      //   p.startsWith("https://")
      // );
      // const merged = Array.from(
      //   new Set([
      //     ...prevImagesInStep,
      //     ...existingVisibleS3,
      //     ...uploaded,
      //     ...uploadedUrls,
      //   ])
      // );

      // // step 단위로 저장 (여기서는 "step_images")
      // saveStep("step_images", { detailImages: merged });

      // 로컬 상태 갱신
      // setUploadedUrls((prev) => Array.from(new Set([...uploaded])));
      // setImages([]); // 업로드 끝난 이미지 클리어

      // 업로드된 URL 반환

      setImages(uploaded);
      return uploaded;
    } catch (error) {
      console.error("이미지 업로드 오류:", error);
      addToast("이미지 업로드 실패", "error");
      return [];
    }
  };

  // -------------------------
  // handleTempSave (step 기반으로 수정)
  // -------------------------
  const handleTempSave = async () => {
    try {
      // 1) 새로 업로드한 이미지 URL 받기 (fetchImages 내부에서 step_images에 저장됨)
      const newlyUploaded = await fetchImages(); // ex: ["s3/new1.jpg"]
      console.log("newlyuploaded", newlyUploaded);

      // 2) Payload 생성
      const payload = {
        detailImages: newlyUploaded,
        detailText: tempText,
        status: "DRAFT",
      };

      // 호환을 위해 (기존 코드가 여전히 createShowPayload 사용하면) 기존 키도 업데이트
      localStorage.setItem("register-show-step2", JSON.stringify(payload));

      // 7) 서버로 PATCH 요청 (기존 로직 유지)
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
      if (response.ok) {
        console.log("임시 저장 성공:", result);
        addToast("임시 저장되었습니다!", "success");
      } else {
        console.error("임시 저장 실패:", result);
        alert(result.message || "등록 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("API 요청 실패:", error);
      alert("서버 연결 실패");
    }
  };

  const uploadBoxCount = images.length < 5 ? Math.max(images.length + 1, 3) : 5;

  const getBasePayload = () => ({
    detailImages: [],
    detailText: "",
    status: "DRAFT",
  });

  const [formData, setFormData] = useState(getBasePayload);

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

  const handleDelete = (index, e) => {
    e.stopPropagation();

    const removed = previews[index];

    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);

    setImages(newImages);
    setPreviews(newPreviews);

    // 3) 🔥 localStorage detailImages도 덮어쓰기!
    const prevPayload =
      JSON.parse(localStorage.getItem("register-show-step2")) || {};

    const updatedPayload = {
      ...prevPayload,
      detailImages: newImages,
    };

    localStorage.setItem("register-show-step2", JSON.stringify(updatedPayload));

    addToast("이미지가 삭제되었습니다.", "success");
  };

  // 이전 단계로
  const handlePrevious = () => {
    // TODO: 2단계 페이지로 이동
    navigate(`/register-show/${showId}/step1`);
  };

  // 다음 단계로
  // const handleNext = () => {

  //   navigate(`/register-show/${showId}/step3`);
  // };
  const handleNext = () => {
    // 1) 최신 입력값으로 payload 생성
    const newPayload = createpayload();

    // 2) 저장해둔 preview 데이터 불러오기
    const storedPreview = JSON.parse(
      localStorage.getItem("previewImages") || "[]"
    );

    // 3) 기존 createShowPayload 불러오기 (있으면 병합)
    const savedPayload = JSON.parse(
      localStorage.getItem("register-show-step2") || "{}"
    );

    // 4) payload 병합 (새 값이 우선)
    const mergedPayload = {
      ...savedPayload,
      ...newPayload,
      detailImages: storedPreview.detailImages || [],
    };

    // 5) 로컬 저장
    localStorage.setItem("register-show-step2", JSON.stringify(mergedPayload));

    console.log("merged payload saved:", mergedPayload);

    navigate(`/register-show/${showId}/step3`);
  };

  // 기존 임시 저장 데이터 불러오기
  useEffect(() => {
    // const saved = JSON.parse(localStorage.getItem("registerShowStep2"));
    // if (saved?.poster) {
    //   setPoster(saved.poster);
    // }
    const savedData = JSON.parse(localStorage.getItem("register-show-step2"));
    if (savedData) {
      setPreviews(savedData.detailImages);
      setUploadedUrls(savedData.detailImages);
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
            <Input
              placeholder="제 00회 정기공연입니다! ..."
              value={tempText}
              onChange={(e) => setTempText(e.target.value)}
            />
          </DownContent>
        </MainContent>

        {/* 하단 버튼 */}
        {!viewer && (
          <Footer>
            <PrevButton onClick={handlePrevious}>←이전</PrevButton>
            <RightButtonGroup>
              <TempSaveButton onClick={handleTempSave}>임시저장</TempSaveButton>
              <NextButton onClick={handleNext}>다음→</NextButton>
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
