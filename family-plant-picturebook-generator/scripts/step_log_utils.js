const fs = require("fs");

const FIELDS = ["Timestamp", "Action", "Output", "Decision", "Risk"];

function formatTimestamp(date = new Date()) {
  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day} ${values.hour}:${values.minute}:${values.second} +08:00`;
}

function parseEvents(text) {
  return text
    .split(/^## Event /m)
    .slice(1)
    .map((block) => {
      const [header, ...body] = block.split("\n");
      const match = header.match(/^(\d{4}) — (.+?) — (User|Codex|Script) — (.+)$/);
      if (!match) return { number: null, timestamp: null, actor: null, action: null, body: body.join("\n") };
      return {
        number: Number(match[1]),
        timestamp: match[2],
        actor: match[3],
        action: match[4],
        body: body.join("\n")
      };
    });
}

function validateLog(text) {
  const events = parseEvents(text);
  let previousTime = 0;
  const errors = [];
  events.forEach((event, index) => {
    if (event.number !== index + 1) errors.push(`event ${index + 1} is not sequential`);
    if (!event.number || !event.timestamp || !event.actor || !event.action) {
      errors.push(`event ${index + 1} has an invalid header`);
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} [+-]\d{2}:\d{2}$/.test(event.timestamp)) {
      errors.push(`event ${index + 1} has an invalid timestamp`);
    }
    const time = Date.parse(event.timestamp.replace(" ", "T"));
    if (!Number.isNaN(time) && time < previousTime) errors.push(`event ${index + 1} is out of chronological order`);
    if (!Number.isNaN(time)) previousTime = time;
    for (const field of FIELDS) {
      const match = event.body.match(new RegExp(`^- ${field}: (.+)$`, "m"));
      if (!match || !match[1].trim()) errors.push(`event ${index + 1} is missing ${field}`);
      if (field === "Timestamp" && match && match[1].trim() !== event.timestamp) {
        errors.push(`event ${index + 1} header and field timestamps differ`);
      }
    }
  });
  return { events, errors, valid: events.length > 0 && errors.length === 0 };
}

function appendEvent(logPath, { actor, action, output, decision, risk }) {
  const existing = fs.existsSync(logPath) ? fs.readFileSync(logPath, "utf8") : "# Production Log\n\n";
  const events = parseEvents(existing);
  const number = String(events.length + 1).padStart(4, "0");
  const timestamp = formatTimestamp();
  const clean = (value) => String(value).replace(/\s+/g, " ").trim();
  const entry = [
    `## Event ${number} — ${timestamp} — ${actor} — ${clean(action)}`,
    `- Timestamp: ${timestamp}`,
    `- Action: ${clean(action)}`,
    `- Output: ${clean(output)}`,
    `- Decision: ${clean(decision)}`,
    `- Risk: ${clean(risk)}`,
    "",
    ""
  ].join("\n");
  fs.writeFileSync(logPath, `${existing.replace(/\s*$/, "\n\n")}${entry}`);
  return number;
}

module.exports = { appendEvent, formatTimestamp, validateLog };
