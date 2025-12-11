/**
 * MAXNotes Automation Script (Reference)
 * --------------------------------------
 * This script demonstrates how to automatically update your product list
 * by scanning your Google Drive folders.
 * 
 * SETUP:
 * 1. Install Node.js
 * 2. Run: npm install googleapis
 * 3. Place your 'credentials.json' (Service Account Key) in the same folder.
 * 4. Run: node driveSyncReference.js
 * 
 * RESULT:
 * Generates a 'products.json' file that your React App can load.
 */

const fs = require('fs');
const { google } = require('googleapis');
const credentials = require('./credentials.json');

// 1. Authenticate
const auth = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  ['https://www.googleapis.com/auth/drive.readonly']
);
const drive = google.drive({ version: 'v3', auth });

const MASTER_FOLDER_ID = 'YOUR_MASTER_FOLDER_ID_HERE';

async function generateProductList() {
  try {
    console.log('Scanning Google Drive...');

    // 2. List all folders inside the Master Folder
    const res = await drive.files.list({
      q: `'${MASTER_FOLDER_ID}' in parents and mimeType = 'application/vnd.google-apps.folder'`,
      fields: 'files(id, name, description)', // Fetch ID, Name, and Description (from Drive Details sidebar)
    });

    const folders = res.data.files;
    const products = [];

    // 3. Transform Folders into Products
    for (const folder of folders) {
      // Parse details from the folder name or description
      // Example Folder Name: "CS101 - Intro to CS [Year 1]"
      
      products.push({
        id: folder.id,
        googleDriveId: folder.id,
        name: folder.name,
        description: folder.description || "No description available.",
        price: 10.00, // Default price
        category: 'Note',
        // You could parse tags from description
        tags: ['notes', 'auto-generated'], 
        image: 'https://placehold.co/600x400/000000/FFFFFF?text=' + encodeURIComponent(folder.name),
        // Simple logic to guess filter category
        filterCategory: folder.name.includes('Year 1') ? 'Year 1' : 'Technical Elective'
      });
    }

    // 4. Save to JSON
    const output = JSON.stringify(products, null, 2);
    fs.writeFileSync('../public/data/products.json', output);
    
    console.log(`Success! generated ${products.length} products.`);

  } catch (error) {
    console.error('Error syncing:', error);
  }
}

// Run the function
generateProductList();
