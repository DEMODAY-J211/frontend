import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { ToastProvider } from "./components/Toast/ToastProvider";

//여기서부터 자기 이름 밑으로 import 하기!!
// 예시: import Login from './pages/Login.jsx';

//오서현
import { AuthProvider, useAuth } from "./pages/Auth/AuthContext";
import Login from "./pages/Login";
import HomeUser from "./pages/User/HomeUser";
import ViewShowDetail from "./pages/User/ViewShowDetail";
import ViewTeamInfo from "./pages/User/ViewTeamInfo";
import MyTicketList from "./pages/User/MyTicketList";
import CheckTicket from "./pages/User/CheckTicket";
import MobileTicket from "./pages/User/MobileTicket";
import BuyTicket from "./pages/User/BuyTicket";

//이예나
import NavbarManager from "./components/Navbar/NavbarManager";
import HomeManager from "./pages/Manager/HomeManager";
import ManageShow from "./pages/Manager/ManageShow/ManageShow";
import ManageUser from "./pages/Manager/ManageShow/ManageUser";
import QRManager from "./pages/Manager/QRManager";
import RegisterShow from "./pages/Manager/RegisterShow";
import Landing from "./pages/Landing";
import WriteTeamInfo from "./pages/Manager/WriteTeamInfo";
import RegisterShowStep1 from "./pages/Manager/RegisterShow/RegisterShowStep1";
import RegisterShowStep4 from "./pages/Manager/RegisterShow/RegisterShowStep4";
import RegisterShowStep2 from "./pages/Manager/RegisterShow/RegisterShowStep2";
import RegisterShowStep5 from "./pages/Manager/RegisterShow/RegisterShowStep5";

//주현수
import SelectSeat from "./pages/User/SelectSeat";
import ViewEntryStatus from "./pages/Manager/ManageShow/ViewEntryStatus";
import RegisterShowStep3 from "./pages/Manager/RegisterShow/RegisterShowStep3";
import RegisterVenue1 from "./pages/Manager/ManageShow/RegisterVenue1";
import RegisterVenue2 from "./pages/Manager/ManageShow/RegisterVenue2";
import RegisterVenue3 from "./pages/Manager/ManageShow/RegisterVenue3";
import KakaoCallback from "./pages/Auth/KakaoCallback";

// Protected Route 컴포넌트
const ProtectedRoute = ({ element: Element, ...rest }) => {
  const { isLoggedIn, isInitialized } = useAuth();

  // AuthContext 초기화 대기 중
  if (!isInitialized) {
    return null; // 또는 로딩 스피너
  }

  return isLoggedIn ? (
    <Element {...rest} />
  ) : (
    <Navigate to="/login" replace />
  );
};
import RegisteredVenues from "./pages/Manager/RegisteredVenues";



const App = () => {
  return (
    <div>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* 루트 경로를 로그인으로 리다이렉트 */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* 비보호 라우트: 로그인, 카카오 콜백, 랜딩 */}
            <Route path="/login" element={<Login />} />
            <Route path="/auth/kakao/callback" element={<KakaoCallback />} />
            <Route path="/landing" element={<Landing />} />

            {/* 보호된 라우트: User */}
            <Route path="/homeuser" element={<ProtectedRoute element={HomeUser} />} />
            <Route
              path="/viewshowdetail/:showId"
              element={<ProtectedRoute element={ViewShowDetail} />}
            />
            <Route path="/payment" element={<ProtectedRoute element={BuyTicket} />} />
            <Route path="/viewteaminfo" element={<ProtectedRoute element={ViewTeamInfo} />} />
            <Route path="/myticketlist" element={<ProtectedRoute element={MyTicketList} />} />
            <Route
              path="/checkticket/:reservationId"
              element={<ProtectedRoute element={CheckTicket} />}
            />
            <Route
              path="/mobileticket/:reservationId"
              element={<ProtectedRoute element={MobileTicket} />}
            />
            <Route path="/selectseat/:showtimeId" element={<ProtectedRoute element={SelectSeat} />} />

            {/* 보호된 라우트: Manager */}
            <Route path='/navbarmanager' element={<ProtectedRoute element={NavbarManager} />}/>
            <Route path="/homemanager" element={<ProtectedRoute element={HomeManager} />} />
            <Route path="/manageshow" element={<ProtectedRoute element={ManageShow} />} />
            <Route path="/manageshow/manageuser/:showId" element={<ProtectedRoute element={ManageUser} />} />
            <Route path="/manageshow/entrystatus/:showId" element={<ProtectedRoute element={ViewEntryStatus} />} />
            <Route path="/qrmanager/:showId" element={<ProtectedRoute element={QRManager} />} />
            <Route path="/registershow" element={<ProtectedRoute element={RegisterShow} />} />
            <Route path="/register-show/step1" element={<ProtectedRoute element={RegisterShowStep1} />} />
            <Route path="/register-show/step2" element={<ProtectedRoute element={RegisterShowStep2} />} />
            <Route path="/register-show/step3" element={<ProtectedRoute element={RegisterShowStep3} />} />
            <Route path="/register-show/step4" element={<ProtectedRoute element={RegisterShowStep4} />} />
            <Route path="/register-show/step5" element={<ProtectedRoute element={RegisterShowStep5} />} />
            <Route path="/register-venue/step1" element={<ProtectedRoute element={RegisterVenue1} />} />
            <Route path="/register-venue/step2" element={<ProtectedRoute element={RegisterVenue2} />} />
            <Route path="/register-venue/step3" element={<ProtectedRoute element={RegisterVenue3} />} />
            <Route path="/registeredvenues" element={<ProtectedRoute element={RegisteredVenues} />} />
            <Route path="/write-teaminfo" element={<ProtectedRoute element={WriteTeamInfo} />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </div>
  );
};

export default App;
