import { FaLinkedin, FaMedium } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="text-center py-16">
      <h3 className="text-xl font-bold mb-2 dark:text-gray-100">
        Let&apos;s connect
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Get in touch for opportunities or just to say hi! 👋
      </p>
      <div className="flex justify-center gap-10 text-3xl mb-6">
        <Link
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-500 dark:hover:text-gray-400 transition-colors duration-300"
        >
          <FaLinkedin />
        </Link>
        <Link
          href="mailto:youremail@example.com"
          className="hover:text-gray-500 dark:hover:text-gray-400 transition-colors duration-300"
        >
          <HiOutlineMail />
        </Link>
        <Link
          href="https://medium.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-500 dark:hover:text-gray-400 transition-colors duration-300"
        >
          <FaMedium />
        </Link>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        © 2025 Nanto. All rights reserved.
      </p>
    </footer>
  );
}
