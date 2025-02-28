import { Schema, model } from "mongoose";

const CartSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        products: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

CartSchema.methods.toJSON = function () {
    const { __v, ...cart } = this.toObject();
    return cart;
};

export default model("Cart", CartSchema);