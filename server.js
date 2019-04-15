const root = process.cwd(),
   path = require('path'),
   express = require('express'),
   fs = require('fs'),
   app = express(),
   resourcesPath = path.join('', '.');

const global = (function() {
   return this || (0, eval)('this');
})();

const clients = {};
const indexFile = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

app.use(express.static(resourcesPath));
const port = process.env.PORT || 777;
var expressServer = app.listen(port);

app.get('/detail/*', (req, res) => {
  res.send(indexFile);
});

app.get('/main/*', (req, res) => {
  res.send(indexFile);
});
