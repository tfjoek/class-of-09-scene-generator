import Image from "next/image";
import "./globals.css";

export default function Home() {
  return (
    <main className="min-h-screen bg-black overflow-hidden flex items-end justify-center relative">
      {/* Top UI bar */}
      <div className="fixed top-0 left-0 w-full z-30 flex justify-center py-3 px-4 backdrop-blur-md bg-black/40 border-b border-white/10">
        <div className="flex gap-2 items-center">
          <button className="px-5 py-2 rounded-lg bg-black/60 hover:bg-black/80 border border-white/20 shadow text-white text-lg transition-all duration-150" style={{ fontFamily: 'CMHandwritingOne' }}>
            Character
          </button>
          <span className="h-7 w-px bg-white/30 mx-1" />
          <button className="px-5 py-2 rounded-lg bg-black/60 hover:bg-black/80 border border-white/20 shadow text-white text-lg transition-all duration-150" style={{ fontFamily: 'CMHandwritingOne' }}>
            Background
          </button>
          <span className="h-7 w-px bg-white/30 mx-1" />
          <button className="px-5 py-2 rounded-lg bg-black/60 hover:bg-black/80 border border-white/20 shadow text-white text-lg transition-all duration-150" style={{ fontFamily: 'CMHandwritingOne' }}>
            Dialogue
          </button>
          <span className="h-7 w-px bg-white/30 mx-1" />
          <button className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 border border-blue-400 shadow text-white text-lg transition-all duration-150" style={{ fontFamily: 'CMHandwritingOne' }}>
            Start Scene
          </button>
        </div>
      </div>
      {/* Default background image */}
      <Image
        src="/backgrounds/classroom_int_3.jpg"
        alt="Background"
        fill
        className="object-cover z-0"
        priority
        unoptimized
      />
      {/* Name above the textbox, left-aligned with the dialogue */}
      <div className="fixed left-1/2 -translate-x-1/2" style={{ bottom: 'calc(13vw + -20px)', width: '87vw', zIndex: 20 }}>
        <div className="pl-[10vw]">
          <span
            className="text-[#34a0e0]"
            style={{
              fontFamily: 'HelveticaCompressed',
              fontWeight: 400,
              fontSize: '3.8vw',
              textShadow: '1px 1px 0 #000',
              letterSpacing: '0.6px',
              lineHeight: 1,
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
            }}
          >
            Nicole
          </span>
        </div>
      </div>
      {/* Text box and dialogue */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[87vw] z-10">
        <Image
          src="/textbox.png"
          alt="Textbox"
          width={1700}
          height={260}
          className="select-none w-full h-auto object-contain"
          priority
          unoptimized
        />
        {/* Dialogue text inside the box, left-aligned with the name */}
        <div className="absolute inset-0 flex flex-col justify-start pt-[7px] pl-[10.2vw] pr-[13vw]">
          <span
            className="text-black mt-1"
            style={{
              fontFamily: 'CMHandwritingOne',
              fontSize: '2.6vw',
              lineHeight: 1.1,
              letterSpacing: '0.4px',
            }}
          >
            That's hot, you're like Avril Lavigne if she never got famous.
          </span>
        </div>
      </div>
    </main>
  );
}
