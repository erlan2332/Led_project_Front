import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UploadVideo from './components/UploadVideo';
import VideoList from './components/VideoList';
import VideoPlayer from './components/VideoPlayer';
import './App.css';

const App = () => {
    const [videos, setVideos] = useState([]);
    const [rate, setRate] = useState(5); // Значение по умолчанию для тарифа

    // Унифицированный метод для загрузки списка видео
    const fetchVideos = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/videos/list');
            setVideos(response.data);
        } catch (error) {
            console.error("Ошибка загрузки списка видео:", error);
        }
    };

    // Функция для обновления списка видео после загрузки нового
    const handleNewVideo = (newVideo) => {
        setVideos(prevVideos => [...prevVideos, newVideo]);
    };

    useEffect(() => {
        fetchVideos(); // Загружаем видео при монтировании компонента

        // Настройка Polling: каждые 10 секунд вызываем fetchVideos
        const interval = setInterval(fetchVideos, 10000); // 10000 мс = 10 секунд

        return () => clearInterval(interval); // Очищаем интервал при размонтировании компонента
    }, []);

    return (
        <div>    
                <div className='img'></div>
                <div className='gridTempl'>
                    <UploadVideo onNewVideo={handleNewVideo} fetchVideos={fetchVideos} />
                    <VideoPlayer videos={videos} rate={rate} fetchVideos={fetchVideos} />
                    <VideoList videos={videos} fetchVideos={fetchVideos} />
                </div>
        </div>
    );
};

export default App;
