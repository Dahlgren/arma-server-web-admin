var Gamedig = require('gamedig');
var ip = require('ip');

exports.index = function (req, res){
  Gamedig.query({
      type: 'arma3',
      host: ip.address()
    },
    function(state) {
      if(state.error) {
        res.send({error: state.error});
      } else {
        res.send(state.raw);
      }
    }
  );
};
