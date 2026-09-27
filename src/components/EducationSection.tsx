import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import { EDUCATIONAL_ARTICLES } from '../data/education';
import { useEcommerce } from '../context/EcommerceContext';
import { EditorialOutlineRing } from './DecorativeElements';

export const EducationSection: React.FC = () => {
  const { openArticle } = useEcommerce();

  return (
    <section className="relative py-12 lg:py-20 bg-[#FAF8F3] border-b border-[#E5DED2] overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with one small outline ring + thin line combination */}
        <div className="relative text-center max-w-2xl mx-auto mb-12">
          <div
            aria-hidden="true"
            className="hidden sm:flex items-center pointer-events-none select-none absolute -top-4 right-8 lg:right-4 z-0"
          >
            <span
              className="w-10 h-[1px] bg-[#B7AEA2] inline-block -mr-3"
              style={{ opacity: 0.25 }}
            />
            <EditorialOutlineRing size={48} color="#B08D57" opacity={0.15} />
          </div>

          <div className="relative z-10 inline-flex items-center gap-3 mb-2 justify-center">
            <span
              aria-hidden="true"
              className="w-7 h-[1px] bg-[#B08D57] inline-block"
              style={{ opacity: 0.26 }}
            />
            <span className="font-eyebrow">
              Gemstone Guide
            </span>
            <span
              aria-hidden="true"
              className="w-7 h-[1px] bg-[#B08D57] inline-block"
              style={{ opacity: 0.26 }}
            />
          </div>
          <h2 className="relative z-10 font-h2 text-[#121212]">
            Learn About Gemstones
          </h2>
          <p className="relative z-10 font-body-small text-[#5A544A] mt-2.5 max-reading-section mx-auto">
            Simple, practical guides to help you understand gemstone types, natural inclusions
            (natural internal features formed inside the stone), cuts, and care.
          </p>
        </div>

        {/* 5 Educational Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EDUCATIONAL_ARTICLES.slice(0, 3).map((article) => (
            <div
              key={article.id}
              onClick={() => openArticle(article)}
              className="group bg-white rounded-2xl border border-[#E5DED2] overflow-hidden shadow-xs hover:shadow-md hover:border-[#B08D57]/70 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="aspect-[16/10] overflow-hidden bg-[#F3EFE8]">
                <img
                  src={article.heroImage}
                  alt={article.title}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              <div className="p-5 flex flex-col justify-between flex-grow">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-sans font-medium uppercase tracking-[0.12em] text-[#B08D57] mb-1">
                    <span>{article.gemstone}</span>
                    <span className="flex items-center gap-1 text-[#716B60] lowercase font-normal">
                      <Clock className="w-3 h-3" />
                      {article.readingTime}
                    </span>
                  </div>

                  <h3 className="font-serif text-[19px] font-medium text-[#121212] group-hover:text-[#B08D57] transition-colors mb-2 leading-snug">
                    {article.title}
                  </h3>

                  <p className="font-sans text-[13px] text-[#716B60] font-normal line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#E5DED2] flex items-center justify-between text-xs font-sans font-medium text-[#121212] group-hover:text-[#B08D57] transition-colors">
                  <span className="tracking-wider uppercase text-[11px]">Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          ))}

          {/* Bottom 2 Guides spanned across */}
          {EDUCATIONAL_ARTICLES.slice(3).map((article) => (
            <div
              key={article.id}
              onClick={() => openArticle(article)}
              className="group bg-white rounded-2xl border border-[#E5DED2] overflow-hidden shadow-xs hover:shadow-md hover:border-[#B08D57]/70 transition-all duration-300 cursor-pointer flex flex-col justify-between md:last:col-span-2 lg:last:col-span-1"
            >
              <div className="aspect-[16/10] overflow-hidden bg-[#F3EFE8]">
                <img
                  src={article.heroImage}
                  alt={article.title}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              <div className="p-5 flex flex-col justify-between flex-grow">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-sans font-medium uppercase tracking-[0.12em] text-[#B08D57] mb-1">
                    <span>{article.gemstone}</span>
                    <span className="flex items-center gap-1 text-[#716B60] lowercase font-normal">
                      <Clock className="w-3 h-3" />
                      {article.readingTime}
                    </span>
                  </div>

                  <h3 className="font-serif text-[19px] font-medium text-[#121212] group-hover:text-[#B08D57] transition-colors mb-2 leading-snug">
                    {article.title}
                  </h3>

                  <p className="font-sans text-[13px] text-[#716B60] font-normal line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#E5DED2] flex items-center justify-between text-xs font-sans font-medium text-[#121212] group-hover:text-[#B08D57] transition-colors">
                  <span className="tracking-wider uppercase text-[11px]">Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
