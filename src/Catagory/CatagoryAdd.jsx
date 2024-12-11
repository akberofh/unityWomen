import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAddCatagoryMutation } from '../redux/slices/catagoryApiSlice';
import styles from '../pages/addTodo/AddNewTodo.module.css';

const CatagoryAdd = () => {
  const [title, setTitle] = useState('');

  const [photo, setPhoto] = useState(null); 
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [addQolbaq] = useAddCatagoryMutation();

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', title);
      if (photo) formData.append('photo', photo);

      const newQolbaq = await addQolbaq(formData).unwrap();

      setTimeout(() => {
        dispatch({ type: 'qolbaq/addQolbaq', payload: newQolbaq });
      }, 1000);

      navigate('/kategori');
    } catch (err) {
      console.error('Failed to add the todo:', err);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Yeni Məhsul</h2>
      <form onSubmit={handleSubmit} className={styles.form} encType="multipart/form-data">
        <div className={styles.inputGroup}>
          <label htmlFor="title">Ad:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="photo">Şəkil:</label>
          <input
            type="file"
            id="photo"
            onChange={handlePhotoChange}
            className={styles.fileInput}
          />
        </div>
        <div className={styles.buttons}>
          <button type="submit" className={styles.submitButton}>Yükləyin</button>
          <button type="button" onClick={() => navigate('/catagoryadd')} className={styles.cancelButton}>Çıxış</button>

        </div>
      </form>
    </div>
  );
};

export default CatagoryAdd;
