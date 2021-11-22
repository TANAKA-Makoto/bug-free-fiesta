/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Ajv, { JSONSchemaType } from "ajv";
import * as ApiModels from "./@type/OAStype/model/models";
import { glob } from "glob";

import * as fs from "fs";
import { exit } from "process";
import { Z_ASCII } from "zlib";
export const ajv = new Ajv();

type ApiRobotParams = ApiModels.ElevatorParams | ApiModels.NavigationParams;
type ApiRobotSpecification =
  | ApiModels.ElevatorSpecification
  | ApiModels.NavigationSpecification;

// validate is a type guard for MyData - type is inferred from schema type
//const validate = ajv.compile(ownerParam);

const filePaths: string[] = glob.sync("raas-front-OAS/models/**/*.json");
const addSchemas = (ajv: Ajv, filePath: string): void => {
  const schema = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const id: string = filePath.replace(/raas\-front\-OAS\/models\//, "");
  console.log(id);
  ajv.addSchema(schema, id);
};
filePaths.forEach((_) => addSchemas(ajv, _));

// or, if you did not use type annotation for the schema,
// type parameter can be used to make it type guard:
// const validate = ajv.compile<MyData>(schema)
const validate = ajv.getSchema<ApiModels.FacilityParams>(
  "facilityParams.v1.json"
);
//const robo_validate = ajv.getSchema<ApiRobotParams>("robot");
//const wp_validate = ajv.getSchema<ApiModels.WaypointParams>("wp");
const data = {
  name: "string",
  countOfFloor: 0,
  floors: [
    {
      translation: { x: "1", y: "4", z: "4" },
      rotation: { roll: 1, pitch: 4, yaw: 4 },
      floorNumber: 0,
      description: "string",
      maps: [{
        "map": {
          "id": "string"
        },
        "origin": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "rotation": {
          "roll": 0,
          "pitch": 0,
          "yaw": 0
        }
      }],
    },
  ],
};
if (!validate) {
  exit(2);
}
// if (!robo_validate) {
//   exit();
// }
if (validate(data)) {
  // data is MyData here
  console.log(data.name);
} else {
  console.log(validate.errors);
}
// if (robo_validate(data)) {
//   // data is MyData here
//   console.log(data.name);
// } else {
//   console.log(robo_validate.errors);
// }
