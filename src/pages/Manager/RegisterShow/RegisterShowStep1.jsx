import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../../components/Toast/useToast";
import { useState, useEffect } from "react";
import { BsUpload } from "react-icons/bs";
import { AiOutlineCalendar } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";
import { useOutletContext } from "react-router-dom";

const bankOptions = [
  { id: 1, name: "국민은행", code: "KB" },
  { id: 2, name: "기업은행", code: "IBK" },
  { id: 3, name: "농협은행", code: "NH" },
  { id: 4, name: "신한은행", code: "SHINHAN" },
  { id: 5, name: "하나은행", code: "HANA" },
  { id: 6, name: "우리은행", code: "WOORI" },
  { id: 7, name: "우체국", code: "EPOST" },
  { id: 8, name: "카카오뱅크", code: "KAKAO" },
  { id: 9, name: "토스뱅크", code: "TOSS" },
];

const RegisterShowStep1 = ({ viewer = false }) => {
  const { setIsDirty } = useOutletContext();
  const handleAnyInput = () => {
    setIsDirty(true);
  };
  const navigate = useNavigate();
  const { showId } = useParams();
  console.log(showId);
  const { addToast } = useToast();

  // 공연 회차
  const today = () => {
    const now = new Date(); // 로컬 시간 기준
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // 월은 0~11
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // yyyy-mm-dd
  };
  // (A) 기본 Payload 초기 구조
  const getBasePayload = () => ({
    title: "",
    poster: "",
    showTimes: [
      {
        showStart: "",
        showEnd: "",
      },
    ],
    bookStart: "",
    bookEnd: "",
    ticketOptions: [{ name: "", description: "", price: "", amount: 100 }],
    bankMaster: "",
    bankName: "",
    bankAccount: "",
    detailImages: [],
    detailText: "",
    locationId: 3,
    locationName: "메리홀",
    SaleMethod: "SCHEDULING",
    seatCount: 450,
    // locationId: null,
    // locationName: "",
    // SaleMethod: "SELECT_BY_USER",
    // seatCount: 0,
    showMessage: {
      payGuide: "",
      showGuide: "",
      reviewRequest: "",
      reviewUrl: "",
    },
    status: "DRAFT",
  });

  // (B) 공용 createPayload 함수 (Step1~5 공통 사용)
  const createPayload = (currentPayload) => {
    const base = getBasePayload();
    const saved = JSON.parse(localStorage.getItem("createShowPayload") || "{}");
    let merged = deepMergeWithSkipEmpty(base, saved);
    merged = deepMergeWithSkipEmpty(merged, currentPayload); // current가 최종 우선
    return merged;
  };

  // const createPayload = (currentPayload) => {
  //   // 1) 기본값
  //   const base = getBasePayload();

  //   // 2) 기존 저장된 값
  //   const saved = JSON.parse(localStorage.getItem("createShowPayload") || "{}");
  //   let merged = deepMergeWithSkipEmpty(base, saved);
  //   merged = deepMergeWithSkipEmpty(merged, currentPayload); // current가 최종 우선

  //   // 3) 중첩 병합(showMessage 안전하게 처리)
  //   // const merged = {
  //   //   ...base,
  //   //   ...saved,
  //   //   ...currentPayload, // 이번 스텝 값이 최종 우선
  //   //   showMessage: {
  //   //     ...base.showMessage,
  //   //     ...(saved.showMessage || {}),
  //   //     ...(currentPayload.showMessage || {}),
  //   //   },
  //   return merged;
  // };

  // const createPayload = (current) => {
  //   const base = getBasePayload();
  //   const saved = JSON.parse(localStorage.getItem("createShowPayload") || "{}");

  //   let merged = deepMergeWithSkipEmpty(base, saved);
  //   merged = deepMergeWithSkipEmpty(merged, current); // current가 최종 우선

  //   return merged;
  // };

  const [formData, setFormData] = useState(getBasePayload());
  useEffect(() => {
    const saved = localStorage.getItem("createShowPayload");
    if (!saved) return;
    console.log("save", saved);
    try {
      const parsed = JSON.parse(saved);

      setFormData((prev) => ({
        ...prev,
        ...parsed,
      }));

      // UI 전용 state도 필요하면 여기에 채우기
      // 단, formData와 UI 필드 이름이 다르니까 직접 매핑
      if (parsed.bookStart) {
        const [date, time] = parsed.bookStart.split("T");
        setBookStartDate(date);
        setBookStartTime(time?.slice(0, 5) || "00:00");
      }

      if (parsed.showTimes?.length > 0) {
        const converted = parsed.showTimes.map((t) => {
          const [startDate, startTime] = t.showStart.split("T");
          const [endDate, endTime] = t.showEnd.split("T");
          return {
            showStartDate: startDate,
            showStartTime: startTime?.slice(0, 5),
            showEndTime: endTime?.slice(0, 5),
          };
        });

        setShowTimes(converted);
      }
    } catch (e) {
      console.error("JSON parse error:", e);
    }
  }, []);

  const [posterFile, setPosterFile] = useState(null); // 파일
  const [poster, setPoster] = useState(null); // 미리보기 URL

  // 공연명
  const [title, setTitle] = useState("");

  // 공연 날짜/회차
  const [showTimes, setShowTimes] = useState([
    {
      showStartDate: today(), // 기본 오늘 날짜
      showStartTime: "00:00",
      showEndTime: "00:00",
    },
  ]);
  // 예매 시작(bookStart)
  const [bookStartDate, setBookStartDate] = useState(today());
  const [bookStartTime, setBookStartTime] = useState(today());

  // const addShowTime = () => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     showTimes: [
  //       ...prev.showTimes,
  //       {
  //         showStartDate: today(), // 오늘 날짜
  //         showStartTime: "00:00",
  //         showEndTime: "00:00",
  //       },
  //     ],
  //   }));
  // };
  const addShowTime = () => {
    setShowTimes([
      ...showTimes,
      {
        showStartDate: today(),
        showStartTime: "00:00",
        showEndTime: "00:00",
      },
    ]);
  };

  useEffect(() => {
    console.log(showTimes);
  }, [showTimes]);

  const updateShowTime = (index, field, value) => {
    const updated = [...showTimes];
    updated[index][field] = value;
    setShowTimes(updated);
  };

  // const updateShowTime = (index, field, value) => {
  // setFormData((prev) => {
  //   const updated = [...prev.showTimes];
  //   updated[index] = {
  //     ...updated[index],
  //     [field]: value,
  //   };
  //   return {
  //     ...prev,
  //     showTimes: updated,
  //   };
  // });
  // setFormData((prev) => {
  //   const newShowTimes = [...prev.showTimes];
  //   const target = newShowTimes[index];
  //   // 날짜 + 시간 합쳐서 저장
  //   if (field === "showStartDate" || field === "showStartTime") {
  //     const date = field === "showStartDate" ? value : target.showStartDate;
  //     const time = field === "showStartTime" ? value : target.showStartTime;
  //     target.showStartDate = date;
  //     target.showStartTime = time;
  //     if (date && time) target.showStart = `${date}T${time}:00`;
  //   }
  //   if (field === "showEndTime") {
  //     const time = value;
  //     target.showEndTime = time;
  //     if (target.showStartDate)
  //       target.showEnd = `${target.showStartDate}T${time}:00`;
  //   }
  //   return { ...prev, showTimes: newShowTimes };
  // });
  // };

  // const removeShowTime = (index) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     showTimes: prev.showTimes.filter((_, i) => i !== index),
  //   }));
  // };
  const removeShowTime = (index) => {
    setShowTimes(showTimes.filter((_, i) => i !== index));
  };

  // 시간 리스트 (30분 간격)
  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let min = 0; min < 60; min += 30) {
      const h = String(hour).padStart(2, "0");
      const m = String(min).padStart(2, "0");
      timeOptions.push(`${h}:${m}`);
    }
  }

  // 티켓 옵션
  const addTicketOption = () => {
    setFormData((prev) => ({
      ...prev,
      ticketOptions: [
        ...prev.ticketOptions,
        {
          name: "",
          description: "",
          price: "",
          amount: 10,
        },
      ],
    }));
  };
  const updateTicketOption = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.ticketOptions];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return {
        ...prev,
        ticketOptions: updated,
      };
    });
  };

  const removeTicketOption = (index) => {
    setFormData((prev) => ({
      ...prev,
      ticketOptions: prev.ticketOptions.filter((_, i) => i !== index),
    }));
  };

  // 입금 정보

  // 오류
  const [titleError, setTitleError] = useState(false);
  const [showDateError, setShowDateError] = useState(false);
  const [showTimeError, setShowTimeError] = useState(false);
  const [bookStartDateError, setBookStartDateError] = useState(false);
  const [bookStartTimeError, setBookStartTimeError] = useState(false);

  // 포스터 업로드
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    console.log("선택된 파일:", file);
    if (!file) return;

    try {
      // 🔥 파일을 FormData에 담기
      const imgData = new FormData();
      imgData.append("poster", file);

      // ✔ 이미지 미리보기용 Base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setPoster(reader.result);
      };
      reader.readAsDataURL(file);
      console.log("formData", imgData);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/shows/${showId}/poster`,
        {
          method: "POST",
          credentials: "include",
          body: imgData,
        }
      );

      if (!response.ok) {
        throw new Error("파일 업로드 실패");
      }

      const data = await response.json();
      console.log("data", data); // 여기서 null 나왔었다면 이제 정상 출력됨.

      // 백엔드가 반환한 S3 URL을 formData에 저장
      setPosterFile(data.data); // 백엔드 반환 구조에 맞게 사용
      setFormData((prev) => ({ ...prev, poster: data.data }));
    } catch (err) {
      console.error(err);
      alert("이미지 업로드 중 오류가 발생했습니다.");
    }
  };
  useEffect(() => {
    console.log(posterFile);
  }, [posterFile]);
  // const handleFileChange = async (e) => {
  //   const file = e.target.files[0];
  //   setPosterFile(file);  // 선택된 파일 상태 업데이트

  //   if (file) {
  //     // 미리보기 URL 생성
  //     const previewUrl = URL.createObjectURL(file);
  //     setPoster(previewUrl);  // 미리보기 화면에 표시

  //     try {
  //       // FormData 객체 생성하여 파일 추가
  //       const formData = new FormData();
  //       formData.append('image', file);

  //       // 포스터 업로드 API 호출 (showId는 실제 값으로 대체)
  //       const response = await fetch(`${import.meta.env.VITE_API_URL}/shows/${showId}/poster`, {
  //         method: 'POST',
  //         body: formData,
  //       });

  //       const result = await response.json();
  //       if (result.success) {
  //         // 성공적으로 업로드된 포스터의 URL을 반환받음
  //         const uploadedUrl = result.data[0];  // URL을 반환 받은 후
  //         addToast("포스터 업로드 성공", "success");
  //         setPoster(uploadedUrl);  // URL을 상태에 저장
  //       } else {
  //         // 업로드 실패 시 에러 처리
  //         addToast("포스터 업로드 실패", "error");
  //         throw new Error(`HTTP error! Status: ${response.status}`);
  //       }
  //     } catch (error) {
  //       // 네트워크 오류 등 다른 에러 처리
  //       addToast("포스터 업로드 중 오류 발생", "error");
  //       console.error("포스터 업로드 중 오류 발생:", error);

  //     }
  //   }

  // 이전 단계
  const handlePrevious = () => {
    navigate("/homemanager");
  };

  // 검증
  const validateFields = () => {
    let isValid = true;

    if (formData.title.trim() === "") {
      setTitleError(true);
      isValid = false;
    }

    const hasEmptyDate = showTimes.some((t) => t.showStartDate.trim() === "");
    const hasEmptyStart = showTimes.some((t) => t.showStartTime.trim() === "");
    const hasEmptyEnd = showTimes.some((t) => t.showEndTime.trim() === "");

    if (hasEmptyDate) {
      setShowDateError(true);
      isValid = false;
    }
    if (hasEmptyStart || hasEmptyEnd) {
      setShowTimeError(true);
      isValid = false;
    }

    if (bookStartDate.trim() === "") {
      setBookStartDateError(true);
      isValid = false;
    }
    if (bookStartTime.trim() === "") {
      setBookStartTimeError(true);
      isValid = false;
    }

    return isValid;
  };

  // const createpayload = () => {
  //   const savedPayload = JSON.parse(
  //     localStorage.getItem("createShowPayload") || "{}"
  //   );

  //   const formattedShowTimes = showTimes.map((t) => ({
  //     showStart: `${t.showStartDate}T${t.showStartTime}:00`,
  //     showEnd: `${t.showStartDate}T${t.showEndTime || "23:59"}:00`,
  //   }));

  //   const formattedBookStart = `${bookStartDate}T${bookStartTime}:00`;
  //   const lastShowDate = showTimes[showTimes.length - 1].showStartDate;
  //   const formattedBookEnd = `${lastShowDate}T23:59:00`;
  //   // API 호출 전에 bankName을 코드로 변환
  // const basePayload = {
  //   title,
  //   poster: posterFile,
  //   showTimes: formattedShowTimes,
  //   bookStart: formattedBookStart,
  //   bookEnd: formattedBookEnd,
  //   ticketOptions: ticketOptions.map((opt) => ({
  //     name: opt.name,
  //     description: opt.description,
  //     price: Number(opt.price),
  //     amount: Number(opt.amount || 0),
  //   })),
  //   bankMaster,
  //   bankName,
  //   bankAccount,
  //   detailImages: [],
  //   detailText:
  //     "덴마크 왕자 햄릿의 비극을 그린 창작 뮤지컬. 국내 최정상 배우들이 참여하며 10월 단 2주간 공연됩니다.",
  //   locationId: 3,
  //   locationName: "메리홀",
  //   SaleMethod: "SCHEDULING",
  //   seatCount: 450,
  //   showMessage: {
  //     payGuide: "아래 계좌로 입금 부탁드립니다...",
  //     //         bookConfirm: `보낼 메시지: [관람일 D-1 안내]
  //     // {username}, 관람일이 바로 내일이에요!

  //     // 공연명: {show_name}
  //     // 일시: {show_date_time}
  //     // 예매 매수: {예매 매수}
  //     // 관람 장소: {공연장소}

  //     // 안전하고 즐거운 관람을 위해 입장시간에 맞춰 와주세요!`,
  //     showGuide: "공연은 내일 7시에 시작됩니다...",
  //     reviewRequest: "공연은 어떠셨나요?",
  //     reviewUrl: "https://tikittta.com/review/hamlet-2025",
  //   },
  //   status: "DRAFT",
  // };
  //   // ⭐ savedPayload가 있는 경우 basePayload에 덮어쓰기
  //   const finalPayload = {
  //     ...basePayload,
  //     ...savedPayload, // 1차: 최상위 값 덮어쓰기
  //     showMessage: {
  //       ...basePayload.showMessage,
  //       ...(savedPayload.showMessage || {}), // 2차: showMessage 내부 덮어쓰기
  //     },
  //   };

  //   console.log(finalPayload);
  //   return finalPayload;
  // };
  const deepMergeWithSkipEmpty = (base, override) => {
    const result = { ...base };

    for (const key in override) {
      const value = override[key];

      // 빈 값이면 skip
      if (value === "" || value === null || value === undefined) {
        continue;
      }

      // object면 재귀 병합
      if (
        typeof value === "object" &&
        !Array.isArray(value) &&
        value !== null
      ) {
        result[key] = deepMergeWithSkipEmpty(base[key] || {}, value);
      } else {
        // 값이 있는 경우만 덮어쓰기
        result[key] = value;
      }
    }

    return result;
  };

  const handleTempSave = async () => {
    if (!validateFields()) {
      addToast("필수 항목을 입력해주세요!", "error");
      return;
    }
    // 🔥 showTimes 변환 (저장 시에만)
    const formattedShowTimes = showTimes.map((t) => ({
      showStart: `${t.showStartDate}T${t.showStartTime}:00`,
      showEnd: `${t.showStartDate}T${t.showEndTime || "23:59"}:00`,
    }));

    // 🔥 bookStart/bookEnd도 저장 시 변환
    const bookStart = `${bookStartDate}T${bookStartTime}:00`;
    const lastShowDate = showTimes[showTimes.length - 1].showStartDate;
    const bookEnd = `${lastShowDate}T23:59:00`;

    setFormData((prev) => ({
      ...prev,
      showTimes: formattedShowTimes,
      bookStart,
      bookEnd,
    }));

    // ③ 저장용 currentPayload는 setFormData 기다릴 필요 없이 직접 만든다

    const currentPayload = {
      ...formData, // 현재 UI에서 입력된 값 모두 포함
      showTimes: formattedShowTimes,
      bookStart,
      bookEnd,
    };
    // // ④ createPayload에 넣어 최종 payload 생성
    const finalPayload = createPayload(currentPayload);

    // ⑤ localStorage에 먼저 저장
    console.log("final", finalPayload);
    localStorage.setItem("createShowPayload", JSON.stringify(finalPayload));

    try {
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

  // 다음
  const handleNext = () => {
    if (!validateFields()) {
      addToast("필수 항목을 입력해주세요!", "error");
      return;
    }
    // 🔥 showTimes 변환 (저장 시에만)
    const formattedShowTimes = showTimes.map((t) => ({
      showStart: `${t.showStartDate}T${t.showStartTime}:00`,
      showEnd: `${t.showStartDate}T${t.showEndTime || "23:59"}:00`,
    }));

    // 🔥 bookStart/bookEnd도 저장 시 변환
    const bookStart = `${bookStartDate}T${bookStartTime}:00`;
    const lastShowDate = showTimes[showTimes.length - 1].showStartDate;
    const bookEnd = `${lastShowDate}T23:59:00`;

    setFormData((prev) => ({
      ...prev,
      showTimes: formattedShowTimes,
      bookStart,
      bookEnd,
    }));

    // ③ 저장용 currentPayload는 setFormData 기다릴 필요 없이 직접 만든다

    const currentPayload = {
      ...formData, // 현재 UI에서 입력된 값 모두 포함
      showTimes: formattedShowTimes,
      bookStart,
      bookEnd,
    };
    // // ④ createPayload에 넣어 최종 payload 생성
    const finalPayload = createPayload(currentPayload);

    // ⑤ localStorage에 먼저 저장
    console.log("final", finalPayload);
    localStorage.setItem("createShowPayload", JSON.stringify(finalPayload));
    navigate(`/register-show/${showId}/step2`);
  };

  // 로컬 저장 로드
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("mainposter"));
    if (saved?.poster) {
      setPoster(saved.poster);
    }
    const savedData = JSON.parse(localStorage.getItem("createShowPayload"));
    if (savedData?.poster) {
      setPoster(savedData.poster);
      setPosterFile(savedData.poster);
    }
  }, []);

  // --------------------------
  //  렌더링 (변수명 변경 완료!)
  // --------------------------

  return (
    <>
      {/* <NavbarManager /> */}
      <Container onChange={handleAnyInput} onInput={handleAnyInput}>
        <MainContent>
          {/* <RegisterShowNavbar currentStep={1} /> */}

          <FormContent>
            <LeftContent>
              <Name>대표 포스터</Name>
              <Poster
                onClick={() => document.getElementById("posterUpload").click()}
              >
                {poster ? (
                  <>
                    <img src={formData.poster} alt="포스터 미리보기" />
                    <HoverOverlay>포스터 변경하기</HoverOverlay>
                  </>
                ) : (
                  <EmptyBox>
                    <BsUpload size={45} color="#ccc" />
                    <UploadText>포스터 업로드하기</UploadText>
                  </EmptyBox>
                )}
              </Poster>

              <HiddenInput
                id="posterUpload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </LeftContent>

            <RightContent>
              {/* 공연명 */}
              <Q>
                <Name>공연명</Name>
                <Input
                  value={formData.title}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, title: e.target.value }));
                    if (e.target.value.trim() !== "") setTitleError(false);
                  }}
                  placeholder={
                    formData.title ? formData.title : "제4회 정기공연"
                  }
                />
                {titleError && <ErrorMessage>*필수 항목입니다.</ErrorMessage>}
              </Q>

              {/* 공연 회차 showTimes */}
              <Q>
                <Name>
                  공연 날짜/회차
                  <AddButton onClick={addShowTime}>추가하기</AddButton>
                </Name>

                {showTimes.map((t, idx) => (
                  <DateRow key={idx}>
                    {/* 날짜 */}
                    <Column>
                      <DateWrapper>
                        <DateInput
                          type="date"
                          value={t.showStartDate}
                          onChange={(e) => {
                            updateShowTime(
                              idx,
                              "showStartDate",
                              e.target.value
                            );
                            if (e.target.value.trim() !== "")
                              setShowDateError(false);
                          }}
                        />
                        <CalendarIcon />
                      </DateWrapper>
                      {showDateError && (
                        <ErrorMessage>*필수 항목입니다.</ErrorMessage>
                      )}
                    </Column>
                    {/* 시작 시간 */}
                    <Column>
                      <TimeSelect
                        value={t.showStartTime}
                        onChange={(e) => {
                          updateShowTime(idx, "showStartTime", e.target.value);
                          if (e.target.value.trim() !== "")
                            setShowTimeError(false);
                        }}
                      >
                        <option value="" disabled>
                          00:00
                        </option>
                        {timeOptions.map((time, i) => (
                          <option key={i} value={time}>
                            {time}
                          </option>
                        ))}
                      </TimeSelect>
                      {showTimeError && (
                        <ErrorMessage>*필수 항목입니다.</ErrorMessage>
                      )}
                    </Column>

                    <span>~</span>

                    {/* 종료 시간 */}
                    <Column>
                      <TimeSelect
                        value={t.showEndTime}
                        onChange={(e) => {
                          updateShowTime(idx, "showEndTime", e.target.value);
                          if (e.target.value.trim() !== "")
                            setShowTimeError(false);
                        }}
                      >
                        <option value="" disabled>
                          00:00
                        </option>
                        {timeOptions.map((time, i) => (
                          <option key={i} value={time}>
                            {time}
                          </option>
                        ))}
                      </TimeSelect>
                      {showTimeError && (
                        <ErrorMessage>*필수 항목입니다.</ErrorMessage>
                      )}
                    </Column>

                    {formData.showTimes.length > 1 && (
                      <DeleteIcon onClick={() => removeShowTime(idx)} />
                    )}
                  </DateRow>
                ))}
              </Q>

              {/* 예매 시작 bookStart */}
              <Q>
                <Name>예매 기간</Name>

                <DateRow>
                  {/* bookStartDate */}
                  <Column>
                    <DateWrapper>
                      <DateInput
                        type="date"
                        value={bookStartDate}
                        onChange={(e) => {
                          setBookStartDate(e.target.value);
                          if (e.target.value.trim() !== "")
                            setBookStartDateError(false);
                        }}
                      />
                      <CalendarIcon />
                    </DateWrapper>
                    {bookStartDateError && (
                      <ErrorMessage>*필수 항목입니다.</ErrorMessage>
                    )}
                  </Column>

                  {/* bookStartTime */}
                  <Column>
                    <TimeSelect
                      value={bookStartTime}
                      onChange={(e) => {
                        setBookStartTime(e.target.value);
                        if (e.target.value.trim() !== "")
                          setBookStartTimeError(false);
                      }}
                    >
                      <option value="" disabled>
                        00:00
                      </option>
                      {timeOptions.map((time, i) => (
                        <option key={i} value={time}>
                          {time}
                        </option>
                      ))}
                    </TimeSelect>
                    {bookStartTimeError && (
                      <ErrorMessage>*필수 항목입니다.</ErrorMessage>
                    )}
                  </Column>

                  <span>~</span>

                  <PeriodText>공연 시작 1시간 전</PeriodText>
                </DateRow>
              </Q>

              {/* 티켓 옵션 */}
              <Q>
                <Name>
                  티켓 옵션
                  <AddButton onClick={addTicketOption}>추가하기</AddButton>
                </Name>

                {formData.ticketOptions.map((opt, idx) => (
                  <TicketContent key={idx}>
                    <Input
                      placeholder="티켓 옵션 이름 (일반예매 / 학생예매)"
                      value={opt.name}
                      onChange={(e) =>
                        updateTicketOption(idx, "name", e.target.value)
                      }
                    />

                    <Input
                      placeholder="티켓 옵션 설명"
                      value={opt.description}
                      onChange={(e) =>
                        updateTicketOption(idx, "description", e.target.value)
                      }
                    />

                    <PriceRow>
                      <span>판매가</span>
                      <PriceInput
                        placeholder="0"
                        value={opt.price}
                        onChange={(e) =>
                          updateTicketOption(idx, "price", e.target.value)
                        }
                      />
                      <span>원</span>

                      {formData.ticketOptions.length > 1 && (
                        <DeleteIcon onClick={() => removeTicketOption(idx)} />
                      )}
                    </PriceRow>
                  </TicketContent>
                ))}
              </Q>

              {/* 입금 정보 */}
              <Q>
                <Name>입금주</Name>
                <Input
                  placeholder="홍길동"
                  value={formData.bankMaster}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      bankMaster: e.target.value,
                    }))
                  }
                />

                <Name>입금 계좌</Name>
                <AccountRow>
                  <BankSelect
                    value={formData.bankName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        bankName: e.target.value,
                      }))
                    }
                  >
                    <option value="" disabled>
                      은행명
                    </option>
                    {bankOptions.map((bank) => (
                      <option key={bank.id} value={bank.code}>
                        {bank.name}
                      </option>
                    ))}
                  </BankSelect>

                  <Input
                    placeholder="0000000000000"
                    value={formData.bankAccount}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        bankAccount: e.target.value,
                      }))
                    }
                  />
                </AccountRow>
              </Q>
            </RightContent>
          </FormContent>
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

export default RegisterShowStep1;

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

const FormContent = styled.div`
  display: flex;
  gap: 100px;
`;

const LeftContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const RightContent = styled.div`
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

const Poster = styled.div`
  width: 320px;
  height: 450px;
  background: #fff;
  box-shadow: 3px 3px 15px 3px rgba(0, 0, 0, 0.15);
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:hover div {
    opacity: 1;
  }
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
  transition: 0.25s ease;
`;

const EmptyBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  color: #aaa;
  font-size: 16px;
`;

const UploadText = styled.div`
  font-size: 18px;
  color: #999;
`;

const HiddenInput = styled.input`
  display: none;
`;
const Input = styled.input`
  width: 100%;
  height: 55px;
  padding: 0 16px;
  border: 1px solid #ddd;
  border-radius: 12px;
  font-size: 18px;
  outline: none;
  color: #333;
  &::placeholder {
    color: #999;
  }

  &:focus {
    border-color: #fc2847;
  }
`;

const DateRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 10px;

  span {
    font-size: 18px;
    color: #999;
  }
`;

const AddButton = styled.button`
  background: var(--color-tertiary);
  color: var(--color-secondary);
  border: none;
  border-radius: 20px;
  padding: 6px 18px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 300;

  &:hover {
    background: #ffd6dc;
  }
`;

const PeriodText = styled.div`
  font-size: 17px;
  color: #999;
  margin-left: 10px;
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 14px;
  font-size: 20px;
  font-weight: 300;

  span {
    color: #333;
  }
`;

const PriceInput = styled(Input)`
  width: 120px;
  text-align: end;
`;

const AccountRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const BankSelect = styled.select`
  height: 55px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid #ddd;
  font-size: 18px;
  color: #333;

  &:focus {
    border-color: #fc2847;
  }
  option {
    color: #333;
  }

  &.placeholder {
    color: #999;
  }
  option.placeholder {
    color: #999;
  }
`;

const DateInput = styled.input`
  width: 180px;
  height: 55px;
  padding: 0 45px 0 14px;
  border: 1px solid #ddd;
  border-radius: 12px;
  font-size: 18px;
  cursor: pointer;
  color: #333;
  &::placeholder {
    color: #999;
  }
  &::-webkit-calendar-picker-indicator {
    opacity: 0;
    position: absolute;
    right: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }

  &:focus {
    border-color: #fc2847;
  }

  &.placeholder {
    color: #999;
  }
`;

const TimeSelect = styled.select`
  width: 140px;
  height: 55px;
  padding: 0 14px;
  border: 1px solid #ddd;
  border-radius: 12px;
  font-size: 18px;
  cursor: pointer;
  background: #fff;
  color: #333;

  &:focus {
    border-color: #fc2847;
  }
  option {
    color: #333;
  }

  &.placeholder {
    color: #999;
  }
  option.placeholder {
    color: #999;
  }
`;

const Q = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const DateWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const CalendarIcon = styled(AiOutlineCalendar)`
  position: absolute;
  right: 14px;
  font-size: 22px;
  color: #888;
  pointer-events: none;
`;

const DeleteIcon = styled(AiOutlineClose)`
  font-size: 22px;
  color: #999;
  cursor: pointer;
  margin-left: 6px;
  transition: 0.2s ease;

  &:hover {
    color: var(--color-primary);
  }
`;

const TicketContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const ErrorMessage = styled.div`
  color: #fc2847;
  font-size: 15px;
  margin-top: -8px;
  margin-left: 4px;
  display: flex;
  align-items: center;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
