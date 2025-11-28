import { useState, useEffect } from "react";
import styled from "styled-components";
import NavbarUser from "../../components/Navbar/NavbarUser";
import ShowListItem from "../../components/User/ShowListItem";
import { useNavigate, useLocation, useParams } from "react-router-dom";

const serverUrl = import.meta.env.VITE_API_URL;

export default function MyTicketList() {
  const navigate = useNavigate();
  const { managerId } = useParams();
  // const managerId = location.state?.managerId;
  const [activeTab, setActiveTab] = useState("예매확인/취소");
  const tabs = ["예매확인/취소", "지난 공연내역"];
  const [reservationlist, setReservationlist] = useState([]);
  const fetchShowList = async () => {
    try {
      // const token = localStorage.getItem("accessToken");

      const response = await fetch(`${serverUrl}/user/${managerId}/myshow`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": "true",
        },
      });

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
      // alert("예매한 공연을 찾을 수 없습니다.");
    }
  };

  useEffect(() => {
    fetchShowList();
    // console.log("NavbarUser(managerId):", managerId);
  }, []);

  return (
    <PageWrapper>
      <HomeUserContainer>
        <NavbarUser
          Backmode={true}
          text="내 예매 내역"
          nav={`/${managerId}/homeuser`}
        />
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
          <ScrollableContent>
            {activeTab === "예매확인/취소" && (
              <ShowListContainer>
                {reservationlist
                  ?.filter((r) => new Date(r.showtimeStart) > new Date()) // 현재 이후 공연만
                  .sort((a, b) => {
                    // 1. 취소 여부 비교
                    if (a.status !== "CANCELED" && b.status === "CANCELED")
                      return -1;
                    if (a.status === "CANCELED" && b.status !== "CANCELED")
                      return 1;

                    // 2. 같은 그룹 내에서 reservationId 역순 정렬
                    return b.reservationId - a.reservationId;
                  })
                  .map((r) => (
                    <ShowListItem
                      key={r.reservationId}
                      reservation={r}
                      onClick={() => {
                        navigate(`${managerId}/viewshowdetail`);
                      }}
                    />
                  ))}
              </ShowListContainer>
            )}
            {activeTab === "지난 공연내역" && (
              <ShowListContainer>
                {reservationlist
                  .filter((r) => new Date(r.showtimeStart) <= new Date()) // 현재 이전 공연만
                  .sort((a, b) => {
                    // 1. 취소 여부 비교
                    if (a.status !== "CANCELED" && b.status === "CANCELED")
                      return -1;
                    if (a.status === "CANCELED" && b.status !== "CANCELED")
                      return 1;

                    // 2. 같은 그룹 내에서 reservationId 역순 정렬
                    return b.reservationId - a.reservationId;
                  })
                  .map((r) => (
                    <ShowListItem
                      key={r.reservationId}
                      reservation={{ ...r, reservationStatus: "AFTERSHOW" }}
                      activeTab={activeTab}
                    />
                  ))}
              </ShowListContainer>
            )}
          </ScrollableContent>
        </TabWrapper>
      </HomeUserContainer>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  // min-height: 100vh;
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
  flex: 1; // 남은 공간을 차지
  width: 100%;
`;

const ScrollableContent = styled.div`
  flex: 1; // TabWrapper 내 남은 공간
  min-height: 100vh;
  overflow-y: auto; // 스크롤 가능
  width: 100%;
  display: flex;
  flex-direction: column;
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
