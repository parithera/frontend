import { IsNotEmpty } from 'class-validator';

export enum FileType {
    META = 'META',
    OUT = 'OUT'
}

export class ProjectFile {
    @IsNotEmpty()
    id!: string;

    @IsNotEmpty()
    added_on!: Date;

    @IsNotEmpty()
    type!: string;

    @IsNotEmpty()
    name!: string;

    // @ManyToOne(() => Organization, (organization) => organization.files)
    // @ApiProperty()
    // @Expose()
    // organizations: Relation<Organization[]>;

    // @ManyToOne(() => Project, (project) => project.files)
    // @ApiProperty()
    // @Expose()
    // projects: Relation<Project[]>;

    // @ManyToOne(() => User, (user) => user.files_imported)
    // @ApiProperty()
    // @Expose()
    // added_by: Relation<User>;
}
