import { getNode } from 'utils/sqliteUtils';
import { authenticate } from 'utils/authUtils';

export default async function (req, res) {
  const { nodeName } = req.query;

  try {
    const authResult = authenticate(req);
    if (!authResult.success) {
      return res.status(401).json({ 
        success: false,
        error: authResult.error
      });
    }

    if (authResult.success) {
      // Check if role exists in user roles
      const node = await getNode(nodeName, authResult.user.username);
      if (node) {
        return res.status(200).json({ 
          result: {
            node: node.name,
            owner: node.owner,
            created_by: node.created_by,
            settings: JSON.parse(node.settings),
          },
        });
      } else {
        return res.status(200).json({
          success: false,
          message: "Node not exists."
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred during your request.",
      error: error
    });
  }
}
