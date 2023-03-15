"use strict"

let comments = [];
loadComments();

let form = document.querySelector('.main__form');
let error = document.querySelector('.error');

let textUser = document.querySelector('.form__text-text');
let nameUser = document.querySelector('.form__name-name');

//Отслеживаем ввод в инпут
nameUser.oninput = function() {
    error.style.display = 'none';
}
textUser.oninput = function() {
    error.style.display = 'none';
}

//Обработчик на клавиши кнтрол + ентер
document.addEventListener('keydown', function(event) {
    textUser = document.querySelector('.form__text-text');
    nameUser = document.querySelector('.form__name-name');

    if (event.code == 'Enter'&& event.ctrlKey) {
        if(textUser.value != '' && nameUser.value !=''){
            commentPush()
        }else{
            error.style.display = 'block';
        }
        
    }
});


//Отправка формы по событию сабминт(Главная функция)
form.onsubmit = commentPush;

function commentPush() {

    let nameUser = document.querySelector('.form__name-name');
    let dataUser = document.querySelector('.form__name-data');
    let textUser = document.querySelector('.form__text-text');

    let comment = {
        name: nameUser.value,
        date: dataUser.value,
        text: textUser.value
    }

    //Дата сегодняшняя
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    let hours = String(today.getHours()).padStart(2, '0');
    let minuts = String(today.getMinutes()).padStart(2, '0');
    
    comment.time = hours + '-' + minuts;

    if(comment.date == '' || comment.date == yyyy + '-' + mm + '-' + dd){
        comment.date = 'Сегодня';
    }
  
    if(dd - 1 == comment.date.split('-')[2] && mm == comment.date.split('-')[1] && yyyy == comment.date.split('-')[0]){
        comment.date = 'Вчера';
    }

    
    comment.date = String(comment.date.split("-").reverse().join("-"));

    comment.style = 'heart__black';

    nameUser.value = '';
    dataUser.value = '';
    textUser.value = '';

    error.style.display = 'none';
    comments.push(comment);
    saveComments();
    showComments();

    return false;
}

//Сохраняем в локальное пространство
function saveComments() {
    localStorage.setItem( 'comments', JSON.stringify(comments) );
}
//Загружаем из локалки данные
function loadComments() {
    if( localStorage.getItem('comments') ) {
        comments = JSON.parse( localStorage.getItem('comments') );
    }
    showComments();
}

//Создаем новый обьект коментария, каждый раз будет вставляться новый в верстку 
function showComments() {
    let container = document.querySelector('.main__comments-conteyner');
    let remove = document.querySelectorAll('.main__comments-cart');
    
    remove.forEach(item => {item.remove()});

    comments.forEach(item => {
        let div = document.createElement('div');
        div.classList.add('main__comments-cart');
        div.innerHTML = `
        <div class="main__comments-cart_title flex sb">
            <div class="main__comments-cart_name">${item.name}</div>
            <div class="main__comments-cart_data">${item.date} / <span>время: ${item.time}</span></div>
        </div>
        <div class="main__comments-cart_text">
            ${item.text}
        </div>
        <img src="img/delite.png" alt="delite" class = "delite">
        <div class="heart ${item.style}"></div>`
        ;
        
        container.append(div);
    });
    delite();
    hertClick();
}


//Обработчик на кнопку корзина , удаляем коментарий
function delite() {
    let deliteBtn = document.querySelectorAll('.delite');

    deliteBtn.forEach( (item, i) => {
        item.addEventListener('click', () => {
            comments.splice(i, 1);

            saveComments();
            loadComments();
        });
    })
}

//Обработчик на лайк, красный черный
function hertClick() {
    let hearts = document.querySelectorAll('.heart');
    
    hearts.forEach((item, i) => {
        item.addEventListener('click', () => {
            if(comments[i].style == 'heart__black'){
                comments[i].style = 'heart__red';
                saveComments();
                loadComments();
            }else if(comments[i].style == 'heart__red'){
                comments[i].style = 'heart__black';
                saveComments();
                loadComments();
            }
        });
    });
}