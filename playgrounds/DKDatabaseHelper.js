const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'letstrack';

// Create a new MongoClient
const client = new MongoClient(url);
// Use connect method to connect to the Server
client.connect((err) => {
    assert.equal(null, err);
    console.log("Connected successfully to server");
  
    const db = client.db(dbName);
  //   createUsersValidated(db,()=> {
  //     client.close()
  //   });
    //   insertDataInUsers(db,'Sunil Kumar','18374517','gfdhgaf921412@gmail.com',50, ()=>{
    //       client.close();
    //   });
     
    fetchUserDataByName(db,"Diwakar Yadav",(docs)=>{
        console.log(JSON.stringify(docs,undefined,2));
        client.close();
    })

  });
  function createUser(db, callback) {
      db.createCollection("user", { "capped": true, "size": 100000, "max": 5000},
        (err, results) => {
            if (err){
                return console.log("Unable to create user collection",err);
            }
          console.log("User Collection created.");
          callback();
        }
      );
    };
    function createUsersValidated(db, callback) {
      db.createCollection("users", 
           {
              'validator': { '$or':
                 [
                    { 'phone': { '$type': "string" } },
                    { 'email': { '$regex': /@mongodb\.com$/ } },
                    { 'name': {'$type': "string"}},
                    { 'age': {'$type': "int"}},
                 ]
              }
           },
        function(err, results) {
          if (err){
              return console.log("Unable to create user collection",err);
          }
          console.log("Collection created.");
          callback();
        }
      );
    };
    function insertDataInUsers(db, name, phone, email, age, callback){
        const col = db.collection('Users');
        col.insertOne({"name" : name, "phone": phone, "email": email, "age": age}, (err,result) =>{
              if(err){
                 console.log('Unable to insert users data', err)
                 callback(false)
              }
              else{
                console.log(JSON.stringify(result.ops, undefined, 2));
                callback(true);
              }
              
              
        });
    };
    function fetchAllUsersData(db,callback){
        const col = db.collection('Users');
        col.find({}).toArray((err, docs) => {
            if (err){
                return console.log('Unable to get users data', err);
            }
            console.log(JSON.stringify(docs,undefined,2));
            callback();
        });
    }
    function fetchUserDataByName(db,name,callback){
        const col = db.collection('Users');
        col.find({"name": name}).toArray((err, docs) => {
            if (err){
                return console.log('Unable to get users data', err);
            }
            callback(docs);
        });
    }
    function fetchUserDataByPhone(db,phone,callback){
        const col = db.collection('Users');
        col.find({"phone": phone}).toArray((err, docs) => {
            if (err){
                return console.log('Unable to get users data', err);
            }
            callback(docs);
        });
    }