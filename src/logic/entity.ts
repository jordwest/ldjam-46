import { Entities, EntityId } from "~state/entity";
import { GameState } from "~state/state";

export namespace Entity {
  export function mintId(state: { nextId: EntityId }): EntityId {
    const newId = state.nextId;
    state.nextId = (state.nextId + 1) as EntityId;
    return newId;
  }

  type Deletable = Map<EntityId, unknown> & Set<EntityId>;
  export function remove(state: GameState, id: EntityId) {
    for (const key in Object.keys(state.components)) {
      // Can't be bothered come on typescript
      const component = (state.components as any)[key] as Deletable;
      component.delete(id);
    }
  }
}
