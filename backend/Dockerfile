# Backend Dockerfile for .NET API
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ParkingManagement.API/ParkingManagement.API.csproj ./ParkingManagement.API/
RUN dotnet restore ./ParkingManagement.API/ParkingManagement.API.csproj

# Copy all source files and build
COPY . .
WORKDIR /src/ParkingManagement.API
RUN dotnet publish -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copy published app
COPY --from=build /app/publish .

# Expose port
EXPOSE 5000

# Set environment variables
ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Production

# Run the application
ENTRYPOINT ["dotnet", "ParkingManagement.API.dll"]

