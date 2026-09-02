// Sanitized portfolio sample from the conversational Brain safety boundary.
// Unknown or malformed learned mutations are discarded instead of being applied.

const SAFE_STATES = new Set([
  'THINKING', 'STRUCTURING', 'WRITING', 'REVIEWING',
  'WAITING_CONFIRMATION', 'READY', 'BLOCKED'
]);

const LEARNED_AUTHORITIES = new Set(['SUGGESTED', 'INFERRED']);
const RESERVED_NAMESPACES = new Set(['project_id', 'workflow', 'gate', 'system']);

function text(value, max) {
  if (typeof value !== 'string') return null;
  const clean = value.trim();
  return clean ? clean.slice(0, max) : null;
}

export function sanitizeLearnedOutput(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Model output must be an object.');
  }

  const assistantText = text(value.assistantText, 12_000);
  const module = text(value.module, 80);
  const intent = text(value.intent, 200);
  if (!assistantText || !module || !intent) throw new Error('Missing conversational fields.');

  const memoryWrites = (Array.isArray(value.memoryWrites) ? value.memoryWrites : [])
    .filter((item) => item && typeof item === 'object' && !Array.isArray(item))
    .map((item) => {
      const namespace = text(item.namespace, 120);
      const key = text(item.key, 200);
      if (!namespace || !key || item.value == null) return null;
      if (RESERVED_NAMESPACES.has(namespace.toLowerCase())) return null;
      return {
        namespace,
        key,
        value: item.value,
        authority: LEARNED_AUTHORITIES.has(item.authority) ? item.authority : 'SUGGESTED'
      };
    })
    .filter(Boolean)
    .slice(0, 30);

  return {
    assistantText,
    module,
    intent,
    state: SAFE_STATES.has(value.state) ? value.state : 'REVIEWING',
    memoryWrites,
    autoApply: false
  };
}
