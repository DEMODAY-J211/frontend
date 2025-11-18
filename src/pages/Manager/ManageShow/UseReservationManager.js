import { useState, useEffect } from "react";

export const useReservationManager = (initialData) => {
  const [reservationData, setReservationData] = useState(initialData);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [changedUsers, setChangedUsers] = useState([]);
  const [isChanged, setIsChanged] = useState(false);

  // 개별 체크박스
  const toggleSelectUser = (user) => {
    setSelectedUsers((prev) =>
      prev.find((u) => u.reservationId === user.reservationId)
        ? prev.filter((u) => u.reservationId !== user.reservationId)
        : [...prev, user]
    );
  };

  // 전체 선택
  const toggleSelectAll = (data, checked) => {
    setSelectedUsers(checked ? data : []);
  };

  // 상태 변경
  const updateStatus = (reservationId, newStatus) => {
    const updated = reservationData.map((item) => {
      const isMulti = selectedUsers.length > 0;
      const shouldUpdate = isMulti
        ? selectedUsers.some(u => u.reservationId === item.reservationId)
        : item.reservationId === reservationId;

      return shouldUpdate ? { ...item, status: newStatus } : item;
    });

    setReservationData(updated);
    setIsChanged(true);

    // 변경된 것만 필터링
    const diff = updated.filter((item) => {
      const original = initialData.find(
        (u) => u.reservationId === item.reservationId
      );
      return original.status !== item.status;
    });

    setChangedUsers(diff);
  };

  // 저장 처리
  const saveChanges = () => {
    console.log("저장됨:", changedUsers);
    setIsChanged(false);
    setChangedUsers([]);
  };

  return {
    reservationData,
    setReservationData,
    selectedUsers,
    changedUsers,
    isChanged,
    toggleSelectUser,
    toggleSelectAll,
    updateStatus,
    saveChanges,
  };
};
