import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, useGLTF } from "@react-three/drei";
import "./index.css";
import { Box3, Vector3 } from "three";

function Earth({ scrollProgress }) {
  const earthRef = useRef();
  const { scene } = useGLTF("/models/earth.glb");

  useFrame((state, delta) => {
  if (earthRef.current) {
    earthRef.current.rotation.y += delta * 0.2;

    const earthSize = 0.003 + scrollProgress * 0.006;
    earthRef.current.scale.setScalar(earthSize);
  }
});

  return (
    <primitive
      ref={earthRef}
      object={scene}
      scale={0.003}
      position={[0, 0, 0]}
    />
  );
}

function Scene({ scrollProgress }) {
  return (
    <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
      <color attach="background" args={["#030712"]} />

      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 3, 5]} intensity={3} />
      <pointLight position={[-4, -2, 2]} intensity={2} color="#4f8cff" />

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
        <Earth scrollProgress={scrollProgress} />
      </Suspense>

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={4}
        maxDistance={12}
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