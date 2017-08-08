let Watch = require('../models/Watch');

/**
 * GET /
 */

exports.index = function(req, res) {
  Watch.find({}, null, {sort: '-year'}, function(err, watch){
    if(err){
      console.log(err);
    } else {
      res.render('home', {
        title:'Início',
        watch: watch
      });
    }
  });
};
