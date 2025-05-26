import ReactPlayer from 'react-player';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function ProjectEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const playerRef = useRef(null);
  const [project, setProject] = useState({ name: '', youtubeUrl: '', lyrics: '' });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await axios.get(`/api/projects/${id}`);
        setProject(data);
      } catch (error) {
        navigate('/projects');
      }
    };
    if (id) fetchProject();
  }, [id]);

  const handleSave = async () => {
    try {
      if (id) {
        await axios.put(`/api/projects/${id}`, project);
      } else {
        await axios.post('/api/projects', project);
        navigate('/projects');
      }
    } catch (error) {
      alert('Save failed');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <input
        type="text"
        className="w-full mb-4 p-2 border rounded-lg"
        placeholder="Project Name"
        value={project.name}
        onChange={(e) => setProject({ ...project, name: e.target.value })}
      />
      
      <div className="mb-4">
        <ReactPlayer
          ref={playerRef}
          url={project.youtubeUrl}
          controls
          width="100%"
          height="400px"
        />
      </div>

      <textarea
        className="w-full h-64 p-4 border rounded-lg mb-4"
        value={project.lyrics}
        onChange={(e) => setProject({ ...project, lyrics: e.target.value })}
        placeholder="Write your lyrics here..."
      />

      <button
        onClick={handleSave}
        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
      >
        Save Project
      </button>
    </div>
  );
}