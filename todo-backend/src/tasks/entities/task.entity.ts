import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("text")
    content: string;

    @Column({ default: false })
    done: boolean;
}
