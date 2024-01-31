import styles from './confirmpopup-styles.module.css'

export function ConfirmationPopup({ isOpen, message='are you sure?', handleConfirm, handleCancel }) {
  if (!isOpen) {
      return null;
  }

  return (
      <div className={styles.popup}>
        <h2>{message}</h2>

        <button onClick={handleCancel}>no</button>
        <button onClick={handleConfirm}>yes</button>
      </div>
  );
};