;(() => {
	const mobileMenu = document.querySelector('.mobile-menu')

	mobileMenu.addEventListener('click', menuResolve)
})()

function toggleClass() {
	this.classList.toggle('active')
}
function menuResolve() {
	this.classList.toggle('active')
	document.getElementsByTagName('nav')[0].classList.toggle('active')
	document.getElementsByTagName('body')[0].classList.toggle('stopper')
}
