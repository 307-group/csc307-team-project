// backend.js
import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor"
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer"
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor"
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspiring actress"
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender"
    }
  ]
};

app.use(cors());
app.use(express.json());

//find user by name
const findUserByName = (name) => {
  return users["users_list"].filter(
    (user) => user["name"] === name
  );
};

app.get("/", (req, res) => {
  res.send("go to /users chat");
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  if (name != undefined) {
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } else {
    res.send(users);
  }
});

//find user by name and job
const findUserByNameAndJob = (name, job) => {
  return users["users_list"].filter(
    (user) => user["name"] === name && user["job"] === job
  );
};

app.get("/users/search", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  if (name != undefined && job != undefined) {
    let result = findUserByNameAndJob(name, job);
    result = { users_list: result };
    res.send(result);
  } else {
    res.status(400).send("Please provide both name and job query parameters.");
  }
})


//find user by id
const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

//add user
const addUser = (user) => {
  users["users_list"].push(user);
  return user;

};

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  userToAdd["id"] = generateId();
  let result = addUser(userToAdd);
  res.status(201).send(result);
});

//random id generator
const generateId = () => {
  return Math.random().toString(36).substring(2, 7);
}

//delete user
const deleteUserById = (id) => {
    const index = users["users_list"].findIndex((user) => user["id"] === id);
    if (index !== -1) {
        return users["users_list"].splice(index, 1);
    }
    return undefined;
};

app.delete("/users/:id", (req, res) => {
    const id = req.params["id"];
    let delete_result = deleteUserById(id);
    if (delete_result === undefined) {
        res.status(404).send("Resource not found.");
    } else {
      res.status(200).send(delete_result);
    }
});

//listen
app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
);
});