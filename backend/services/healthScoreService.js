const calculateHealthScore = (user, sips, nominees) => {
  let score = 0;

  // 1. KYC Approved (+25%)
  if (user.kycStatus === 'Approved') score += 25;

  // 2. Nominee Added (+25%)
  if (nominees && nominees.length > 0) score += 25;

  // 3. Active SIP exists (+25%)
  const hasActiveSip = sips.some(sip => sip.status === 'Active');
  if (hasActiveSip) score += 25;

  // 4. Verified Contacts (+12.5% each for email and mobile)
  if (user.email) score += 12.5;
  if (user.mobile) score += 12.5;

  score = Math.round(score);

  let label = 'Action Required';
  if (score >= 75) {
    label = 'Healthy';
  } else if (score >= 50) {
    label = 'Needs Attention';
  }

  const stars = Math.round((score / 100) * 5);

  return { score, stars, label };
};

module.exports = { calculateHealthScore };
