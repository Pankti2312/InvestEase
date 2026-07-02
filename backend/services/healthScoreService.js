const calculateHealthScore = (user, sips, nominees, investments) => {
  let score = 0;

  // 1. KYC Approved (+30)
  if (user.kycStatus === 'Approved') score += 30;

  // 2. Nominee Added (+20)
  if (nominees && nominees.length > 0) score += 20;

  // 3. Investment Exists (+20)
  if (investments && investments.length > 0) score += 20;

  // 4. Active SIP exists (+15)
  const hasActiveSip = sips && sips.some(sip => sip.status === 'Active');
  if (hasActiveSip) score += 15;

  // 5. Verified Contacts (+7.5 each for email and mobile) -> Total 15
  if (user.email) score += 7.5;
  if (user.mobile) score += 7.5;

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
