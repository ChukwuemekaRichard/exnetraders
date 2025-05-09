import { getDictionary } from "@/app/i18n";

export default async function PrivacyPolicy({ params }) {
  // Await params first, then extract locale
  const awaitedParams = await params;
  const locale = awaitedParams?.locale || "en";
  const dictionary = await getDictionary(locale);
  
  return (
    <div className="pt-28 pb-16 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container-custom mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-white mb-8">
            {dictionary.privacy.title}
          </h1>

          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-3">
                {dictionary.privacy.collection.title}
              </h2>
              <p className="text-gray-300">
                {dictionary.privacy.collection.description}
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-3">
                {dictionary.privacy.use.title}
              </h2>
              <p className="text-gray-300">
                {dictionary.privacy.use.description}
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-3">
                {dictionary.privacy.security.title}
              </h2>
              <p className="text-gray-300">
                {dictionary.privacy.security.description}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">
                {dictionary.privacy.contact.title}
              </h2>
              <p className="text-gray-300">
                {dictionary.privacy.contact.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
