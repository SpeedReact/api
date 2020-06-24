var express = require('express');
var router = express.Router();
var books = require('../books.json')
var emprunts = require('../emprunts.json')
var fs = require('fs');


router.get('/', function(req, res, next) {
      
  res.json(books);

});

router.get('/user', function(req, res) {
  const newBooks = books.filter(book => book.archiver === "non")
  res.json(newBooks);
 

});


router.get('/emprunter/:userId', function(req, res) {
  const userId=Number(req.params.userId)
  console.log(userId)
  const newEmprunts = emprunts.filter(emprunt => emprunt.userId === userId && emprunt.date_retour==="")
  //console.log(newEmprunts)
  var newBooks=[];
  newEmprunts.map(emprunt => {
    var book=books.filter(book => book.id === emprunt.bookId)
    newBooks.push(book[0])
  })
  console.log(newBooks)
  res.json(newBooks);
 

});

router.get('/search/:searchValue', function(req, res) {

  let searchValue=req.params.searchValue
  
  console.log(searchValue)

  const newBooks = books.filter(book => book.libéllé.includes(searchValue) && book.archiver === "non")
  console.log(newBooks)
  res.json(newBooks);
 

});



router.get('/searchByAuteur/:searchValue', function(req, res) {

  let searchValue=req.params.searchValue
  
  console.log(searchValue)

  const newBooks = books.filter(book => book.auteur.includes(searchValue) && book.archiver === "non")
  console.log(newBooks)
  res.json(newBooks);
 

});

router.post("/", (req, res) => {
  
  var id=(books.slice(-1)[0].id)+1
  console.log(books.slice(-1))
  console.log((books.slice(-1)[0].id)+1)
  console.log("idd"+id)
  var libéllé=req.body.libéllé
  var auteur=req.body.auteur
  var edition=req.body.edition
  var nb_exemplaire=req.body.nb_exemplaire
  var nb_page=req.body.nb_page
  var date_parution=req.body.date_parution
  var archiver="non"
  var nb_livre_emprunter=0

  book={id,libéllé,auteur,edition,nb_exemplaire,nb_page,date_parution,nb_livre_emprunter,archiver}
  console.log("book"+book)
  books.push(book)

  
    
    var json = JSON.stringify(books);
    console.log("json"+json)
    fs.writeFile('books.json', json, function(err) {
      if (err)
          throw err;
      console.log('Done!')
      res.json(book)
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
    book.id === id ? {id,libéllé,auteur,edition,nb_exemplaire,nb_page,date_parution,archiver : book.archiver,nb_livre_emprunter : book.nb_livre_emprunter} : book
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




router.post("/archiver", (req, res) => {

  let id=req.body.id
  let archiver=req.body.archiver
  console.log(archiver)

  const newBooks = books.map(book =>
    book.id === Number(id) ? { ...book ,archiver} : book
    )
   
    var json = JSON.stringify(newBooks);
    fs.writeFile('books.json', json, function(err) {
      if (err)
          throw err;
      console.log('Done!')
      res.send("ok")
  });
    
  
});

module.exports = router;
