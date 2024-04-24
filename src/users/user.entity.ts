//import { Exclude } from "class-transformer";
import { IsEmail } from "class-validator";
import { AfterInsert, AfterRemove, AfterUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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