console.log("Js initialing.....");


const BaseUrl = `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/`;
const dropdowns = document.querySelectorAll(".dropdown");
const selectFrom = document.getElementById("selectFrom");
const selectTo = document.getElementById("selectTo");
const fromImg = document.querySelector("#fromImg");
const toImg = document.querySelector("#toImg");
const calculate = document.getElementById("calculate");
let amount = document.getElementById("Amount");
const data = document.getElementById("data");

// adding the currency code in select dropdown from currency.js file
dropdowns.forEach((dropdown) => {
  for (const currencyCode in CountryCurrencyCodes) {
    let newOption = document.createElement("option");
    newOption.innerText = CountryCurrencyCodes[currencyCode];
    newOption.value = currencyCode;
    dropdown.appendChild(newOption);
    if (
      dropdown.getAttribute("id") === "selectFrom" &&
      newOption.value === "US"
    ) {
      newOption.selected = true;
        fromImg.src = `https://flagsapi.com/${currencyCode}/shiny/64.png`;
    }
    if (
      dropdown.getAttribute("id") === "selectTo" &&
      newOption.value === "IN"
    ) {
      newOption.selected = true;
        toImg.src = `https://flagsapi.com/${currencyCode}/shiny/64.png`;
    }
  }
  dropdown.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
});

function updateFlag(element) {
  if (element.id == "selectFrom") {
    fromImg.src = `https://flagsapi.com/${element.value}/shiny/64.png`;
  } else {
    toImg.src = `https://flagsapi.com/${element.value}/shiny/64.png`;
  }
}

async function fetchApi(from, to) {
  let response = await fetch(`${BaseUrl}${from}/${to}.json`);
  let rate = await response.json();
  if((amount.value)==''){
    amount.value = 1;
  }
  let CalculatedAmount = (amount.value)*rate[to];
  CalculatedAmount = CalculatedAmount.toFixed(2);
    data.innerText = `${amount.value} ${from} = ${CalculatedAmount} ${to}`;
}

calculate.addEventListener("click", () => {
 fetchApi(
    CountryCurrencyCodes[selectFrom.value].toLowerCase(),
    CountryCurrencyCodes[selectTo.value].toLowerCase()
  );
});
