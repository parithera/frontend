import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
export class License {
    @IsNotEmpty()
    deps_using_license!: Array<string>;

    @IsString()
    description!: string;

    @IsString()
    id!: string;

    @IsString()
    license_category!: string;

    @IsBoolean()
    license_compliance_violation!: boolean;

    license_properties!: {
        permissions: Array<string>;
        conditions: Array<string>;
        limitations: Array<string>;
        usage: string;
    };

    @IsString()
    name!: string;

    references!: Array<string>;

    unable_to_infer!: boolean;

    _key!: string;
}
