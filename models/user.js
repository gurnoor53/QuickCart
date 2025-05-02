import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, { _id: false });

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    imageUrl: {
        type: String,
        required: true,
        trim: true
    },
    cartItems: {
        type: Map,
        of: cartItemSchema,
        default: new Map()
    }
}, {
    timestamps: true,
    minimize: false
});

// Create indexes for frequently queried fields
userSchema.index({ email: 1 });
userSchema.index({ _id: 1 });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;