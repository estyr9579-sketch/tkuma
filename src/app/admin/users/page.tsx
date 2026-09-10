import { adminGetUsers } from "@/lib/data";
import { requireAdmin } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import { UserRow } from "@/components/admin/UserRow";

export default async function AdminUsersPage() {
  const [me, users] = await Promise.all([requireAdmin(), adminGetUsers()]);
  return (
    <div>
      <h1 className="text-3xl text-navy">משתמשים רשומים</h1>
      <p className="mt-2 text-sm text-slate">"כותב" יכול לשלוח מאמרים לאישור. "משתמש" יכול להתחבר אך לא לשלוח מאמרים. מנהל מזוהה לפי מספר הטלפון המוגדר בשרת.</p>
      <div className="mt-8 overflow-x-auto border border-stone bg-white">
        <table className="w-full text-sm">
          <thead className="bg-mist text-right text-xs text-slate">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">שם</th>
              <th scope="col" className="px-4 py-3 font-medium">אימייל</th>
              <th scope="col" className="px-4 py-3 font-medium">טלפון</th>
              <th scope="col" className="px-4 py-3 font-medium">נרשם</th>
              <th scope="col" className="px-4 py-3 font-medium">הרשאה</th>
              <th scope="col" className="px-4 py-3 font-medium">פעולות</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone">
            {users.map((u) => <UserRow key={u.id} user={u} isSelf={u.id === me.id} joined={formatDate(u.created_at)} />)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
