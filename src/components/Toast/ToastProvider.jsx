// ToastProvider.jsx
import React, { useState, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import { ToastContext } from "./ToastContext";
import toast_icon from '../../assets/homemanager/tikitta_linkicon.png'

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeOut = keyframes`
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(20px); }
`;



export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [toastCounter, setToastCounter] = useState(0);

  const addToast = useCallback((message, type = "info") => {
    const id = `${Date.now()}-${toastCounter}`;
    setToastCounter((prev) => prev + 1);
    setToasts((prev) => [...prev, { id, message, type, leaving: false }]);

    // 2초 후 페이드 아웃 시작
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, leaving: true } : t))
      );
    }, 2000);

    // 2.5초 후 DOM에서 제거
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 2500);
  }, [toastCounter]);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer>
        {toasts.map((t) => (
          <ToastMessage key={t.id} type={t.type} leaving={t.leaving ? "true" : undefined}>
            <ToastIcon src={toast_icon} alt="toast icon" />
            <ToastText>{t.message}</ToastText>
          </ToastMessage>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};


const ToastContainer = styled.div`
  position: fixed;
  bottom: 30px;
  right: 30px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 9999;
`;

const ToastMessage = styled.div`
  padding: 12px 22px;
  border-radius: 20px;
  font-weight: 700;
  color: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  background: ${({ type }) =>
    type === "success"
      ? "var(--color-primary)"
      : type === "error"
      ? "#e74c3c"
      : "#3498db"};
  display: flex;
  align-items: center;
  gap: 15px;

  /* leaving 상태에 따라 애니메이션만 바꾸기 */
  animation-name: ${({ leaving }) => (leaving ? fadeOut : fadeInUp)};
  animation-duration: ${({ leaving }) => (leaving ? "0.5s" : "0.3s")};
  animation-fill-mode: forwards;
  animation-timing-function: ease-out;
`;





const ToastText = styled.span`
  text-align: center;
  padding: 0 20px;
`;


const ToastIcon = styled.img`

`;
