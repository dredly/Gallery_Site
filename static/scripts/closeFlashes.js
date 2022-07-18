/* Script to allow flash messages to be closed */
/* global document */

const deleteButton = document.querySelector('.delete')
if (deleteButton) {
	const flashDisplay = deleteButton.parentElement
	deleteButton.addEventListener('click', () => {
		flashDisplay.remove()
	})
}
