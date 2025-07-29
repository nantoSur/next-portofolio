// app/components/ContactSection.tsx
"use client";

export default function ContactSection() {
  return (
    <section id="contact" className="mt-20 flex justify-center">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
          Contact Me
        </h2>

        <form className="space-y-4">
          {/* Nama */}
          <input
            type="text"
            name="name"
            placeholder="Nama"
            className="w-full border border-gray-300 dark:border-gray-600 bg-transparent px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          />

          {/* No Telpon */}
          <input
            type="text"
            name="phone"
            placeholder="No Telpon"
            className="w-full border border-gray-300 dark:border-gray-600 bg-transparent px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border border-gray-300 dark:border-gray-600 bg-transparent px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          />

          {/* Pesan */}
          <textarea
            name="message"
            placeholder="Pesan"
            rows={4}
            className="w-full border border-gray-300 dark:border-gray-600 bg-transparent px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          ></textarea>

          {/* Button Submit */}
          <button
            type="submit"
            className="w-full border border-black dark:border-white bg-black text-white py-2 rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 dark:hover:text-black transition-colors duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  );
}
