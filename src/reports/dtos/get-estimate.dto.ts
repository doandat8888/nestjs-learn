import { Transform } from "class-transformer";
import { IsLatitude, IsLongitude, IsNumber, IsString, Max, Min } from "class-validator";

export default class GetEstimateDto {

    @IsString()
    make: string;

    @IsString()
    model: string;

    //Because the default value of year in a query in request is formatted as string, we need to transform it to a number
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @Min(1930)
    @Max(2050)
    year: number;

    @IsLongitude()
    lng: number;

    @IsLatitude()
    lat: number;

    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    @Min(0)
    @Max(1000000)
    mileage: number;
}