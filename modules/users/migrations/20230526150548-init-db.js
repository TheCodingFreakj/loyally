module.exports = {
  async up(db, client) {
    console.time("response in");
    await db.collection("indexedusers").drop();
    await db.collection("users").drop();
    console.timeEnd("response in");
    console.time("response in");
    const isExist = db.collection("indexedusers").indexExists(["email"]);
    if (isExist === true) {
      await db.collection("indexedusers").dropIndex({ email: 1 });
    }
    console.timeEnd("response in");
    console.time("response in");
    await db.createCollection("indexedusers");
    await db.createCollection("users");
    console.timeEnd("response in");

    console.time("response in");
    await db.collection("indexedusers").createIndex({ email: 1 });
    console.timeEnd("response in");
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
