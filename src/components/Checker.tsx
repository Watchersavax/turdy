export default function Checker({ data }: { data: any[] }) {
  return (
    <div className="mt-20 px-4">
      <h3 className="text-xl font-black mb-4 text-[#ffffff] uppercase">Wallet Leaderboard</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse border-2 border-black">
          <thead className="bg-black text-white uppercase text-xs">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Wallet</th>
              <th className="p-3 text-center">Ref Points</th>
              <th className="p-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {data.map((user, i) => (
              <tr key={i} className="border-b-2 border-black hover:bg-zinc-50">
                <td className="p-3 font-bold">{user.username}</td>
                <td className="p-3 text-sm opacity-60 font-mono">{user.wallet.slice(0,6)}...{user.wallet.slice(-4)}</td>
                <td className="p-3 text-center font-black text-brand-blue">{user.ref_count}</td>
                <td className="p-3 text-center">
                  {user.is_whitelisted ? '✅' : '⏳'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}