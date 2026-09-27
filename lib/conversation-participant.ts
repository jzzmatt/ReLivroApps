type ProfileSnippet = {display_name: string | null} | null | undefined;

export function otherParticipantId(
  conversation: {buyer_id: string; seller_id: string},
  userId: string,
): string {
  return conversation.buyer_id === userId ? conversation.seller_id : conversation.buyer_id;
}

export function participantName(profile: ProfileSnippet, fallback: string): string {
  return profile?.display_name?.trim() || fallback;
}

export function isSellerSide(
  conversation: {seller_id: string},
  participantId: string,
): boolean {
  return conversation.seller_id === participantId;
}
