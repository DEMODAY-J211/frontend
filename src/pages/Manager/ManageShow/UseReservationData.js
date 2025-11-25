import { useEffect, useState } from "react";

export const useReservationData = (showId, showtimeId) => {
  const [reservationData, setReservationData] = useState([]);
  const [initialData, setInitialData] = useState([]);
  const [showTitle, setShowTitle] = useState("");
  const [showTimeList, setShowTimeList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservationData = async () => {
      if (!showId) return;

      try {
        setIsLoading(true);
        setError(null);

        // Query parameter 구성
        const queryParams = showtimeId ? `?showtimeId=${showtimeId}` : '';

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/manager/shows/${showId}/customers${queryParams}`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          }
        );

        const result = await response.json();

        console.log('=== API 응답 전체 ===');
        console.log('Full API Response:', result);

        if (!response.ok || result.success !== true) {
          throw new Error(result.message || '예매자 목록 조회 실패');
        }

        // API 응답 데이터 설정
        const { showTitle: apiShowTitle = "", showTimeList = [], selectedshowTime, selectedshowTimeId, reservationList = [] } = result.data;
        
        console.log('=== 파싱된 데이터 ===');
        console.log('회차 목록 (showTimeList):', showTimeList);
        console.log('선택된 회차 시간 (selectedshowTime):', selectedshowTime);
        console.log('선택된 회차 ID (selectedshowTimeId):', selectedshowTimeId);
        console.log('예매자 목록 (reservationList):', reservationList);
        console.log('예매자 수:', reservationList.length);

        // 각 예매자의 상태 확인
        if (reservationList.length > 0) {
          console.log('=== 예매자별 상태 확인 ===');
          reservationList.forEach((reservation, index) => {
            console.log(`예매자 ${index + 1}:`, {
              name: reservation.name,
              status: reservation.status,
              reservationId: reservation.reservationId,
              reservationNumber: reservation.reservationNumber,
            });
          });
        }
        setShowTitle(apiShowTitle);
        setShowTimeList(showTimeList);
        setReservationData(reservationList);
        setInitialData(JSON.parse(JSON.stringify(reservationList))); // 깊은 복사

      } catch (error) {
        console.error('Error fetching reservation data:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservationData();
  }, [showId, showtimeId]);

  return {
    reservationData,
    setReservationData,
    initialData,
    showTitle,
    showTimeList,
    isLoading,
    error,
  };
};
