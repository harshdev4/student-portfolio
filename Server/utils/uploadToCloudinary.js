import cloudinary from "../config/cloudinary.config.js";

const uploadToCloudinary = async (file) => {
    const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "student-portfolio" },
            (err, res) => err ? reject(err) : resolve(res)
        );

        stream.end(file.buffer);
    });

    return result;
}

export default uploadToCloudinary;