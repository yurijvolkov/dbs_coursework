/* for dev-test only */

conn = new Mongo()
db   = conn.getDB("dbs")

db.streets.deleteMany({});
db.streets.insertMany([{
    name: 'улица Есенина',
    graphId: 'e78as312a',
    location: {
      longitude: 12,
      latitude: 14,
      mapId: 'REAL_MAP_ESSENIN_STR'
    }
  }, { 
    name: 'улица Пушкина',
    graphId: 'e2468731270',
    location: {
      longitude: 12.7,
      latitude: 13.2,
      mapId: 'REAL_MAP_PUSHKIN_STR'
    }
  }
]);

for (var i = 0; i < 50000; i++) {
  db.streets.insertOne({
    graphId: (i + Math.random()) + "",
    name: 'STREET_' + Math.random() > 0.5 ? 'OF_MY' + i : '_KAWAI_' + i,
    location: {
      longitude: Math.random(),
      latitude: Math.random(),
      mapId: 'KEK_' + Math.random()
    }
  });
}

db.buildings.deleteMany({});
db.buildings.insertMany([{
  graphId: 'ewqe123',
  address: 'улица Есенина, дом Каруселина',
  type: 'дворец культуры и спорта',
  location: {
    longitude: 12.01,
    latitude: 14,
    mapId: 'REAL_MAP_KEK'
  },
}]);

for (var i = 0; i < 50000; i++) {
  db.buildings.insertOne({
    graphId: (i + Math.random()) + "",
    type: Math.random() > 0.5 ? 'HOUSE' : 'PALACE',
    address: 'da'+ i,
    location: {
      longitude: Math.random(),
      latitude: Math.random(),
      mapId: 'KEK_' + Math.random()
    }
  });
}


db.users.deleteMany({});
db.users.insertMany([{
 username: 'cspanda',
 password: '133714881337'
}]);
 
for (var i = 100000; i < 150000; i++) {
  db.users.insertOne({username: 's' + i, password: 'da'+ i});
}

db.tours.deleteMany({});
db.tours.insertMany([{
  name: 'YEAH_TOUR_YEAH',
  pathKey: 'SOMETHING_FROM_CASSANDRA',
  createDate: new Date()
}]);

for (var i = 1; i < 10000; i++) {
  db.tours.insertOne({name: 's' + i, pathKey: 'da'+ i, createDate: new Date()});
}


