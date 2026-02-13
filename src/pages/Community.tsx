import { Header } from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { Users, MessageCircle } from "lucide-react";

const Community = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={language === 'hindi' ? 'किसान समुदाय' : 'Farmer Community'} />

      <div className="max-w-md mx-auto p-6 flex flex-col items-center justify-center" style={{ minHeight: 'calc(100vh - 120px)' }}>
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <Users className="h-10 w-10 text-green-600" />
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">
          {language === 'hindi' ? 'जल्द आ रहा है!' : 'Coming Soon!'}
        </h2>

        <p className="text-gray-500 text-center text-sm leading-relaxed max-w-xs">
          {language === 'hindi'
            ? 'किसान समुदाय जल्द ही उपलब्ध होगा। यहां आप अपने अनुभव साझा कर सकेंगे और अन्य किसानों से सीख सकेंगे।'
            : 'The Farmer Community section will be available soon. You\'ll be able to share experiences and learn from fellow farmers.'}
        </p>

        <div className="mt-8 flex items-center gap-2 text-xs text-gray-400">
          <MessageCircle className="h-4 w-4" />
          <span>{language === 'hindi' ? 'अनुभव साझा करें • सवाल पूछें • सीखें' : 'Share • Ask • Learn'}</span>
        </div>
      </div>
    </div>
  );
};

export default Community;