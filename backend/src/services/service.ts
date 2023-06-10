import { FindOptions, Model } from "sequelize";
import { getPagingOptions } from "../helpers";

type Constructor<T> = new (...args: any[]) => T;

type ModelType<T extends Model<T>> = Constructor<T> & typeof Model;

export abstract class IRepository<T extends Model> {
  constructor(protected model: ModelType<T>) {}

  get(id: string, options?: any): Promise<T | null> {
    return this.model.findByPk<T>(id, options);
  }

  getAll(options?: any): Promise<T[] | null> {
    return this.model.findAll<T>(options);
  }

  getPaged(
    page: any,
    size: any,
    options?: any
  ): Promise<{ rows: T[]; count: any } | null> {
    const pagingOptions = getPagingOptions(page - 1, size, options);
    return this.model.findAndCountAll<T>(pagingOptions);
  }

  find(where: FindOptions): Promise<any> {
    return this.model.findOne(where);
  }

  create(data: T): Promise<T> {
    return this.model.create(data.dataValues);
  }

  update(id: any, data: T | any): Promise<any> {
    return this.model.update(data.dataValues, {
      where: { id },
    });
  }

  delete(id: any): Promise<number> {
    return this.model.destroy({
      where: { id },
    });
  }
}
