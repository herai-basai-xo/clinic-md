const DURATION_SUFFIX_RE = /\s*-\s*\d+\s*min$/i;

export function getExtendOptions(currentTreatment, allTreatments) {
  if (!currentTreatment) return [];
  const baseName = currentTreatment.name.replace(DURATION_SUFFIX_RE, '').trim().toLowerCase();
  return (allTreatments || [])
    .filter(s =>
      s.is_active !== false &&
      s.category === currentTreatment.category &&
      s.name.replace(DURATION_SUFFIX_RE, '').trim().toLowerCase() === baseName &&
      s.duration_minutes > currentTreatment.duration_minutes
    )
    .sort((a, b) => a.duration_minutes - b.duration_minutes);
}
