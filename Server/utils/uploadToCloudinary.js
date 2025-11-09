import cloudinary from "../config/cloudinary.config.js";

const uploadToCloudinary = async (file) => {
    const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "student-portfolio" },
            (err, res) => err ? reject(err) : resolve(res)
        );

        stream.end(file.buffer);
    });

    const url = cloudinary.url(result.public_id,{
        transformation:[
            {
                quality: 'auto',
                fetch_format: 'auto',
            },
            {
                width: 1000,
                height: 1000,
                crop: 'fill',
                gravity: 'face'
            }
        ]
    })

    console.log(url);
    

    return url;
}

export default uploadToCloudinary;