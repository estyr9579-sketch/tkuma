import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <Container narrow className="py-28 text-center">
          <p className="font-heading text-6xl text-gold">404</p>
          <h1 className="mt-4 text-3xl text-navy">העמוד לא נמצא</h1>
          <p className="mt-3 text-slate">ייתכן שהקישור שגוי או שהעמוד הוסר.</p>
          <Link href="/" className="mt-8 inline-block text-navy underline underline-offset-4">חזרה לדף הבית</Link>
        </Container>
      </main>
      <Footer />
    </>
  );
}
