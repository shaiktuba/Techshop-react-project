import React from 'react';
import servicesData from '../data/servicesData';

const Advantages = () => {
  return (
    <section className="py-16 bg-[#0a0b0f] border-b border-white/5 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
       
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Our Advantages
          </h2>
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {servicesData.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/[0.02] transition-colors"
            >
              <div className="text-red-600 text-3xl flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-400 mt-0.5">
                  {item.info}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Advantages;
