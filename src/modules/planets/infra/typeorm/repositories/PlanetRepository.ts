import {
  ICreatePlanetDTO,
  IDeletePlanetResponseDTO,
  IListPlanetDTO,
} from '@modules/planets/dtos/IPlanetDTO';
import IPlanetRepository from '@modules/planets/repositories/IPlanetRepostiroy';
import Planet from '@modules/planets/infra/typeorm/entities/Planet';
import { getMongoRepository, MongoRepository } from 'typeorm';
import { ObjectId } from 'bson';

export default class PlanetRespository implements IPlanetRepository {
  private ormRepository: MongoRepository<Planet>;

  constructor() {
    this.ormRepository = getMongoRepository(Planet);
  }

  public async create(data: ICreatePlanetDTO): Promise<Planet> {
    const planet = this.ormRepository.create(data);
    await this.ormRepository.save(planet);

    return planet;
  }

  public async all(params: IListPlanetDTO): Promise<Planet[]> {
    const { climate, terrain, films, name, id } = params;
    const param: Object = {};

    if (climate) {
      const climateSearch = { climate };
      Object.assign(param, climateSearch);
    }
    if (terrain) {
      const terrainSearch = { terrain };
      Object.assign(param, terrainSearch);
    }
    if (name) {
      const nameSearch = { name };
      Object.assign(param, nameSearch);
    }
    if (films) {
      const filmsSearch = { films };
      Object.assign(param, filmsSearch);
    }
    if (id) {
      const idSearch = { _id: new ObjectId(id) };
      Object.assign(param, idSearch);
    }

    const planets = await this.ormRepository.find({
      where: param,
      order: { name: 'ASC' },
    });

    return planets;
  }

  public async delete(id: string): Promise<IDeletePlanetResponseDTO> {
    const planetExist = await this.ormRepository.findOneOrFail({
      where: { _id: new ObjectId(id) },
    });

    await this.ormRepository.delete(planetExist);

    return {
      planetExist,
      message: `Planet ${planetExist.name} successfully deleted`,
    };
  }

  public async findById(id: string): Promise<Planet | undefined> {
    return this.ormRepository.findOne({ where: { _id: new ObjectId(id) } });
  }
}
