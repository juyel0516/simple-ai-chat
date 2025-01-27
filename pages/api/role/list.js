import { roleListing } from 'utils/roleUtils';
import { authenticate } from 'utils/authUtils';
import { getUserRoles } from 'utils/sqliteUtils';

export default async function (req, res) {
  try {
    // User roles
    let userRoles = [];
    const authResult = authenticate(req);
    if (authResult.success) {
      const { id, username } = authResult.user;

      // Get user custom roles
      userRoles = await getUserRoles(username);
    }

    // Default roles
    const roles = await roleListing();

    // Output the result
    res.status(200).json({
      result: {
        user_roles: userRoles,
        roles : roles,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: {
        message: "An error occurred during your request.",
      },
    });
  }
}
