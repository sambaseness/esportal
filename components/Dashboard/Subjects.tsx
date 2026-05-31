
import React, { useState, useMemo } from 'react';
import { DEFAULT_SUBJECTS } from '../../constants.tsx';

interface SubjectsProps {
  onSubjectClick: (id: string) => void;
}

type Category = 'All' | 'Communication' | 'Mathematiques' | 'Signaux' | 'Physique' | 'Autres';

const Subjects: React.FC<SubjectsProps> = ({ onSubjectClick }) => {
  const [activeCategory, setActiveCategory] = useState<Category>('All');

  const categories: Category[] = ['All', 'Communication', 'Mathematiques', 'Signaux', 'Physique', 'Autres'];

  const categoryMapping: Record<string, Category> = {
    'TRD': 'Communication',
    'ENG': 'Communication',
    'MATH-ANA': 'Mathematiques',
    'MATH-ALG': 'Mathematiques',
    'MATH-SIG': 'Signaux',
    'SIG-SYS': 'Signaux',
    'PHYS': 'Physique',
    'OAC': 'Physique',
  };

  const filteredSubjects = useMemo(() => {
    if (activeCategory === 'All') return DEFAULT_SUBJECTS;
    
    return DEFAULT_SUBJECTS.filter(subject => {
      const cat = categoryMapping[subject.code] || 'Autres';
      return cat === activeCategory;
    });
  }, [activeCategory]);

  return (
    <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom duration-700">
      {/* Header & Filter Bar */}
      <div className="space-y-8">
        <div className="flex flex-col space-y-2">
          <h2 className="text-sm font-black text-slate-600 uppercase tracking-[0.5em]">Academic Catalog</h2>
          <p className="text-white text-3xl font-black tracking-tight uppercase">Subjects & Modules</p>
        </div>

        <div className="flex items-center space-x-3 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 rounded-2xl whitespace-nowrap font-black uppercase tracking-widest text-[10px] transition-all border ${
                activeCategory === cat 
                  ? 'bg-brand-600 border-brand-500 text-white shadow-lg shadow-indigo-900/40' 
                  : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredSubjects.map((subject) => (
          <div 
            key={subject.id}
            onClick={() => onSubjectClick(subject.id)}
            className="group relative flex flex-col bg-slate-900 rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-950/20 animate-in fade-in zoom-in-95"
          >
            {/* Header Section (The "Hero" Area) */}
            <div className="relative h-44 w-full overflow-hidden">
              {subject.image_url ? (
                <img 
                  src={subject.image_url} 
                  alt={subject.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-slate-800"></div>
              )}
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent"></div>
              
              {/* Bottom-Anchored Title */}
              <div className="absolute bottom-4 left-6 right-6">
                <h3 className="text-xl font-black text-white leading-tight uppercase tracking-tight line-clamp-2">
                  {subject.name}
                </h3>
              </div>
            </div>

            {/* Footer Section (The "Metadata" Area) */}
            <div className="p-6 bg-slate-900 border-x border-b border-slate-800 rounded-b-3xl flex-1 flex flex-col">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                  {subject.code}
                </span>
                
                {/* Category Badge */}
                <div className="flex space-x-1">
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-500 text-[8px] font-black uppercase tracking-tighter">
                    {categoryMapping[subject.code] || 'Autres'}
                  </span>
                </div>
              </div>

              {/* Functional Indicator */}
              <div className="mt-auto pt-4 flex items-center justify-between">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[10px] text-indigo-400">description</span>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[10px] text-emerald-400">task_alt</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-700 group-hover:text-indigo-400 transition-colors text-lg">
                  arrow_forward
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {filteredSubjects.length === 0 && (
          <div className="col-span-full py-32 text-center border-2 border-dashed border-slate-900 rounded-[3rem]">
            <span className="material-symbols-outlined text-5xl text-slate-800 mb-4">book</span>
            <p className="text-slate-700 font-black uppercase tracking-widest text-xs">Aucune matière dans cette catégorie</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Subjects;
