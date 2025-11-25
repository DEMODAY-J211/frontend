import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../../components/Toast/useToast";
import NavbarManager from "../../../components/Navbar/NavbarManager";
import RegisterShowNavbar from "./RegisterShowNavbar";
import { GrCheckbox, GrCheckboxSelected } from "react-icons/gr";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  .macro-box {
    background: #f5f5f5;
    padding: 0 6px;
    border-radius: 6px;
    font-size: 18px;
    font-weight: 300;
    color: #999;
    display: inline-block;
   border: 1px solid #C5C5C5;
  }
`;

const checkboxItems = [
  { id: "payGuide", label: "입금 안내" },
  { id: "bookConfirm", label: "예매 확정" },
  { id: "showGuide", label: "공연 안내" },
  { id: "reviewRequest", label: "공연 후 설문 안내" },
];

const RegisterShowStep4 = ({ viewer = false }) => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { showId } = useParams();

  const [previews, setPreviews] = useState({
    payGuide: false,
    bookConfirm: false,
    showGuide: true,
    reviewRequest: false,
  });

  const defaultMessages = {
    payGuide:
      "[입금 안내]\n" +
      "안녕하세요, {단체명}입니다!\n" +
      "예매하신 {공연명}의 티켓 금액을 아래 계좌로 입금해주시면 예매가 완료됩니다.\n\n" +
      "입금 금액: {0,000원}\n" +
      "예금주: {예금주명}\n" +
      "계좌번호: {계좌번호}\n\n" +
      "확인되는 대로 빠르게 안내해 드리겠습니다!",

    bookConfirm:
      "[예매 확정 안내]\n" +
      "안녕하세요! {공연명}의 예매가 정상적으로 완료되었습니다\n\n" +
      "소중한 예매 감사드리며, 공연장에서 뵙겠습니다!",

    showGuide:
      "[관람일 D-1 안내]\n" +
      "{000 님}, 관람일이 바로 내일이에요!\n\n" +
      "공연명: {공연명}\n" +
      "일시: {공연일시}\n" +
      "예매 매수: {예매 매수}\n" +
      "관람 장소: {공연장소}\n\n" +
      "안전하고 즐거운 관람을 위해 입장시간에 맞춰 와주세요!",

    reviewRequest:
      "[관람 후기 설문 안내]\n" +
      "공연을 관람해주셔서 진심으로 감사합니다!\n" +
      "더 좋은 공연을 만들기 위해 짧은 설문에 참여 부탁드립니다! \n\n" +
      "설문 링크: (링크를 넣어주세요)",
  };
  // const [showMessage, setShowMessage] = useState(defaultMessages);

  const [messages, setMessages] = useState(defaultMessages);
  const macroMap = {
    단체명: "team_name",
    공연명: "show_name",
    "0,000 원": "amount",
    예금주명: "account_holder",
    계좌번호: "account_number",
    예매_매수: "ticket_count",
    "000 님": "username",
    공연일시: "show_date_time",
    관람장소: "venue",
  };

  const renderWithMacroBox = (text) => {
    return text.replace(/\{([^}]+)\}/g, (_, key) => {
      return `<span contenteditable="false" class="macro-box">{${key}}</span>`;
    });
  };
  const convertMessageForBackend = (text) => {
    return text.replace(/\{([^}]+)\}/g, (_, key) => {
      return `{${macroMap[key] || key}}`;
    });
  };

  const handleCheckboxToggle = (id) => {
    if (id === "showGuide") return; // ❗ 공연 안내는 비활성화
    // setPreviews((prev) => ({ ...prev, [id]: !prev[id] }));
    setPreviews((prev) => {
      const next = !prev[id];

      setMessages((msg) => ({
        ...msg,
        [id]: next ? defaultMessages[id] : "", // 체크 → default, 해제 → 공백
      }));

      return { ...prev, [id]: next };
    });
  };
  // 임시 저장 핸들러
  const handleTempSave = async () => {
    // 1) 기존 payload 불러오기
    const payload = JSON.parse(localStorage.getItem("createShowPayload")) || {};
    const formData = previews;

    localStorage.setItem("registerShowStep4", JSON.stringify(formData));
    console.log("formdata", formData);
    console.log("payload", payload);

    const showGuideTextarea = document.getElementById("textarea-showGuide");
    if (!showGuideTextarea) return;
    console.log("form", formData);

    const userEditedMessage = showGuideTextarea.innerText.trim();

    if (!userEditedMessage) {
      addToast("필수 항목을 입력해주세요: 공연 안내", "error");
      return;
    }

    // true인 항목 필터링
    const trueKeys = Object.keys(previews).filter((key) => previews[key]);

    const sendMessage = {};
    trueKeys.forEach((key) => {
      sendMessage[key] = convertMessageForBackend(messages[key]);
    });

    console.log("turkey", trueKeys);

    const updatedPayload = {
      ...payload,
      showMessage: sendMessage, // true인 메시지만 포함
    };

    console.log("updatedapyalad", updatedPayload);

    localStorage.setItem("createShowPayload", JSON.stringify(updatedPayload));

    // navigate("/register-show/step5");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/manager/shows/${showId}/draft`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedPayload),
          credentials: "include",
        }
      );

      const result = await response.json();
      if (!response.ok) {
        addToast(result.message || "임시저장 실패", "error");
        return;
      }
      console.log(result);
      addToast("임시 저장되었습니다!", "success");
    } catch (error) {
      console.error("임시저장 오류:", error);
      addToast("임시저장 중 오류 발생", "error");
    }
  };

    // 이전 단계로
  const handlePrevious = () => {
    navigate(`/register-show/${showId}/step3`);
  };

  const handleNext = () => {
    const payload = JSON.parse(localStorage.getItem("createShowPayload")) || {};
    const formData = previews;

    localStorage.setItem("registerShowStep4", JSON.stringify(formData));
    console.log("formdata", formData);
    console.log("payload", payload);

    const showGuideTextarea = document.getElementById("textarea-showGuide");
    if (!showGuideTextarea) return;
    console.log("form", formData);

    const userEditedMessage = showGuideTextarea.innerText.trim();

    if (!userEditedMessage) {
      addToast("필수 항목을 입력해주세요: 공연 안내", "error");
      return;
    }

    // true인 항목 필터링
    const trueKeys = Object.keys(formData).filter(
      (key) => formData[key] === true
    );
    console.log("turkey", trueKeys);

    trueKeys.forEach((key) => {
      // macro 변환 적용
      const elem = document.getElementById(`textarea-${key}`);
      if (!elem) return;

      const userEdited = elem.innerText.trim();
      showMessage[key] = convertMessageForBackend(userEdited);
    });
    console.log(showMessage);

    // userEditedMessage는 showGuide 같은 필드에 넣는다고 가정
    showMessage.showGuide = userEditedMessage;

    console.log("보낼 showMessage:", showMessage);

    const updatedPayload = {
      ...payload,
      showMessage: showMessage, // 이미지 배열 자체가 S3 URL 배열
    };
    console.log("updatedapyalad", updatedPayload);

    localStorage.setItem("createShowPayload", JSON.stringify(updatedPayload));

    navigate(`/register-show/${showId}/step5`);
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

  // 기존 임시 저장 데이터 불러오기
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("registerShowStep4"));
    if (saved?.previews) {
      setPreviews(saved.previews);
    }
  }, []);

  return (
    <>
      <GlobalStyle />
      {/* <NavbarManager /> */}
      <Container>
        <MainContent>
          {/* <RegisterShowNavbar currentStep={4} /> */}
          <Flex>
            <Name>알림 메시지 양식</Name>
            <Desc>
              * 1. 회색 박스 안의 정보는 티킷타에서 자동으로 넣어주는 내용이니
              수정하지 않으셔도 됩니다! <br/>
              &nbsp;&nbsp;&nbsp;2. 이모티콘을 넣으면 문자가 발송되지 않으니 유의해주세요. 
            </Desc>
          </Flex>

          {/* map 안에서 textarea에 적용 */}
          {checkboxItems.map((item) => (
            <CheckboxContainer key={item.id}>
              <Flex>
                <CheckboxButton
                  checked={previews[item.id]}
                  isSurvey={item.id === "reviewRequest"}
                  onClick={() => handleCheckboxToggle(item.id)}
                >
                  {previews[item.id] ? <GrCheckboxSelected /> : <GrCheckbox />}
                  {item.label}
                </CheckboxButton>
                {item.id === "showGuide" && <RequiredText>(필수)</RequiredText>}
              </Flex>
              {previews[item.id] && (
                <MessageTextarea
                  id={`textarea-${item.id}`}
                  contentEditable
                  suppressContentEditableWarning={true}
                  onInput={(e) => {
                    setMessages((prev) => ({
                      ...prev,
                      [item.id]: e.target.innerText.trim(),
                    }));
                  }}
                  dangerouslySetInnerHTML={{
                    __html: renderWithMacroBox(messages[item.id]),
                  }}
                />
              )}

              {previews[item.id] && (
                <MessageTextarea
                  id={`textarea-${item.id}`}
                  contentEditable
                  dangerouslySetInnerHTML={{
                    __html: renderWithMacroBox(defaultMessages[item.id]),
                  }}
                />
              )}
            </CheckboxContainer>
          ))}
        </MainContent>

        {!viewer && (
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

export default RegisterShowStep4;

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

const Name = styled.div`
  font-size: 25px;
  font-weight: 500;
  display: flex;
  gap: 20px;
`;

const Desc = styled.div`
  font-size: 15px;
  font-weight: 400;
  display: flex;
  color: var(--color-primary);
`;

const CheckboxContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CheckboxButton = styled.button`
  height: 45px;
  width: ${({ isSurvey }) => (isSurvey ? "160px" : "120px")};
  padding: 5px 10px;
  justify-content: center;
  gap: 8px;
  display: flex;
  align-items: center;
  gap: 10px;

  border-radius: 10px;
  border: 1px solid #ccc;
  background-color: ${({ checked }) =>
    checked ? "var(--color-primary)" : "#fff"};
  color: ${({ checked }) => (checked ? "#FFFFFE" : "#333")};
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
`;

const MessageTextarea = styled.div`
  width: 100%;
  min-height: 200px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 18px;
  font-weight: 300;
  line-height: 1.8;
  white-space: pre-wrap;
`;

const RequiredText = styled.span`
  color: #fc2847;
  font-size: 14px;
  margin-left: 5px;
  font-weight: 700;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;
