"use client";
import { useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { HiChevronDown } from "react-icons/hi";
import Image from "next/image";

export default function TimelineAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const experiences = [
    {
      company: "UBS",
      role: "Software Development Engineer",
      location: "Mumbai, India",
      period: "2024 - Now",
      logo: "/images/caterine.png",
      summary: [
        "Contributing to the P&L dashboard used by traders and senior stakeholders.",
        "Leading the migration of the UI from Kendo to UBS's internal design system.",
        "Building a daily FX rate fetcher by integrating Databricks jobs with backend services.",
      ],
      achievements: [
        "Delivered production code within 1 month of joining.",
        "Led the migration of the UI to internal design system.",
        "Built a daily FX rate fetcher with Databricks + Java.",
      ],
      skills: ["Typescript", "React", "Databricks", "Java", "Python"],
    },
    {
      company: "Agentprod LLP",
      role: "Software Development Intern",
      location: "Bengaluru, India",
      period: "2023 - 2024",
      logo: "/images/divatel.jpg",
      summary: [
        "Worked on frontend and backend tasks in a small agile team.",
        "Improved UI components and implemented APIs.",
      ],
      achievements: [],
      skills: ["JavaScript", "React", "Node.js"],
    },
  ];

  const toggleCard = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="work" className="mt-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center dark:text-gray-100">
          Work Experience
        </h2>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-6 top-0 w-[2px] bg-gray-200 dark:bg-gray-600 h-full"></div>

          <div className="flex flex-col gap-8">
            {experiences.map((exp, index) => (
              <div key={index} className="relative flex items-start gap-8">
                {/* Timeline circle */}
                <div className="z-10 flex-shrink-0 relative">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-gray-400 dark:border-gray-300 bg-white dark:bg-gray-800 shadow-md">
                    <Image
                      src={exp.logo}
                      alt={exp.company}
                      width={32}
                      height={32}
                      className="w-8 h-8 object-contain rounded-full"
                    />
                  </div>
                </div>

                {/* Card */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-6 flex-1 transition-all duration-300">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                        {exp.role}
                      </h3>
                      <a
                        href="#"
                        className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 hover:underline"
                      >
                        {exp.company} <FaExternalLinkAlt size={12} />
                      </a>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {exp.location}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleCard(index)}
                      className="flex items-center gap-2 text-sm border border-gray-300 dark:border-gray-600 px-3 py-1 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      {exp.period}
                      <HiChevronDown
                        className={`transform transition-transform ${
                          openIndex === index ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Expandable content */}
                  {openIndex === index && (
                    <div className="mt-4 transition-all duration-300">
                      <h4 className="font-semibold text-gray-700 dark:text-gray-200">
                        Summary
                      </h4>
                      <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 text-sm mt-1 space-y-1">
                        {exp.summary.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>

                      {exp.achievements.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-semibold text-gray-700 dark:text-gray-200">
                            Key Achievements
                          </h4>
                          <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 text-sm mt-1 space-y-1">
                            {exp.achievements.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="mt-4">
                        <h4 className="font-semibold text-gray-700 dark:text-gray-200">
                          Skills
                        </h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {exp.skills.map((skill, i) => (
                            <span
                              key={i}
                              className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs px-3 py-1 rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
