import { getDictionary } from "@/app/i18n";

export default async function Services({ params }) {
  // Await params first, then extract locale
  const awaitedParams = await params;
  const locale = awaitedParams?.locale || "en";
  const dictionary = await getDictionary(locale);

  
  return (
    <div className="pt-28 pb-16 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container-custom mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-white mb-12">
          {dictionary.services.title}
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ServiceCard
            title={dictionary.services.crypto.title}
            description={dictionary.services.crypto.description}
            icon="💹"
          />
          <ServiceCard
            title={dictionary.services.forex.title}
            description={dictionary.services.forex.description}
            icon="🌐"
          />
          <ServiceCard
            title={dictionary.services.stocks.title}
            description={dictionary.services.stocks.description}
            icon="📊"
          />
          <ServiceCard
            title={dictionary.services.advisory.title}
            description={dictionary.services.advisory.description}
            icon="🧠"
          />
          <ServiceCard
            title={dictionary.services.education.title}
            description={dictionary.services.education.description}
            icon="📚"
          />
          <ServiceCard
            title={dictionary.services.analysis.title}
            description={dictionary.services.analysis.description}
            icon="📈"
          />
        </div>
      </div>
    </div>
  );
}

function ServiceCard({ title, description, icon }) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}
