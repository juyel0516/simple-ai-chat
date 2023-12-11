import { getUser } from 'utils/sqliteUtils.js';
import { authenticate } from 'utils/authUtils.js';
import { countChatsForUser } from 'utils/sqliteUtils.js';
import { getUsageLimit } from 'utils/envUtils.js';
import { createToken } from 'utils/authUtils.js';

export default async function (req, res) {
  // Method Not Allowed if not GET
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  // Authentication
  const authResult = authenticate(req);
  if (!authResult.success) {
    return res.status(401).json({ error: authResult.error });
  }
  const { id, username } = authResult.user;

  try {
    const user = await getUser(username);
    if (user) {
      // Refresh user auth token
      // Create JWT token
      const payload = { 
        id: user.id, 
        username: user.username,
        subscription: user.role,
        email: user.email,
      };
      const token = createToken(payload);
      if (!token) {
        return res.status(500).json({ error: 'Failed to create token.' });
      }

      // Set the token as a cookie
      const sameSiteCookie = process.env.SAME_SITE_COOKIE;
      res.setHeader('Set-Cookie', `auth=${token}; HttpOnly; Path=/; Max-Age=86400; ${sameSiteCookie}`);

      res.status(200).json({ 
        user: {
          id: user.id, 
          username: user.username,
          email: user.email,
          settings: user.settings,
          role: user.role,
          role_expires_at: user.role_expires_at,
          usage: JSON.stringify(await getUserUsageWithLimit(user.username, user.role)),
        }
      });
    } else {
      // Clear the auth token cookie
      res.setHeader('Set-Cookie', `auth=; HttpOnly; Path=/; Max-Age=0`);

      // Return user is removed when user not exist
      res.status(404).json({ error: 'User has been removed.' });
    }
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error
    });
  }
}

async function getUserUsageWithLimit(username, role) {
  const daily = await countChatsForUser(username, Date.now() - 86400000, Date.now());
  const weekly = await countChatsForUser(username, Date.now() - 604800000, Date.now());
  const monthly = await countChatsForUser(username, Date.now() - 2592000000, Date.now());
  const { daily_limit, weekly_limit, monthly_limit } = getUsageLimit(role);

  let exceeded = false;
  if (daily_limit && daily >= daily_limit) {
    exceeded = true;
  }

  if (weekly_limit && weekly >= weekly_limit) {
    exceeded = true;
  }

  if (weekly_limit && monthly >= monthly_limit) {
    exceeded = true;
  }

  return {
    daily,
    daily_limit,
    weekly,
    weekly_limit,
    monthly,
    monthly_limit,
    exceeded,
  }
}
