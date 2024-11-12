import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VideoPlayer = () => {
    const [videos, setVideos] = useState([]);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [isVideoLoading, setIsVideoLoading] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const videoRef = React.useRef(null);

    // Функция для получения списка видео с сервера
    const fetchVideos = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/videos/list');
            setVideos(response.data);
        } catch (error) {
            console.error("Ошибка загрузки списка видео:", error);
        }
    };

    useEffect(() => {
        // Запросить видео при монтировании компонента
        fetchVideos();
        // Настроить polling каждую 1 час (3600000 миллисекунд)
        const intervalId = setInterval(fetchVideos, 3600000);

        // Очистить интервал при размонтировании компонента
        return () => clearInterval(intervalId);
    }, []);

    // При смене видео обновляется его состояние (загрузка)
    useEffect(() => {
        if (videoRef.current) {
            setIsVideoLoading(true);
            videoRef.current.play().catch((error) => console.error("Ошибка воспроизведения:", error));
        }
    }, [currentVideoIndex]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden && videoRef.current) {
                videoRef.current.play().catch((error) => console.error("Не удалось возобновить воспроизведение:", error));
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    const handleVideoLoaded = () => {
        setIsVideoLoading(false);
    };

    const handleFullscreenChange = () => {
        setIsFullscreen(document.fullscreenElement !== null);
    };

    useEffect(() => {
        document.addEventListener("fullscreenchange", handleFullscreenChange);

        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, []);

    // Если нет видео, показываем сообщение
    if (videos.length === 0) {
        return <p>Нет доступных видео для воспроизведения.</p>;
    }

    const currentVideo = videos[currentVideoIndex];

    return (
        <div className="video-player-container">
            <video
                className='videoRec'
                ref={videoRef}
                width="100%"
                controls
                autoPlay
                muted
                src={currentVideo.url}
                onEnded={() => {
                    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
                }}
                onLoadedData={handleVideoLoaded}
            >
                Ваш браузер не поддерживает видео.
            </video>

            {isVideoLoading && !isFullscreen && (
                <div className="spinner"></div>
            )}
            <h5 className="card-title">Информация о видео</h5>
            <div className="card">
                <div className="card-body">
                    <h5 className="video-title">Воспроизводится  <div className='video-title-text'>{currentVideo.title}</div></h5>
                    <h5 className="card-text">Дата загрузки: <div className='card-text-text'>{currentVideo.uploadDate}</div></h5>
                    <h5 className="card-text">Дата окончания:<div className='card-text-text'>{currentVideo.endDate}</div> </h5>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;
