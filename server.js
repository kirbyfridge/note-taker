// require express, path, fs
const express = require('express');
const path = require('path');
const fs = require('fs');

// require helper that creates random id
const id = require('./helpers/id.js');

// define port number
var PORT = process.env.PORT || 3001;

const app = express();

// middleware
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// get index.html for landing page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"))
});

// get notes.html for notes page
app.get("/notes", (req, res) => {
   res.sendFile(path.join(__dirname, "./public/notes.html"))
});

// gets db.json for api
app.get("/api/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (error,notes) => {
      if (error) {
          return console.log(error)
      }

      res.json(JSON.parse(notes))

  });
});

// post request
app.post("/api/notes", (req, res) => {

  const currentNote = req.body;

  // reading database first before creating new note
  fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (error, notes) => {
    if (error) {
          return console.log(error)
    }

    notes = JSON.parse(notes)

    // creates new note with random id
    let newNote = { 
      title: currentNote.title, 
      text: currentNote.text, 
      id: id()
    }

    console.log(`📝 Note ${newNote.id} has been created`);

    // adds new note to database
    var newNotesArray = notes.concat(newNote)

    fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify(newNotesArray), (error, data) => {
      if (error) {
        return error
      }

      res.json(newNotesArray);

    });
  });
});

// delete request
app.delete("/api/notes/:id", (req, res) => {

  let deleteId = req.params.id;

  console.log(`🗑️ Note ${deleteId} has been deleted`);

  // reads database before attempting to delete
  fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (error,notes) => {
    if (error) {
        return console.log(error)
    }

    let notesArray = JSON.parse(notes);

    // splices array to delete specific note by id without deleting everything
    for (var i=0; i<notesArray.length; i++){
      if(deleteId == notesArray[i].id) {
        notesArray.splice(i,1);

        fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify(notesArray), (error, data) => {

          if (error) {
            return error
          }

          res.json(notesArray);

        });
      };
    };
  }); 
});

// server live at port 3001
app.listen(PORT, () => {
    console.log(`Server is now live at https://localhost:${PORT}!`);
});