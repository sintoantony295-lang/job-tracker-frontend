import api from "./api";

export const getJobs = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get("/jobs", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const createJob = async (jobData) => {
  const token = localStorage.getItem("token");

  const response = await api.post("/jobs", jobData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};