import React from "react";
import NavbarManager from "../../../components/Navbar/NavbarManager";
import RegisterShowNavbar from "./RegisterShowNavbar";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../components/Toast/useToast";
import { useState, useEffect } from "react";
import { BsUpload } from "react-icons/bs";
import { AiOutlineCalendar } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";

const RegisterShowStep1 = ({ viewer = false }) => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  // 대표 포스터
  const [posterFile, setPosterFile] = useState(null); // 파일
  const [poster, setPoster] = useState(null); // 미리보기 URL

  // 공연명
  const [title, setTitle] = useState("");

  // 공연 회차
  const [showTimes, setShowTimes] = useState([
    {
      showStartDate: "",
      showStartTime: "",
      showEndTime: "",
    },
  ]);

  const addShowTime = () => {
    setShowTimes([
      ...showTimes,
      { showStartDate: "", showStartTime: "", showEndTime: "" },
    ]);
  };

  const updateShowTime = (index, field, value) => {
    const updated = [...showTimes];
    updated[index][field] = value;
    setShowTimes(updated);
  };

  const removeShowTime = (index) => {
    setShowTimes(showTimes.filter((_, i) => i !== index));
  };

  // 예매 시작(bookStart)
  const [bookStartDate, setBookStartDate] = useState("");
  const [bookStartTime, setBookStartTime] = useState("");

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
  const [ticketOptions, setTicketOptions] = useState([
    { name: "", description: "", price: "" },
  ]);

  const addTicketOption = () => {
    setTicketOptions([
      ...ticketOptions,
      { name: "", description: "", price: "" },
    ]);
  };

  const updateTicketOption = (idx, field, value) => {
    const updated = [...ticketOptions];
    updated[idx][field] = value;
    setTicketOptions(updated);
  };

  const removeTicketOption = (idx) => {
    setTicketOptions(ticketOptions.filter((_, i) => i !== idx));
  };

  // 입금 정보
  const [bankMaster, setBankMaster] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccount, setBankAccount] = useState("");

  // 오류
  const [titleError, setTitleError] = useState(false);
  const [showDateError, setShowDateError] = useState(false);
  const [showTimeError, setShowTimeError] = useState(false);
  const [bookStartDateError, setBookStartDateError] = useState(false);
  const [bookStartTimeError, setBookStartTimeError] = useState(false);

  // 포스터 업로드
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPosterFile(file);

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPoster(previewUrl);
    }
  };

  // 이전 단계
  const handlePrevious = () => {
    navigate("/homemanager");
  };

  // 검증
  const validateFields = () => {
    let isValid = true;

    if (title.trim() === "") {
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

  // 임시 저장
  const handleTempSave = () => {
    if (!validateFields()) {
      addToast("필수 항목을 입력해주세요!", "error");
      return;
    }

    const formData = { poster };
    localStorage.setItem("registerShowStep1", JSON.stringify(formData));
    addToast("임시 저장되었습니다!", "success");
  };

  // 다음
  const handleNext = () => {
    if (!validateFields()) {
      addToast("필수 항목을 입력해주세요!", "error");
      return;
    }

    navigate("/register-show/step2");
  };

  // 로컬 저장 로드
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("registerShowStep1"));
    if (saved?.poster) {
      setPoster(saved.poster);
    }
  }, []);

  // --------------------------
  //  렌더링 (변수명 변경 완료!)
  // --------------------------

  return (
    <>
      {/* <NavbarManager /> */}
      <Container>
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
                    <img src={poster} alt="포스터 미리보기" />
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
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (e.target.value.trim() !== "") setTitleError(false);
                  }}
                  placeholder="제4회 정기공연"
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
                            updateShowTime(idx, "showStartDate", e.target.value);
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

                    {showTimes.length > 1 && (
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

                {ticketOptions.map((opt, idx) => (
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

                      {ticketOptions.length > 1 && (
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
                  value={bankMaster}
                  onChange={(e) => setBankMaster(e.target.value)}
                />

                <Name>입금 계좌</Name>
                <AccountRow>
                  <BankSelect
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  >
                    <option value="" disabled>
                      은행명
                    </option>
                    <option>우리</option>
                    <option>신한</option>
                    <option>국민</option>
                    <option>하나</option>
                    <option>카카오뱅크</option>
                    <option>토스뱅크</option>
                  </BankSelect>

                  <Input
                    placeholder="0000000000000"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
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
//         <Footer>
//           <PrevButton onClick={handlePrevious}>←이전</PrevButton>

//           <RightButtonGroup>
//             <TempSaveButton onClick={handleTempSave}>
//               임시저장
//             </TempSaveButton>
//             <NextButton onClick={handleNext}>다음→</NextButton>
//           </RightButtonGroup>
//         </Footer>
      </Container>
    </>
  );
};

export default RegisterShowStep1;


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
