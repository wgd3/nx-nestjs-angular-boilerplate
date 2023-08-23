/* eslint-disable @typescript-eslint/no-unused-vars */
import { ObjectLiteral, Repository } from 'typeorm';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<unknown>;
};

export const mockRepoFactory: (
  methodMocks?: Record<string, (...args: unknown[]) => unknown>,
) => MockType<Repository<ObjectLiteral>> = jest.fn((methodMocks) => ({
  findOne: jest.fn((entity, ..._args: unknown[]) => entity),
  ...methodMocks,
}));
