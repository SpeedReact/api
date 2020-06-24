var express = require('express');
var router = express.Router();
var emprunts = require('../emprunts.json')
var books = require('../books.json')
var fs = require('fs');


router.get('/enCours', function(req, res) {
  const empruntsEnCours = emprunts.filter(emprunt => emprunt.date_retour==="")
  res.json(empruntsEnCours);

});


router.get('/tous', function(req, res) {
  
  res.json(emprunts);

});


Date.prototype.addDays = function(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}




router.get('/enRetard', function(req, res) {
  
  var empruntsEnRetard=[] ;
  emprunts.map(emprunt => {
    var date = new Date(emprunt.date_emprunt);
    var date_exacte=date.addDays(15)
    //console.log(date_exacte);
    if(emprunt.date_retour===""){
      var now=new Date()
      if(now>date_exacte===true){
        empruntsEnRetard.push(emprunt)
      }
    }
    else {
      var date_retour = new Date(emprunt.date_retour);
      if(date_retour>date_exacte===true){
        empruntsEnRetard.push(emprunt)
      }
    }
 
}
)
  res.json(empruntsEnRetard);

});




router.get("/:id", (req, res) => {

  var id=req.params.id
  var userId = parseInt(id, 10);
  const newEmprunts =emprunts.filter(emprunt => emprunt.userId ===userId) 

  res.json(newEmprunts)
  
});



router.post("/", (req, res) => {


  var id=emprunts.length+1

  var userId=Number(req.body.userId)

  var bookId=Number(req.body.bookId)
  var now=new Date()
  let date = JSON.stringify(now)
  var date_emprunt = date.slice(1,11) 
  
  var date_retour=""

  const empruntsEnCours = emprunts.filter(emprunt => emprunt.date_retour==="" && emprunt.userId===userId)
  const nbemprunts=empruntsEnCours.length

  if(nbemprunts>=2){
    res.send("error")
  }
  else {
    // test si déja tu emprunts ce livre
    const emprunt = emprunts.filter(emprunt => emprunt.bookId===bookId && emprunt.userId===userId && date_retour==="")
    
    if( emprunt.length>0){
      res.send("existeDéja")
    } 

   
    // test sur nb exemplaire
    const book = books.filter(book => book.id===bookId)
 
    if(book[0].nb_exemplaire >book[0].nb_livre_emprunter){
      //incerémente nb livre emprunter 
      const newBooks = books.map((book) =>
      book.id === bookId ? {...book, nb_livre_emprunter : book.nb_livre_emprunter+1 } : book
      )
      var json = JSON.stringify(newBooks);
      console.log("json"+json)
      fs.writeFile('books.json', json, function(err) {
        if (err)
            throw err;
        console.log('nb livre emprunter incrémente!')
      });
      // save emprunt 
      emprunts.push({id,date_emprunt,date_retour,userId,bookId})
      var json = JSON.stringify(emprunts);
      console.log("json"+json)
      fs.writeFile('emprunts.json', json, function(err) {
        if (err)
            throw err;
        console.log('Done!')
        res.send("done")
      });
    }
    else {
      res.send("tryagain")
    }
  
}

  
});


router.put("/", (req, res) => {


  var userId=Number(req.body.userId)
  var bookId=Number(req.body.bookId)
  var now=new Date()
  let date = JSON.stringify(now)
  var date_retour = date.slice(1,11) 
  

    //décrémente nb livre emprunter 
    const newBooks = books.map((book) =>
    book.id === bookId ? {...book, nb_livre_emprunter : book.nb_livre_emprunter-1 } : book
    )
    var json = JSON.stringify(newBooks);
    fs.writeFile('books.json', json, function(err) {
      if (err)
          throw err;
      console.log('nb livre emprunter décrémenter!')
    });

  const newEmprunts= emprunts.map(emprunt =>
    emprunt.userId===userId && emprunt.bookId===bookId && emprunt.date_retour==="" ? {...emprunt ,date_retour } : emprunt
  )
 
  var json = JSON.stringify(newEmprunts);
  console.log(json)
  fs.writeFile('emprunts.json', json, function(err) {
    if (err)
        throw err;
    console.log('update emprunt done!')
    res.send("done")
  });



  
});

module.exports = router;
