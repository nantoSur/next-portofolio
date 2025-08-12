"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { HiChevronDown } from "react-icons/hi";
import { getWorkExperiences } from "@/lib/actions/work-experience";
import type { WorkExperience } from "@/lib/types/work-experience";

export default function ExperienceSection() {
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const formatMonthYear = (date?: string | null) => {
    if (!date) return "";
    const d = new Date(date);
    return isNaN(d.getTime())
      ? ""
      : d.toLocaleDateString("id-ID", { month: "short", year: "numeric" });
  };

  useEffect(() => {
    (async () => {
      const { data } = await getWorkExperiences({ limit: 10 });
      setExperiences(data);
    })();
  }, []);

  const toggleCard = (index: number) =>
    setOpenIndex(openIndex === index ? null : index);

  return (
    <section id="work" className="mt-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center dark:text-gray-100">
          Work Experience
        </h2>

        <div className="relative">
          <div className="absolute left-6 top-0 w-[2px] bg-gray-200 dark:bg-gray-600 h-full" />

          <div className="flex flex-col gap-8">
            {experiences.map((exp, index) => (
              <div
                key={`${exp.id}-${index}`}
                className="relative flex items-start gap-8"
              >
                {/* Timeline circle */}
                <div className="z-10 flex-shrink-0">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-gray-400 dark:border-gray-300 bg-white dark:bg-gray-800 shadow-md">
                    {exp.logoUrl && (
                      <Image
                        src={exp.logoUrl}
                        alt={exp.company}
                        width={32}
                        height={32}
                        className="w-8 h-8 object-contain rounded-full"
                      />
                    )}
                  </div>
                </div>

                {/* Card */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-6 flex-1 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:-translate-y-1">
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
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {formatMonthYear(exp.startDate)} -{" "}
                        {exp.endDate ? formatMonthYear(exp.endDate) : "Present"}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleCard(index)}
                      className="flex items-center gap-2 text-sm border border-gray-300 dark:border-gray-600 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-800/40 transition"
                    >
                      {formatMonthYear(exp.startDate)}
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
                      {exp.summary?.length ? (
                        <>
                          <h4 className="font-semibold text-gray-700 dark:text-gray-200">
                            Summary
                          </h4>
                          <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 text-sm mt-1 space-y-1">
                            {exp.summary.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </>
                      ) : null}

                      {exp.achievements?.length ? (
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
                      ) : null}

                      {exp.skills?.length ? (
                        <div className="mt-4">
                          <h4 className="font-semibold text-gray-700 dark:text-gray-200">
                            Skills
                          </h4>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {exp.skills.map((skill) => (
                              <span
                                key={skill.id}
                                className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs px-3 py-1 rounded-full"
                              >
                                {skill.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : null}
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
