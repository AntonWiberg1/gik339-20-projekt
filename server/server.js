// grupp 20 GIK399 Dynamiska webbaplikationer

const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database("./movies.db"); 

db.all('SELECT * FROM movies', (err, rows) => console.log(rows));


const express = require('express'); // importerar express 
const server = express();

// standardinställningar för server (CORS)
server.use(express.json()).use(express.urlencoded({ extended: false })).use
((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");

  next();
});

server.listen(3000, () => {console.log('Server running on http://localhost:3000');

});

// GET (för att hämta all data från databasen), här används bara res eftersom vi endast hämtar ett svar // fungerar med postman
server.get("/movies", (req, res) => { // Callbackfunktion
  const sql = "SELECT * FROM movies"; // sql sats som ska anropas 

  db.all(sql, (err, rows) => {
    if(err) { // om vi får fel så svara med error 500 "Generellt serverfel"
      res.status(500).send(err);
    } else { // annars hämta data 
      res.send(rows); 
    }
  }
  )
});

// GET för att hämta en specifik film // Fungerar med Postman 
server.get("/movies/:id", (req, res) => {
  const id = (req.params.id); // params motsvarar eventuella parametrar som man skickar med URLen
  const sql = `SELECT * FROM movies WHERE id=${id}`; // sql sats som ska anropas 

  db.all(sql, (err, rows) => {
    if(err) { // om vi får fel så svara med error 500 "Generellt serverfel"
      res.status(500).send(err);
    } else { // annars hämta data 
      res.send(rows[0]); 
    }
  }
  )
})

// POST/CREATE MOVIE för att lägga till filmer. Fungerar med postman 
server.post('/movies', (req, res) => {
  const movie = req.body; // hämtar movie-objektet 
  const sql = `INSERT INTO movies(title, releaseDate, director, price) VALUES
  (?,?,?,?)`; // SQL-sats 
  db.run(sql,  Object.values(movie), (err) => { // callbackfunktion
    if(err) { // om något gick fel, skicka felmeddelande 
      console.log(err);
      res.status(500).send(err);
    } else {
      res.send("Filmen sparades")
    }
  }); // hämtar ut alla värden ur objektet som en array
});

// PUT/UPDATE MOVIE // fungerar med postman

server.put("/movies", (req, res) => {
  const bodyData = req.body;
  const id = bodyData.id;

  // Skapa movie-objekt med uppdaterade värden
  const movie = {
    title: bodyData.title,
    releaseDate: bodyData.releaseDate,
    director: bodyData.director,
    price: bodyData.price,
  };

  // Bygg upp update-strängen för SQL-satsen
  let updateString = "";
  const columnsArray = Object.keys(movie);
  columnsArray.forEach((column, i) => {
    updateString += `${column}="${movie[column]}"`;
    if (i !== columnsArray.length - 1) updateString += ","; // Lägg till kommatecken om inte sista
  });

  // För debugging: logga updateString, men skicka inte till klienten
  console.log("Update String:", updateString);

  const sql = `UPDATE movies SET ${updateString} WHERE id=${id}`;

  // Utför SQL-uppdateringen
  db.run(sql, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err); 
    }
    res.send("Filmen uppdaterades"); 
  });
});


// DELETE MOVIE // fungerar med postman 
server.delete("/movies/:id", (req, res) => {
  const id = (req.params.id); // params motsvarar eventuella parametrar som man skickar med URLen
  const sql = `DELETE FROM movies WHERE id=${id}`;

  db.run(sql, (err) => {
    if(err) { // om vi får fel så svara med error 500 "Generellt serverfel"
      console.log(err)
      res.status(500).send(err);
    } else { // annars hämta data 
      res.send("Filmen borttagen"); 
    }
  }
  )
})