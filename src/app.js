const express = require("express");
const cors = require("cors");
const { uuid } = require('uuidv4');


// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs }  = request.body;
  const newRepository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };
  repositories.push(newRepository);
  return response.status(201).json(newRepository);

});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;
  const foundRepo = repositories.find(repository => repository.id === id);
  

  if(foundRepo){
    foundRepo.url = url;
    foundRepo.title = title;
    foundRepo.techs = techs;

    const repoIndex = repositories.findIndex(repository => repository.id === id);
    repositories[repoIndex] = foundRepo;

    return response.status(200).json(foundRepo);
  };
  return response.status(400).json({ message:`Repository with id ${id} not found` })
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repoIndex = repositories.findIndex(repository => repository.id === id);
  if(repoIndex !== -1){
    repositories.splice(repoIndex, 1);

    return response.status(204).json();
  };
  return response.status(400).json({ message:`Repository with id ${id} not found` })
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const foundRepo = repositories.find(repository => repository.id === id);
  
  if(foundRepo){
    foundRepo.likes += 1;

    const repoIndex = repositories.findIndex(repository => repository.id === id);
    repositories[repoIndex] = foundRepo;

    return response.status(200).json(foundRepo);
  };
  return response.status(400).json({ message:`Repository with id ${id} not found` })
});

module.exports = app;
