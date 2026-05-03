# Flood Damage Assessment App

## Features

- Capture latitude & longitude
- Store farm address
- Farm condition (Good / Moderate / Bad)
- Chicken count
- Upload images (AWS S3)
- View all records
- Open location in Google Mapsx
- Mobile-friendly UI

---

## Assumptions Made

- Internet is unavailable in the field but available later
- Data is entered manually or via device GPS
- Images are uploaded when connectivity is available
- No authentication required for this assignment
- Each farm can have multiple images
- Farm condition is limited to: Good / Moderate / Bad
- Data volume is relatively small

---

## Architecture & Design Decisions

- **Layered Architecture**  
  Controller → Service → Repository → Database  
  Keeps code organized and maintainable.

- **DTO Pattern**  
  Separate models for input and output.  
  Prevents exposing database structure.

- **Repository Pattern**  
  Handles database operations.  
  Improves flexibility and testability.

- **Service Layer**  
  Contains business logic and validation.  
  Keeps controllers clean.

- **Entity Framework Core**  
  Used for database interaction and relationships.

- **AWS S3 Integration**  
  Stores images outside the database for scalability.

- **Mobile-Friendly UI**  
  Designed for field usage.

- **Google Maps Integration**  
  Opens farm location using coordinates.

- **Offline Consideration**  
  Can be extended using local storage / sync later.
