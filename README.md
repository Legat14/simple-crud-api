# simple-crud-api

Simple CRUD API - training task in frame of the Rolling Scopes School course

## Instruction

1. Clone the repo on your local machine (`git clone https://github.com/Legat14/simple-crud-api.git`)

2. Open terminal inside the cloned folder

3. Connect develop branch (`git checkout --track origin/develop`)

4. Create `.env` file. Use `.env.example` as example

5. Print `npm run start:dev` or `yarn start:dev` to start server in development mode

6. Print `npm run start:prod` or `yarn start:prod` to start server in the production mode

7. Use any api Client (for example Postman) to make API requests and see the responses

8. App supports only one endpoint: api/users. Full URL could looks like this: `http://localhost:4000/api/users`

9. The User object interface:

```
   {
   id: string;
   username: string;
   age: number;
   hobbies: string[];
   }
   id will be added by server
```

10. Available request are: GET, POST, PUT, DELETE

11. Print `npm run test` or `yarn test` to run tests
