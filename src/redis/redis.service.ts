import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

@Injectable()
export class RedisService {
  private logger = new Logger(RedisService.name);
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    const storeType = this.cacheManager.stores;
    console.log(storeType);
  }

  async set(key: string, value: unknown): Promise<void> {
    try {
      const token = await this.cacheManager.set(key, value);
      this.logger.log(`token is: ${token}`);
    } catch (error) {
      this.logger.error(`Failed to set key: ${key}`, error);
    }
    throw new InternalServerErrorException();
  }

  async get<T>(key: string): Promise<T | undefined> {
    try {
      const data = await this.cacheManager.get<string>(key);
      if (!data) return undefined;
      try {
        return JSON.parse(data) as T;
      } catch {
        return data as unknown as T;
      }
    } catch (error) {
      this.logger.error(`Failed to get key: ${key}`, error);
      throw new InternalServerErrorException();
    }
  }
}
