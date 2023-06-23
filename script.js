const brightness =
	'.`^",:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$';
const negative =
	'$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,"^`.';
const colorRanges = brightness.length;

const maxColorValue = 255; // This is typical in many situations, but adjust as necessary.
const colRange = maxColorValue / colorRanges;

const getSymbol = (avgColorVal) => {
	let index = Math.floor(avgColorVal / colRange);
	if (avgColorVal == 255) {
		return brightness[index - 1];
	}
	return brightness[index];
};

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const img1 = new Image();
const imageUpload = document.getElementById('imageUpload');

const drawButton = document.getElementById('drawButton');
const resText = document.getElementById('resText');
const slider = document.getElementById('scaleSlider');

slider.onchange = () => {
	resText.textContent = slider.value + ' px';
};
// Add event listener for the "change" event
imageUpload.addEventListener('change', function (event) {
	// Get the selected file
	const selectedImage = event.target.files[0];
	img1.src = URL.createObjectURL(selectedImage);
});

const scanArea = (cellsize, imgData) => {
	let pixelarr = [];
	let textArr = [];
	for (let y = 0; y < imgData.height; y += cellsize) {
		let lineArr = [];
		for (let x = 0; x < imgData.width; x += cellsize) {
			const posX = x * 4;
			const posY = y * 4;
			const arrPos = posY * imgData.width + posX;

			// if pixel is not transparent
			if (imgData.data[arrPos + 3] > 128) {
				const r = imgData.data[arrPos];
				const g = imgData.data[arrPos + 1];
				const b = imgData.data[arrPos + 2];

				const avg = (r + g + b) / 3;
				const color = 'rgb(' + r + ',' + g + ',' + b + ')';

				// pixelarr.push({
				// 	x: x,
				// 	y: y,
				// 	color: color,
				// 	symb: getSymbol(avg),
				// 	draw: (ctx) => {
				// 		ctx.fillStyle = color;
				// 		ctx.fillText(getSymbol(avg), x, y);
				// 	},
				// });

				// textArr.push(getSymbol(avg));
				lineArr.push(getSymbol(avg));
			} else {
				lineArr.push(' ');
			}
		}
		textArr.push(lineArr);
	}
	// return pixelarr;
	return textArr;
};

const drawAscii = (cellSize, imgData) => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	let imgArr = scanArea(cellSize, imgData);
	for (let i = 0; i < imgArr.length; i++) {
		imgArr[i].draw(ctx);
	}
};

const drawAsciiText = (cellSize, imgData) => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	let textImg = scanArea(cellSize, imgData);
	for (let y = 0; y < textImg.length; y += 1) {
		let currP = document.createElement('p');
		currP.className = 'ascii-out';
		currP.textContent = textImg[y].join('');
		document.body.appendChild(currP);
	}
};

img1.onload = () => {
	canvas.width = img1.width;
	canvas.height = img1.height;
	ctx.drawImage(img1, 0, 0);
	const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);

	// Loop through each pixel
	// drawAscii(20, pixels);
	drawButton.addEventListener('click', () => {
		drawAsciiText(parseInt(slider.value), pixels);
	});
};
