import React from "react";
import { Route, Routes } from "react-router-dom";
import { ToastProvider } from "./components/Toast/ToastProvider";

//여기서부터 자기 이름 밑으로 import 하기!!
// 예시: import Login from './pages/Login.jsx';

//오서현
import { AuthProvider } from "./pages/Auth/AuthContext";
import Login from "./pages/Login";
import HomeUser from "./pages/User/HomeUser";
import ViewShowDetail from "./pages/User/ViewShowDetail";
import ViewTeamInfo from "./pages/User/ViewTeamInfo";
import MyTicketList from "./pages/User/MyTicketList";
import CheckTicket from "./pages/User/CheckTicket";
import MobileTicket from "./pages/User/MobileTicket";

//이예나
import NavbarManager from "./components/Navbar/NavbarManager";
import HomeManager from "./pages/Manager/HomeManager";
import ManageShow from "./pages/Manager/ManageShow/ManageShow";
import ManageUser from "./pages/Manager/ManageShow/ManageUser";
import QRManager from "./pages/Manager/QRManager";
import BuyTicket from "./pages/User/BuyTicket";
import Landing from "./pages/Landing";

//주현수
import SelectSeat from "./pages/User/SelectSeat";
import ViewEntryStatus from "./pages/Manager/ManageShow/ViewEntryStatus";
import RegisterShowStep3 from "./pages/Manager/ManageShow/RegisterShowStep3";
import RegisterVenue1 from "./pages/Manager/ManageShow/RegisterVenue1";
import RegisterVenue2 from "./pages/Manager/ManageShow/RegisterVenue2";
import RegisterVenue3 from "./pages/Manager/ManageShow/RegisterVenue3";
import KakaoCallback from "./pages/Auth/KakaoCallback";

const App = () => {
  return (
    <div>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* 예시: <Route path='/mypage/festival' element={<MyPage/>}/> */}
            {/* 오서현 */}
            <Route path="/login" element={<Login />} />
            <Route path="/homeuser" element={<HomeUser />} />
            <Route
              path="/viewshowdetail/:showId"
              element={<ViewShowDetail />}
            />
            <Route path="/payment" element={<BuyTicket />} />
            <Route path="/viewteaminfo" element={<ViewTeamInfo />} />
            <Route path="/myticketlist" element={<MyTicketList />} />
            <Route
              path="/checkticket/:reservationId"
              element={<CheckTicket />}
            />
            <Route
              path="/mobileticket/:reservationId"
              element={<MobileTicket />}
            />

            {/* 이예나 */}
            {/* <Route path='/navbarmanager' element={<NavbarManager/>}/> */}
            <Route path="/homemanager" element={<HomeManager />} />
            <Route path="/manageshow" element={<ManageShow />} />
            <Route path="/manageshow/manageuser" element={<ManageUser />} />
            <Route path="/qrmanager" element={<QRManager />} />
            <Route path="/landing" element={<Landing />} />

            {/* 주현수 */}
            <Route
              path="/manageshow/entrystatus"
              element={<ViewEntryStatus />}
            />
            <Route path="/selectseat/:showtimeId" element={<SelectSeat />} />
            <Route
              path="/register-show/step3"
              element={<RegisterShowStep3 />}
            />
            <Route path="/register-venue/step1" element={<RegisterVenue1 />} />
            <Route path="/register-venue/step2" element={<RegisterVenue2 />} />
            <Route path="/register-venue/step3" element={<RegisterVenue3 />} />
            <Route path="/auth/kakao/callback" element={<KakaoCallback />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </div>
  );
};

export default App;
