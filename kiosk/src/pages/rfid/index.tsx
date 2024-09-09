import styles from './rfid.module.css';  // 페이지 전용 스타일을 불러옴

export default function RFIDPage() {
  return (
    <div className={styles.container}>
      <h1>RFID Reader</h1>
      <p>Place your RFID tag near the reader.</p>
    </div>
  );
}
