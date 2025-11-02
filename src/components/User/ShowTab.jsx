import { useState } from "react";
import styled from "styled-components";
import TeamInfo from "./TeamInfo";

export default function ShowTab({ hasGroupInfo = true, showDetailText = "" }) {
  const [activeTab, setActiveTab] = useState(
    hasGroupInfo ? "공연상세" : "예매확인/취소"
  );
  const tabs = hasGroupInfo
    ? ["공연상세", "판매정보", "단체소개"]
    : ["예매확인/취소", "지난 공연내역"];
  return (
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
        {activeTab === "공연상세" && (
          <ContentWrapper>{showDetailText}</ContentWrapper>
        )}
        {activeTab === "판매정보" && (
          <ContentWrapper>
            <p>티킷타 서비스 티켓 종류 안내 </p>
            예매시에 공연 관리자가 안내하는 입금계좌로 입금하시고, 공연 관리자의
            입금 확인을 통해 티켓을 발급 받으실 수 있습니다. 공연 관리자가
            입금을 확인해야 하므로 티켓 발급까지 시간이 걸릴 수 있습니다. 입금
            확인 시 예매 확정 문자를 보내 드립니다.
            <br />
            <p>티켓 수령 안내 </p>
            티킷타 서비스를 통해 티켓을 예매하면 공연 시작 1시간 전, 서비스
            내에서 조회가능한 QR코드 형태로 티켓이 발급됩니다. 해당 티켓의
            QR코드는 내 예매 내역/모바일 티켓에서 조회가능합니다. 공연 입장시
            빠른 입장을 위해 QR코드를 미리 준비해 주세요
            <br />
            <p>티켓 환불 안내 </p>
            공연이라는 상품의 특성상 공연이 종료되면 상품 가치가 소멸합니다.
            따라서 공연 시작 이후에는 환불이 어렵습니다. 공연 시작 시간은 각
            공연 상세 페이지에서 확인하실 수 있습니다. 취소 수수료는 따로
            없습니다. 환불은 공연 종료 후 영업일 기준 4~5일 이내에 일괄
            환불됩니다.
          </ContentWrapper>
        )}
        {activeTab === "단체소개" && <TeamInfo />}
      </div>
    </TabWrapper>
  );
}

const TabWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
`;

const TabContainer = styled.div`
  display: flex;
  width: 100%;
  padding: 0 20px;
  align-items: center;
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
