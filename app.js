const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const bcrypt = require("bcrypt");

const databasePath = path.join(__dirname, "userData.db");

const app = express();

app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3002/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();
const validatePassword=(password)=>{
    return password.length>4;
}

app.post("/register",async(request,response)=>{
    const {username,name,password,gender,location}=request.body;
     const hashedPassword=await bcrypt.hash(password,15);
     const query1=`SELECT username FROM user WHERE user='${username}';`;
     const query1result=await database.get(query1);
     if (query1result===undefined){
         const query2=`
         INSERT INTO
         user(username,name,password,gender,location)
         VALUES
         (
             '${username}',
       '${name}',
       '${hashedPassword}',
       '${gender}',
       '${location}'  
         );`;
         if(validatePassword(password)){
             await database.run(query2);
             response.send("User created successfully");
         }

     }else{
         response.send("400");
         response.send("Password is too short");

     }
    }else{
         response.send("400");
         response.send("User already exists");

     }



});




module.exports = app;

