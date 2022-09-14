# For Deploy locally 🐱‍🏍

1. Download Dependency

```
npm install
```

or

```
npm ci
```

2. Set up .env

```
//copy example.env to .env

cp example.env .env

///add config like below 👇

JWT_SECRET=secret
MONGO_URL=mongodb://localhost:27017/picode

```

3. Make assets directory

```
mkdir assets
```

4. For testing environment copy example.env to testing.env and follow step 2

5. Run test

```
npm run test
```

6. Run Development

```
npm run dev
```

expose at port (http://localhost)[http://localhost:5000]

---

# For Docker Deployment 🛳 🚀

```
docker-compose up
```

expose at port (http://localhost)[http://localhost]

---

url = http://localhost | http://localhost:5000

Graphql playground - {url}/graphiql

Graphql endpoint - {url}/graphql

Swagger Doc - {url}/doc

---
