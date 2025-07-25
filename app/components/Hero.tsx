export default function Hero() {
  return (
    <section className="w-full">
      <div className="max-w-5xl mx-auto px-6 mt-16 text-left">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Hi, I&apos;m{" "}
          <span className="px-1 bg-gray-400 dark:bg-gray-600 hover:bg-transparent hover:border hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors duration-300">
            Nanto
          </span>
        </h1>

        <h2 className="text-2xl md:text-3xl mb-6 text-gray-800 dark:text-gray-200">
          I <span className="font-outline">design, sing, paint</span> &amp;{" "}
          <span className="font-bold">write.</span>
        </h2>

        <p className="max-w-2xl text-gray-600 dark:text-gray-300 leading-relaxed">
          I&apos;m a product designer based in Sydney, Australia with experience
          in delivering end-to-end UX/UI design for software products. I&apos;m
          passionate about improving the lives of others through design and am
          constantly looking to learn new things everyday.
        </p>
      </div>
    </section>
  );
}
