// 1. Three.js - DNAی ڕاستەقینە
const canvas = document.getElementById("dna-canvas");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);

const curve1 = new THREE.CatmullRomCurve3(
  Array.from({ length: 50 }, (_, i) => {
    const t = (i / 49) * Math.PI * 4;
    return new THREE.Vector3(
      Math.cos(t) * 3,
      (t - Math.PI * 2) * 0.5,
      Math.sin(t) * 3
    );
  })
);

const points1 = curve1.getPoints(100);
const geometry1 = new THREE.BufferGeometry().setFromPoints(points1);
const material1 = new THREE.LineBasicMaterial({ color: 0x4ade80 });
const helix1 = new THREE.Line(geometry1, material1);
scene.add(helix1);

camera.position.z = 15;

function animateDNA() {
  requestAnimationFrame(animateDNA);
  helix1.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animateDNA();

// 2. دەنگەکان
const clickSound = document.getElementById("click-sound");
const microscopeSound = document.getElementById("microscope-sound");

document.addEventListener("click", () => {
  clickSound.volume = 0.3;
  microscopeSound.volume = 0.4;
}, { once: true });

// 3. مایکرۆسکۆب + کاروسێل
const microscope = document.getElementById("microscope");
const carousel = document.getElementById("slide-carousel");
const slides = document.querySelectorAll(".slide-item");
let currentSlide = 0;

microscope.style.backgroundImage = "url('images/microscope.png')";

gsap.to(microscope, {
  left: "calc(50% - 70px)",
  opacity: 1,
  duration: 2,
  ease: "power2.out",
  delay: 1,
  onComplete: () => {
    microscopeSound.play();
    gsap.to(carousel, {
      opacity: 1,
      transform: "translate(-50%, -50%) rotateX(0deg) scale(1)",
      duration: 1.5,
      ease: "back.out(1.2)",
      onComplete: () => {
        clickSound.currentTime = 0;
        clickSound.play();
        startAutoSlide();
      }
    });
  }
});

// 4. کاروسێل
function showSlide(index) {
  slides[currentSlide].classList.remove("active");
  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].classList.add("active");
  clickSound.currentTime = 0;
  clickSound.play();
}

function nextSlide() { showSlide(currentSlide + 1); }
function prevSlide() { showSlide(currentSlide - 1); }

document.getElementById("next-btn").addEventListener("click", nextSlide);
document.getElementById("prev-btn").addEventListener("click", prevSlide);

let autoSlideInterval;
function startAutoSlide() {
  autoSlideInterval = setInterval(nextSlide, 4000);
}

carousel.addEventListener("mouseenter", () => clearInterval(autoSlideInterval));
carousel.addEventListener("mouseleave", () => {
  autoSlideInterval = setInterval(nextSlide, 4000);
});

// 5. زووم بە ماوس وێڵ
document.querySelectorAll(".zoom-area").forEach(area => {
  let zoomLevel = 3;
  area.addEventListener("wheel", (e) => {
    e.preventDefault();
    if (e.deltaY < 0) zoomLevel = Math.min(5, zoomLevel + 0.2);
    else zoomLevel = Math.max(2.5, zoomLevel - 0.2);
    area.style.backgroundSize = `${zoomLevel * 100}%`;
  });
});

// 6. ماوس مۆشن (پارالاکس)
const container = document.getElementById("anim-container");
document.getElementById("virus").style.backgroundImage = "url('images/virus.png')";
document.getElementById("blood").style.backgroundImage = "url('images/blood.png')";
document.getElementById("plant").style.backgroundImage = "url('images/plant.png')";
document.getElementById("embryo").style.backgroundImage = "url('images/embryo.png')";

container.addEventListener("mousemove", (e) => {
  const { clientX, clientY } = e;
  const x = clientX / window.innerWidth - 0.5;
  const y = clientY / window.innerHeight - 0.5;

  document.getElementById("virus").style.transform = `translate(${x * 20}px, ${y * 15}px) rotate(${x * 10}deg)`;
  document.getElementById("blood").style.transform = `translate(${-x * 25}px, ${y * 20}px) scale(${1 + x * 0.1})`;
  document.getElementById("plant").style.transform = `translate(${x * 30}px, ${-y * 25}px) rotate(${-x * 15}deg)`;
  document.getElementById("embryo").style.transform = `translate(${-x * 20}px, ${-y * 15}px) scale(${1 + y * 0.1})`;
});

// 7. ڕێکخستنی سایز
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});