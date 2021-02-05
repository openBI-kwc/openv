<template lang="pug">
  .container
</template>
<script>
/* eslint-disable */
let camera, scene, renderer;
let particles, particle, count = 0;
//设置初始位置
let mouseX = 0, mouseY = -438;
let windowHalfX = 0;
let windowHalfY = 0;
const THREE = window.THREE
export default {
  props: {
    SEPARATION: {
      type: Number,
      default: 100
    },
    AMOUNTX: {
      type: Number,
      default: 50
    },
    AMOUNTY: {
      type: Number,
      default: 50
    }
  },
  mounted() {
		const init = () => {
      if (!THREE) return
      windowHalfX = window.innerWidth / 2;
      windowHalfY = window.innerHeight / 2;
			camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
			camera.position.z = 1000;
			scene = new THREE.Scene();
			particles = new Array();
			let PI2 = Math.PI * 2;
			let material = new THREE.ParticleCanvasMaterial({
        color: 0x1e61b3,
				program: function (context) {
					context.beginPath();
          context.arc(0, 0, 0.5, 0, PI2, true);
					context.fill()
				}
			});
			let i = 0;
			for (let ix = 0; ix < this.AMOUNTX; ix++) {
				for (let iy = 0; iy < this.AMOUNTY; iy++) {
					particle = particles[i++] = new THREE.Particle(material);
					particle.position.x = ix * this.SEPARATION - ((this.AMOUNTX * this.SEPARATION) / 2);
					particle.position.z = iy * this.SEPARATION - ((this.AMOUNTY * this.SEPARATION) / 2);
					scene.add(particle)
				}
			}
			let width = this.$el.clientWidth;
			let height = this.$el.clientHeight;
			renderer = new THREE.CanvasRenderer({
				antialias: true,
				//设置背景透明
				alpha: true
			});
			renderer.setSize(width, height);
			this.$el.appendChild(renderer.domElement);
			document.addEventListener('mousemove', onDocumentMouseMove, false);
			document.addEventListener('touchstart', onDocumentTouchStart, false);
			document.addEventListener('touchmove', onDocumentTouchMove, false);
			window.addEventListener('resize', onWindowResize, false)
			camera.position.x = 133.99999999999972;
			camera.position.y = 437.99999999999943;
			camera.lookAt(scene.position);
			renderer.render(scene, camera);
		}
		const onWindowResize = () => {
			windowHalfX = window.innerWidth / 2;
			windowHalfY = window.innerHeight / 2;
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			let width = this.$el.clientWidth;
			let height = this.$el.clientHeight;
			renderer.setSize(width, height);
		}
		const onDocumentMouseMove = (event) => {
			mouseX = event.clientX - windowHalfX;
			//mouseY = event.clientY - windowHalfY;
			//mouseY = -438;
		}
		const onDocumentTouchStart = (event) => {
			if (event.touches.length === 1) {
				event.preventDefault();
				mouseX = event.touches[0].pageX - windowHalfX;
				mouseY = event.touches[0].pageY - windowHalfY
			}
		}
		const onDocumentTouchMove = (event) => {
			if (event.touches.length === 1) {
				event.preventDefault();
				mouseX = event.touches[0].pageX - windowHalfX;
				mouseY = event.touches[0].pageY - windowHalfY
			}
		}
		const animate = () => {
			window.requestAnimationFrame(animate);
			render()
		}
		//移动相机形成动画
		const render = () => {
			camera.position.x += (mouseX - camera.position.x) * .05;
			camera.position.y += (- mouseY - camera.position.y) * .05;
			camera.lookAt(scene.position);
			let i = 0;
			for (let ix = 0; ix < this.AMOUNTX; ix++) {
				for (let iy = 0; iy < this.AMOUNTY; iy++) {
					particle = particles[i++];
					particle.position.y = (Math.sin((ix + count) * 0.5) * 120) +
						(Math.sin((iy + count) * 0.5) * 120);
					particle.scale.x = particle.scale.y = (Math.sin((ix + count) * 0.5) + 1) * 5 +
						(Math.sin((iy + count) * 0.5) + 1) * 5;
				}
			}
			renderer.render(scene, camera);
			count += 0.1
    }
    init();
		animate();
  },
  beforeDestroy () {
    document.removeEventListener('mousemove', null, false);
    document.removeEventListener('touchstart', null, false);
    document.removeEventListener('touchmove', null, false);
    window.removeEventListener('resize', null, false)
  }
}
</script>
<style scope>
  .container {
    position: fixed;
    height: 35vh;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
  }
</style>