import { GameState } from "~state/state";
import { Sprites } from "~config";
import { Entity } from "~logic/entity";
import { Vec2 } from "~base/vec2";

type AvailableDialogue = "ahh" | "look" | "what-was-that";
function getDialogueSprite(text: AvailableDialogue) {
  switch (text) {
    case "ahh":
      return Sprites.dialogueAhh;
    case "look":
      return Sprites.dialogueLook;
    case "what-was-that":
      return Sprites.dialogueWhatWasThat;
    default:
      throw new Error("No sprite for " + text);
  }
}

export function createDialogue(
  state: GameState,
  pos: Vec2,
  text: AvailableDialogue
) {
  const sprite = getDialogueSprite(text);
  const entityId = Entity.mintId(state.entities);
  state.components.sprite.set(entityId, {
    autoplay: {
      timePerFrame: 0.4,
    },
    sprite,
    currentAnimation: "default",
    frame: 0,
    layer: "overlay",
  });
  console.log("create dialogue");
  state.components.position.set(entityId, { x: pos.x, y: pos.y - 1 });
  state.components.lifetime.set(entityId, { max: 1, current: 1 });
  state.components.particle.set(entityId, {
    velocity: { x: 0, y: -2 },
    velocityDamp: 3,
    jitter: 0,
  });
}
