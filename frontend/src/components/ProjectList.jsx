import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ name: '', youtubeUrl: '' });

  useEffect(() => {
    const loadProjects = async () => {
      const { data } = await axios.get('/api/projects');
      setProjects(data);
    };
    loadProjects();
  }, []);

  const createProject = async () => {
    const { data } = await axios.post('/api/projects', newProject);
    setProjects([...projects, data]);
    setNewProject({ name: '', youtubeUrl: '' });
  };

  return (
    <div>
      <div className="project-creator">
        <input
          value={newProject.name}
          onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
          placeholder="Project name"
        />
        <input
          value={newProject.youtubeUrl}
          onChange={(e) => setNewProject({ ...newProject, youtubeUrl: e.target.value })}
          placeholder="YouTube URL"
        />
        <button onClick={createProject}>Create</button>
      </div>

      <div className="project-grid">
        {projects.map(project => (
          <div key={project._id} className="project-card">
            <Link to={`/projects/${project._id}`}>
              <h3>{project.name}</h3>
              <p>{project.youtubeUrl}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}