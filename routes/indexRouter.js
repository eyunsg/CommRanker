const express = require("express");
const router = express.Router();

async function getNasdaq100() {
  const puppeteer = require("puppeteer");

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(
    "https://dis.kofia.or.kr/websquare/index.jsp?w2xPath=/wq/fundann/DISFundFeeCMS.xml&divisionId=MDIS01005001000000&serviceId=SDIS01005001000"
  );

  await page.waitForSelector("#fundNm");
  await page.type("#fundNm", "닥100증", {
    delay: 100,
  });

  await page.select("#fundTyp_input_0", "주식형");

  await page.focus("#btnSear");
  await page.keyboard.press("Enter");

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const fundData = await page.evaluate(() => {
    // 펀드명
    const fundNames = document.querySelectorAll(
      ".gridBodyDefault.gridBodyDefault_data.grdMain_columnstyle_1_"
    );
    // 운용회사
    const assetManagementCompanies = document.querySelectorAll(
      ".gridBodyDefault.gridBodyDefault_data.grdMain_columnstyle_0_"
    );
    // 보수율
    const managementCommissions = document.querySelectorAll(
      ".gridBodyDefault.gridBodyDefault_data.grdMain_columnstyle_9_"
    );
    // 기타비용
    const otherCommissions = document.querySelectorAll(
      ".gridBodyDefault.gridBodyDefault_data.grdMain_columnstyle_11_"
    );
    // 판매수수료(선취)
    const initialSalesCommissions = document.querySelectorAll(
      ".gridBodyDefault.gridBodyDefault_data.grdMain_columnstyle_13_"
    );
    // 판매수수료(후취)
    const postSalesCommissions = document.querySelectorAll(
      ".gridBodyDefault.gridBodyDefault_data.grdMain_columnstyle_14_"
    );
    // 매매·중개 수수료
    const tradingCommissions = document.querySelectorAll(
      ".gridBodyDefault.gridBodyDefault_data.grdMain_columnstyle_15_"
    );

    const result = [];
    for (let i = 0; i < fundNames.length && result.length < 4; i++) {
      const fundName = fundNames[i]?.textContent.trim();

      const assetManagementCompany =
        assetManagementCompanies[i]?.textContent.trim();

      const managementCommission = Number(
        managementCommissions[i]?.textContent.trim()
      );

      const otherCommission = Number(otherCommissions[i]?.textContent.trim());

      const initialSalesCommission = Number(
        initialSalesCommissions[i]?.textContent.trim()
      );

      const postSalesCommission = Number(
        postSalesCommissions[i]?.textContent.trim()
      );

      const tradingCommission = Number(
        tradingCommissions[i]?.textContent.trim()
      );

      const totalCommission =
        managementCommission +
        otherCommission +
        initialSalesCommission +
        postSalesCommission +
        tradingCommission;

      // "H(헷지)"가 포함된 데이터는 건너뛰기
      if (fundName && !fundName.includes("(H)")) {
        result.push({
          fundName,
          assetManagementCompany,
          managementCommission,
          otherCommission,
          initialSalesCommission,
          postSalesCommission,
          tradingCommission,
          totalCommission,
        });
      }
    }

    return result;
  });

  await page.goto(
    "https://dis.kofia.or.kr/websquare/index.jsp?w2xPath=/wq/fundann/DISFundFeeCMS.xml&divisionId=MDIS01005001000000&serviceId=SDIS01005001000"
  );

  await page.waitForSelector("#fundNm");
  page.type("#fundNm", "미국나스닥100T", {
    delay: 100,
  });

  await new Promise((resolve) => setTimeout(resolve, 1000));

  await page.select("#fundTyp_input_0", "주식형");

  await page.focus("#btnSear");
  await page.keyboard.press("Enter");

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const FundData2 = await page.evaluate(() => {
    // 펀드명
    const fundNames = document.querySelectorAll(
      ".gridBodyDefault.gridBodyDefault_data.grdMain_columnstyle_1_"
    );
    // 운용회사
    const assetManagementCompanies = document.querySelectorAll(
      ".gridBodyDefault.gridBodyDefault_data.grdMain_columnstyle_0_"
    );
    // 보수율
    const managementCommissions = document.querySelectorAll(
      ".gridBodyDefault.gridBodyDefault_data.grdMain_columnstyle_9_"
    );
    // 기타비용
    const otherCommissions = document.querySelectorAll(
      ".gridBodyDefault.gridBodyDefault_data.grdMain_columnstyle_11_"
    );
    // 판매수수료(선취)
    const initialSalesCommissions = document.querySelectorAll(
      ".gridBodyDefault.gridBodyDefault_data.grdMain_columnstyle_13_"
    );
    // 판매수수료(후취)
    const postSalesCommissions = document.querySelectorAll(
      ".gridBodyDefault.gridBodyDefault_data.grdMain_columnstyle_14_"
    );
    // 매매·중개 수수료
    const tradingCommissions = document.querySelectorAll(
      ".gridBodyDefault.gridBodyDefault_data.grdMain_columnstyle_15_"
    );

    const result = [];
    for (let i = 0; i < fundNames.length && result.length < 4; i++) {
      const fundName = fundNames[i]?.textContent.trim();

      const assetManagementCompany =
        assetManagementCompanies[i]?.textContent.trim();

      const managementCommission = Number(
        managementCommissions[i]?.textContent.trim()
      );

      const otherCommission = Number(otherCommissions[i]?.textContent.trim());

      const initialSalesCommission = Number(
        initialSalesCommissions[i]?.textContent.trim()
      );

      const postSalesCommission = Number(
        postSalesCommissions[i]?.textContent.trim()
      );

      const tradingCommission = Number(
        tradingCommissions[i]?.textContent.trim()
      );

      const totalCommission = parseFloat(
        managementCommission +
          otherCommission +
          initialSalesCommission +
          postSalesCommission +
          tradingCommission
      );

      // "H(헷지)"가 포함된 데이터는 건너뛰기
      if (fundName && !fundName.includes("H")) {
        result.push({
          fundName,
          assetManagementCompany,
          managementCommission,
          otherCommission,
          initialSalesCommission,
          postSalesCommission,
          tradingCommission,
          totalCommission,
        });
      }
    }

    return result;
  });

  await browser.close();

  const mergedData = fundData.concat(FundData2);

  console.log(mergedData);

  return mergedData;
}

async function getSp500() {
  const puppeteer = require("puppeteer");

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(
    "https://dis.kofia.or.kr/websquare/index.jsp?w2xPath=/wq/fundann/DISFundFeeCMS.xml&divisionId=MDIS01005001000000&serviceId=SDIS01005001000"
  );

  await page.waitForSelector("#fundNm");
  await page.type("#fundNm", "500증", {
    delay: 100,
  });

  await page.select("#fundTyp_input_0", "주식형");

  await page.focus("#btnSear");
  await page.keyboard.press("Enter");

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const fundData = await page.evaluate(() => {
    // 펀드명
    const fundNames = document.querySelectorAll(
      ".gridBodyDefault.gridBodyDefault_data.grdMain_columnstyle_1_"
    );
    // 운용회사
    const assetManagementCompanies = document.querySelectorAll(
      ".gridBodyDefault.gridBodyDefault_data.grdMain_columnstyle_0_"
    );
    // 보수율
    const managementCommissions = document.querySelectorAll(
      ".gridBodyDefault.gridBodyDefault_data.grdMain_columnstyle_9_"
    );
    // 기타비용
    const otherCommissions = document.querySelectorAll(
      ".gridBodyDefault.gridBodyDefault_data.grdMain_columnstyle_11_"
    );
    // 판매수수료(선취)
    const initialSalesCommissions = document.querySelectorAll(
      ".gridBodyDefault.gridBodyDefault_data.grdMain_columnstyle_13_"
    );
    // 판매수수료(후취)
    const postSalesCommissions = document.querySelectorAll(
      ".gridBodyDefault.gridBodyDefault_data.grdMain_columnstyle_14_"
    );
    // 매매·중개 수수료
    const tradingCommissions = document.querySelectorAll(
      ".gridBodyDefault.gridBodyDefault_data.grdMain_columnstyle_15_"
    );

    const result = [];
    for (let i = 0; i < fundNames.length && result.length < 11; i++) {
      const fundName = fundNames[i]?.textContent.trim();

      const assetManagementCompany =
        assetManagementCompanies[i]?.textContent.trim();

      const managementCommission = Number(
        managementCommissions[i]?.textContent.trim()
      );

      const otherCommission = Number(otherCommissions[i]?.textContent.trim());

      const initialSalesCommission = Number(
        initialSalesCommissions[i]?.textContent.trim()
      );

      const postSalesCommission = Number(
        postSalesCommissions[i]?.textContent.trim()
      );

      const tradingCommission = Number(
        tradingCommissions[i]?.textContent.trim()
      );

      const totalCommission =
        managementCommission +
        otherCommission +
        initialSalesCommission +
        postSalesCommission +
        tradingCommission;

      // "H(헷지)"가 포함된 데이터는 건너뛰기
      if (fundName && !fundName.includes("(H)")) {
        result.push({
          fundName,
          assetManagementCompany,
          managementCommission,
          otherCommission,
          initialSalesCommission,
          postSalesCommission,
          tradingCommission,
          totalCommission,
        });
      }
    }

    return result;
  });

  await page.goto(
    "https://dis.kofia.or.kr/websquare/index.jsp?w2xPath=/wq/fundann/DISFundFeeCMS.xml&divisionId=MDIS01005001000000&serviceId=SDIS01005001000"
  );

  await page.waitForSelector("#fundNm");
  page.type("#fundNm", "500Tot", {
    delay: 100,
  });

  await new Promise((resolve) => setTimeout(resolve, 1000));

  await page.select("#fundTyp_input_0", "주식형");

  await page.focus("#btnSear");
  await page.keyboard.press("Enter");

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const FundData2 = await page.evaluate(() => {
    // 펀드명
    const fundNames = document.querySelectorAll(
      ".gridBodyDefault.gridBodyDefault_data.grdMain_columnstyle_1_"
    );
    // 운용회사
    const assetManagementCompanies = document.querySelectorAll(
      ".gridBodyDefault.gridBodyDefault_data.grdMain_columnstyle_0_"
    );
    // 보수율
    const managementCommissions = document.querySelectorAll(
      ".gridBodyDefault.gridBodyDefault_data.grdMain_columnstyle_9_"
    );
    // 기타비용
    const otherCommissions = document.querySelectorAll(
      ".gridBodyDefault.gridBodyDefault_data.grdMain_columnstyle_11_"
    );
    // 판매수수료(선취)
    const initialSalesCommissions = document.querySelectorAll(
      ".gridBodyDefault.gridBodyDefault_data.grdMain_columnstyle_13_"
    );
    // 판매수수료(후취)
    const postSalesCommissions = document.querySelectorAll(
      ".gridBodyDefault.gridBodyDefault_data.grdMain_columnstyle_14_"
    );
    // 매매·중개 수수료
    const tradingCommissions = document.querySelectorAll(
      ".gridBodyDefault.gridBodyDefault_data.grdMain_columnstyle_15_"
    );

    const result = [];
    for (let i = 0; i < fundNames.length && result.length < 4; i++) {
      const fundName = fundNames[i]?.textContent.trim();

      const assetManagementCompany =
        assetManagementCompanies[i]?.textContent.trim();

      const managementCommission = Number(
        managementCommissions[i]?.textContent.trim()
      );

      const otherCommission = Number(otherCommissions[i]?.textContent.trim());

      const initialSalesCommission = Number(
        initialSalesCommissions[i]?.textContent.trim()
      );

      const postSalesCommission = Number(
        postSalesCommissions[i]?.textContent.trim()
      );

      const tradingCommission = Number(
        tradingCommissions[i]?.textContent.trim()
      );

      const totalCommission = parseFloat(
        managementCommission +
          otherCommission +
          initialSalesCommission +
          postSalesCommission +
          tradingCommission
      );

      // "H(헷지)"가 포함된 데이터는 건너뛰기
      if (fundName && !fundName.includes("(H)")) {
        result.push({
          fundName,
          assetManagementCompany,
          managementCommission,
          otherCommission,
          initialSalesCommission,
          postSalesCommission,
          tradingCommission,
          totalCommission,
        });
      }
    }

    return result;
  });

  const mergedData = fundData.concat(FundData2);

  console.log(mergedData);

  return mergedData;
}

async function getDowJones() {
  const puppeteer = require("puppeteer");

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(
    "https://dis.kofia.or.kr/websquare/index.jsp?w2xPath=/wq/fundann/DISFundFeeCMS.xml&divisionId=MDIS01005001000000&serviceId=SDIS01005001000"
  );

  await page.waitForSelector("#fundNm");
  await page.type("#fundNm", "국배당다우", {
    delay: 100,
  });

  await page.select("#fundTyp_input_0", "주식형");

  await page.focus("#btnSear");
  await page.keyboard.press("Enter");

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const fundData = await page.evaluate(() => {
    // 펀드명
    const fundNames = document.querySelectorAll(
      ".gridBodyDefault.gridBodyDefault_data.grdMain_columnstyle_1_"
    );
    // 운용회사
    const assetManagementCompanies = document.querySelectorAll(
      ".gridBodyDefault.gridBodyDefault_data.grdMain_columnstyle_0_"
    );
    // 보수율
    const managementCommissions = document.querySelectorAll(
      ".gridBodyDefault.gridBodyDefault_data.grdMain_columnstyle_9_"
    );
    // 기타비용
    const otherCommissions = document.querySelectorAll(
      ".gridBodyDefault.gridBodyDefault_data.grdMain_columnstyle_11_"
    );
    // 판매수수료(선취)
    const initialSalesCommissions = document.querySelectorAll(
      ".gridBodyDefault.gridBodyDefault_data.grdMain_columnstyle_13_"
    );
    // 판매수수료(후취)
    const postSalesCommissions = document.querySelectorAll(
      ".gridBodyDefault.gridBodyDefault_data.grdMain_columnstyle_14_"
    );
    // 매매·중개 수수료
    const tradingCommissions = document.querySelectorAll(
      ".gridBodyDefault.gridBodyDefault_data.grdMain_columnstyle_15_"
    );

    const result = [];
    for (let i = 0; i < fundNames.length && result.length < 9; i++) {
      const fundName = fundNames[i]?.textContent.trim();

      const assetManagementCompany =
        assetManagementCompanies[i]?.textContent.trim();

      const managementCommission = Number(
        managementCommissions[i]?.textContent.trim()
      );

      const otherCommission = Number(otherCommissions[i]?.textContent.trim());

      const initialSalesCommission = Number(
        initialSalesCommissions[i]?.textContent.trim()
      );

      const postSalesCommission = Number(
        postSalesCommissions[i]?.textContent.trim()
      );

      const tradingCommission = Number(
        tradingCommissions[i]?.textContent.trim()
      );

      const totalCommission =
        managementCommission +
        otherCommission +
        initialSalesCommission +
        postSalesCommission +
        tradingCommission;

      // "H(헷지)"가 포함된 데이터는 건너뛰기
      if (fundName && !fundName.includes("(H)")) {
        result.push({
          fundName,
          assetManagementCompany,
          managementCommission,
          otherCommission,
          initialSalesCommission,
          postSalesCommission,
          tradingCommission,
          totalCommission,
        });
      }
    }

    return result;
  });

  await browser.close();

  console.log(fundData);

  return fundData;
}

router.get("/", async (req, res) => {
  res.render("index");
});

router.get("/api/commission/:fundCategory", async (req, res) => {
  try {
    const fundCategory = req.params.fundCategory;
    console.log(fundCategory);

    switch (fundCategory) {
      case "sp500":
        const sp500FundData = await getSp500();
        return res.json(sp500FundData);
      case "nasdaq100":
        const nasdaq100FundData = await getNasdaq100();
        return res.json(nasdaq100FundData);
      case "dowjones":
        const dowJonesFundData = await getDowJones();
        return res.json(dowJonesFundData);
      default:
        return res.status(400).json({ error: "유효하지 않은 카테고리입니다." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "수수료 정보 패치 실패" });
  }
});

module.exports = router;
