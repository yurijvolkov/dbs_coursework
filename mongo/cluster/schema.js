conn = new Mongo()
db   = conn.getDB("dbs")

db.streets.drop();
db.buildings.drop();
db.users.drop();
db.tours.drop();

const location = {
  bsonType   : "object",
  required   : ["longitude", "latitude", "mapId"],
  properties : {
    longitude: { bsonType  : "number" },
    latitude : { bsonType  : "number" },
    map_id   : { bsonType  : "string" }
  }
};

db.createCollection("streets", {
  validator: {
    $jsonSchema: {
      bsonType    : "object",
      required    : [ "name", "location", "graphId"],
      properties  : {
        name: {
          bsonType    : "string",
          description : "Street's name",
          minLength   : 1,
        },
        graphId: { bsonType: "string" },
        wiki: { bsonType: "string"},
        location, 
        buildings: {
          bsonType: "array",
          items: {
            bsonType   : "objectId"
          } 
        } // buildings  
      }
    }
  }
});

db.streets.createIndex({name: 1});
db.streets.createIndex({graphId: 1}, {unique: true});
db.streets.createIndex({"buildings.buildingId": 1});

db.createCollection("buildings", {
  validator: {
    $jsonSchema: {
      bsonType   : "object",
      required   : ["address", "type", "location", "graphId"],
      properties : {
        address: {
          bsonType    : "string",
          description : "building's address",
          minLength   : 1,
        },
        graphId: { bsonType: "string" },
        type: {
          bsonType    : "string",
          description : "building's type",
          minLength   : 1,
        },
        name: {
          bsonType    : "string",
          description : "building's name",
          minLength   : 1,
        },
        location,
        streets: {
          bsonType: "array",
          items: { bsonType: "objectId" }
        },
        generalInfo: {
          bsonType: "string"
        },
        wiki: {
          bsonType: "string"
        },
        rooms: {
          bsonType: "array",
          items: {
            bsonType   : "object",
            required   : ["roomPlanId", "floor", "name", "graphId"],
            properties : {
              name      : { bsonType: "string" },
              floor     : { bsonType: "number" },
              graphId   : { bsonType: "string" },
              roomPlanId: {
                bsonType: "string",
                description: "room's id in plan"
              }
            }
          }
        },
        plans: {
          bsonType: "array",
          description: "building plans for each floor",
          items: {
            bsonType   : "object",
            required   : [ "mapPlanId"],
            properties : {              
              mapPlanId: {
                bsonType: "string",
                description: "building plan vector map identifier"
              },
            }
          } 
        } // plans
      }
    }
  }
});

db.buildings.createIndex({name:    1});
db.buildings.createIndex({address: 1});
db.buildings.createIndex({graphId: 1}, {unique: true});

db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType   : "object",
      required   : ["username", "password"],
      properties : {
        name: { bsonType: "string" },
        password: {
          bsonType: "string",
          description: "password's hash"
        },
        routesHistory: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["pathKey", "type", "date"],
            properties: {
              type: { bsonType: "string" },
              date: { bsonType: "date"   },
              pathKey: {
                bsonType: "string",
                description: "path's key in cassandra db"
              },
            }
          }
        }
      }
    }
  }
});

db.users.createIndex({username: 1}, {unique: true});

db.createCollection("tours", {
  validator: {
    $jsonSchema: {
      bsonType   : "object",
      required   : ["pathKey", "name", "createDate"],
      properties : {
        name: { bsonType: "string" },
        pathKey: {
          bsonType: "string",
          description: "path's key in cassandra db"
        },
        createDate : { bsonType: "date"   },
        description: { bsonType: "string" },
        commentaries: {
          bsonType: "array",
          items: {
            bsonType  : "object",
            required  : [ "author", "text", "date" ],
            properties: {
              author    : { bsonType: "objectId" }, // user 
              text      : { bsonType: "string" },
              date      : { bsonType: "date"   }
            }
          } //commentary
        }, // commentaries
      }
    }
  }
});

db.tours.createIndex({name: 1});
db.tours.createIndex({pathKey: 1}, {unique: true});
