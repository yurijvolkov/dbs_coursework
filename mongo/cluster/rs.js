rs.initiate({
   _id : "sdb-cluster",
   members: [
      { _id: 0, host: "mongo1:27017" },
      { _id: 1, host: "mongo2:27017" },
      { _id: 2, host: "mongo3:27017" }
   ]
});

rs.addArb("arbiter1:27017");
rs.addArb("arbiter2:27017");
