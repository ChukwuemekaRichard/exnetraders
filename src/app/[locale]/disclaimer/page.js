import { getDictionary } from "@/app/i18n";

export default async function Disclaimer({ params }) {
  const locale = params?.locale || "en";
  const dictionary = await getDictionary(locale);

  return (
    <div className="pt-28 pb-16 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen">
      <div className="container-custom mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-white mb-8">
            {dictionary.disclaimer.title}
          </h1>

          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl">
            <div className="space-y-4 text-gray-300">
              {dictionary.disclaimer.sections.map((section, index) => (
                <div key={index}>
                  {section.title && (
                    <h2 className="text-2xl font-semibold text-white mb-3">
                      {section.title}
                    </h2>
                  )}
                  {Array.isArray(section.content) ? (
                    <ul className="list-disc pl-5 space-y-2">
                      {section.content.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{section.content}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}