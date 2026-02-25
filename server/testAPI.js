const axios = require("axios");

const apiURL = "http://localhost:5000/api/tasks";

async function testAPI() {
  try {
    // GET existing tasks
    let res = await axios.get(apiURL);
    console.log("GET before POST:", res.data);

    // POST a new task
    res = await axios.post(apiURL, { title: "My first task" });
    console.log("POST response:", res.data);

    // GET tasks again
    res = await axios.get(apiURL);
    console.log("GET after POST:", res.data);
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
  }
}

testAPI();