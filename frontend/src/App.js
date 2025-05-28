import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import ReactPlayer from 'react-player';
import { FaPlay, FaPause, FaPaste, FaYoutube, FaDownload, FaUpload, FaBookmark, FaSave, FaSquare,FaLevelDownAlt , FaBars, FaTimes, FaAngleLeft, FaAngleRight, FaLocationArrow   } from 'react-icons/fa';

export default function YoutubeLyricsEditor() {
  const playerRef = useRef(null);
  const fileInputRef = useRef(null);
  const [url, setUrl] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [lyrics, setLyrics] = useState('');
  const [checkpoint, setCheckpoint] = useState('');
  const [checkpointTime, setCheckpointTime] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handlePaste = async () => {
    const text = await navigator.clipboard.readText();
    setInputUrl(text);
  };

  const handlePlayPause = () => setPlaying(!playing);
  const handleSeekChange = (e) => setPlayed(parseFloat(e.target.value));
  const handleSeekMouseUp = () => playerRef.current?.seekTo(played);
  const handleProgress = (state) => setPlayed(state.played);
  const handleDuration = (d) => setDuration(d);
  const handleVolumeChange = (e) => setVolume(parseFloat(e.target.value));

  const handleExport = () => {
    const data = { url, lyrics, checkpointTime };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const urlExport = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = urlExport;
    a.download = 'lyrics_project.json';
    a.click();
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = JSON.parse(event.target.result);
      setUrl(data.url);
      setInputUrl(data.url);
      setLyrics(data.lyrics);
      setCheckpointTime(data.checkpointTime);
    };
    reader.readAsText(file);
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  const handleCheckpointChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) value = value.slice(0, 2) + ':' + value.slice(2);
    setCheckpoint(value);
  };

  const parseTimecode = (tc) => {
    const [min, sec] = tc.split(':');
    return parseInt(min || 0) * 60 + parseInt(sec || 0);
  };

  const saveCheckpoint = () => {
    if (playerRef.current) {
      setCheckpointTime(playerRef.current.getCurrentTime());
    }
  };

  const goToCheckpoint = () => {
    if (playerRef.current && checkpointTime !== null) {
      playerRef.current.seekTo(checkpointTime);
      setPlaying(true);
    }
  };
  useEffect(() => {
  const savedUrl = localStorage.getItem('youtube-url');
  const savedLyrics = localStorage.getItem('youtube-lyrics');
  if (savedUrl) {
    setUrl(savedUrl);
    setInputUrl(savedUrl);
  }
  if (savedLyrics) {
    setLyrics(savedLyrics);
  }
}, []);

// Sauvegarder l'URL à chaque changement
useEffect(() => {
  if (url) localStorage.setItem('youtube-url', url);
}, [url]);

// Sauvegarder les paroles à chaque changement
useEffect(() => {
  localStorage.setItem('youtube-lyrics', lyrics);
}, [lyrics]);

  return (
    <div className="flex flex-col h-screen w-full bg-white font-sans relative">
      {/* Header */}
      <div className="flex items-center justify-between p-4 md:p-6 w-full border-b border-[#000001]/10">
        <div className="flex items-center gap-2 flex-1">
          <div className='border border-[#000001]/20 rounded-lg px-2 py-1'>
            <input
            className="flex-1 p-3 outline-none transition-all placeholder:text-[#000001]/60"
            placeholder="Collez un lien YouTube..."
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && setUrl(inputUrl)}
            />
            <button 
              onClick={handlePaste} 
              className="p-3 rounded-lg bg-[#C59849] text-white hover:bg-[#a87d3a] transition-colors"
            >
              
              <FaPaste />
            </button>
          </div>
          
           <button onClick={() => setUrl(inputUrl)} className="p-2    text-black text-xl rounded rotate-90"><FaLevelDownAlt /></button>
          
        </div>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-3 text-[#000001] hover:bg-[#000001]/10 rounded-full transition-colors"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Menu contextuel */}
      {isMenuOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/10" onClick={() => setIsMenuOpen(false)} />
          <div className="absolute top-16 right-4 bg-white border border-[#000001]/20 rounded-lg shadow-lg z-50 p-4 w-fit">
            <div className="">

              <div className="">
                <div className="flex gap-2">
                  <button 
                    onClick={handleExport} 
                    className="p-3 rounded-lg border border-[#C59849] text-[#C59849] hover:bg-[#C59849]/10 transition-colors"
                  >
                    <FaDownload />
                  </button>
                  <button 
                    onClick={() => fileInputRef.current.click()} 
                    className="p-3 rounded-lg border w-fit border-[#C59849] text-[#C59849] hover:bg-[#C59849]/10 transition-colors"
                  >
                    <FaUpload />
                  </button>
                  {url && (
                    <a 
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-3 rounded-lg bg-[#C59849] text-white hover:bg-[#a87d3a] transition-colors text-xl"
                    >
                      <FaYoutube />
                    </a>
                  )}
                </div>
                
              </div>
            </div>
          </div>
        </>
      )}

      {/* Zone de texte principale */}
      <div className="flex-1 overflow-auto px-4 md:px-6 pb-4">
        <textarea
          className="w-full h-full p-4 md:p-6 rounded-lg outline-none resize-none text-[#000001] placeholder:text-[#000001]/60 text-lg leading-relaxed min-h-[200px]"
          placeholder="Écrire ici..."
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
        />
      </div>

      {/* Contrôles de lecture */}
      <div className="p-4 md:p-6 bg-[#000001]/05 border-t border-[#000001]/10">
        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-center justify-between text-sm text-[#000001]/80 w-full">
            <span className="w-16 text-center">{formatTime(played * duration)}</span>
            <input
              type="range"
              min={0}
              max={1}
              step="0.01"
              value={played}
              onChange={handleSeekChange}
              onMouseUp={handleSeekMouseUp}
              className="flex-1 mx-2 md:mx-4 range accent-[#C59849]"
            />
            <span className="w-16 text-center">{formatTime(duration - played * duration)}</span>
          </div>

          <div className="flex flex-col  gap-4 justify-between w-full">
            <div className="flex justify-between gap-2">
              <div className="flex">
                  <button 
                  onClick={() => playerRef.current.seekTo(playerRef.current.getCurrentTime() - 5)} 
                  className="p-3 rounded-lg text-xl  hover:bg-[#000001]/5 transition-colors md:flex-none"
                >
                  <FaAngleLeft />
                </button>
                <button 
                  onClick={handlePlayPause} 
                  className="p-2 md:p-3 rounded-lg bg-[#C59849] text-white hover:bg-[#a87d3a] transition-colors w-12 flex items-center justify-center"
                >
                  {playing ? <FaPause /> : <FaPlay />}
                </button>
                <button 
                  onClick={() => playerRef.current.seekTo(playerRef.current.getCurrentTime() + 5)} 
                  className="p-3 w-fit rounded-lg text-xl hover:bg-[#000001]/5 transition-colors md:flex-none"
                >
                  <FaAngleRight />
                </button>
              </div>
              <div className="flex gap-2">
                  <button 
                    onClick={saveCheckpoint} 
                    className="p-3 rounded-lg bg-[#C59849] text-white hover:bg-[#a87d3a] transition-colors"
                  >
                    <FaBookmark  />
                  </button>
                  <button 
                    onClick={goToCheckpoint} 
                    className="p-3 rounded-lg border border-[#C59849] text-[#C59849] hover:bg-[#C59849]/10 transition-colors"
                  >
                    <FaLocationArrow  />
                  </button>
                </div>
            </div>
          </div>
        </div>
      </div>

      <ReactPlayer
        ref={playerRef}
        url={url}
        playing={playing}
        volume={volume}
        onProgress={handleProgress}
        onDuration={handleDuration}
        width={0}
        height={0}
      />

      <style jsx global>{`
        html, body, #__next {
          height: 100%;
          width: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}