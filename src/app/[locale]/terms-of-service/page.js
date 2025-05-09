import { getDictionary } from "@/app/i18n";

export default async function TermsOfService({ params }) {
  // Await params first, then extract locale
  const awaitedParams = await params;
  const locale = awaitedParams?.locale || "en";
  const dictionary = await getDictionary(locale);

  return (
    <div className="pt-28 pb-16 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container-custom mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-white mb-8">
            {dictionary.tos.title}
          </h1>

          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-3">
                {dictionary.tos.introduction.title}
              </h2>
              <p className="text-gray-300">
                {dictionary.tos.introduction.description}
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-3">
                {dictionary.tos.services.title}
              </h2>
              <p className="text-gray-300">
                {dictionary.tos.services.description}
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-3">
                {dictionary.tos.risks.title}
              </h2>
              <p className="text-gray-300">
                {dictionary.tos.risks.description}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">
                {dictionary.tos.contact.title}
              </h2>
              <p className="text-gray-300">
                {dictionary.tos.contact.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
