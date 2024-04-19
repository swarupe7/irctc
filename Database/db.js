
const Pool = require('pg').Pool;


//Function to connect to the database in Postgresql 
const pool = new Pool({
  user: "postgres",       
  localhost: "localhost", 
  database: "irctc",   
  password: "1234",       
  port: 5432              
});

module.exports={pool};


