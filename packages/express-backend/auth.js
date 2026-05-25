import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import credentialServices from "./models/credentials-services.js";

// const creds = [];

export async function registerUser(req, res) {
  const { username, password } = req.body; // from form
  const credentialExists = await credentialServices.getCredential(username);

  if (!username || !password) {
    res.status(400).send("Bad request: Invalid input data.");
  } else if (credentialExists) {
    res.status(409).send("Username already taken");
  } else {
    bcrypt
      .genSalt(10)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        credentialServices
          .addCredential({ username, hashedPassword })
          .then((savedCredential) => {
            if (!savedCredential) {
            return res.status(500).send("Could not save credentials");
          }
          generateAccessToken(username).then((token) => {
            console.log("Token:", token);
            res.status(201).send({ token: token });
          });
        });
      });
  }
}
function generateAccessToken(username) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { username: username },
      process.env.TOKEN_SECRET,
      { expiresIn: "1d" },
      (error, token) => {
        if (error) {
          reject(error);
        } else {
          resolve(token);
        }
      },
    );
  });
}
export function authenticateUser(req, res, next) {
  const authHeader = req.headers["authorization"];
  //Getting the 2nd part of the auth header (the token)
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.log("No token received");
    res.status(401).end();
  } else {
    jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
      if (decoded) {
        next();
      } else {
        console.log("JWT error:", error);
        res.status(401).end();
      }
    });
  }
}
export async function loginUser(req, res) {
  const { username, password } = req.body; // from form
  const retrievedUser = await credentialServices.getCredential(username);

  if (!retrievedUser) {
    // invalid username
    res.status(401).send("Unauthorized");
  } else {
    bcrypt
      .compare(password, retrievedUser.hashedPassword)
      .then((matched) => {
        if (matched) {
          generateAccessToken(username).then((token) => {
            res.status(200).send({ token: token });
          });
        } else {
          // invalid password
          res.status(401).send("Unauthorized");
        }
      })
      .catch(() => {
        res.status(401).send("Unauthorized");
      });
  }
}
