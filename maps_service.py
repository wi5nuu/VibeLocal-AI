"""
Google Maps Integration Service for VibeLocal
Provides real-time place search, directions, and location services
"""

import os
import requests
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass

GOOGLE_MAPS_API_KEY = os.getenv('GOOGLE_MAPS_API_KEY', '')

@dataclass
class PlaceResult:
    name: str
    address: str
    latitude: float
    longitude: float
    phone_number: Optional[str]
    website: Optional[str]
    rating: Optional[float]
    user_ratings_total: Optional[int]
    opening_hours: Optional[Dict]
    place_id: str
    distance_meters: int
    types: List[str]

class GoogleMapsService:
    """Service untuk integrasi Google Maps API"""
    
    BASE_URL = "https://maps.googleapis.com/maps/api"
    
    def __init__(self, api_key: str = None):
        self.api_key = api_key or GOOGLE_MAPS_API_KEY
        if not self.api_key:
            print("⚠️ Warning: GOOGLE_MAPS_API_KEY not set. Using mock mode.")
    
    def search_nearby_places(
        self, 
        lat: float, 
        lng: float, 
        keyword: str,
        radius: int = 5000,
        place_type: str = None,
        max_results: int = 5
    ) -> List[PlaceResult]:
        """
        Cari tempat terdekat berdasarkan keyword dan lokasi
        
        Args:
            lat: Latitude
            lng: Longitude
            keyword: Search keyword (e.g., "hospital", "bengkel motor", "police")
            radius: Search radius in meters (default 5km)
            place_type: Google Maps place type (e.g., "hospital", "police")
            max_results: Maximum number of results
        """
        if not self.api_key:
            return self._get_mock_places(keyword, lat, lng)
        
        try:
            # Nearby Search API
            url = f"{self.BASE_URL}/place/nearbysearch/json"
            params = {
                "location": f"{lat},{lng}",
                "radius": radius,
                "keyword": keyword,
                "key": self.api_key,
                "language": "id"
            }
            
            if place_type:
                params["type"] = place_type
            
            response = requests.get(url, params=params, timeout=10)
            data = response.json()
            
            if data.get("status") != "OK":
                print(f"Google Maps API Error: {data.get('status')}")
                return self._get_mock_places(keyword, lat, lng)
            
            places = []
            for result in data.get("results", [])[:max_results]:
                place = self._parse_place_result(result, lat, lng)
                if place:
                    places.append(place)
            
            # Sort by distance
            places.sort(key=lambda x: x.distance_meters)
            return places
            
        except Exception as e:
            print(f"Error searching places: {e}")
            return self._get_mock_places(keyword, lat, lng)
    
    def get_place_details(self, place_id: str) -> Optional[Dict]:
        """Get detailed information about a place"""
        if not self.api_key:
            return None
        
        try:
            url = f"{self.BASE_URL}/place/details/json"
            params = {
                "place_id": place_id,
                "fields": "name,formatted_address,formatted_phone_number,website,opening_hours,rating,geometry",
                "key": self.api_key,
                "language": "id"
            }
            
            response = requests.get(url, params=params, timeout=10)
            data = response.json()
            
            if data.get("status") == "OK":
                return data.get("result", {})
            return None
            
        except Exception as e:
            print(f"Error getting place details: {e}")
            return None
    
    def get_directions_url(
        self, 
        origin_lat: float, 
        origin_lng: float, 
        destination_name: str,
        destination_lat: float = None,
        destination_lng: float = None
    ) -> str:
        """Generate Google Maps directions URL"""
        origin = f"{origin_lat},{origin_lng}"
        
        if destination_lat and destination_lng:
            destination = f"{destination_lat},{destination_lng}"
        else:
            destination = destination_name.replace(" ", "+")
        
        return f"https://www.google.com/maps/dir/?api=1&origin={origin}&destination={destination}&travelmode=driving"
    
    def calculate_distance(
        self, 
        origin_lat: float, 
        origin_lng: float, 
        dest_lat: float, 
        dest_lng: float
    ) -> Tuple[int, str]:
        """Calculate distance between two points"""
        if not self.api_key:
            # Fallback: calculate straight-line distance
            distance = self._haversine_distance(origin_lat, origin_lng, dest_lat, dest_lng)
            return int(distance), self._format_distance(distance)
        
        try:
            url = f"{self.BASE_URL}/distancematrix/json"
            params = {
                "origins": f"{origin_lat},{origin_lng}",
                "destinations": f"{dest_lat},{dest_lng}",
                "mode": "driving",
                "key": self.api_key,
                "language": "id"
            }
            
            response = requests.get(url, params=params, timeout=10)
            data = response.json()
            
            if data.get("status") == "OK":
                element = data["rows"][0]["elements"][0]
                if element["status"] == "OK":
                    distance_m = element["distance"]["value"]
                    return distance_m, element["distance"]["text"]
            
            # Fallback
            distance = self._haversine_distance(origin_lat, origin_lng, dest_lat, dest_lng)
            return int(distance), self._format_distance(distance)
            
        except Exception as e:
            print(f"Error calculating distance: {e}")
            distance = self._haversine_distance(origin_lat, origin_lng, dest_lat, dest_lng)
            return int(distance), self._format_distance(distance)
    
    def _parse_place_result(self, result: Dict, user_lat: float, user_lng: float) -> Optional[PlaceResult]:
        """Parse Google Maps API result to PlaceResult"""
        try:
            geometry = result.get("geometry", {})
            location = geometry.get("location", {})
            place_lat = location.get("lat")
            place_lng = location.get("lng")
            
            if not place_lat or not place_lng:
                return None
            
            # Calculate distance
            distance_m, _ = self.calculate_distance(user_lat, user_lng, place_lat, place_lng)
            
            # Get opening hours info
            opening_hours = result.get("opening_hours", {})
            
            return PlaceResult(
                name=result.get("name", "Unknown"),
                address=result.get("vicinity", ""),
                latitude=place_lat,
                longitude=place_lng,
                phone_number=None,  # Need separate API call
                website=None,  # Need separate API call
                rating=result.get("rating"),
                user_ratings_total=result.get("user_ratings_total"),
                opening_hours=opening_hours,
                place_id=result.get("place_id", ""),
                distance_meters=distance_m,
                types=result.get("types", [])
            )
        except Exception as e:
            print(f"Error parsing place: {e}")
            return None
    
    def _haversine_distance(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculate straight-line distance between coordinates"""
        from math import radians, cos, sin, asin, sqrt
        
        lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
        dlon = lon2 - lon1
        dlat = lat2 - lat1
        a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
        c = 2 * asin(sqrt(a))
        r = 6371  # Radius of earth in kilometers
        return c * r * 1000  # Return meters
    
    def _format_distance(self, meters: float) -> str:
        """Format distance for display"""
        if meters < 1000:
            return f"{int(meters)} m"
        else:
            return f"{meters/1000:.1f} km"
    
    def _get_mock_places(self, keyword: str, lat: float, lng: float) -> List[PlaceResult]:
        """Fallback mock places when API is not available"""
        # Return empty list to indicate we need real API
        return []


# Category to search keyword mapping
CATEGORY_KEYWORDS = {
    "medical_emergency": {
        "keywords": ["hospital", "klinik 24 jam", "puskesmas", "apotek 24 jam"],
        "types": ["hospital", "pharmacy", "health"]
    },
    "vehicle_breakdown": {
        "keywords": ["bengkel motor", "bengkel mobil", "tambal ban 24 jam", "bengkel terdekat"],
        "types": ["car_repair", "car_dealer"]
    },
    "security_emergency": {
        "keywords": ["police station", "kantor polisi", "pos polisi"],
        "types": ["police"]
    },
    "fire_emergency": {
        "keywords": ["fire station", "pemadam kebakaran", "damkar"],
        "types": ["fire_station"]
    },
    "rescue_needed": {
        "keywords": ["search and rescue", "basarnas", "posko darurat"],
        "types": []
    },
    "natural_disaster": {
        "keywords": ["evacuation center", "posko pengungsian", "shelter"],
        "types": []
    }
}

def get_search_keywords(category: str) -> Dict:
    """Get search keywords for a category"""
    return CATEGORY_KEYWORDS.get(category, {
        "keywords": ["emergency services"],
        "types": []
    })
