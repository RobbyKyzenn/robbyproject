"use client"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import dynamic from 'next/dynamic';
import { FaMoon, FaSun, FaArrowUp, FaInstagram, FaLinkedin, FaBehance, FaGithub, FaCheckCircle, FaPlay, FaPause } from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"
import Tilt from "react-parallax-tilt"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import atomDark from 'react-syntax-highlighter/dist/esm/styles/prism/atom-dark';

const Masonry = dynamic(() => import('react-masonry-css'), { ssr: false });
const MotionImage = motion(Image);

const BackgroundMusic = ({ src }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const playClickSound = () => { new Audio('/click-sound.mp3').play().catch(e => console.error("SFX Error", e)) };


  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!audioRef.current) {
        audioRef.current = new Audio(src);
        audioRef.current.loop = true;
      }
    }
  }, [src]);

  const togglePlayPause = () => {
    playClickSound();
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error("Audio play failed:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <button
      onClick={togglePlayPause}
      className="fixed bottom-6 left-6 z-50 w-12 h-12 flex items-center justify-center bg-neutral-800/50 text-white rounded-full backdrop-blur-md border border-white/20 hover:bg-neutral-700/70 transition-colors"
      aria-label={isPlaying ? "Pause music" : "Play music"}
    >
      {isPlaying ? <FaPause size={18} /> : <FaPlay size={18} />}
    </button>
  );
};

const TextScramble = ({ text }) => {
  const [displayText, setDisplayText] = useState("");
  const chars = "エンジニアプログラマーデザ";
  const frameRequestRef = useRef();
  const frameRef = useRef(0);
  const queueRef = useRef([]);

  // ===== PERBAIKAN ESLINT WARNING DI SINI =====
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const oldText = displayText;
    const newText = text;
    frameRef.current = 0;
    queueRef.current = [];
    const maxLength = Math.max(oldText.length, newText.length);
    for (let i = 0; i < maxLength; i++) {
      const from = oldText[i] || "";
      const to = newText[i] || "";
      const start = Math.floor(Math.random() * 80);
      const end = start + Math.floor(Math.random() * 80);
      queueRef.current.push({ from, to, start, end });
    }
    cancelAnimationFrame(frameRequestRef.current);
    const animate = () => {
      let output = "";
      let completed = 0;
      for (let i = 0; i < queueRef.current.length; i++) {
        const { from, to, start, end } = queueRef.current[i];
        if (frameRef.current >= end) {
          completed++;
          output += to;
        } else if (frameRef.current >= start) {
          output += chars[Math.floor(Math.random() * chars.length)];
        } else {
          output += from;
        }
      }
      setDisplayText(output);
      if (completed !== queueRef.current.length) {
        frameRef.current++;
        frameRequestRef.current = requestAnimationFrame(animate);
      }
    };
    frameRequestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRequestRef.current);
  }, [text]);

  return <span>{displayText}</span>;
};

const ProjectCodeCard = ({ image, title, description, code, onCardClick }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const handleClick = () => {
    if (onCardClick) onCardClick();
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="w-full h-64 [perspective:1000px] cursor-pointer group" onClick={handleClick}>
      <motion.div
        className="relative w-full h-full text-center [transform-style:preserve-3d] transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-xl group-hover:shadow-white/20"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      >
        <div className="absolute w-full h-full [backface-visibility:hidden] rounded-2xl overflow-hidden border border-white/20 shadow-lg">
          <Image src={image} alt={title} layout="fill" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-4">
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-gray-300 text-sm font-sans">{description}</p>
          </div>
        </div>
        <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-[#282c34] rounded-2xl overflow-hidden border border-white/20 shadow-lg">
          <SyntaxHighlighter language="javascript" style={atomDark} customStyle={{ margin: 0, height: '100%', fontSize: '12px' }} codeTagProps={{style: {fontFamily: 'var(--font-pixel)'}}}>
            {code}
          </SyntaxHighlighter>
        </div>
      </motion.div>
    </div>
  );
};

const TypingEffect = ({ titles, typeSpeed = 100, deleteSpeed = 50, delay = 2000 }) => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  
  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % titles.length;
      const fullText = titles[i];

      setText(currentText => 
        isDeleting 
          ? fullText.substring(0, currentText.length - 1) 
          : fullText.substring(0, currentText.length + 1)
      );

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), delay);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const ticker = setTimeout(handleTyping, isDeleting ? deleteSpeed : typeSpeed);
    return () => clearTimeout(ticker);
  }, [text, isDeleting, loopNum, titles, typeSpeed, deleteSpeed, delay]);

  return (
    <span className="relative border-r-2 border-white pr-1 animate-pulse">
      {text}&nbsp;
    </span>
  );
};

const rotatingTitles = ["UI/UX Designer", "Sport Designer", "GFX Designer", "Illustrator"];
const namesToScramble = ["Mikoo Katsu", "Robby Fabian"];
const categories = [{ name: "All" }, { name: "Sport" }, { name: "Illustration" }, { name: "GFX" }, { name: "Poster" }];
const initialGallery = [
    { id: 1, category: "Sport", title: "Paris Saint Germain", description: "PSG Poster Design.", image: "/design1.webp" },
    { id: 2, category: "Sport", title: "Liverpool FC", description: "Liverpool Poster Design.", image: "/design2.webp" },
    { id: 3, category: "Sport", title: "Kylian Mbappe", description: "Kylian Mbappe Real Madrid Player.", image: "/design3.webp" },
    { id: 4, category: "Poster", title: "HuoHuo", description: "FanDesign HuoHuo From HSR.", image: "/design4.webp" },
    { id: 5, category: "Poster", title: "Acheron", description: "FanDesign Acheron From HSR.", image: "/design5.webp" },
    { id: 6, category: "Poster", title: "Shorekeeper", description: "FanDesign Shorekeeper From Wuthering Waves.", image: "/design6.webp" },
];
const projectCodeData = [
  { id: 1, title: "Photo Gallery", description: "Website that stores photos of football.", image: "/Project1.webp", code: `import { motion } from 'photo gallery';\n\nfunction FootballCard() {\n  return (\n    <motion.div\n      initial={{ opacity: 0, y: 50 }}\n      animate={{ opacity: 1, y: 0 }}\n      transition={{ duration: 0.5 }}\n    >\n      <h2>My Project</h2>\n    </motion.div>\n  );\n}` },
  { id: 2, title: "Restaurant Cashier", description: "Restaurant cashier system application website with PHP.", image: "/Project2.webp", code: `import { Bar } from 'kasir-resto';\n\nconst kasirResto = {\n  labels: ['Jan', 'Feb', 'Mar'],\n  datasets: [{\n    label: 'Sales',\n    data: [120, 190, 150],\n    backgroundColor: 'rgba(75, 192, 192, 0.6)',\n  }],\n};\n\nfunction SalesChart() {\n  return <Bar data={salesData} />;\n}` },
];

export default function Home() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [gallery, setGallery] = useState(initialGallery);
    const [searchTerm, setSearchTerm] = useState("");
    const [darkMode, setDarkMode] = useState(true);
    const [scrolled, setScrolled] = useState(false);
    const [showTop, setShowTop] = useState(false);
    const [nameIndex, setNameIndex] = useState(0);
    const [isProfileFlipped, setIsProfileFlipped] = useState(false);
    const profileImages = ["/p.jfif", "/elen.jfif"];
    const playClickSound = () => { new Audio('/click-sound.mp3').play().catch(error => { console.error("Click sound play failed:", error); }); };

    const scrambleDuration = 1500;
    const displayDuration = 2500;
    const pauseDuration = 1500;
    const totalNameCycle = scrambleDuration + displayDuration + pauseDuration;

    useEffect(() => {
        const handleScroll = () => { setScrolled(window.scrollY > 50); setShowTop(window.scrollY > 300); };
        window.addEventListener("scroll", handleScroll);
        
        // HAPUS INTERVAL UNTUK titleIndex
        // const titleInterval = setInterval(() => { setTitleIndex((prev) => (prev + 1) % rotatingTitles.length); }, 3000);
        
        const nameInterval = setInterval(() => { setNameIndex((prevIndex) => (prevIndex + 1) % namesToScramble.length); }, totalNameCycle); 
        return () => { window.removeEventListener("scroll", handleScroll); /*clearInterval(titleInterval);*/ clearInterval(nameInterval); };
    }, [totalNameCycle]);

    useEffect(() => {
        const profileFlipInterval = setInterval(() => { setIsProfileFlipped(prev => !prev); }, 3500);
        return () => clearInterval(profileFlipInterval);
    }, []);

    const filteredGallery = gallery.filter((item) => (activeCategory === "All" || item.category === activeCategory) && item.title.toLowerCase().includes(searchTerm.toLowerCase()));
    const scrollToTop = () => { window.scrollTo({ top: 0, behavior: "smooth" }); };
    const breakpointColumnsObj = { default: 3, 1100: 2, 700: 1 };
    const sectionAnimation = { initial: { opacity: 0, y: 50 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: false, amount: 0.2 }, transition: { duration: 0.8, ease: "easeOut" } };

    return (
        <div className="font-pixel text-sm text-white min-h-screen">
            <BackgroundMusic src="/arcade.mp3" />
            <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"><div className="glow-overlay"></div></div>
            <motion.nav
                initial={{ top: 0, left: 0, width: "100%", borderRadius: 0, backgroundColor: darkMode ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.3)" }}
                animate={{ top: scrolled ? 24 : 0, left: scrolled ? "50%" : 0, width: scrolled ? "80%" : "100%", borderRadius: scrolled ? "1rem" : 0, x: scrolled ? "-50%" : 0, backgroundColor: darkMode ? (scrolled ? "rgba(0,0,0,0.3)" : "transparent") : (scrolled ? "rgba(255,255,255,0.3)" : "transparent"), boxShadow: scrolled ? "0 10px 25px rgba(0,0,0,0.2)" : "none" }}
                whileHover={{ y: scrolled ? -4 : -2, boxShadow: scrolled ? "0 15px 35px rgba(0,0,0,0.3)" : "0 8px 20px rgba(0,0,0,0.1)", backdropFilter: scrolled ? "blur(15px)" : "blur(10px)" }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="fixed z-50 py-3 px-6 backdrop-blur-lg cursor-pointer"
            >
                <div className="flex items-center justify-between max-w-6xl mx-auto">
                    <motion.div animate={{ y: [-3, 3, -3] }} transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}><Image src="/icon3.webp" alt="Robby Logo" width={130} height={130} className="logo-glow" /></motion.div>
                    <div className="flex items-center gap-6 font-medium">
                        <a href="#hero" className="hover:text-red-400 transition-colors">Home</a>
                        <a href="#about" className="hover:text-red-400 transition-colors">About</a>
                        <a href="#galeri" className="hover:text-red-400 transition-colors">Gallery</a>
                        <a href="#project" className="hover:text-red-400 transition-colors">Project</a>
                        <a href="#kontak" className="hover:text-red-400 transition-colors">Contact</a>
                        <button onClick={() => { playClickSound(); setDarkMode(!darkMode); }} className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 transition">{darkMode ? <FaSun /> : <FaMoon />}</button>
                    </div>
                </div>
            </motion.nav>

            <section id="hero" className="relative h-screen flex flex-col items-center justify-center text-center overflow-hidden">
                <MotionImage src="/Mwe.webp" alt="Hero Background" fill className="absolute inset-0 object-cover opacity-40 z-0" unoptimized={true} />
                <div className="relative z-20 px-4">
                    <motion.div initial={{ scale: 0.5, opacity: 0, y: 0 }} animate={{ scale: 1, opacity: 1, y: [-5, 5, -5] }} transition={{ scale: { duration: 0.7, ease: "easeOut" }, opacity: { duration: 0.7, ease: "easeOut" }, y: { duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" } }}>
                        <Image src="/icon3.webp" alt="Robby Logo" width={500} height={150} className="logo-glow" />
                    </motion.div>
                    
                    <div className="mt-4 text-2xl md:text-3xl min-h-[40px] md:min-h-[48px]">
                        <TypingEffect titles={rotatingTitles} />
                    </div>

                </div>
            </section>

            <main className="relative">
                <MotionImage src="/Mowe.gif" alt="Content background" fill className="absolute inset-0 object-cover opacity-40 z-0" unoptimized={true} />
                <div className="relative z-10">
                    <motion.section id="about" className="py-20 px-6 max-w-4xl mx-auto text-center" {...sectionAnimation}>
                        <h2 className="text-4xl font-extrabold mb-8 relative">About Me<span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-red-500 rounded-full"></span></h2>
                        <div className="backdrop-blur-md p-8 rounded-2xl shadow-xl border border-gray-700">
                            <div className="flex flex-col items-center justify-center gap-4">
                                <div className="w-[150px] h-[150px] [perspective:1000px]">
                                    <motion.div
                                        className="relative w-full h-full [transform-style:preserve-3d]"
                                        animate={{ rotateY: isProfileFlipped ? 180 : 0 }}
                                        transition={{ duration: 0.8, ease: "easeInOut" }}
                                    >
                                        <div className="absolute w-full h-full [backface-visibility:hidden] rounded-full border-4 border-white shadow-lg shadow-white/40">
                                            <Image src={profileImages[0]} alt="Robby Fabian's Profile" width={150} height={150} className="rounded-full object-cover" />
                                        </div>
                                        <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-full border-4 border-white shadow-lg shadow-white/40">
                                            <Image src={profileImages[1]} alt="Robby Fabian's Profile 2" width={150} height={150} className="rounded-full object-cover" />
                                        </div>
                                    </motion.div>
                                </div>
                                
                                <h3 className="text-3xl font-bold flex items-center gap-2 min-h-[40px]">
                                    <TextScramble key={nameIndex} text={namesToScramble[nameIndex]} />
                                    <AnimatePresence>
                                        <motion.div key={"check-" + nameIndex} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1, transition: { type: "spring", stiffness: 260, damping: 20, delay: scrambleDuration / 1000 + 0.2 } }} exit={{ scale: 0, opacity: 0 }}>
                                            <FaCheckCircle className="text-blue-500 text-xl" />
                                        </motion.div>
                                    </AnimatePresence>
                                </h3>
                                {/* ===== PERBAIKAN ESLINT ERROR DI SINI ===== */}
                                <p className="text-gray-300 max-w-prose font-sans">I&apos;m a designer and developer specializing in designing digital experiences from concept to implementation. My creative journey began in graphic design, where I honed my aesthetics, visual composition, and strong branding.</p>
                            </div>
                        </div>
                    </motion.section>
                    
                    <motion.section id="galeri" className="max-w-7xl mx-auto px-6 py-16 bg-transparent" {...sectionAnimation}>
                        <h2 className="text-4xl font-extrabold mb-12 relative text-center">My Work<span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-red-500 rounded-full"></span></h2>
                        <div className="flex flex-wrap justify-center gap-6 mb-10">
                            {categories.map((cat) => (
                                <button key={cat.name} onClick={() => { playClickSound(); setActiveCategory(cat.name); }} className={`relative px-4 py-2 transition-colors ${activeCategory === cat.name ? "text-red-500 font-bold" : "hover:text-red-400"}`}>{cat.name}</button>
                            ))}
                        </div>
                        <div className="flex justify-center mb-10"><input type="text" placeholder="Search designs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="px-4 py-2 rounded-lg border border-gray-600 bg-transparent focus:outline-none" /></div>
                        <Masonry breakpointCols={breakpointColumnsObj} className="my-masonry-grid" columnClassName="my-masonry-grid_column">
                            {filteredGallery.map((item) => (<div key={item.id}><Tilt glareEnable={true} glareColor="rgba(255,255,255,0.1)" tiltMaxAngleX={10} tiltMaxAngleY={10}><motion.div className="group relative rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-white/20"><Image src={item.image} alt={item.title} width={400} height={300} className="object-cover w-full h-auto transition-transform duration-500 group-hover:scale-110" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div><div className="absolute bottom-0 left-0 p-4"><h3 className="text-lg font-bold text-white">{item.title}</h3><p className="text-sm text-gray-300 mt-1 font-sans">{item.description}</p></div></motion.div></Tilt></div>))}
                        </Masonry>
                    </motion.section>

                    <motion.section id="project" className="max-w-7xl mx-auto px-6 py-16 bg-transparent" {...sectionAnimation}>
                        <h2 className="text-4xl font-extrabold mb-12 relative text-center">Project<span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-red-500 rounded-full"></span></h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg-gap-12">
                            {projectCodeData.map(project => (<ProjectCodeCard key={project.id} title={project.title} description={project.description} image={project.image} code={project.code} onCardClick={playClickSound} />))}
                        </div>
                    </motion.section>

                    <motion.footer id="kontak" className="relative py-6 text-center text-gray-300 mx-4 md:mx-auto max-w-4xl mb-6 rounded-2xl border border-white/20 backdrop-blur-lg" {...sectionAnimation}>
                        <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-2xl mb-2">
                            <a href="https://www.instagram.com/mikoograph_?igsh=cWN0eTc1MzF6Y3dn" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-colors"><FaInstagram /></a>
                            <a href="https://www.linkedin.com/in/robby-fabian-4b9564341" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors"><FaLinkedin /></a>
                            <a href="https://www.behance.net/rrqfabian" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors"><FaBehance /></a>
                            <a href="https://github.com/RobbyKyzenn" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><FaGithub /></a>
                        </div>
                        <p className="text-sm opacity-70 font-sans">© 2025 Robby Fabian. All rights reserved.</p>
                    </motion.footer>
                </div>
            </main>

            <AnimatePresence>
                {showTop && (<motion.button onClick={() => { playClickSound(); scrollToTop(); }} className="fixed bottom-24 right-6 w-14 h-14 border border-white/20 backdrop-blur-md text-white rounded-full shadow-lg z-40 flex items-center justify-center hover:bg-white/20 transition-colors" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                    <motion.div animate={{ y: [-2, 2, -2] }} transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}><FaArrowUp size={20} /></motion.div>
                </motion.button>)}
            </AnimatePresence>

            <div className="scanline-overlay"></div>
        </div>
    );
}