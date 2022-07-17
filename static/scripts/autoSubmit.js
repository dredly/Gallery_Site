/* Script to automatically submit input from dropdown menu for filters */
/* global document */

const tagForm = document.querySelector('#tagForm')
const tagSelector = document.querySelector('#tagSelector')

tagSelector.addEventListener('input', () => {
	tagForm.submit()
})