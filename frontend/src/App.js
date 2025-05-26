import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player/youtube';

function App() {
  const [url, setUrl] = useState('');
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [lyrics, setLyrics] = useState('');
  const playerRef = useRef(null);

  const handleProgress = ({ played }) => {
    setPlayed(played);
  };

  const handleDuration = (dur) => {
    setDuration(dur);
  };

  const togglePlay = () => {
    setPlaying(prev => !prev);
  };

  const handleSeek = (e) => {
    const newPlayed = parseFloat(e.target.value);
    setPlayed(newPlayed);
    playerRef.current.seekTo(newPlayed);
  };

  const handleVolume = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
  };

  const exportToFile = () => {
    const data = {
      url,
      lyrics,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.download = 'session-lyrics.json';
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  const importFromFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      try {
        const data = JSON.parse(event.target.result);
        setUrl(data.url || '');
        setLyrics(data.lyrics || '');
      } catch (error) {
        alert('Erreur de lecture du fichier.');
      }
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    setPlaying(false);
    setPlayed(0);
  }, [url]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="p-4 bg-white shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <input
          type="text"
          placeholder="Colle un lien YouTube ici"
          value={url}
          onChange={e => setUrl(e.target.value)}
          className="w-full sm:w-2/3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div className="flex gap-2">
          <button
            onClick={exportToFile}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Exporter
          </button>
          <label className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700">
            Importer
            <input
              type="file"
              accept=".json"
              onChange={importFromFile}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="flex-1 p-4">
        <textarea
          placeholder="Écris tes paroles ici..."
          value={lyrics}
          onChange={e => setLyrics(e.target.value)}
          className="w-full h-full p-4 text-lg border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
        />
      </div>

      <div className="p-4 bg-white shadow flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            {playing ? 'Pause' : 'Play'}
          </button>
          <span className="text-sm text-gray-600">
            {Math.floor(played * duration)}s / {Math.floor(duration)}s
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={1}
          step="0.001"
          value={played}
          onChange={handleSeek}
          className="w-full sm:w-1/2"
        />

        <div className="flex items-center gap-2">
          <span className="text-sm">Vol</span>
          <input
            type="range"
            min={0}
            max={1}
            step="0.01"
            value={volume}
            onChange={handleVolume}
          />
        </div>
      </div>

      <ReactPlayer
        ref={playerRef}
        url={url}
        playing={playing}
        volume={volume}
        onProgress={handleProgress}
        onDuration={handleDuration}
        width="0"
        height="0"
      />
    </div>
  );
}

export default App;
