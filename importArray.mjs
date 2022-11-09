const express = require("express");
const { open } = require("sqlite");

const sqlite3 = require("sqlite3");
const path = require("path");

const databasePath = path.join(__dirname, "userData.db");

const app = express();
const bcrypt = require("bcrypt");
app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () =>
      console.log("Server is Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

// const convertDbAndRegister = (dbObject) => {
//     return {
//         userName: dbObject.user_name,
//         name: dbObject.name,
//         password: dbObject.password,
//         gender: dbObject.gender
//         location: dbObject.location
//     }
// }

app.post("/register/", async (request, response) => {
  const { username, name, password, gender, location } = request.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const selectUserQuery = `SELECT * FROM user WHERE username = '${username}';`;
  const dbUser = await db.get(selectUserQuery);
  if (dbUser === undefined) {
    const createUserQuery = `INSERT INTO user(username, name, password, gender, location)
        VALUES ('${username}, '${name}', '${hashedPassword}', '${gender}', ${location});`;

    await database.run(createUserQuery);
    response.send("user created Successfully");
  } else {
    response.send("User already exists");
  }
});
