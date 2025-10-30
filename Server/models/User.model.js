import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        profile: {
            type: String,
            default: '',
        },
        name: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
        },
        about: {
            type: String,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        }, 
        college: {
            type: String,
            trim: true,
        },
        skills: {
            type: [{
                name: String,
                class: String
            }],
            default: []
        },
        achievements: {
            type: [String],
            default: [],
        },
        projects: {
            type: [{
                projectImage:{
                    type: String
                },
                projectTitle:{
                    type: String,
                    trim: true
                },
                projectLink:{
                    type: String
                }
            }],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model('User', userSchema);

export default User;
