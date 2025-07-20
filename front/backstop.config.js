/* eslint-disable */
const getFetch = async () => {
  const { default: fetch } = await import('node-fetch');
  return fetch;
};

module.exports = (async () => {
  const fetch = await getFetch();
  return {
    id: "eclaireur_public_visual_tests",
    viewports: [
      {
        label: "phone",
        width: 375,
        height: 667
      },
      {
        label: "tablet",
        width: 768,
        height: 1024
      },
      {
        label: "desktop",
        width: 1280,
        height: 800
      }
    ],
    onBeforeScript: "playwright/onBefore.js",
    onReadyScript: "playwright/onReady.js",
    scenarios: await generateStorybookScenarios(),
    paths: {
      bitmaps_reference: "backstop_data/bitmaps_reference",
      bitmaps_test: "backstop_data/bitmaps_test",
      engine_scripts: "backstop_data/engine_scripts",
      html_report: "backstop_data/html_report",
      ci_report: "backstop_data/ci_report",
      tempCompareConfigFileName: "backstop_data/tempCompareConfigFileName.json"
    },
    report: ["browser"],
    engine: "playwright",
    engineOptions: {
      args: ["--no-sandbox"]
    },
    asyncCaptureLimit: 5,
    asyncCompareLimit: 50,
    debug: false,
    debugWindow: false
  };
})();

async function fetchStorybookStories() {
  const response = await fetch('http://localhost:6006/stories.json');
  const data = await response.json();
  return Object.keys(data.stories);
}

async function generateStorybookScenarios() {
  const scenarios = [];
  const stories = await fetchStorybookStories();

  for (const story of stories) {
    scenarios.push({
      label: story,
      url: `http://localhost:6006/iframe.html?id=${story}&viewMode=story`,
      delay: 2000,
      misMatchThreshold: 0.1,
      requireSameDimensions: true,
      readyTimeout: 30000
    });
  }

  return scenarios;
}

module.exports = (async () => {
  return {
    id: "eclaireur_public_visual_tests",
    viewports: [
      {
        label: "phone",
        width: 375,
        height: 667
      },
      {
        label: "tablet",
        width: 768,
        height: 1024
      },
      {
        label: "desktop",
        width: 1280,
        height: 800
      }
    ],
    onBeforeScript: "playwright/onBefore.js",
    onReadyScript: "playwright/onReady.js",
    scenarios: await generateStorybookScenarios(),
    paths: {
      bitmaps_reference: "backstop_data/bitmaps_reference",
      bitmaps_test: "backstop_data/bitmaps_test",
      engine_scripts: "backstop_data/engine_scripts",
      html_report: "backstop_data/html_report",
      ci_report: "backstop_data/ci_report"
    },
    report: ["browser"],
    engine: "playwright",
    engineOptions: {
      args: ["--no-sandbox"]
    },
    asyncCaptureLimit: 5,
    asyncCompareLimit: 50,
    debug: false,
    debugWindow: false
  };
})();
