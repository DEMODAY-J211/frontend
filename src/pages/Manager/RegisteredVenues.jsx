import React, { useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { BiSearch } from 'react-icons/bi'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'
import NavbarManager from '../../components/Navbar/NavbarManager'

// 임시 데이터
const MOCK_VENUES = [
  {
    id: '1',
    name: '대학로 소극장',
    address: '서울시 종로구 대학로 123',
    capacity: '1층 150석',
    thumbnail: '',
    image: '',
    isFavorite: true,
    floorCount: 1,
    seatCount: 150
  },
  {
    id: '2',
    name: '아트홀 서울',
    address: '서울시 강남구 테헤란로 456',
    capacity: '2층 300석',
    thumbnail: '',
    image: '',
    isFavorite: false,
    floorCount: 2,
    seatCount: 300
  },
  {
    id: '3',
    name: '문화예술극장',
    address: '서울시 마포구 월드컵로 789',
    capacity: '1층 200석',
    thumbnail: '',
    image: '',
    isFavorite: false,
    floorCount: 1,
    seatCount: 200
  }
]

const RegisteredVenues = () => {
  const navigate = useNavigate()
  const [venues, setVenues] = useState(MOCK_VENUES)
  const [selectedVenue, setSelectedVenue] = useState(MOCK_VENUES[0])
  const [searchQuery, setSearchQuery] = useState('')

  const handleToggleFavorite = (venueId) => {
    setVenues(prev =>
      prev.map(venue =>
        venue.id === venueId
          ? { ...venue, isFavorite: !venue.isFavorite }
          : venue
      )
    )

    // 선택된 공연장의 즐겨찾기 상태도 업데이트
    if (selectedVenue?.id === venueId) {
      setSelectedVenue(prev => ({ ...prev, isFavorite: !prev.isFavorite }))
    }
  }

  const handleSelectVenue = (venue) => {
    setSelectedVenue(venue)
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const filteredVenues = venues.filter(venue =>
    venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    venue.address.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSave = () => {
    console.log('저장된 공연장:', selectedVenue)
    // 선택한 공연장 정보를 localStorage에 저장
    if (selectedVenue) {
      localStorage.setItem('selectedVenue', JSON.stringify(selectedVenue))
    }
    // TODO: API 호출하여 공연장 저장
    navigate(-1)
  }

  const handlePrevious = () => {
    navigate(-1)
  }

  const handleRegister = () => {
    navigate('/register-venue/step1')
  }

  return (
    <Container>
      <NavbarManager />

      <MainContent>
        <PageTitle>등록된 공연장</PageTitle>

        <ContentLayout>
          {/* 좌측: 검색 및 리스트 */}
          <LeftSection>
            <SearchContainer>
              <SearchInput
                type="text"
                placeholder="검색어를 입력하세요."
                value={searchQuery}
                onChange={handleSearch}
              />
              <SearchIcon>
                <BiSearch size={24} />
              </SearchIcon>
            </SearchContainer>

            <VenueListContainer>
              {filteredVenues.length > 0 ? (
                filteredVenues.map((venue) => (
                  <VenueCard
                    key={venue.id}
                    onClick={() => handleSelectVenue(venue)}
                    isSelected={selectedVenue?.id === venue.id}
                  >
                    <VenueThumbnail>
                      {venue.thumbnail ? (
                        <img src={venue.thumbnail} alt={venue.name} />
                      ) : (
                        <PlaceholderText>이미지 없음</PlaceholderText>
                      )}
                    </VenueThumbnail>

                    <VenueInfo>
                      <VenueName>{venue.name}</VenueName>
                      <VenueAddress>{venue.address}</VenueAddress>
                      <VenueCapacity>{venue.capacity}</VenueCapacity>
                    </VenueInfo>

                    <FavoriteIcon
                      onClick={(e) => {
                        e.stopPropagation()
                        handleToggleFavorite(venue.id)
                      }}
                    >
                      {venue.isFavorite ? (
                        <AiFillStar size={32} color="#FC2847" />
                      ) : (
                        <AiOutlineStar size={32} color="#FC2847" />
                      )}
                    </FavoriteIcon>
                  </VenueCard>
                ))
              ) : (
                <EmptySearchState>
                  <EmptyMessage>
                    해당 공연장을 찾을 수 없어요.
                    <br />
                    새로 등록하시겠어요?
                  </EmptyMessage>
                  <RegisterButton onClick={handleRegister}>
                    등록하기
                  </RegisterButton>
                </EmptySearchState>
              )}
            </VenueListContainer>

            {filteredVenues.length > 0 && (
              <BottomSection>
                <NoticeText>찾으시는 공연장이 없다면?</NoticeText>
                <RegisterButton onClick={handleRegister}>
                  등록하기
                </RegisterButton>
              </BottomSection>
            )}
          </LeftSection>

          {/* 우측: 공연장 상세 */}
          {filteredVenues.length > 0 && (
            <RightSection>
              {selectedVenue ? (
                <>
                  <VenueImage>
                    {selectedVenue.image ? (
                      <img src={selectedVenue.image} alt={selectedVenue.name} />
                    ) : (
                      <PlaceholderText>이미지 없음</PlaceholderText>
                    )}
                  </VenueImage>

                  <VenueDetailSection>
                    <VenueDetailHeader>
                      <VenueDetailLeft>
                        <VenueDetailName>{selectedVenue.name}</VenueDetailName>
                        <VenueDetailAddress>{selectedVenue.address}</VenueDetailAddress>
                      </VenueDetailLeft>

                      <FavoriteIconLarge
                        onClick={() => handleToggleFavorite(selectedVenue.id)}
                      >
                        {selectedVenue.isFavorite ? (
                          <AiFillStar size={32} color="#FC2847" />
                        ) : (
                          <AiOutlineStar size={32} color="#FC2847" />
                        )}
                      </FavoriteIconLarge>
                    </VenueDetailHeader>

                    <VenueDetailInfo>
                      <InfoLabel>좌석 수</InfoLabel>
                      <InfoContent>{selectedVenue.capacity}</InfoContent>
                    </VenueDetailInfo>
                  </VenueDetailSection>
                </>
              ) : (
                <EmptyState>공연장을 선택해주세요</EmptyState>
              )}
            </RightSection>
          )}
        </ContentLayout>
      </MainContent>

      <Footer>
        <PreviousButton onClick={handlePrevious}>
          ← 이전
        </PreviousButton>
        <SaveButton onClick={handleSave}>
          저장하기
        </SaveButton>
      </Footer>
    </Container>
  )
}

export default RegisteredVenues

// Styled Components
const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: white;
  display: flex;
  flex-direction: column;
`

const MainContent = styled.div`
  flex: 1;
  padding: 20px 100px 0px;
`

const PageTitle = styled.h1`
  font-size: 30px;
  font-weight: 500;
  color: #333;
  margin-bottom: 18px;
`

const ContentLayout = styled.div`
  display: flex;
  gap: 18px;
`

// 좌측 섹션
const LeftSection = styled.div`
  width: 543px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const SearchContainer = styled.div`
  position: relative;
  width: 544px;
`

const SearchInput = styled.input`
  width: 100%;
  background: white;
  border: 1px solid #C5C5C5;
  border-radius: 16px;
  padding: 10px 20px;
  padding-right: 50px;
  font-family: inherit;
  font-size: 20px;
  font-weight: 300;
  color: black;

  &::placeholder {
    color: black;
  }

  &:focus {
    outline: none;
    border-color: #FC2847;
  }
`

const SearchIcon = styled.div`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: black;
  pointer-events: none;
`

const VenueListContainer = styled.div`
  background: white;
  border-right: 1px solid #787878;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  min-height: 561px;
  max-height: 561px;
  overflow-y: auto;
`

const EmptySearchState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 14px;
`

const EmptyMessage = styled.div`
  font-size: 25px;
  font-weight: 300;
  color: black;
  text-align: center;
  line-height: normal;
`

const VenueCard = styled.div`
  display: flex;
  align-items: center;
  gap: 25px;
  cursor: pointer;
  padding: 10px;
  border-radius: 15px;
  transition: background-color 0.2s ease;
  background-color: ${props => props.isSelected ? '#FFF1F0' : 'transparent'};

  &:hover {
    background-color: #FFF1F0;
  }
`

const VenueThumbnail = styled.div`
  width: 141px;
  height: 141px;
  background: white;
  border-radius: 15px;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const PlaceholderText = styled.div`
  font-size: 14px;
  font-weight: 300;
  color: #C5C5C5;
  text-align: center;
`

const VenueInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 11px;
`

const VenueName = styled.div`
  font-size: 25px;
  font-weight: 500;
  color: black;
`

const VenueAddress = styled.div`
  font-size: 20px;
  font-weight: 500;
  color: #4E4E4E;
  margin-bottom: 25px;
`

const VenueCapacity = styled.div`
  font-size: 20px;
  font-weight: 500;
  color: #4E4E4E;
`

const FavoriteIcon = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &:hover {
    opacity: 0.8;
  }
`

const BottomSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 18px;
`

const NoticeText = styled.div`
  font-size: 20px;
  font-weight: 300;
  color: black;
`

const RegisterButton = styled.button`
  background: #FC2847;
  color: #FFFFFE;
  font-size: 20px;
  font-weight: 500;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`

// 우측 섹션
const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 20px;
`

const VenueImage = styled.div`
  width: 100%;
  height: 388px;
  background: white;
  border-radius: 20px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const VenueDetailSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 17px;
`

const VenueDetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 20px;
  border-bottom: 1px solid #787878;
`

const VenueDetailLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`

const VenueDetailName = styled.div`
  font-size: 40px;
  font-weight: 500;
  color: black;
`

const VenueDetailAddress = styled.div`
  font-size: 20px;
  font-weight: 500;
  color: #4E4E4E;
`

const FavoriteIconLarge = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.8;
  }
`

const VenueDetailInfo = styled.div`
  display: flex;
  gap: 76px;
  font-size: 20px;
  font-weight: 500;
  color: #4E4E4E;
`

const InfoLabel = styled.div`
  width: 177px;
`

const InfoContent = styled.div`
  width: 316px;
`

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 24px;
  font-weight: 300;
  color: #C5C5C5;
`

// Footer
const Footer = styled.div`
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const PreviousButton = styled.button`
  background: #FC2847;
  color: #FFFFFE;
  font-size: 20px;
  font-weight: 300;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`

const SaveButton = styled.button`
  background: #FC2847;
  color: #FFFFFE;
  font-size: 20px;
  font-weight: 300;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`
