import { IsEmail } from "class-validator";
import { Report } from "src/reports/report.entity";
import { 
    AfterInsert, AfterRemove, AfterUpdate, Column, 
    Entity, PrimaryGeneratedColumn, OneToMany 
} from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsEmail()
    email: string;

    @Column()
    // @Exclude() //Hide password in response
    password: string;  

    @Column({ default: true })
    admin: boolean;
    
    //Relation with report
    @OneToMany(() => Report, (report) => report.user)
    reports: Report[];

    @AfterInsert()
    logInsert() {
        console.log('Inserted user with id: ', this.id);
    }

    @AfterUpdate()
    logUpdate() {
        console.log('Updated user with id: ', this.id);
    }

    @AfterRemove()
    logRemove() {
        console.log('Removed user with id: ', this.id);
    }
}