const axios = require("axios");

const apiURL = "http://localhost:5000/api/tasks";

async function addTask() {
  try {
    // POST a new task
    const res = await axios.post(apiURL, { title: "My first task" });
    console.log("POST Response:", res.data);

    // GET tasks again
    const getRes = await axios.get(apiURL);
    console.log("GET after POST:", getRes.data);
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
  }
}

addTask();