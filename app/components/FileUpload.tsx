import { useState } from 'react';
import Button from './button';
import styles from '../styles/fileUpload.module.css';

export default function FileUpload({ title, handleUploadedFile, t }) {
  const [file, setFile] = useState(null);

  function handleFileSelection(event) {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  }

  function handleFileUpload() {
    handleUploadedFile(file);
  }

  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <div className="horizontal_container">
        <form onSubmit={handleSubmit}>
        <label htmlFor="file-upload" className={styles.file_upload}>
            <i className="fas fa-cloud-upload-alt"></i>
            <img className={styles.file_upload_icon} src="/icons/upload_file.svg" />
            <div className="horizontal_spacer"/>
            {file ? (
                <p className="truncated">{t('selectedFile')} {file.name}</p>
            ) :
            (
                <p className="truncated">{t('noFileSelected')}</p>
            )}
            </label>
        <input id="file-upload" className={styles.file_input} type="file" name="file" onChange={handleFileSelection} />
        </form>
        <div className="horizontal_spacer"/>
        <Button type="submit" title={title} isDisabled={file == null} onClick={handleFileUpload} />
    </div>
  );
}