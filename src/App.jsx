import React from "react";
import { Route, Routes } from "react-router-dom";

//여기서부터 자기 이름 밑으로 import 하기!!
// 예시: import Login from './pages/Login.jsx';

//오서현
import Login from "./pages/Login";
import HomeUser from "./pages/User/HomeUser";
import ViewShowDetail from "./pages/User/ViewShowDetail";
import ViewTeamInfo from "./pages/User/ViewTeamInfo";
import SelectSeat from "./pages/User/SelectSeat";
import MyTicketList from "./pages/User/MyTicketList";
import CheckTicket from "./pages/User/CheckTicket";
import MobileTicket from "./pages/User/MobileTicket";

//이예나
import NavbarManager from "./components/Navbar/NavbarManager";
import HomeManager from "./pages/Manager/HomeManager";
import ManageShow from "./pages/Manager/ManageShow/ManageShow";
import ManageUser from "./pages/Manager/ManageShow/ManageUser";
import ViewEntryStatus from "./pages/Manager/ManageShow/ViewEntryStatus";
import QRManager from "./pages/Manager/QRManager";
import BuyTicket from "./pages/User/BuyTicket";

//주현수

const App = () => {
  return (
    <div>
      <Routes>
        {/* 예시: <Route path='/mypage/festival' element={<MyPage/>}/> */}
        {/* 오서현 */}
        <Route path="/login" element={<Login />} />
        <Route path="/homeuser" element={<HomeUser />} />
        <Route path="/viewshowdetail" element={<ViewShowDetail />} />
        <Route path="/buyticket" element={<BuyTicket />} />
        <Route path="/viewteaminfo" element={<ViewTeamInfo />} />
        <Route path="/myticketlist" element={<MyTicketList />} />
        <Route path="/checkticket" element={<CheckTicket />} />
        <Route path="/mobileticket" element={<MobileTicket />} />

        {/* 이예나 */}
        {/* <Route path='/navbarmanager' element={<NavbarManager/>}/> */}
        <Route path="/homemanager" element={<HomeManager />} />
        <Route path="/manageshow" element={<ManageShow />} />
        <Route path="/manageshow/manageuser" element={<ManageUser />} />
        <Route path="/qrmanager" element={<QRManager />} />

        {/* 주현수 */}
        <Route path="/manageshow/entrystatus" element={<ViewEntryStatus />} />
        <Route path="/selectseat/:showtimeId" element={<SelectSeat />} />
      </Routes>
    </div>
  );
};

export default App;
