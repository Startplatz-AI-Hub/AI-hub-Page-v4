
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { gsap } from 'https://esm.sh/gsap@3.12.5';
import { ScrollTrigger } from 'https://esm.sh/gsap@3.12.5/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initMorphSection() {
    const stage = document.getElementById('morph-stage');
    if (!stage) return;

    let canvas = document.getElementById('morph-canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'morph-canvas';
        Object.assign(canvas.style, {
            position: 'absolute',
            inset: '0',
            width: '100%',
            height: '100%',
            display: 'block'
        });
        const sticky = stage.querySelector('.morph-sticky');
        if (sticky) sticky.prepend(canvas);
    }

    // ---------- Config & Setup ----------
    const figureColors = [0x10B981, 0x1e3a5f, 0xF97316]; // Mint, Navy, Orange (Brand Colors)
    const cardColors = [0x064E3B, 0x0f172a, 0x7c2d12];

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    // No fog matches specific design? Keeping fog for depth.
    scene.fog = new THREE.Fog(0x070a12, 8, 30);

    const camera = new THREE.PerspectiveCamera(42, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.set(0, 1.25, 8);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 1.2);
    key.position.set(4, 8, 6);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xffffff, 0.7);
    rim.position.set(-6, 4, -8);
    scene.add(rim);

    // Objects
    const figures = [];
    const cardMeshes = [];

    // Persona Images / Textures (placeholders if not available)
    // We will use colors + text for now, or load textures if url provided.
    // User requested "Bilder von Personas". I'll use placeholders from picsum or similar if I don't have assets.
    // Assuming simple geometry for now as per demo.

    function makeFigure(i) {
        const root = new THREE.Group();

        // Figure (Capsule + Head)
        const bodyGeo = new THREE.CapsuleGeometry(0.48, 1.25, 10, 18);
        const bodyMat = new THREE.MeshStandardMaterial({
            color: figureColors[i], roughness: 0.35, metalness: 0.22, transparent: true, opacity: 1
        });
        const body = new THREE.Mesh(bodyGeo, bodyMat);

        const headGeo = new THREE.SphereGeometry(0.34, 24, 18);
        const headMat = new THREE.MeshStandardMaterial({
            color: 0xffffff, roughness: 0.25, metalness: 0.18, transparent: true, opacity: 1
        });
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.set(0, 1.12, 0.12);

        const figureGroup = new THREE.Group();
        figureGroup.add(body, head);
        figureGroup.position.y = 0.12;
        root.add(figureGroup);

        // Card (Box)
        const cardGeo = new THREE.BoxGeometry(2.2, 1.25, 0.12);
        const cardMat = new THREE.MeshStandardMaterial({
            color: cardColors[i], roughness: 0.35, metalness: 0.35, transparent: true, opacity: 0
        });
        const card = new THREE.Mesh(cardGeo, cardMat);
        card.position.set(0, 0.4, 0);
        card.rotation.y = 0.15 * (i - 1);

        // Face (Plane)
        const faceGeo = new THREE.PlaneGeometry(2.05, 1.10);
        const faceMat = new THREE.MeshStandardMaterial({
            color: 0xffffff, roughness: 0.6, metalness: 0.0, transparent: true, opacity: 0.0, side: THREE.DoubleSide
        });
        const face = new THREE.Mesh(faceGeo, faceMat);
        face.position.set(0, 0, 0.065);
        card.add(face);

        // Add Text Label Texture to Face?
        // For simplicity, we keep the DOM labels for clarity as implemented in demo.

        root.add(card);
        const x0 = (i - 1) * 2.35;
        root.position.set(x0, 0, -10.0);

        return { root, figureGroup, body, head, card, face, index: i };
    }

    for (let i = 0; i < 3; i++) {
        const obj = makeFigure(i);
        scene.add(obj.root);
        figures.push(obj);
        cardMeshes.push(obj.card);
        // Link mesh to object for rayraycasting
        obj.card.userData = { id: i };
    }

    // Scroll Logic
    const stickyEl = stage.querySelector('.morph-sticky');
    let targetProg = 0;
    let smoothProg = 0;

    const st = ScrollTrigger.create({
        trigger: stage,
        start: 'top top',
        end: '+=200%', // 300vh scroll distance
        pin: stickyEl,
        scrub: 0.85,
        onUpdate: (self) => targetProg = self.progress
    });

    // Interaction
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2(-10, -10);
    let hoveredIndex = -1;
    let clickEnabled = false;

    function onPointerMove(e) {
        const rect = canvas.getBoundingClientRect();
        pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    }

    function onClick(e) {
        if (!clickEnabled || hoveredIndex === -1) return;

        // Navigate to section
        const targets = ['#arbeitssuchend', '#berufstaetig', '#unternehmen'];
        const targetId = targets[hoveredIndex];
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
            // Smooth scroll to target
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    window.addEventListener('mousemove', onPointerMove);
    canvas.addEventListener('click', onClick);

    // Resize
    function resize() {
        const w = stickyEl.clientWidth;
        const h = stickyEl.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', resize);
    resize();

    // Helpers
    const lerp = (a, b, t) => a + (b - a) * t;
    const easeInOut = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    const easeOutBack = (t) => { const c1 = 1.70158; const c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };

    // Loop
    function animate() {
        smoothProg = lerp(smoothProg, targetProg, 0.08);
        const t = smoothProg * 3; // 3 phases

        clickEnabled = (t >= 2.0);
        canvas.style.cursor = (clickEnabled && hoveredIndex !== -1) ? 'pointer' : 'default';

        // Raycast
        if (clickEnabled) {
            raycaster.setFromCamera(pointer, camera);
            const intersects = raycaster.intersectObjects(cardMeshes);
            if (intersects.length > 0) {
                hoveredIndex = intersects[0].object.userData.id;
            } else {
                hoveredIndex = -1;
            }
        } else {
            hoveredIndex = -1;
        }

        const isNarrow = window.innerWidth < 760;
        const approachSpacing = isNarrow ? 1.55 : 2.35;
        const cardSpacing = isNarrow ? 1.90 : 2.75;

        // Animate Figures
        figures.forEach((f, i) => {
            const xApproach = (i - 1) * approachSpacing;
            const xCards = (i - 1) * cardSpacing;
            const isHover = (i === hoveredIndex);

            if (t < 1) {
                // Phase 1: Approach
                const p = easeInOut(t);
                f.root.position.set(xApproach, 0, lerp(-10, -4.2, p));
                f.figureGroup.scale.setScalar(1);
                f.body.material.opacity = 1;
                f.card.material.opacity = 0;
            } else if (t < 2) {
                // Phase 2: Morph
                const p = easeInOut(t - 1);
                f.root.position.x = lerp(xApproach, xCards, p);
                f.root.position.z = lerp(-4.2, -2.25, p);

                f.body.material.opacity = 1 - p;
                f.head.material.opacity = 1 - p;
                f.card.material.opacity = p;
                f.face.material.opacity = p * 0.1;

                f.figureGroup.scale.setScalar(lerp(1, 0.8, p));
                f.card.scale.setScalar(lerp(0.8, 1, easeOutBack(p)));
                f.card.rotation.y = lerp(0.15 * (i - 1), 0.05 * (i - 1), p);
            } else {
                // Phase 3: Interactive
                f.root.position.set(xCards, 0, -2.25);
                f.body.material.opacity = 0;
                f.card.material.opacity = 1;

                const targetScale = isHover ? 1.1 : 1.0;
                f.card.scale.setScalar(lerp(f.card.scale.x, targetScale, 0.1));

                f.face.material.opacity = lerp(f.face.material.opacity, isHover ? 0.3 : 0.1, 0.1);
                f.card.rotation.x = lerp(f.card.rotation.x, isHover ? -0.1 : 0, 0.1);
            }
        });

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    animate();
}
