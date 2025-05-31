function getOddNumbers(arr) {
  let evenNums = [];
  arr.forEach((element) => {
    if (element % 2 === 1) {
      evenNums.push(element);
    }
  });
  const res = evenNums.sort((a, b) => b - a).filter((_, i) => i !== 1);

  return res;
}
const input = [2, 4, 6, 5, 3, 1, 7, 9, 10, 8];
console.log("INPUT = ", input, "\nOUTPUT =", getOddNumbers(input));

console.log("\n\n");

function getDataAlphabet(text) {
  let res = [];
  let count = 1;
  for (let i = 1; i <= text.length; i++) {
    if (text[i] === text[i - 1]) {
      count++;
    } else {
      res.push(`${text[i - 1]} = ${count}`);
      count = 1;
    }
  }

  return res.join("\n");
}

console.log(
  `INPUT = aaabbcccaaaac\nOUTPUT\n${getDataAlphabet("aaabbcccaaaac")}`
);

console.log("\n\n");

function getTotalSales() {
  const data = [
    { ID: 1, Customer_ID: "21", Transaction_Date: "07/30/2019" },
    { ID: 2, Customer_ID: "15", Transaction_Date: "07/21/2019" },
    { ID: 3, Customer_ID: "16", Transaction_Date: "07/18/2019" },
    { ID: 4, Customer_ID: "20", Transaction_Date: "07/22/2019" },
    { ID: 5, Customer_ID: "15", Transaction_Date: "07/15/2019" },
    { ID: 6, Customer_ID: "20", Transaction_Date: "07/12/2019" },
    { ID: 7, Customer_ID: "15", Transaction_Date: "07/21/2019" },
    { ID: 8, Customer_ID: "20", Transaction_Date: "07/12/2019" },
  ];

  const countMap = {};

  for (const row of data) {
    const id = row.Customer_ID;
    countMap[id] = (countMap[id] || 0) + 1;
  }

  const result = Object.entries(countMap)
    .map(([Customer_ID, total]) => ({ Customer_ID, total }))
    .sort((a, b) => {
      if (b.total !== a.total) return b.total - a.total;
      return a.Customer_ID.localeCompare(b.Customer_ID);
    });

  console.log("Customer_ID\tTotal Penjualan");
  for (const r of result) {
    console.log(`${r.Customer_ID}\t\t${r.total}`);
  }
}

getTotalSales();
