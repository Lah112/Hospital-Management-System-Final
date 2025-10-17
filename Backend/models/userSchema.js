import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First Name is required!"],
        minLength: [3, "First Name must contain at least 3 characters!"]
    },
    lastName: {
        type: String,
        required: [true, "Last Name is required!"],
        minLength: [2, "Last Name must contain at least 2 characters!"]
    },
    email: {
        type: String,
        required: [true, "Email is required!"],
        unique: true,
        validate: [validator.isEmail, "Please provide a valid Email!"]
    },
    phone: {
        type: String,
        required: [true, "Phone number is required!"],
        match: [/^\d{10}$/, "Phone number must contain exactly 10 digits!"],
        unique: true
    },
    aadhar: {
        type: String,
        required: [true, "Aadhar number is required!"],
        match: [/^\d{12}$/, "Aadhar number must contain exactly 12 digits!"],
        unique: true
    },
    dob: {
        type: Date,
        required: [true, "Date of Birth is required!"]
    },
    gender: {
        type: String,
        required: [true, "Gender is required!"],
        enum: ["Male", "Female", "Others"]
    },
    password: {
        type: String,
        required: [true, "Password is required!"],
        minLength: [8, "Password must contain at least 8 characters!"],
        select: false
    },
    role: {
        type: String,
        required: [true, "Role is required!"],
        enum: ["Admin", "Patient", "Doctor"]
    },
    doctrDptmnt: {
        type: String,
        required: function() { return this.role === "Doctor"; }
    },
    doctrAvatar: {
        public_id: {
            type: String,
            required: function() { return this.role === "Doctor"; }
        },
        url: {
            type: String,
            required: function() { return this.role === "Doctor"; }
        }
    }
}, { timestamps: true });

// Hash password before saving
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare password
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

export const User = mongoose.model("User", userSchema);
