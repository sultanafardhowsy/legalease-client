const { MongoClient } = require('mongodb');

const uri = "mongodb://legalease_user:FossMBiXdwH4yb0N@ac-5d6fqqs-shard-00-00.te37oib.mongodb.net:27017,ac-5d6fqqs-shard-00-01.te37oib.mongodb.net:27017,ac-5d6fqqs-shard-00-02.te37oib.mongodb.net:27017/?ssl=true&replicaSet=atlas-jeh7zn-shard-0&authSource=admin&appName=Cluster0";

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected correctly to server");
    const db = client.db("test"); // Try "test" or empty to get default DB
    
    // List databases to find the correct one if 'test' isn't it
    const adminDb = client.db().admin();
    const dbs = await adminDb.listDatabases();
    console.log("Databases:");
    dbs.databases.forEach(db => console.log(` - ${db.name}`));

    // Try finding lawyers in 'test' db 'lawyers' or 'users' collection
    const targetDb = client.db("legalease_user");
    let lawyers = await targetDb.collection('lawyers').find({ name: { $regex: 'tahjib|salman|rosalind|sahara', $options: 'i' } }).toArray();
    console.log("Found in lawyers collection:", lawyers.map(l => ({ name: l.name, imageUrl: l.imageUrl || l.image })));
    
    // Also check users just in case it is in a different db
    const authDb = client.db("better-auth-db");
    const authUsers = await authDb.collection('user').find({ name: { $regex: 'tahjib|salman|rosalind|sahara', $options: 'i' } }).toArray();
    console.log("Found in better-auth-db user collection:", authUsers.map(l => ({ name: l.name, imageUrl: l.image || l.imageUrl })));

  } catch (err) {
    console.log(err.stack);
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
