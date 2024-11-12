import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VideoList = () => {
    const [videos, setVideos] = useState([]);

    // Функция для получения списка видео с сервера
    const fetchVideos = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/videos/list');
            setVideos(response.data);
        } catch (error) {
            console.error("Ошибка загрузки видео:", error);
        }
    };

    useEffect(() => {
        // Запросить видео при монтировании компонента
        fetchVideos();
        // Настроить polling каждую 1 час (3600000 миллисекунд)
        const interval = setInterval(fetchVideos, 3600000);

        // Очистить интервал при размонтировании компонента
        return () => clearInterval(interval);
    }, []);

    // Обработчик удаления видео
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/videos/delete/${id}`);
            fetchVideos(); // Обновляем список после удаления
            alert('Видео удалено!');
        } catch (error) {
            console.error(error);
            alert('Ошибка при удалении видео.');
        }
    };

    return (
        <div className="video-list-container">
                <h2 className="list-video">Список видео</h2>
                {videos.map(video => (
                    <div key={video.id} className="video-list-item">
                    <div className="item-container">
                        <h5 className="name-video">{video.title}</h5>
                        <p className="url-link"><strong className="p-text-item">URL:</strong> {video.url}</p>
                        <div className='grid-items'>
                            <p><strong>Срок показа до:</strong> <span className="expiry-date">{video.endDate}</span></p>
                            <button onClick={() => handleDelete(video.id)}>Удалить</button>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
    );
};

export default VideoList;
