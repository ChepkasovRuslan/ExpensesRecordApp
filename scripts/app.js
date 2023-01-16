const URL = 'http://localhost:8000';

let expenses = [];

window.onload = async () => {
  await render();
}

const getAllExpenses = async () => {
  try {
    const response = await fetch(URL + '/expenses', {
      method: 'GET'
    });

    return await response.json();
  } catch (error) {
    return [];
  }
}

const calcTotalSum = async () => {
  try {
    const sum = await fetch(URL + '/expenses/sum', {
      method: 'GET'
    }).then(response => response.json())
      .then(sum => sum.totalSum);

    return sum;
  } catch (error) {
    return undefined;
  }
}

const render = async () => {
  expenses = await getAllExpenses();

  const totalSum = document.getElementById('total-sum');
  totalSum.innerHTML = `Итого: ${await calcTotalSum()} р.`;
}