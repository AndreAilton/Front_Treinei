import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";

const TestimonialCarousel = ({ testimonialsData }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);

  // --- LÓGICA DE RESPONSIVIDADE ---
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerPage(3); // Desktop: 3 cards
      } else if (window.innerWidth >= 768) {
        setItemsPerPage(2); // Tablet: 2 cards
      } else {
        setItemsPerPage(1); // Mobile: 1 card
      }
    };

    // Executa na montagem e adiciona o listener
    handleResize();
    window.addEventListener("resize", handleResize);

    // Limpeza
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Recalcula total de páginas sempre que os dados ou itens por página mudarem
  const totalPages = Math.ceil(testimonialsData.length / itemsPerPage);

  // Reseta para a página 0 se mudar o tamanho da tela para evitar bugs visuais
  useEffect(() => {
    setCurrentPage(0);
  }, [itemsPerPage]);

  const nextSlide = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 md:px-0">
      
      {/* Botões de Navegação (Agora visíveis no Mobile também, mas ajustados) */}
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 md:p-3 rounded-full shadow-lg text-gray-600 hover:text-blue-600 border border-gray-100 -ml-2 md:-ml-12"
      >
        <ChevronLeft size={20} className="md:w-6 md:h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 md:p-3 rounded-full shadow-lg text-gray-600 hover:text-blue-600 border border-gray-100 -mr-2 md:-mr-12"
      >
        <ChevronRight size={20} className="md:w-6 md:h-6" />
      </button>

      {/* Área do Slider */}
      <div className="overflow-hidden py-4">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${currentPage * 100}%)`,
          }}
        >
          {/* CRIAÇÃO DOS GRUPOS (PÁGINAS) */}
          {[...Array(totalPages)].map((_, pageIndex) => (
            <div key={pageIndex} className="w-full flex-shrink-0 flex gap-4 md:gap-0 justify-center">
              {testimonialsData
                .slice(
                  pageIndex * itemsPerPage,
                  pageIndex * itemsPerPage + itemsPerPage
                )
                .map((t, idx) => (
                  <div
                    key={idx}
                    // IMPORTANTE: A largura aqui deve ser controlada pelo Flexbox para preencher o espaço do grupo
                    className={`flex-1 px-2 ${
                      itemsPerPage === 1 ? "w-full" : 
                      itemsPerPage === 2 ? "w-1/2" : 
                      "w-1/3"
                    }`}
                  >
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 h-full flex flex-col relative group">
                      
                      {/* Ícone Decorativo (Escondido em telas muito pequenas para limpar a visão) */}
                      <div className="absolute top-6 right-6 text-gray-100 group-hover:text-blue-50 transition-colors hidden sm:block">
                        <Quote size={40} fill="currentColor" />
                      </div>

                      {/* Estrelas */}
                      <div className="flex gap-1 text-yellow-400 mb-4">
                        {[...Array(t.stars)].map((_, i) => (
                          <Star key={i} size={16} fill="currentColor" />
                        ))}
                      </div>

                      {/* Texto */}
                      <p className="text-gray-600 mb-6 italic flex-grow relative z-10 text-sm md:text-base">
                        "{t.text}"
                      </p>

                      {/* Rodapé */}
                      <div className="border-t border-gray-100 pt-4 mt-auto">
                        <p className="font-bold text-gray-900">{t.name}</p>
                        <p className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                          {t.role}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>

      {/* Indicadores (Bolinhas) - Essencial para UX Mobile */}
      <div className="flex justify-center gap-2 mt-4">
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPage(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentPage === idx ? "w-6 bg-blue-600" : "w-2 bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialCarousel;