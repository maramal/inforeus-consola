"use client"
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
            <div className="text-center">
                <h1 className="text-6xl font-bold glitch" data-text="404">404</h1>
                <p className="text-xl mb-4 glitch-delay" data-text="Página no encontrada">Página no encontrada</p>
                <Link
                    href="/"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Ir al inicio
                </Link>
            </div>
            <style jsx global>{`
        /* Efecto glitch para el 404 y el mensaje */
        .glitch {
          position: relative;
          animation: glitch 1s infinite;
        }
        .glitch:before,
        .glitch:after {
          content: attr(data-text);
          position: absolute;
          left: 50px;
          top: 0;
          opacity: 0.8;
          clip: rect(0, 900px, 0, 0);
        }
        .glitch:before {
          animation: glitchTop 1s infinite;
          color: #f0f;
        }
        .glitch:after {
          animation: glitchBottom 1s infinite;
          color: #0ff;
        }
        @keyframes glitch {
          0% { transform: none; }
          20% { transform: translate(2px, -2px); }
          40% { transform: translate(-2px, 2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(-2px, -2px); }
          100% { transform: none; }
        }
        @keyframes glitchTop {
          0% { clip: rect(42px, 9999px, 44px, 0); }
          50% { clip: rect(12px, 9999px, 14px, 0); }
          100% { clip: rect(42px, 9999px, 44px, 0); }
        }
        @keyframes glitchBottom {
          0% { clip: rect(85px, 9999px, 90px, 0); }
          50% { clip: rect(45px, 9999px, 50px, 0); }
          100% { clip: rect(85px, 9999px, 90px, 0); }
        }
        .glitch-delay {
          animation-delay: 0.5s;
        }
        /* Animación de parpadeo para el canal */
        .flicker {
          animation: flicker 3s infinite;
        }
        @keyframes flicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 0.99; }
          20%, 24%, 55% { opacity: 0.4; }
        }
        /* Animación de "static" para simular interferencia */
        .static {
          animation: staticAnim 2s infinite;
        }
        @keyframes staticAnim {
          0% { filter: brightness(1); }
          50% { filter: brightness(0.8); }
          100% { filter: brightness(1); }
        }
      `}</style>
        </div>
    );
}
