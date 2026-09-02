// Sanitized portfolio sample derived from EscenaIA Studio's private Brain contracts.
// It demonstrates how learned AI output is prevented from claiming deterministic authority.

const MODULE_ACTIONS = Object.freeze({
  Brief: ['stage_patch'],
  Guion: ['stage_patch'],
  Visual: ['stage_patch', 'canon_patch'],
  Movement: ['shot_plan_replace'],
  Voice: ['canon_patch'],
  Music: ['canon_patch'],
  SFX: ['canon_patch'],
  Editing: ['timeline_replace'],
  Text: ['postproduction_replace'],
  Color: ['postproduction_replace'],
  Adaptations: ['adaptation_replace'],
  QC: ['qc_audit']
});

export function validateActionAuthority(action) {
  const allowed = MODULE_ACTIONS[action.module];
  if (!allowed?.includes(action.actionType)) {
    throw Object.assign(new Error('Action is outside the active module boundary.'), {
      code: 'ACTION_NOT_ALLOWED'
    });
  }

  if (action.authority === 'CONFIRMED_BY_USER' && action.source !== 'user') {
    throw Object.assign(new Error('User confirmation requires an explicit user source.'), {
      code: 'AUTHORITY_INVALID'
    });
  }

  if (action.authority === 'CONFIRMED' && action.source !== 'deterministic') {
    throw Object.assign(new Error('Learned output cannot create confirmed facts.'), {
      code: 'AUTHORITY_INVALID'
    });
  }

  return { ...action, autoApply: false };
}
