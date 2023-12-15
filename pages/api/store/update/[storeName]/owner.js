import { updateStoreOwner, getStore, getUser } from 'utils/sqliteUtils.js';
import { authenticate } from 'utils/authUtils.js';

export default async function (req, res) {
  // Check if the method is POST.
  if (req.method !== 'POST') {
    return res.status(405).end();
  }
  
  // Authentication
  const authResult = authenticate(req);
  if (!authResult.success) {
    return res.status(401).json({ 
      success: false,
      error: authResult.error
    });
  }
  const { id, username } = authResult.user;

  // Store name
  const { storeName } = req.query;
  if (!storeName) {
    return res.status(400).json({ 
      success: false,
      error: 'Store name is required.' 
    });
  }

  // Input and validation
  const { owner : newOwner  } = req.body;
  if (!newOwner) {
    return res.status(400).json({ 
      success: false,
      error: 'Owner is required.' 
    });
  }

  try {
    // Check if the store exists
    const store = await getStore(storeName, username);
    if (!store) {
      return res.status(400).json({ 
        success: false, 
        error: 'Store not found.' 
      });
    }

    // Check if the user exists
    const user = await getUser(newOwner);
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        error: 'Owner not found.' 
      });
    }

    const wasSuccessful = await updateStoreOwner(storeName, username, newOwner);
    if (wasSuccessful) {
      return res.status(200).json({ 
        success: true, 
        message: "Store owner changed."
      });
    } else {
      return res.status(400).json({ 
        success: false, 
        error: 'Failed to update owner.'
      });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Error occurred while updating the user settings.'
    });
  }
}