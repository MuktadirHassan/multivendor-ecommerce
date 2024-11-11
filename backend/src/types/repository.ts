export interface BaseRepository<T> {
  findById(id: number): Promise<T | null>;
  findAll(params?: any): Promise<T[]>;
  create(data: Omit<T, "id">): Promise<T>;
  update(id: number, data: Partial<T>): Promise<T>;
  delete(id: number): Promise<boolean>;
}
