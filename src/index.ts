import Ajv, { JSONSchemaType } from "ajv";
import * as ApiModels from "./@type/OAStype/model/models";

import * as fs from "fs";
import { exit } from "process";
export const ajv = new Ajv();

type ApiRobotParams = ApiModels.ElevatorParams | ApiModels.NavigationParams;
type ApiRobotSpecification =
  | ApiModels.ElevatorSpecification
  | ApiModels.NavigationSpecification;

const schema_owner: unknown = JSON.parse(
  fs.readFileSync("raas-front-OAS/models/ownerParams.v1.json", "utf8")
);
const schema_robot: unknown = JSON.parse(
  fs.readFileSync("raas-front-OAS/models/robotParams.v1.json", "utf8")
);
const schema_wp: unknown = JSON.parse(
  fs.readFileSync("raas-front-OAS/models/waypointParams.v2.json", "utf8")
);

const ownerParam: JSONSchemaType<ApiModels.OwnerParams> = schema_owner;
//const robotParam: JSONSchemaType<ApiRobotParams> = schema_robot;
const wpParam: JSONSchemaType<ApiModels.WaypointParams> = schema_wp;
// validate is a type guard for MyData - type is inferred from schema type
//const validate = ajv.compile(ownerParam);
ajv.addSchema(ownerParam, "owner");
//ajv.addSchema(robotParam, "robot");
ajv.addSchema(wpParam, "wp");

// or, if you did not use type annotation for the schema,
// type parameter can be used to make it type guard:
// const validate = ajv.compile<MyData>(schema)
const validate = ajv.getSchema<ApiModels.OwnerParams>("owner");
//const robo_validate = ajv.getSchema<ApiRobotParams>("robot");
const wp_validate = ajv.getSchema<ApiModels.WaypointParams>("wp");
const data = {
  name: "hoge",
  owned_robot: ["abc"],
  owned_map: [""],
};
if (!validate) {
  exit();
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
