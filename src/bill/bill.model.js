import { Schema, model } from "mongoose";

const BillSchema = new Schema(
    {
        cart: {
            type: Schema.Types.ObjectId,
            ref: "Cart",
            required: true,
            unique: true
        },
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
                    required: true
                },
                price: {
                    type: Number,
                    required: true
                }
            }
        ],
        subtotal: {
            type: Number,
            required: true
        },
        discount: {
            type: Number,
            default: 0,
            min: [0, "Discount cannot be negative"]
        },
        total: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true 
    }
);

BillSchema.methods.toJSON = function () {
    const { __v, ...invoice } = this.toObject();
    return invoice;
};

export default model("Bill", BillSchema);
