import type { Metadata } from "next";
import { ContentPage } from "@/components/marketing/content-page";
import { SourceStamp } from "@/components/design-system/source-stamp";
import { getFact } from "@/lib/content/official-facts";

export const metadata: Metadata = {
  title: "Så fungerar provet",
  description:
    "Så går Förarintygsprovet till: godkäntgräns, provtid, åldersgräns och den officiella processen hos NFB. Vi förbereder dig — provet bokas separat.",
};

export default function Page() {
  const pass = getFact("pass_threshold_digital");
  const time = getFact("forar_exam_time");
  const age = getFact("forar_min_age");
  const fees = getFact("exam_fees_separate");

  return (
    <ContentPage
      title="Så fungerar provet"
      lead="Provet och intyget hanteras av den officiella processen hos NFB. Vår roll är att förbereda dig väl — här är hur stegen hänger ihop."
      sections={[
        {
          heading: "Vi förbereder — NFB provar",
          paragraphs: [
            "Sjöklart är en fristående utbildning. Vi lär dig det teoriprovet kräver och låter dig öva sjökortsarbetet interaktivt. Själva provet bokar du separat genom den officiella processen, och intyget utfärdas där.",
          ],
        },
        {
          heading: "Godkäntgräns",
          paragraphs: [
            pass.publicCopy,
            <SourceStamp
              key="s1"
              checkedAt={pass.verifiedAt}
              source={pass.sourceOrg}
              className="border-0 px-0"
            />,
          ],
        },
        {
          heading: "Provtid",
          paragraphs: [
            time.publicCopy,
            <SourceStamp
              key="s2"
              checkedAt={time.verifiedAt}
              source={time.sourceOrg}
              className="border-0 px-0"
            />,
          ],
        },
        {
          heading: "Åldersgräns",
          paragraphs: [age.publicCopy],
        },
        {
          heading: "Avgifter",
          paragraphs: [fees.publicCopy],
        },
      ]}
    />
  );
}
