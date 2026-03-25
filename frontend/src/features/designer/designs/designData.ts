export const STYLE_OPTIONS = [
    // Modern
    { value: "modern", label: "Modern" },
    { value: "contemporary", label: "Contemporary" },
    { value: "minimalist", label: "Minimalist" },
    { value: "maximalist", label: "Maximalist" },
    { value: "mid_century_modern", label: "Mid-Century Modern" },
    { value: "transitional", label: "Transitional" },
    { value: "futuristic", label: "Futuristic" },

    // Natural & Organic
    { value: "biophilic", label: "Biophilic" },
    { value: "wabi_sabi", label: "Wabi Sabi" },
    { value: "organic_modern", label: "Organic Modern" },
    { value: "rustic", label: "Rustic" },
    { value: "farmhouse", label: "Modern Farmhouse" },
    { value: "coastal", label: "Coastal" },
    { value: "tropical", label: "Tropical" },

    // European & Western
    { value: "scandinavian", label: "Scandinavian" },
    { value: "japandi", label: "Japandi" },
    { value: "french_country", label: "French Country" },
    { value: "mediterranean", label: "Mediterranean" },
    { value: "victorian", label: "Victorian" },
    { value: "art_deco", label: "Art Deco" },
    { value: "art_nouveau", label: "Art Nouveau" },
    { value: "bauhaus", label: "Bauhaus" },
    { value: "shabby_chic", label: "Shabby Chic" },
    { value: "hollywood_glam", label: "Hollywood Glam" },
    { value: "grandmillennial", label: "Grandmillennial" },

    // Industrial & Urban
    { value: "industrial", label: "Industrial" },
    { value: "loft", label: "Loft" },
    { value: "steampunk", label: "Steampunk" },
    { value: "brutalist", label: "Brutalist" },

    // Bohemian & Eclectic
    { value: "bohemian", label: "Bohemian" },
    { value: "eclectic", label: "Eclectic" },
    { value: "global_fusion", label: "Global Fusion" },
    { value: "vintage", label: "Vintage" },
    { value: "retro", label: "Retro" },

    // Asian
    { value: "japanese", label: "Japanese" },
    { value: "zen", label: "Zen" },
    { value: "balinese", label: "Balinese" },
    { value: "korean_modern", label: "Korean Modern" },

    // Indian
    { value: "kerala_traditional", label: "Kerala Traditional" },
    { value: "south_indian_traditional", label: "South Indian Traditional" },
    { value: "rajasthani", label: "Rajasthani" },
    { value: "mughal", label: "Mughal" },
    { value: "indo_modern", label: "Indo Modern" },
    { value: "indo_contemporary", label: "Indo Contemporary" },
    { value: "colonial_indian", label: "Colonial Indian" },

    // Luxury
    { value: "luxury", label: "Luxury" },
    { value: "modern_luxury", label: "Modern Luxury" },
    { value: "quiet_luxury", label: "Quiet Luxury" },
    { value: "hotel_chic", label: "Hotel Chic" },

    // Trending & Niche
    { value: "dark_academia", label: "Dark Academia" },
    { value: "cottagecore", label: "Cottagecore" },
    { value: "dopamine_decor", label: "Dopamine Decor" },
    { value: "traditional", label: "Traditional" },
    { value: "classic", label: "Classic" },
    { value: "craftsman", label: "Craftsman" },
];

export const SERVICE_OPTIONS = [
    // Design & Planning
    { value: "full_remodeling", label: "Full Room Remodeling" },
    { value: "space_optimization", label: "Space Planning & Layout" },
    { value: "concept_moodboarding", label: "Concept & Moodboard Design" },
    { value: "color_consultation", label: "Color Consultation" },
    { value: "3d_visualization", label: "3D Rendering & Visualization" },

    // Technical
    { value: "technical_drawings", label: "Technical Floor Plans & Elevations" },
    { value: "as_built_drawings", label: "As-Built Drawings" },
    { value: "electrical_lighting_plan", label: "Electrical & Lighting Layout" },
    { value: "false_ceiling_design", label: "False Ceiling & Cornice Design" },

    // Furniture & Fixtures
    { value: "furniture_layout", label: "Furniture Selection & Layout" },
    { value: "custom_furniture_design", label: "Custom Furniture Design" },
    { value: "wardrobe_storage_design", label: "Wardrobe & Storage Design" },
    { value: "kitchen_design", label: "Kitchen Design" },
    { value: "bathroom_design", label: "Bathroom Design" },

    // Materials & Sourcing
    { value: "material_finish_selection", label: "Material & Finish Specification" },
    { value: "procurement_styling", label: "Sourcing, Procurement & Styling" },

    // Execution & Handover
    { value: "site_supervision", label: "On-site Project Supervision" },
    { value: "styling_staging", label: "Final Styling & Staging" },
    { value: "post_handover_support", label: "Post Handover Support" },
];


export const SPACE_OPTIONS = [
    // Living Areas
    { value: "living_room", label: "Living Room" },
    { value: "drawing_room", label: "Drawing Room" },
    { value: "dining_room", label: "Dining Room" },
    { value: "family_room", label: "Family Room" },
    { value: "lounge", label: "Lounge" },

    // Bedrooms
    { value: "master_bedroom", label: "Master Bedroom" },
    { value: "bedroom", label: "Bedroom" },
    { value: "kids_room", label: "Kids Room" },
    { value: "guest_room", label: "Guest Room" },
    { value: "teen_room", label: "Teen Room" },

    // Kitchen
    { value: "kitchen", label: "Kitchen" },
    { value: "modular_kitchen", label: "Modular Kitchen" },
    { value: "open_kitchen", label: "Open Kitchen" },
    { value: "pantry", label: "Pantry" },
    { value: "dry_kitchen", label: "Dry Kitchen" },
    { value: "wet_kitchen", label: "Wet Kitchen" },

    // Bathrooms
    { value: "master_bathroom", label: "Master Bathroom" },
    { value: "bathroom", label: "Bathroom" },
    { value: "powder_room", label: "Powder Room" },
    { value: "washroom", label: "Washroom" },

    // Work & Study
    { value: "home_office", label: "Home Office" },
    { value: "study_room", label: "Study Room" },
    { value: "library_room", label: "Library Room" },
    { value: "reading_nook", label: "Reading Nook" },

    // Entertainment
    { value: "home_theatre", label: "Home Theatre" },
    { value: "game_room", label: "Game Room" },
    { value: "music_room", label: "Music Room" },
    { value: "bar_room", label: "Bar Room" },
    { value: "hobby_room", label: "Hobby Room" },

    // Fitness & Wellness
    { value: "home_gym", label: "Home Gym" },
    { value: "yoga_room", label: "Yoga Room" },
    { value: "meditation_room", label: "Meditation Room" },
    { value: "spa_room", label: "Spa Room" },
    { value: "sauna_room", label: "Sauna Room" },

    // Storage & Utility
    { value: "wardrobe_room", label: "Wardrobe Room" },
    { value: "walk_in_closet", label: "Walk-in Closet" },
    { value: "laundry_room", label: "Laundry Room" },
    { value: "storage_room", label: "Storage Room" },
    { value: "utility_room", label: "Utility Room" },
    { value: "linen_room", label: "Linen Room" },

    // Outdoor & Semi Outdoor
    { value: "balcony", label: "Balcony" },
    { value: "terrace", label: "Terrace" },
    { value: "rooftop", label: "Rooftop" },
    { value: "garden", label: "Garden" },
    { value: "courtyard", label: "Courtyard" },
    { value: "patio", label: "Patio" },
    { value: "deck", label: "Deck" },
    { value: "verandah", label: "Verandah" },
    { value: "sit_out", label: "Sit Out" },

    // Entry & Transition
    { value: "foyer", label: "Foyer" },
    { value: "entrance_hall", label: "Entrance Hall" },
    { value: "corridor", label: "Corridor" },
    { value: "hallway", label: "Hallway" },
    { value: "staircase", label: "Staircase" },
    { value: "mudroom", label: "Mudroom" },

    // Indian Specific
    { value: "pooja_room", label: "Pooja Room" },
    { value: "nalukettu_courtyard", label: "Nalukettu Courtyard" },
    { value: "thinnai", label: "Thinnai" },

    // Commercial - Office
    { value: "reception_area", label: "Reception Area" },
    { value: "waiting_lounge", label: "Waiting Lounge" },
    { value: "meeting_room", label: "Meeting Room" },
    { value: "conference_room", label: "Conference Room" },
    { value: "boardroom", label: "Boardroom" },
    { value: "open_work_area", label: "Open Work Area" },
    { value: "cabin", label: "Cabin" },
    { value: "pantry_area", label: "Pantry Area" },
    { value: "server_room", label: "Server Room" },
    { value: "break_room", label: "Break Room" },

    // Commercial - Retail & Hospitality
    { value: "shop_floor", label: "Shop Floor" },
    { value: "trial_room", label: "Trial Room" },
    { value: "display_area", label: "Display Area" },
    { value: "billing_counter", label: "Billing Counter" },
    { value: "hotel_lobby", label: "Hotel Lobby" },
    { value: "hotel_room", label: "Hotel Room" },
    { value: "hotel_suite", label: "Hotel Suite" },
    { value: "restaurant_dining_area", label: "Restaurant Dining Area" },
    { value: "restaurant_kitchen", label: "Restaurant Kitchen" },
    { value: "bar_area", label: "Bar Area" },
    { value: "cafe_seating", label: "Cafe Seating" },
    { value: "banquet_hall", label: "Banquet Hall" },
    { value: "event_space", label: "Event Space" },

    // Health & Wellness
    { value: "consultation_room", label: "Consultation Room" },
    { value: "treatment_room", label: "Treatment Room" },
    { value: "waiting_room", label: "Waiting Room" },
    { value: "reception", label: "Reception" },
    { value: "salon_floor", label: "Salon Floor" },
    { value: "gym_floor", label: "Gym Floor" },
    { value: "changing_room", label: "Changing Room" },
    { value: "pool_area", label: "Pool Area" },

    // Others
    { value: "basement", label: "Basement" },
    { value: "attic", label: "Attic" },
    { value: "garage", label: "Garage" },
    { value: "parking_area", label: "Parking Area" },
    { value: "other", label: "Other" },
];


export const PROPERTY_OPTIONS = [
    // Residential
    { value: "apartment", label: "Apartment" },
    { value: "villa", label: "Villa" },
    { value: "independent_house", label: "Independent House" },
    { value: "penthouse", label: "Penthouse" },
    { value: "studio_apartment", label: "Studio Apartment" },
    { value: "duplex", label: "Duplex" },
    { value: "triplex", label: "Triplex" },
    { value: "bungalow", label: "Bungalow" },
    { value: "farmhouse", label: "Farmhouse" },
    { value: "cottage", label: "Cottage" },
    { value: "row_house", label: "Row House" },
    { value: "townhouse", label: "Townhouse" },
    { value: "ancestral_home", label: "Ancestral Home" },
    { value: "heritage_home", label: "Heritage Home" },
    { value: "nalukettu", label: "Nalukettu (Traditional Kerala Home)" },

    // Commercial - Food & Beverage
    { value: "restaurant", label: "Restaurant" },
    { value: "cafe", label: "Cafe" },
    { value: "bar", label: "Bar & Lounge" },
    { value: "bakery", label: "Bakery" },
    { value: "food_court", label: "Food Court" },
    { value: "cloud_kitchen", label: "Cloud Kitchen" },
    { value: "juice_bar", label: "Juice Bar" },

    // Commercial - Retail
    { value: "retail_store", label: "Retail Store" },
    { value: "showroom", label: "Showroom" },
    { value: "boutique", label: "Boutique" },
    { value: "supermarket", label: "Supermarket" },
    { value: "jewelry_store", label: "Jewelry Store" },
    { value: "clothing_store", label: "Clothing Store" },
    { value: "electronics_store", label: "Electronics Store" },
    { value: "furniture_store", label: "Furniture Store" },
    { value: "bookstore", label: "Bookstore" },
    { value: "pharmacy", label: "Pharmacy" },

    // Commercial - Office & Workspace
    { value: "corporate_office", label: "Corporate Office" },
    { value: "coworking_space", label: "Co-working Space" },
    { value: "startup_office", label: "Startup Office" },
    { value: "home_office", label: "Home Office" },
    { value: "executive_office", label: "Executive Office" },
    { value: "government_office", label: "Government Office" },

    // Hospitality
    { value: "hotel", label: "Hotel" },
    { value: "boutique_hotel", label: "Boutique Hotel" },
    { value: "resort", label: "Resort" },
    { value: "service_apartment", label: "Service Apartment" },
    { value: "hostel", label: "Hostel" },
    { value: "homestay", label: "Homestay" },
    { value: "airbnb", label: "Airbnb / Vacation Rental" },
    { value: "guest_house", label: "Guest House" },

    // Health & Wellness
    { value: "gym", label: "Gym & Fitness Center" },
    { value: "yoga_studio", label: "Yoga Studio" },
    { value: "spa", label: "Spa & Wellness Center" },
    { value: "salon", label: "Salon & Beauty Parlour" },
    { value: "barbershop", label: "Barbershop" },
    { value: "clinic", label: "Clinic" },
    { value: "dental_clinic", label: "Dental Clinic" },
    { value: "hospital", label: "Hospital" },
    { value: "diagnostic_center", label: "Diagnostic Center" },
    { value: "meditation_center", label: "Meditation Center" },

    // Education
    { value: "school", label: "School" },
    { value: "college", label: "College" },
    { value: "coaching_center", label: "Coaching Center" },
    { value: "daycare", label: "Daycare & Creche" },
    { value: "library", label: "Library" },
    { value: "training_center", label: "Training Center" },

    // Events & Entertainment
    { value: "banquet_hall", label: "Banquet Hall" },
    { value: "event_space", label: "Event Space" },
    { value: "wedding_venue", label: "Wedding Venue" },
    { value: "conference_hall", label: "Conference Hall" },
    { value: "auditorium", label: "Auditorium" },
    { value: "cinema", label: "Cinema & Theatre" },
    { value: "gaming_zone", label: "Gaming Zone" },
    { value: "club", label: "Club & Nightclub" },

    // Religious
    { value: "temple", label: "Temple" },
    { value: "church", label: "Church" },
    { value: "mosque", label: "Mosque" },
    { value: "prayer_hall", label: "Prayer Hall" },

    // Industrial & Utility
    { value: "warehouse", label: "Warehouse" },
    { value: "factory", label: "Factory" },
    { value: "workshop", label: "Workshop" },

    // Others
    { value: "museum", label: "Museum & Gallery" },
    { value: "photography_studio", label: "Photography Studio" },
    { value: "recording_studio", label: "Recording Studio" },
    { value: "sports_facility", label: "Sports Facility" },
    { value: "swimming_pool", label: "Swimming Pool Area" },
    { value: "rooftop", label: "Rooftop Space" },
    { value: "other", label: "Other" },
];