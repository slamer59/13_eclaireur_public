module.exports = async (page, scenario) => {
  console.log(`SCENARIO > ${scenario.label}`);
  await page.waitForLoadState('networkidle');
  
  // Hide any animations or transitions that might cause flaky tests
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-delay: -1ms !important;
        animation-duration: 1ms !important;
        animation-iteration-count: 1 !important;
        background-attachment: initial !important;
        scroll-behavior: auto !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `
  });
  
  // Wait a bit for any remaining animations to settle
  await page.waitForTimeout(500);
};
