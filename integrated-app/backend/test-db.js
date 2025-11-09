import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./event.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
    return;
  }
  console.log('Connected to database');
});

// Test the transaction directly
db.serialize(() => {
  console.log('Starting transaction test...');

  // Check current count
  db.get('SELECT COUNT(*) as count FROM students', (err, row) => {
    if (err) {
      console.error('Error getting count:', err);
      return;
    }
    console.log('Students before deletion:', row.count);

    // Begin transaction
    db.run('BEGIN TRANSACTION', (err) => {
      if (err) {
        console.error('Error beginning transaction:', err);
        return;
      }
      console.log('Transaction begun');

      // Delete votes
      db.run('DELETE FROM votes', function(err) {
        if (err) {
          console.error('Error deleting votes:', err);
          db.run('ROLLBACK');
          return;
        }
        console.log('Votes deleted:', this.changes);

        // Delete students
        db.run('DELETE FROM students', function(err) {
          if (err) {
            console.error('Error deleting students:', err);
            db.run('ROLLBACK');
            return;
          }
          console.log('Students deleted:', this.changes);

          // Commit
          db.run('COMMIT', (err) => {
            if (err) {
              console.error('Error committing:', err);
              db.run('ROLLBACK');
              return;
            }
            console.log('Transaction committed');

            // Check count after
            db.get('SELECT COUNT(*) as count FROM students', (err, row) => {
              console.log('Students after deletion:', row.count);
              db.close();
            });
          });
        });
      });
    });
  });
});