var express = require('express');
var router = express.Router();
var emprunts = require('../emprunts.json')
var fs = require('fs');

/* GET users listing. */
router.get('/enCours', function(req, res) {
  const empruntsEnCours = emprunts.filter(emprunt => emprunt.date_retour==="")
  res.json(empruntsEnCours);

});

router.get('/enRetard', function(req, res) {

  const empruntsEnRetard = emprunts.filter(emprunt => emprunt.date_retour==="")
  res.json(empruntsEnRetard);

});




router.get("/:id", (req, res) => {

  const id=req.params.id
  var userId = parseInt(id, 10);
  const newEmprunts =emprunts.filter(emprunt => emprunt.user.id ===userId) 

  res.json(newEmprunts)
  
});




module.exports = router;
