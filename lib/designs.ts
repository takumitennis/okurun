import fs from "fs";
import path from "path";

export type PaperDesign = {
  id: string; // filename without ext
  category: string; // e.g., flower/dot
  src: string; // public path
};

export function readPaperDesigns(): PaperDesign[] {
  const root = path.join(process.cwd(), "public", "designs", "papers");
  const categories = fs.existsSync(root) ? fs.readdirSync(root) : [];
  const results: PaperDesign[] = [];
  for (const cat of categories) {
    const dir = path.join(root, cat);
    if (!fs.statSync(dir).isDirectory()) continue;
    const files = fs.readdirSync(dir).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
    for (const file of files) {
      const id = file.replace(/\.(png|jpe?g|webp)$/i, "");
      results.push({ id, category: cat, src: `/designs/papers/${cat}/${file}` });
    }
  }
  return results;
}

export type CardDesign = {
  id: string;
  src: string;
};

export function readCardDesigns(): CardDesign[] {
  const dir = path.join(process.cwd(), "public", "designs", "cards");
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => /\.(png|jpe?g|webp)$/i.test(f)) : [];
  return files.map((file) => ({ id: file.replace(/\.(png|jpe?g|webp)$/i, ""), src: `/designs/cards/${file}` }));
}


