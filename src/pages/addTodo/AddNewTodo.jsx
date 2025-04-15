import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAddsTodoMutation } from '../../redux/slices/todoApiSlice';
import styles from './AddNewTodo.module.css';

const AddNewTodo = () => {
  const [title, setTitle] = useState('');
  const [stock, setStock] = useState('');
  const [catagory, setCatagory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [photo, setPhoto] = useState(null); // New state for photo
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [addQolbaq] = useAddsTodoMutation();

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('price', price);
      formData.append('catagory', catagory);
      formData.append('stock', stock);
      formData.append('description', description);
      if (photo) formData.append('photo', photo);

      const newQolbaq = await addQolbaq(formData).unwrap();

      setTimeout(() => {
        dispatch({ type: 'todo/addTodo', payload: newQolbaq });
      }, 1000);

      navigate('/profile');
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
          <label htmlFor="catagory">Kategoriya:</label>
          <input
            type="text"
            id="catagory"
            value={catagory}
            onChange={(e) => setCatagory(e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="price">Qiymət:</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="stock">Stock:</label>
          <input
            type="number"
            id="stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="description">Haqqında:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
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
          <button type="button" onClick={() => navigate('/dashboard')} className={styles.cancelButton}>Çıxış</button>
        </div>
      </form>
    </div>
  );
};

export default AddNewTodo;
