const form          = document.getElementById('mortgageForm');
const clearAllBtn   = document.getElementById('clearAll');
const resultsEmpty  = document.getElementById('resultsEmpty');
const resultsComp   = document.getElementById('resultsCompleted');
const resultMonthly = document.getElementById('resultMonthly');
const resultTotal   = document.getElementById('resultTotal');

function setError(groupId, hasError) {
  const group = document.getElementById(groupId);
  if (!group) return;
  group.classList.toggle('has-error', hasError);
}

function validateForm() {
  const amount   = parseFloat(document.getElementById('mortgageAmount').value);
  const term     = parseInt(document.getElementById('mortgageTerm').value, 10);
  const rate     = parseFloat(document.getElementById('interestRate').value);
  const typeEl   = document.querySelector('input[name="mortgageType"]:checked');

  let valid = true;

  if (!document.getElementById('mortgageAmount').value || isNaN(amount) || amount <= 0) {
    setError('group-amount', true);
    valid = false;
  } else {
    setError('group-amount', false);
  }

  if (!document.getElementById('mortgageTerm').value || isNaN(term) || term <= 0) {
    setError('group-term', true);
    valid = false;
  } else {
    setError('group-term', false);
  }

  if (!document.getElementById('interestRate').value || isNaN(rate) || rate < 0) {
    setError('group-rate', true);
    valid = false;
  } else {
    setError('group-rate', false);
  }

  if (!typeEl) {
    setError('group-type', true);
    valid = false;
  } else {
    setError('group-type', false);
  }

  if (!valid) return null;

  return {
    amount,
    term,
    rate,
    type: typeEl.value,
  };
}

function calcRepayment(principal, annualRate, years) {
  const n = years * 12;
  const r = annualRate / 100 / 12;

  if (r === 0) {
    const monthly = principal / n;
    return { monthly, total: monthly * n };
  }

  const monthly = principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return { monthly, total: monthly * n };
}

function calcInterestOnly(principal, annualRate, years) {
  const n = years * 12;
  const r = annualRate / 100 / 12;
  const monthly = principal * r;
  return { monthly, total: monthly * n };
}

function formatGBP(value) {
  return '£' + value.toLocaleString('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function showEmptyState() {
  resultsComp.hidden = true;
  resultsEmpty.hidden = false;
}

function showResults(monthly, total) {
  resultMonthly.textContent = formatGBP(monthly);
  resultTotal.textContent   = formatGBP(total);
  resultsEmpty.hidden = true;
  resultsComp.hidden  = false;
}

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const values = validateForm();
  if (!values) return;

  const { amount, term, rate, type } = values;
  let result;

  if (type === 'repayment') {
    result = calcRepayment(amount, rate, term);
  } else {
    result = calcInterestOnly(amount, rate, term);
  }

  showResults(result.monthly, result.total);
});

clearAllBtn.addEventListener('click', function () {
  form.reset();

  document.querySelectorAll('.form-group.has-error').forEach(function (group) {
    group.classList.remove('has-error');
  });

  showEmptyState();
});

document.getElementById('mortgageAmount').addEventListener('input', function () {
  setError('group-amount', false);
});
document.getElementById('mortgageTerm').addEventListener('input', function () {
  setError('group-term', false);
});
document.getElementById('interestRate').addEventListener('input', function () {
  setError('group-rate', false);
});
document.querySelectorAll('input[name="mortgageType"]').forEach(function (radio) {
  radio.addEventListener('change', function () {
    setError('group-type', false);
  });
});
