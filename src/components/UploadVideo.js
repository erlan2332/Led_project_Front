import React, { useState, useRef } from 'react';
import axios from 'axios';

const UploadVideo = ({ onNewVideo, fetchVideos }) => {
    const [formData, setFormData] = useState({
        file: null,
        title: '',
        duration: 1,
    });
    const [isUploading, setIsUploading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('');

    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        setFormData({ ...formData, file: e.target.files[0] });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUploading(true);
        setShowModal(true);
        setError('');

        const { file, title, duration } = formData;

        if (!file || !title || !duration) {
            setError('Все поля обязательны для заполнения!');
            setIsUploading(false);
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('file', file);
        formDataToSend.append('title', title);
        formDataToSend.append('duration', duration);

        try {
            const response = await axios.post('http://localhost:8080/api/videos/upload', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert(response.data);
            onNewVideo(response.data);
            fetchVideos(); // Обновление списка видео
        } catch (error) {
            console.error(error);
            setError('Ошибка загрузки видео.');
        } finally {
            setIsUploading(false);
            setFormData({ file: null, title: '', duration: 1 });
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className="upload-video-container">
            <form onSubmit={handleSubmit} className="upload-video-form">
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="form-group">
                    <input
                        className='inputName'
                        type="text"
                        placeholder=" Название видео"
                        value={formData.title}
                        onChange={handleInputChange}
                        name="title"
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="file-label">
                        {formData.file ? formData.file.name : 'Выберите файл'}
                        <input
                            type="file"
                            accept="video/*"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                            required
                            className="file-input"
                        />
                    </label>
                </div>
                <div className="form-group2">
                    <select
                        value={formData.duration}
                        onChange={handleInputChange}
                        name="duration"
                        required
                    >
                        <option value="1">1 месяц</option>
                        <option value="3">3 месяца</option>
                        <option value="6">6 месяцев</option>
                    </select>
                    <label>Срок показа (мес.)</label>
                </div>

                <div className="form-group3">
                    <button className='buuttonLoad' type="submit" disabled={isUploading}>
                        {isUploading ? 'Загружается...' : 'Загрузить видео'}
                    </button>
                </div>
            </form>

            {showModal && (
                <div className="modal">
                    <div className="modal-dialog">
                        <div className="modal-header">
                            <h5>Загрузка видео</h5>
                            {!isUploading && (
                                <button type="button" onClick={closeModal}>Закрыть</button>
                            )}
                        </div>
                        <div className="modal-body">
                            {isUploading ? (
                                <div className="spinner">Загрузка...</div>
                            ) : (
                                <p>Видео успешно загружено!</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadVideo;
