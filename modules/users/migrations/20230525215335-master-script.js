module.exports = {
  async up(db, client) {
    db.createCollection("IndexedUsers");
    db.collection("IndexedUsers").createIndexes(
      [
        {
          email: 1,
        },
      ],
      {
        unique: true,
        sparse: true,
        expireAfterSeconds: 3600,
      }
    );
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
  },

  async down(db, client) {
    db.collection("IndexedUsers").dropIndexes();
    db.collection("Users").drop();
    db.collection("IndexedUsers").drop();
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
