import requests

# Google Maps API key (replace with your actual key)
API_KEY = "YOUR_API_KEY"

class GoogleMapsService:
    def __init__(self, api_key):
        self.api_key = api_key

    def geocode(self, address):
        url = f"https://maps.googleapis.com/maps/api/geocode/json?address={address}&key={self.api_key}"
        response = requests.get(url)
        return response.json()

    def get_distance_matrix(self, origins, destinations):
        url = f"https://maps.googleapis.com/maps/api/distancematrix/json?origins={origins}&destinations={destinations}&key={self.api_key}"
        response = requests.get(url)
        return response.json()

    def get_directions(self, origin, destination):
        url = f"https://maps.googleapis.com/maps/api/directions/json?origin={origin}&destination={destination}&key={self.api_key}"
        response = requests.get(url)
        return response.json()

    def generate_link(self, origin, destination):
        return f"https://www.google.com/maps/dir/?api=1&origin={origin}&destination={destination}"

# Example usage
if __name__ == '__main__':
    gmaps_service = GoogleMapsService(API_KEY)
    print(gmaps_service.geocode('1600 Amphitheatre Parkway, Mountain View, CA'))