import { useState, useEffect } from "react";
import styled from "styled-components";
import NavbarUser from "../../components/Navbar/NavbarUser";
import ShowListItem from "../../components/User/ShowListItem";
import { useNavigate, useLocation } from "react-router-dom";

const serverUrl = import.meta.env.VITE_API_URL;

export default function MyTicketList() {
  const location = useLocation();
  const navigate = useNavigate();
  const managerId = location.state?.managerId;

  const [activeTab, setActiveTab] = useState("예매확인/취소");
  const tabs = ["예매확인/취소", "지난 공연내역"];
  const [reservationlist, setReservationlist] = useState([]);
  const [managerData, setManagerData] = useState(null);

  console.log("managerId", managerId);
  const fetchShowList = async () => {
    try {
      // const token = localStorage.getItem("accessToken");
      // const response = await fetch(`${serverUrl}/user/${managerId}/myshow`, {
      //   credentials: "include",
      //   header: { "Content-Type": "application/json" },
      // });
      const response = await fetch(`${serverUrl}/user/${managerId}/myshow`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": "true",
        },
      });

      // const response = await fetch(
      //   `${serverUrl}/user/myshow?managerId=${managerId}&status=upcoming`,
      //   {
      //     method: "GET",
      //     credentials: "include",
      //     headers: {
      //       "Content-Type": "application/json",
      //       "Access-Control-Allow-Credentials": "true",
      //     },
      //   }
      // );
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setReservationlist(data.data);
        console.log("response", response);
        console.log("response의 data", data);
      }
    } catch (error) {
      console.error("예매한 공연 조회 실패:", error);
      alert("예매한 공연을 찾을 수 없습니다.");
    }
  };

  useEffect(() => {
    fetchShowList();
    console.log("NavbarUser(managerId):", managerId);
  }, []);

  return (
    <PageWrapper>
      <HomeUserContainer>
        <NavbarUser Backmode={true} text="내 예매 내역" />
        <TabWrapper>
          <TabContainer>
            {tabs.map((tab) => (
              <Tab
                key={tab}
                $active={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </Tab>
            ))}
          </TabContainer>
          <div>
            {activeTab === "예매확인/취소" && (
              <ShowListContainer>
                {reservationlist
                  ?.filter((r) => new Date(r.showtimeStart) > new Date()) // 현재 이후 공연만
                  .map((r) => (
                    <ShowListItem
                      key={r.reservationId}
                      reservation={r}
                      onClick={() => {
                        navigate("/viewshowdetail");
                      }}
                    />
                  ))}
              </ShowListContainer>
            )}
            {activeTab === "지난 공연내역" && (
              <ShowListContainer>
                {reservationlist
                  .filter((r) => new Date(r.showtimeStart) <= new Date()) // 현재 이전 공연만
                  .map((r) => (
                    <ShowListItem
                      key={r.reservationId}
                      reservation={r}
                      activeTab={activeTab}
                    />
                  ))}
              </ShowListContainer>
            )}
          </div>
        </TabWrapper>
      </HomeUserContainer>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  min-height: 100vh;
  // background-color: #fff;
  background-color: ${(props) => (props.$dimmed ? "rgba(0,0,0,0.2)" : "#fff")};
  transition: background-color 0.3s ease;

  color: #000;
  font-size: 20px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
`;

const HomeUserContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  // width: 393px;
  min-width: 375px;
  max-width: 430px;
  width: 100vw;
  align-items: flex-start;
  background: #fff;
  box-shadow: 0 0 30px 5px rgba(0, 0, 0, 0.25);
`;

const TabWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  height: 100vh;
`;

const TabContainer = styled.div`
  display: flex;
  padding: 0 20px;
  align-items: center;
  align-self: stretch;
  border-bottom: 1px solid #c0c0c0;
`;

const Tab = styled.div`
  display: flex;
  padding: 10px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-bottom: ${(props) => (props.$active ? "2px solid #fc2847" : "none")};
  color: ${(props) => (props.$active ? "#fc2847" : "#737373")};
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  cursor: pointer;
  transition: color 0.3s ease;
`;

const ContentWrapper = styled.div`
  display: flex;
  padding: 20px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  text-align: justify;
  font-size: 15px;
  font-weight: 300;
  line-height: 1.2;
  p {
    align-self: stretch;
    font-size: 20px;
    font-weight: 500;
  }
`;

const ShowListContainer = styled.div`
  display: flex;
  min-width: 375px;
  max-width: 430px;
  width: 100vw;
  padding: 20px;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;
