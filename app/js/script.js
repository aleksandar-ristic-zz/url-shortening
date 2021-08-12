;(() => {
	'use strict'
	window.addEventListener('load', loadFromLocalStorage)
	document.querySelector('.mobile-menu').addEventListener('click', menuResolve)
	document.querySelector('.shorten-btn').addEventListener('click', checkLink)
})()

// Main class for Links
class Link {
	constructor(original, short) {
		this.original = original
		this.short = short
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
	copyLink = function () {
		const text = this.parentElement.previousSibling.innerText
		const link = `https://${text}`

		const oldText = this.innerText
		const oldBg = this.style.backgroundColor
		const oldFont = this.style.fontSize

		navigator.clipboard
			.writeText(link)
			.then(() => {
				this.innerText = 'Copied!'
				this.style.backgroundColor = 'hsl(257, 27%, 26%)'
				this.style.fontSize = '1rem'
			})
			.catch(error => {
				inputError('Oh no! Try again!')
			})

		setTimeout(() => {
			this.innerText = oldText
			this.style.backgroundColor = oldBg
			this.style.fontSize = oldFont
		}, 2000)
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
// Fetch Shortened link
const shortenLink = async original => {
	showLoader()
	try {
		const res = await fetch(`https://api.shrtco.de/v2/shorten?url=${original}`)
		const data = await res.json()

		await createLink(data.result)
	} catch (error) {
		console.log(error)
		inputError('Check your link, then try again.')
		hideLoader()
	}
}
// Create class
function createLink(data) {
	const link = new Link(data.original_link, data.short_link3)

	hideLoader()
	link.show()
	addToArray()
}
// Creates arr from links and saves to local storage
function addToArray() {
	let objArr = []
	const arr = document.querySelectorAll('.link-shortened-card')

	if (arr.length > 5) arr[0].remove()

	arr.forEach(link => {
		const obj = {
			original: link.childNodes[0].innerText,
			short: link.childNodes[1].innerText
		}
		objArr.push(obj)
	})

	saveToLocalStorage(objArr)
}
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
	const cover = document.querySelector('.cover')
	const loader = document.querySelector('.loader')
	if (!loader) return

	cover.remove()
	loader.remove()
}
// Local Storage
function saveToLocalStorage(arr) {
	localStorage.setItem('link-data', JSON.stringify(arr))
}
function loadFromLocalStorage() {
	const json = localStorage.getItem('link-data')
	if (json === null) return

	const linksArr = JSON.parse(json)
	showLinks(linksArr)
}
// Show links on load
function showLinks(linksArr) {
	linksArr.forEach(link => {
		const l = new Link(link.original, link.short)
		l.show()
	})
}
