export class Farm {
  constructor({
    latitude,
    longitude,
    address,
    condition,
    chickenCount,
    photos,
  }) {
    this.id = crypto.randomUUID();
    this.latitude = latitude;
    this.longitude = longitude;
    this.address = address;
    this.condition = condition;
    this.chickenCount = chickenCount;
    this.photos = photos || [];
    this.status = "pending";
    this.createdAt = new Date().toISOString();
  }
}
