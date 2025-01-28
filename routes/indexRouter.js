const express = require("express");
const router = express.Router();

// 크롤링 과정에서 검색이 2번 발생하는 경우
async function getMergedData(fundName1, fundName2, fundCount1, fundCount2) {
  const fundData1 = await getFundData(fundName1, fundCount1);
  const fundData2 = await getFundData(fundName2, fundCount2);

  // 두 데이터를 병합
  const mergedData = fundData1.concat(fundData2);
  console.log(mergedData);

  return mergedData;
}

// 크롤링 과정에서 검색이 1번 발생하는 경우
async function getFundData(fundName, fundCount) {
  const puppeteer = require("puppeteer");

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(
    "https://dis.kofia.or.kr/websquare/index.jsp?w2xPath=/wq/fundann/DISFundFeeCMS.xml&divisionId=MDIS01005001000000&serviceId=SDIS01005001000"
  );

  await page.waitForSelector("#fundNm");
  await page.type("#fundNm", fundName, {
    delay: 100,
  });

  await page.select("#fundTyp_input_0", "주식형");

  await page.focus("#btnSear");
  await page.keyboard.press("Enter");

  await new Promise((resolve) => setTimeout(resolve, 1000));

  // fundCount 값을 evaluate에 전달
  const fundData = await page.evaluate((fundCount) => {
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
    for (let i = 0; i < fundNames.length && result.length < fundCount; i++) {
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
  }, fundCount); // fundCount 값을 여기서 전달

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
        const sp500FundData = await getMergedData("500증", "500Tot", 11, 4);
        return res.json(sp500FundData);
      case "nasdaq100":
        const nasdaq100FundData = await getMergedData(
          "닥100증",
          "미국나스닥100T",
          4,
          4
        );
        return res.json(nasdaq100FundData);
      case "dowjones":
        const dowJonesFundData = await getFundData("국배당다우", 9);
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
