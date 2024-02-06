// import { Schema, SchemaDefinition, SchemaOptions } from "mongoose";

// class BaseSchema extends Schema {
//   constructor(schemaDefinition?: SchemaDefinition, options?: SchemaOptions) {
//     const baseSchemaDefinition: SchemaDefinition = {
//       ...schemaDefinition,
//       createdAt: { type: Date, default: Date.now },
//       updatedAt: { type: Date, default: Date.now },
//     };

//     const schemaOptions: SchemaOptions = {
//       ...(options || {}),
//       timestamps: true,
//     };
//     super(baseSchemaDefinition, {...options, timestamps: true});
//   }
// }
import mongoose, { Schema, SchemaOptions, model } from 'mongoose';

interface BaseModel extends Document {
    createdAt: Date;
    updatedAt: Date;
}
  
function createBaseSchema(fields: mongoose.SchemaDefinition, options?: SchemaOptions): Schema {
    const baseFields: mongoose.SchemaDefinition = {
        ...fields,
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    };
    return new mongoose.Schema(baseFields, { ...options, timestamps: true });
}

export function createModel<T>(name: string, schema: Schema<T & BaseModel>) {
    return model<T & BaseModel>(name, schema);
}
  
export default createBaseSchema;