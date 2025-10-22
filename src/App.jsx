import React from "react";
import { Route, Routes } from "react-router-dom";

//여기서부터 자기 이름 밑으로 import 하기!!
// 예시: import Login from './pages/Login.jsx';

//오서현
import HomeUser from "./pages/User/HomeUser";

//이예나
import NavbarManager from "./components/Navbar/NavbarManager";
import HomeManager from "./pages/Manager/HomeManager";

//주현수

const App = () => {
  return (
    <div>
      <Routes>
        {/* 예시: <Route path='/mypage/festival' element={<MyPage/>}/> */}
        {/* 오서현 */}
        <Route path="/homeuser" element={<HomeUser />} />

        {/* 이예나 */}
        {/* <Route path='/navbarmanager' element={<NavbarManager/>}/> */}
        <Route path="/homemanager" element={<HomeManager />} />

        {/* 주현수 */}
      </Routes>
    </div>
  );
};

export default App;
