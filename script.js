const telegramUrl = "https://t.me/onix1717";
const ratePerKg = 55;
const fixedTransferFee = 45;
const transferThresholdKg = 33;
const transferRubPerKg = 15;

const body = document.body;
const burgerButton = document.querySelector(".burger-button");
const mobileMenu = document.querySelector(".mobile-menu");
const weightInput = document.querySelector("#weight");
const lengthInput = document.querySelector("#length");
const heightInput = document.querySelector("#height");
const widthInput = document.querySelector("#width");
const estimateNode = document.querySelector("#estimate");
const tableWeightNode = document.querySelector("#table-weight");
const transferFeeNode = document.querySelector("#transfer-fee");
const estimateLink = document.querySelector("#estimate-link");
const calcForm = document.querySelector("#cargo-calc");
const unknownSize = document.querySelector("#unknown-size");
const dimensionInputs = [lengthInput, heightInput, widthInput];

function formatNumber(value) {
  return new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: 0,
  }).format(value);
}

function formatYuan(value) {
  return `${formatNumber(value)}ю`;
}

function formatRub(value) {
  return `${formatNumber(value)}р`;
}

function parseDecimal(value) {
  const parsed = Number(String(value).replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
}

function updateEstimate() {
  const weight = parseDecimal(weightInput.value);
  const deliveryFee = weight > 0 ? weight * ratePerKg : 0;
  const transferFeeRub = weight > transferThresholdKg ? weight * transferRubPerKg : 0;
  const transferFeeText = weight > transferThresholdKg ? `${formatRub(transferFeeRub)}` : formatYuan(fixedTransferFee);
  const totalText =
    weight > transferThresholdKg
      ? `${formatYuan(deliveryFee)} + ${formatRub(transferFeeRub)}`
      : formatYuan(deliveryFee + fixedTransferFee);

  estimateNode.textContent = weight > 0 ? totalText : "Введите вес";
  tableWeightNode.textContent = weight > 0 ? `${weightInput.value.replace(".", ",")} кг` : "Не указан";
  transferFeeNode.textContent = weight > 0 ? transferFeeText : "-";

  const dimensions = dimensionInputs.map((input) => input.value.trim() || "-").join(" × ");
  const text = encodeURIComponent(
    `Здравствуйте! Хочу уточнить доставку Cargo 1717 через Благовещенск. Вес: ${weightInput.value || "-"} кг. Габариты: ${dimensions} см. Предварительный расчет до ТК: ${weight > 0 ? totalText : "-"}`
  );
  estimateLink.href = `${telegramUrl}?text=${text}`;

  const table = document.querySelector(".delivery-table");
  table.classList.remove("pulse");
  requestAnimationFrame(() => table.classList.add("pulse"));
}

function setDimensionsState() {
  dimensionInputs.forEach((input) => {
    input.disabled = unknownSize.checked;
  });
}

burgerButton.addEventListener("click", () => {
  const isOpen = body.classList.toggle("menu-open");
  burgerButton.setAttribute("aria-expanded", String(isOpen));
  burgerButton.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
  mobileMenu.setAttribute("aria-hidden", String(!isOpen));
});

mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    body.classList.remove("menu-open");
    burgerButton.setAttribute("aria-expanded", "false");
    burgerButton.setAttribute("aria-label", "Открыть меню");
    mobileMenu.setAttribute("aria-hidden", "true");
  });
});

[weightInput, ...dimensionInputs].forEach((input) => input.addEventListener("input", updateEstimate));
unknownSize.addEventListener("change", () => {
  setDimensionsState();
  updateEstimate();
});
calcForm.addEventListener("submit", (event) => {
  event.preventDefault();
  updateEstimate();
});

document.querySelectorAll(".faq-item").forEach((button) => {
  button.addEventListener("click", () => {
    const isOpen = button.classList.contains("open");
    document.querySelectorAll(".faq-item").forEach((item) => {
      item.classList.remove("open");
      item.setAttribute("aria-expanded", "false");
    });
    if (!isOpen) {
      button.classList.add("open");
      button.setAttribute("aria-expanded", "true");
    }
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

setDimensionsState();
updateEstimate();
