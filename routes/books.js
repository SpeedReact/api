var express = require('express');
var router = express.Router();
var books = require('../books.json')
var fs = require('fs');

/* GET users listing. */
router.get('/', function(req, res, next) {

  res.json(books);

});


router.post("/", (req, res) => {

  var id=req.body.id
  var libéllé=req.body.libéllé
  var auteur=req.body.auteur
  var edition=req.body.edition
  var nb_exemplaire=req.body.nb_exemplaire
  var nb_page=req.body.nb_page
  var date_parution=req.body.date_parution

  
  books.push({id,libéllé,auteur,edition,nb_exemplaire,nb_page,date_parution})

  
    
    var json = JSON.stringify(books);

    fs.writeFile('books.json', json, function(err) {
      if (err)
          throw err;
      console.log('Done!')
      res.json(req.body)
  });
    
  
});

router.put("/:id", (req, res) => {

  const bookId=req.params.id
  var id = parseInt(bookId, 10);

  var libéllé=req.body.libéllé
  var auteur=req.body.auteur
  var edition=req.body.edition
  var nb_exemplaire=req.body.nb_exemplaire
  var nb_page=req.body.nb_page
  var date_parution=req.body.date_parution

  const newBooks= books.map(book =>
    book.id === id ? {id,libéllé,auteur,edition,nb_exemplaire,nb_page,date_parution} : book
  )
    
    var json = JSON.stringify(newBooks);
    console.log("new books"+json)
    fs.writeFile('books.json', json, function(err) {
      if (err)
          throw err;
      console.log('Done!')
      res.send("ok")
  });
    
  
});

router.get("/:id", (req, res) => {

  const id=req.params.id
  var bookId = parseInt(id, 10);
  book=books.find(book => book.id===bookId)

  res.json(book)
  
});

router.delete("/:id", (req, res) => {

  const id=req.params.id
  var bookId = parseInt(id, 10);

  const newBooks = books.filter(book => book.id !== bookId)
  var json = JSON.stringify(newBooks);
  console.log("new books"+json)
  fs.writeFile('books.json', json, function(err) {
    if (err)
        throw err;
    console.log('Done!')
    res.send("ok")
});

  
});


module.exports = router;
