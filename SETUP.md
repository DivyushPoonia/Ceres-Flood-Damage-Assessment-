# Setup Instructions

### Prerequisites

- Node.js (v18+)
- .NET SDK (v8)
- SQL Server
- AWS account (S3 bucket)

---

## Database Setup

Run the following SQL script:

```sql
CREATE DATABASE FarmDB;
USE FarmDB;

CREATE TABLE Farms (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Latitude FLOAT NOT NULL,
    Longitude FLOAT NOT NULL,
    Address NVARCHAR(500) NOT NULL,
    Condition NVARCHAR(50) NOT NULL,
    ChickenCount INT NOT NULL CHECK (ChickenCount > 0),
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

CREATE TABLE FarmImages (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    FarmId UNIQUEIDENTIFIER NOT NULL,
    ImageUrl NVARCHAR(MAX) NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_FarmImages_Farms
        FOREIGN KEY (FarmId)
        REFERENCES Farms(Id)
        ON DELETE CASCADE
);
```

---

## appsettings.json

Add your DB connection string & AWS S3 AccessKey and SecretKey

{
"ConnectionStrings": {
"DefaultConnection": "Server=YOUR_SERVER;Database=FarmDB;Trusted_Connection=True;"
},
"AWS": {
"AccessKey": "YOUR_ACCESS_KEY",
"SecretKey": "YOUR_SECRET_KEY",
"Region": "eu-north-1",
"BucketName": "farm-app-ceres"
}
}

---

## Required NuGet Packages

- AWSSDK.S3
- Microsoft.EntityFrameworkCore
- Microsoft.EntityFrameworkCore.SqlServer
- Microsoft.EntityFrameworkCore.Tools
- Swashbuckle.AspNetCore

---

## Frontend Setup

- cd frontend
- npm install
- npm start

---

## Backend Setup

- cd backend
- dotnet restore
- dotnet run
