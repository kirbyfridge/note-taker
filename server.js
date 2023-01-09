const express = require('express');
const path = require('path');
const fs = require('fs');
const id = require('./helpers/id.js');

var PORT = process.env.PORT || 3001;

const app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"))
});
app.get("/notes", (req, res) => {
   res.sendFile(path.join(__dirname, "./public/notes.html"))
});

app.get("/api/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (error,notes) => {
      if (error) {
          return console.log(error)
      }
      res.json(JSON.parse(notes))
  })
});

app.post("/api/notes", (req, res) => {

    const currentNote = req.body;

  fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (error, notes) => {
      if (error) {
          return console.log(error)
      }

      notes = JSON.parse(notes)

      let newNote = { 
        title: currentNote.title, 
        text: currentNote.text, 
        id: id()
        }

      var newNotesArr = notes.concat(newNote)

      fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify(newNotesArr), (error, data) => {
        if (error) {
          return error
        }
        res.json(newNotesArr);
      })
  });
});

app.delete("/api/notes/:id", (req, res) => {
  let deleteId = JSON.parse(req.params.id);
  console.log("ID to be deleted: " + deleteId);
  fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (error,notes) => {
    if (error) {
        return console.log(error)
    }
   let notesArray = JSON.parse(notes);

   for (var i=0; i<notesArray.length; i++){
     if(deleteId == notesArray[i].id) {
       notesArray.splice(i,1);

       fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify(notesArray), (error, data) => {
        if (error) {
          return error
        }
        res.json(notesArray);
      })
     }
  }
}); 
});

app.listen(PORT, () => {
    console.log(`Server is now live at https://localhost:${PORT}!`);
});