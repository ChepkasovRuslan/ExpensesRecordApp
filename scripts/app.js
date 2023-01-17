const URL = 'http://localhost:8000';

let descriptionInput = null;
let sumInput = null;

let modal = null;
let descriptionEditInput = null;
let sumEditInput = null;
let activeEditIndex = -1;

let expenses = [];

window.onload = async () => {
  descriptionInput = document.getElementById('input-description');
  sumInput = document.getElementById('input-sum');

  modal = document.getElementById('modal');
  descriptionEditInput = document.getElementById('edit-epxense-description-input');
  sumEditInput = document.getElementById('edit-epxense-sum-input');

  await render();
}

const addItem = async () => {
  try {
    if (!descriptionInput.value) {
      emptyDescriptionAlert();
      return;
    }

    await fetch(URL + '/expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        description: descriptionInput.value,
        sum: sumInput.value ? sumInput.value : 0
      })
    });
    clearInputs();
    await render();
  } catch (error) { }
}

const editItem = async () => {
  try {
    if (!descriptionEditInput.value) {
      emptyDescriptionAlert();
      return;
    }

    await fetch(URL + '/expenses/' + expenses[activeEditIndex]._id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        description: descriptionEditInput.value,
        sum: sumEditInput.value ? sumEditInput.value : 0
      })
    });
    await render();
    hideModal();
  } catch (error) { }
}

const emptyDescriptionAlert = () => {
  alert('Укажите расход');
}

const clearInputs = () => {
  descriptionInput.value = '';
  sumInput.value = '';
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

const showModal = () => modal.style.display = 'initial';

const hideModal = () => modal.style.display = 'none';

const render = async () => {
  expenses = await getAllExpenses();

  const totalSum = document.getElementById('total-sum');
  totalSum.innerHTML = `Итого: ${await calcTotalSum()} р.`;

  const content = document.getElementById('expenses-items');
  content.innerHTML = '';

  expenses.forEach((item, index) => {
    const expenseContainer = document.createElement('div');
    expenseContainer.id = `expense-${index}`;
    expenseContainer.className = 'items__expense-container';

    const description = document.createElement('p');
    description.innerText = `${index + 1}) ${item.description}`;
    description.id = `description-${index}`;
    description.className = 'regular-text';
    description.style.width = '300px'

    const dateAndSumContainer = document.createElement('div');
    dateAndSumContainer.className = 'expense-container__date-and-sum-container';
    dateAndSumContainer.style.width = '230px';

    const date = document.createElement('p');
    date.innerText = item.date.split(', ')[0];
    date.id = `date-${index}`;
    date.className = 'regular-text';

    const sum = document.createElement('p');
    sum.innerText = `${item.sum} р.`;
    sum.id = `sum-${index}`;
    sum.className = 'regular-text'

    dateAndSumContainer.appendChild(date);
    dateAndSumContainer.appendChild(sum);

    const imagesContainer = document.createElement('div');
    imagesContainer.className = 'expense-container__images-container';

    const imageEdit = document.createElement('img');
    imageEdit.id = `image-edit-${index}`;
    imageEdit.src = 'images/edit.svg';
    imageEdit.className = 'images-container__image';
    imageEdit.onclick = () => {
      activeEditIndex = index;
      descriptionEditInput.value = expenses[index].description;
      sumEditInput.value = expenses[index].sum;
      showModal();
    }

    const imageDelete = document.createElement('img');
    imageDelete.id = `image-delete-${index}`;
    imageDelete.src = 'images/delete.svg';
    imageDelete.className = 'images-container__image';
    imageDelete.onclick = async () => {
      try {
        await fetch(URL + '/expenses/' + expenses[index]._id, {
          method: 'DELETE'
        });
        await render();
      } catch (error) { }
    }

    imagesContainer.appendChild(imageEdit);
    imagesContainer.appendChild(imageDelete);

    expenseContainer.appendChild(description);
    expenseContainer.appendChild(dateAndSumContainer);
    expenseContainer.appendChild(imagesContainer);

    content.appendChild(expenseContainer);
  });
}