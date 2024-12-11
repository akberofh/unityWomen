import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from '../pages/dashboard/Dashboard.module.css';
import { toast } from 'react-toastify';
import { useGetCatagoryQuery, useRemoveCatagoryMutation, useUpdateCatagoryMutation } from '../redux/slices/catagoryApiSlice';
import { removeCatagory, setCatagory, updateCatagory as updateCatagoryAction } from '../redux/slices/catagorySlice';

const Catagory = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { data, error, isLoading } = useGetCatagoryQuery();
    const [deleteTodo] = useRemoveCatagoryMutation();
    const [updateCatagory] = useUpdateCatagoryMutation();

    const [editingTodo, setEditingTodo] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editPhoto, setEditPhoto] = useState('');

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        }
        if (data?.allCatagory) {
            dispatch(setCatagory(data.allCatagory));
        }
    }, [navigate, userInfo, data, dispatch]);



    const handleDelete = async (id) => {
        try {
            await deleteTodo(id).unwrap();
            dispatch(removeCatagory(id));
            toast.success("Kategori başarıyla silindi.");
        } catch (err) {
            toast.error("Kategori silinemedi.");
        }
    };

    const handleEdit = (todo) => {
        setEditingTodo(todo._id);
        setEditTitle(todo.title);
        setEditPhoto(todo.photo);
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditPhoto(file);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", editTitle);

        if (editPhoto) {
            formData.append("photo", editPhoto);
        }

        try {
            // Güncelleme isteğini gönder
            const res = await updateCatagory({ id: editingTodo, formData }).unwrap();

            // Redux state'ini güncelle
            dispatch(updateCatagoryAction(res));

            toast.success("Kategori başarıyla güncellendi");
            setEditingTodo(null); // Düzenleme modundan çık
        } catch (error) {
            toast.error(error.data.message || error.message);
        }
    };


    if (isLoading) return <p>Yükleniyor...</p>;
    if (error) return <p>Hata: {error.message}</p>;
    if (!data?.allCatagory) {
        return <p>Kategori bulunamadı.</p>;
    }

    const categoryList = data.allCatagory;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button onClick={() => navigate('/profile')} className={styles.profileButton}>Profilə Keç</button>
                <button onClick={() => navigate('/catagoryadd')} className={styles.addButton}>Yeni Məhsul Əlavə Et</button>
            </div>
            <div className={styles.todoList}>
                {categoryList.map(item => (
                    <div key={item._id} className={styles.todoItem}>
                        {editingTodo === item._id ? (
                            <div className={styles.editForm}>
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    placeholder="Title"
                                    className={styles.input}


                                />
                                <input
                                    type="file"
                                    onChange={handlePhotoChange}
                                    className={styles.fileInput}
                                />
                                {editPhoto && typeof editPhoto === "string" ? (
                                    <img src={`data:image/jpeg;base64,${editPhoto}`} alt="Preview" className={styles.photoPreview} />
                                ) : editPhoto && (
                                    <img src={URL.createObjectURL(editPhoto)} alt="Preview" className={styles.photoPreview} />
                                )}
                                <button onClick={handleUpdate} className={styles.saveButton}>Yenilə</button>
                                <button onClick={() => setEditingTodo(null)} className={styles.cancelButton}>Çıx</button>
                            </div>
                        ) : (
                            <>
                                <img src={`data:image/jpeg;base64,${item.photo}`} alt="Todo" />
                                <h3 onClick={() => {
                                    navigate(`/catagory/${item.title}`);
                                }}>
                                    {item.title}
                                </h3 >
                                <button onClick={() => handleEdit(item)} className={styles.editButton}>Düzənlə</button> 
                                 <button onClick={() => handleDelete(item._id)} className={styles.deleteButton}>Sil</button>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Catagory;
