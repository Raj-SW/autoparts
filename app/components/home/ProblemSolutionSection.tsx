'use client';

import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { CONTACT_INFO } from '@/lib/constants';

interface Problem {
  title: string;
  description: string;
}

interface Solution {
  title: string;
  description: string;
}

const PROBLEMS: Problem[] = [
  {
    title: 'Take 1-2 weeks for quotes',
    description: 'Your car sits broken while they "check availability"',
  },
  {
    title: 'Sell fake or used parts',
    description: 'Parts fail after few months, costing you more',
  },
  {
    title: 'Charge dealer prices',
    description: 'You pay 50% more than necessary',
  },
  {
    title: 'No guarantee on fitment',
    description: 'Wrong parts? "Not our problem"',
  },
];

const SOLUTIONS: Solution[] = [
  {
    title: '1-hour quote guarantee',
    description: 'Get back on the road TODAY, not next week',
  },
  {
    title: '100% genuine parts only',
    description: 'Direct from authorized distributors with certificates',
  },
  {
    title: '30% below dealer prices',
    description: 'Save thousands on every repair',
  },
  {
    title: 'Wrong part? Free exchange',
    description: 'We guarantee perfect fitment or money back',
  },
];

/**
 * Problem/Solution comparison section
 */
export const ProblemSolutionSection = memo(function ProblemSolutionSection() {
  const handleCTAClick = () => {
    window.open(
      `https://wa.me/${CONTACT_INFO.WHATSAPP}?text=I want reliable parts service like your other 500+ customers!`,
      '_blank'
    );
  };

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center md:mb-12">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl">
              😤 Tired of These Common Problems?
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Problems */}
            <div className="space-y-4 md:space-y-6">
              <h3 className="mb-4 text-xl font-bold text-red-600 md:mb-6 md:text-2xl">
                ❌ What Other Suppliers Do:
              </h3>
              <div className="space-y-3 md:space-y-4">
                {PROBLEMS.map((problem, index) => (
                  <div key={index} className="flex items-start space-x-3 rounded-lg bg-red-50 p-3 md:p-4">
                    <AlertTriangle className="mt-1 h-5 w-5 flex-shrink-0 text-red-500 md:h-6 md:w-6" />
                    <div>
                      <h4 className="font-semibold text-red-800">{problem.title}</h4>
                      <p className="text-sm text-red-700">{problem.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Solutions */}
            <div className="space-y-4 md:space-y-6">
              <h3 className="mb-4 text-xl font-bold text-green-600 md:mb-6 md:text-2xl">
                ✅ What A.M.O Does Different:
              </h3>
              <div className="space-y-3 md:space-y-4">
                {SOLUTIONS.map((solution, index) => (
                  <div key={index} className="flex items-start space-x-3 rounded-lg bg-green-50 p-3 md:p-4">
                    <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-500 md:h-6 md:w-6" />
                    <div>
                      <h4 className="font-semibold text-green-800">{solution.title}</h4>
                      <p className="text-sm text-green-700">{solution.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 text-center md:mt-12">
            <div className="mx-auto max-w-2xl rounded-lg border-2 border-yellow-400 bg-yellow-100 p-4 md:p-6">
              <h3 className="mb-2 text-lg font-bold text-yellow-800 md:mb-3 md:text-xl">
                💡 Smart Choice: Join 500+ Satisfied Customers
              </h3>
              <p className="mb-3 text-sm text-yellow-700 md:mb-4 md:text-base">
                Don't waste time with unreliable suppliers. Get your parts fast, genuine, and affordable.
              </p>
              <Button
                size="lg"
                className="bg-yellow-600 font-bold text-white hover:bg-yellow-700"
                onClick={handleCTAClick}
              >
                🚀 Join the Smart Customers
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

