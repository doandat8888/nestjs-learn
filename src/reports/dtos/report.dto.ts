import { Expose, Transform } from "class-transformer";

export class ReportDto {
    @Expose()
    id: number;

    @Expose()
    price: number;

    @Expose()
    make: string;

    @Expose()
    model: string;

    @Expose()
    year: number;

    @Expose()
    lng: number;

    @Expose()
    lat: number;

    @Expose()
    mileage: number;

    @Expose()
    approved: boolean;

    @Transform(({ obj }) => obj.user.id) //Because the response contain 'user' obj, we transform this obj's id to userId column
    @Expose()
    userId: number;
}