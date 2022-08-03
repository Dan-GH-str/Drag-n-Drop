const item = document.querySelector('.item')
const addBtns = document.querySelectorAll('.addBtn')
const placeholders = document.querySelectorAll('.placeholder')
let currItem

addBtns.forEach(btn => btn.addEventListener('click', addItem))
item.addEventListener('dragstart', dragStart)
item.addEventListener('dragend', dragEnd)

// Функционал, связанный с добавлением новых элементов
function addItem(event) {
    html = `
        <div class="item" draggable="true">
            <textarea spellcheck="false"></textarea>
        </div>
    `
    event.target.nextElementSibling.insertAdjacentHTML('beforeend', html)

    const newItem = event.target.nextElementSibling.lastElementChild
    const textarea = newItem.querySelector('textarea')
    textarea.focus()
    
    newItem.addEventListener('dragstart', dragStart)
    newItem.addEventListener('dragend', dragEnd)
    textarea.addEventListener('blur', insertText)
}

function insertText(event) {
    // Вместо textarea в newItem будем вставлять другие теги, чтобы можно было удобно перетаскивать весь item
    const content = event.target.value
    const item = event.target.parentNode
    
    item.innerHTML = `<span id="close">&times;</span><span id="edit">&#128393;</span>${content}`
    
    //Возможность редактирования текста
    item.querySelector('#edit').addEventListener('click', () => {
        const itemHeight = item.offsetHeight

        item.innerHTML =`<textarea spellcheck="false">${content}</textarea>`
        const img = item.querySelector('img')
        const newTextarea = item.querySelector('textarea')
        item.style.minHeight = itemHeight + 'px'

        newTextarea.focus()
        newTextarea.setSelectionRange(content.length + 1, content.length + 1)
        
        newTextarea.addEventListener('blur', insertText)
    })

    item.querySelector('#close').addEventListener('click', () => {
        item.remove()
    })
}



// Функционал, непосредственно связанный с Drag&Drop-ом
for (const placeholder of placeholders) {
    placeholder.addEventListener('dragover', dragover)
    placeholder.addEventListener('dragenter', dragenter)
    placeholder.addEventListener('dragleave', dragleave)
    placeholder.addEventListener('drop', dragdrop)
}

function dragStart(event) {
    currItem = event.target
    currItem.classList.add('hold')
    setTimeout(() => {
        event.target.classList.add('hide')
    }, 0)
}

function dragEnd(event) {
    event.target.classList.remove('hold', 'hide')
}

function dragover(event) {
    event.preventDefault()                  // Чтобы можно было перетаскивать элемент к другим элементам
}

function dragenter(event) {
    const target = event.target.classList.contains('item') 
        ? event.target.closest('.placeholder')
        : event.target
        
    target.classList.add('hovered')
}

function dragleave(event) {
    event.target.classList.remove('hovered')
}

function dragdrop(event) {
    const target = event.target.classList.contains('item') 
        ? event.target.closest('.placeholder')
        : event.target

    target.classList.remove('hovered')
    target.insertAdjacentElement('beforeend', currItem)
}

// Скролл
// Наведение друг на друга
// Удаление