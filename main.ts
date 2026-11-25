// The meeting that should have been one line: twelve people ignoring each other in person.
// One sentence, no context, no setup — the line itself is the whole meeting, cancelled.
// The gate wants 1-200 UTF-8 characters in /output/entry.txt, single line, no trailing newline.
import { promises as fsp } from "node:fs";
import { posix } from "node:path";

// The caps the sealed scorer enforces: keep the entry inside them or it never reaches the judge.
const limits = Object.freeze({ minChars: 1, maxChars: 200 });

// The sentence that replaces the meeting. It has to kill the meeting outright:
// after this line, nobody can justify holding it at all.
const sentence =
  "This meeting could have been an email, but the email would have been ignored, so instead twelve people are ignoring each other in person.";

function checkLine(text: string): void {
  if (text.length < limits.minChars || text.length > limits.maxChars) {
    throw new Error(`entry must be ${limits.minChars}-${limits.maxChars} chars, got ${text.length}`);
  }
  if (text.trim().length === 0) throw new Error("entry must not be only whitespace");
  if (text.includes("\n")) throw new Error("entry must be a single line");
  // The line has to be about the meeting itself, not just any office joke.
  if (!/meeting/i.test(text)) throw new Error("entry must mention the meeting");
}

async function deliver(): Promise<void> {
  checkLine(sentence);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "output";
  await fsp.mkdir(outDir, { recursive: true });
  const target = posix.join(outDir, "entry.txt");
  await fsp.writeFile(target, sentence, "utf8");
}

await deliver();
