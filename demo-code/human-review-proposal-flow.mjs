// Simplified portfolio example of EscenaIA's proposal-first editing model.
// AI suggestions never mutate production state directly.

export const PROPOSAL_STATUS = Object.freeze({
  DRAFT: 'draft',
  READY_FOR_REVIEW: 'ready_for_review',
  APPLIED: 'applied',
  REJECTED: 'rejected',
  STALE: 'stale'
});

export function buildReviewableProposal({ sourceVersionId, proposedData, diff }) {
  return Object.freeze({
    sourceVersionId,
    expectedActiveVersionId: sourceVersionId,
    proposedData,
    diff,
    status: PROPOSAL_STATUS.READY_FOR_REVIEW,
    autoApply: false
  });
}

export function applyReviewedProposal({ proposal, currentActiveVersionId, createVersion }) {
  if (proposal.status !== PROPOSAL_STATUS.READY_FOR_REVIEW) {
    throw Object.assign(new Error('Proposal is not reviewable.'), { code: 'PROPOSAL_NOT_READY' });
  }

  if (currentActiveVersionId !== proposal.expectedActiveVersionId) {
    return { ...proposal, status: PROPOSAL_STATUS.STALE };
  }

  const version = createVersion({
    parentVersionId: proposal.sourceVersionId,
    data: proposal.proposedData
  });

  return {
    ...proposal,
    status: PROPOSAL_STATUS.APPLIED,
    appliedVersionId: version.id
  };
}
