const bcrypt = require("bcrypt")

module.exports = {
  async up(db, client) {
    const cursor = await db.collection("Users").find();

    while (await cursor.hasNext()) {
      
      const doc = await cursor.next();
      db.collection("Users").updateMany({}, { $unset: { password: "" } });
      const password = await bcrypt.hash(doc.password, 10);
      await db
        .collection("Users")
        .updateOne({ _id: doc._id }, { $set: { password: password } });
    }
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
