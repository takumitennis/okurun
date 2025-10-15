import DesignsClient from "../../components/design/DesignsClient";
import { readPaperDesigns, readCardDesigns } from "../../lib/designs";

export default function Designs() {
  const papers = readPaperDesigns();
  const cards = readCardDesigns();
  return <DesignsClient papers={papers} cards={cards} />;
}


