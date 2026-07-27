import { useEffect, useState } from "react";
import { getJobs, createJob } from "../services/jobService";

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");

  const fetchJobs = async () => {
    try {
      const data = await getJobs();
      setJobs(data);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createJob({
        company,
        position,
      });

      setCompany("");
      setPosition("");

      fetchJobs();
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />

        <br />
        <br />

        <input
          type="text"
          placeholder="Position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        />

        <br />
        <br />

        <button type="submit">Add Job</button>
      </form>

      <hr />

      {jobs.length === 0 ? (
        <p>No Jobs Found</p>
      ) : (
        jobs.map((job) => (
          <div key={job._id}>
            <h3>{job.company}</h3>
            <p>{job.position}</p>
            <p>{job.status}</p>
            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;