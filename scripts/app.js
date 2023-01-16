const URL = 'http://localhost:8000/expenses/';

let expenses = [];

window.onload = async () => {
  await render();
}

const getAllExpenses = async () => {
  try {
    const response = await fetch(URL, {
      method: 'GET'
    });

    return await response.json();
  } catch (error) {
    console.log(error);
    return [];
  }
}

const calcTotalSum = (expenses) => {
  try {
    return expenses.reduce((prev, curr) => {
      return prev + curr.sum;
    }, 0);
  } catch (error) {
    console.log(error);
    return -1;
  }
}

const render = async () => {
  expenses = await getAllExpenses();

  const totalSum = document.getElementById('total-sum');
  totalSum.innerHTML = `Итого: ${calcTotalSum(expenses)} р.`;
}