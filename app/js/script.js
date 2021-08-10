;(() => {
	const mobileMenu = document.querySelector('.mobile-menu')
	const btnShorten = document.querySelector('.shorten-btn')

	mobileMenu.addEventListener('click', menuResolve)
	btnShorten.addEventListener('click', checkLink)
})()

// Main class for Links
class Link {
	constructor(original, full_short, short) {
		this.original = original
		this.short = short
		this.full_short = full_short
	}

	show = () => {
		const container = document.querySelector('.links-shortened-container')

		const card = document.createElement('div')
		card.classList.add('link-shortened-card')

		const or = document.createElement('div')
		const sh = document.createElement('div')
		const btnWrapper = document.createElement('div')
		const btn = document.createElement('button')

		or.classList.add('original')
		sh.classList.add('shortened')
		btnWrapper.classList.add('btn-wrapper')
		btn.classList.add('btn', 'copy-btn')

		btn.addEventListener('click', this.copyLink)
		btn.innerText = 'Copy'
		btnWrapper.appendChild(btn)

		or.innerText = this.original
		sh.innerText = this.short

		card.appendChild(or)
		card.appendChild(sh)
		card.appendChild(btnWrapper)
		container.appendChild(card)
	}
	copyLink = () => {
		console.log(this.full_short)
	}
}

function toggleClass() {
	this.classList.toggle('active')
}
function menuResolve() {
	this.classList.toggle('active')
	document.getElementsByTagName('nav')[0].classList.toggle('active')
	document.getElementsByTagName('body')[0].classList.toggle('stopper')
}
// Check input link validity
function checkLink() {
	const input = document.querySelector('.shorten').value.trim()

	if (!input) {
		inputError()
		return
	}

	shortenLink(input)
}
// Error func
function inputError(errorText = 'Please add a link') {
	const errorEl = document.querySelector('.link-error')
	const inputEl = document.querySelector('.shorten')

	inputEl.classList.add('active')
	errorEl.innerText = errorText
	errorEl.classList.add('active')

	setTimeout(() => {
		inputEl.classList.remove('active')
		errorEl.classList.remove('active')
	}, 5000)
}
const shortenLink = async original => {
	showLoader()
	try {
		const res = await fetch(`https://api.shrtco.de/v2/shorten?url=${original}`)

		const data = await res.json()

		await createLink(data.result)
	} catch (error) {
		console.log(error)
		inputError('Oh no! Try again later.')
		hideLoader()
	}
}
// Create class
function createLink(data) {
	const link = new Link(
		data.original_link,
		data.full_short_link3,
		data.short_link3
	)

	hideLoader()
	link.show()

	addToArray(link)
}
function addToArray(link) {}
// Loader controls
function showLoader() {
	const container = document.querySelector('.link-shorten-container')
	const cover = document.createElement('div')
	const loader = document.createElement('div')

	cover.classList.add('cover')
	loader.classList.add('loader')
	container.appendChild(cover)
	container.appendChild(loader)
}
function hideLoader() {
	document.querySelector('.cover').remove()
	document.querySelector('.loader').remove()
}
// Local Storage
function saveToLocalStorage() {}
function loadFromLocalStorage() {}
