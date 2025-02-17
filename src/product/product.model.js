import { Schema, model } from "mongoose";

const ProductSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            unique: true,
            trim: true,
            maxLength: [100, "Product name cannot exceed 100 characters"],
        },
        description: {
            type: String,
            trim: true,
            maxLength: [300, "Description cannot exceed 300 characters"],
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0.01, "Price must be greater than 0"],
        },
        stock: {
            type: Number,
            required: [true, "Stock is required"],
            min: [0, "Stock cannot be negative"],
            default: 0,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Category is required"],
        },
        status: {
            type: Boolean,
            default: true,
        },
        bestSeller: {
            type: Boolean,
            default: false,
        },
        /*image: {
            type: String,
            trim: true,
            match: [
                .matches(/^(https?:\/\/|\/)?([\w\-./]+)\.(?:png|jpg|jpeg|gif|svg)$/i)
                "Invalid image URL format",
            ],
        },*/
    },
    {
        timestamps: true,
    }
);

ProductSchema.methods.toJSON = function () {
    const { __v, ...product } = this.toObject();
    return product;
};

export default model("Product", ProductSchema);
