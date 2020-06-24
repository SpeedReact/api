var express = require('express');
var router = express.Router();
var users = require('../users.json')
var fs = require('fs');


router.get('/', function(req, res) {

  const newUsers = users.filter(user => user.role === "adhérent")
  res.json(newUsers);

});


router.post("/", (req, res) => {

  var id=users.length+1
  var nom=req.body.firstName
  var prénom=req.body.lastName
  var nomutilisateur=req.body.username
  var motdepasse=req.body.password
  var role="adhérent"
  var etat=0

  const User = users.filter(user => user.nomutilisateur === nomutilisateur)
  if(User.length>0){
    res.send("error")
  }
  else {
    users.push({id,nom,prénom,nomutilisateur,motdepasse,role,etat})
    var json = JSON.stringify(users);

      fs.writeFile('users.json', json, function(err) {
        if (err)
            throw err;
        console.log('Done!')
        res.json(req.body)
    });
  }
  
});

router.put("/", (req, res) => {

  let id=req.body.id
  let etat=req.body.etat

  const newUsers = users.map(user =>
    user.id === Number(id) ? { ...user ,etat : Number(etat)} : user
    )
   
    var json = JSON.stringify(newUsers);
    fs.writeFile('users.json', json, function(err) {
      if (err)
          throw err;
      console.log('Done!')
      res.send("ok")
  });
    
  
});

router.get("/:id", (req, res) => {

  const id=req.params.id
  var userId = parseInt(id, 10);
  user=users.find(user => user.id===userId)

  res.json(user)
  
});
 
router.put("/authentification", (req, res) => {
  console.log("hellooo")

  let username=req.body.username
  console.log(username)
  let password=req.body.password
  console.log(password)
 user= users.find(user => user.nomutilisateur === username && user.motdepasse === password ) 
console.log(user)
  res.json(user)
  
});


module.exports = router;
