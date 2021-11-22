/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Ajv, { JSONSchemaType } from "ajv";
import * as ApiModels from "./@type/OAStype/model/models";
import { glob } from "glob";

import * as fs from "fs";
import { exit } from "process";
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
//addSchemas(ajv, "raas-front-OAS/models/common/idObject.v1.json");

// or, if you did not use type annotation for the schema,
// type parameter can be used to make it type guard:
// const validate = ajv.compile<MyData>(schema)
const validate = ajv.getSchema<ApiModels.OwnerParams>("ownerParams.v1.json");
//const robo_validate = ajv.getSchema<ApiRobotParams>("robot");
//const wp_validate = ajv.getSchema<ApiModels.WaypointParams>("wp");
const data = {
  name: "hoge",
  owned_robot: ["abc"],
  owned_map: [""],
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
