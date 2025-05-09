import { getDictionary } from "@/app/i18n";

export default async function Testimonials({ params }) {
  // Await params first, then extract locale
  const awaitedParams = await params;
  const locale = awaitedParams?.locale || "en";
  const dictionary = await getDictionary(locale);

  return (
    <div className="pt-28 pb-16 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container-custom mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-white mb-12">
          {dictionary.testimonials.title}
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {dictionary.testimonials.items.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                  {testimonial.name.charAt(0)}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-white">
                    {testimonial.name}
                  </h3>
                  <p className="text-gray-400">{testimonial.position}</p>
                </div>
              </div>
              <p className="text-gray-300 italic">{testimonial.quote}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
