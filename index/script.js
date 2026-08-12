let photos = [
    "imagee1.jpg",
    "imagee2.jpg",
    "imagee3.jpg",
    "imagee4.jpg",
    "imagee5.jpg",
    "imagee6.jpg",
    "imagee7.jpg",
    "imagee8.jpg"
];

let index = 0;
let image = document.getElementById("myPhoto");

function showImage() {
    image.src = photos[index];
}

function nextImage() {
    index = (index + 1) % photos.length;
    showImage();
    
}

function previousImage() {
    index = (index - 1 + photos.length) % photos.length;
    showImage();
}

// Automatic slideshow
setInterval(nextImage, 2000);