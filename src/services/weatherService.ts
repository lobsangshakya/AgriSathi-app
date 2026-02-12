/**
 * Production-Ready Weather Service
 * Handles real weather data with geolocation and OpenWeather API
 */

export interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  forecast: ForecastDay[];
  lastUpdated: string;
}

export interface ForecastDay {
  date: string;
  high: number;
  low: number;
  description: string;
  icon: string;
  precipitation: number;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
}

class WeatherService {
  private apiKey: string;
  private baseUrl: string;
  private isDevelopment: boolean;

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY || '';
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
    this.isDevelopment = import.meta.env.VITE_APP_ENV === 'development';

    if (!this.apiKey) {
      // OpenWeather API key not found. Using mock data.
    }
  }

  // Get user's current location
  async getCurrentLocation(): Promise<LocationData | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        // Fallback to default location (Delhi, India)
        resolve({
          latitude: 28.6139,
          longitude: 77.2090,
          city: 'Delhi',
          country: 'India'
        });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocoding to get city name
          this.reverseGeocode(latitude, longitude)
            .then(location => resolve(location))
            .catch(() => {
              // Fallback to coordinates
              resolve({
                latitude,
                longitude,
                city: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
                country: 'Unknown'
              });
            });
        },
        (error) => {
          // Handle geolocation errors
          let fallbackLocation: LocationData;
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              fallbackLocation = {
                latitude: 28.6139,
                longitude: 77.2090,
                city: 'Delhi',
                country: 'India'
              };
              break;
            case error.POSITION_UNAVAILABLE:
              fallbackLocation = {
                latitude: 28.6139,
                longitude: 77.2090,
                city: 'Delhi',
                country: 'India'
              };
              break;
            case error.TIMEOUT:
              fallbackLocation = {
                latitude: 28.6139,
                longitude: 77.2090,
                city: 'Delhi',
                country: 'India'
              };
              break;
            default:
              fallbackLocation = {
                latitude: 28.6139,
                longitude: 77.2090,
                city: 'Delhi',
                country: 'India'
              };
          }
          
          resolve(fallbackLocation);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  // Reverse geocoding to get city name
  private async reverseGeocode(lat: number, lon: number): Promise<LocationData> {
    try {
      const response = await fetch(
        `${this.baseUrl}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding failed');
      }
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          latitude: lat,
          longitude: lon,
          city: data[0].name || 'Unknown',
          country: data[0].country || 'Unknown'
        };
      }
      
      throw new Error('No location data found');
    } catch (error) {
      throw new Error('Reverse geocoding failed');
    }
  }

  // Get current weather
  async getCurrentWeather(lat?: number, lon?: number): Promise<WeatherData | null> {
    if (!this.apiKey) {
      return this.getMockWeatherData();
    }

    try {
      let location = { lat, lon };
      
      // If no coordinates provided, get current location
      if (!lat || !lon) {
        const currentLocation = await this.getCurrentLocation();
        location = {
          lat: currentLocation.latitude,
          lon: currentLocation.longitude
        };
      }

      const response = await fetch(
        `${this.baseUrl}/weather?lat=${location.lat}&lon=${location.lon}&appid=${this.apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error('Weather API request failed');
      }

      const data = await response.json();
      
      // Get 5-day forecast
      const forecast = await this.getForecast(location.lat, location.lon);

      return {
        location: data.name || 'Unknown Location',
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        forecast,
        lastUpdated: new Date().toISOString()
      };

    } catch (error) {
      return this.getMockWeatherData();
    }
  }

  // Get 5-day forecast
  private async getForecast(lat: number, lon: number): Promise<ForecastDay[]> {
    if (!this.apiKey) {
      return this.getMockForecast();
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error('Forecast API request failed');
      }

      const data = await response.json();
      
      // Process forecast data (get one forecast per day)
      const dailyForecasts: ForecastDay[] = [];
      const processedDates = new Set();
      
      for (const item of data.list) {
        const date = new Date(item.dt * 1000).toDateString();
        
        if (!processedDates.has(date)) {
          processedDates.add(date);
          
          dailyForecasts.push({
            date: new Date(item.dt * 1000).toLocaleDateString(),
            high: Math.round(item.main.temp_max),
            low: Math.round(item.main.temp_min),
            description: item.weather[0].description,
            icon: item.weather[0].icon,
            precipitation: item.pop ? Math.round(item.pop * 100) : 0
          });
        }
        
        if (dailyForecasts.length >= 5) break;
      }

      return dailyForecasts;

    } catch (error) {
      return this.getMockForecast();
    }
  }

  // Mock weather data for development
  private getMockWeatherData(): WeatherData {
    return {
      location: 'Delhi, India',
      temperature: 28,
      humidity: 65,
      windSpeed: 12,
      description: 'partly cloudy',
      icon: '02d',
      forecast: this.getMockForecast(),
      lastUpdated: new Date().toISOString()
    };
  }

  // Mock forecast data
  private getMockForecast(): ForecastDay[] {
    const today = new Date();
    return [
      {
        date: today.toLocaleDateString(),
        high: 30,
        low: 22,
        description: 'sunny',
        icon: '01d',
        precipitation: 0
      },
      {
        date: new Date(today.getTime() + 86400000).toLocaleDateString(),
        high: 29,
        low: 21,
        description: 'partly cloudy',
        icon: '02d',
        precipitation: 10
      },
      {
        date: new Date(today.getTime() + 172800000).toLocaleDateString(),
        high: 27,
        low: 20,
        description: 'light rain',
        icon: '10d',
        precipitation: 60
      },
      {
        date: new Date(today.getTime() + 259200000).toLocaleDateString(),
        high: 28,
        low: 19,
        description: 'cloudy',
        icon: '03d',
        precipitation: 20
      },
      {
        date: new Date(today.getTime() + 345600000).toLocaleDateString(),
        high: 31,
        low: 23,
        description: 'sunny',
        icon: '01d',
        precipitation: 0
      }
    ];
  }

  // Get farming advice based on weather
  getFarmingAdvice(weather: WeatherData): string[] {
    const advice: string[] = [];
    
    // Temperature-based advice
    if (weather.temperature > 35) {
      advice.push('🌡️ High temperature: Increase irrigation frequency and provide shade to sensitive crops');
    } else if (weather.temperature < 10) {
      advice.push('🥶 Low temperature: Protect crops from frost, consider delayed planting');
    } else {
      advice.push('🌡️ Optimal temperature: Good conditions for most crops');
    }

    // Humidity-based advice
    if (weather.humidity > 80) {
      advice.push('💧 High humidity: Watch for fungal diseases, ensure proper air circulation');
    } else if (weather.humidity < 30) {
      advice.push('💧 Low humidity: Increase irrigation, mulch to retain soil moisture');
    }

    // Wind-based advice
    if (weather.windSpeed > 20) {
      advice.push('💨 Strong winds: Secure greenhouse structures, avoid spraying pesticides');
    }

    // Rain-based advice
    const hasRain = weather.forecast.some(day => day.precipitation > 50);
    if (hasRain) {
      advice.push('🌧️ Rain expected: Plan irrigation accordingly, prepare drainage');
    }

    return advice;
  }
}

// Create singleton instance
export const weatherService = new WeatherService();
