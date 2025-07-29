// app/components/WorkSection.tsx
import Image from "next/image";

export default function WorkSection() {
  return (
    <section className="mt-20">
      <h3 className="text-sm tracking-widest text-gray-500 dark:text-gray-400 mb-6">
        MY RECENT WORK
      </h3>

      {/* Card 1 */}
      <div className="mb-8 bg-gradient-to-r from-blue-300 to-blue-400 rounded-xl overflow-hidden flex flex-col md:flex-row items-center shadow-md hover:shadow-lg transition-transform hover:scale-[1.02]">
        <div className="w-full md:w-1/2">
          <Image
            src="/images/divatel.jpg"
            alt="Rokt platform"
            width={600}
            height={400}
            className="object-cover"
          />
        </div>
        <div className="w-full md:w-1/2 p-8 text-center md:text-left">
          <h4 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Rokt platform
          </h4>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            Redesigning the ads management experience.
          </p>
        </div>
      </div>

      {/* Card 2 */}
      <div className="bg-gradient-to-r from-yellow-200 to-yellow-300 rounded-xl overflow-hidden flex flex-col md:flex-row items-center shadow-md hover:shadow-lg transition-transform hover:scale-[1.02]">
        <div className="w-full md:w-1/2">
          <Image
            src="/images/caterine.png"
            alt="Leaf"
            width={600}
            height={400}
            className="object-cover"
          />
        </div>
        <div className="w-full md:w-1/2 p-8 text-center md:text-left">
          <h4 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Leaf
          </h4>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            Measuring your carbon footprint on the world.
          </p>
        </div>
      </div>
    </section>
  );
}
