import { NextResponse } from "next/server";
import { readPaperDesigns, readCardDesigns } from "../../../lib/designs";

export async function GET() {
  try {
    const papers = readPaperDesigns();
    const cards = readCardDesigns();
    return NextResponse.json({ papers, cards }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ papers: [], cards: [], error: String(e) }, { status: 200 });
  }
}


