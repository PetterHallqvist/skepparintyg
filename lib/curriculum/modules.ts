/**
 * Förarintyg module map (SPEC §28.1–28.12). The twelve curriculum modules,
 * used by the readiness dashboard's per-module breadth view. Titles only —
 * the objectives themselves live in the content tables. Demo readiness values
 * feed the pre-cloud dashboard; real values come from objective_state.
 */

export type CurriculumModule = {
  id: string;
  title_sv: string;
  /** 0..1 demo readiness for the pre-DB dashboard. */
  demoReadiness: number;
};

export const FORAR_MODULES: CurriculumModule[] = [
  { id: "F1", title_sv: "Officiell process och säker omfattning", demoReadiness: 0.8 },
  { id: "F2", title_sv: "Sjömansspråk, enheter och kortorientering", demoReadiness: 0.72 },
  { id: "F3", title_sv: "Sjökortsinformation och symboler", demoReadiness: 0.64 },
  { id: "F4", title_sv: "Prickar, fyrar och sjömärken", demoReadiness: 0.58 },
  { id: "F5", title_sv: "Kompass, kurser och missvisning", demoReadiness: 0.46 },
  { id: "F6", title_sv: "Position, distans, kurs och rutt", demoReadiness: 0.4 },
  { id: "F7", title_sv: "Fart, tid, distans och rörelse", demoReadiness: 0.52 },
  { id: "F8", title_sv: "Väjningsregler och trafikbeteende", demoReadiness: 0.55 },
  { id: "F9", title_sv: "Säkerhet, nöd och första insats", demoReadiness: 0.6 },
  { id: "F10", title_sv: "Sjömanskap och båthantering (teori)", demoReadiness: 0.3 },
  { id: "F11", title_sv: "Väder, vatten och miljö", demoReadiness: 0.35 },
  { id: "F12", title_sv: "Regler, ansvar och slutlig integrering", demoReadiness: 0.28 },
];
