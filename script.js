const telegramUrl = "https://t.me/onix1717";
const ratePerKg = 3.5;

const body = document.body;
const burgerButton = document.querySelector(".burger-button");
const mobileMenu = document.querySelector(".mobile-menu");
const weightInput = document.querySelector("#weight");
const lengthInput = document.querySelector("#length");
const heightInput = document.querySelector("#height");
const widthInput = document.querySelector("#width");
const estimateNode = document.querySelector("#estimate");
const tableWeightNode = document.querySelector("#table-weight");
const estimateLink = document.querySelector("#estimate-link");
const calcForm = document.querySelector("#cargo-calc");
const unknownSize = document.querySelector("#unknown-size");
const dimensionInputs = [lengthInput, heightInput, widthInput];

function formatUsd(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function parseDecimal(value) {
  const parsed = Number(String(value).replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
}

function updateEstimate() {
  const weight = parseDecimal(weightInput.value);
  const estimate = weight > 0 ? weight * ratePerKg : 0;
  estimateNode.textContent = estimate > 0 ? formatUsd(estimate) : "Введите вес";
  tableWeightNode.textContent = weight > 0 ? `${weightInput.value.replace(".", ",")} кг` : "Не указан";

  const dimensions = dimensionInputs.map((input) => input.value.trim() || "-").join(" × ");
  const text = encodeURIComponent(
    `Здравствуйте! Хочу расчет Cargo 1717. Вес: ${weightInput.value || "-"} кг. Габариты: ${dimensions} см.`
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
