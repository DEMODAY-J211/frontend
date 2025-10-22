import React from "react";
import { Route, Routes } from "react-router-dom";

//여기서부터 자기 이름 밑으로 import 하기!!
// 예시: import Login from './pages/Login.jsx';

//오서현
import HomeUser from "../src/pages/user/HomeUser";

//이예나

//주현수

const App = () => {
  return (
    <div>
      <Routes>
        {/* 예시: <Route path='/mypage/festival' element={<MyPage/>}/> */}
        <Route path="/user" element={<HomeUser />} />
      </Routes>
    </div>
  );
};

export default App;
