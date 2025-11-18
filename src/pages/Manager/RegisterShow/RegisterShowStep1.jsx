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

const RegisterShowStep1 = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  // 이미지 파일 저장
  const [poster, setPoster] = useState(null);
  // 미리보기 URL 저장
  const [preview, setPreview] = useState(null);

  //공연명
  const [showName, setShowName] = useState("");

  // 공연 날짜/회차들
  const [showSchedules, setShowSchedules] = useState([
    { date: "", startTime: "", endTime: "" },
  ]);

  const addSchedule = () => {
    setShowSchedules([
      ...showSchedules,
      { date: "", startTime: "", endTime: "" },
    ]);
  };

  const updateSchedule = (index, field, value) => {
    const updated = [...showSchedules];
    updated[index][field] = value;
    setShowSchedules(updated);
  };

  const removeSchedule = (index) => {
    setShowSchedules(showSchedules.filter((_, i) => i !== index));
  };

  //예매 날짜
  const [reserveStartDate, setReserveStartDate] = useState("");
  // 예매 기간 시간
  const [reserveStartTime, setReserveStartTime] = useState("");

  // 00:00 ~ 23:50 까지 10분 단위 생성
  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let min = 0; min < 60; min += 30) {
      const h = String(hour).padStart(2, "0");
      const m = String(min).padStart(2, "0");
      timeOptions.push(`${h}:${m}`);
    }
  }
  // 티켓
  const [ticketOptions, setTicketOptions] = useState([
    { name: "", detail: "", price: "" },
  ]);

  const addTicketOption = () => {
    setTicketOptions([...ticketOptions, { name: "", detail: "", price: "" }]);
  };
  const updateTicketOption = (index, field, value) => {
    const updated = [...ticketOptions];
    updated[index][field] = value;
    setTicketOptions(updated);
  };
  const removeTicketOption = (index) => {
    setTicketOptions(ticketOptions.filter((_, i) => i !== index));
  };

  // 입금주
  const [accountHolder, setAccountHolder] = useState("");
  // 은행
  const [selectBank, setSelectBank] = useState("");
  const [account, setAccount] = useState("");

  const [showNameError, setShowNameError] = useState(false);
  const [showDateError, setShowDateError] = useState(false);
  const [showTimeError, setShowTimeError] = useState(false);
  const [reserveDateError, setReserveDateError] = useState(false);
  const [reserveTimeError, setReserveTimeError] = useState(false);

  const handleTempSave = () => {
    if (!validateFields()) {
      addToast("필수 항목을 입력해주세요!", "error");
      return;
    }

    const formData = { poster: preview };
    localStorage.setItem("registerShowStep1", JSON.stringify(formData));
    addToast("임시 저장되었습니다!", "success");
  };

  // 파일 업로드 핸들러
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPoster(file);

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };

  // 이전 단계로
  const handlePrevious = () => {
    // TODO: 2단계 페이지로 이동
    navigate("/homemanager");
  };

  const validateFields = () => {
    let isValid = true;

    // 공연명
    if (showName.trim() === "") {
      setShowNameError(true);
      isValid = false;
    }

    // 공연 날짜/시간 (회차 전체 체크)
    const hasEmptyDate = showSchedules.some((sch) => sch.date.trim() === "");
    const hasEmptyStart = showSchedules.some(
      (sch) => sch.startTime.trim() === ""
    );
    const hasEmptyEnd = showSchedules.some((sch) => sch.endTime.trim() === "");

    if (hasEmptyDate) {
      setShowDateError(true);
      isValid = false;
    }
    if (hasEmptyStart || hasEmptyEnd) {
      setShowTimeError(true);
      isValid = false;
    }

    // 예매 시작 날짜, 시간
    if (reserveStartDate.trim() === "") {
      setReserveDateError(true);
      isValid = false;
    }

    if (reserveStartTime.trim() === "") {
      setReserveTimeError(true);
      isValid = false;
    }

    return isValid;
  };

  // 다음 단계로
  const handleNext = () => {
    if (!validateFields()) {
      addToast("필수 항목을 입력해주세요!", "error");
      return;
    }

    navigate("/register-show/step2");
  };

  // 기존 임시 저장 데이터 불러오기
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("registerShowStep1"));
    if (saved?.poster) {
      setPreview(saved.poster);
    }
  }, []);

  // console.log("제목", showName);
  // console.log("공연날짜", showDate);
  // console.log("공연시작시간", showStartTime);
  // console.log("공연마감시간", showEndTime);
  // console.log("예매날짜", reserveStartDate);
  // console.log("예매시간", reserveStartTime);
  // console.log("티켓옵션", ticketName);
  // console.log("티켓설명", ticketDetail);
  // console.log("가격", ticketPrice);
  // console.log("예금주", accountHolder);
  // console.log("계좌번호", account);
  return (
    <>
      <NavbarManager />
      <Container>
        <MainContent>
          <RegisterShowNavbar currentStep={1} />

          <FormContent>
            <LeftContent>
              <Name>대표 포스터</Name>
              <Poster
                onClick={() => document.getElementById("posterUpload").click()}
              >
                {preview ? (
                  <>
                    <img src={preview} alt="포스터 미리보기" />

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
              <Q>
                {/* 공연명 */}
                <Name>공연명</Name>
                <Input
                  value={showName}
                  onChange={(e) => {
                    setShowName(e.target.value);
                    if (e.target.value.trim() !== "") {
                      setShowNameError(false);
                    }
                  }}
                  className={showName === "" ? "placeholder" : ""}
                  placeholder="제4회 정기공연"
                />
                {showNameError && (
                  <ErrorMessage>*필수 항목입니다.</ErrorMessage>
                )}
              </Q>

              <Q>
                {/* 공연 날짜/회차 */}
                <Name>
                  공연 날짜/회차
                  <AddButton onClick={addSchedule}>추가하기</AddButton>
                </Name>
                {showSchedules.map((sch, idx) => (
                  <DateRow key={idx}>
                    <Column>
                      <DateWrapper>
                        <DateInput
                          type="date"
                          value={sch.date}
                          onChange={(e) => {
                            updateSchedule(idx, "date", e.target.value);
                            if (e.target.value.trim() !== "")
                              setShowDateError(false);
                          }}
                          className={sch.date === "" ? "placeholder" : ""}
                        />

                        <CalendarIcon />
                      </DateWrapper>
                      {showDateError && (
                        <ErrorMessage>*필수 항목입니다.</ErrorMessage>
                      )}
                    </Column>

                    <Column>
                      <TimeSelect
                        value={sch.startTime}
                        onChange={(e) => {
                          updateSchedule(idx, "startTime", e.target.value);
                          if (e.target.value.trim() !== "")
                            setShowTimeError(false);
                        }}
                        className={sch.startTime === "" ? "placeholder" : ""}
                      >
                        <option value="" disabled className="placeholder">
                          00:00
                        </option>
                        {timeOptions.map((time, idx) => (
                          <option key={idx} value={time}>
                            {time}
                          </option>
                        ))}
                      </TimeSelect>
                      {showTimeError && (
                        <ErrorMessage>*필수 항목입니다.</ErrorMessage>
                      )}
                    </Column>

                    <span>~</span>

                    <Column>
                      <TimeSelect
                        value={sch.endTime}
                        onChange={(e) => {
                          updateSchedule(idx, "endTime", e.target.value);
                          if (e.target.value.trim() !== "")
                            setShowTimeError(false);
                        }}
                        className={sch.endTime === "" ? "placeholder" : ""}
                      >
                        <option value="" disabled className="placeholder">
                          00:00
                        </option>
                        {timeOptions.map((time, idx) => (
                          <option key={idx} value={time}>
                            {time}
                          </option>
                        ))}
                      </TimeSelect>
                      {showTimeError && (
                        <ErrorMessage>*필수 항목입니다.</ErrorMessage>
                      )}
                    </Column>
                    {/* ★ 삭제 버튼 (스케줄이 2개 이상일 때만 표시) */}
                    {showSchedules.length > 1 && (
                      <DeleteIcon onClick={() => removeSchedule(idx)} />
                    )}
                  </DateRow>
                ))}
              </Q>

              <Q>
                {/* 예매 기간 */}
                <Name>예매 기간</Name>
                <DateRow>
                  <Column>
                    <DateWrapper>
                      <DateInput
                        type="date"
                        value={reserveStartDate}
                        onChange={(e) => {
                          setReserveStartDate(e.target.value);
                          if (e.target.value.trim() !== "")
                            setReserveDateError(false);
                        }}
                        className={reserveStartDate === "" ? "placeholder" : ""}
                      />
                      <CalendarIcon />
                    </DateWrapper>
                    {reserveDateError && (
                      <ErrorMessage>*필수 항목입니다.</ErrorMessage>
                    )}
                  </Column>

                  <Column>
                    <TimeSelect
                      value={reserveStartTime}
                      onChange={(e) => {
                        setReserveStartTime(e.target.value);
                        if (e.target.value.trim() !== "")
                          setReserveTimeError(false);
                      }}
                      className={reserveStartTime === "" ? "placeholder" : ""}
                    >
                      <option value="" disabled className="placeholder">
                        00:00
                      </option>
                      {timeOptions.map((time, idx) => (
                        <option key={idx} value={time}>
                          {time}
                        </option>
                      ))}
                    </TimeSelect>
                    {reserveTimeError && (
                      <ErrorMessage>*필수 항목입니다.</ErrorMessage>
                    )}
                  </Column>

                  <span>~</span>

                  <PeriodText>공연 시작 1시간 전</PeriodText>
                </DateRow>
              </Q>

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
                      className={opt.name === "" ? "placeholder" : ""}
                    />

                    <Input
                      placeholder="티켓 옵션 설명"
                      value={opt.detail}
                      onChange={(e) =>
                        updateTicketOption(idx, "detail", e.target.value)
                      }
                      className={opt.detail === "" ? "placeholder" : ""}
                    />

                    <PriceRow>
                      <span>판매가</span>
                      <PriceInput
                        placeholder="0"
                        value={opt.price}
                        onChange={(e) =>
                          updateTicketOption(idx, "price", e.target.value)
                        }
                        className={opt.price === "" ? "placeholder" : ""}
                      />
                      <span>원</span>

                      {/* 옵션이 2개 이상일 때만 X 버튼 표시 */}
                      {ticketOptions.length > 1 && (
                        <DeleteIcon onClick={() => removeTicketOption(idx)} />
                      )}
                    </PriceRow>
                  </TicketContent>
                ))}
              </Q>

              <Q>
                {/* 입금주 */}
                <Name>입금주</Name>
                <Input
                  placeholder="홍길동"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                />

                {/* 입금 계좌 */}
                <Name>입금 계좌</Name>
                <AccountRow>
                  <BankSelect
                    value={selectBank}
                    onChange={(e) => setSelectBank(e.target.value)}
                    className={selectBank === "" ? "placeholder" : ""}
                  >
                    <option value="" disabled className="placeholder">
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
                    placeholder="0000-000-000000"
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                  />
                </AccountRow>
              </Q>
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
