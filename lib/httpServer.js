module.exports = {
  init: function(config) {
    var fs = require('fs');
    var node_static = require('node-static');
    var h;
    var serverCfg = {};

    // static files server
    var static_directory = new node_static.Server('./html');

    // http listeners
    function listeners(req, res) {
      console.log(' [http] connect - ' + req.url);

      //req.addListener('request', function(req, res) {
      //  console.log('[http] request - ' + req.url);
      //  static_directory.serve(req, res);
      //});
      req.addListener('upgrade', function(req,res){
        console.log(' [http] upgrade - ' + req.url);
        res.end();
      });

      req.addListener('end', function () {
        console.log(' [http] end - ' + req.url);
        static_directory.serve(req, res);
      });
    }


    // initiallize http or https server
    var server;
    if (config.HOST.ENABLE_TLS) {
      h = require('https');
      serverCfg = {
        key: fs.readFileSync(config.HOST.TLS_DIR + '/tls.key'),
        cert: fs.readFileSync(config.HOST.TLS_DIR + '/tls.cert'),
        ca: fs.readFileSync(config.HOST.TLS_DIR + '/ca.pem')
      };
      server = h.createServer(serverCfg, listeners);
    } else {
      h = require('http');
      server = h.createServer(listeners);
    }


    // start http server
    server.listen(config.HOST.PORT, function () {
      console.log(' [http] server is listening on port ' + config.HOST.PORT);
    });
    return server;
  }
};