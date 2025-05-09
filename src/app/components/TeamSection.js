"use client";

import { useState } from "react";

export default function TeamSection({ dictionary }) {
  // Team members data
  const teamMembers = [
    {
      id: 1,
      name: "Mark Wright",
      role: dictionary.team.roles.director,
      bio: dictionary.team.bios.mark,
      experience: "15+ " + dictionary.team.years,
    },
    {
      id: 2,
      name: "James Damian",
      role: dictionary.team.roles.investment,
      bio: dictionary.team.bios.james,
      experience: "12+ " + dictionary.team.years,
    },
    {
      id: 3,
      name: "Angel Jessica",
      role: dictionary.team.roles.analyst,
      bio: dictionary.team.bios.angel,
      experience: "8+ " + dictionary.team.years,
    },
    {
      id: 4,
      name: "Musa Habibi",
      role: dictionary.team.roles.risk,
      bio: dictionary.team.bios.musa,
      experience: "10+ " + dictionary.team.years,
    },
  ];

  const [activeTeamMember, setActiveTeamMember] = useState(teamMembers[0]);

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {dictionary.team.title}
          </h2>
          <div className="w-24 h-1 bg-blue-700 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-3xl mx-auto">
            {dictionary.team.subtitle}
          </p>
          <p className="text-gray-700 font-semibold mt-4">
            {dictionary.team.established}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Team Overview */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">
              {dictionary.team.collective.title}
            </h3>
            <p className="text-gray-600 mb-6">
              {dictionary.team.collective.description}
            </p>

            <div className="space-y-4">
              <div className="flex items-center">
                <div className="bg-blue-700 p-2 rounded-full mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-gray-700">
                  {dictionary.team.expertise[0]}
                </span>
              </div>
              <div className="flex items-center">
                <div className="bg-blue-700 p-2 rounded-full mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-gray-700">
                  {dictionary.team.expertise[1]}
                </span>
              </div>
              <div className="flex items-center">
                <div className="bg-blue-700 p-2 rounded-full mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-gray-700">
                  {dictionary.team.expertise[2]}
                </span>
              </div>
            </div>
          </div>

          {/* Team Member Showcase */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-blue-800 p-4">
              <div className="flex justify-between">
                {teamMembers.map((member) => (
                  <button
                    key={member.id}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                      activeTeamMember.id === member.id
                        ? "bg-white text-blue-800"
                        : "bg-blue-900 text-white hover:bg-blue-700"
                    }`}
                    onClick={() => setActiveTeamMember(member)}
                  >
                    {member.name.charAt(0)}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-700 to-blue-900 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {activeTeamMember.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="ml-4">
                  <h4 className="text-xl font-bold text-gray-800">
                    {activeTeamMember.name}
                  </h4>
                  <p className="text-blue-700">{activeTeamMember.role}</p>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{activeTeamMember.bio}</p>

              <div className="flex items-center text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-blue-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{activeTeamMember.experience}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 p-8 bg-blue-100 rounded-xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {dictionary.team.join.title}
              </h3>
              <p className="text-gray-600">
                {dictionary.team.join.description}
              </p>
            </div>
            <a
              href="https://t.me/exnettraderss"
              className="btn-primary px-8 py-3 font-semibold rounded-lg inline-block"
            >
              {dictionary.team.join.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
