import HeroSection from "../components/HeroSection"; 
import FeaturesSection from "../components/FeaturesSection"; 
import CtaSection from "../components/CtaSection"; 
import MarketTrendsSection from "../components/MarketTrendsSection"; 
import TrustSection from "../components/TrustSection"; 
import TeamSection from "../components/TeamSection"; // Import the new TeamSection
import GrowthProjectionSection from "../components/GrowthProjectionSection"; 
import InvestmentPlansSection from "../components/InvestmentPlansSection"; 
import GlobalReachSection from "../components/GlobalReachSection"; 
import SecuritySection from "../components/SecuritySection"; 
import { getDictionary } from "../i18n";  

export default async function Home({ params }) {   
  // Await params first, then extract locale   
  const awaitedParams = await params;   
  const locale = awaitedParams?.locale || "en"; // Fallback to 'en'   
  const dictionary = await getDictionary(locale);    

  return (     
    <div className="landing-page">       
      {/* Main Hero - First impression/Hero Section */}       
      <HeroSection dictionary={dictionary} />        
      
        
      <FeaturesSection dictionary={dictionary} />        
      
            
      <MarketTrendsSection dictionary={dictionary} />        
      
           
      <TrustSection dictionary={dictionary} />        
      
            
      <TeamSection dictionary={dictionary} />        
      
      {/* Investment Plans - Monetization options */}       
      <InvestmentPlansSection dictionary={dictionary} />        
      
      {/* Growth Projection - How money grows */}       
      <GrowthProjectionSection dictionary={dictionary} />        
      
      {/* Security Section - Focus on protection */}       
      <SecuritySection dictionary={dictionary} />        
      
      {/* Global Reach - Showing authority */}       
      <GlobalReachSection dictionary={dictionary} />        
      
      {/* CTA - Final conversion point */}       
      <CtaSection dictionary={dictionary} />     
    </div>   
  ); 
}