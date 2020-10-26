const urlApi =
  'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo';

var loading = null;
var spanError = null;
var arrayPerson = null;
var btSearch = null;
var edtSearch = null;

window.addEventListener('load', () => {
  loading = document.querySelector('#loading');
  spanError = document.querySelector('#error');
  edtSearch = document.querySelector('#edtSearch');
  btSearch = document.querySelector('#btSearch');

  addEvents();
  clearInput();
  doLoadData();
});

const addEvents = () => {
  edtSearch.addEventListener('keyup', onKeyUp);
  btSearch.addEventListener('click', onClick);
};

const onKeyUp = event => {
  var hasText = !!event.target.value && event.target.value.trim() !== '';

  if (!hasText) {
    clearInput();
    return;
  }

  enableButton(true);
  if (event.key === 'Enter') {
    search(event.target.value);
  }
};

const onClick = () => {
  search(edtSearch.value);
};

const doLoadData = () => {
  searching(true);
  fetch(urlApi)
    .then(res => {
      res.json().then(data => {
        searching(false);
        doTransform(data);
      });
    })
    .catch(error => {
      searching(false);
      setError(error);
    });
};

const doTransform = data => {
  arrayPerson = data.results.map(person => {
    return {
      name: person.name,
      gender: person.gender,
      age: person.dob.age,
      picture: person.picture,
    };
  });
};

const setError = error => {
  spanError.textContent = error;
};

const search = value => {
  const resultArray = arrayPerson.filter(person => {
    return (
      person.name.first.toLowerCase().indexOf(value.toLowerCase()) >= 0 ||
      person.name.last.toLowerCase().indexOf(value.toLowerCase()) >= 0
    );
  });

  renderUsers(resultArray);
  rendertatistics(resultArray);
};

const renderUsers = arrayValue => {
  let spanTitle = document.querySelector('#user_title');
  let divUsers = document.querySelector('#users');
  divUsers.innerHTML = '';

  if (arrayValue != null) {
    spanTitle.textContent = `${arrayValue.length} usuário(s) encontrado(s)`;
    let ul = document.createElement('ul');

    arrayValue.forEach(person => {
      let li = document.createElement('li');

      let img = document.createElement('img');
      img.src = person.picture.thumbnail;

      let span = document.createElement('span');
      span.textContent = `${person.name.first} ${person.name.last}, ${person.age} anos`;

      li.appendChild(img);
      li.appendChild(span);

      ul.appendChild(li);
    });

    divUsers.appendChild(ul);
  } else {
    spanTitle.textContent = 'Nenhum usuário filtrado';
  }
};

const doTotalGender = (arrayValue, gender, title) => {
  let found = arrayValue.filter(person => person.gender === gender);
  let li = document.createElement('li');
  li.textContent = `Sexo ${title}: ${found.length}`;
  return li;
};

const rendertatistics = arrayValue => {
  let spanTitle = document.querySelector('#statistics_title');
  let divUsers = document.querySelector('#statistics');
  divUsers.innerHTML = '';

  if (arrayValue != null) {
    let ul = document.createElement('ul');

    ul.appendChild(doTotalGender(arrayValue, 'male', 'masculino'));
    ul.appendChild(doTotalGender(arrayValue, 'female', 'feminino'));

    const total = arrayValue.reduce((accumulator, current) => {
      return accumulator + current.age;
    }, 0);
    li = document.createElement('li');
    li.textContent = `Soma das idades: ${total}`;
    ul.appendChild(li);

    let media = total / arrayValue.length;
    li = document.createElement('li');
    li.textContent = `Média das idades: ${media.toFixed(2)}`;
    ul.appendChild(li);

    divUsers.appendChild(ul);
  } else {
    spanTitle.textContent = 'Nada para ser exibido';
  }
};

const clearInput = () => {
  enableButton(false);
  edtSearch.value = '';
  edtSearch.focus();
};

const enableButton = value => {
  if (value) {
    btSearch.classList.remove('disabled');
  } else {
    btSearch.classList.add('disabled');
  }
};

const searching = value => {
  if (value) {
    loading.classList.remove('loading_hide');
  } else {
    loading.classList.add('loading_hide');
  }
};
