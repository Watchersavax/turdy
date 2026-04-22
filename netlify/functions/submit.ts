import { neon } from '@neondatabase/serverless';

export const handler = async (event: any) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  
  const sql = neon(process.env.DATABASE_URL!);
  const { username, wallet, commentLink, quoteLink, referrer } = JSON.parse(event.body);

  try {
    // 1. Insert the new user
    await sql`
      INSERT INTO whitelist (username, wallet, comment_link, quote_link, referrer_code)
      VALUES (${username}, ${wallet}, ${commentLink}, ${quoteLink}, ${referrer})
    `;

    // 2. If there's a referrer, increment their points
    if (referrer) {
      await sql`
        UPDATE whitelist SET ref_count = ref_count + 1 WHERE username = ${referrer}
      `;
    }

    return { statusCode: 200, body: JSON.stringify({ message: 'Success' }) };
  } catch (error: any) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};