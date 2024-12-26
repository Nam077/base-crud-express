import { Inject } from "typedi";
import { ObjectType } from "typeorm";

export function InjectRepository(entity: ObjectType<any>) {
  return function (
    target: any,
    propertyKey: string | symbol | undefined,
    index?: number
  ) {
    const repositoryName = `${entity.name}Repository`;
    return Inject(repositoryName)(target, propertyKey, index);
  };
}
