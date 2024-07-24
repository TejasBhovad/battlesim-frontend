# Testing

There are two routes created currently for testing if it can be call via CPP.

### Passing data from queries

This is a simple route that takes in a query(name) and returns greetings.

the route is `http://localhost:3000/api/greet?name=John`

### Passing data from body

This is a simple route that takes in a two numbers and returns the sum and product.

the req can be tested using cURL

```bash
 curl -X POST http://localhost:3000/api/sum \
    -H "Content-Type: application/json" \
    -d '{"num1": 5, "num2": 10}'
```

### Random color route

This is a simple route that returns a random color.

`http://localhost:3000/api/color`

### Secure route

This is a simple route that returns a message if the auth token is valid.

`http://localhost:3000/api/secure`

```bash
curl -X GET http://localhost:3000/api/secure \
 -H "Authorization: Bearer yoursecretkey"

```

here the `yoursecretkey` is the secret key that is used to validate the token which is stored in `.env.local` file.

### Starting the server

1. Clone the repo
2. Run `npm install`
3. Run `npm run dev`
4. Rename the `.env.example` to `.env.local` and add the secret key.
