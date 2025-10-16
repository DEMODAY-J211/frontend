export function formatKoreanDate(dateString) {
  const utc = new Date(dateString);
  const koreaTime = new Date(utc.getTime() + 9 * 60 * 60 * 1000); // UTC+9 변환

  const year = koreaTime.getFullYear();
  const month = String(koreaTime.getMonth() + 1).padStart(2, "0");
  const day = String(koreaTime.getDate()).padStart(2, "0");
  const hours = String(koreaTime.getHours()).padStart(2, "0");
  const minutes = String(koreaTime.getMinutes()).padStart(2, "0");

  return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;
}
