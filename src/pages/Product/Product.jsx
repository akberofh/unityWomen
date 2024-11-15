import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAddTodoMutation } from '../../redux/slices/productApiSlice';
import styles from '../addTodo/AddNewTodo.module.css';

const Product = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null); // New state for photo
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [addTodo] = useAddTodoMutation();

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('stock', stock);
      formData.append('price', price);
      formData.append('description', description);
      if (photo) formData.append('photo', photo);

      const newTodo = await addTodo(formData).unwrap();

      setTimeout(() => {
        dispatch({ type: 'product/addTodo', payload: newTodo });
      }, 1000);

      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to add the todo:', err);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Add New TODO</h2>
      <form onSubmit={handleSubmit} className={styles.form} encType="multipart/form-data">
        <div className={styles.inputGroup}>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="stock">Stock:</label>
          <input
            type="text"
            id="stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="price">Price:</label>
          <input
            type="text"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="]description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.textarea}
          ></textarea>
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="photo">Photo:</label>
          <input
            type="file"
            id="photo"
            onChange={handlePhotoChange}
            className={styles.fileInput}
          />
        </div>
        <div className={styles.buttons}>
          <button type="submit" className={styles.submitButton}>Add TODO</button>
          <button type="button" onClick={() => navigate('/dashboard')} className={styles.cancelButton}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default Product;
