const { v4: uuidv4 } = require('uuid');
module.exports = {
  async up(db, client) {
    const cursor = await db.collection("users").find();
    while (await cursor.hasNext()) {
      const doc = await cursor.next();
      await db
        .collection("users")
        .updateOne({ _id: doc._id }, { $set: { user_id: uuidv4() } });
    }
    const cursor2 = await db.collection("indexedusers").find();

    while (await cursor2.hasNext()) {
      const doc = await cursor2.next();
      await db
        .collection("indexedusers")
        .updateOne({ _id: doc._id }, { $set: { user_id: uuidv4() } });
    }
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
