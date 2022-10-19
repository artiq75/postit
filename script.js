const headerForm = document.getElementById('header-form')
const postitTemplate = document.getElementById('postit-template')
const postitItems = document.getElementById('postit-items')
const headerDeleteBtn = document.getElementById('header-delete')

let postits = []
let isEdit = false
let oldPostitState = {}

const handleClick = function (e) {
  const role = e.target.dataset.role

  switch (role) {
    case 'edit':
      if (isEdit) return
      handleEditPostit(e)
      isEdit = true
      break
    case 'delete':
      if (isEdit) return
      handleDeletePostit(e)
      break
    case 'save':
      if (!isEdit) return
      handleSavePostit(e)
      isEdit = false
      break
    case 'cancel':
      if (!isEdit) return
      handleCancelPostit(e)
      isEdit = false
      break
    default:
      return
  }
}

const setPostit = function (postits) {
  localStorage.setItem('postits', JSON.stringify(postits))
}

const handleDeleteAll = function (e) {
  postits = []
  localStorage.removeItem('postits')
  if (postitItems.children) {
    Array.from(postitItems.children).forEach((postit) => postit.remove())
  }
}

const handleDeletePostit = function (e) {
  const postitId = JSON.parse(e.target.dataset.postitId)
  postits = postits.filter((postit) => postit.id !== postitId)
  setPostit(postits)
  const postitItem = document.getElementById(postitId)
  if (postitItem) {
    postitItem.remove()
  }
}

const handleEditPostit = function (e) {
  const postitId = e.target.dataset.postitId
  const postitItem = document.getElementById(postitId)
  const title = postitItem.querySelector('.postit-title')
  const content = postitItem.querySelector('.postit-content')
  oldPostitState = {
    title: title.innerText,
    content: content.innerText,
  }
  postitItem.classList.add('edit')
  title.setAttribute('contenteditable', true)
  content.setAttribute('contenteditable', true)
}

const handleCancelPostit = function (e) {
  const postitId = JSON.parse(e.target.dataset.postitId)
  const postitItem = document.getElementById(postitId)
  const title = postitItem.getElementsByClassName('postit-title')[0]
  const content = postitItem.getElementsByClassName('postit-content')[0]
  const postit = postits.find((postit) => postit.id === postitId)
  title.innerText = postit.title
  content.innerText = postit.content
  postitItem.classList.remove('edit')
  title.setAttribute('contenteditable', false)
  content.setAttribute('contenteditable', false)
}

const handleSavePostit = function (e) {
  const postitId = JSON.parse(e.target.dataset.postitId)
  const postitItem = document.getElementById(postitId)
  const title = postitItem.getElementsByClassName('postit-title')[0]
  const content = postitItem.getElementsByClassName('postit-content')[0]
  postits = postits.map((postit) => {
    if (postit.id !== postitId) postit
    return {
      ...postit,
      title: title.innerText,
      content: content.innerText,
    }
  })
  setPostit(postits)
  postitItem.classList.remove('edit')
  title.setAttribute('contenteditable', false)
  content.setAttribute('contenteditable', false)
}

const handleSubmit = function (e) {
  e.preventDefault()

  const title = e.target.title
  const content = e.target.content

  if (!title.value || !content.value) {
    alert('Les champs son vide!')
    return
  }

  const now = Date.now()

  const postit = {
    id: now,
    title: title.value,
    content: content.value,
    created_at: now,
    updated_at: now,
  }

  headerForm.reset()

  postits = [postit, ...postits]
  setPostit(postits)

  const clone = postitTemplate.content.cloneNode(true)
  const postitItem = clone.querySelector('.postit-item')
  const postitCreatedAt =
    postitItem.getElementsByClassName('postit-created_at')[0]
  const postitUpdatedAt =
    postitItem.getElementsByClassName('postit-updated_at')[0]
  const postitTitle = postitItem.getElementsByClassName('postit-title')[0]
  const postitContent = postitItem.getElementsByClassName('postit-content')[0]

  const dateTime = `${new Date(
    postit.created_at
  ).toLocaleDateString()} ${new Date(postit.created_at).toLocaleTimeString()}`

  postitCreatedAt.innerText = dateTime
  postitUpdatedAt.innerText = dateTime
  postitTitle.innerText = postit.title
  postitContent.innerText = postit.content

  postitItem.setAttribute('id', postit.id)
  postitItem
    .querySelectorAll('button')
    .forEach((btn) => btn.setAttribute('data-postit-id', postit.id))
  postitItem.addEventListener('click', handleClick)
  postitItems.appendChild(clone)
}

headerDeleteBtn.addEventListener('click', handleDeleteAll)
headerForm.addEventListener('submit', handleSubmit)
