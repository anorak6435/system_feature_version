const express = require('express');
const app = express();
var cors = require('cors')

// CONFIG
// ---------------------

const port = 8090;

// ---------------------

app.use(cors())
app.use(express.static('public'))

app.listen(port, () => {
  console.log(`System Feature Version listening on port ${port}`)
});
