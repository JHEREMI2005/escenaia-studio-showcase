import test from 'node:test';
import assert from 'node:assert/strict';
import { validateActionAuthority } from './ai-authority-gate.mjs';
import { sanitizeLearnedOutput } from './conversational-output-safety.mjs';

test('learned AI cannot claim deterministic confirmation', () => {
  assert.throws(() => validateActionAuthority({
    module: 'Brief',
    actionType: 'stage_patch',
    source: 'ai',
    authority: 'CONFIRMED'
  }), (error) => error.code === 'AUTHORITY_INVALID');
});

test('sanitizer fails closed on malformed learned mutations', () => {
  const output = sanitizeLearnedOutput({
    assistantText: 'Working on the Brief.',
    module: 'Brief',
    intent: 'structure_audience',
    state: 'made_up_state',
    memoryWrites: ['audience 18-30']
  });

  assert.equal(output.state, 'REVIEWING');
  assert.deepEqual(output.memoryWrites, []);
  assert.equal(output.autoApply, false);
});

test('sanitizer never promotes learned authority', () => {
  const output = sanitizeLearnedOutput({
    assistantText: 'Audience captured as a suggestion.',
    module: 'Brief',
    intent: 'structure_audience',
    state: 'STRUCTURING',
    memoryWrites: [{
      namespace: 'brief',
      key: 'audience',
      value: '18-30',
      authority: 'CONFIRMED_BY_USER'
    }]
  });

  assert.equal(output.memoryWrites[0].authority, 'SUGGESTED');
});
