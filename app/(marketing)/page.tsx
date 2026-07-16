import Link from "next/link";
import { ArrowRight, BookOpenCheck, Compass, Route, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CompassRose } from "@/components/design-system/compass-rose";
import { DisclaimerBlock } from "@/components/design-system/disclaimer-block";
import { PageShell } from "@/components/design-system/page-shell";
import { ReadinessGauge } from "@/components/design-system/readiness-gauge";
import { SectionHeading } from "@/components/design-system/section-heading";
import { SourceStamp } from "@/components/design-system/source-stamp";
import { StatusChip } from "@/components/design-system/status-chip";
import { HeroChartCard } from "@/components/marketing/hero-chart-card";
import { BRAND } from "@/lib/brand";
import { getFact } from "@/lib/content/official-facts";

const STEPS = [
  {
    n: "01",
    title: "Lär dig",
    body: "Korta lektioner med lösta exempel — varje påstående har en källa.",
    icon: BookOpenCheck,
  },
  {
    n: "02",
    title: "Öva",
    body: "Rita, mät och räkna på ett interaktivt övningssjökort. Få exakt återkoppling.",
    icon: Compass,
  },
  {
    n: "03",
    title: "Simulera",
    body: "Träningssimuleringar med verifierad provtid och godkäntgräns.",
    icon: Timer,
  },
  {
    n: "04",
    title: "Boka provet",
    body: "Det riktiga provet bokas separat genom den officiella processen.",
    icon: Route,
  },
] as const;

const DIFFERENTIATORS = [
  {
    title: "Rita kurslinjer och se exakt hur många grader du avviker.",
    body: "Sjökortslabbet graderar din linje, din position och din uträkning — inte bara ett kryssalternativ.",
  },
  {
    title: "Få nya övningsvarianter när du missförstår ett moment.",
    body: "Felboken grupperar dina fel per missuppfattning och tränar bort mönstret, inte bara den enskilda frågan.",
  },
  {
    title:
      "Se vilka kunskapsområden som fortfarande hindrar din provberedskap.",
    body: "Beredskapen förklarar alltid varför — vad som är befäst, vad som är svagt och vad du bör göra härnäst.",
  },
] as const;

const CERTIFICATES = [
  {
    id: "forarintyg",
    title: "Förarintyg",
    body: "Grundintyget för fritidsbåt. Sjökortsarbete, väjningsregler, säkerhet och sjömanskap.",
    status: "Byggs nu",
    tone: "info" as const,
    href: "/forarintyg",
  },
  {
    id: "kustskepparintyg",
    title: "Kustskepparintyg",
    body: "Fördjupad navigation, mörker och ruttplanering. Kräver Förarintyg och båtpraktik.",
    status: "Planerad",
    tone: "neutral" as const,
    href: "/kustskepparintyg",
  },
  {
    id: "src",
    title: "SRC (VHF)",
    body: "Marin radiokommunikation med scenarioövningar. Officiell simulator ingår i NFB:s process.",
    status: "Planerad",
    tone: "neutral" as const,
    href: "/src",
  },
  {
    id: "batpraktik",
    title: "Båtpraktik — förberedelse",
    body: "Checklista, genomgång och loggbok inför det handledda praktikpasset. Praktiken sker fysiskt.",
    status: "Planerad",
    tone: "neutral" as const,
    href: "/batpraktik",
  },
] as const;

const FAQ = [
  {
    q: "Utfärdar ni Förarintyget?",
    a: "Nej. Vi är en fristående utbildning. Provet bokas och intyget utfärdas genom den officiella processen hos NFB — vi förbereder dig och visar exakt hur stegen hänger ihop.",
  },
  {
    q: "Vad kostar det officiella provet?",
    a: "Provlicens och bokningsavgift betalas separat till den officiella processen och ingår inte i vårt pris. Aktuella avgifter visas alltid med datum för senaste kontroll.",
  },
  {
    q: "Kan mitt barn använda kursen?",
    a: "Ja. Förarintyg har 12-årsgräns. Kontot och köpet ägs av en vuxen, och eleven får en egen profil utan marknadsföring eller onödig datainsamling.",
  },
  {
    q: "Räcker er kurs för att klara provet?",
    a: "Vi mäter din beredskap öppet och visar vad som återstår — men ingen kurs kan garantera ett provresultat. Vi lovar ärlig återkoppling, inte garantier.",
  },
] as const;

export default function HomePage() {
  const passFact = getFact("pass_threshold_digital");
  const timeFact = getFact("forar_exam_time");
  const feeFact = getFact("exam_fees_separate");

  return (
    <>
      {/* 1. Hero */}
      <section className="bg-contours relative overflow-hidden border-b border-border">
        <CompassRose className="pointer-events-none absolute -right-24 -top-24 size-96 text-navy-800/10" />
        <PageShell className="grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
            <p className="text-label mb-4 flex items-center gap-3 text-sea-700">
              <span aria-hidden="true" className="h-px w-8 bg-current" />
              Förberedelse inför Förarintyg
            </p>
            <h1 className="font-serif text-4xl font-medium leading-tight tracking-tight text-balance sm:text-5xl lg:text-[3.4rem]">
              Förbered dig för Förarintyget genom att faktiskt öva.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Lär dig reglerna, träna sjökortsarbete på ett interaktivt
              övningskort och få en personlig plan fram till provdagen.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button size="lg" render={<Link href="/gratis-kunskapstest" />}>
                Gör gratis kunskapstest
                <ArrowRight aria-hidden="true" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                render={<Link href="/gratis-sjokortsovning" />}
              >
                Prova sjökortsövningen
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              {BRAND.independenceDisclaimer}
            </p>
          </div>
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 [animation-delay:150ms]">
            <HeroChartCard />
          </div>
        </PageShell>
      </section>

      {/* 2. How it works */}
      <section className="border-b border-border">
        <PageShell className="py-16 sm:py-20">
          <SectionHeading
            kicker="Metoden"
            title="Lär dig, öva, simulera — boka sedan det riktiga provet"
            lead="Passiv video tar dig inte till godkänt. Vår metod bygger på att du gör momenten själv, med omedelbar och exakt återkoppling."
          />
          <ol className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <li key={step.n} className="bg-card p-6">
                <div className="flex items-center justify-between">
                  <span className="font-readout text-sm text-sea-700">
                    {step.n}
                  </span>
                  <step.icon
                    aria-hidden="true"
                    className="size-4 text-muted-foreground"
                  />
                </div>
                <h3 className="mt-4 font-semibold">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </PageShell>
      </section>

      {/* 3. Differentiators */}
      <section className="border-b border-border bg-paper-sunken/60">
        <PageShell className="py-16 sm:py-20">
          <SectionHeading
            kicker="Därför är det annorlunda"
            title="Träning i att göra, inte i att känna igen svar"
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {DIFFERENTIATORS.map((item) => (
              <Card key={item.title} className="bezel">
                <CardContent>
                  <h3 className="font-semibold leading-snug text-balance">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </PageShell>
      </section>

      {/* 4. Certificates */}
      <section className="border-b border-border">
        <PageShell className="py-16 sm:py-20">
          <SectionHeading
            kicker="Intyg"
            title="Ett intyg i taget, i rätt ordning"
            lead="Vi lanserar Förarintyg först och bygger vidare mot Kustskeppar, SRC och praktikförberedelse — med samma krav på källor och granskning."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {CERTIFICATES.map((cert) => (
              <Link
                key={cert.id}
                href={cert.href}
                className="group rounded-lg border border-border bg-card p-6 transition-colors hover:border-navy-600/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-semibold">{cert.title}</h3>
                  <StatusChip tone={cert.tone}>{cert.status}</StatusChip>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {cert.body}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-sea-700 group-hover:underline">
                  Läs mer
                  <ArrowRight aria-hidden="true" className="size-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </PageShell>
      </section>

      {/* 5. Readiness */}
      <section className="border-b border-border">
        <div className="theme-instrument bg-graticule">
          <PageShell className="grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="flex justify-center lg:justify-start">
              <div className="bezel border border-border bg-card/60 p-8">
                <ReadinessGauge score={78} />
              </div>
            </div>
            <div>
              <SectionHeading
                kicker="Beredskap"
                title="Ett ärligt mått — aldrig en garanti"
                lead="Beredskapen väger täckning, varaktigt minne, praktisk färdighet och simuleringsresultat. Panelen ”Så beräknas detta” visar alltid vilka belägg som höjde eller sänkte den — och vad du bör göra härnäst."
              />
              <p className="mt-6 text-sm text-muted-foreground">
                {BRAND.readinessDisclaimer}
              </p>
            </div>
          </PageShell>
        </div>
      </section>

      {/* 6. Official process */}
      <section className="border-b border-border">
        <PageShell width="narrow" className="py-16 sm:py-20">
          <SectionHeading
            kicker="Den officiella processen"
            title="Provet och intyget hanteras av NFB — vi förbereder dig"
            lead="Vi visar alltid aktuella officiella uppgifter med datum för senaste kontroll, och exakt vilka steg som återstår utanför kursen."
          />
          <dl className="mt-10 divide-y divide-border border-y border-border">
            {[passFact, timeFact, feeFact].map((fact) => (
              <div
                key={fact.id}
                className="grid gap-2 py-4 sm:grid-cols-[220px_1fr] sm:gap-6"
              >
                <dt className="text-label pt-1 text-muted-foreground">
                  {fact.label}
                </dt>
                <dd>
                  <p className="font-readout text-lg">{fact.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {fact.publicCopy}
                  </p>
                  <SourceStamp
                    checkedAt={fact.verifiedAt}
                    source={fact.sourceOrg}
                    className="mt-2 border-0 px-0"
                  />
                </dd>
              </div>
            ))}
          </dl>
          <DisclaimerBlock className="mt-8">
            {BRAND.independenceDisclaimer} Officiella avgifter för provlicens
            och bokning betalas separat och ingår inte i kurspriset.
          </DisclaimerBlock>
        </PageShell>
      </section>

      {/* 7. FAQ */}
      <section className="border-b border-border bg-paper-sunken/60">
        <PageShell width="narrow" className="py-16 sm:py-20">
          <SectionHeading
            kicker="Vanliga frågor"
            title="Raka svar på det viktigaste"
          />
          <div className="mt-8 divide-y divide-border border-y border-border">
            {FAQ.map((item) => (
              <details key={item.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span
                    aria-hidden="true"
                    className="font-readout text-muted-foreground transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </PageShell>
      </section>

      {/* 8. Final CTA */}
      <section>
        <PageShell className="py-16 sm:py-24">
          <div className="theme-instrument bg-contours bezel relative overflow-hidden rounded-lg border border-border bg-background px-8 py-12 text-center sm:px-16">
            <CompassRose className="pointer-events-none absolute -left-20 -bottom-24 size-72 text-sea-300/10" />
            <h2 className="font-serif text-3xl font-medium tracking-tight text-balance sm:text-4xl">
              Börja med ett gratis kunskapstest
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Direkt resultat på skärmen — ingen e-post krävs. Därefter får du
              en tydlig bild av vad du redan kan och vad som återstår.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button size="lg" render={<Link href="/gratis-kunskapstest" />}>
                Gör gratis kunskapstest
                <ArrowRight aria-hidden="true" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                render={<Link href="/gratis-sjokortsovning" />}
              >
                Prova sjökortsövningen
              </Button>
            </div>
          </div>
        </PageShell>
      </section>
    </>
  );
}
