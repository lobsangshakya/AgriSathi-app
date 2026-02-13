import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { weatherService, LocationData } from '@/services/weatherService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Search, Loader2, Navigation } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';

export const LocationManager: React.FC = () => {
    const { locationData, detectLocation, setManualLocation } = useUser();
    const { t, language } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<LocationData[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isDetecting, setIsDetecting] = useState(false);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.length >= 3) {
                setIsSearching(true);
                try {
                    const results = await weatherService.searchCity(searchQuery);
                    setSearchResults(results);
                } catch (error) {
                    console.error('Search failed:', error);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleDetectLocation = async () => {
        setIsDetecting(true);
        const success = await detectLocation();
        setIsDetecting(false);
        if (success) {
            setIsOpen(false);
        }
    };

    const handleSelectLocation = (location: LocationData) => {
        setManualLocation(
            location.latitude,
            location.longitude,
            `${location.city}, ${location.state ? location.state + ', ' : ''}${location.country}`
        );
        setIsOpen(false);
        setSearchQuery('');
    };

    // Format location for display
    const displayLocation = locationData?.address ||
        (locationData ? `${locationData.latitude.toFixed(2)}, ${locationData.longitude.toFixed(2)}` : t('location.select') || 'Select Location');

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="max-w-[150px] truncate text-xs sm:text-sm">
                        {displayLocation}
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t('location.title') || 'Select Location'}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Current Location Button */}
                    <Button
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2"
                        onClick={handleDetectLocation}
                        disabled={isDetecting}
                    >
                        {isDetecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
                        {t('location.useCurrent') || 'Use Current Location'}
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                {t('common.or') || 'Or'}
                            </span>
                        </div>
                    </div>

                    {/* Search Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">{t('location.searchCity') || 'Search City'}</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder={t('location.searchPlaceholder') || 'Enter city name...'}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                            {isSearching && (
                                <div className="absolute right-3 top-3">
                                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Search Results */}
                    {searchResults.length > 0 && (
                        <div className="max-h-[200px] overflow-y-auto border rounded-md divide-y">
                            {searchResults.map((result, index) => (
                                <button
                                    key={`${result.latitude}-${result.longitude}-${index}`}
                                    className="w-full px-4 py-2 text-left hover:bg-muted/50 transition-colors flex flex-col"
                                    onClick={() => handleSelectLocation(result)}
                                >
                                    <span className="font-medium text-sm">{result.city}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {result.state ? `${result.state}, ` : ''}{result.country}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}

                    {searchQuery.length >= 3 && !isSearching && searchResults.length === 0 && (
                        <p className="text-sm text-center text-muted-foreground py-2">
                            {t('location.noResults') || 'No cities found'}
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
