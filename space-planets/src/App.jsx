import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, useGLTF } from "@react-three/drei";
import "./index.css";

function Planet({
  url,
  index,
  scale,
  rotationSpeed = 0.15,
  scrollZoom = 0,
}) {
  const planetRef = useRef();
  const { scene } = useGLTF(url);

  useFrame((state, delta) => {
    if (!planetRef.current) return;

    const time = state.clock.elapsedTime;

    // Five planets evenly spaced on one circular orbit.
    const angle = time * 0.35 + index * ((Math.PI * 2) / 5);

    const orbitWidth = 7;
    const orbitDepth = 4;

    const x = Math.sin(angle) * orbitWidth;
    const z = -2 + Math.cos(angle) * orbitDepth;

    planetRef.current.position.x = x;
    planetRef.current.position.y =
      Math.sin(time * 0.8 + index) * 0.3 - 0.2;
    planetRef.current.position.z = z;

    // Planets look bigger when they come closer to the camera.
    const depthSize = 0.72 + ((z + 6) / 8) * 0.45;

    // Earth keeps its scroll zoom effect.
    const finalSize = scale * depthSize * (1 + scrollZoom * 1.4);
    planetRef.current.scale.setScalar(finalSize);

    // Planets rotate around themselves too.
    planetRef.current.rotation.y += delta * rotationSpeed;
  });

  return (
    <group ref={planetRef} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}


function Scene({ scrollProgress }) {
  return (
    <Canvas camera={{ position: [0, 0, 12], fov: 45 }} dpr={[1, 2]}>
      <color attach="background" args={["#030712"]} />

      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 4, 5]} intensity={4} />
      <pointLight position={[-5, -2, 3]} intensity={3} color="#4f8cff" />

      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />

      <Suspense fallback={null}>
        <Planet
          url="/models/earth.glb"
          index={0}
          scale={0.003}
          rotationSpeed={0.2}
          scrollZoom={scrollProgress}
        />
      </Suspense>

      <Suspense fallback={null}>
        <Planet
          url="/models/venus.glb"
          index={1}
          scale={0.00125}
          rotationSpeed={0.12}
        />
      </Suspense>

      <Suspense fallback={null}>
        <Planet
          url="/models/mercury.glb"
          index={2}
          scale={0.0008}
          rotationSpeed={0.25}
        />
      </Suspense>

      <Suspense fallback={null}>
        <Planet
          url="/models/mars.glb"
          index={3}
          scale={0.0013}
          rotationSpeed={0.16}
        />
      </Suspense>

      <Suspense fallback={null}>
        <Planet
          url="/models/saturn.glb"
          index={4}
          scale={0.0025}
          rotationSpeed={0.1}
        />
      </Suspense>

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={6}
        maxDistance={18}
      />
    </Canvas>
  );
}

function App() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const progress = Math.min(window.scrollY / window.innerHeight, 1);
      setScrollProgress(progress);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="app">
      <header className="navbar">
        <p className="logo">SPACE EDU</p>

        <nav>
          <a href="#planets">Planets</a>
          <a href="#trailer">Trailer</a>
          <a href="#tickets">Tickets</a>
          <a href="#blog">Blog</a>
        </nav>

        <button className="enroll-button">Enroll</button>
      </header>

      <section className="hero">
        <div className="hero-text">
          <p className="eyebrow">PLANET</p>
          <h1>EARTH</h1>
          <p className="description">
            Explore the remarkable blue planet we call home.
          </p>
          <button className="start-button">Get started</button>
        </div>

        <div className="earth-canvas">
          <Scene scrollProgress={scrollProgress} />
        </div>
      </section>
    </main>
  );
}

export default App;