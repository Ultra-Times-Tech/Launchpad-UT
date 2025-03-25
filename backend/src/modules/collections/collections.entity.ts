import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm'

@Entity('collections')
export class CollectionsEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({type: 'varchar', length: 255})
  name: string

  @Column({type: 'int', default: 0})
  state: number

  @Column({type: 'datetime', nullable: true})
  publish_up: Date | null

  @Column({type: 'datetime', nullable: true})
  publish_down: Date | null

  @Column({type: 'datetime'})
  created: Date

  @Column({type: 'datetime', nullable: true})
  modified: Date | null

  // Méthode pour transformer l'entité en format API
  toJSON() {
    return {
      type: 'collections',
      id: this.id.toString(),
      attributes: {
        id: this.id,
        name: this.name,
        state: this.state,
        publish_up: this.publish_up ? this.publish_up.toISOString().slice(0, 19).replace('T', ' ') : null,
        publish_down: this.publish_down ? this.publish_down.toISOString().slice(0, 19).replace('T', ' ') : null,
        created: this.created.toISOString().slice(0, 19).replace('T', ' '),
        modified: this.modified ? this.modified.toISOString().slice(0, 19).replace('T', ' ') : '0000-00-00 00:00:00',
      },
    }
  }
}

// Interface pour la réponse de l'API
export interface CollectionResponse {
  links: {
    self: string
  }
  data: {
    type: string
    id: string
    attributes: {
      id: number
      name: string
      state: number
      publish_up: string | null
      publish_down: string | null
      created: string
      modified: string
    }
  }[]
  meta: {
    'total-pages': number
  }
}