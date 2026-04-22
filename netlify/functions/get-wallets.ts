import { neon } from '@neondatabase/serverless';

export const handler = async () => {
  const sql = neon(process.env.DATABASE_URL!);
  try {
    const data = await sql`SELECT username, wallet, ref_count, is_whitelisted FROM whitelist ORDER BY ref_count DESC`;
    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (error: any) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};