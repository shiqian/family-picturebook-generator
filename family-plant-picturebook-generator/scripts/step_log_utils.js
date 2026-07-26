const fs = require("fs");

const FIELDS = ["Output", "Risk"];

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
    .split(/^## /m)
    .slice(1)
    .map((block) => {
      const [header, ...body] = block.split("\n");
      const match = header.match(/^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} [+-]\d{2}:\d{2}) \| (User|Codex|Script) \| (.+?) \| (.+)$/);
      if (!match) return { number: null, timestamp: null, actor: null, action: null, body: body.join("\n") };
      return {
        timestamp: match[1],
        actor: match[2],
        action: match[3],
        outcome: match[4],
        body: body.join("\n")
      };
    });
}

function validateLog(text) {
  const events = parseEvents(text);
  let previousTime = 0;
  const errors = [];
  events.forEach((event, index) => {
    if (!event.timestamp || !event.actor || !event.action || !event.outcome) {
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

function appendEvent(logPath, { actor, action, outcome = "completed", output, risk }) {
  const existing = fs.existsSync(logPath) ? fs.readFileSync(logPath, "utf8") : "# Production Log\n\n";
  const events = parseEvents(existing);
  const timestamp = formatTimestamp();
  const clean = (value) => String(value).replace(/\s+/g, " ").trim();
  const entry = [
    `## ${timestamp} | ${actor} | ${clean(action)} | ${clean(outcome)}`,
    `- Output: ${clean(output)}`,
    `- Risk: ${clean(risk)}`,
    "",
    ""
  ].join("\n");
  fs.writeFileSync(logPath, `${existing.replace(/\s*$/, "\n\n")}${entry}`);
  return timestamp;
}

module.exports = { appendEvent, formatTimestamp, validateLog };
