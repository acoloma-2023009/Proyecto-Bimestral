import { Schema, model } from "mongoose";

const CategorySchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Category name is required"],
            unique: true,
            trim: true,
            maxLength: [50, "Category name cannot exceed 50 characters"],
        },
        description: {
            type: String,
            trim: true,
            maxLength: [200, "Description cannot exceed 200 characters"],
        },
        status: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

CategorySchema.methods.toJSON = function () {
    const { __v, ...category } = this.toObject();
    return category;
};

export default model("Category", CategorySchema);
