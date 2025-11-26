import React from "react";
import NavbarManager from "../../../components/Navbar/NavbarManager";
import RegisterShowNavbar from "../RegisterShow/RegisterShowNavbar";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../../components/Toast/useToast";
import { useState, useEffect } from "react";
import RegisterShowStep1 from "../RegisterShow/RegisterShowStep1";
import RegisterShowStep2 from "../RegisterShow/RegisterShowStep2";
import RegisterShowStep3 from "../RegisterShow/RegisterShowStep3";
import RegisterShowStep4 from "../RegisterShow/RegisterShowStep4";

const EditShow = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { showId } = useParams();
  // useEffect(() => {
  //   console.log(showId);
  // }, [showId]);

  // 미리보기 URL 저장
  const [preview, setPreview] = useState(null);

  // const getBasePayload = () => ({
  //   title: "",
  //   poster: "",
  //   showTimes: [
  //     {
  //       showStart: "",
  //       showEnd: "",
  //     },
  //   ],
  //   bookStart: "",
  //   bookEnd: "",
  //   ticketOptions: [{ name: "", description: "", price: "" }],
  //   bankMaster: "",
  //   bankName: "",
  //   bankAccount: "",
  //      detailImages: [],
  //   detailText: "",
  //   // status: "DRAFT",
  //   })

    // API
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [show, setShow] = useState(null);

useEffect(() => {
  const fetchShow = async () => {
    if (!showId) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/manager/shows/${showId}/edit`, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      const data = await res.json();
      if (!res.ok || data.success !== true) throw new Error(data.message || "공연 조회 실패");
      setShow(data.data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchShow();
}, [showId]);


console.log('show:', show);  // 이 부분을 통해 실제 show 객체의 구조를 확인하세요
   // 수정된 데이터 저장 처리
  const handleEdit = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/manager/shows/${showId}/edit`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(show), // 수정된 데이터를 보내기
          credentials: "include",
        }
      );

      const result = await response.json();
      if (!response.ok) {
        addToast(result.message || "수정 실패", "error");
        return;
      }
      console.log(result);
      addToast("수정되었습니다!", "success");
      // 수정 후 localStorage 삭제
      localStorage.removeItem("createShowPayload");

      navigate("/homemanager", { replace: true });
    } catch (error) {
      console.error("수정 오류:", error);
      addToast("수정 중 오류 발생", "error");
    }
  };

   // initialData로 데이터 전달
  const handleUpdateFormData = (newData) => {
    setShow((prevShow) => ({
      ...prevShow,
      ...newData, // 새로운 데이터를 기존 show 상태에 합침
    }));
  };



  // 기존 임시 저장 데이터 불러오기
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("registerShowStep1"));
    if (saved?.poster) {
      setPreview(saved.poster);
    }
  }, []);

  return (
    <>
    <NavbarManager/>
      <Container>
        {/* <RegisterShowNavbar currentStep={5} /> */}
        <Title>공연 수정하기
          <p>* 상세 정보만 수정 가능합니다.</p>
        </Title>
        <RegisterShowStep2 editor={true} initialData={show} onUpdateFormData={handleUpdateFormData}/>

        <Footer>
          <RightButtonGroup>
           <NextButton onClick={handleEdit}>수정하기</NextButton>
            <NextButton onClick={() => navigate("/manageshow")}>완료</NextButton>
          </RightButtonGroup>
        </Footer>

        <Desc>* 아래는 수정이 불가합니다.</Desc>
        <ViewerBlock viewer={true}>
        <RegisterShowStep1  viewer={true} initialData={show}/>
        <RegisterShowStep3 viewer={true} initialData={show}/>
        <RegisterShowStep4 viewer={true} initialData={show}/>
        </ViewerBlock>
        
      </Container>
    </>
  );
};

export default EditShow;

const Title = styled.h1`
  font-weight: 500;
  font-size: 30px;
  color: #000000;
  padding: 50px 100px 0 100px;
  display: flex;
  gap: 5px;
  align-items: center;
      p{
    font-size: 15px;
    font-weight: 500;
    color: #999;
  }
`;

const Desc = styled.div`
  font-size: 25px;
  font-weight: 700;
  padding: 70px 100px;
  color: var(--color-primary);
`

const ViewerBlock = styled.div`
  pointer-events: ${({ viewer }) => (viewer ? "none" : "auto")};
  opacity: ${({ viewer }) => (viewer ? 0.9 : 1)};  /* 살짝 흐리게 */


  /* viewer 모드일 때 내부 input, select, textarea, button 비활성화 스타일 */
  ${({ viewer }) =>
    viewer &&
    `
    input, select, textarea{
      background: #f0f0f0 !important; 
      color: #888 !important;
      border-color: #ccc !important;
    }

    input[type="checkbox"] {
      opacity: 0.6; /* 체크 안 되어도 전체 연하게 */
    }

    input[type="checkbox"]:checked {
      opacity: 1; /* 체크된 항목만 진하게 */
    }

    label {
      color: #888; 
    }

    input[type="checkbox"]:checked + label {
      color: #333;
    }

    button {
      opacity: 0.6 !important;
      // background: #ddd !important; 
      // color: #888 !important;
    }
  `}
`;



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
    margin-left: auto;
`;


const NextButton = styled(NavButton)``;






