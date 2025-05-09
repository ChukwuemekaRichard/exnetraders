import Image from "next/image";
import { getDictionary } from "@/app/i18n";

export default async function About({ params }) {
  // Await params first, then extract locale
  const awaitedParams = await params;
  const locale = awaitedParams?.locale || "en";
  const dictionary = await getDictionary(locale);

  return (
    <div className="pt-28 pb-16 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container-custom mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-white mb-8">
            {dictionary.about.title}
          </h1>

          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">
              {dictionary.about.ourStory.title}
            </h2>
            <p className="text-gray-300 mb-4">
              {dictionary.about.ourStory.part1}
            </p>
            <p className="text-gray-300">{dictionary.about.ourStory.part2}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-white mb-3">
                {dictionary.about.mission.title}
              </h3>
              <p className="text-gray-300">
                {dictionary.about.mission.description}
              </p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-white mb-3">
                {dictionary.about.values.title}
              </h3>
              <p className="text-gray-300">
                {dictionary.about.values.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
