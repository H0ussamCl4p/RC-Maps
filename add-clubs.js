const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./event.db');

db.serialize(() => {
  // Add some test clubs
  db.run("INSERT INTO clubs (name, description) VALUES ('Club A', 'Test club A')");
  db.run("INSERT INTO clubs (name, description) VALUES ('Club B', 'Test club B')");
  db.run("INSERT INTO clubs (name, description) VALUES ('Club C', 'Test club C')");

  db.all('SELECT COUNT(*) as count FROM clubs', (err, result) => {
    console.log('Clubs count after adding:', result[0].count);
    db.close();
  });
});