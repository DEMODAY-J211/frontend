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

  const [tempText, setTempText] = useState("");
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

  useEffect(() => {
    console.log("new", images);
  }, [images]);
  useEffect(() => {
    console.log("previe", previews);
  }, [previews]);

  const uploadBoxCount = images.length < 5 ? Math.max(images.length + 1, 3) : 5;

  // const fetchImages = async () => {
  //   const newUrls = [];
  //   for (const file of images) {
  //     const formData = new FormData();
  //     formData.append("image", file);

  //     const response = await fetch(
  //       `${import.meta.env.VITE_API_URL}/shows/${showId}/images`,
  //       {
  //         method: "POST",
  //         body: formData,
  //         credentials: "include",
  //       }
  //     );
  //     const data = await response.json();
  //     newUrls.push(data.data);
  //   }

  //   // 업로드 완료한 파일은 images에서 제거
  //   setUploadedUrls((prev) => [...prev, ...newUrls]);
  //   setImages([]); // 이미 업로드 완료했으므로 초기화

  //   return [...uploadedUrls, ...newUrls]; // 최종 S3 URL 배열 반환
  // };

  const fetchImages = async () => {
    if (!images || images.length === 0) return [];
    const newUrls = [];

    try {
      const formData = new FormData();

      // 여러 파일을 "files" 라는 key로 담는다고 가정 (백엔드가 요구하는 key와 동일해야 함)
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
      // 업로드 완료한 파일은 images에서 제거
      setUploadedUrls((prev) => [...prev, ...result.data]);
      setImages([]); // 이미 업로드 완료했으므로 초기화

      return [...uploadedUrls, ...newUrls]; // 최종 S3 URL 배열 반환
    } catch (error) {
      console.error("이미지 업로드 오류:", error);
      addToast("이미지 업로드 실패", "error");
      return [];
    }
  };

  // const fetchImages = async () => {
  //   if (!images || images.length === 0) return [];

  //   try {
  //     const formData = new FormData();

  //     // 여러 파일을 "files" 라는 key로 담는다고 가정 (백엔드가 요구하는 key와 동일해야 함)
  //     images.forEach((file) => {
  //       formData.append("images", file);
  //     });

  //     const response = await fetch(
  //       `${import.meta.env.VITE_API_URL}/shows/${showId}/images`,
  //       {
  //         method: "POST",
  //         body: formData,
  //         credentials: "include",
  //       }
  //     );

  //     const result = await response.json();

  //     if (!response.ok) {
  //       console.error("이미지 업로드 실패:", result);
  //       alert(result.message || "이미지 업로드 중 오류");
  //       return [];
  //     }

  //     console.log("이미지 업로드 성공:", result);
  //     setImages(result.data);
  //     // 백엔드에서 이미지 URL 목록이 result.urls 형태라고 가정
  //     return result.data || [];
  //   } catch (error) {
  //     console.error("이미지 업로드 오류:", error);
  //     addToast("이미지 업로드 실패", "error");
  //     return [];
  //   }
  // };
  // (A) 기본 Payload 초기 구조
  const getBasePayload = () => ({
    title: "",
    poster: "",
    showTimes: [],
    bookStart: "",
    bookEnd: "",
    ticketOptions: [],
    bankMaster: "",
    bankName: "",
    bankAccount: "",
    detailImages: [],
    detailText: "",
    locationId: null,
    locationName: "",
    SaleMethod: "SCHEDULING",
    seatCount: 0,
    showMessage: {
      payGuide: "",
      bookConfirm: "",
      showGuide: "",
      reviewRequest: "",
      reviewUrl: "",
    },
    status: "DRAFT",
  });

  // (B) 공용 createPayload 함수 (Step1~5 공통 사용)
  const createPayload = (currentPayload) => {
    // 1) 기본값
    const base = getBasePayload();

    // 2) 기존 저장된 값
    const saved = JSON.parse(localStorage.getItem("createShowPayload") || "{}");

    // 3) 중첩 병합(showMessage 안전하게 처리)
    const merged = {
      ...base,
      ...saved,
      ...currentPayload, // 이번 스텝 값이 최종 우선
      showMessage: {
        ...base.showMessage,
        ...(saved.showMessage || {}),
        ...(currentPayload.showMessage || {}),
      },
    };

    return merged;
  };

  const handleTempSave = async () => {
    // const formData = { previews };
    // localStorage.setItem("createShowPayload", JSON.stringify(formData));
    try {
      const updatedImages = await fetchImages();
      console.log("updatedimages", updatedImages);
      const currentPayload = {
        detailImages: updatedImages ?? previews,
        detailText: tempText,
      };

      const finalPayload = createPayload(currentPayload);
      console.log(finalPayload);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/manager/shows/${showId}/draft`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(finalPayload),
          credentials: "include",
        }
      );

      const result = await response.json();
      if (response.ok) {
        console.log("등록 성공:", result);
        localStorage.setItem("createShowPayload", JSON.stringify(finalPayload));
        addToast("임시 저장되었습니다!", "success");
      } else {
        console.error("등록 실패:", result);
        alert(result.message || "등록 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("API 요청 실패:", error);
      alert("서버 연결 실패");
    }
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
      localStorage.getItem("createShowPayload") || "{}"
    );

    // 4) payload 병합 (새 값이 우선)
    const mergedPayload = {
      ...savedPayload,
      ...newPayload,
      detailImages:
        storedPreview.length > 0
          ? storedPreview
          : savedPayload.detailImages || [],
    };

    // 5) 로컬 저장
    localStorage.setItem("createShowPayload", JSON.stringify(mergedPayload));

    console.log("merged payload saved:", mergedPayload);

    navigate(`/register-show/${showId}/step3`);
  };

  // 기존 임시 저장 데이터 불러오기
  useEffect(() => {
    // const saved = JSON.parse(localStorage.getItem("registerShowStep2"));
    // if (saved?.poster) {
    //   setPoster(saved.poster);
    // }
    const savedData = JSON.parse(localStorage.getItem("createShowPayload"));
    if (savedData?.poster) {
      // setPoster(savedData.poster);
      // setPosterFile(savedData.poster);
      // setPoster(savedData.detailImages);
      setTempText(savedData.detailText);
    }
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
