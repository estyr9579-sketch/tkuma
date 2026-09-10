import Image from "next/image";

/** Brand mark (shield) – used in header / admin. */
export function LogoMark({ className = "h-11 w-auto" }: { className?: string }) {
  return <Image src="/logo-mark.png" alt="" width={318} height={365} className={className} priority />;
}

/** Full logo with wordmark – used in hero / footer, always on a light surface. */
export function LogoFull({ className = "w-64" }: { className?: string }) {
  return <Image src="/logo.png" alt="תקומה שלמה – הכוונה רגשית לבנייה עצמית מחדש" width={475} height={478} className={`h-auto ${className}`} />;
}
