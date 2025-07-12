import { useLocation, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Clock, 
  Phone, 
  Mail, 
  ArrowLeft,
  Calendar
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ServiceConfirmation = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { service, cost } = location.state || { service: 'Service', cost: 0 };

  return (
    <div className="min-h-screen bg-gradient-earth">
      <Header title={t('serviceConfirmation.title') || 'Service Confirmed'} />
      
      <div className="p-4 space-y-4">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/agri-credits')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('serviceConfirmation.backToCredits') || 'Back to AgriCreds'}
        </Button>

        {/* Success Card */}
        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
          
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {t('serviceConfirmation.success') || 'Service Booked Successfully!'}
          </h2>
          
          <p className="text-muted-foreground mb-6">
            {t('serviceConfirmation.description') || 'Your service has been confirmed and our team will contact you soon.'}
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Badge variant="outline" className="text-lg px-4 py-2">
                {service}
              </Badge>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <span>{t('serviceConfirmation.cost') || 'Cost:'}</span>
              <span className="font-semibold">₹{cost} AgriCreds</span>
            </div>
          </div>
        </Card>

        {/* Next Steps */}
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">
            {t('serviceConfirmation.nextSteps') || 'What happens next?'}
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-primary font-bold text-sm">1</span>
              </div>
              <div>
                <p className="font-medium">{t('serviceConfirmation.step1.title') || 'Confirmation Email'}</p>
                <p className="text-sm text-muted-foreground">
                  {t('serviceConfirmation.step1.description') || 'You will receive a confirmation email with service details within 24 hours.'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-primary font-bold text-sm">2</span>
              </div>
              <div>
                <p className="font-medium">{t('serviceConfirmation.step2.title') || 'Expert Contact'}</p>
                <p className="text-sm text-muted-foreground">
                  {t('serviceConfirmation.step2.description') || 'Our expert will contact you to schedule the service at your convenience.'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-primary font-bold text-sm">3</span>
              </div>
              <div>
                <p className="font-medium">{t('serviceConfirmation.step3.title') || 'Service Delivery'}</p>
                <p className="text-sm text-muted-foreground">
                  {t('serviceConfirmation.step3.description') || 'The service will be delivered as per the scheduled time and date.'}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Contact Information */}
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">
            {t('serviceConfirmation.contactInfo') || 'Need help? Contact us'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">{t('serviceConfirmation.phone') || 'Phone'}</p>
                <p className="text-sm text-muted-foreground">+91 98765 43210</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">{t('serviceConfirmation.email') || 'Email'}</p>
                <p className="text-sm text-muted-foreground">support@agrisathi.com</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            className="flex-1" 
            onClick={() => navigate('/dashboard')}
          >
            {t('serviceConfirmation.goToDashboard') || 'Go to Dashboard'}
          </Button>
          
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => navigate('/agri-credits')}
          >
            {t('serviceConfirmation.bookMoreServices') || 'Book More Services'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceConfirmation; 