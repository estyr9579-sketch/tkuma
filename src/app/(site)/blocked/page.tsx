import { Container } from "@/components/ui/Container";
import { logout } from "@/actions/auth";
import { Button } from "@/components/ui/Button";

export default function BlockedPage() {
  return (
    <Container narrow className="py-24 text-center">
      <h1 className="text-3xl text-navy">החשבון נחסם</h1>
      <p className="mt-4 text-slate">הגישה לאזור האישי הושעתה. לבירור ניתן לפנות אלינו דרך עמוד צור קשר.</p>
      <form action={logout} className="mt-8">
        <Button type="submit" variant="secondary">התנתקות</Button>
      </form>
    </Container>
  );
}
