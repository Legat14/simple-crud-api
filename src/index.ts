const { createServer } = require("node:http");
const { User } = require("./entities/user");
const { validate: uuidValidate } = require("uuid");

require("dotenv").config();

import type { IncomingMessage, ServerResponse } from "node:http";

const usersDB: InstanceType<typeof User>[] = [];

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  const { url, method } = req;
  res.setHeader("Content-Type", "application/json");

  if (!url || !method) {
    const errorCode = 400;
    res.statusCode = errorCode;
    res.end(JSON.stringify("Bad Request"));
    console.log(`\x1b[31m${errorCode}: Bad Request\x1b[0m`);
    return;
  }

  if (url === "/api/users" && method === "GET") {
    const successCode = 200;
    res.statusCode = successCode;
    res.end(JSON.stringify(usersDB));
    console.log(
      `\x1b[32m${successCode}: All users were successfully shown\x1b[0m`
    );
  } else if (url.startsWith("/api/users/") && method === "GET") {
    const id = url.split("/").pop();

    if (!uuidValidate(id)) {
      const errorCode = 400;
      res.statusCode = errorCode;
      res.end(JSON.stringify(`Invalid user ID (${id})`));
      console.log(
        `\x1b[31m${errorCode}: Invalid user ID (${id}) was requested\x1b[0m`
      );
      return;
    }

    const user = usersDB.find((user) => user.id === id);
    if (user) {
      const successCode = 200;
      res.statusCode = successCode;
      res.end(JSON.stringify(user));
      console.log(
        `\x1b[32m${successCode}: User ${id} was successfully shown\x1b[0m`
      );
    } else {
      const errorCode = 404;
      res.statusCode = errorCode;
      res.end(JSON.stringify(`User ${id} was not found`));
      console.log(`\x1b[31m${errorCode}: User ${id} was not found\x1b[0m`);
    }
  } else if (url === "/api/users" && method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const newUser = new User(JSON.parse(body));
        usersDB.push(newUser);
        const successCode = 201;
        res.statusCode = successCode;
        res.end(JSON.stringify(newUser));
        console.log(
          `\x1b[32m${successCode}: User ${newUser.id} was successfully created\x1b[0m`
        );
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : error;
        const errorCode = 400;
        res.statusCode = errorCode;
        res.end(JSON.stringify(errorMessage));
        console.log(
          `\x1b[31m${errorCode}: User creation failed: ${errorMessage}\x1b[0m`
        );
      }
    });
  } else if (url.startsWith("/api/users/") && method === "PUT") {
    const id = url.split("/").pop();

    if (!uuidValidate(id)) {
      const errorCode = 400;
      res.statusCode = errorCode;
      res.end(JSON.stringify(`Invalid user ID (${id})`));
      console.log(
        `\x1b[31m${errorCode}: Invalid user ID (${id}) was requested\x1b[0m`
      );
      return;
    }

    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const user = usersDB.find((user) => user.id === id);
        if (user) {
          const successCode = 200;
          res.statusCode = successCode;
          user.update(JSON.parse(body));
          res.end(JSON.stringify(user));
          console.log(
            `\x1b[32m${successCode}: User ${id} was successfully updated\x1b[0m`
          );
        } else {
          const errorCode = 404;
          res.statusCode = errorCode;
          res.end(JSON.stringify(`User ${id} was not found`));
          console.log(`\x1b[31m${errorCode}: User ${id} was not found\x1b[0m`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : error;
        const errorCode = 400;
        res.statusCode = errorCode;
        res.end(JSON.stringify(errorMessage));
        console.log(
          `\x1b[31m${errorCode}: User update failed: ${errorMessage}\x1b[0m`
        );
      }
    });
  } else if (url.startsWith("/api/users/") && method === "DELETE") {
    const id = url.split("/").pop();

    if (!uuidValidate(id)) {
      const errorCode = 400;
      res.statusCode = errorCode;
      res.end(JSON.stringify(`Invalid user ID (${id})`));
      console.log(
        `\x1b[31m${errorCode}: Invalid user ID (${id}) was requested\x1b[0m`
      );
      return;
    }

    try {
      const user = usersDB.find((user) => user.id === id);
      if (user) {
        const successCode = 204;
        res.statusCode = successCode;
        user.destroy(usersDB);
        res.end();
        console.log(
          `\x1b[32m${successCode}: User ${id} was successfully deleted\x1b[0m`
        );
      } else {
        const errorCode = 404;
        res.statusCode = errorCode;
        res.end(JSON.stringify(`User ${id} was not found`));
        console.log(`\x1b[31m${errorCode}: User ${id} was not found\x1b[0m`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : error;
      const errorCode = 400;
      res.statusCode = errorCode;
      res.end(JSON.stringify(errorMessage));
      console.log(
        `\x1b[31m${errorCode}: User deletion failed: ${errorMessage}\x1b[0m`
      );
    }
  } else {
    const errorCode = 404;
    res.statusCode = errorCode;
    res.end(
      JSON.stringify(
        `Endpoint you are looking for (${method} ${url}) was not found. Check URL and method, please.`
      )
    );
    console.log(
      `\x1b[31m${errorCode}: method ${method}, endpoint ${url} was not found\x1b[0m`
    );
  }
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () =>
  console.log(`Server is now running on port: \x1b[34m${PORT}\x1b[0m`)
);
