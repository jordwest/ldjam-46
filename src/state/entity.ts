export type EntityId = number & { __entityId: never };

export type Entities = {
  nextId: EntityId;
  player: EntityId;
  cursor: EntityId;
};
