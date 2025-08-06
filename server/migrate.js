const sqlite3 = require('sqlite3').verbose();

// Connect to the database
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    return;
  }
  console.log('Connected to SQLite database for migration.');
  
  // Check if second_major column exists
  db.get("PRAGMA table_info(alumni)", (err, rows) => {
    if (err) {
      console.error('Error checking table structure:', err);
      return;
    }
    
    // Get all column names
    db.all("PRAGMA table_info(alumni)", (err, columns) => {
      if (err) {
        console.error('Error getting table info:', err);
        return;
      }
      
      const columnNames = columns.map(col => col.name);
      console.log('Current columns:', columnNames);
      
      // Check if second_major column exists
      if (!columnNames.includes('second_major')) {
        console.log('Adding second_major column...');
        
        // Add the second_major column
        db.run("ALTER TABLE alumni ADD COLUMN second_major TEXT", (err) => {
          if (err) {
            console.error('Error adding second_major column:', err);
          } else {
            console.log('Successfully added second_major column!');
            
            // Verify the column was added
            db.all("PRAGMA table_info(alumni)", (err, newColumns) => {
              if (err) {
                console.error('Error verifying table structure:', err);
              } else {
                const newColumnNames = newColumns.map(col => col.name);
                console.log('Updated columns:', newColumnNames);
                console.log('Migration completed successfully!');
              }
              db.close();
            });
          }
        });
      } else {
        console.log('second_major column already exists. No migration needed.');
        db.close();
      }
    });
  });
}); 