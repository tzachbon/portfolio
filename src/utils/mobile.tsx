

export let DESKTOP = true;

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 1000) {
	DESKTOP = false;

	console.log('====================================');
	console.log(DESKTOP);
	console.log('====================================');
}
