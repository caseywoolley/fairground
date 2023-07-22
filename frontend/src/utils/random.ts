// source - https://stackoverflow.com/questions/16801687/javascript-random-ordering-with-seed
export function randomizeArray(seed: number, array: number[]) {
	const randomizedArry = [...array]
	let m = randomizedArry.length
	let t: number
	let i: number

	while (m) {
		i = Math.floor(random(seed) * m--)

		t = randomizedArry[m]
		randomizedArry[m] = randomizedArry[i]
		randomizedArry[i] = t
		++seed
	}

	return randomizedArry
}

function random(seed: number) {
	const x = Math.sin(seed++) * 10000
	return x - Math.floor(x)
}
