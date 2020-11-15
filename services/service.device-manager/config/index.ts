import scenes from "./scenes.json";

type StateID = string;

interface Scene {
  name: string;
  devices?: {
    [DeviceID: string]: StateID;
  };
  groups?: {
    [GroupID: string]: StateID;
  };
  states?: {
    [StateID: string]: {
      on?: boolean;
      bri?: number;
      ct?: number;
    };
  };
}

interface SceneConfig {
  [SceneID: string]: Scene | undefined;
}

export default {
  scenes(): SceneConfig {
    return scenes;
  },
};
