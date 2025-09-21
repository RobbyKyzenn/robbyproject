"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import dynamic from 'next/dynamic';
import { FaMoon, FaSun, FaArrowUp, FaInstagram, FaLinkedin, FaBehance, FaCheckCircle } from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"
import Tilt from "react-parallax-tilt"

const Masonry = dynamic(() => import('react-masonry-css'), { ssr: false });
const MotionImage = motion(Image);

const rotatingTitles = [ "UI/UX Designer", "Sport Designer", "GFX Designer", "Illustrator" ];
const categories = [ { name: "All" }, { name: "Sport" }, { name: "Illustration" }, { name: "GFX" }, { name: "Poster" } ];
const initialGallery = [
  { id: 1, category: "Sport", title: "Paris Saint Germain", description: "PSG Poster Design.", image: "/design1.webp" },
  { id: 2, category: "Sport", title: "Liverpool FC", description: "Liverpool Poster Design.", image: "/design2.webp" },
  { id: 3, category: "Sport", title: "Kylian Mbappe", description: "Kylian Mbappe Real Madrid Player.", image: "/design3.webp" },
  { id: 4, category: "Poster", title: "HuoHuo", description: "FanDesign HuoHuo From HSR.", image: "/design4.webp" },
  { id: 5, category: "Poster", title: "Acheron", description: "FanDesign Acheron From HSR.", image: "/design5.webp" },
  { id: 6, category: "Poster", title: "Shorekeeper", description: "FanDesign Shorekeeper From Wuthering Waves.", image: "/design6.webp" },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [gallery, setGallery] = useState(initialGallery);
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [titleIndex, setTitleIndex] = useState(0);
  const [currentNameIndex, setCurrentNameIndex] = useState(0);
  const names = ["Robby Fabian", "Mikoo Katsu"];

  // [FIX 2] Menambahkan dependency 'names.length'
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setShowTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);

    const titleInterval = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % rotatingTitles.length);
    }, 3000);

    const nameInterval = setInterval(() => {
      setCurrentNameIndex((prev) => (prev + 1) % names.length);
    }, 4000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(titleInterval);
      clearInterval(nameInterval);
    };
  }, [names.length]);

  const filteredGallery = gallery.filter(
    (item) =>
      (activeCategory === "All" || item.category === activeCategory) &&
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const breakpointColumnsObj = { default: 3, 1100: 2, 700: 1 };

  return (
    <div className="font-pixel text-white min-h-screen">
      
      <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none">
        <div className="glow-overlay"></div>
      </div>

      <div className="relative z-10">
        <motion.nav
          initial={{ top: 0, left: 0, width: "100%", borderRadius: 0, backgroundColor: darkMode ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.3)" }}
          animate={{
            top: scrolled ? 24 : 0,
            left: scrolled ? "50%" : 0,
            width: scrolled ? "80%" : "100%",
            borderRadius: scrolled ? "1rem" : 0,
            x: scrolled ? "-50%" : 0,
            backgroundColor: darkMode ? (scrolled ? "rgba(0,0,0,0.3)" : "transparent") : (scrolled ? "rgba(255,255,255,0.3)" : "transparent"),
            boxShadow: scrolled ? "0 10px 25px rgba(0,0,0,0.2)" : "none",
          }}
          whileHover={{
            y: scrolled ? -4 : -2,
            boxShadow: scrolled ? "0 15px 35px rgba(0,0,0,0.3)" : "0 8px 20px rgba(0,0,0,0.1)",
            backdropFilter: scrolled ? "blur(15px)" : "blur(10px)",
          }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="fixed z-50 py-3 px-6 backdrop-blur-lg cursor-pointer"
        >
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <motion.div
              animate={{ y: [-3, 3, -3] }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            >
              <Image 
                src="/icon3.webp"
                alt="Robby Logo" 
                width={130} 
                height={130} 
                className="logo-glow"
              />
            </motion.div>
            
            <div className="flex items-center gap-6 font-medium">
              <a href="#hero" className="hover:text-red-400 transition-colors">Home</a>
              <a href="#about" className="hover:text-red-400 transition-colors">About</a>
              <a href="#galeri" className="hover:text-red-400 transition-colors">Gallery</a>
              <a href="#kontak" className="hover:text-red-400 transition-colors">Contact</a>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition"
              >
                {darkMode ? <FaSun /> : <FaMoon />}
              </button>
            </div>
          </div>
        </motion.nav>

        <section id="hero" className="relative h-screen flex flex-col items-center justify-center text-center overflow-hidden">
          <MotionImage
            src="/shae-silver.gif" 
            alt="Hero Background"
            fill
            className="absolute inset-0 object-cover opacity-40 z-0"
            unoptimized={true}
          />
          
          <div className="relative z-20 px-4">
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                y: [-5, 5, -5]
              }}
              transition={{
                scale: { duration: 0.7, ease: "easeOut" },
                opacity: { duration: 0.7, ease: "easeOut" },
                y: {
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }
              }}
            >
              <Image
                src="/icon3.webp"
                alt="Robby Logo"
                width={500}
                height={150}
                className="logo-glow"
              />
            </motion.div>
            <motion.div
              key={titleIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="mt-4 text-xl md:text-2xl"
            >
              {rotatingTitles[titleIndex]}
            </motion.div>
          </div>
        </section>

        <main className="relative">
          <MotionImage
            src="/shae-black.gif" 
            alt="Content background"
            fill
            className="absolute inset-0 object-cover opacity-40 z-0"
            unoptimized={true}
          />
          <div className="relative z-10">
            <section id="about" className="py-20 px-6 max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-extrabold mb-8 relative">
                About Me
                <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-red-500 rounded-full"></span>
              </h2>
              <div className="backdrop-blur-md p-8 rounded-2xl shadow-xl border border-gray-700">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="flex flex-col items-center justify-center gap-4"
                >
                  <Image
                    src="/P.jfif"
                    alt="Robby Fabian's Profile"
                    width={150}
                    height={150}
                    className="rounded-full border-4 border-white shadow-lg shadow-white/40 transition-all duration-300 hover:shadow-xl hover:shadow-white/60 hover:scale-105"
                  />
                  <h3 className="text-3xl font-bold flex items-center gap-2">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={names[currentNameIndex]}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                      >
                        {names[currentNameIndex]}
                      </motion.span>
                    </AnimatePresence>
                    <FaCheckCircle className="text-blue-500 text-xl" />
                  </h3>
                  {/* [FIX 1] Mengganti ' dengan &apos; */}
                  <p className="text-gray-300 max-w-prose">
                    I&apos;m a designer and developer specializing in designing digital experiences from concept to implementation. My creative journey began in graphic design, where I honed my aesthetics, visual composition, and strong branding.
                  </p>
                </motion.div>
              </div>
            </section>
            
            <section id="galeri" className="max-w-7xl mx-auto px-6 py-16 bg-transparent">
             <h2 className="text-4xl font-extrabold mb-12 relative text-center">
                My Work
                <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-red-500 rounded-full"></span>
              </h2>
              <div className="flex flex-wrap justify-center gap-6 mb-10">
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`relative px-4 py-2 transition-colors ${
                      activeCategory === cat.name ? "text-red-500 font-bold" : "hover:text-red-400"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
              <div className="flex justify-center mb-10">
                <input
                  type="text"
                  placeholder="Search designs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-600 bg-transparent focus:outline-none"
                />
              </div>

              <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
              >
                {filteredGallery.map((item) => (
                  <div key={item.id}>
                    <Tilt glareEnable={true} glareColor="rgba(255,255,255,0.1)" tiltMaxAngleX={10} tiltMaxAngleY={10}>
                      <motion.div
                        className="group relative rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-white/20"
                      >
                        <Image 
                          src={item.image} 
                          alt={item.title} 
                          width={400} 
                          height={300} 
                          className="object-cover w-full h-auto transition-transform duration-500 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-4">
                          <h3 className="text-lg font-bold text-white">{item.title}</h3>
                          <p className="text-sm text-gray-300 mt-1">{item.description}</p>
                        </div>
                      </motion.div>
                    </Tilt>
                  </div>
                ))}
              </Masonry>
            </section>

            <footer id="kontak" className="relative py-6 text-center text-gray-300 mx-4 md:mx-auto max-w-4xl mb-6 rounded-2xl border border-white/20 backdrop-blur-lg">
             <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-2xl mb-2">
                <a href="https://www.instagram.com/mikoograph_?igsh=cWN0eTc1MzF6Y3dn" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-colors"><FaInstagram /></a>
                <a href="https://www.linkedin.com/in/robby-fabian-4b9564341?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors"><FaLinkedin /></a>
                <a href="https://www.behance.net/rrqfabian" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors"><FaBehance /></a>
              </div>
              <p className="text-sm opacity-70">© {new Date().getFullYear()} Robby Fabian. All rights reserved.</p>
            </footer>
          </div>
        </main>

        <AnimatePresence>
          {showTop && (
            <motion.button
              onClick={scrollToTop}
              className="fixed bottom-24 right-6 w-14 h-14 border border-white/20 backdrop-blur-md text-white rounded-full shadow-lg z-40 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <motion.div
                animate={{ y: [-2, 2, -2], }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              >
                <FaArrowUp size={20}/>
              </motion.div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      
      <div className="scanline-overlay"></div>
    </div>
  )
}