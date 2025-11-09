const { startServer } = require("./server");

require("dotenv").config();

const server = startServer();

const PORT = process.env.PORT || 4000;
server.listen(PORT, () =>
  console.log(`Server is now running on port: \x1b[34m${PORT}\x1b[0m`)
);
