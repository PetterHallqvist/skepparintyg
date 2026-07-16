import Link from "next/link";
import { Logo } from "@/components/design-system/logo";
import { BRAND } from "@/lib/brand";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-contours flex min-h-svh flex-col">
      <header className="flex h-16 items-center px-6">
        <Link href="/" aria-label={`${BRAND.name} — startsida`}>
          <Logo />
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 pb-24">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}
